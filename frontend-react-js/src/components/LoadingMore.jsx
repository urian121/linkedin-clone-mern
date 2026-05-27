import { Loader2 } from 'lucide-react'

/* Indicador inline para "cargando más publicaciones..." en el feed infinito. */
export default function LoadingMore({ label = 'Cargando más publicaciones…' }) {
  return (
    <div className="flex items-center justify-center gap-2 py-4 text-gray-500 text-sm">
      <Loader2 className="w-4 h-4 animate-spin" />
      <span>{label}</span>
    </div>
  )
}
