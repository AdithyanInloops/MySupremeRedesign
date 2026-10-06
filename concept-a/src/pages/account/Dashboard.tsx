import { Box, Button, Stack, Typography } from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import ReplayRounded from '@mui/icons-material/ReplayRounded'
import DownloadRounded from '@mui/icons-material/DownloadRounded'
import RequestQuoteOutlined from '@mui/icons-material/RequestQuoteOutlined'
import WhatsApp from '@mui/icons-material/WhatsApp'
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded'
import ReceiptLongOutlined from '@mui/icons-material/ReceiptLongOutlined'
import ShoppingBagOutlined from '@mui/icons-material/ShoppingBagOutlined'
import PaymentsOutlined from '@mui/icons-material/PaymentsOutlined'
import { tokens } from '../../theme'
import { addresses, credit, customer, invoices, orders } from '../../data/account'
import { money, productBySku, type Product } from '../../data/catalog'
import { useApp } from '../../state/AppState'
import { EmptyState, NewFeatureTag, Panel, StatusChip } from '../../components/ui'
import { ProductRail } from '../../components/Commerce'
import { ProductImage } from '../../components/Brand'
import { CreditBar, Kpi, PanelHead, PanelSkeleton, fmtDate, itemCount, whatsapp } from './parts/AccountParts'

const c = tokens.color

function QuickAction({ icon, title, body, onClick, href, external }: { icon: React.ReactNode; title: string; body: string; onClick?: () => void; href?: string; external?: boolean }) {
  const common = {
    display: 'flex', alignItems: 'center', gap: 1.5, p: 1.75, borderRadius: `${tokens.radius.md}px`, border: `1px solid ${c.line}`, bgcolor: '#fff',
    textDecoration: 'none', color: c.ink, textAlign: 'left' as const, cursor: 'pointer', font: 'inherit', width: '100%', minHeight: 72,
    transition: 'box-shadow .2s, border-color .2s', '&:hover': { boxShadow: tokens.shadow.hover, borderColor: 'transparent' }, '&:hover .qa-ic': { bgcolor: c.red, color: '#fff' },
  }
  const inner = (
    <>
      <Box className="qa-ic" sx={{ width: 44, height: 44, borderRadius: `${tokens.radius.sm}px`, bgcolor: c.redTint, color: c.red, display: 'grid', placeItems: 'center', flexShrink: 0, transition: 'all .2s' }}>{icon}</Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{title}</Typography>
        <Typography sx={{ fontSize: 12.5, color: c.text2 }}>{body}</Typography>
      </Box>
    </>
  )
  if (href && external) return <Box component="a" href={href} target="_blank" rel="noreferrer" sx={common}>{inner}</Box>
  if (href) return <Box component={RouterLink} to={href} sx={common}>{inner}</Box>
  return <Box component="button" onClick={onClick} sx={common}>{inner}</Box>
}

