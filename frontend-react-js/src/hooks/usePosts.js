import { useEffect, useState, useCallback } from 'react'

const API_URL = import.meta.env.VITE_API_URL
const LIMITE = Number(import.meta.env.VITE_POSTS_POR_PAGINA) || 3
const MIN_SKELETON_MS = 2000

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/* Gestiona el feed paginado: estado inicial, "cargar más", error y reintento.
   Devuelve también `agregarPost` para insertar publicaciones nuevas al tope. */
export default function usePosts() {
  const [posts, setPosts] = useState([])
  const [pagina, setPagina] = useState(1)
  const [hayMas, setHayMas] = useState(true)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  /* Carga inicial */
  useEffect(() => {
    let cancelado = false

    ;(async () => {
      try {
        const [res] = await Promise.all([
          fetch(`${API_URL}/obtenerpublicaciones?pagina=1&limite=${LIMITE}`),
          sleep(MIN_SKELETON_MS)
        ])

        if (!res.ok) throw new Error(`Error ${res.status} al cargar publicaciones`)

        const data = await res.json()
        if (cancelado) return

        setPosts(data.publicaciones || [])
        setHayMas(!!data.hayMas)
        setPagina(1)
        setError(null)
      } catch (err) {
        if (cancelado) return
        setError(err.message || 'No se pudieron cargar las publicaciones.')
      } finally {
        if (!cancelado) setLoading(false)
      }
    })()

    return () => { cancelado = true }
  }, [reloadKey])

  /* Trae la siguiente página y la concatena */
  const cargarMas = useCallback(async () => {
    if (loadingMore || !hayMas) return

    setLoadingMore(true)
    try {
      const siguiente = pagina + 1
      const res = await fetch(
        `${API_URL}/obtenerpublicaciones?pagina=${siguiente}&limite=${LIMITE}`
      )

      if (!res.ok) throw new Error(`Error ${res.status}`)

      const data = await res.json()
      setPosts((prev) => [...prev, ...(data.publicaciones || [])])
      setHayMas(!!data.hayMas)
      setPagina(siguiente)
    } catch (err) {
      console.error('No se pudieron cargar más publicaciones:', err)
      setHayMas(false)
    } finally {
      setLoadingMore(false)
    }
  }, [pagina, hayMas, loadingMore])

  const reintentar = useCallback(() => {
    setLoading(true)
    setError(null)
    setReloadKey((k) => k + 1)
  }, [])

  const agregarPost = useCallback((nuevo) => {
    if (!nuevo) return
    setPosts((prev) => [nuevo, ...prev])
  }, [])

  return {
    posts,
    loading,
    loadingMore,
    hayMas,
    error,
    cargarMas,
    reintentar,
    agregarPost
  }
}
