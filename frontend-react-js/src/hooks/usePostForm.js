import { useRef, useState } from 'react'
import { showToast } from 'nextjs-toast-notify'
import useAuth from './useAuth'

const API_URL = import.meta.env.VITE_API_URL
const DEFAULT_USER_ID = import.meta.env.VITE_DEFAULT_USER_ID
const MAX_IMAGES = Number(import.meta.env.VITE_MAX_IMAGES) || 6
const MAX_IMAGEN_MB = Number(import.meta.env.VITE_MAX_IMAGEN_MB) || 20
const MAX_VIDEO_MB = Number(import.meta.env.VITE_MAX_VIDEO_MB) || 100

const toastBase = { position: 'bottom-right', transition: 'swingInverted' }

const mbABytes = (mb) => mb * 1024 * 1024

const limiteBytesArchivo = (tipo = '') =>
  tipo.startsWith('video/') ? mbABytes(MAX_VIDEO_MB) : mbABytes(MAX_IMAGEN_MB)

const MSG_PESO_LOCAL = `Archivo muy pesado (máx ${MAX_IMAGEN_MB} MB imágenes/docs, ${MAX_VIDEO_MB} MB videos).`

/* Encapsula todo el estado y la lógica del formulario de crear publicación:
   texto, archivos, mejora con IA, subida a Cloudinary y publicación. */
export default function usePostForm({ onPublished } = {}) {
  const { user } = useAuth()
  const [text, setText] = useState('')
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [mejorandoIA, setMejorandoIA] = useState(false)

  const textareaRef = useRef(null)

  const hasText = text.trim().length > 0
  const canPost = (hasText || files.length > 0) && !loading

  /* Agrega archivos respetando el máximo de imágenes permitido */
  const addFiles = (seleccionados) => {
    if (!seleccionados?.length) return

    const imagenesActuales = files.filter((f) => f.tipo.startsWith('image/')).length
    let aceptadasImg = 0
    let rechazadas = 0

    let rechazadasPeso = 0

    const mapped = seleccionados.flatMap((file) => {
      if (file.size > limiteBytesArchivo(file.type)) {
        rechazadasPeso++
        return []
      }

      if (file.type.startsWith('image/')) {
        if (imagenesActuales + aceptadasImg >= MAX_IMAGES) {
          rechazadas++
          return []
        }
        aceptadasImg++
      }
      return [{
        file,
        preview: URL.createObjectURL(file),
        tipo: file.type
      }]
    })

    if (rechazadasPeso > 0) {
      showToast.error(MSG_PESO_LOCAL, { ...toastBase, sound: true })
    }

    if (rechazadas > 0) {
      showToast.warning(`Solo se permiten ${MAX_IMAGES} imágenes por publicación`, {
        ...toastBase,
        sound: true,
      })
    }

    if (mapped.length > 0) setFiles((prev) => [...prev, ...mapped])
  }

  const removeFile = (idx) => {
    setFiles((prev) => {
      const next = [...prev]
      const [removed] = next.splice(idx, 1)
      if (removed?.preview) URL.revokeObjectURL(removed.preview)
      return next
    })
  }

  const reset = () => {
    setText('')
    files.forEach((f) => URL.revokeObjectURL(f.preview))
    setFiles([])
    setError(null)
  }

  /* Inserta un emoji en la posición del cursor */
  const insertEmoji = (emoji) => {
    const ta = textareaRef.current
    const symbol = emoji.native

    if (!ta) {
      setText((prev) => prev + symbol)
      return
    }

    const start = ta.selectionStart ?? text.length
    const end = ta.selectionEnd ?? text.length
    const nuevo = text.slice(0, start) + symbol + text.slice(end)

    setText(nuevo)

    requestAnimationFrame(() => {
      ta.focus()
      const pos = start + symbol.length
      ta.setSelectionRange(pos, pos)
    })
  }

  /* Llama al backend para mejorar el texto del post con Gemini */
  const mejorarConIA = async () => {
    const original = text.trim()
    if (!original || mejorandoIA || loading) return

    setMejorandoIA(true)
    try {
      const res = await fetch(`${API_URL}/mejorarpost`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto: original })
      })

      const data = await res.json().catch(() => ({}))
      const textoMejorado = data.mejorado || data.texto

      if (!res.ok || !textoMejorado) {
        throw new Error(data.error || 'No se pudo mejorar el texto')
      }

      setText(textoMejorado)
      showToast.success('Texto mejorado con IA', toastBase)
    } catch (err) {
      showToast.error(err.message || 'No se pudo mejorar el texto', toastBase)
    } finally {
      setMejorandoIA(false)
    }
  }

  /* Sube archivos a Cloudinary y crea la publicación.
     Devuelve true si todo salió bien (para que el padre decida cerrar el modal). */
  const submit = async () => {
    if (!canPost) return false

    setLoading(true)
    setError(null)

    try {
      let archivosSubidos = []

      if (files.length > 0) {
        const formData = new FormData()
        files.forEach((f) => formData.append('archivos', f.file))

        const upRes = await fetch(`${API_URL}/subirarchivos`, {
          method: 'POST',
          body: formData
        })

        const upData = await upRes.json().catch(() => ({}))
        if (!upRes.ok) {
          const msg = upData.error || 'No se pudieron subir los archivos'
          setError(msg)
          showToast.error(msg, { ...toastBase, sound: true })
          return false
        }
        archivosSubidos = upData.archivos || []
      }

      const res = await fetch(`${API_URL}/agregarpublicacion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idusuario: user?.displayName || user?.email || DEFAULT_USER_ID,
          autorFoto: user?.photoURL || '',
          texto: text.trim(),
          archivos: archivosSubidos
        })
      })

      if (!res.ok) throw new Error(`Error ${res.status} al publicar`)
      const data = await res.json()

      onPublished?.(data.publicacion)
      reset()
      showToast.success('La publicación se ha creado correctamente', {
        ...toastBase,
        sound: true,
      })
      return true
    } catch (err) {
      setError(err.message || 'No se pudo publicar. Inténtalo de nuevo.')
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    text, setText,
    files,
    loading, error,
    mejorandoIA,
    canPost, hasText,
    textareaRef,
    addFiles, removeFile,
    insertEmoji,
    mejorarConIA,
    submit,
  }
}
