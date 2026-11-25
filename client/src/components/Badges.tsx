import { Briefcase, CalendarDays, Globe, Sparkles, Users, type LucideIcon } from 'lucide-react'
import type { LeadSource, LeadStatus } from '../types'

const STATUS_STYLE: Record<LeadStatus, string> = {
  New: 'bg-brand-100 text-brand-700',
  Contacted: 'bg-sky-100 text-sky-700',
  Qualified: 'bg-amber-100 text-amber-700',
  Converted: 'bg-emerald-100 text-emerald-700',
}

const SOURCE_STYLE: Record<LeadSource, { icon: LucideIcon; cls: string }> = {
  Website: { icon: Globe, cls: 'bg-brand-50 text-brand-700' },
  Referral: { icon: Users, cls: 'bg-emerald-50 text-emerald-700' },
  LinkedIn: { icon: Briefcase, cls: 'bg-sky-50 text-sky-700' },
  Event: { icon: CalendarDays, cls: 'bg-pink-50 text-pink-600' },
  Other: { icon: Sparkles, cls: 'bg-slate-100 text-slate-600' },
}

export function StatusBadge({ status }: { status: LeadStatus }) {
  return <span className={`inline-block rounded-lg px-2.5 py-1 text-xs font-bold ${STATUS_STYLE[status]}`}>{status}</span>
}

export function SourceBadge({ source }: { source: LeadSource }) {
  const { icon: Icon, cls } = SOURCE_STYLE[source]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${cls}`}>
      <Icon size={13} /> {source}
    </span>
  )
}
