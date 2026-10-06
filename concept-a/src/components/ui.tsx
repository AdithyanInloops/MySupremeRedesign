import type { ReactNode } from 'react'
import { Box, Button, Chip, Stack, Tooltip, Typography, type SxProps, type Theme } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import AutoAwesomeRounded from '@mui/icons-material/AutoAwesomeRounded'
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded'
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined'
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded'
import ScheduleRounded from '@mui/icons-material/ScheduleRounded'
import LocalShippingRounded from '@mui/icons-material/LocalShippingRounded'
import CancelRounded from '@mui/icons-material/CancelRounded'
import HourglassTopRounded from '@mui/icons-material/HourglassTopRounded'
import ErrorRounded from '@mui/icons-material/ErrorRounded'
import TimelapseRounded from '@mui/icons-material/TimelapseRounded'
import { tokens } from '../theme'

const c = tokens.color

/** Centred content container — max 1500px, 16px gutter on mobile, 32px from md. */
export function Container({ children, sx }: { children: ReactNode; sx?: SxProps<Theme> }) {
  return <Box sx={{ maxWidth: tokens.container, mx: 'auto', px: { xs: 2, md: 4 }, ...((sx as object) ?? {}) }}>{children}</Box>
}

/**
 * Marks anything that needs new backend data so it can be costed separately (brief rule 1).
 * Visible in the prototype on purpose; it is removed in the build.
 */
export function NewFeatureTag({ label = 'New feature', note, sx }: { label?: string; note?: string; sx?: SxProps<Theme> }) {
  const chip = (
    <Box
      component="span"
      sx={{
        display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.25, borderRadius: 999,
        bgcolor: '#F3E8FF', color: '#6B21A8', border: '1px dashed #A855F7', fontSize: 11, fontWeight: 700,
        lineHeight: 1.6, letterSpacing: '.02em', whiteSpace: 'nowrap', verticalAlign: 'middle', ...((sx as object) ?? {}),
      }}
    >
      <AutoAwesomeRounded sx={{ fontSize: 13 }} />
      {label}
    </Box>
  )
  return note ? <Tooltip title={`Needs backend work: ${note}`}>{chip}</Tooltip> : chip
}

/** Section header used above every rail / grid. */
export function SectionHeader({
  eyebrow, title, action, href, sx,
}: { eyebrow?: ReactNode; title: ReactNode; action?: string; href?: string; sx?: SxProps<Theme> }) {
  return (
    <Stack direction="row" alignItems="flex-end" justifyContent="space-between" spacing={2} sx={{ mb: { xs: 2, md: 3 }, ...((sx as object) ?? {}) }}>
      <Box>
        {eyebrow && (
          <Typography variant="overline" sx={{ color: c.red, display: 'block', mb: 0.5 }}>
            {eyebrow}
          </Typography>
        )}
        <Typography variant="h2" component="h2" sx={{ color: c.ink }}>
          {title}
        </Typography>
      </Box>
      {action && href && (
        <Button component={RouterLink} to={href} endIcon={<ArrowForwardRounded />} sx={{ color: c.navy, flexShrink: 0, fontWeight: 600 }}>
          {action}
        </Button>
      )}
    </Stack>
  )
}

/** Consistent pack-size chip — free-text from Magento, normalised visually, never re-parsed. */
export function PackChip({ pack, size = 'md' }: { pack: string; size?: 'sm' | 'md' }) {
  return (
    <Box
      component="span"
      title={`Pack size: ${pack}`}
      sx={{
        display: 'inline-flex', alignItems: 'center', gap: 0.5, maxWidth: '100%',
        px: size === 'sm' ? 0.75 : 1, py: size === 'sm' ? 0.125 : 0.25,
        borderRadius: tokens.radius.xs, bgcolor: c.navyTint, color: c.navy,
        fontSize: size === 'sm' ? 11 : 12, fontWeight: 600, lineHeight: 1.6,
      }}
    >
      <Inventory2Outlined sx={{ fontSize: size === 'sm' ? 12 : 14, flexShrink: 0 }} />
      <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {pack}
      </Box>
    </Box>
  )
}

