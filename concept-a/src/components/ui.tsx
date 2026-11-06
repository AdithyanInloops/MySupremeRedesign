import { useState, type ReactNode } from 'react'
import {
  Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Drawer, IconButton, Popover, Stack, TextField, Tooltip, Typography,
  useMediaQuery, useTheme, type AlertColor, type SxProps, type Theme,
} from '@mui/material'
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
import CheckRounded from '@mui/icons-material/CheckRounded'
import CloseRounded from '@mui/icons-material/CloseRounded'
import InfoOutlined from '@mui/icons-material/InfoOutlined'
import ErrorOutlineRounded from '@mui/icons-material/ErrorOutlineRounded'
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded'
import { tokens } from '../theme'
import type { Product } from '../data/catalog'
import { ProductImage } from './Brand'

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
  eyebrow, title, subtitle, action, href, id, sx,
}: { eyebrow?: ReactNode; title: ReactNode; subtitle?: ReactNode; action?: string; href?: string; id?: string; sx?: SxProps<Theme> }) {
  return (
    <Stack direction="row" alignItems="flex-end" justifyContent="space-between" spacing={2} sx={{ mb: tokens.space.headingGap, ...((sx as object) ?? {}) }}>
      <Box sx={{ minWidth: 0 }}>
        {eyebrow && (
          <Typography variant="overline" sx={{ color: c.red, display: 'block', mb: 0.5 }}>
            {eyebrow}
          </Typography>
        )}
        <Typography id={id} variant="h2" component="h2" sx={{ color: c.ink }}>
          {title}
        </Typography>
        {subtitle && <Typography sx={{ mt: 0.5, fontSize: 14.5, color: c.text2 }}>{subtitle}</Typography>}
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
  icon, title, body, action, href, onAction, secondary, hint,
}: { icon: ReactNode; title: string; body?: string; action?: string; href?: string; onAction?: () => void; secondary?: ReactNode; hint?: ReactNode }) {
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
      <Typography variant="h3" component="h2" sx={{ mb: body ? 1 : 3 }}>{title}</Typography>
      {body && <Typography color="text.secondary" sx={{ mb: 3 }}>{body}</Typography>}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="center">
        {action && (href
          ? <Button variant="contained" size="large" component={RouterLink} to={href}>{action}</Button>
          : <Button variant="contained" size="large" onClick={onAction}>{action}</Button>)}
        {secondary}
      </Stack>
      {hint && <Typography sx={{ mt: 2, fontSize: 13.5, color: c.text3 }}>{hint}</Typography>}
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

/* ------------------------------------------------------------------ Sheet */

/** Small chooser: bottom sheet on mobile, popover under `anchor` on desktop. */
export function Sheet({ anchor, open, onClose, title, children }: { anchor: HTMLElement | null; open: boolean; onClose: () => void; title?: string; children: ReactNode }) {
  // noSsr: client-only app, so read the width on first render instead of rendering twice (every product card has a heart sheet).
  const mobile = useMediaQuery(useTheme().breakpoints.down('md'), { noSsr: true })
  const head = title && <Typography sx={{ px: 2.5, pt: mobile ? 1.5 : 2, pb: 1, fontWeight: 700, fontSize: 15 }}>{title}</Typography>
  return mobile ? (
    <Drawer anchor="bottom" open={open} onClose={onClose}
      PaperProps={{ sx: { borderRadius: `${tokens.radius.lg}px ${tokens.radius.lg}px 0 0`, pb: 'calc(env(safe-area-inset-bottom) + 12px)' } }}>
      <Box sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: c.line2, mx: 'auto', mt: 1.25 }} aria-hidden />
      {head}
      {children}
    </Drawer>
  ) : (
    <Popover open={open} anchorEl={anchor} onClose={onClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      slotProps={{ paper: { sx: { mt: 1, minWidth: 280, borderRadius: `${tokens.radius.md}px`, boxShadow: tokens.shadow.pop, border: `1px solid ${c.line}`, pb: 1 } } }}>
      {head}
      {children}
    </Popover>
  )
}

/* ------------------------------------------------------------------ Name dialog */

