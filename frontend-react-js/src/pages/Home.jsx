import { useState } from 'react'
import { Plus } from 'lucide-react'
import PostCard from '../components/PostCard'
import CreatePostModal from '../components/CreatePostModal'

/* ─── Posts de ejemplo (simulan datos de la API) ─────────── */
const POSTS = [
  {
    id: 1,
    name: 'Fazt',
    avatarColor: '#C0392B',
    subtitle: 'Creador de contenido • Programación y tecnología',
    time: '1 h',
    isPublic: true,
    content:
      '🎉 ¿El nuevo lenguaje de Vercel es puro hype o realmente sirve?\n\nAcabo de subir un video donde analizo Zerolang, el lenguaje de programación experimental de Vercel pensado para agentes de IA. ¿Vale la pena aprenderlo o es solo marketing?',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    initialLikes: 5,
  },
  {
    id: 2,
    name: 'Midudev',
    avatarColor: '#2980B9',
    subtitle: 'Senior Frontend Engineer • Speaker • Open Source',
    time: '3 h',
    isPublic: true,
    content:
      '🚀 React 19 ya está aquí y trae cambios que van a redefinir cómo escribimos componentes. Los Server Components, el nuevo compilador y los hooks mejorados hacen que el código sea más limpio y performante que nunca. ¿Ya lo estás usando en producción?',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    initialLikes: 142,
  },
  {
    id: 3,
    name: 'Fireship',
    avatarColor: '#E67E22',
    subtitle: 'Full-stack web developer & content creator',
    time: '5 h',
    isPublic: true,
    content:
      '⚡ TypeScript 5.5 acaba de salir y tiene una feature que esperaba desde hace años: inferencia de tipos en closures de manera automática. En 100 segundos te explico todo lo que necesitas saber.',
    image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80',
    initialLikes: 87,
  },
]

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
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

          {/* Posts */}
          {POSTS.map((post) => (
            <PostCard
              key={post.id}
              name={post.name}
              avatarColor={post.avatarColor}
              subtitle={post.subtitle}
              time={post.time}
              isPublic={post.isPublic}
              content={post.content}
              image={post.image}
              initialLikes={post.initialLikes}
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
      />
    </main>
  )
}