/** SKU — small mono text that ellipsizes rather than breaking a layout (17-digit barcodes). */
export function Sku({ sku, sx }: { sku: string; sx?: SxProps<Theme> }) {
  return (
    <Typography
      component="span"
      title={`SKU ${sku}`}
      sx={{
        fontFamily: tokens.font.mono, fontSize: 11.5, color: c.text3, letterSpacing: '.02em',
        display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', ...((sx as object) ?? {}),
      }}
    >
      SKU {sku}
    </Typography>
  )
}

export type StatusKind =
  | 'Pending' | 'Confirmed' | 'On the way' | 'Delivered' | 'Cancelled'
  | 'Paid' | 'Partial' | 'Overdue' | 'Open' | 'Accepted' | 'Applied'

const statusMap: Record<StatusKind, { fg: string; bg: string; icon: ReactNode }> = {
  Pending: { fg: c.warning, bg: c.warningTint, icon: <HourglassTopRounded /> },
  Confirmed: { fg: c.info, bg: c.infoTint, icon: <CheckCircleRounded /> },
  'On the way': { fg: c.navy, bg: c.navyTint, icon: <LocalShippingRounded /> },
  Delivered: { fg: c.successText, bg: c.successTint, icon: <CheckCircleRounded /> },
  Cancelled: { fg: c.text2, bg: c.surface2, icon: <CancelRounded /> },
  Paid: { fg: c.successText, bg: c.successTint, icon: <CheckCircleRounded /> },
  Partial: { fg: c.warning, bg: c.warningTint, icon: <TimelapseRounded /> },
  Overdue: { fg: c.error, bg: c.errorTint, icon: <ErrorRounded /> },
  Open: { fg: c.info, bg: c.infoTint, icon: <ScheduleRounded /> },
  Accepted: { fg: c.successText, bg: c.successTint, icon: <CheckCircleRounded /> },
  Applied: { fg: c.successText, bg: c.successTint, icon: <CheckCircleRounded /> },
}

/** Status chip — colour + icon + text, never colour alone. */
export function StatusChip({ status, size = 'small' }: { status: StatusKind; size?: 'small' | 'medium' }) {
  const s = statusMap[status]
  return (
    <Chip
      size={size}
      icon={s.icon as React.ReactElement}
      label={status}
      sx={{ bgcolor: s.bg, color: s.fg, fontWeight: 600, '& .MuiChip-icon': { color: s.fg, fontSize: 16 } }}
    />
  )
}

/** Empty-state block — every empty list gets a helpful next step. */
export function EmptyState({
  icon, title, body, action, href, onAction, secondary,
}: { icon: ReactNode; title: string; body: string; action?: string; href?: string; onAction?: () => void; secondary?: ReactNode }) {
  return (
    <Box sx={{ textAlign: 'center', py: { xs: 6, md: 9 }, px: 2, maxWidth: 520, mx: 'auto' }}>
      <Box
        sx={{
          width: 88, height: 88, mx: 'auto', mb: 2.5, borderRadius: '50%', display: 'grid', placeItems: 'center',
          bgcolor: c.redTint, color: c.red, '& svg': { fontSize: 40 },
        }}
      >
        {icon}
      </Box>
      <Typography variant="h3" component="h2" sx={{ mb: 1 }}>{title}</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>{body}</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="center">
        {action && (href
          ? <Button variant="contained" size="large" component={RouterLink} to={href}>{action}</Button>
          : <Button variant="contained" size="large" onClick={onAction}>{action}</Button>)}
        {secondary}
      </Stack>
    </Box>
  )
}

/** Soft white panel used for page sections. */
export function Panel({ children, sx, id }: { children: ReactNode; sx?: SxProps<Theme>; id?: string }) {
  return (
    <Box id={id} sx={{ bgcolor: '#fff', border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.lg}px`, p: { xs: 2, md: 3 }, ...((sx as object) ?? {}) }}>
      {children}
    </Box>
  )
}
