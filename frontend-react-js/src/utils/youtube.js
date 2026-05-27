/* Detecta una URL de YouTube en el texto y devuelve el ID del video.
   Soporta youtu.be, youtube.com/watch, /shorts y /embed. */

const YOUTUBE_REGEX = /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})(?:[?&#][^\s]*)?/i

export const extraerIdYoutube = (texto = '') => {
  if (!texto) return null
  const match = texto.match(YOUTUBE_REGEX)
  return match ? match[1] : null
}
