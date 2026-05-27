import {
  X,
  FileText,
  FileSpreadsheet,
  Presentation,
  File as FileIcon
} from 'lucide-react'

/* ─── Configuración por extensión / tipo MIME ──────────────── */
const FILE_PRESETS = {
  pdf:  { label: 'PDF',  color: '#D93025', icon: FileText },
  doc:  { label: 'DOC',  color: '#1A73E8', icon: FileText },
  docx: { label: 'DOCX', color: '#1A73E8', icon: FileText },
  xls:  { label: 'XLS',  color: '#0F9D58', icon: FileSpreadsheet },
  xlsx: { label: 'XLSX', color: '#0F9D58', icon: FileSpreadsheet },
  ppt:  { label: 'PPT',  color: '#E8710A', icon: Presentation },
  pptx: { label: 'PPTX', color: '#E8710A', icon: Presentation }
}

/* ─── Helpers ──────────────────────────────────────────────── */
const getExtension = (filename = '') => {
  const dot = filename.lastIndexOf('.')
  return dot >= 0 ? filename.slice(dot + 1).toLowerCase() : ''
}

const formatSize = (bytes = 0) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/* ─── Tarjeta para documentos sin preview nativo ───────────── */
function DocCard({ file, preset }) {
  const Icon = preset.icon

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center text-center p-3 gap-2"
      style={{ backgroundColor: `${preset.color}10` }}
    >
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: preset.color }}
      >
        <Icon className="w-6 h-6 text-white" strokeWidth={2} />
      </div>

      <span
        className="text-[10px] font-bold px-1.5 py-0.5 rounded"
        style={{ backgroundColor: preset.color, color: 'white' }}
      >
        {preset.label}
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
  const ext     = getExtension(file.name)
  const preset  = FILE_PRESETS[ext]

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

      {!isImage && !isVideo && preset && (
        <DocCard file={file} preset={preset} />
      )}

      {!isImage && !isVideo && !preset && (
        <DocCard
          file={file}
          preset={{ label: ext.toUpperCase() || 'FILE', color: '#6B7280', icon: FileIcon }}
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
