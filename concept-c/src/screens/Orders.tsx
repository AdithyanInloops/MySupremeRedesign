import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { Box, Button, IconButton, Typography } from '@mui/material'
import { tokens, focusRing } from '../theme'
import { useApp } from '../state/app'
import { money, productBySku } from '../data/catalog'
import type { Order, OrderStatus } from '../data/account'
import { dayDate } from '../data/format'
import { EmptyState, Pill, ProductImage, Segmented, StatusChip } from '../components/ui'
import { ChevronLeftIcon, ReceiptIcon, RotateCcwIcon, StoreIcon, TruckIcon } from '../components/icons'

const c = tokens.color

export function OrderCard({ order }: { order: Order }) {
  const { addMany } = useApp()
  const navigate = useNavigate()
  const items = order.items.map((i) => ({ ...i, product: productBySku(i.sku) })).filter((i) => i.product)
  const units = order.items.reduce((a, i) => a + i.qty, 0)
  const live = order.status === 'On the way' || order.status === 'Confirmed' || order.status === 'Pending'
  return (
    <Box component="article" aria-label={`Order ${order.number}, ${order.status}, ${money(order.total)}`} sx={{ bgcolor: '#fff', borderRadius: `${tokens.radius.md}px`, border: `1px solid ${c.line}`, overflow: 'hidden' }}>
      <Box component={RouterLink} to={`/orders/${order.number}`} sx={{ display: 'block', p: 1.75, color: 'inherit', textDecoration: 'none', ...focusRing, '&:active': { bgcolor: c.surface2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {order.channel === 'Online' ? <TruckIcon sx={{ fontSize: 18, color: c.text3 }} /> : <StoreIcon sx={{ fontSize: 18, color: c.text3 }} />}
            <Typography sx={{ fontWeight: 700, fontSize: 15 }}>#{order.number}</Typography>
          </Box>
          <StatusChip status={order.status} />
        </Box>
        <Typography sx={{ fontSize: 12.5, color: c.text3, mt: 0.25 }}>{dayDate(order.date)} · {order.channel === 'Online' ? 'Online' : 'In store'} · {units} items</Typography>
        {live && order.eta && <Typography sx={{ fontSize: 13, color: c.navy, fontWeight: 600, mt: 0.75 }}>{order.status === 'On the way' ? 'Arriving' : 'Scheduled'} {order.eta}</Typography>}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 1.25 }}>
          {items.slice(0, 4).map((i) => <Box key={i.sku} sx={{ width: 44, flexShrink: 0 }}><ProductImage product={i.product!} radius={8} /></Box>)}
          {items.length > 4 && <Box sx={{ width: 44, height: 44, borderRadius: '8px', bgcolor: c.surface2, display: 'grid', placeItems: 'center', fontSize: 12.5, fontWeight: 700, color: c.text2 }}>+{items.length - 4}</Box>}
          <Typography sx={{ ml: 'auto', fontWeight: 800, fontSize: 16, fontVariantNumeric: 'tabular-nums' }}>{money(order.total)}</Typography>
        </Box>
      </Box>
      {order.status !== 'Cancelled' && (
        <Box sx={{ display: 'flex', borderTop: `1px solid ${c.line}` }}>
          <Button fullWidth startIcon={<RotateCcwIcon />} onClick={() => { addMany(items.map((i) => ({ sku: i.sku, qty: i.qty })), `Order #${order.number} added`); navigate('/cart') }} sx={{ borderRadius: 0, color: c.red, minHeight: 46 }}>Reorder</Button>
          <Box sx={{ width: '1px', bgcolor: c.line }} />
          <Button fullWidth component={RouterLink} to={`/orders/${order.number}`} sx={{ borderRadius: 0, color: c.navy, minHeight: 46 }}>{order.status === 'On the way' ? 'Track' : 'Details'}</Button>
        </Box>
      )}
    </Box>
  )
}

const FILTERS: ('All' | OrderStatus)[] = ['All', 'On the way', 'Confirmed', 'Pending', 'Delivered', 'Cancelled']

/** Orders tab: online + in-store (POS) orders, status filter, one-tap reorder. Guests are asked to sign in. */
export default function Orders() {
  const { signedIn, orders } = useApp()
  const navigate = useNavigate()
  const back = () => ((window.history.state?.idx ?? 0) > 0 ? navigate(-1) : navigate('/account'))
  const [channel, setChannel] = useState<'all' | 'Online' | 'Direct store'>('all')
  const [status, setStatus] = useState<(typeof FILTERS)[number]>('All')
  const list = orders.filter((o) => (channel === 'all' || o.channel === channel) && (status === 'All' || o.status === status))
  return (
    <Box>
      <Box sx={{ position: 'sticky', top: 0, zIndex: 20, bgcolor: 'rgba(244,244,246,.96)', backdropFilter: 'blur(12px)', px: 2, pt: 'calc(8px + env(safe-area-inset-top))', pb: 1.25 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: -1.25 }}>
          <IconButton aria-label="Back" onClick={back} sx={{ width: 44, height: 44, color: c.ink }}><ChevronLeftIcon /></IconButton>
          <Typography component="h1" sx={{ fontSize: 24, fontWeight: 800, letterSpacing: '-.02em' }}>Orders</Typography>
        </Box>
        {signedIn && (
          <>
            <Box sx={{ mt: 1.5 }}><Segmented label="Channel" value={channel} onChange={setChannel} options={[{ value: 'all', label: 'All' }, { value: 'Online', label: 'Online' }, { value: 'Direct store', label: 'In store' }]} /></Box>
            <Box className="no-scrollbar" sx={{ display: 'flex', gap: 1, overflowX: 'auto', mt: 1.25, mx: -2, px: 2 }}>
              {FILTERS.map((f) => <Pill key={f} active={status === f} onClick={() => setStatus(f)}>{f}</Pill>)}
            </Box>
          </>
        )}
      </Box>
      {!signedIn && !orders.length ? (
        <EmptyState icon={ReceiptIcon} title="Sign in to see your orders" body="Online and in-store orders, delivery tracking, invoices and one-tap reorder — all in one place." action="Sign in" to="/signin" />
      ) : list.length ? (
        <Box sx={{ px: 2, pt: 0.5, pb: 2, display: 'flex', flexDirection: 'column', gap: 1.25 }}>{list.map((o) => <OrderCard key={o.number} order={o} />)}</Box>
      ) : (
        <EmptyState icon={ReceiptIcon} title="No orders here" body="Try another filter, or start a new order." action="Show all orders" onAction={() => { setChannel('all'); setStatus('All') }} />
      )}
    </Box>
  )
}