/** One-field form used by "Create new list" and "Save cart as list". Exported alone so the review board can show it inline. */
export function NameForm({ title, placeholder, taken = [], onCancel, onSave, autoFocus = true }: { title: string; placeholder: string; taken?: string[]; onCancel: () => void; onSave: (name: string) => void; autoFocus?: boolean }) {
  const [name, setName] = useState('')
  const v = name.trim()
  const dup = taken.some((t) => t.toLowerCase() === v.toLowerCase())
  return (
    <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); if (v && !dup) onSave(v) }}>
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>{title}</DialogTitle>
      <DialogContent sx={{ pt: '8px !important' }}>
        <TextField autoFocus={autoFocus} fullWidth label="List name" placeholder={placeholder} value={name} onChange={(e) => setName(e.target.value)}
          error={dup} helperText={dup ? `You already have a list called “${v}”` : ' '} inputProps={{ maxLength: 40 }} InputLabelProps={{ shrink: true }} />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, pt: 0, gap: 1 }}>
        <Button onClick={onCancel} sx={{ color: c.text2 }}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={!v || dup}>Save</Button>
      </DialogActions>
    </Box>
  )
}

export function NameDialog({ open, onClose, ...form }: { open: boolean; onClose: () => void } & Omit<Parameters<typeof NameForm>[0], 'onCancel'>) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      {/* Mount the form only while open so the field starts empty every time. */}
      {open && <NameForm {...form} onCancel={onClose} onSave={(name) => { form.onSave(name); onClose() }} />}
    </Dialog>
  )
}

/* ------------------------------------------------------------------ Toast card */

// Status in the theme's pale tint pairs (the same pairs as the status chips).
const toastTone: Record<AlertColor, { fg: string; bg: string; icon: ReactNode }> = {
  success: { fg: c.successText, bg: c.successTint, icon: <CheckRounded /> },
  info: { fg: c.info, bg: c.infoTint, icon: <InfoOutlined /> },
  warning: { fg: c.warning, bg: c.warningTint, icon: <WarningAmberRounded /> },
  error: { fg: c.error, bg: c.errorTint, icon: <ErrorOutlineRounded /> },
}

/** The bottom message, in the theme: a white popover card, the product's photo with a status tick (or a tinted status icon),
 *  a bold line, a grey second line, one primary button and a close. */
export function ToastCard({ msg, severity = 'success', detail, product, action, onAction, onClose }: {
  msg: string; severity?: AlertColor; detail?: string; product?: Product
  action?: { label: string; href?: string }; onAction?: () => void; onClose?: () => void
}) {
  const sub = detail ?? product?.name
  const tone = toastTone[severity]
  return (
    <Box role={severity === 'error' ? 'alert' : 'status'}
      sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: { xs: '100%', sm: 'auto' }, minWidth: { sm: 400 }, maxWidth: 520, minHeight: 68, py: 1.25, pl: 1.25, pr: 1, bgcolor: '#fff', color: c.ink, border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.md}px`, boxShadow: tokens.shadow.pop }}>
      {product ? (
        <Box sx={{ position: 'relative', width: 48, flexShrink: 0 }}>
          <ProductImage src={product.images[0]} alt="" brand={product.brand} />
          {severity !== 'info' && (
            <Box aria-hidden sx={{ position: 'absolute', right: -6, bottom: -6, width: 22, height: 22, borderRadius: '50%', display: 'grid', placeItems: 'center', border: '2px solid #fff', bgcolor: tone.fg, color: '#fff', '& svg': { fontSize: 14 } }}>
              {tone.icon}
            </Box>
          )}
        </Box>
      ) : (
        <Box aria-hidden sx={{ width: 40, height: 40, borderRadius: '50%', display: 'grid', placeItems: 'center', flexShrink: 0, bgcolor: tone.bg, color: tone.fg, '& svg': { fontSize: 22 } }}>{tone.icon}</Box>
      )}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 14.5, fontWeight: 600, lineHeight: 1.35 }}>{msg}</Typography>
        {sub && <Typography sx={{ fontSize: 13, lineHeight: 1.35, color: c.text2, mt: 0.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub}</Typography>}
      </Box>
      {action && (
        <Button variant="contained" size="small" disableElevation href={action.href && `#${action.href}`} onClick={onAction}
          sx={{ flexShrink: 0, minHeight: 36, px: 2, borderRadius: `${tokens.radius.sm}px`, fontWeight: 700, whiteSpace: 'nowrap' }}>
          {action.label}
        </Button>
      )}
      {onClose && (
        <IconButton aria-label="Dismiss" onClick={onClose} sx={{ flexShrink: 0, width: 36, height: 36, color: c.text3, '&:hover': { color: c.ink, bgcolor: c.surface2 } }}>
          <CloseRounded sx={{ fontSize: 20 }} />
        </IconButton>
      )}
    </Box>
  )
}
