import type { ReactNode } from 'react'
import Link from 'next/link'
import { Box, Breadcrumbs as MuiBreadcrumbs, Typography } from '@mui/material'
import { colors, focusRing } from '../../lib/theme'
import { ChevronLeftIcon, ChevronRightIcon } from './icons'

export type Crumb = { label: string; href?: string }

/**
 * Full trail on tablet/desktop; on phones only a "‹ Parent" back link, so long trails never wrap or truncate
 * mid-word (Home › Grocery › Bulk Rice › Long product name…).
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const parent = [...items].reverse().find((c, i) => i > 0 && c.href) ?? items.find((c) => c.href)
  const linkSx = { color: colors.ink600, textDecoration: 'none', borderRadius: '4px', '&:hover': { color: colors.ink, textDecoration: 'underline' }, ...focusRing } as const
  return (
    <Box component="nav" aria-label="Breadcrumb">
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <MuiBreadcrumbs separator={<ChevronRightIcon sx={{ fontSize: 16 }} />} sx={{ '& ol': { flexWrap: 'nowrap' }, '& li': { minWidth: 0 } }}>
          {items.map((c, i) =>
            c.href && i < items.length - 1 ? (
              <Box key={c.label} component={Link} href={c.href} sx={{ ...linkSx, whiteSpace: 'nowrap' }}>{c.label}</Box>
            ) : (
              <Typography key={c.label} aria-current="page" sx={{ fontSize: 13.5, color: colors.ink, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 420 }}>
                {c.label}
              </Typography>
            ),
          )}
        </MuiBreadcrumbs>
      </Box>
      {parent?.href && (
        <Box component={Link} href={parent.href} sx={{ ...linkSx, display: { xs: 'inline-flex', md: 'none' }, alignItems: 'center', gap: 0.25, fontSize: 14, fontWeight: 500, minHeight: 36, ml: -0.5 }}>
          <ChevronLeftIcon sx={{ fontSize: 20 }} /> {parent.label}
        </Box>
      )}
    </Box>
  )
}

/** Where am I (breadcrumbs + title), what is this (meta/description), what can I do (actions). */
export default function PageHeader({
  breadcrumbs, title, meta, description, actions, eyebrow,
}: {
  breadcrumbs?: Crumb[]
  title: ReactNode
  meta?: ReactNode
  description?: ReactNode
  actions?: ReactNode
  eyebrow?: string
}) {
  return (
    <Box sx={{ pt: { xs: 1.5, md: 3 }, pb: { xs: 2, md: 3 } }}>
      {breadcrumbs && <Box sx={{ mb: { xs: 0.5, md: 1.5 } }}><Breadcrumbs items={breadcrumbs} /></Box>}
      <Box sx={{ display: 'flex', alignItems: { xs: 'flex-start', md: 'flex-end' }, justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ minWidth: 0 }}>
          {eyebrow && <Typography variant="overline" component="p" sx={{ color: colors.redText, mb: 0.5 }}>{eyebrow}</Typography>}
          <Typography variant="h1" sx={{ overflowWrap: 'anywhere' }}>{title}</Typography>
          {meta && <Typography sx={{ mt: 0.5, color: colors.ink600, fontSize: 14.5 }}>{meta}</Typography>}
          {description && <Typography sx={{ mt: 1, color: colors.ink600, maxWidth: 720 }}>{description}</Typography>}
        </Box>
        {actions && <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>{actions}</Box>}
      </Box>
    </Box>
  )
}
