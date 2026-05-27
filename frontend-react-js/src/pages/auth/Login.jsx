import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { showToast } from 'nextjs-toast-notify'

import useAuth from '../../hooks/useAuth'
import logoLinkedin from '../../assets/img/linkedin.png'
import ilustracionLogin from '../../assets/img/login-linkedin.svg'
import GoogleButton from '../../components/GoogleButton'

export default function Login() {
  const { user, loading, loginConGoogle } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  /* Si ya hay sesión activa, no tiene sentido mostrar el login */
  useEffect(() => {
    if (user) navigate('/', { replace: true })
  }, [user, navigate])

  const handleGoogle = async () => {
    setSubmitting(true)
    try {
      await loginConGoogle()
    } catch (err) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        console.error(err)
        showToast.error('No se pudo iniciar sesión. Intenta de nuevo.', {
          position: 'bottom-right',
          transition: 'swingInverted',
        })
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || user) return null

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ── Header ─────────────────────────────────────────── */}
      <header className="border-b border-gray-200">
        <div className="max-w-[1128px] mx-auto px-6 py-3 flex items-center justify-between">
          <Link to="/login" aria-label="LinkedIn" className="flex items-center">
            <img src={logoLinkedin} alt="LinkedIn Devs" className="w-8 h-8" />
          </Link>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={submitting}
            className="px-5 py-1.5 rounded-full bg-[#0A66C2] hover:bg-[#004182] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            Iniciar sesión
          </button>
        </div>
      </header>

      {/* ── Contenido principal ────────────────────────────── */}
      <main className="flex-1 flex items-center">
        <div className="max-w-[1128px] mx-auto w-full px-6 py-10 grid md:grid-cols-[1fr_1fr] gap-10 items-center">

          {/* ── Columna izquierda: texto y CTA ─────────── */}
          <div className="max-w-md">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-[#B24020] leading-tight mb-8">
              ¡Te damos la bienvenida a tu comunidad de Devs!
            </h1>

            <GoogleButton onClick={handleGoogle} disabled={submitting} />

            <p className="text-xs text-gray-600 mt-5 leading-relaxed max-w-sm">
              Se parte de esta gran comunidad de Devs y conecta con otros desarrolladores.
            </p>

            <p className="text-sm text-gray-700 mt-8">
              ¿Estás empezando a usar LinkedIn?{' '}
              <button
                type="button"
                onClick={handleGoogle}
                disabled={submitting}
                className="text-[#0A66C2] font-semibold hover:underline disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                Únete ahora
              </button>
            </p>
          </div>

          {/* ── Columna derecha: ilustración ──────────── */}
          <div className="hidden md:flex justify-end">
            <img
              src={ilustracionLogin}
              alt="Persona trabajando en su comunidad profesional"
              className="w-full max-w-[520px]"
            />
          </div>

        </div>
      </main>
    </div>
  )
}
