import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Bell, ChevronDown, Menu, Search, Users, ArrowRight, LayoutDashboard, BarChart3, Settings, type LucideIcon } from 'lucide-react'
import type { Page } from '../types'
import { useToast } from '../context/ToastContext'

const TITLES: Record<Page, { label: string; icon: LucideIcon }> = {
  dashboard: { label: 'Dashboard', icon: LayoutDashboard },
  leads: { label: 'Lead Management', icon: Users },
  analytics: { label: 'Analytics', icon: BarChart3 },
  settings: { label: 'Settings', icon: Settings },
}

interface Props {
  page: Page
  query: string
  onQueryChange: (q: string) => void
  onMenu: () => void
}

export default function Header({ page, query, onQueryChange, onMenu }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const toast = useToast()
  const { label, icon: Icon } = TITLES[page]

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header className="relative z-10 flex flex-wrap items-center gap-3 px-4 pt-5 sm:px-8 lg:flex-nowrap">
      <button onClick={onMenu} className="rounded-xl border border-brand-100 bg-white p-2.5 text-slate-600 lg:hidden" aria-label="Open menu">
        <Menu size={20} />
      </button>

      <div className="flex items-center gap-2.5 text-brand-700">
        <Icon size={20} />
        <span className="text-[15px] font-bold text-slate-900">{label}</span>
        <ArrowRight size={14} className="text-slate-400" />
      </div>

      <div className="ml-auto flex w-full items-center gap-3 sm:w-auto lg:ml-auto">
        <label className="group flex h-11 min-w-0 flex-1 items-center gap-2.5 rounded-2xl border border-white bg-white/80 px-4 shadow-soft backdrop-blur transition focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-500/15 sm:w-[380px] sm:flex-none">
          <Search size={18} className="shrink-0 text-slate-500" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search leads, companies, or emails..."
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
          <kbd className="hidden rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[11px] font-medium text-slate-500 sm:block">Ctrl K</kbd>
        </label>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => toast.info('You’re all caught up', 'No new notifications right now.')}
          className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white bg-white/80 text-slate-700 shadow-soft backdrop-blur"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-brand-600" />
        </motion.button>

        <motion.div whileHover={{ y: -2 }} className="flex shrink-0 cursor-pointer items-center gap-2.5 rounded-2xl py-1 pl-1 pr-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-sm font-bold text-white shadow-lift">
            ST
          </span>
          <span className="hidden text-sm font-bold text-slate-900 sm:block">Samarth Talwar</span>
          <ChevronDown size={16} className="hidden text-slate-600 sm:block" />
        </motion.div>
      </div>
    </header>
  )
}
