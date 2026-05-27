import LiteYouTubeEmbed from 'react-lite-youtube-embed'
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'

/* Reproductor ligero de YouTube. Acepta tanto un `id` ya extraído
   como una `url` completa para mayor comodidad. */
export default function YoutubeEmbed({ id, title = 'Video de YouTube', bordered = true }) {
  if (!id) return null

  return (
    <div
      className={
        bordered
          ? 'w-full border-t border-b border-gray-200 bg-black'
          : 'w-full bg-black rounded-lg overflow-hidden'
      }
    >
      <LiteYouTubeEmbed
        id={id}
        title={title}
        poster="hqdefault"
        noCookie
      />
    </div>
  )
}
