import type { ReactNode } from 'react'
import Link from 'next/link'
import { Box, Button, Typography, type SxProps, type Theme } from '@mui/material'
import EastRoundedIcon from '@mui/icons-material/EastRounded'
import { colors, layout } from '../../lib/theme'

/**
 * Layout primitives every page shares:
 * - `PageContainer`: the 1440px content column with the standard gutters.
 * - `Section`: a full-width band (white or subtle grey) with one heading style and one vertical rhythm.
 * - `SectionHeading`: eyebrow + title + subtitle on the left, the section's single action on the right.
 */

export function PageContainer({ children, sx }: { children: ReactNode; sx?: SxProps<Theme> }) {
  return <Box sx={{ maxWidth: layout.maxWidth, mx: 'auto', px: layout.gutter, ...((sx as object) ?? {}) }}>{children}</Box>
}

export type SectionAction = { label: string; href: string }

export function SectionHeading({
  id, eyebrow, title, subtitle, action, extra, align = 'left', as = 'h2',
}: {
  id?: string
  eyebrow?: string
  title: ReactNode
  subtitle?: ReactNode
  action?: SectionAction
  /** Custom right-side controls (tabs, arrows, a Clear button…), shown before the action. */
  extra?: ReactNode
  align?: 'left' | 'center'
  as?: 'h1' | 'h2' | 'h3'
}) {
  return (
    <Box
      sx={{
        display: 'flex', alignItems: { xs: 'flex-start', sm: 'flex-end' }, justifyContent: align === 'center' ? 'center' : 'space-between',
        flexDirection: align === 'center' ? 'column' : { xs: 'column', sm: 'row' }, textAlign: align, gap: { xs: 1.5, sm: 3 }, mb: { xs: 2.5, md: 3 },
        ...(align === 'center' ? { alignItems: 'center' } : {}),
      }}
    >
      <Box sx={{ minWidth: 0, maxWidth: 720 }}>
        {eyebrow && (
          <Typography variant="overline" component="p" sx={{ color: colors.redText, display: 'block', mb: 0.5 }}>
            {eyebrow}
          </Typography>
        )}
        <Typography id={id} variant={as === 'h3' ? 'h3' : 'h2'} component={as}>
          {title}
        </Typography>
        {subtitle && <Typography sx={{ color: colors.ink600, fontSize: { xs: 14, md: 15 }, mt: 0.75 }}>{subtitle}</Typography>}
      </Box>
      {(extra || action) && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0, ml: { sm: align === 'center' ? 0 : 'auto' } }}>
          {extra}
          {action && (
            <Button component={Link} href={action.href} color="primary" endIcon={<EastRoundedIcon />} sx={{ mr: { sm: -1.5 }, ml: { xs: -1.5, sm: 0 } }}>
              {action.label}
            </Button>
          )}
        </Box>
      )}
    </Box>
  )
}

export type SectionBand = 'white' | 'subtle'

export default function Section({
  id, eyebrow, title, subtitle, action, extra, band = 'white', align, tight = false, children, labelledBy,
}: {
  id: string
  eyebrow?: string
  title?: ReactNode
  subtitle?: ReactNode
  action?: SectionAction
  extra?: ReactNode
  band?: SectionBand
  align?: 'left' | 'center'
  /** Less space above — for a block that continues the one before it. */
  tight?: boolean
  children: ReactNode
  /** When the heading lives inside `children`, pass its id so the landmark is still named. */
  labelledBy?: string
}) {
  const headingId = `${id}-title`
  return (
    <Box
      component="section"
      id={id}
      aria-labelledby={title ? headingId : labelledBy}
      sx={{ bgcolor: band === 'subtle' ? colors.subtle : '#fff', scrollMarginTop: layout.headerOffset }}
    >
      <PageContainer sx={{ pt: tight ? { xs: 2, md: 2.5 } : { xs: 5, md: 7 }, pb: { xs: 5, md: 7 } }}>
        {title && <SectionHeading id={headingId} eyebrow={eyebrow} title={title} subtitle={subtitle} action={action} extra={extra} align={align} />}
        {children}
      </PageContainer>
    </Box>
  )
}
