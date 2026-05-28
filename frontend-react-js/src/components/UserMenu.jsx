import { useEffect, useRef, useState } from 'react'
import { ChevronDown, LogOut } from 'lucide-react'
import useAuth from '../hooks/useAuth'
import UserAvatar from './UserAvatar'

/* Botón del header con avatar del usuario y dropdown para cerrar sesión. */
export default function UserMenu() {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)
  const { user, cerrarSesion } = useAuth()

  /* Cerrar al hacer click fuera */
  useEffect(() => {
    if (!open) return

    const handler = (e) => {
      if (wrapperRef.current?.contains(e.target)) return
      setOpen(false)
    }

    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  if (!user) return null

  const avatar = user.photoURL
  const nombre = user.displayName || user.email || 'Usuario'

  const handleLogout = async () => {
    setOpen(false)
    await cerrarSesion()
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex flex-col items-center justify-center gap-0.5 px-3 h-14 min-w-[52px] text-xs text-gray-500 hover:text-black transition-colors group hover:cursor-pointer"
      >
        <UserAvatar
          src={avatar}
          name={nombre}
          size="xs"
          className="bg-gray-300 ring-1 ring-gray-300 group-hover:ring-black transition-all"
        />
        <span className="hidden md:flex items-center gap-0.5">
          Yo <ChevronDown className="w-3 h-3" />
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-1 w-64 bg-white rounded-lg border border-gray-200 overflow-hidden z-60"
        >
          <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-3">
            <UserAvatar src={avatar} name={nombre} size="lg" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{nombre}</p>
              {user.email && (
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              )}
            </div>
          </div>

          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )
}
