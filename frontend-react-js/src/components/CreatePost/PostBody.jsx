import FilePreview from '../FilePreview'
import YoutubeEmbed from '../YoutubeEmbed'
import { extraerIdYoutube } from '../../utils/youtube'

/* Cuerpo del modal: textarea con autopreview de YouTube y rejilla de archivos. */
export default function PostBody({
  text,
  setText,
  textareaRef,
  files,
  onRemoveFile,
  loading,
}) {
  const youtubeId = extraerIdYoutube(text)
  const tienePreview = !!youtubeId || files.length > 0

  return (
    <div
      className={
        loading
          ? 'flex-1 px-6 py-5 opacity-60 pointer-events-none transition-opacity'
          : 'flex-1 px-6 py-5 transition-opacity'
      }
      aria-busy={loading}
    >
      <textarea
        ref={textareaRef}
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={loading}
        placeholder="¿Sobre qué quieres hablar?"
        rows={tienePreview ? 3 : 10}
        className="w-full resize-none text-gray-800 text-lg placeholder-gray-400 outline-none leading-relaxed"
      />

      {youtubeId && (
        <div className="mt-3 max-w-md mx-auto rounded-lg overflow-hidden border border-gray-200 bg-black">
          <YoutubeEmbed id={youtubeId} bordered={false} />
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {files.map((f, idx) => (
            <FilePreview
              key={idx}
              file={f.file}
              preview={f.preview}
              tipo={f.tipo}
              disabled={loading}
              onRemove={() => onRemoveFile(idx)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
