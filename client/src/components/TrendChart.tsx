import { useState } from 'react'
import { motion } from 'framer-motion'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { BarChart3, ChevronDown } from 'lucide-react'
import { riseIn } from '../lib/motion'
import type { Lead } from '../types'

interface TipProps {
  active?: boolean
  payload?: { value?: number }[]
  label?: string
}

function ChartTip({ active, payload, label }: TipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl bg-brand-600 px-3 py-2 text-xs font-semibold text-white shadow-lift">
      <p className="text-white/70">{label}</p>
      <p className="text-sm">{payload[0].value} leads</p>
    </div>
  )
}

function getTrend(leads: Lead[], days: number) {
  const end = new Date()
  end.setHours(0, 0, 0, 0)
  const dates = Array.from({ length: days }, (_, index) => {
    const date = new Date(end)
    date.setDate(end.getDate() - days + index + 1)
    return date
  })
  const counts = new Map<string, number>()

  for (const lead of leads) {
    const date = new Date(lead.createdAt)
    if (Number.isNaN(date.getTime())) continue
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  return dates.map((date) => {
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
    return {
      day: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      leads: counts.get(key) ?? 0,
    }
  })
}

export default function TrendChart({ leads }: { leads: Lead[] }) {
  const [range, setRange] = useState<'7' | '14'>('7')
  const data = getTrend(leads, Number(range))
  const maxLeads = Math.max(10, ...data.map((point) => point.leads))
  const yMax = Math.ceil(maxLeads / 10) * 10

  return (
    <motion.section variants={riseIn} className="glass-card p-6 lg:col-span-3">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2.5 text-lg font-bold text-slate-900">
          <BarChart3 size={22} className="text-brand-600" /> Lead Acquisition Trend
        </h2>
        <div className="relative">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value as '7' | '14')}
            className="appearance-none rounded-lg border border-brand-100 bg-white py-1.5 pl-3 pr-8 text-xs font-semibold text-slate-700 outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-500/15"
          >
            <option value="7">Last 7 Days</option>
            <option value="14">Last 14 Days</option>
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
        </div>
      </div>

      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart key={range} data={data} margin={{ top: 16, right: 16, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c4dea" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#a07dff" stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#e7defc" strokeDasharray="3 4" vertical={false} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#475569' }} dy={8} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#475569' }} domain={[0, yMax]} />
            <Tooltip content={<ChartTip />} cursor={{ stroke: '#a07dff', strokeDasharray: '4 4' }} />
            <Area
              type="monotone"
              dataKey="leads"
              stroke="#5b2dde"
              strokeWidth={2.5}
              fill="url(#trend-fill)"
              dot={{ r: 4, fill: '#5b2dde', stroke: '#fff', strokeWidth: 2 }}
              activeDot={{ r: 7, fill: '#5b2dde', stroke: '#fff', strokeWidth: 3 }}
              isAnimationActive
              animationDuration={1400}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.section>
  )
}
