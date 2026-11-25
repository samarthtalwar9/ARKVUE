import { useEffect, useRef, useState } from 'react'
import { animate } from 'framer-motion'

/** Animates a number from its previous value to `target`. */
export function useCountUp(target: number, duration = 1.4): number {
  const [value, setValue] = useState(0)
  const from = useRef(0)

  useEffect(() => {
    const controls = animate(from.current, target, {
      duration,
      ease: 'easeOut',
      onUpdate: (latest) => {
        from.current = latest
        setValue(Math.round(latest))
      },
    })
    return () => controls.stop()
  }, [target, duration])

  return value
}
