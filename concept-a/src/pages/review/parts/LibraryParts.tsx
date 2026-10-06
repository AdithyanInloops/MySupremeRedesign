import type { ReactNode } from 'react'
import { Box, Stack, Typography, type SxProps, type Theme } from '@mui/material'
import { tokens } from '../../../theme'

const c = tokens.color

/* ------------------------------------------------------------------ Contrast maths (WCAG 2.1) */

const lum = (hex: string) => {
  const v = hex.replace('#', '')
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16) / 255).map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
export const contrast = (a: string, b: string) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x)
  return (l1 + 0.05) / (l2 + 0.05)
}

export function RatioPill({ fg, bg, label }: { fg: string; bg: string; label: string }) {
  const r = contrast(fg, bg)
  const grade = r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? 'AA large' : 'Fail'
  const ok = r >= 4.5
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, fontSize: 11.5 }}>
      <Box component="span" sx={{ color: c.text2 }}>{label}</Box>
      <Box component="span" sx={{ fontWeight: 700, color: ok ? c.successText : r >= 3 ? c.warning : c.error }}>
        {r.toFixed(2)}:1 · {grade}
      </Box>
    </Box>
  )
}

export function Swatch({ name, hex, use }: { name: string; hex: string; use: string }) {
  return (
    <Box sx={{ bgcolor: '#fff', border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.md}px`, overflow: 'hidden' }}>
      <Box sx={{ height: 72, bgcolor: hex, display: 'flex', alignItems: 'flex-end', p: 1, borderBottom: `1px solid ${c.line}` }}>
        <Box sx={{ color: contrast('#FFFFFF', hex) > contrast(c.ink, hex) ? '#fff' : c.ink, fontWeight: 700, fontSize: 13 }}>Aa</Box>
      </Box>
      <Box sx={{ p: 1.25 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 13 }}>{name}</Typography>
        <Typography sx={{ fontFamily: tokens.font.mono, fontSize: 11.5, color: c.text2 }}>{hex}</Typography>
        <Typography sx={{ fontSize: 11.5, color: c.text3, mb: 0.75, minHeight: 34 }}>{use}</Typography>
        <RatioPill fg="#FFFFFF" bg={hex} label="White text" />
        <RatioPill fg={c.ink} bg={hex} label="Ink text" />
      </Box>
    </Box>
  )
}

/* ------------------------------------------------------------------ Layout helpers */

export function LibSection({ id, n, title, usedOn, children, note }: { id: string; n?: number; title: string; usedOn?: string; children: ReactNode; note?: ReactNode }) {
  return (
    <Box component="section" id={id} sx={{ scrollMarginTop: 200, pt: { xs: 5, md: 7 }, borderTop: `1px solid ${c.line}`, '&:first-of-type': { borderTop: 0, pt: 0 } }}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'baseline' }} spacing={1} sx={{ mb: 2.5 }}>
        <Typography variant="h2" component="h2">
          {n !== undefined && <Box component="span" sx={{ color: c.text3, fontWeight: 500, mr: 1.25, fontFamily: tokens.font.mono, fontSize: '0.6em' }}>{String(n).padStart(2, '0')}</Box>}
          {title}
        </Typography>
        {usedOn && <Typography variant="body2" color="text.secondary">Used on: {usedOn}</Typography>}
      </Stack>
      {note && <Typography color="text.secondary" sx={{ mb: 2.5, maxWidth: 820 }}>{note}</Typography>}
      {children}
    </Box>
  )
}

/** A labelled specimen frame — shows the state name above each example. */
export function Demo({ label, children, sx, bg = '#fff', pad = 2 }: { label: string; children: ReactNode; sx?: SxProps<Theme>; bg?: string; pad?: number }) {
  return (
    <Box sx={{ minWidth: 0, ...((sx as object) ?? {}) }}>
      <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: c.text3, mb: 0.75, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={label}>{label}</Typography>
      <Box sx={{ bgcolor: bg, border: `1px dashed ${c.line2}`, borderRadius: `${tokens.radius.md}px`, p: pad, height: 'calc(100% - 24px)' }}>{children}</Box>
    </Box>
  )
}

export function DemoGrid({ children, min = 220, sx }: { children: ReactNode; min?: number; sx?: SxProps<Theme> }) {
  return <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: `repeat(auto-fill, minmax(${min}px, 1fr))` }, alignItems: 'stretch', ...((sx as object) ?? {}) }}>{children}</Box>
}

/** Forces a static visual state on its children (hover / focus) for specimens. */
export const forceHover = { '& .MuiButton-containedPrimary': { bgcolor: `${c.redDark} !important` }, '& .MuiButton-outlined': { bgcolor: 'rgba(45,41,125,.06)' } }
export const forceFocus = { '& .MuiButton-root, & .MuiIconButton-root': { outline: `3px solid rgba(45,41,125,.45)`, outlineOffset: 2 } }
