import { useEffect, useState } from 'react'
import { Box } from '@mui/material'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789%$-'

const reduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/**
 * Split-flap "departure board" text. Each cell scrambles then settles left-to-right.
 * Under prefers-reduced-motion it renders the final text immediately.
 */
export function FlipText({ text, delay = 0, color = '#FFC531', size = 22 }: { text: string; delay?: number; color?: string; size?: number }) {
  const target = text.toUpperCase()
  const [shown, setShown] = useState(() => (reduced() ? target : target.replace(/[^ ]/g, ' ')))
  useEffect(() => {
    if (reduced()) {
      setShown(target)
      return
    }
    let tick = 0
    let iv: number | undefined
    const start = window.setTimeout(() => {
      iv = window.setInterval(() => {
        tick += 1
        const settled = Math.floor(tick / 2)
        setShown(
          [...target].map((ch, i) => (ch === ' ' || i < settled ? ch : CHARS[Math.floor(Math.random() * CHARS.length)])).join(''),
        )
        if (settled >= target.length) window.clearInterval(iv)
      }, 45)
    }, delay)
    return () => {
      window.clearTimeout(start)
      window.clearInterval(iv)
    }
  }, [target, delay])

  return (
    <Box component="span" aria-label={text} role="text" sx={{ display: 'inline-flex', flexWrap: 'wrap', gap: '3px' }}>
      {[...shown].map((ch, i) => (
        <Box
          key={i}
          aria-hidden
          sx={{
            position: 'relative', width: size * 0.78, height: size * 1.25, display: 'grid', placeItems: 'center',
            bgcolor: ch === ' ' ? 'transparent' : '#14132E', borderRadius: '3px', color, fontWeight: 700,
            fontFamily: '"JetBrains Mono", ui-monospace, monospace', fontSize: size * 0.82, lineHeight: 1,
            boxShadow: ch === ' ' ? 'none' : 'inset 0 -1px 0 rgba(255,255,255,.04), 0 1px 0 rgba(0,0,0,.4)',
            '&::after': ch === ' ' ? {} : { content: '""', position: 'absolute', left: 0, right: 0, top: '50%', height: '1px', bgcolor: 'rgba(0,0,0,.55)' },
          }}
        >
          {ch}
        </Box>
      ))}
    </Box>
  )
}
