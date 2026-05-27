const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')

// ──────────────────────────────────────────────
// ESQUEMA DE PUBLICACIONES
// ──────────────────────────────────────────────
const PublicacionSchema = new mongoose.Schema({
    idusuario: String,
    texto: String,

    archivos: [
        {
            url: String,
            tipo: String
        }
    ],

    reacciones: {
        recomendacion: { type: Number, default: 0 },
        celebrar: { type: Number, default: 0 },
        apoyar: { type: Number, default: 0 },
        meEncanta: { type: Number, default: 0 },
        interesante: { type: Number,default: 0 }
    },

    fecha: {type: Date, default: Date.now }

})


// MODELO
const ModeloPublicacion = mongoose.model('publicaciones', PublicacionSchema)


// ──────────────────────────────────────────────
// CREAR PUBLICACIÓN
// ──────────────────────────────────────────────
router.post('/agregarpublicacion', async (req, res) => {

    try {

        const nuevaPublicacion = new ModeloPublicacion({
            idusuario: req.body.idusuario,
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
// OBTENER PUBLICACIONES
// ──────────────────────────────────────────────
router.get('/obtenerpublicaciones', async (req, res) => {

    try {

        const publicaciones = await ModeloPublicacion
            .find({})
            .sort({ fecha: -1 })

        res.send(publicaciones)

    } catch (err) {

        res.status(500).send(err)

    }

})


// ──────────────────────────────────────────────
// REACCIONAR PUBLICACIÓN
// ──────────────────────────────────────────────
router.post('/reaccionarpublicacion', async (req, res) => {

    try {

        const reaccionesValidas = [
            'recomendacion',
            'celebrar',
            'apoyar',
            'meEncanta',
            'interesante'
        ]

        const reaccion = req.body.reaccion

        if (!reaccionesValidas.includes(reaccion)) {

            return res.status(400).send({
                error: 'Reacción inválida'
            })

        }

        const incremento = {}
        incremento[`reacciones.${reaccion}`] = 1
        const doc = await ModeloPublicacion.findByIdAndUpdate(

            req.body.idpublicacion,

            {
                $inc: incremento
            },

            {
                new: true
            }

        )

        res.send({
            mensaje: 'Reacción agregada',
            reacciones: doc.reacciones
        })

    } catch (err) {

        res.status(500).send(err)

    }

})

module.exports = router