import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

import PostBody from './CreatePost/PostBody'
import PostFooter from './CreatePost/PostFooter'
import useCloseAnimation from '../hooks/useCloseAnimation'
import usePostForm from '../hooks/usePostForm'

export default function CreatePostModal({ isOpen, onClose, onPosted }) {
  const fileInputRef = useRef(null)
  const emojiRef = useRef(null)

  const form = usePostForm({ onPublished: onPosted })
  const { visible, closing, requestClose } = useCloseAnimation({ isOpen, onClose })

  const loading = form.loading

  /* Cierra por gesto del usuario (overlay, X, Escape). Bloquea durante el envío */
  const tryUserClose = () => {
    if (loading) return
    requestClose()
  }

  /* Escape: primero cierra el emoji picker; si no está abierto, intenta cerrar el modal */
  useEffect(() => {
    if (!visible) return

    const handler = (e) => {
      if (e.key !== 'Escape') return
      if (emojiRef.current?.isOpen()) {
        emojiRef.current.close()
        return
      }
      if (!loading) requestClose()
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [visible, loading, requestClose])

  if (!visible) return null

  const openFilePicker = () => {
    if (form.loading) return
    fileInputRef.current?.click()
  }

  const handleFilesSelected = (e) => {
    const seleccionados = Array.from(e.target.files || [])
    e.target.value = ''
    form.addFiles(seleccionados)
  }

  const handleSubmit = async () => {
    const ok = await form.submit()
    if (ok) requestClose()
  }

  return (
    <div
      onClick={tryUserClose}
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50"
      style={{
        animation: closing
          ? 'modal-overlay-out 0.2s ease-in forwards'
          : 'modal-overlay-in 0.2s ease-out'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-[720px] min-h-[420px] mx-4 flex flex-col shadow-2xl"
        style={{
          animation: closing
            ? 'modal-card-out 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards'
            : 'modal-card-in 0.28s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Crear una publicación
          </h2>
          <button
            onClick={tryUserClose}
            disabled={form.loading}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <PostBody
          text={form.text}
          setText={form.setText}
          textareaRef={form.textareaRef}
          files={form.files}
          onRemoveFile={form.removeFile}
          loading={form.loading}
        />

        <PostFooter
          loading={form.loading}
          error={form.error}
          canPost={form.canPost}
          hasText={form.hasText}
          mejorandoIA={form.mejorandoIA}
          fileInputRef={fileInputRef}
          emojiRef={emojiRef}
          onAttach={openFilePicker}
          onFilesSelected={handleFilesSelected}
          onInsertEmoji={form.insertEmoji}
          onMejorar={form.mejorarConIA}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
