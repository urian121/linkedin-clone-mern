/* Mosaico estilo LinkedIn — todas las celdas comparten aspect ratio
   1     → full width manteniendo el alto natural
   2     → 2 columnas, contenedor 2:1 (cada celda cuadrada)
   3     → 1 grande izq (2fr) + 2 apiladas (1fr), contenedor cuadrado
   4     → 1 grande izq (3fr) + 3 apiladas (1fr), contenedor cuadrado
   5-6   → igual que 4, con overlay "+N" sobre la última visible */

const VISIBLES_MAX = 4

function ImgCell({ url, overlayText, style }) {
  return (
    <div className="relative overflow-hidden bg-gray-100" style={style}>
      <img
        src={url}
        alt=""
        loading="lazy"
        className="w-full h-full object-cover object-center"
      />
      {overlayText && (
        <div className="absolute inset-0 bg-black/55 flex items-center justify-center text-white text-3xl sm:text-4xl font-semibold">
          {overlayText}
        </div>
      )}
    </div>
  )
}

export default function ImageGrid({ urls }) {
  const total = urls.length
  if (total === 0) return null

  /* 1 imagen → tamaño natural acotado */
  if (total === 1) {
    return (
      <div className="w-full max-h-[600px] overflow-hidden border-t border-b border-gray-200 bg-black">
        <img
          src={urls[0]}
          alt=""
          className="w-full h-full object-contain max-h-[600px] mx-auto"
        />
      </div>
    )
  }

  /* 2 imágenes → lado a lado, cada celda cuadrada */
  if (total === 2) {
    return (
      <div className="grid grid-cols-2 gap-0.5 aspect-2/1 max-h-[600px] border-t border-b border-gray-200 bg-white">
        {urls.map((u, i) => (
          <ImgCell key={i} url={u} />
        ))}
      </div>
    )
  }

  /* 3+ imágenes → 1 grande + apiladas (todas mismo aspect ratio) */
  const visibles = urls.slice(0, VISIBLES_MAX)
  const grande = visibles[0]
  const apiladas = visibles.slice(1)
  const restantes = total - VISIBLES_MAX

  // Para 3 imágenes (2 apiladas): col grande = 2fr, derecha = 1fr
  // Para 4 imágenes (3 apiladas): col grande = 3fr, derecha = 1fr
  // Con aspect-square del contenedor → todas las celdas tienen el mismo ratio
  const colsClass =
    apiladas.length === 2 ? 'grid-cols-[2fr_1fr]' : 'grid-cols-[3fr_1fr]'

  return (
    <div
      className={`grid ${colsClass} gap-0.5 aspect-square max-h-[600px] border-t border-b border-gray-200 bg-white`}
      style={{ gridTemplateRows: `repeat(${apiladas.length}, minmax(0, 1fr))` }}
    >
      <ImgCell
        url={grande}
        style={{ gridRow: `1 / span ${apiladas.length}` }}
      />
      {apiladas.map((u, i) => {
        const esUltima = i === apiladas.length - 1
        return (
          <ImgCell
            key={i}
            url={u}
            overlayText={esUltima && restantes > 0 ? `+${restantes}` : null}
          />
        )
      })}
    </div>
  )
}
