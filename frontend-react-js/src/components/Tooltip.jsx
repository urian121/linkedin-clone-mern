/* Tooltip CSS puro. Se muestra encima del elemento envuelto en hover/focus.
   `position` controla dónde aparece: 'top' (por defecto) o 'bottom'. */
export default function Tooltip({ label, children, position = 'top' }) {
  const placement =
    position === 'bottom'
      ? 'top-full mt-2'
      : 'bottom-full mb-2'

  return (
    <span className="relative inline-flex group">
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute ${placement} left-1/2 -translate-x-1/2 z-20
                    px-2 py-1 rounded-md bg-gray-900 text-white text-xs font-medium whitespace-nowrap
                    opacity-0 group-hover:opacity-100 group-focus-within:opacity-100
                    transition-opacity duration-150`}
      >
        {label}
      </span>
    </span>
  )
}
