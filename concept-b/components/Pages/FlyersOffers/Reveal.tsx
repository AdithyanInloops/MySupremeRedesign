import { m, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  delay?: number
  /** Direction the element slides in from. */
  from?: 'up' | 'left' | 'right'
  className?: string
  style?: React.CSSProperties
}

const offsets = { up: { x: 0, y: 40 }, left: { x: -60, y: 0 }, right: { x: 60, y: 0 } }

/** Fades and slides its children into place the first time they scroll into view. */
export function Reveal(props: RevealProps) {
  const { children, delay = 0, from = 'up', className, style } = props
  const reduceMotion = useReducedMotion()
  const offset = reduceMotion ? { x: 0, y: 0 } : offsets[from]

  return (
    <m.div
      className={className}
      style={style}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.div>
  )
}
