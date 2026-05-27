import { useEffect, useRef } from 'react'
import { FileText, Presentation, ExternalLink } from 'lucide-react'
import MediaSlider from './MediaSlider'
import ImageGrid from './ImageGrid'
import useInView from '../hooks/useInView'
import { urlDescargaCloudinary } from '../utils/cloudinary'

const PPT_MIME_TYPES = [
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation'
]

const EXT_POR_TIPO = {
  'application/pdf': 'pdf',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx'
}

const getExt = (url = '', tipo = '') => {
  const limpio = url.split('?')[0].split('#')[0]
  const punto = limpio.lastIndexOf('.')
  if (punto >= 0) return limpio.slice(punto + 1).toLowerCase()
  return EXT_POR_TIPO[tipo] || ''
}

/* ─── Video con autoplay al entrar al viewport ─────────────── */
function VideoMedia({ url }) {
  const { ref, inView } = useInView({ threshold: 0.6 })
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (inView) {
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [inView])

  return (
    <div ref={ref} className="w-full border-t border-b border-gray-200 bg-black">
      <video
        ref={videoRef}
        src={url}
        controls
        muted
        loop
        playsInline
        preload="metadata"
        className="w-full max-h-[600px]"
      />
    </div>
  )
}

/* ─── Fallback: tarjeta horizontal clickable ───────────────── */
function DocFallback({ url, titulo, color, Icon, subtitulo = 'Haz clic para descargar' }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      download
      className="flex items-center gap-3 px-4 py-3 border-t border-b border-gray-200 hover:bg-gray-50 transition-colors group"
    >
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: color }}
      >
        <Icon className="w-6 h-6 text-white" strokeWidth={2} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">{titulo}</p>
        <p className="text-xs text-gray-500 mt-0.5">{subtitulo}</p>
      </div>

      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#0A66C2] shrink-0" />
    </a>
  )
}

/* ─── PDF: slider de páginas o tarjeta fallback ────────────── */
function PdfMedia({ url, paginas, nombre }) {
  if (paginas > 0) {
    return <MediaSlider url={url} paginas={paginas} titulo="Documento PDF" />
  }

  return (
    <DocFallback
      url={urlDescargaCloudinary(url, nombre)}
      titulo={nombre || 'Documento PDF'}
      color="#D93025"
      Icon={FileText}
    />
  )
}

/* ─── PowerPoint: solo tarjeta clickable (sin vista previa) ── */
function PptMedia({ url, nombre, tipo }) {
  const ext = getExt(url, tipo)
  const label = ext === 'pptx' ? 'PPTX' : 'PPT'

  return (
    <DocFallback
      url={urlDescargaCloudinary(url, nombre)}
      titulo={nombre || `Presentación ${label}`}
      subtitulo="Haz clic para descargar"
      color="#E8710A"
      Icon={Presentation}
    />
  )
}

/* ─── Item individual no-imagen: video, pdf o ppt ──────────── */
function OtroMedia({ archivo }) {
  const { url, tipo = '', paginas = 0, nombre = '' } = archivo
  if (!url) return null

  if (tipo.startsWith('video/')) return <VideoMedia url={url} />
  if (tipo === 'application/pdf') return <PdfMedia url={url} paginas={paginas} nombre={nombre} />
  if (PPT_MIME_TYPES.includes(tipo)) return <PptMedia url={url} nombre={nombre} tipo={tipo} />

  return null
}

/* ─── Componente público ───────────────────────────────────── */
export default function PostMedia({ archivos = [] }) {
  if (!archivos.length) return null

  const imagenes = archivos.filter((a) => a.tipo?.startsWith('image/'))
  const otros = archivos.filter((a) => !a.tipo?.startsWith('image/'))

  return (
    <div>
      {imagenes.length > 0 && (
        <ImageGrid urls={imagenes.map((a) => a.url)} />
      )}

      {otros.map((archivo, i) => (
        <OtroMedia key={i} archivo={archivo} />
      ))}
    </div>
  )
}
