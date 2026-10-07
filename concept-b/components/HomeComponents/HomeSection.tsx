import type { ReactNode } from 'react'
import Link from 'next/link'
import { Box, Button, Typography } from '@mui/material'
import EastIcon from '@mui/icons-material/East'

/**
 * Concept B — one wrapper for every home section, so spacing and headings are identical down the page.
 *
 * - `band` paints a full-width background so groups of sections read as separate blocks
 *   (white / soft grey alternate per group in pages/index.tsx).
 * - Heading = red eyebrow + large title + optional subtitle, with the section's action pill on the right.
 * - Content sits in the same 1500px container with the same side gutters as the rest of the site.
 */

export type SectionBand = 'white' | 'grey'

const bandColor: Record<SectionBand, string> = { white: '#FFFFFF', grey: '#F5F6F8' }

export function SectionHeading({
  id, eyebrow, title, subtitle, action, extra, align = 'left',
}: {
  id: string
  eyebrow?: string
  title: string
  subtitle?: ReactNode
  action?: { label: string; href: string }
  /** Custom right-side control (e.g. a "Clear" button) instead of / next to the action pill. */
  extra?: ReactNode
  align?: 'left' | 'center'
}) {
  return (
    <Box
      sx={{
        display: 'flex', alignItems: { xs: 'flex-start', sm: 'flex-end' }, justifyContent: align === 'center' ? 'center' : 'space-between',
        textAlign: align, gap: 2, mb: { xs: 2.5, md: 3.5 }, flexWrap: 'wrap',
      }}
    >
      <Box sx={{ minWidth: 0, maxWidth: 760 }}>
        {eyebrow && (
          <Typography component="p" sx={{ color: '#D50000', fontSize: { xs: 11.5, md: 12.5 }, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', mb: 0.75 }}>
            {eyebrow}
          </Typography>
        )}
        <Typography id={id} component="h2" sx={{ color: '#0C0C0C', fontSize: { xs: 22, sm: 26, md: 30 }, fontWeight: 600, lineHeight: 1.2, letterSpacing: '-0.01em' }}>
          {title}
        </Typography>
        {subtitle && <Typography sx={{ color: '#4B5563', fontSize: { xs: 14, md: 15 }, mt: 0.75, lineHeight: 1.55 }}>{subtitle}</Typography>}
      </Box>
      {extra}
      {action && (
        <Button
          component={Link}
          href={action.href}
          variant="outlined"
          endIcon={<EastIcon sx={{ fontSize: '18px !important' }} />}
          sx={{
            flexShrink: 0, borderRadius: '40px', borderColor: '#FF0000', color: '#D50000', textTransform: 'none', fontWeight: 600,
            fontSize: { xs: 13, md: 14.5 }, px: { xs: 2, md: 2.75 }, height: { xs: 38, md: 42 }, bgcolor: '#fff',
            '&:hover': { borderColor: '#D50000', bgcolor: '#FFF5F5' }, '&.Mui-focusVisible': { outline: '3px solid rgba(255,0,0,.35)', outlineOffset: 2 },
          }}
        >
          {action.label}
        </Button>
      )}
    </Box>
  )
}

export default function HomeSection({
  id, eyebrow, title, subtitle, action, band = 'white', children, align, flush = false, tight = false,
}: {
  id: string
  eyebrow?: string
  title?: string
  subtitle?: ReactNode
  action?: { label: string; href: string }
  band?: SectionBand
  children: ReactNode
  align?: 'left' | 'center'
  /** Content handles its own side gutters (full-bleed banners, edge-to-edge rows). */
  flush?: boolean
  /** Less vertical space — for a section that continues the one above it in the same group. */
  tight?: boolean
}) {
  return (
    <Box
      component="section"
      aria-labelledby={title ? id : undefined}
      aria-label={title ? undefined : id}
      sx={{ bgcolor: bandColor[band], scrollMarginTop: { xs: 120, lg: 150 } }}
    >
      <Box
        sx={{
          maxWidth: 1500, mx: 'auto',
          px: flush ? 0 : { xs: '12px', md: '24px', lg: '32px' },
          pt: tight ? { xs: 1, md: 1.5 } : { xs: 4, md: 6 },
          pb: { xs: 4, md: 6 },
        }}
      >
        {title && (
          <Box sx={{ px: flush ? { xs: '12px', md: '24px', lg: '32px' } : 0 }}>
            <SectionHeading id={id} eyebrow={eyebrow} title={title} subtitle={subtitle} action={action} align={align} />
          </Box>
        )}
        {children}
      </Box>
    </Box>
  )
}
