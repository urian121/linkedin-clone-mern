import { useState } from 'react'

const DEFAULT_MS = 200

/* Gestiona el cierre animado de un modal/popover.
   Devuelve `visible` (mantén montado mientras anima), `closing` (estado de salida)
   y `requestClose` para iniciar la animación + avisar al padre cuando termina. */
export default function useCloseAnimation({ isOpen, onClose, durationMs = DEFAULT_MS }) {
  const [closing, setClosing] = useState(false)
  const visible = isOpen || closing

  const requestClose = () => {
    if (closing) return
    setClosing(true)
    setTimeout(() => {
      setClosing(false)
      onClose()
    }, durationMs)
  }

  return { visible, closing, requestClose }
}
