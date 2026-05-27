import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { urlPaginaPdf } from '../utils/cloudinary'

export default function MediaSlider({ url, paginas, titulo }) {
  const scrollerRef = useRef(null)
  const [actual, setActual] = useState(1)

  const total = Math.max(1, paginas)
  const paginasArray = Array.from({ length: total }, (_, i) => i + 1)

  const irA = (delta) => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ left: delta * el.clientWidth, behavior: 'smooth' })
  }

  const alScrollear = () => {
    const el = scrollerRef.current
    if (!el) return
    const idx = Math.round(el.scrollLeft / el.clientWidth) + 1
    if (idx !== actual && idx >= 1 && idx <= total) setActual(idx)
  }

  return (
    <div className="relative border-t border-b border-gray-200 bg-black select-none">
      <div
        ref={scrollerRef}
        onScroll={alScrollear}
        className="flex overflow-x-auto snap-x snap-mandatory aspect-4/3 scrollbar-hide"
      >
        {paginasArray.map((p) => (
          <div
            key={p}
            className="shrink-0 w-full h-full snap-center flex items-center justify-center"
          >
            <img
              src={urlPaginaPdf(url, p)}
              alt={`Página ${p} de ${total}`}
              loading="lazy"
              draggable={false}
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </div>

      {titulo && (
        <div className="absolute top-3 left-3 max-w-[70%] bg-black/75 text-white text-xs font-medium px-2.5 py-1.5 rounded-md truncate">
          {titulo} · {total} {total === 1 ? 'página' : 'páginas'}
        </div>
      )}

      {actual > 1 && (
        <button
          type="button"
          onClick={() => irA(-1)}
          aria-label="Página anterior"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/70 hover:bg-black/85 text-white flex items-center justify-center transition-colors hover:cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
        </button>
      )}

      {actual < total && (
        <button
          type="button"
          onClick={() => irA(1)}
          aria-label="Página siguiente"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/70 hover:bg-black/85 text-white flex items-center justify-center transition-colors hover:cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
        </button>
      )}

      <div className="absolute bottom-3 right-3 bg-black/75 text-white text-xs font-medium px-2 py-1 rounded">
        {actual} / {total}
      </div>
    </div>
  )
}
