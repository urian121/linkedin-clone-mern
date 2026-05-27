import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/es'

import Header from '../components/Header'
import PostCard from '../components/PostCard'
import CreatePostModal from '../components/CreatePostModal'
import HomeSkeleton from '../components/Skeleton/HomeSkeleton'

dayjs.extend(relativeTime)
dayjs.locale('es')

const API_URL = import.meta.env.VITE_API_URL
const MIN_SKELETON_MS = 2000

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/* ─── Helpers de presentación ─────────────────────────────── */

/* Paleta para colorear el avatar a partir del idusuario */
const AVATAR_COLORS = [
  '#C0392B', '#2980B9', '#27AE60', '#8E44AD',
  '#E67E22', '#16A085', '#D35400', '#34495E'
]

const colorFromString = (str = '') => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

/* ─── Página ──────────────────────────────────────────────── */
export default function Home() {
  const [modalOpen, setModalOpen] = useState(false)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  /* Carga las publicaciones; el setState ocurre solo después del await */
  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        const [res] = await Promise.all([
          fetch(`${API_URL}/obtenerpublicaciones`),
          sleep(MIN_SKELETON_MS)
        ])

        if (!res.ok) throw new Error(`Error ${res.status} al cargar publicaciones`)

        const data = await res.json()
        if (cancelled) return

        setPosts(Array.isArray(data) ? data : [])
        setError(null)
      } catch (err) {
        if (cancelled) return
        setError(err.message || 'No se pudieron cargar las publicaciones.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => { cancelled = true }
  }, [reloadKey])

  /* Reintento desde un event handler (permitido hacer setState aquí) */
  const handleRetry = () => {
    setLoading(true)
    setError(null)
    setReloadKey((k) => k + 1)
  }

  /* Cuando el modal publica con éxito, agregamos el post al feed */
  const handlePosted = (nueva) => {
    if (nueva) setPosts((prev) => [nueva, ...prev])
  }

  if (loading) return <HomeSkeleton count={3} />

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F3F2EF] py-6">
      <div className="max-w-[650px] mx-auto px-4 w-full">
        {/* ── Columna central: Feed ───────────────────────── */}
        <section className="flex flex-col gap-3">
          {/* Caja "Crear post" */}
          <div className="bg-white rounded-lg border border-gray-200 px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 shrink-0">
              <img
                src="https://i.pravatar.cc/48?img=12"
                alt="Tú"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="flex-1 text-left text-sm text-gray-600 border border-gray-400 rounded-full px-4 py-2 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Empieza una publicación
            </button>
          </div>

          {/* Estado: error */}
          {error && (
            <div className="bg-white rounded-lg border border-red-200 p-5 text-center">
              <p className="text-sm text-red-700 mb-3">{error}</p>
              <button
                onClick={handleRetry}
                className="px-4 py-1.5 rounded-full text-sm font-semibold bg-[#0A66C2] text-white hover:bg-[#004182] cursor-pointer transition-colors"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Estado: vacío */}
          {!error && posts.length === 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-gray-700 text-sm font-medium">
                Aún no hay publicaciones
              </p>
              <p className="text-gray-500 text-xs mt-1">
                ¡Sé el primero en compartir algo con la comunidad!
              </p>
            </div>
          )}

          {/* Posts desde MongoDB */}
          {posts.map((post) => (
            <PostCard
              key={post._id}
              id={post._id}
              name={post.idusuario || 'Usuario'}
              avatarColor={colorFromString(post.idusuario)}
              subtitle="Miembro de LinkedIn Devs"
              time={post.fecha ? dayjs(post.fecha).fromNow() : ''}
              isPublic
              content={post.texto || ''}
              archivos={post.archivos || []}
              initialRecomendaciones={post.recomendaciones || 0}
              currentUserAvatar="https://i.pravatar.cc/48?img=12"
            />
          ))}
        </section>
      </div>

      {/* ── FAB: botón flotante crear publicación ─────────── */}
      <button
        onClick={() => setModalOpen(true)}
        aria-label="Crear publicación"
        className="fixed bottom-7 right-7 z-50 w-14 h-14 rounded-full bg-[#0A66C2] text-white flex items-center justify-center hover:bg-[#004182] active:scale-95 transition-all cursor-pointer"
      >
        <Plus className="w-7 h-7" strokeWidth={2.5} />
      </button>

      {/* ── Modal ─────────────────────────────────────────── */}
      <CreatePostModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onPosted={handlePosted}
      />
      </main>
    </>
  )
}
