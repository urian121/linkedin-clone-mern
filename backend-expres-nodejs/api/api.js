const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')
const { GoogleGenAI } = require("@google/genai");
const cloudinary = require('../conn/configCloudinary')

// Límites por tipo (MB). Videos permiten más peso que imágenes/documentos.
const MAX_IMAGEN_MB = Number(process.env.MAX_IMAGEN_MB) || 20
const MAX_VIDEO_MB = Number(process.env.MAX_VIDEO_MB) || 100

const mbABytes = (mb) => mb * 1024 * 1024

const limiteBytesParaArchivo = (mimetype = '') =>
    mimetype.startsWith('video/')
        ? mbABytes(MAX_VIDEO_MB)
        : mbABytes(MAX_IMAGEN_MB)

const MSG_PESO_LOCAL = `Archivo muy pesado (máx ${MAX_IMAGEN_MB} MB para imágenes/docs, ${MAX_VIDEO_MB} MB para videos).`
const MSG_PESO_CLOUDINARY = 'Cloudinary rechazó el archivo por su peso. Intenta comprimirlo.'

// Máximo de imágenes por publicación
const MAX_IMAGES = Number(process.env.MAX_IMAGES) || 6

// Tipos MIME permitidos. Acepta wildcards tipo "image/*" o MIME exactos.
const ALLOWED_MIME_TYPES = (process.env.ALLOWED_MIME_TYPES || 'image/*,video/*,application/pdf')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

const isMimeAllowed = (mimetype = '') =>
    ALLOWED_MIME_TYPES.some((rule) => {
        if (rule.endsWith('/*')) {
            return mimetype.startsWith(rule.slice(0, -1))
        }
        return mimetype === rule
    })

const EXT_POR_MIME = {
    'application/pdf': 'pdf',
    'application/vnd.ms-powerpoint': 'ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx'
}

const obtenerExtensionArchivo = (file) => {
    const nombre = file.originalname || ''
    const punto = nombre.lastIndexOf('.')
    if (punto >= 0) {
        const ext = nombre.slice(punto + 1).toLowerCase()
        if (ext) return ext
    }
    return EXT_POR_MIME[file.mimetype] || ''
}

/*
 * Cloudinary maneja distinto cada tipo de archivo:
 *  - 'image'  → procesa PDFs y devuelve `pages` + permite la transformación pg_N
 *               (necesario para el slider de páginas en el feed)
 *  - 'video'  → cubierto por 'auto' para mp4/webm/etc.
 *  - 'raw'    → no procesa el archivo, lo entrega tal cual (PPT/PPTX y otros)
 */
const resourceTypeParaArchivo = (mimetype = '') => {
    if (mimetype === 'application/pdf') return 'image'
    if (mimetype.startsWith('image/') || mimetype.startsWith('video/')) return 'auto'
    return 'raw'
}

// ──────────────────────────────────────────────
// MULTER (archivos en memoria, no en disco)
// ──────────────────────────────────────────────
const upload = multer({
    storage: multer.memoryStorage(),
    /* Multer usa el tope más alto; la validación fina por tipo va en /subirarchivos */
    limits: { fileSize: mbABytes(MAX_VIDEO_MB) },
    fileFilter: (req, file, cb) => {
        if (isMimeAllowed(file.mimetype)) return cb(null, true)
        const err = new Error(`Tipo de archivo no permitido: ${file.mimetype}`)
        err.code = 'INVALID_FILE_TYPE'
        cb(err)
    }
})

const manejarMulter = (req, res, next) => {
    upload.array('archivos', 10)(req, res, (err) => {
        if (!err) return next()

        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).send({ error: MSG_PESO_LOCAL })
        }

        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).send({
                error: 'Máximo 10 archivos por publicación'
            })
        }

        if (err.code === 'INVALID_FILE_TYPE') {
            return res.status(415).send({
                error: err.message
            })
        }

        return res.status(400).send({
            error: err.message || 'Archivo no válido'
        })
    })
}


