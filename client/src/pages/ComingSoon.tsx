import { motion } from 'framer-motion'
import { Hammer } from 'lucide-react'

export default function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} className="glass-card max-w-md p-10 text-center">
        <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-brand-600">
          <Hammer size={30} />
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900">{title}</h1>
        <p className="mt-2 text-slate-600">This module is on the roadmap. The dashboard and lead management are ready to explore.</p>
      </motion.div>
    </div>
  )
}
