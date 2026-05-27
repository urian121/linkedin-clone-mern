import { useState } from 'react'
import { Plus } from 'lucide-react'
import InfiniteScroll from 'react-infinite-scroll-component'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/es'

import Header from '../components/Header'
import PostCard from '../components/PostCard'
import CreatePostModal from '../components/CreatePostModal'
import HomeSkeleton from '../components/Skeleton/HomeSkeleton'
import LoadingMore from '../components/LoadingMore'
import UserAvatar from '../components/UserAvatar'
import usePosts from '../hooks/usePosts'
import useAuth from '../hooks/useAuth'

dayjs.extend(relativeTime)
dayjs.locale('es')

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

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false)
  const { user } = useAuth()
  const {
    posts,
    loading,
    loadingMore,
    hayMas,
    error,
    cargarMas,
    reintentar,
    agregarPost
  } = usePosts()

  const miAvatar = user?.photoURL || null
  const miNombre = user?.displayName || user?.email || 'Tú'

  if (loading) return <HomeSkeleton count={3} />

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F3F2EF] py-6">
        <div className="max-w-[650px] mx-auto px-4 w-full">
          <section className="flex flex-col gap-3">
            {/* Caja "Crear post" */}
            <div className="bg-white rounded-lg border border-gray-200 px-4 py-3 flex items-center gap-3">
              <UserAvatar src={miAvatar} name={miNombre} size="md" />
              <button
                onClick={() => setModalOpen(true)}
                className="flex-1 text-left text-sm text-gray-600 border border-gray-400 rounded-full px-4 py-2 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Empieza una publicación
              </button>
            </div>

            {error && (
              <div className="bg-white rounded-lg border border-red-200 p-5 text-center">
                <p className="text-sm text-red-700 mb-3">{error}</p>
                <button
                  onClick={reintentar}
                  className="px-4 py-1.5 rounded-full text-sm font-semibold bg-[#0A66C2] text-white hover:bg-[#004182] cursor-pointer transition-colors"
                >
                  Reintentar
                </button>
              </div>
            )}

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

            {/* Scroll infinito: pide más cuando el usuario llega al fondo */}
            {!error && posts.length > 0 && (
              <InfiniteScroll
                dataLength={posts.length}
                next={cargarMas}
                hasMore={hayMas}
                loader={loadingMore && <LoadingMore />}
                endMessage={
                  <p className="text-center text-xs text-gray-500 py-4">
                    Has visto todas las publicaciones
                  </p>
                }
                scrollThreshold={0.9}
                className="flex flex-col gap-3 overflow-visible!"
              >
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
                    currentUserAvatar={miAvatar}
                  />
                ))}
              </InfiniteScroll>
            )}
          </section>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          aria-label="Crear publicación"
          className="fixed bottom-7 right-7 z-50 w-14 h-14 rounded-full bg-[#0A66C2] text-white flex items-center justify-center hover:bg-[#004182] active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-7 h-7" strokeWidth={2.5} />
        </button>

        <CreatePostModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onPosted={agregarPost}
        />
      </main>
    </>
  )
}
