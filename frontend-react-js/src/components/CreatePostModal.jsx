import { useState, useEffect, useRef } from 'react'
import { X, SendHorizonal, Loader2, Paperclip, Smile, Sparkles } from 'lucide-react'
import { showToast } from "nextjs-toast-notify";
import Picker from '@emoji-mart/react'
import emojiData from '@emoji-mart/data'
import FilePreview from './FilePreview'
import Tooltip from './Tooltip'
import YoutubeEmbed from './YoutubeEmbed'
import { extraerIdYoutube } from '../utils/youtube'

const API_URL = import.meta.env.VITE_API_URL
const ACCEPTED_TYPES = import.meta.env.VITE_ACCEPTED_FILE_TYPES
const DEFAULT_USER_ID = import.meta.env.VITE_DEFAULT_USER_ID
const MAX_IMAGES = Number(import.meta.env.VITE_MAX_IMAGES) || 6

export default function CreatePostModal({ isOpen, onClose, onPosted }) {
  const [text, setText] = useState('')
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showEmoji, setShowEmoji] = useState(false)
  const [mejorandoIA, setMejorandoIA] = useState(false)

  const fileInputRef = useRef(null)
  const textareaRef = useRef(null)
  const emojiWrapperRef = useRef(null)

  /* Cerrar con Escape (no si está publicando) */
  useEffect(() => {
    if (!isOpen) return

    const handler = (e) => {
      if (e.key !== 'Escape') return
      if (showEmoji) {
        setShowEmoji(false)
        return
      }
      if (!loading) onClose()
    }

    window.addEventListener('keydown', handler)

    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose, loading, showEmoji])

  /* Cerrar emoji picker al hacer click fuera */
  useEffect(() => {
    if (!showEmoji) return

    const handler = (e) => {
      if (emojiWrapperRef.current?.contains(e.target)) return
      setShowEmoji(false)
    }

    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showEmoji])

  if (!isOpen) return null

  const canPost = (text.trim().length > 0 || files.length > 0) && !loading

  const openFilePicker = () => {
    if (loading) return
    fileInputRef.current?.click()
  }

  const handleFilesSelected = (e) => {
    const selected = Array.from(e.target.files || [])
    e.target.value = ''
    if (selected.length === 0) return

    const imagenesActuales = files.filter((f) => f.tipo.startsWith('image/')).length
    let imagenesAceptadas = 0
    const rechazadas = []

    const mapped = selected.flatMap((file) => {
      if (file.type.startsWith('image/')) {
        if (imagenesActuales + imagenesAceptadas >= MAX_IMAGES) {
          rechazadas.push(file.name)
          return []
        }
        imagenesAceptadas++
      }
      return [{
        file,
        preview: URL.createObjectURL(file),
        tipo: file.type
      }]
    })

    if (rechazadas.length > 0) {
      showToast.warning(`Solo se permiten ${MAX_IMAGES} imágenes por publicación`, {
        position: 'bottom-right',
        transition: 'swingInverted',
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

  const resetForm = () => {
    setText('')
    files.forEach((f) => URL.revokeObjectURL(f.preview))
    setFiles([])
    setError(null)
    setShowEmoji(false)
  }

  /* Mejora el texto del post usando Gemini (vía backend) */
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
      showToast.success('Texto mejorado con IA', {
        position: 'bottom-right',
        transition: 'swingInverted',
      })
    } catch (err) {
      showToast.error(err.message || 'No se pudo mejorar el texto', {
        position: 'bottom-right',
        transition: 'swingInverted',
      })
    } finally {
      setMejorandoIA(false)
    }
  }

  /* Inserta el emoji en la posición actual del cursor del textarea */
  const insertarEmoji = (emoji) => {
    const ta = textareaRef.current
    const symbol = emoji.native

    if (!ta) {
      setText((prev) => prev + symbol)
      return
    }

    const start = ta.selectionStart ?? text.length
    const end = ta.selectionEnd ?? text.length
    const nuevoTexto = text.slice(0, start) + symbol + text.slice(end)

    setText(nuevoTexto)

    requestAnimationFrame(() => {
      ta.focus()
      const pos = start + symbol.length
      ta.setSelectionRange(pos, pos)
    })
  }

  const handleSubmit = async () => {
    if (!canPost) return

    setLoading(true)
    setError(null)

    try {
      /* 1. Subir archivos al backend (si hay) */
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
          showToast.error("Error al subir archivos", {
            position: "bottom-right",
            transition: "swingInverted",
            sound: true,
          });
        }
        archivosSubidos = upData.archivos || []
      }

      /* 2. Crear la publicación con las URLs ya subidas */
      const res = await fetch(`${API_URL}/agregarpublicacion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idusuario: DEFAULT_USER_ID,
          texto: text.trim(),
          archivos: archivosSubidos
        })
      })

      if (!res.ok) throw new Error(`Error ${res.status} al publicar`)

      const data = await res.json()

      onPosted?.(data.publicacion)
      resetForm()
      onClose()
      showToast.success("La publicación se ha creado correctamente", {
        position: "bottom-right",
        transition: "swingInverted",
        sound: true,
      });
    } catch (err) {
      setError(err.message || 'No se pudo publicar. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    /* ── Overlay ─────────────────────────────────────────── */
    <div
      onClick={() => { if (!loading) onClose() }}
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50"
      style={{ animation: 'modal-overlay-in 0.2s ease-out' }}
    >
      {/* ── Modal ─────────────────────────────────────────── */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-[720px] min-h-[420px] mx-4 flex flex-col shadow-2xl"
        style={{
          animation: 'modal-card-in 0.28s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* ── Header ─────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Crear una publicación
          </h2>

          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Textarea ───────────────────────────────────── */}
        <div
          className={
            loading
              ? 'flex-1 px-6 py-5 opacity-60 pointer-events-none transition-opacity'
              : 'flex-1 px-6 py-5 transition-opacity'
          }
          aria-busy={loading}
        >
          {(() => {
            const youtubeId = extraerIdYoutube(text)
            const tienePreview = !!youtubeId || files.length > 0

            return (
              <>
                <textarea
                  ref={textareaRef}
                  autoFocus
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  disabled={loading}
                  placeholder="¿Sobre qué quieres hablar?"
                  rows={tienePreview ? 3 : 10}
                  className="w-full resize-none text-gray-800 text-lg placeholder-gray-400 outline-none leading-relaxed"
                />

                {youtubeId && (
                  <div className="mt-3 max-w-md mx-auto rounded-lg overflow-hidden border border-gray-200 bg-black">
                    <YoutubeEmbed id={youtubeId} bordered={false} />
                  </div>
                )}
              </>
            )
          })()}

          {/* ── Previews de archivos ───────────────────── */}
          {files.length > 0 && (
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {files.map((f, idx) => (
                <FilePreview
                  key={idx}
                  file={f.file}
                  preview={f.preview}
                  tipo={f.tipo}
                  disabled={loading}
                  onRemove={() => removeFile(idx)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Footer ─────────────────────────────────────── */}
        <div className="px-5 pb-5 pt-3 border-t border-gray-200">
          {error && (
            <div className="mb-3 px-3 py-2 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {/* ── Botón adjuntar archivo ───────────────── */}
              <Tooltip label="Agregar archivo">
                <button
                  type="button"
                  onClick={openFilePicker}
                  disabled={loading}
                  aria-label="Agregar archivo"
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-[#0A66C2] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
              </Tooltip>

              {/* ── Botón emoji ──────────────────────────── */}
              <div ref={emojiWrapperRef} className="relative">
                <Tooltip label="Agregar emoji">
                  <button
                    type="button"
                    onClick={() => setShowEmoji((v) => !v)}
                    disabled={loading}
                    aria-label="Agregar emoji"
                    className={
                      showEmoji
                        ? 'p-2 rounded-full bg-gray-100 text-[#0A66C2] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                        : 'p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-[#0A66C2] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                    }
                  >
                    <Smile className="w-5 h-5" />
                  </button>
                </Tooltip>

                {showEmoji && (
                  <div
                    className="absolute left-0 z-50"
                    style={{ bottom: 'calc(100% + 8px)' }}
                  >
                    <Picker
                      data={emojiData}
                      onEmojiSelect={insertarEmoji}
                      locale="es"
                      theme="light"
                      previewPosition="none"
                      skinTonePosition="search"
                      navPosition="bottom"
                      maxFrequentRows={1}
                    />
                  </div>
                )}
              </div>

              {/* ── Botón mejorar con IA ─────────────────── */}
              <Tooltip label="Mejorar con IA">
                <button
                  type="button"
                  onClick={mejorarConIA}
                  disabled={loading || mejorandoIA || !text.trim()}
                  aria-label="Mejorar con IA"
                  className={
                    mejorandoIA
                      ? 'p-2 rounded-full bg-purple-50 text-purple-600 cursor-wait'
                      : 'p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-purple-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                  }
                >
                  {mejorandoIA ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Sparkles className="w-5 h-5" />
                  )}
                </button>
              </Tooltip>
            </div>

            {/* Input file oculto */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={ACCEPTED_TYPES}
              onChange={handleFilesSelected}
              className="hidden"
            />

            <button
              onClick={handleSubmit}
              disabled={!canPost}
              className={
                canPost
                  ? 'flex items-center gap-2 px-6 py-2 rounded-full text-sm font-semibold transition-all bg-[#0A66C2] text-white hover:bg-[#004182] cursor-pointer'
                  : 'flex items-center gap-2 px-6 py-2 rounded-full text-sm font-semibold transition-all bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Publicando…
                </>
              ) : (
                <>
                  <SendHorizonal className="w-4 h-4" />
                  Publicar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
