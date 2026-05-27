import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export default function CreatePostModal({ isOpen, onClose }) {
  const [text, setText] = useState('')

  /* Única lógica JS: cerrar con Escape */
  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  /* Al desmontar se reinicia el estado automáticamente */
  if (!isOpen) return null

  const canPost = text.trim().length > 0

  return (
    /* ── Overlay: fade-in ──────────────────────────────────── */
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
      style={{ animation: 'modal-overlay-in 0.2s ease-out' }}
    >
      {/* ── Tarjeta: slide-up suave ─────────────────────────── */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl w-full max-w-[560px] mx-4 flex flex-col overflow-hidden"
        style={{ animation: 'modal-card-in 0.28s cubic-bezier(0.4, 0, 0.2, 1)' }}
      >
        {/* ── Header ────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Crear una publicación</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Textarea ──────────────────────────────────────── */}
        <div className="px-5 pb-3">
          <textarea
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="¿Sobre qué quieres hablar?"
            rows={5}
            className="w-full resize-none text-gray-800 text-base placeholder-gray-400 outline-none leading-relaxed"
          />
        </div>

        {/* ── Footer ────────────────────────────────────────── */}
        <div className="px-4 pb-4 pt-2 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              disabled={!canPost}
              className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-colors
                ${canPost
                  ? 'bg-[#0A66C2] text-white hover:bg-[#004182] cursor-pointer'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
              Publicar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
