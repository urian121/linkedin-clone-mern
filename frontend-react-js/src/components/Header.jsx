import { useState } from 'react'
import {
  Search,
  Home,
  Users,
  Briefcase,
  MessageSquare,
  Bell,
  Grid3X3,
  ChevronDown,
} from 'lucide-react'
import logoLinkedin from "../assets/img/linkedin.png"

const NAV_ITEMS = [
  { icon: Home, label: 'Inicio' },
  { icon: Users, label: 'Mi red' },
  { icon: Briefcase, label: 'Empleos' },
  { icon: MessageSquare, label: 'Mensajería' },
  { icon: Bell, label: 'Notificaciones', badge: 1 },
]

export default function Header() {
  const [activeNav, setActiveNav] = useState('Inicio')
  const [searchValue, setSearchValue] = useState('')

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1128px] mx-auto px-4 flex items-center gap-2 h-14">

        {/* ── Logo LinkedIn ── */}
        <a href="/" aria-label="LinkedIn" className="shrink-0 mr-1">
          <img src={logoLinkedin} alt="Linkedin Devs" style={{ width: '32px', height: '32px' }} />
        </a>

        {/* ── Buscador ── */}
        <div className="relative hidden sm:flex items-center bg-[#EEF3F8] rounded-md w-[280px] shrink-0">
          <Search className="absolute left-3 text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full bg-transparent pl-9 pr-3 py-2 text-sm text-gray-800 placeholder-gray-500 outline-none"
          />
        </div>

        {/* ── Separador + Nav central ── */}
        <nav className="flex items-center ml-auto gap-1">
          {NAV_ITEMS.map(({ icon: Icon, label, badge }) => (
            <button
              key={label}
              onClick={() => setActiveNav(label)}
              className={`relative flex flex-col items-center justify-center gap-0.5 px-3 sm:px-4 h-14 min-w-[52px] text-xs font-medium transition-colors hover:cursor-pointer
                ${
                  activeNav === label
                    ? 'text-black border-b-2 border-black'
                    : 'text-gray-500 hover:text-black'
                }`}
            >
              <span className="relative">
                <Icon className="w-6 h-6" strokeWidth={activeNav === label ? 2.5 : 1.8} />
                {badge ? (
                  <span className="absolute -top-1 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full leading-none">
                    {badge}
                  </span>
                ) : null}
              </span>
              <span className="hidden md:block">{label}</span>
            </button>
          ))}

          {/* Divisor vertical */}
          <div className="hidden lg:block w-px h-8 bg-gray-300 mx-1" />

          {/* ── Avatar / Perfil ── */}
          <button className="flex flex-col items-center justify-center gap-0.5 px-3 h-14 min-w-[52px] text-xs text-gray-500 hover:text-black transition-colors group hover:cursor-pointer">
            <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-300 ring-1 ring-gray-300 group-hover:ring-black transition-all">
              <img
                src="https://i.pravatar.cc/48?img=12"
                alt="Perfil"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="hidden md:flex items-center gap-0.5">
              Yo <ChevronDown className="w-3 h-3" />
            </span>
          </button>

          {/* ── Cuadrícula apps ── */}
          <button className="flex flex-col items-center justify-center gap-0.5 px-3 h-14 min-w-[52px] text-xs text-gray-500 hover:text-black transition-colors hover:cursor-pointer">
            <Grid3X3 className="w-6 h-6" strokeWidth={1.8} />
            <span className="hidden md:block">Para empresas</span>
          </button>
        </nav>
      </div>
    </header>
  )
}
