import { useEffect, useState, type ReactNode } from 'react'
import { Box, Typography, type SxProps, type Theme } from '@mui/material'
import { colors, radius, srOnly } from '../../lib/theme'
import { endsAt } from './deals'

/**
 * Flyer "price burst" sticker: a star-shaped SVG with short text on top (−17% / SAVE). Purely visual — pass the
 * same information as text elsewhere or through `label`.
 */
const burstPoints = Array.from({ length: 36 }, (_, i) => {
  const r = i % 2 ? 41 : 50
  const a = (Math.PI * 2 * i) / 36 - Math.PI / 2
  return `${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`
}).join(' ')

export function PriceBurst({ size = 68, fill = colors.yellow, color = colors.ink, rotate = -10, label, children, sx }: { size?: number; fill?: string; color?: string; rotate?: number; label?: string; children: ReactNode; sx?: SxProps<Theme> }) {
  return (
    <Box role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} sx={{ position: 'relative', width: size, height: size, flexShrink: 0, transform: `rotate(${rotate}deg)`, filter: 'drop-shadow(0 4px 8px rgba(17,24,39,.18))', ...((sx as object) ?? {}) }}>
      <Box component="svg" viewBox="0 0 100 100" aria-hidden sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <polygon points={burstPoints} fill={fill} />
      </Box>
      <Box aria-hidden sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color, lineHeight: 1, fontWeight: 700 }}>
        {children}
      </Box>
    </Box>
  )
}

/** Live "ends in" countdown (updates every 30 s; no animation). Renders nothing until mounted to avoid SSR drift. */
export function Countdown({ to, label = 'Ends in', tone = 'onRed' }: { to: string; label?: string; tone?: 'onRed' | 'onLight' }) {
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    setNow(Date.now())
    const t = window.setInterval(() => setNow(Date.now()), 30000)
    return () => window.clearInterval(t)
  }, [])
  if (now === null) return <Box sx={{ height: 62 }} />
  const left = Math.max(0, endsAt(to) - now)
  const d = Math.floor(left / 86400000)
  const h = Math.floor((left % 86400000) / 3600000)
  const m = Math.floor((left % 3600000) / 60000)
  const onRed = tone === 'onRed'
  if (!left) return <Typography sx={{ fontWeight: 600 }}>New deals go live Monday</Typography>
  const box = (v: number, unit: string) => (
    <Box sx={{ minWidth: 54, px: 1, py: 0.75, borderRadius: radius.md, textAlign: 'center', bgcolor: onRed ? 'rgba(255,255,255,.14)' : colors.sunken, border: onRed ? '1px solid rgba(255,255,255,.28)' : 'none' }}>
      <Box sx={{ fontSize: 22, fontWeight: 700, lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' }}>{String(v).padStart(2, '0')}</Box>
      <Box sx={{ fontSize: 11, fontWeight: 500, opacity: 0.85, textTransform: 'uppercase', letterSpacing: '.06em' }}>{unit}</Box>
    </Box>
  )
  return (
    <Box>
      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.75, opacity: onRed ? 0.9 : 1 }}>{label}</Typography>
      <Box aria-hidden sx={{ display: 'flex', gap: 0.75 }}>{box(d, d === 1 ? 'day' : 'days')}{box(h, 'hrs')}{box(m, 'min')}</Box>
      <Box component="span" sx={srOnly}>{`${label} ${d} days ${h} hours ${m} minutes`}</Box>
    </Box>
  )
}
