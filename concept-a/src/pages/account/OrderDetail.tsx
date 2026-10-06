import { Box, Button, Divider, Stack, Typography } from '@mui/material'
import { Link as RouterLink, useParams } from 'react-router-dom'
import ReplayRounded from '@mui/icons-material/ReplayRounded'
import PictureAsPdfOutlined from '@mui/icons-material/PictureAsPdfOutlined'
import WhatsApp from '@mui/icons-material/WhatsApp'
import AddShoppingCartRounded from '@mui/icons-material/AddShoppingCartRounded'
import SearchOffRounded from '@mui/icons-material/SearchOffRounded'
import CreditCardRounded from '@mui/icons-material/CreditCardRounded'
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined'
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded'
import { tokens } from '../../theme'
import { addresses, invoices, orders } from '../../data/account'
import { money, productBySku } from '../../data/catalog'
import { useApp } from '../../state/AppState'
import { EmptyState, NewFeatureTag, PackChip, Panel, Sku, StatusChip } from '../../components/ui'
import { ProductImage } from '../../components/Brand'
import { AddressCard } from '../../components/Shared'
import { OrderTracker, PanelHead, PanelSkeleton, fmtDate, itemCount, whatsapp } from './parts/AccountParts'
import { ChannelLabel } from './Orders'

const c = tokens.color

