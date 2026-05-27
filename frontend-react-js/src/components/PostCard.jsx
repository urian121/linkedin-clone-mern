import { useState } from 'react'
import { Globe, ThumbsUp, MessageSquare, Repeat2, Send, X, } from 'lucide-react'

/* ─── Datos de acción ─────────────────────────────────────── */
const ACTIONS = [
  { icon: ThumbsUp,       label: 'Recomendar' },
  { icon: MessageSquare,  label: 'Comentar'   },
  { icon: Repeat2,        label: 'Compartir'  },
  { icon: Send,           label: 'Enviar'     },
]

/* ─── Avatar cuadrado con inicial (fallback sin imagen) ────── */
function SquareAvatar({ src, name, color = '#C0392B', size = 'md' }) {
  const sizes = { sm: 'w-8 h-8 text-sm', md: 'w-11 h-11 text-lg' }
  const cls = sizes[size] ?? sizes.md

  return src ? (
    <img src={src} alt={name} className={`${cls} rounded-lg object-cover`} />
  ) : (
    <div
      className={`${cls} rounded-lg flex items-center justify-center font-bold text-white shrink-0`}
      style={{ backgroundColor: color }}
    >
      {name?.[0]?.toUpperCase()}
    </div>
  )
}

/* ─── Botón de reacción / acción ───────────────────────────── */
function ActionButton({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors flex-1 justify-center hover:cursor-pointer
        ${active
          ? 'text-[#0A66C2] hover:bg-blue-50'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`}
    >
      <Icon
        className="w-5 h-5"
        strokeWidth={active ? 2.5 : 1.8}
        fill={active ? '#0A66C2' : 'none'}
      />
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}

/* ─── Componente principal ─────────────────────────────────── */
export default function PostCard({
  avatar       = null,
  avatarColor  = '#C0392B',
  name         = 'Usuario',
  subtitle     = '500 seguidores',
  time         = '1 h',
  isPublic     = true,
  content      = '',
  image        = null,
  initialLikes = 0,
  currentUserAvatar = null,
  onClose,
}) {
  const [liked,    setLiked]    = useState(false)
  const [likes,    setLikes]    = useState(initialLikes)
  const [expanded, setExpanded] = useState(false)
  const [visible,  setVisible]  = useState(true)

  if (!visible) return null

  const handleClose = () => {
    setVisible(false)
    onClose?.()
  }

  const handleLike = () => {
    setLiked(prev => !prev)
    setLikes(prev => prev + (liked ? -1 : 1))
  }

  /* Truncar texto largo */
  const MAX_CHARS = 120
  const isTruncatable = content.length > MAX_CHARS
  const displayText   = isTruncatable && !expanded
    ? content.slice(0, MAX_CHARS) + '…'
    : content

  return (
    <article className="bg-white rounded-lg border border-gray-200 overflow-hidden">

      {/* ── Cabecera ──────────────────────────────────────── */}
      <div className="flex items-start gap-3 px-4 pt-4 pb-2">
        <SquareAvatar src={avatar} name={name} color={avatarColor} />

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-gray-900 leading-tight">{name}</p>
          <p className="text-xs text-gray-500 leading-tight mt-0.5 truncate">{subtitle}</p>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
            <span>{time}</span>
            <span>•</span>
            {isPublic
              ? <Globe className="w-3 h-3" />
              : <span>🔒</span>
            }
          </div>
        </div>

        {/* Botón cerrar + puntos */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleClose}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors hover:cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ── Contenido de texto ────────────────────────────── */}
      {content && (
        <div className="px-4 pb-3 text-sm text-gray-800 leading-relaxed">
          <span>{displayText}</span>
          {isTruncatable && (
            <button
              onClick={() => setExpanded(p => !p)}
              className="ml-1 text-gray-500 font-semibold hover:underline text-sm"
            >
              {expanded ? 'menos' : 'más'}
            </button>
          )}
        </div>
      )}

      {/* ── Imagen del post ───────────────────────────────── */}
      {image && (
        <div className="w-full aspect-video overflow-hidden border-t border-b border-gray-200">
          <img
            src={image}
            alt="Imagen del post"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* ── Contador de reacciones ────────────────────────── */}
      {likes > 0 && (
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-gray-200">
          <span className="w-5 h-5 rounded-full bg-[#0A66C2] flex items-center justify-center">
            <ThumbsUp className="w-3 h-3 text-white" fill="white" strokeWidth={0} />
          </span>
          <span className="text-xs text-gray-500 hover:text-[#0A66C2] hover:underline cursor-pointer">
            {likes}
          </span>
        </div>
      )}

      {/* ── Botones de acción ─────────────────────────────── */}
      <div className="flex items-center px-2 py-1">
        {/* Mini avatar del usuario actual */}
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 shrink-0 mr-1">
          {currentUserAvatar
            ? <img src={currentUserAvatar} alt="Tú" className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">T</div>
          }
        </div>

        {ACTIONS.map(({ icon, label }) => (
          <ActionButton
            key={label}
            icon={icon}
            label={label}
            active={label === 'Recomendar' && liked}
            onClick={label === 'Recomendar' ? handleLike : undefined}
          />
        ))}
      </div>
    </article>
  )
}
