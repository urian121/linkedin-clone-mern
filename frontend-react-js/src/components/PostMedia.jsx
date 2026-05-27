import {
  FileText,
  FileSpreadsheet,
  Presentation,
  File as FileIcon,
  ExternalLink
} from 'lucide-react'

/* ─── Configuración por extensión ──────────────────────────── */
const FILE_PRESETS = {
  pdf:  { label: 'PDF',  color: '#D93025', icon: FileText },
  doc:  { label: 'DOC',  color: '#1A73E8', icon: FileText },
  docx: { label: 'DOCX', color: '#1A73E8', icon: FileText },
  xls:  { label: 'XLS',  color: '#0F9D58', icon: FileSpreadsheet },
  xlsx: { label: 'XLSX', color: '#0F9D58', icon: FileSpreadsheet },
  ppt:  { label: 'PPT',  color: '#E8710A', icon: Presentation },
  pptx: { label: 'PPTX', color: '#E8710A', icon: Presentation }
}

const getExt = (url = '') => {
  const clean = url.split('?')[0].split('#')[0]
  const dot = clean.lastIndexOf('.')
  return dot >= 0 ? clean.slice(dot + 1).toLowerCase() : ''
}

/* ─── Imagen ───────────────────────────────────────────────── */
function ImageMedia({ url }) {
  return (
    <div className="w-full max-h-[600px] overflow-hidden border-t border-b border-gray-200 bg-black">
      <img
        src={url}
        alt="Imagen del post"
        className="w-full h-full object-contain max-h-[600px] mx-auto"
      />
    </div>
  )
}

/* ─── Video ────────────────────────────────────────────────── */
function VideoMedia({ url }) {
  return (
    <div className="w-full border-t border-b border-gray-200 bg-black">
      <video
        src={url}
        controls
        preload="metadata"
        playsInline
        className="w-full max-h-[600px]"
      />
    </div>
  )
}

/* ─── PDF (preview embebido + click para abrir) ────────────── */
function PdfMedia({ url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block relative aspect-4/3 bg-gray-100 border-t border-b border-gray-200 overflow-hidden group"
    >
      <iframe
        src={`${url}#toolbar=0&navpanes=0&view=FitH`}
        title="Vista previa PDF"
        className="w-full h-full pointer-events-none"
      />

      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/40 to-transparent px-4 py-3 flex items-center gap-2 text-white">
        <FileText className="w-5 h-5 shrink-0" strokeWidth={1.8} />
        <span className="text-sm font-semibold flex-1 truncate">Documento PDF</span>
        <span className="flex items-center gap-1 text-xs font-medium opacity-90 group-hover:opacity-100">
          <ExternalLink className="w-3.5 h-3.5" />
          Abrir
        </span>
      </div>
    </a>
  )
}

/* ─── Office / archivo genérico (tarjeta horizontal) ──────── */
function DocMedia({ url, ext }) {
  const preset = FILE_PRESETS[ext] || {
    label: ext.toUpperCase() || 'ARCHIVO',
    color: '#6B7280',
    icon: FileIcon
  }
  const Icon = preset.icon

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 px-4 py-3 border-t border-b border-gray-200 hover:bg-gray-50 transition-colors group"
    >
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: preset.color }}
      >
        <Icon className="w-6 h-6 text-white" strokeWidth={2} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">
          Documento {preset.label}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          Haz clic para abrir
        </p>
      </div>

      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#0A66C2] shrink-0" />
    </a>
  )
}

/* ─── Item individual: decide qué render usar según tipo ──── */
function MediaItem({ archivo }) {
  const { url, tipo = '' } = archivo
  if (!url) return null

  if (tipo.startsWith('image/')) return <ImageMedia url={url} />
  if (tipo.startsWith('video/')) return <VideoMedia url={url} />
  if (tipo === 'application/pdf') return <PdfMedia url={url} />

  return <DocMedia url={url} ext={getExt(url)} />
}

/* ─── Componente público ───────────────────────────────────── */
export default function PostMedia({ archivos = [] }) {
  if (!archivos.length) return null

  return (
    <div>
      {archivos.map((archivo, i) => (
        <MediaItem key={i} archivo={archivo} />
      ))}
    </div>
  )
}
