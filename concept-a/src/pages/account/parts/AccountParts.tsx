import type { ReactNode } from 'react'
import { Box, Button, LinearProgress, Skeleton, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import CheckRounded from '@mui/icons-material/CheckRounded'
import CloseRounded from '@mui/icons-material/CloseRounded'
import ReceiptLongOutlined from '@mui/icons-material/ReceiptLongOutlined'
import TaskAltRounded from '@mui/icons-material/TaskAltRounded'
import LocalShippingRounded from '@mui/icons-material/LocalShippingRounded'
import HomeWorkRounded from '@mui/icons-material/HomeWorkRounded'
import ErrorOutlineRounded from '@mui/icons-material/ErrorOutlineRounded'
import { tokens } from '../../../theme'
import { credit, type Order, type OrderStatus } from '../../../data/account'
import { money } from '../../../data/catalog'
import { Panel } from '../../../components/ui'

const c = tokens.color

/* ------------------------------------------------------------------ Order tracker */

const steps: { s: OrderStatus; label: string; icon: ReactNode }[] = [
  { s: 'Pending', label: 'Placed', icon: <ReceiptLongOutlined /> },
  { s: 'Confirmed', label: 'Confirmed', icon: <TaskAltRounded /> },
  { s: 'On the way', label: 'On the way', icon: <LocalShippingRounded /> },
  { s: 'Delivered', label: 'Delivered', icon: <HomeWorkRounded /> },
]

/** Horizontal progress tracker built only from the Magento order status (no new data). */
export function OrderTracker({ status, eta, date }: { status: OrderStatus; eta?: string; date?: string }) {
  if (status === 'Cancelled') {
    return (
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ p: 2, borderRadius: `${tokens.radius.md}px`, bgcolor: c.surface2, border: `1px solid ${c.line}` }}>
        <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#fff', border: `2px solid ${c.text3}`, color: c.text2, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <CloseRounded />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 700 }}>Order cancelled</Typography>
          <Typography variant="body2" color="text.secondary">No charge was made. Items that were out of stock have been released.</Typography>
        </Box>
      </Stack>
    )
  }
  const idx = steps.findIndex((x) => x.s === status)
  return (
    <Box>
      <Box component="ol" aria-label={`Order status: ${status}`} sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {steps.map((st, i) => {
          const done = i < idx || status === 'Delivered'
          const current = i === idx && status !== 'Delivered'
          return (
            <Box component="li" key={st.s} aria-current={current ? 'step' : undefined} sx={{ position: 'relative', textAlign: 'center' }}>
              {i > 0 && (
                <Box sx={{ position: 'absolute', top: 19, right: '50%', width: '100%', height: 4, borderRadius: 2, bgcolor: i <= idx ? c.navy : c.line, zIndex: 0 }} />
              )}
              <Box
                sx={{
                  position: 'relative', zIndex: 1, width: 42, height: 42, mx: 'auto', borderRadius: '50%', display: 'grid', placeItems: 'center',
                  bgcolor: done ? c.navy : current ? '#fff' : c.surface2, color: done ? '#fff' : current ? c.navy : c.text3,
                  border: `3px solid ${done || current ? c.navy : c.line}`, boxShadow: current ? `0 0 0 5px ${c.navyTint}` : 'none',
                  '& svg': { fontSize: 20 },
                }}
              >
                {done ? <CheckRounded /> : st.icon}
              </Box>
              <Typography sx={{ mt: 1, fontSize: { xs: 11.5, md: 13 }, fontWeight: current || done ? 700 : 500, color: current || done ? c.ink : c.text3 }}>{st.label}</Typography>
              {i === 0 && date && <Typography sx={{ fontSize: 11, color: c.text3, display: { xs: 'none', sm: 'block' } }}>{fmtDate(date)}</Typography>}
              {current && st.s === 'On the way' && eta && <Typography sx={{ fontSize: 11, color: c.navy, fontWeight: 600 }}>{eta}</Typography>}
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

/* ------------------------------------------------------------------ Credit */

export function CreditBar({ height = 10 }: { height?: number }) {
  const used = ((credit.limit - credit.available) / credit.limit) * 100
  return (
    <Box>
      <LinearProgress
        variant="determinate"
        value={100 - used}
        aria-label={`Available credit ${money(credit.available)} of ${money(credit.limit)}`}
        sx={{ height, borderRadius: height, bgcolor: c.redTint, '& .MuiLinearProgress-bar': { bgcolor: c.successText, borderRadius: height } }}
      />
      <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.75, fontSize: 12, color: c.text2 }}>
        <span><Box component="span" sx={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', bgcolor: c.successText, mr: 0.5 }} />Available {Math.round(100 - used)}%</span>
        <span><Box component="span" sx={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', bgcolor: '#F7B9B4', mr: 0.5 }} />Used {100 - Math.round(100 - used)}%</span>
      </Stack>
    </Box>
  )
}

/** Donut of used vs available credit — inline SVG. */
export function CreditDonut({ size = 168 }: { size?: number }) {
  const r = 42
  const circ = 2 * Math.PI * r
  const availPct = credit.available / credit.limit
  const overduePct = credit.overdue / credit.limit
  const restUsed = 1 - availPct - overduePct
  return (
    <Box sx={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label={`${Math.round(availPct * 100)}% of credit available`}>
        <circle cx="50" cy="50" r={r} fill="none" stroke={c.surface2} strokeWidth="11" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={c.successText} strokeWidth="11" strokeDasharray={`${availPct * circ} ${circ}`} transform="rotate(-90 50 50)" strokeLinecap="butt" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={c.navy} strokeWidth="11" strokeDasharray={`${restUsed * circ} ${circ}`} strokeDashoffset={-availPct * circ} transform="rotate(-90 50 50)" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={c.error} strokeWidth="11" strokeDasharray={`${overduePct * circ} ${circ}`} strokeDashoffset={-(availPct + restUsed) * circ} transform="rotate(-90 50 50)" />
      </svg>
      <Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
        <Box>
          <Typography sx={{ fontSize: 11, color: c.text3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em' }}>Available</Typography>
          <Typography sx={{ fontWeight: 800, fontSize: size > 150 ? 22 : 18, color: c.ink, lineHeight: 1.1 }}>{money(credit.available)}</Typography>
          <Typography sx={{ fontSize: 11, color: c.text3 }}>of {money(credit.limit)}</Typography>
        </Box>
      </Box>
    </Box>
  )
}

export function Legend({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ fontSize: 13 }}>
      <Box sx={{ width: 10, height: 10, borderRadius: 0.5, bgcolor: color, flexShrink: 0 }} />
      <Box sx={{ color: c.text2, flex: 1 }}>{label}</Box>
      <Box sx={{ fontWeight: 700 }}>{value}</Box>
    </Stack>
  )
}

/** KPI tile. */
export function Kpi({ label, value, tone = 'default', hint, action }: { label: string; value: string; tone?: 'default' | 'error' | 'success' | 'warning'; hint?: ReactNode; action?: ReactNode }) {
  const col = { default: c.ink, error: c.error, success: c.successText, warning: c.warning }[tone]
  return (
    <Box sx={{ p: 2, borderRadius: `${tokens.radius.md}px`, bgcolor: tone === 'error' ? c.errorTint : c.bg, border: `1px solid ${tone === 'error' ? '#F5C2C2' : c.line}`, minWidth: 0 }}>
      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: tone === 'error' ? c.error : c.text2 }}>
        {tone === 'error' && <ErrorOutlineRounded sx={{ fontSize: 16 }} />}
        <Typography sx={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'inherit' }}>{label}</Typography>
      </Stack>
      <Typography sx={{ fontSize: { xs: 20, md: 24 }, fontWeight: 800, color: col, mt: 0.5, letterSpacing: '-.01em' }}>{value}</Typography>
      {hint && <Box sx={{ fontSize: 12, color: c.text3, mt: 0.25 }}>{hint}</Box>}
      {action && <Box sx={{ mt: 1 }}>{action}</Box>}
    </Box>
  )
}

export function PanelSkeleton({ h = 180 }: { h?: number }) {
  return (
    <Panel>
      <Skeleton width="40%" height={28} />
      <Skeleton variant="rounded" height={h} sx={{ mt: 1.5 }} />
    </Panel>
  )
}

export function PanelHead({ title, action, href }: { title: ReactNode; action?: string; href?: string }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
      <Typography variant="h4" component="h2">{title}</Typography>
      {action && href && (
        <Button component={RouterLink} to={href} size="small" sx={{ color: c.navy }}>{action}</Button>
      )}
    </Stack>
  )
}

export const fmtDate = (d: string) => new Date(d + 'T12:00:00').toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })

export const itemCount = (o: Order) => o.items.reduce((a, i) => a + i.qty, 0)

export const whatsapp = 'https://wa.me/13657770999'
