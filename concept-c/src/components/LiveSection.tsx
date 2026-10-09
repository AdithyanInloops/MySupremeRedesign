import type { ReactNode } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import { tokens, focusRing } from '../theme'
import { ChevronRightIcon } from './icons'

const c = tokens.color

/** Section heading as in the current app: title left, red "Show all ›" right (in-app route or external link). */
export default function LiveSection({ id, title, to, href, children, mt = 3.5, linkColor = c.red }: { id: string; title?: string; to?: string; href?: string; children: ReactNode; mt?: number; linkColor?: string }) {
  const link = { display: 'inline-flex', alignItems: 'center', gap: 0.25, minHeight: 32, flexShrink: 0, color: linkColor, fontSize: 15, fontWeight: 600, textDecoration: 'none', borderRadius: 1, ...focusRing } as const
  return (
    <Box component="section" aria-labelledby={title ? id : undefined} sx={{ mt }}>
      {title && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, px: 2, mb: 1.5 }}>
          <Typography id={id} component="h2" sx={{ fontSize: 19, fontWeight: 600, color: c.ink, letterSpacing: '-.01em' }}>{title}</Typography>
          {to ? <Box component={RouterLink} to={to} aria-label={`Show all ${title}`} sx={link}>Show all <ChevronRightIcon sx={{ fontSize: 18 }} /></Box>
            : href ? <Box component="a" href={href} target="_blank" rel="noopener noreferrer" aria-label={`Show all ${title}`} sx={link}>Show all <ChevronRightIcon sx={{ fontSize: 18 }} /></Box> : null}
        </Box>
      )}
      {children}
    </Box>
  )
}
