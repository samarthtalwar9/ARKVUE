import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { useCountUp } from '../hooks/useCountUp'
import { riseIn } from '../lib/motion'

interface Props {
  label: string
  value: number
  loading?: boolean
  icon: LucideIcon
  iconClass: string
}

export default function KpiCard({ label, value, loading = false, icon: Icon, iconClass }: Props) {
  const shown = useCountUp(value)

  return (
    <motion.div
      variants={riseIn}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="glass-card group relative overflow-hidden p-5 transition-shadow duration-300 hover:shadow-glow"
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-brand-300/30 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative flex items-center gap-4">
        <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${iconClass}`}>
          <Icon size={28} strokeWidth={1.8} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-700">{label}</p>
          <div className="mt-0.5">
            <p className="text-4xl font-extrabold tracking-tight text-slate-900 tabular-nums">{loading ? '—' : shown}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
