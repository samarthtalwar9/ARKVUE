import { AnimatePresence, motion } from 'framer-motion'
import { Pencil } from 'lucide-react'
import type { Lead } from '../types'
import { formatDate, initials } from '../lib/format'
import { SourceBadge, StatusBadge } from './Badges'

interface Props {
  leads: Lead[]
  onEdit?: (lead: Lead) => void
  compact?: boolean
}

export default function LeadsTable({ leads, onEdit, compact }: Props) {
  const pad = compact ? 'py-2.5' : 'py-3.5'
  return (
    <div className="overflow-x-auto rounded-2xl border border-brand-100/70 bg-white/60">
      <table className="w-full min-w-[820px] text-left text-sm">
        <thead>
          <tr className="text-xs font-bold text-slate-600">
            {['Name', 'Company', 'Email', 'Phone', 'Source', 'Status', 'Created At'].map((h) => (
              <th key={h} className="px-4 py-3">
                {h}
              </th>
            ))}
            {onEdit && <th className="px-4 py-3 text-right">Actions</th>}
          </tr>
        </thead>
        <tbody>
          <AnimatePresence mode="popLayout" initial={false}>
            {leads.map((l, i) => (
              <motion.tr
                key={l.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28, delay: Math.min(i * 0.03, 0.25) }}
                className="group border-t border-brand-100/60 transition-colors hover:bg-brand-50/70"
              >
                <td className={`px-4 ${pad}`}>
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[11px] font-bold text-brand-700">
                      {initials(l.name)}
                    </span>
                    <span className="font-bold text-slate-900">{l.name}</span>
                  </div>
                </td>
                <td className={`px-4 ${pad} text-slate-700`}>{l.company}</td>
                <td className={`px-4 ${pad} text-slate-700`}>{l.email}</td>
                <td className={`px-4 ${pad} whitespace-nowrap text-slate-700`}>{l.phone}</td>
                <td className={`px-4 ${pad}`}>
                  <SourceBadge source={l.source} />
                </td>
                <td className={`px-4 ${pad}`}>
                  <StatusBadge status={l.status} />
                </td>
                <td className={`px-4 ${pad} whitespace-nowrap text-slate-700`}>{formatDate(l.createdAt)}</td>
                {onEdit && (
                  <td className={`px-4 ${pad} text-right`}>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => onEdit(l)}
                      className="rounded-lg border border-brand-100 bg-white p-2 text-brand-600 opacity-70 shadow-sm transition hover:border-brand-300 hover:opacity-100 group-hover:opacity-100"
                      aria-label={`Edit ${l.name}`}
                    >
                      <Pencil size={15} />
                    </motion.button>
                  </td>
                )}
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  )
}