export default function Dashboard() {
  const { review, addToCart, toast } = useApp()
  const nav = useNavigate()
  const last = orders.find((o) => o.status !== 'Cancelled')!
  const recent = review.empty ? [] : orders.slice(0, 3)
  const openInv = review.empty ? [] : invoices.filter((i) => i.status !== 'Paid').sort((a, b) => (a.status === 'Overdue' ? -1 : b.status === 'Overdue' ? 1 : 0))
  const buyAgain = Array.from(new Set(orders.flatMap((o) => o.items.map((i) => i.sku)))).map(productBySku).filter(Boolean) as Product[]
  const def = addresses.find((a) => a.defaultShipping)!

  const reorder = () => {
    last.items.forEach((i) => addToCart(i.sku, i.qty))
  }

  return (
    <Stack spacing={{ xs: 2, md: 3 }}>
      <Box>
        <Typography variant="h2" component="h2">Good morning, {customer.firstName}</Typography>
        <Typography color="text.secondary">Here’s where your kitchen account stands today.</Typography>
      </Box>

      {/* Credit + quick actions */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.35fr 1fr' }, gap: { xs: 2, md: 3 } }}>
        {review.loading ? <PanelSkeleton h={200} /> : (
          <Panel>
            <PanelHead title="Credit summary" action="Credit dashboard" href="/account/customerdashbord" />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'flex-end' }} justifyContent="space-between">
              <Box>
                <Typography sx={{ fontSize: 13, color: c.text2 }}>Available credit</Typography>
                <Typography sx={{ fontSize: { xs: 32, md: 40 }, fontWeight: 800, letterSpacing: '-.02em', lineHeight: 1.1 }}>{money(credit.available)}</Typography>
                <Typography sx={{ fontSize: 13, color: c.text3 }}>of {money(credit.limit)} limit · Terms <b style={{ color: c.ink }}>{credit.terms}</b></Typography>
              </Box>
            </Stack>
            <Box sx={{ mt: 2 }}><CreditBar /></Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 1.25, mt: 2.5 }}>
              <Kpi label="Outstanding" value={money(credit.outstanding)} />
              <Kpi label="Due" value={money(credit.due)} hint="Next 30 days" />
              <Box sx={{ gridColumn: { xs: '1 / -1', md: 'auto' } }}>
                <Kpi label="Overdue" value={money(credit.overdue)} tone="error" hint="INV-2041 · 9 days late"
                  action={<Button size="small" variant="contained" onClick={() => nav('/account/customerdashbord/invoices')} sx={{ minHeight: 36 }}>Pay now</Button>} />
              </Box>
            </Box>
          </Panel>
        )}

        <Panel>
          <PanelHead title="Quick actions" />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr' }, gap: 1.25 }}>
            <QuickAction icon={<ReplayRounded />} title="Reorder last order" body={`#${last.number} · ${itemCount(last)} items · ${money(last.total)}`} onClick={reorder} />
            <QuickAction icon={<DownloadRounded />} title="Download statement" body="September 2026 · PDF" onClick={() => toast('Statement for September 2026 downloaded')} />
            <QuickAction icon={<RequestQuoteOutlined />} title="Request a quote" body="Catering, events or bulk volumes" href="/account/customerdashbord/quotes" />
            <QuickAction icon={<WhatsApp />} title="Talk to your rep" body="WhatsApp · Mon–Sat 9am–6pm" href={whatsapp} external />
          </Box>
        </Panel>
      </Box>

      {/* Recent orders + invoices */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.35fr 1fr' }, gap: { xs: 2, md: 3 } }}>
        {review.loading ? <PanelSkeleton h={240} /> : (
          <Panel>
            <PanelHead title="Recent orders" action="All orders" href="/account/orders" />
            {recent.length === 0 ? (
              <EmptyState icon={<ShoppingBagOutlined />} title="No orders yet" body="Your online and cash & carry orders will show up here so you can reorder in one tap." action="Start shopping" href="/all-categories" />
            ) : (
              <Stack spacing={1.25}>
                {recent.map((o) => {
                  const first = productBySku(o.items[0].sku)
                  return (
                    <Box key={o.number} component={RouterLink} to={`/account/orders/${o.number}`}
                      sx={{ display: 'grid', gridTemplateColumns: { xs: '56px 1fr', sm: '56px 1fr auto auto' }, gap: 1.5, alignItems: 'center', p: 1.25, borderRadius: `${tokens.radius.md}px`, border: `1px solid ${c.line}`, textDecoration: 'none', color: c.ink, '&:hover': { bgcolor: c.bg } }}>
                      <ProductImage src={first?.images[0]} alt={first?.name ?? ''} brand={first?.brand} sx={{ '& [role=img] > div > div:last-of-type': { display: 'none' }, '& [role=img] > div > div:first-of-type': { width: 32, height: 32, fontSize: 11 } }} />
                      <Box sx={{ minWidth: 0 }}>
                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                          <Typography sx={{ fontWeight: 700, fontSize: 14 }}>#{o.number}</Typography>
                          <StatusChip status={o.status} />
                        </Stack>
                        <Typography sx={{ fontSize: 12.5, color: c.text2, mt: 0.25 }}>
                          {fmtDate(o.date)} · {o.channel} · {itemCount(o)} items{o.eta ? ` · ETA ${o.eta}` : ''}
                        </Typography>
                      </Box>
                      <Typography sx={{ fontWeight: 700, display: { xs: 'none', sm: 'block' } }}>{money(o.total)}</Typography>
                      <Button size="small" variant="outlined" color="secondary" startIcon={<ReplayRounded />}
                        onClick={(e) => { e.preventDefault(); o.items.forEach((i) => addToCart(i.sku, i.qty)) }}
                        sx={{ gridColumn: { xs: '1 / -1', sm: 'auto' }, minHeight: 40 }}>
                        Reorder
                      </Button>
                    </Box>
                  )
                })}
              </Stack>
            )}
          </Panel>
        )}

        {review.loading ? <PanelSkeleton h={240} /> : (
          <Panel>
            <PanelHead title="Open invoices" action="All invoices" href="/account/customerdashbord/invoices" />
            {openInv.length === 0 ? (
              <EmptyState icon={<ReceiptLongOutlined />} title="You’re all paid up" body="No open invoices. New invoices appear here as soon as an order ships." />
            ) : (
              <Stack divider={<Box sx={{ borderTop: `1px solid ${c.line}` }} />}>
                {openInv.map((i) => (
                  <Stack key={i.number} direction="row" alignItems="center" spacing={1.5} sx={{ py: 1.25 }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{i.number}</Typography>
                        <StatusChip status={i.status} />
                      </Stack>
                      <Typography sx={{ fontSize: 12.5, color: i.status === 'Overdue' ? c.error : c.text2, fontWeight: i.status === 'Overdue' ? 600 : 400 }}>
                        Due {fmtDate(i.due)}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography sx={{ fontWeight: 700 }}>{money(i.balance)}</Typography>
                      <Typography sx={{ fontSize: 11.5, color: c.text3 }}>of {money(i.amount)}</Typography>
                    </Box>
                  </Stack>
                ))}
                <Button variant="contained" startIcon={<PaymentsOutlined />} onClick={() => nav('/account/customerdashbord/invoices')} sx={{ mt: 1.5 }}>
                  Pay {money(openInv.reduce((a, i) => a + i.balance, 0))}
                </Button>
              </Stack>
            )}
          </Panel>
        )}
      </Box>

      {/* Buy it again */}
      <Panel>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h4" component="h2">Buy it again</Typography>
            <Typography variant="body2" color="text.secondary">From your last 30 days of orders — online and in store.</Typography>
          </Box>
          <Button component={RouterLink} to="/account/orders" endIcon={<ChevronRightRounded />} sx={{ color: c.navy, display: { xs: 'none', sm: 'inline-flex' } }}>Order history</Button>
        </Stack>
        {review.empty ? (
          <Typography color="text.secondary">Items you buy will appear here for one-tap reordering.</Typography>
        ) : (
          <ProductRail items={buyAgain} loading={review.loading} />
        )}
      </Panel>

      {/* Account snapshot */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: { xs: 2, md: 3 } }}>
        {[
          { h: 'Contact', to: '/account/profile', lines: [`${customer.firstName} ${customer.lastName}`, customer.email, customer.phone] },
          { h: 'Business', to: '/account/company', lines: [customer.businessName, customer.businessCategory, `HST ${customer.hst}`] },
          { h: 'Default delivery address', to: '/account/addresses', lines: [def.company, def.street, `${def.city}, ${def.province} ${def.postal}`] },
        ].map((b) => (
          <Panel key={b.h}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" component="h3">{b.h}</Typography>
              <Button size="small" component={RouterLink} to={b.to} sx={{ color: c.navy }}>Edit</Button>
            </Stack>
            {b.lines.map((l, i) => <Typography key={i} sx={{ fontSize: 13.5, color: i ? c.text2 : c.ink, fontWeight: i ? 400 : 600 }}>{l}</Typography>)}
          </Panel>
        ))}
      </Box>

      <Panel sx={{ bgcolor: c.navyTint, borderColor: 'transparent' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }} justifyContent="space-between">
          <Box>
            <Stack direction="row" spacing={1} alignItems="center"><Typography variant="h5" component="h3">Monthly spend insights</Typography><NewFeatureTag note="aggregated spend per department per month" /></Stack>
            <Typography variant="body2" color="text.secondary">September: {money(1876.21)} across 5 orders · Packaging 41% · Grocery 28% · Frozen 17%</Typography>
          </Box>
          <Button variant="outlined" color="secondary" sx={{ bgcolor: '#fff', flexShrink: 0 }}>See breakdown</Button>
        </Stack>
      </Panel>
    </Stack>
  )
}