export default function OrderDetail() {
  const { number } = useParams()
  const { review, addToCart, toast } = useApp()
  const o = orders.find((x) => x.number === number)

  if (!o) {
    return (
      <Panel>
        <EmptyState icon={<SearchOffRounded />} title={`We can’t find order #${number}`} body="It may belong to another account, or the number has a typo. Your recent orders are listed in Orders." action="Back to orders" href="/account/orders" />
      </Panel>
    )
  }

  const inv = invoices.find((i) => i.order === o.number)
  const addr = o.channel === 'Online' ? addresses[0] : undefined

  return (
    <Stack spacing={{ xs: 2, md: 3 }}>
      <Button component={RouterLink} to="/account/orders" startIcon={<ArrowBackRounded />} sx={{ alignSelf: 'flex-start', color: c.navy, ml: -1 }}>All orders</Button>

      <Panel>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2} alignItems={{ md: 'flex-start' }}>
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
              <Typography variant="h2" component="h2">Order #{o.number}</Typography>
              <StatusChip status={o.status} size="medium" />
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1, color: c.text2, fontSize: 14 }} flexWrap="wrap" useFlexGap>
              <span>Placed {fmtDate(o.date)}</span>
              <ChannelLabel channel={o.channel} />
              <span>{itemCount(o)} items</span>
              {inv && <span>Invoice {inv.number}</span>}
            </Stack>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button variant="contained" startIcon={<ReplayRounded />} onClick={() => o.items.forEach((i) => addToCart(i.sku, i.qty))}>Reorder all</Button>
            <Button variant="outlined" color="secondary" startIcon={<PictureAsPdfOutlined />} disabled={o.status === 'Cancelled'} onClick={() => toast(`Invoice ${inv?.number ?? 'INV-' + o.number} downloaded`)}>Invoice PDF</Button>
            <Button variant="text" startIcon={<WhatsApp />} href={whatsapp} target="_blank" sx={{ color: c.navy }}>Need help?</Button>
          </Stack>
        </Stack>

        <Box sx={{ mt: 3, p: { xs: 2, md: 3 }, borderRadius: `${tokens.radius.md}px`, bgcolor: c.bg }}>
          {review.loading ? <PanelSkeleton h={60} /> : <OrderTracker status={o.status} eta={o.eta} date={o.date} />}
          {o.status === 'On the way' && (
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }} sx={{ mt: 2.5, pt: 2, borderTop: `1px solid ${c.line}` }}>
              <LocalShippingOutlined sx={{ color: c.navy }} />
              <Typography sx={{ fontSize: 14 }}>Arriving <b>{o.eta}</b> on the Peel &amp; West GTA route · cold-chain truck</Typography>
              <NewFeatureTag label="Live driver ETA" note="route / driver ETA feed" sx={{ ml: { sm: 'auto' } }} />
            </Stack>
          )}
        </Box>
      </Panel>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', xl: 'minmax(0,1.8fr) minmax(0,1fr)' }, gap: { xs: 2, md: 3 }, alignItems: 'start' }}>
        <Panel>
          <PanelHead title={`Items (${o.items.length})`} />
          {review.loading ? <PanelSkeleton h={260} /> : (
            <Stack divider={<Divider />}>
              {o.items.map((it) => {
                const p = productBySku(it.sku)
                if (!p) return null
                return (
                  <Box key={it.sku} sx={{ display: 'grid', gridTemplateColumns: { xs: '64px minmax(0,1fr)', md: '72px minmax(0,1fr) 110px 110px 160px' }, gap: { xs: 1.5, md: 2 }, alignItems: 'center', py: 1.75 }}>
                    <Box component={RouterLink} to={`/p/${p.slug}`}><ProductImage src={p.images[0]} alt={p.name} brand={p.brand} sx={{ '& [role=img] > div > div:last-of-type': { display: 'none' }, '& [role=img] > div > div:first-of-type': { width: 36, height: 36, fontSize: 12 } }} /></Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography component={RouterLink} to={`/p/${p.slug}`} title={p.name}
                        sx={{ fontWeight: 600, fontSize: 14, color: c.ink, textDecoration: 'none', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', '&:hover': { color: c.red } }}>
                        {p.name}
                      </Typography>
                      <Sku sku={p.sku} sx={{ mt: 0.25 }} />
                      <Box sx={{ mt: 0.5 }}><PackChip pack={p.pack} size="sm" /></Box>
                      <Typography sx={{ display: { md: 'none' }, fontSize: 13, color: c.text2, mt: 0.75 }}>
                        {it.qty} × {money(it.price)} = <b style={{ color: c.ink }}>{money(it.qty * it.price)}</b>
                      </Typography>
                    </Box>
                    <Typography sx={{ display: { xs: 'none', md: 'block' }, fontSize: 14, color: c.text2, textAlign: 'right' }}>{it.qty} × {money(it.price)}</Typography>
                    <Typography sx={{ display: { xs: 'none', md: 'block' }, fontWeight: 700, textAlign: 'right' }}>{money(it.qty * it.price)}</Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<AddShoppingCartRounded />}
                      disabled={p.stock === 'OUT_OF_STOCK'}
                      onClick={() => addToCart(p.sku, it.qty)}
                      sx={{ gridColumn: { xs: '1 / -1', md: 'auto' }, minHeight: 40 }}
                    >
                      {p.stock === 'OUT_OF_STOCK' ? 'Out of stock' : `Add ${it.qty} to cart`}
                    </Button>
                  </Box>
                )
              })}
            </Stack>
          )}
        </Panel>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0,1fr))', xl: '1fr' }, gap: { xs: 2, md: 3 }, alignItems: 'start' }}>
          <Panel>
            <PanelHead title="Order total" />
            <Stack spacing={1} sx={{ fontSize: 14 }}>
              <Stack direction="row" justifyContent="space-between"><span>Subtotal</span><span>{money(o.subtotal)}</span></Stack>
              <Stack direction="row" justifyContent="space-between"><span>HST (13%)</span><span>{money(o.tax)}</span></Stack>
              <Stack direction="row" justifyContent="space-between"><span>Delivery</span><span>{o.delivery ? money(o.delivery) : o.channel === 'Online' ? 'Free' : 'Pickup'}</span></Stack>
              <Divider sx={{ my: 0.5 }} />
              <Stack direction="row" justifyContent="space-between" sx={{ fontWeight: 800, fontSize: 18 }}><span>Total</span><span>{money(o.total)}</span></Stack>
            </Stack>
          </Panel>
          <Panel>
            <PanelHead title={o.channel === 'Online' ? 'Delivery address' : 'Picked up at'} />
            {addr ? <AddressCard address={addr} /> : (
              <Box sx={{ p: 2, borderRadius: `${tokens.radius.md}px`, border: `1px solid ${c.line}` }}>
                <Typography sx={{ fontWeight: 700 }}>Supreme Cash &amp; Carry — Mississauga</Typography>
                <Typography sx={{ fontSize: 13.5, color: c.text2 }}>3750A Laird Road, Unit 9<br />Mississauga, ON</Typography>
              </Box>
            )}
          </Panel>
          <Panel>
            <PanelHead title="Payment" />
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box sx={{ width: 44, height: 44, borderRadius: `${tokens.radius.sm}px`, bgcolor: c.navyTint, color: c.navy, display: 'grid', placeItems: 'center' }}><CreditCardRounded /></Box>
              <Box>
                <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{o.channel === 'Online' ? 'On account · Net 30' : 'Visa •••• 4242 (in store)'}</Typography>
                <Typography sx={{ fontSize: 12.5, color: c.text2 }}>{inv ? `${inv.number} · ${inv.status}` : 'Invoice issued on delivery'}</Typography>
              </Box>
            </Stack>
          </Panel>
        </Box>
      </Box>
    </Stack>
  )
}
