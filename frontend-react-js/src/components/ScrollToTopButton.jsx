import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

/* Botón flotante "subir al inicio". Aparece tras scrollear `umbral` px
   y vuelve al tope con un scroll suave al hacer click. */
export default function ScrollToTopButton({ umbral = 400 }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > umbral)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [umbral])

  const subir = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <button
      type="button"
      onClick={subir}
      aria-label="Subir al inicio"
      className={`fixed right-3 sm:right-7 z-50 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white/80 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:bg-gray-300 hover:text-gray-700 active:scale-95 transition-all cursor-pointer bottom-[68px] sm:bottom-24
        ${visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none translate-y-2'}`}
    >
      <ArrowUp className="w-5 h-5 sm:w-7 sm:h-7" strokeWidth={2.5} />
    </button>
  )
}
