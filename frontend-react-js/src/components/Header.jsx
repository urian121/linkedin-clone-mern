import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Search,
  Home,
  Users,
  Briefcase,
  MessageSquare,
  Bell,
  Grid3X3,
} from 'lucide-react'
import logoLinkedin from "../assets/img/linkedin.png"
import UserMenu from './UserMenu'

const NAV_ITEMS = [
  { to: '/',               icon: Home,          label: 'Inicio' },
  { to: '/mi-red',         icon: Users,         label: 'Mi red' },
  { to: '/empleos',        icon: Briefcase,     label: 'Empleos' },
  { to: '/mensajeria',     icon: MessageSquare, label: 'Mensajería' },
  { to: '/notificaciones', icon: Bell,          label: 'Notificaciones', badge: 1 },
]

export default function Header() {
  const [searchValue, setSearchValue] = useState('')

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1128px] mx-auto px-4 flex items-center gap-2 h-14">

        {/* ── Logo LinkedIn ── */}
        <NavLink to="/" aria-label="LinkedIn" className="shrink-0 mr-1">
          <img src={logoLinkedin} alt="Linkedin Devs" style={{ width: '32px', height: '32px' }} />
        </NavLink>

        {/* ── Buscador (desktop) ── */}
        <div className="relative hidden sm:flex items-center bg-white border border-gray-300 rounded-full w-[280px] shrink-0 focus-within:border-gray-500 transition-colors">
          <Search className="absolute left-4 text-gray-700 w-4 h-4" strokeWidth={2.5} />
          <input
            type="text"
            placeholder="Buscar"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full bg-transparent pl-10 pr-4 py-2 text-sm text-gray-800 placeholder-gray-500 outline-none rounded-full"
          />
        </div>

        {/* ── Buscador (mobile: solo ícono) ── */}
        <button
          type="button"
          aria-label="Buscar"
          className="sm:hidden shrink-0 w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <Search className="w-5 h-5" strokeWidth={2.5} />
        </button>

        {/* ── Nav: links con scroll; perfil/apps fuera para que el dropdown no se recorte ── */}
        <nav className="flex items-center gap-1 ml-auto min-w-0">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide min-w-0">
            {NAV_ITEMS.map(({ to, icon: Icon, label, badge }) => (
              <NavLink
                key={label}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `relative shrink-0 flex flex-col items-center justify-center gap-0.5 px-3 sm:px-4 h-14 min-w-[52px] text-xs font-medium transition-colors hover:cursor-pointer
                  ${isActive
                    ? 'text-black border-b-2 border-black'
                    : 'text-gray-500 hover:text-black'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="relative">
                      <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 1.8} />
                      {badge ? (
                        <span className="absolute -top-1 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full leading-none">
                          {badge}
                        </span>
                      ) : null}
                    </span>
                    <span className="hidden md:block">{label}</span>
                  </>
                )}
              </NavLink>
            ))}

            <div className="hidden lg:block shrink-0 w-px h-8 bg-gray-300 mx-1" />
          </div>

          <div className="flex items-center shrink-0">
            <UserMenu />

            <button
              type="button"
              className="flex flex-col items-center justify-center gap-0.5 px-3 h-14 min-w-[52px] text-xs text-gray-500 hover:text-black transition-colors hover:cursor-pointer"
            >
              <Grid3X3 className="w-6 h-6" strokeWidth={1.8} />
              <span className="hidden md:block">Para empresas</span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}
