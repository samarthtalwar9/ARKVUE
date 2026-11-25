import { motion } from 'framer-motion'
import { BarChart3, LayoutDashboard, Settings, TrendingUp, Users, X, type LucideIcon } from 'lucide-react'
import logo from '../assets/arkvue-logo.jpg'
import type { Page } from '../types'

const NAV: { id: Page; label: string; icon: LucideIcon }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'leads', label: 'Leads', icon: Users },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
]

interface Props {
  page: Page
  onNavigate: (page: Page) => void
  onClose?: () => void
}

export default function Sidebar({ page, onNavigate, onClose }: Props) {
  return (
    <aside className="relative flex h-full w-[260px] shrink-0 flex-col overflow-hidden bg-gradient-to-b from-navy-900 via-navy-800 to-navy-700 text-white">
      {/* decorative glow */}
      <motion.div
        className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute -top-10 left-0 h-24 w-full bg-gradient-to-r from-transparent via-brand-500/20 to-brand-300/30 blur-2xl"
        animate={{ x: [-40, 40, -40] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative flex items-center justify-between px-5 pb-6 pt-6">
        {/* Official logo, untouched — placed on its own light tile so it stays legible on navy */}
        <div className="overflow-hidden rounded-2xl bg-[#fbfbfb] shadow-lg shadow-black/30 ring-1 ring-white/20">
          <img src={logo} alt="ARKVUE" className="h-14 w-36 object-cover" draggable={false} />
        </div>
        {onClose && (
          <button onClick={onClose} className="rounded-lg p-2 text-white/70 hover:bg-white/10 lg:hidden" aria-label="Close menu">
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="relative flex-1 space-y-1.5 px-4">
        {NAV.map(({ id, label, icon: Icon }) => {
          const active = page === id
          return (
            <motion.button
              key={id}
              onClick={() => onNavigate(id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-[15px] font-semibold transition-colors ${
                active ? 'text-white' : 'text-white/65 hover:bg-white/5 hover:text-white'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 shadow-glow"
                  transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                />
              )}
              <Icon size={20} className="relative" />
              <span className="relative">{label}</span>
            </motion.button>
          )
        })}
      </nav>

      <motion.div
        whileHover={{ y: -4 }}
        className="relative m-4 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.03] p-5 backdrop-blur"
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
          <TrendingUp size={24} />
        </div>
        <p className="text-lg font-bold">Revenue OS</p>
        <p className="mt-1 text-sm leading-relaxed text-white/65">A unified platform to manage leads and drive revenue growth.</p>
      </motion.div>
    </aside>
  )
}
