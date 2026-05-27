import { Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

/* Envuelve rutas que requieren sesión. Mientras Firebase verifica la sesión
   persistente muestra un loader; si no hay user, redirige a /login. */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F3F2EF]">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#0A66C2] rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  return children
}
