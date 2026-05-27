/* Helpers para URLs de Cloudinary.
 *
 * Las URLs que guardamos en MongoDB tienen esta forma:
 *   https://res.cloudinary.com/<cloud>/image/upload/v123/<carpeta>/<uuid>.webp
 *
 * El segmento "/upload/" NO es una carpeta en tu backend ni en Cloudinary.
 * Es la ruta fija de la API de entrega: ahí Cloudinary inserta transformaciones
 * (redimensionar, página de PDF, forzar descarga, etc.) antes del public_id.
 *
 * Ejemplos al insertar transformaciones:
 *   .../upload/pg_2/...     → página 2 de un PDF como imagen
 *   .../upload/fl_attachment:nombre/... → descarga con nombre legible
 */

const SEGMENTO_UPLOAD = '/upload/'

export const esUrlCloudinary = (url = '') =>
  typeof url === 'string' && url.includes('cloudinary.com')

/** Inserta transformaciones justo después de "/upload/" en la URL. */
export const urlConTransformacion = (url, transformacion) => {
  if (!url || !transformacion) return url
  return url.replace(SEGMENTO_UPLOAD, `${SEGMENTO_UPLOAD}${transformacion}/`)
}

/** Página N de un PDF alojado en Cloudinary (pg_N). */
export const urlPaginaPdf = (url, pagina) =>
  urlConTransformacion(url, `pg_${pagina}`).replace(/\.(pdf|ppt|pptx)$/i, '.jpg')

/** Descarga con nombre legible (fl_attachment). Cloudinary añade la extensión. */
export const urlDescargaCloudinary = (url, nombre) => {
  if (!esUrlCloudinary(url)) return url

  const base = (nombre || '').trim().replace(/\.[^.]+$/, '') || 'documento'
  const seguro = base.replace(/[^\w-]/g, '_')

  return urlConTransformacion(url, `fl_attachment:${seguro}`)
}
