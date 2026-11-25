import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, ChevronDown, Download, Loader2, Plus, Search, SearchX, Upload } from 'lucide-react'
import { useLeads } from '../context/LeadsContext'
import { riseIn, stagger } from '../lib/motion'
import { SOURCES, STATUSES, type Lead } from '../types'
import LeadsTable from '../components/LeadsTable'
import Pagination from '../components/Pagination'

const PAGE_SIZE = 8

interface Props {
  query: string
  onQueryChange: (q: string) => void
  onAdd: () => void
  onEdit: (lead: Lead) => void
  onImport: () => void
  onExport: () => void
}

function Select({ value, onChange, options, all }: { value: string; onChange: (v: string) => void; options: readonly string[]; all: string }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full appearance-none rounded-xl border border-brand-100 bg-white pl-3.5 pr-9 text-sm font-semibold text-slate-700 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 sm:w-40"
      >
        <option value="">{all}</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
    </div>
  )
}

export default function Leads({ query, onQueryChange, onAdd, onEdit, onImport, onExport }: Props) {
  const { leads, loading, error, refreshData } = useLeads()
  const [status, setStatus] = useState('')
  const [source, setSource] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return leads
      .filter((l) => (!status || l.status === status) && (!source || l.source === source))
      .filter((l) => !q || [l.name, l.company, l.email, l.phone].some((v) => v.toLowerCase().includes(q)))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }, [leads, query, status, source])

  useEffect(() => setPage(1), [query, status, source])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, pageCount)
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)
  const from = filtered.length ? (current - 1) * PAGE_SIZE + 1 : 0
  const to = Math.min(current * PAGE_SIZE, filtered.length)

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5 px-4 pb-10 pt-6 sm:px-8">
      <motion.div variants={riseIn} className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            All <span className="text-brand-600">Leads</span>
          </h1>
          <p className="mt-1.5 text-base text-slate-600">Search, filter and manage every lead in one place.</p>
        </div>
        <div className="flex gap-2.5">
          <button onClick={onImport} className="btn-ghost">
            <Upload size={16} /> Import
          </button>
          <button onClick={onExport} className="btn-ghost">
            <Download size={16} /> Export
          </button>
          <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} onClick={onAdd} className="btn-primary">
            <Plus size={17} /> Add Lead
          </motion.button>
        </div>
      </motion.div>

      <motion.section variants={riseIn} className="glass-card p-5 sm:p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row">
          <label className="flex h-11 flex-1 items-center gap-2.5 rounded-xl border border-brand-100 bg-white px-3.5 transition focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/15">
            <Search size={17} className="text-slate-500" />
            <input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search by name, company, email or phone"
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </label>
          <Select value={status} onChange={setStatus} options={STATUSES} all="All statuses" />
          <Select value={source} onChange={setSource} options={SOURCES} all="All sources" />
        </div>

        {loading ? (
          <div role="status" className="flex items-center justify-center gap-2 py-16 text-sm font-medium text-slate-600">
            <Loader2 size={18} className="animate-spin text-brand-600" /> Loading leads…
          </div>
        ) : error ? (
          <div role="alert" className="flex flex-col items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50/70 py-12 text-center text-sm text-rose-700">
            <AlertCircle size={24} />
            <p>{error}</p>
            <button onClick={() => void refreshData()} className="font-bold underline underline-offset-2">Try again</button>
          </div>
        ) : rows.length ? (
          <LeadsTable leads={rows} onEdit={onEdit} />
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-brand-200 bg-brand-50/40 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-600">
              <SearchX size={26} />
            </span>
            <p className="font-bold text-slate-800">No leads match your filters</p>
            <button
              onClick={() => {
                onQueryChange('')
                setStatus('')
                setSource('')
              }}
              className="text-sm font-bold text-brand-600 hover:text-brand-700"
            >
              Clear filters
            </button>
          </motion.div>
        )}

        <div className="mt-5 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-sm font-medium text-slate-600">
            Showing <span className="font-bold text-slate-900">{from}–{to}</span> of <span className="font-bold text-slate-900">{filtered.length}</span> leads
          </p>
          {filtered.length > PAGE_SIZE && <Pagination page={current} pageCount={pageCount} onChange={setPage} />}
        </div>
      </motion.section>
    </motion.div>
  )
}
