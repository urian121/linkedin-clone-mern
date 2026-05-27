import { X, FileText, Presentation } from 'lucide-react'

const PPT_MIME_TYPES = [
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation'
]

const PPT_EXTENSIONS = ['ppt', 'pptx']

/* ─── Helpers ──────────────────────────────────────────────── */
const formatSize = (bytes = 0) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const getExtension = (filename = '') => {
  const dot = filename.lastIndexOf('.')
  return dot >= 0 ? filename.slice(dot + 1).toLowerCase() : ''
}

const isPptFile = (tipo, filename) =>
  PPT_MIME_TYPES.includes(tipo) || PPT_EXTENSIONS.includes(getExtension(filename))

/* ─── Tarjeta genérica para documentos (PDF / PPT) ─────────── */
function DocCard({ file, label, color, Icon }) {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center text-center p-3 gap-2"
      style={{ backgroundColor: `${color}10` }}
    >
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: color }}
      >
        <Icon className="w-6 h-6 text-white" strokeWidth={2} />
      </div>

      <span
        className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white"
        style={{ backgroundColor: color }}
      >
        {label}
      </span>

      <p className="text-xs text-gray-700 font-medium truncate w-full leading-tight">
        {file.name}
      </p>

      <p className="text-[10px] text-gray-500">
        {formatSize(file.size)}
      </p>
    </div>
  )
}

/* ─── Componente principal: una tarjeta por archivo ────────── */
export default function FilePreview({ file, preview, tipo, onRemove, disabled }) {
  const isImage = tipo.startsWith('image/')
  const isVideo = tipo.startsWith('video/')
  const isPdf   = tipo === 'application/pdf'
  const isPpt   = isPptFile(tipo, file.name)

  return (
    <div className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50 aspect-square flex items-center justify-center">

      {isImage && (
        <img
          src={preview}
          alt={file.name}
          className="w-full h-full object-cover"
        />
      )}

      {isVideo && (
        <video
          src={preview}
          className="w-full h-full object-cover bg-black"
          controls
          preload="metadata"
          muted
          playsInline
        />
      )}

      {isPdf && (
        <DocCard file={file} label="PDF" color="#D93025" Icon={FileText} />
      )}

      {isPpt && (
        <DocCard
          file={file}
          label={getExtension(file.name).toUpperCase() || 'PPT'}
          color="#E8710A"
          Icon={Presentation}
        />
      )}

      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer disabled:opacity-50 z-10"
        aria-label={`Quitar ${file.name}`}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
