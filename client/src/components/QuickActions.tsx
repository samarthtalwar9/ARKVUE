import { motion } from 'framer-motion'
import { Download, Plus, Upload, Zap } from 'lucide-react'
import { riseIn } from '../lib/motion'

interface Props {
  onAdd: () => void
  onImport: () => void
  onExport: () => void
}

export default function QuickActions({ onAdd, onImport, onExport }: Props) {
  return (
    <motion.section variants={riseIn} className="glass-card p-6 lg:col-span-1">
      <h2 className="mb-4 flex items-center gap-2.5 text-lg font-bold text-slate-900">
        <Zap size={22} className="text-brand-600" /> Quick Actions
      </h2>
      <div className="space-y-3">
        <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} onClick={onAdd} className="btn-primary w-full py-3">
          <Plus size={18} /> Add New Lead
        </motion.button>
        <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} onClick={onImport} className="btn-ghost w-full py-3">
          <Upload size={18} /> Import Leads
        </motion.button>
        <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} onClick={onExport} className="btn-ghost w-full py-3">
          <Download size={18} /> Export Leads
        </motion.button>
      </div>
    </motion.section>
  )
}
