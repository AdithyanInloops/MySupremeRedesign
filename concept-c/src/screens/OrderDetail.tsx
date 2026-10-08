import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
import { Box, Button, Divider, IconButton, Typography } from '@mui/material'
import { tokens, focusRing } from '../theme'
import { useApp } from '../state/app'
import { money, productBySku } from '../data/catalog'
import { invoices } from '../data/account'
import { dayDate } from '../data/format'
import { productPath } from '../components/ProductCard'
import { BottomBar, EmptyState, ProductImage, StatusChip, TopBar } from '../components/ui'
import { CheckIcon, DownloadIcon, HelpCircleIcon, MapPinIcon, PhoneIcon, ReceiptIcon, RotateCcwIcon, TruckIcon } from '../components/icons'

const c = tokens.color
const STEPS = ['Placed', 'Confirmed', 'Packed', 'On the way', 'Delivered']
const stepOf: Record<string, number> = { Pending: 0, Confirmed: 1, 'On the way': 3, Delivered: 4, Cancelled: -1 }

/** Order detail: live status timeline, driver card when on the way, items, totals, invoice, reorder. */
export default function OrderDetail() {
  const { number } = useParams()
  const { orders, addMany, notify } = useApp()
  const navigate = useNavigate()
  const order = orders.find((o) => o.number === number)
  if (!order) return <><TopBar title="Order" /><EmptyState icon={ReceiptIcon} title="Order not found" body="Check the order number, or see all your orders." action="All orders" to="/orders" /></>

  const step = stepOf[order.status] ?? 1
  const items = order.items.map((i) => ({ ...i, product: productBySku(i.sku) })).filter((i) => i.product)
  const invoice = invoices.find((i) => i.order === order.number)
  const onTheWay = order.status === 'On the way'

  return (
    <Box>
      <TopBar title={`Order #${order.number}`} subtitle={`${dayDate(order.date)} · ${order.channel === 'Online' ? 'Online' : 'In store'}`} actions={<IconButton component={RouterLink} to="/help" aria-label="Get help with this order"><HelpCircleIcon /></IconButton>} />
      <Box sx={{ px: 2, pt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box sx={{ p: 2, borderRadius: `${tokens.radius.lg}px`, bgcolor: order.status === 'Cancelled' ? '#fff' : c.navy, color: order.status === 'Cancelled' ? c.ink : '#fff', border: order.status === 'Cancelled' ? `1px solid ${c.line}` : 'none' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
            <Box>
              <Typography sx={{ fontSize: 12.5, opacity: 0.8 }}>{order.status === 'Delivered' ? 'Delivered' : order.status === 'Cancelled' ? 'This order was cancelled' : onTheWay ? 'Arriving' : 'Scheduled'}</Typography>
              <Typography sx={{ fontSize: 20, fontWeight: 800 }}>{order.status === 'Delivered' ? dayDate(order.date) : order.status === 'Cancelled' ? 'No charge was made' : order.eta ?? 'We’ll confirm a window soon'}</Typography>
            </Box>
            {order.status === 'Cancelled' && <StatusChip status="Cancelled" />}
          </Box>
          {step >= 0 && (
            <Box component="ol" aria-label={`Status: ${order.status}`} sx={{ listStyle: 'none', p: 0, m: 0, mt: 2, display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0,1fr))' }}>
              {STEPS.map((s, i) => {
                const done = i <= step
                return (
                  <Box component="li" key={s} aria-current={i === step ? 'step' : undefined} sx={{ position: 'relative', textAlign: 'center' }}>
                    {i > 0 && <Box sx={{ position: 'absolute', top: 11, right: '50%', width: '100%', height: 3, bgcolor: i <= step ? c.saffron : 'rgba(255,255,255,.22)' }} />}
                    <Box sx={{ position: 'relative', width: 24, height: 24, mx: 'auto', borderRadius: '50%', bgcolor: done ? c.saffron : c.navyMid, color: c.ink, display: 'grid', placeItems: 'center', boxShadow: i === step ? `0 0 0 4px rgba(255,197,49,.3)` : 'none' }}>{done && <CheckIcon sx={{ fontSize: 15 }} />}</Box>
                    <Typography sx={{ fontSize: 10.5, mt: 0.75, fontWeight: i === step ? 700 : 500, opacity: done ? 1 : 0.65 }}>{s}</Typography>
                  </Box>
                )
              })}
            </Box>
          )}
        </Box>

        {onTheWay && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, bgcolor: '#fff', borderRadius: `${tokens.radius.md}px`, border: `1px solid ${c.line}` }}>
            <Box sx={{ width: 44, height: 44, borderRadius: '50%', bgcolor: c.navyTint, color: c.navy, display: 'grid', placeItems: 'center', fontWeight: 700 }}>SM</Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontWeight: 600, fontSize: 14.5 }}>Sam · your driver</Typography>
              <Typography sx={{ fontSize: 12.5, color: c.text3, display: 'flex', alignItems: 'center', gap: 0.5 }}><TruckIcon sx={{ fontSize: 15 }} /> 3 stops away · refrigerated truck</Typography>
            </Box>
            <IconButton component="a" href="tel:+13657770999" aria-label="Call the driver" sx={{ bgcolor: c.successTint, color: c.successText }}><PhoneIcon /></IconButton>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 1.5, p: 1.5, bgcolor: '#fff', borderRadius: `${tokens.radius.md}px`, border: `1px solid ${c.line}` }}>
          <MapPinIcon sx={{ color: c.navy, mt: 0.25 }} />
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{order.channel === 'Online' ? 'Spice Route Kitchen' : 'Bought in store · Mississauga'}</Typography>
            <Typography sx={{ fontSize: 13, color: c.text2 }}>{order.channel === 'Online' ? '2150 Burnhamthorpe Rd W, Unit 4, Mississauga' : '3750A Laird Road, Unit 9'}</Typography>
          </Box>
        </Box>

        <Box sx={{ bgcolor: '#fff', borderRadius: `${tokens.radius.md}px`, border: `1px solid ${c.line}`, px: 1.5 }}>
          <Typography component="h2" variant="overline" sx={{ display: 'block', color: c.text3, pt: 1.5 }}>{items.length} products</Typography>
          {items.map((i) => (
            <Box key={i.sku} component={RouterLink} to={productPath(i.product!)} sx={{ display: 'grid', gridTemplateColumns: '52px minmax(0,1fr) auto', gap: 1.5, alignItems: 'center', py: 1.25, borderBottom: `1px solid ${c.line}`, color: 'inherit', textDecoration: 'none', '&:last-of-type': { borderBottom: 0 }, ...focusRing }}>
              <ProductImage product={i.product!} radius={8} />
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: 13.5, fontWeight: 500, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{i.product!.name}</Typography>
                <Typography sx={{ fontSize: 12, color: c.text3 }}>{i.qty} × {money(i.price)}</Typography>
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: 14, fontVariantNumeric: 'tabular-nums' }}>{money(i.qty * i.price)}</Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: `${tokens.radius.md}px`, border: `1px solid ${c.line}` }}>
          {[['Subtotal', money(order.subtotal)], ['Delivery', order.delivery ? money(order.delivery) : 'Free'], ['HST', money(order.tax)]].map(([k, v]) => (
            <Box key={k} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, fontSize: 14, color: c.text2 }}><span>{k}</span><Box component="span" sx={{ color: c.ink }}>{v}</Box></Box>
          ))}
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 17 }}><span>Total</span><span>{money(order.total)}</span></Box>
          {invoice && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1.5, pt: 1.5, borderTop: `1px solid ${c.line}` }}>
              <Box><Typography sx={{ fontSize: 13.5, fontWeight: 600 }}>{invoice.number}</Typography><StatusChip status={invoice.status} /></Box>
              <Button startIcon={<DownloadIcon />} onClick={() => notify({ message: 'Invoice downloaded', detail: `${invoice.number}.pdf`, tone: 'info' })} sx={{ color: c.navy }}>PDF</Button>
            </Box>
          )}
        </Box>
      </Box>

      {order.status !== 'Cancelled' ? (
        <BottomBar>
          <Button fullWidth variant="contained" size="large" startIcon={<RotateCcwIcon />} onClick={() => { addMany(items.map((i) => ({ sku: i.sku, qty: i.qty })), `Order #${order.number} added`); navigate('/cart') }}>Reorder all · {order.items.reduce((a, i) => a + i.qty, 0)} items</Button>
        </BottomBar>
      ) : <Box sx={{ height: 24 }} />}
    </Box>
  )
}