// ──────────────────────────────────────────────
// ESQUEMA DE PUBLICACIONES
// ──────────────────────────────────────────────
const PublicacionSchema = new mongoose.Schema({
    idusuario: String,
    autorFoto: String,
    texto: String,

    archivos: [
        {
            url: String,
            tipo: String,
            nombre: String,
            paginas: { type: Number, default: 0 }
        }
    ],

    recomendaciones: { type: Number, default: 0 },

    fecha: { type: Date, default: Date.now }

})


// MODELO
const ModeloPublicacion = mongoose.model('publicaciones', PublicacionSchema)


// ──────────────────────────────────────────────
// HELPER: Subir un buffer a Cloudinary
// ──────────────────────────────────────────────
const subirBufferACloudinary = (buffer, options) => {

    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(

            options,

            (error, result) => {
                if (error) return reject(error)
                resolve(result)
            }

        )

        stream.end(buffer)

    })

}


// ──────────────────────────────────────────────
// SUBIR ARCHIVOS (a Cloudinary)
// ──────────────────────────────────────────────
router.post('/subirarchivos', manejarMulter, async (req, res) => {

    try {

        if (!req.files || req.files.length === 0) {
            return res.status(400).send({
                error: 'No se enviaron archivos'
            })
        }

        const totalImagenes = req.files.filter((f) => f.mimetype.startsWith('image/')).length
        if (totalImagenes > MAX_IMAGES) {
            return res.status(400).send({
                error: `Solo se permiten ${MAX_IMAGES} imágenes por publicación`
            })
        }

        const archivoPesado = req.files.find((f) => f.size > limiteBytesParaArchivo(f.mimetype))
        if (archivoPesado) {
            return res.status(413).send({ error: MSG_PESO_LOCAL })
        }

        const folder = process.env.CLOUDINARY_FOLDER || 'files_mern_stack'

        const subidas = await Promise.all(

            req.files.map((file) => {
                const ext = obtenerExtensionArchivo(file)
                const publicId = ext ? `${uuidv4()}.${ext}` : uuidv4()

                return subirBufferACloudinary(file.buffer, {
                    folder,
                    public_id: publicId,
                    resource_type: resourceTypeParaArchivo(file.mimetype),
                    timeout: 120000
                })
            })

        )

        const archivos = subidas.map((r, i) => ({
            url: r.secure_url,
            tipo: req.files[i].mimetype,
            nombre: req.files[i].originalname || '',
            paginas: r.pages || 0
        }))

        res.send({
            mensaje: 'Archivos subidos correctamente',
            archivos
        })

    } catch (err) {
        console.error('Error al subir archivos:', err)

        /* Cloudinary devuelve "File size too large" cuando el archivo
           supera el tope del plan (10 MB para imágenes en plan free). */
        const esPesoCloudinary =
            err?.message?.includes('File size too large')
            || (err?.http_code === 400 && String(err?.message || '').toLowerCase().includes('size'))

        const mensaje = esPesoCloudinary
            ? MSG_PESO_CLOUDINARY
            : 'No se pudieron subir los archivos'

        res.status(esPesoCloudinary ? 413 : 500).send({ error: mensaje })

    }

})


// ──────────────────────────────────────────────
// CREAR PUBLICACIÓN
// ──────────────────────────────────────────────
router.post('/agregarpublicacion', async (req, res) => {

    try {

        const nuevaPublicacion = new ModeloPublicacion({
            idusuario: req.body.idusuario,
            autorFoto: req.body.autorFoto || '',
            texto: req.body.texto,
            archivos: req.body.archivos || []
        })

        const doc = await nuevaPublicacion.save()

        res.send({
            mensaje: 'Publicación agregada correctamente',
            publicacion: doc
        })

    } catch (err) {

        res.status(500).send(err)

    }

})


// ──────────────────────────────────────────────
// OBTENER PUBLICACIONES (paginado)
// ──────────────────────────────────────────────
router.get('/obtenerpublicaciones', async (req, res) => {

    try {

        const pagina = Math.max(1, Number(req.query.pagina) || 1)
        const limite = Math.min(50, Math.max(1, Number(req.query.limite) || 3))
        const saltar = (pagina - 1) * limite

        const [publicaciones, total] = await Promise.all([
            ModeloPublicacion
                .find({})
                .sort({ fecha: -1 })
                .skip(saltar)
                .limit(limite),
            ModeloPublicacion.countDocuments({})
        ])

        res.send({
            publicaciones,
            pagina,
            limite,
            total,
            hayMas: saltar + publicaciones.length < total
        })

    } catch (err) {

        console.error('Error al obtener publicaciones:', err)
        res.status(500).send({
            error: 'No se pudieron obtener las publicaciones'
        })

    }

})


