import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Smile } from 'lucide-react'
import Picker from '@emoji-mart/react'
import emojiData from '@emoji-mart/data'
import Tooltip from '../Tooltip'

/* Botón + popover de emojis. Expone `isOpen()` y `close()` vía ref
   para que el modal pueda priorizar el cierre del picker en Escape. */
const EmojiButton = forwardRef(function EmojiButton({ onInsert, disabled }, ref) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)

  useImperativeHandle(ref, () => ({
    isOpen: () => open,
    close: () => setOpen(false),
  }), [open])

  /* Cerrar al hacer click fuera del wrapper */
  useEffect(() => {
    if (!open) return

    const handler = (e) => {
      if (wrapperRef.current?.contains(e.target)) return
      setOpen(false)
    }

    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const baseBtn = 'p-2 rounded-full transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'

  return (
    <div ref={wrapperRef} className="relative">
      <Tooltip label="Agregar emoji">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          disabled={disabled}
          aria-label="Agregar emoji"
          className={
            open
              ? `${baseBtn} bg-gray-100 text-[#0A66C2]`
              : `${baseBtn} hover:bg-gray-100 text-gray-600 hover:text-[#0A66C2]`
          }
        >
          <Smile className="w-5 h-5" />
        </button>
      </Tooltip>

      {open && (
        <div
          className="absolute left-0 z-50"
          style={{ bottom: 'calc(100% + 8px)' }}
        >
          <Picker
            data={emojiData}
            onEmojiSelect={onInsert}
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
  )
})

export default EmojiButton
