/* Avatar circular reutilizable. Si hay foto la muestra; si no,
   cae al primer carácter del nombre como fallback. */

const SIZES = {
  xs: { box: 'w-6 h-6',   text: 'text-[10px]' },
  sm: { box: 'w-8 h-8',   text: 'text-xs' },
  md: { box: 'w-10 h-10', text: 'text-sm' },
  lg: { box: 'w-12 h-12', text: 'text-base' },
}

export default function UserAvatar({
  src,
  name = 'Usuario',
  size = 'md',
  className = '',
}) {
  const { box, text } = SIZES[size] || SIZES.md
  const inicial = name?.[0]?.toUpperCase() || 'U'

  return (
    <div
      className={`${box} rounded-full overflow-hidden bg-gray-200 shrink-0 flex items-center justify-center font-bold text-gray-700 ${text} ${className}`}
    >
      {src
        ? <img src={src} alt={name} className="w-full h-full object-cover" />
        : inicial
      }
    </div>
  )
}
