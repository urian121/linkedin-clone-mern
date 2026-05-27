import { Paperclip, Sparkles, Loader2, SendHorizonal } from 'lucide-react'
import Tooltip from '../Tooltip'
import EmojiButton from './EmojiButton'

const ACCEPTED_TYPES = import.meta.env.VITE_ACCEPTED_FILE_TYPES

const baseIconBtn = 'p-2 rounded-full transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'

/* Barra inferior del modal: archivos, emoji, IA y botón publicar. */
export default function PostFooter({
  loading,
  error,
  canPost,
  hasText,
  mejorandoIA,
  fileInputRef,
  emojiRef,
  onAttach,
  onFilesSelected,
  onInsertEmoji,
  onMejorar,
  onSubmit,
}) {
  return (
    <div className="px-5 pb-5 pt-3 border-t border-gray-200">
      {error && (
        <div className="mb-3 px-3 py-2 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Tooltip label="Agregar archivo">
            <button
              type="button"
              onClick={onAttach}
              disabled={loading}
              aria-label="Agregar archivo"
              className={`${baseIconBtn} hover:bg-gray-100 text-gray-600 hover:text-[#0A66C2]`}
            >
              <Paperclip className="w-5 h-5" />
            </button>
          </Tooltip>

          <EmojiButton
            ref={emojiRef}
            onInsert={onInsertEmoji}
            disabled={loading}
          />

          <Tooltip label="Mejorar con IA">
            <button
              type="button"
              onClick={onMejorar}
              disabled={loading || mejorandoIA || !hasText}
              aria-label="Mejorar con IA"
              className={
                mejorandoIA
                  ? 'p-2 rounded-full bg-purple-50 text-purple-600 cursor-wait'
                  : `${baseIconBtn} hover:bg-gray-100 text-gray-600 hover:text-purple-600`
              }
            >
              {mejorandoIA
                ? <Loader2 className="w-5 h-5 animate-spin" />
                : <Sparkles className="w-5 h-5" />
              }
            </button>
          </Tooltip>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ACCEPTED_TYPES}
          onChange={onFilesSelected}
          className="hidden"
        />

        <button
          onClick={onSubmit}
          disabled={!canPost}
          className={
            canPost
              ? 'flex items-center gap-2 px-6 py-2 rounded-full text-sm font-semibold transition-all bg-[#0A66C2] text-white hover:bg-[#004182] cursor-pointer'
              : 'flex items-center gap-2 px-6 py-2 rounded-full text-sm font-semibold transition-all bg-gray-200 text-gray-400 cursor-not-allowed'
          }
        >
          {loading
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Publicando…</>
            : <><SendHorizonal className="w-4 h-4" /> Publicar</>
          }
        </button>
      </div>
    </div>
  )
}
