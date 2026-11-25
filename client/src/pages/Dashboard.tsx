import { motion } from 'framer-motion'
import { AlertCircle, ArrowRight, CheckCircle2, Loader2, Phone, Users, Zap } from 'lucide-react'
import { useLeads } from '../context/LeadsContext'
import { useStats } from '../hooks/useStats'
import { greeting } from '../lib/format'
import { riseIn, stagger } from '../lib/motion'
import KpiCard from '../components/KpiCard'
import TrendChart from '../components/TrendChart'
import SourceDonut from '../components/SourceDonut'
import LeadsTable from '../components/LeadsTable'
import QuickActions from '../components/QuickActions'
import type { Page } from '../types'

interface Props {
  onAdd: () => void
  onImport: () => void
  onExport: () => void
  onNavigate: (page: Page) => void
}

export default function Dashboard({ onAdd, onImport, onExport, onNavigate }: Props) {
  const { leads, loading, error, stats: dashboardStats, statsLoading, statsError, refreshData } = useLeads()
  const stats = useStats(leads, dashboardStats)
  const recent = [...leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5)

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5 px-4 pb-10 pt-6 sm:px-8">
      <motion.div variants={riseIn}>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {greeting()}, <span className="text-brand-600">Samarth</span>
        </h1>
        <p className="mt-1.5 text-base text-slate-600">Manage leads, track progress and drive conversions with ARKVUE.</p>
      </motion.div>

      {statsLoading && (
        <div role="status" className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <Loader2 size={16} className="animate-spin text-brand-600" /> Loading dashboard statistics…
        </div>
      )}
      {statsError && (
        <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <span className="flex items-center gap-2"><AlertCircle size={16} /> {statsError}</span>
          <button onClick={() => void refreshData()} className="font-bold underline underline-offset-2">Try again</button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total Leads" value={stats.total} loading={statsLoading || !!statsError} icon={Users} iconClass="bg-brand-100 text-brand-600" />
        <KpiCard label="New Leads" value={stats.newLeads} loading={statsLoading || !!statsError} icon={Zap} iconClass="bg-violet-100 text-violet-600" />
        <KpiCard label="Contacted Leads" value={stats.contacted} loading={statsLoading || !!statsError} icon={Phone} iconClass="bg-sky-100 text-sky-600" />
        <KpiCard label="Converted Leads" value={stats.converted} loading={statsLoading || !!statsError} icon={CheckCircle2} iconClass="bg-emerald-100 text-emerald-600" />
      </div>

      <div className="grid gap-5 lg:grid-cols-5">
        <TrendChart leads={leads} />
        <SourceDonut total={stats.total} sources={stats.sources} />
      </div>

      <div className="grid gap-5 lg:grid-cols-4">
        <motion.section variants={riseIn} className="glass-card p-6 lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2.5 text-lg font-bold text-slate-900">
              <Users size={22} className="text-brand-600" /> Recent Leads
            </h2>
            <button onClick={() => onNavigate('leads')} className="group inline-flex items-center gap-1 text-sm font-bold text-brand-600 hover:text-brand-700">
              View All Leads <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          {loading ? (
            <div role="status" className="flex items-center justify-center gap-2 py-10 text-sm font-medium text-slate-600">
              <Loader2 size={17} className="animate-spin text-brand-600" /> Loading recent leads…
            </div>
          ) : error ? (
            <div role="alert" className="flex flex-wrap items-center justify-between gap-3 py-6 text-sm text-rose-700">
              <span className="flex items-center gap-2"><AlertCircle size={16} /> {error}</span>
              <button onClick={() => void refreshData()} className="font-bold underline underline-offset-2">Try again</button>
            </div>
          ) : (
            <LeadsTable leads={recent} compact />
          )}
        </motion.section>
        <QuickActions onAdd={onAdd} onImport={onImport} onExport={onExport} />
      </div>
    </motion.div>
  )
}