// ──────────────────────────────────────────────
// RECOMENDAR PUBLICACIÓN
// ──────────────────────────────────────────────
router.post('/recomendarpublicacion', async (req, res) => {

    try {

        const doc = await ModeloPublicacion.findByIdAndUpdate(

            req.body.idpublicacion,

            {
                $inc: { recomendaciones: 1 }
            },

            {
                new: true
            }

        )

        if (!doc) {
            return res.status(404).send({
                error: 'Publicación no encontrada'
            })
        }

        res.send({
            mensaje: 'Recomendación agregada',
            recomendaciones: doc.recomendaciones
        })

    } catch (err) {

        res.status(500).send(err)

    }

})

// ──────────────────────────────────────────────
// VALIDAR CONFIGURACIÓN
// ──────────────────────────────────────────────
if (!process.env.GEMINI_API_KEY) {
    throw new Error('Falta GEMINI_API_KEY en variables de entorno');
}

// ──────────────────────────────────────────────
// GOOGLE GEMINI
// ──────────────────────────────────────────────
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// ──────────────────────────────────────────────
// MEJORAR PUBLICACIÓN CON IA
// ──────────────────────────────────────────────
router.post('/mejorarpost', async (req, res) => {

    try {

        const texto = String(req.body.texto || '')
            .trim()
            .replace(/\s+/g, ' ');

        // Validaciones
        if (!texto) {
            return res.status(400).send({
                error: 'Escribe algo antes de mejorar con IA'
            });
        }

        if (texto.length > 3000) {
            return res.status(400).send({
                error: 'El texto es demasiado largo (máx. 3000 caracteres)'
            });
        }

        // Prompt optimizado
        const prompt = `
            Eres un experto en copywriting y redacción para LinkedIn.

            Haz que el inicio genere curiosidad y aumente la probabilidad de lectura completa.

            Tu tarea es mejorar publicaciones manteniendo SIEMPRE:
            - el idioma original
            - la intención original
            - el mensaje principal
            - el tono del autor

            Debes:
            - corregir ortografía y gramática
            - mejorar claridad y fluidez
            - aumentar engagement y legibilidad
            - mejorar estructura y ritmo
            - eliminar redundancias
            - hacer el texto más profesional, natural y humano
            - mejorar el impacto del inicio

            NO debes:
            - inventar información
            - cambiar el significado
            - agregar hashtags
            - agregar emojis nuevos
            - agregar saludos o despedidas
            - responder con explicaciones
            - usar markdown
            - usar títulos
            - usar listas
            - usar frases como "Aquí tienes"

            Devuelve únicamente el texto final listo para publicar en LinkedIn.

            Texto:
            ${texto}
        `;

        // Timeout de seguridad
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error('Timeout Gemini'));
            }, 15000);
        });

        // Solicitud Gemini
        const geminiPromise = ai.models.generateContent({
            model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.7,
                topP: 0.9,
                maxOutputTokens: 800
            }
        });

        const response = await Promise.race([
            geminiPromise,
            timeoutPromise
        ]);

        const textoMejorado = response.text?.trim();

        if (!textoMejorado) {
            return res.status(502).send({
                error: 'La IA devolvió una respuesta vacía'
            });
        }

        // Respuesta
        return res.send({
            original: texto,
            mejorado: textoMejorado
        });

    } catch (err) {

        console.error('Error al mejorar texto con IA:', err);

        // Rate limit Gemini
        if (err?.status === 429) {
            return res.status(429).send({
                error: 'Demasiadas solicitudes a la IA'
            });
        }

        // Timeout
        if (err.message === 'Timeout Gemini') {
            return res.status(504).send({
                error: 'La IA tardó demasiado en responder'
            });
        }

        return res.status(500).send({
            error: 'No se pudo procesar la solicitud'
        });

    }

});

module.exports = router;