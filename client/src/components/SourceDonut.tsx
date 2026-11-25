import { useState } from 'react'
import { motion } from 'framer-motion'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { Layers } from 'lucide-react'
import { riseIn } from '../lib/motion'

const COLORS = ['#4a22be', '#a07dff', '#c4adfb', '#f5a8e8', '#fbd0f1']

interface Props {
  total: number
  sources: { name: string; value: number }[]
}

export default function SourceDonut({ total, sources }: Props) {
  const [hover, setHover] = useState<number | null>(null)

  return (
    <motion.section variants={riseIn} className="glass-card p-6 lg:col-span-2">
      <h2 className="mb-2 flex items-center gap-2.5 text-lg font-bold text-slate-900">
        <Layers size={22} className="text-brand-600" /> Leads by Source
      </h2>

      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <div className="relative h-[200px] w-[200px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sources}
                dataKey="value"
                innerRadius={62}
                outerRadius={96}
                paddingAngle={2}
                cornerRadius={4}
                stroke="none"
                startAngle={90}
                endAngle={-270}
                isAnimationActive
                animationDuration={1300}
                onMouseLeave={() => setHover(null)}
              >
                {sources.map((s, i) => (
                  <Cell
                    key={s.name}
                    fill={COLORS[i]}
                    opacity={hover === null || hover === i ? 1 : 0.35}
                    onMouseEnter={() => setHover(i)}
                    style={{ transition: 'opacity .25s', outline: 'none' }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-slate-900 tabular-nums">{total}</span>
            <span className="text-xs font-medium text-slate-500">Total Leads</span>
          </div>
        </div>

        <ul className="w-full flex-1 space-y-2.5">
          {sources.map((s, i) => (
            <motion.li
              key={s.name}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              whileHover={{ x: 4 }}
              className={`flex cursor-default items-center gap-2.5 text-sm transition-opacity ${hover === null || hover === i ? 'opacity-100' : 'opacity-50'}`}
            >
              <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: COLORS[i] }} />
              <span className="flex-1 font-medium text-slate-700">{s.name}</span>
              <span className="font-bold text-slate-900">{total ? Math.round((s.value / total) * 100) : 0}%</span>
              <span className="w-9 text-right text-slate-500">({s.value})</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.section>
  )
}
