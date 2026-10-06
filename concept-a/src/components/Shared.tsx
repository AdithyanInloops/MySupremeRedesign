import type { ReactNode } from 'react'
import {
  Box, Breadcrumbs as MuiBreadcrumbs, Button, Link, Skeleton, Stack, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, Typography,
  useMediaQuery, useTheme, type SxProps, type Theme,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import NavigateNextRounded from '@mui/icons-material/NavigateNextRounded'
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded'
import EditOutlined from '@mui/icons-material/EditOutlined'
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded'
import { tokens } from '../theme'
import type { Address } from '../data/account'

const c = tokens.color

/* ------------------------------------------------------------------ Breadcrumbs */

export type Crumb = { label: string; to?: string }

/** Breadcrumbs — full trail on desktop; on mobile collapses the middle to "…" so long trails never wrap. */
export function Breadcrumbs({ items, sx }: { items: Crumb[]; sx?: SxProps<Theme> }) {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('md'))
  const all: Crumb[] = [{ label: 'Home', to: '/' }, ...items]
  return (
    <MuiBreadcrumbs
      aria-label="Breadcrumb"
      maxItems={mobile ? 3 : 8}
      itemsBeforeCollapse={1}
      itemsAfterCollapse={mobile ? 1 : 2}
      separator={<NavigateNextRounded sx={{ fontSize: 16 }} />}
      sx={{ fontSize: 13, '& ol': { flexWrap: 'nowrap' }, '& li': { minWidth: 0 }, ...((sx as object) ?? {}) }}
    >
      {all.map((b, i) =>
        b.to && i < all.length - 1 ? (
          <Link key={i} component={RouterLink} to={b.to} sx={{ color: c.text2, whiteSpace: 'nowrap', minHeight: 32, display: 'inline-flex', alignItems: 'center' }}>{b.label}</Link>
        ) : (
          <Typography key={i} component="span" aria-current="page" sx={{ fontSize: 13, color: c.ink, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', maxWidth: { xs: 180, md: 420 } }}>
            {b.label}
          </Typography>
        ),
      )}
    </MuiBreadcrumbs>
  )
}

/* ------------------------------------------------------------------ Address card */

export function AddressCard({
  address, selected, onSelect, onEdit, compact, sx,
}: { address: Address; selected?: boolean; onSelect?: () => void; onEdit?: () => void; compact?: boolean; sx?: SxProps<Theme> }) {
  const selectable = !!onSelect
  return (
    <Box
      role={selectable ? 'radio' : undefined}
      aria-checked={selectable ? !!selected : undefined}
      tabIndex={selectable ? 0 : undefined}
      onClick={onSelect}
      onKeyDown={(e) => selectable && (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onSelect?.())}
      sx={{
        position: 'relative', p: 2, borderRadius: `${tokens.radius.md}px`, bgcolor: '#fff', cursor: selectable ? 'pointer' : 'default',
        border: `2px solid ${selected ? c.navy : c.line}`, boxShadow: selected ? `0 0 0 4px ${c.navyTint}` : 'none',
        transition: 'border-color .15s, box-shadow .15s', '&:hover': selectable ? { borderColor: selected ? c.navy : c.line2 } : {},
        '&:focus-visible': { outline: `3px solid ${c.navy}`, outlineOffset: 2 }, ...((sx as object) ?? {}),
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
        <Box sx={{ minWidth: 0 }}>
          <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
            {address.defaultShipping && <Box component="span" sx={{ fontSize: 11, fontWeight: 700, color: c.navy, bgcolor: c.navyTint, px: 1, py: 0.25, borderRadius: 999 }}>Default shipping</Box>}
            {address.defaultBilling && <Box component="span" sx={{ fontSize: 11, fontWeight: 700, color: c.text2, bgcolor: c.surface2, px: 1, py: 0.25, borderRadius: 999 }}>Default billing</Box>}
          </Stack>
          <Typography sx={{ fontWeight: 700, fontSize: 14.5 }}>{address.name}</Typography>
          <Typography sx={{ fontSize: 13.5, color: c.text2 }}>{address.company}</Typography>
          {!compact && (
            <Typography sx={{ fontSize: 13.5, color: c.text2, mt: 0.5, lineHeight: 1.55 }}>
              {address.street}<br />{address.city}, {address.province} {address.postal}<br />{address.phone}
            </Typography>
          )}
          {compact && <Typography sx={{ fontSize: 13, color: c.text2 }}>{address.street}, {address.city} {address.postal}</Typography>}
          {address.inArea === false && (
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 1, color: c.warning, fontSize: 12.5, fontWeight: 600 }}>
              <WarningAmberRounded sx={{ fontSize: 16 }} /> <span>Outside our delivery area — pickup only</span>
            </Stack>
          )}
        </Box>
        {selected && <CheckCircleRounded sx={{ color: c.navy, flexShrink: 0 }} aria-hidden />}
      </Stack>
      {onEdit && (
        <Button size="small" startIcon={<EditOutlined />} onClick={(e) => { e.stopPropagation(); onEdit() }} sx={{ mt: 1, ml: -1, color: c.navy }}>
          Edit
        </Button>
      )}
    </Box>
  )
}

/* ------------------------------------------------------------------ Data table */

export type Column<T> = {
  key: string
  label: string
  render: (row: T) => ReactNode
  align?: 'left' | 'right' | 'center'
  sortable?: boolean
  mobileHidden?: boolean
  width?: number | string
}

/**
 * Data table — sortable columns on desktop, stacked cards on mobile.
 * `mobileTitle` / `mobileAside` choose what leads each stacked card.
 */
export function DataTable<T>({
  columns, rows, rowKey, loading, empty, sort, onSort, mobileTitle, mobileAside, actions, onRowClick,
}: {
  columns: Column<T>[]
  rows: T[]
  rowKey: (r: T) => string
  loading?: boolean
  empty?: ReactNode
  sort?: { key: string; dir: 'asc' | 'desc' }
  onSort?: (key: string) => void
  mobileTitle: (r: T) => ReactNode
  mobileAside?: (r: T) => ReactNode
  actions?: (r: T) => ReactNode
  onRowClick?: (r: T) => void
}) {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('md'))

  if (loading) {
    return (
      <Stack spacing={1} aria-busy aria-label="Loading">
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} variant="rounded" height={mobile ? 96 : 52} />)}
      </Stack>
    )
  }
  if (!rows.length) return <>{empty}</>

  if (mobile) {
    return (
      <Stack spacing={1.25}>
        {rows.map((r) => (
          <Box key={rowKey(r)} onClick={() => onRowClick?.(r)} sx={{ p: 2, bgcolor: '#fff', border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.md}px`, cursor: onRowClick ? 'pointer' : 'default' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1} sx={{ mb: 1 }}>
              <Box sx={{ fontWeight: 700, minWidth: 0 }}>{mobileTitle(r)}</Box>
              {mobileAside?.(r)}
            </Stack>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              {columns.filter((col) => !col.mobileHidden).map((col) => (
                <Box key={col.key}>
                  <Typography sx={{ fontSize: 11, color: c.text3, textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 }}>{col.label}</Typography>
                  <Box sx={{ fontSize: 13.5 }}>{col.render(r)}</Box>
                </Box>
              ))}
            </Box>
            {actions && <Stack direction="row" spacing={1} sx={{ mt: 1.5 }} onClick={(e) => e.stopPropagation()}>{actions(r)}</Stack>}
          </Box>
        ))}
      </Stack>
    )
  }

  return (
    <Box sx={{ bgcolor: '#fff', border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.md}px`, overflow: 'hidden' }}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: c.bg }}>
            {columns.map((col) => (
              <TableCell key={col.key} align={col.align} sx={{ fontWeight: 600, fontSize: 12.5, color: c.text2, py: 1.5, width: col.width, whiteSpace: 'nowrap' }}>
                {col.sortable && onSort ? (
                  <TableSortLabel active={sort?.key === col.key} direction={sort?.key === col.key ? sort.dir : 'asc'} onClick={() => onSort(col.key)}>
                    {col.label}
                  </TableSortLabel>
                ) : col.label}
              </TableCell>
            ))}
            {actions && <TableCell align="right" sx={{ fontWeight: 600, fontSize: 12.5, color: c.text2 }}>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={rowKey(r)} hover onClick={() => onRowClick?.(r)} sx={{ cursor: onRowClick ? 'pointer' : 'default', '&:last-child td': { borderBottom: 0 } }}>
              {columns.map((col) => (
                <TableCell key={col.key} align={col.align} sx={{ fontSize: 14, py: 1.5 }}>{col.render(r)}</TableCell>
              ))}
              {actions && <TableCell align="right" onClick={(e) => e.stopPropagation()}><Stack direction="row" spacing={1} justifyContent="flex-end">{actions(r)}</Stack></TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}

/** Page title block used at the top of most inner pages. */
export function PageTitle({ title, subtitle, crumbs, action }: { title: ReactNode; subtitle?: ReactNode; crumbs?: Crumb[]; action?: ReactNode }) {
  return (
    <Box sx={{ pt: { xs: 2, md: 3 }, pb: { xs: 2, md: 3 } }}>
      {crumbs && <Breadcrumbs items={crumbs} sx={{ mb: 1.5 }} />}
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'flex-end' }} spacing={2}>
        <Box>
          <Typography variant="h1" component="h1" sx={{ fontSize: { xs: 28, md: 40 } }}>{title}</Typography>
          {subtitle && <Typography color="text.secondary" sx={{ mt: 0.75 }}>{subtitle}</Typography>}
        </Box>
        {action}
      </Stack>
    </Box>
  )
}
