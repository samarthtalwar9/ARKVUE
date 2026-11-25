import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  page: number
  pageCount: number
  onChange: (page: number) => void
}

export default function Pagination({ page, pageCount, onChange }: Props) {
  const btn = 'flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-40'
  return (
    <div className="flex items-center gap-1.5">
      <button className={`${btn} border border-brand-100 bg-white text-slate-600 hover:bg-brand-50`} disabled={page === 1} onClick={() => onChange(page - 1)} aria-label="Previous page">
        <ChevronLeft size={16} />
      </button>
      {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
        <button key={p} onClick={() => onChange(p)} className={`${btn} relative ${p === page ? 'text-white' : 'text-slate-600 hover:bg-brand-50'}`}>
          {p === page && (
            <motion.span layoutId="page-pill" className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand-600 to-brand-500 shadow-lift" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
          )}
          <span className="relative">{p}</span>
        </button>
      ))}
      <button className={`${btn} border border-brand-100 bg-white text-slate-600 hover:bg-brand-50`} disabled={page === pageCount} onClick={() => onChange(page + 1)} aria-label="Next page">
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
