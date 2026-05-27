import { useState, useEffect, useRef } from 'react'
import { X, SendHorizonal, Loader2, Paperclip } from 'lucide-react'
import { showToast } from "nextjs-toast-notify";
import FilePreview from './FilePreview'

const API_URL = import.meta.env.VITE_API_URL
const ACCEPTED_TYPES = import.meta.env.VITE_ACCEPTED_FILE_TYPES
const DEFAULT_USER_ID = import.meta.env.VITE_DEFAULT_USER_ID

export default function CreatePostModal({ isOpen, onClose, onPosted }) {
  const [text, setText] = useState('')
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fileInputRef = useRef(null)

  /* Cerrar con Escape (no si está publicando) */
  useEffect(() => {
    if (!isOpen) return

    const handler = (e) => {
      if (e.key === 'Escape' && !loading) onClose()
    }

    window.addEventListener('keydown', handler)

    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose, loading])

  if (!isOpen) return null

  const canPost = (text.trim().length > 0 || files.length > 0) && !loading

  const openFilePicker = () => {
    if (loading) return
    fileInputRef.current?.click()
  }

  const handleFilesSelected = (e) => {
    const selected = Array.from(e.target.files || [])
    if (selected.length === 0) return

    const mapped = selected.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      tipo: file.type
    }))

    setFiles((prev) => [...prev, ...mapped])
    e.target.value = ''
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
        className="bg-white rounded-2xl w-full max-w-[720px] min-h-[420px] mx-4 flex flex-col overflow-hidden shadow-2xl"
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
        <div className="flex-1 px-6 py-5">
          <textarea
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
            placeholder="¿Sobre qué quieres hablar?"
            rows={files.length > 0 ? 4 : 10}
            className="w-full resize-none text-gray-800 text-lg placeholder-gray-400 outline-none leading-relaxed disabled:opacity-60"
          />

          {/* ── Previews de archivos ───────────────────── */}
          {files.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2">
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
            {/* ── Botón adjuntar archivo ───────────────── */}
            <button
              type="button"
              onClick={openFilePicker}
              disabled={loading}
              aria-label="Agregar archivo"
              title="Agregar archivo"
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-[#0A66C2] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Paperclip className="w-5 h-5" />
            </button>

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
