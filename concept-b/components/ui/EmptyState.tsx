import type { ReactNode } from 'react'
import { Box, Typography } from '@mui/material'
import { colors } from '../../lib/theme'

/**
 * Every empty, error and "nothing found" state uses this: what happened (title), why / what it means (body),
 * what to do next (actions). `size="page"` for whole-page states, `"inline"` inside panels and lists.
 */
export default function EmptyState({
  icon, title, children, actions, size = 'page', tone = 'neutral', headingLevel = 'h2',
}: {
  icon?: ReactNode
  title: ReactNode
  children?: ReactNode
  actions?: ReactNode
  size?: 'page' | 'inline'
  tone?: 'neutral' | 'brand' | 'error'
  headingLevel?: 'h1' | 'h2' | 'h3'
}) {
  const page = size === 'page'
  const tint = { neutral: colors.sunken, brand: colors.redTint, error: colors.errorTint }[tone]
  const ink = { neutral: colors.ink600, brand: colors.redText, error: colors.error }[tone]
  return (
    <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', py: page ? { xs: 6, md: 10 } : 4, px: 2 }}>
      {icon && (
        <Box sx={{ width: page ? 80 : 56, height: page ? 80 : 56, borderRadius: '50%', bgcolor: tint, color: ink, display: 'grid', placeItems: 'center', mb: page ? 3 : 2, '& svg': { fontSize: page ? 36 : 26 } }}>
          {icon}
        </Box>
      )}
      <Typography variant={page ? 'h2' : 'h3'} component={headingLevel} sx={{ maxWidth: 560 }}>{title}</Typography>
      {children && <Typography component="div" sx={{ mt: 1, color: colors.ink600, maxWidth: 520, fontSize: page ? 15.5 : 14.5 }}>{children}</Typography>}
      {actions && <Box sx={{ mt: 3, display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center' }}>{actions}</Box>}
    </Box>
  )
}
