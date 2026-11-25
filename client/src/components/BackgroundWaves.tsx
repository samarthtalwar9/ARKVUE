import { motion } from 'framer-motion'

/** Soft animated purple waves + drifting glow blobs behind the workspace. */
export default function BackgroundWaves() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute -right-32 -top-40 h-[520px] w-[520px] rounded-full bg-brand-300/40 blur-3xl"
        animate={{ x: [0, -50, 0], y: [0, 40, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -left-24 bottom-0 h-[420px] w-[420px] rounded-full bg-fuchsia-300/25 blur-3xl"
        animate={{ x: [0, 60, 0], y: [0, -30, 0], scale: [1.05, 1, 1.05] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.svg
        className="absolute right-0 top-0 h-[340px] w-[120%] max-w-none"
        viewBox="0 0 1440 340"
        preserveAspectRatio="none"
        animate={{ x: [0, -70, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      >
        <defs>
          <linearGradient id="wave-a" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#c0aaff" stopOpacity="0" />
            <stop offset="55%" stopColor="#a07dff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#7c4dea" stopOpacity="0.45" />
          </linearGradient>
          <linearGradient id="wave-b" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#e9d5ff" stopOpacity="0" />
            <stop offset="60%" stopColor="#d8b4fe" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <path d="M0,200 C220,90 430,250 700,150 C960,55 1180,210 1440,90 L1440,0 L0,0 Z" fill="url(#wave-a)" />
        <path d="M0,250 C260,160 470,300 760,200 C1010,115 1210,250 1440,150 L1440,0 L0,0 Z" fill="url(#wave-b)" opacity="0.7" />
        <path
          d="M0,180 C240,70 450,230 720,130 C980,35 1200,190 1440,70"
          fill="none"
          stroke="#fff"
          strokeOpacity="0.55"
          strokeWidth="1.5"
        />
      </motion.svg>
    </div>
  )
}
