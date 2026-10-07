import Head from 'next/head'
import Link from 'next/link'
import { Box, Button, Divider, Skeleton, Typography } from '@mui/material'
import { money, productBySku } from '../../lib/data'
import { useSession } from '../../lib/session'
import { zones } from '../../lib/delivery'
import { colors, radius } from '../../lib/theme'
import { PageContainer } from '../../components/ui/Section'
import EmptyState from '../../components/ui/EmptyState'
import ProductImage from '../../components/ui/ProductImage'
import { CheckoutSteps } from '../../components/Checkout/CheckoutLayout'
import { AddressBlock } from '../../components/Checkout/CheckoutParts'
import { PHONE, PHONE_HREF } from '../../components/Layout/Header'
import { BoxIcon, CheckCircleIcon, MailCheckIcon, PrinterIcon, ReceiptIcon, StoreIcon, TruckIcon } from '../../components/ui/icons'

/** Order confirmation: what happened (order number), what happens next (timeline), what you can do now. */
export default function CheckoutSuccess() {
  const { ready, lastOrder: o } = useSession()
  if (!ready) return <PageContainer sx={{ py: 6 }}><Skeleton width={320} height={48} /><Skeleton variant="rounded" height={300} sx={{ mt: 3 }} /></PageContainer>
  if (!o) {
    return (
      <PageContainer>
        <Head><title>Order confirmation | MySupreme</title></Head>
        <EmptyState icon={<ReceiptIcon />} title="No recent order to show" headingLevel="h1" actions={<Button component={Link} href="/" variant="contained" size="large">Start shopping</Button>}>
          Order confirmations appear here right after checkout. Your emailed confirmation has every order’s details.
        </EmptyState>
      </PageContainer>
    )
  }
  const pickup = o.method === 'pickup'
  const steps = [
    { icon: CheckCircleIcon, title: 'Order confirmed', text: 'Just now', done: true },
    { icon: BoxIcon, title: 'Packed at the warehouse', text: pickup ? 'Within 2 hours' : 'Before your route leaves', done: false },
    pickup
      ? { icon: StoreIcon, title: 'Ready for pickup', text: 'We’ll text you when it’s ready', done: false }
      : { icon: TruckIcon, title: 'Out for delivery', text: o.slotLabel, done: false },
  ]
  const units = o.lines.reduce((a, l) => a + l.qty, 0)

  return (
    <>
      <Head><title>{`Order #${o.number} confirmed | MySupreme`}</title><meta name="robots" content="noindex" /></Head>
      <PageContainer sx={{ pt: { xs: 2, md: 3.5 }, pb: { xs: 5, md: 8 }, maxWidth: 1080 }}>
        <Box sx={{ '@media print': { display: 'none' } }}><CheckoutSteps current="done" /></Box>

        <Box sx={{ mt: { xs: 3, md: 4 }, display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <CheckCircleIcon sx={{ fontSize: { xs: 40, md: 52 }, color: colors.success, flexShrink: 0, animation: 'pop .35s ease-out', '@keyframes pop': { from: { transform: 'scale(.6)', opacity: 0 }, to: { transform: 'none', opacity: 1 } } }} />
          <Box>
            <Typography variant="h1">Thanks — your order is confirmed</Typography>
            <Typography sx={{ mt: 0.75, color: colors.ink700, fontSize: 16 }}>
              Order <b style={{ color: colors.ink }}>#{o.number}</b> · {units} items · {money(o.total)}
            </Typography>
            <Typography sx={{ mt: 0.5, color: colors.ink600, display: 'flex', alignItems: 'center', gap: 0.75, fontSize: 14.5 }}>
              <MailCheckIcon sx={{ fontSize: 19 }} /> Confirmation and invoice sent to {o.email}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.25, flexWrap: 'wrap', mt: 3, '@media print': { display: 'none' } }}>
          <Button component={Link} href="/" variant="contained" size="large">Continue shopping</Button>
          <Button variant="outlined" size="large" startIcon={<PrinterIcon />} onClick={() => window.print()}>Print or save as PDF</Button>
        </Box>

        <Box component="ol" aria-label="What happens next" sx={{ listStyle: 'none', p: 0, m: 0, mt: 4, display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'repeat(3, minmax(0,1fr))' }, gap: { xs: 1.5, md: 2 } }}>
          {steps.map((s, i) => {
            const Icon = s.icon
            return (
              <Box component="li" key={s.title} sx={{ display: 'flex', gap: 1.5, alignItems: 'center', p: 2, borderRadius: radius.lg, border: `1px solid ${s.done ? colors.successLine : colors.line}`, bgcolor: s.done ? colors.successTint : '#fff' }}>
                <Box sx={{ width: 40, height: 40, borderRadius: '50%', display: 'grid', placeItems: 'center', bgcolor: s.done ? colors.success : colors.sunken, color: s.done ? '#fff' : colors.ink600, flexShrink: 0 }}><Icon sx={{ fontSize: 21 }} /></Box>
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: 14.5 }}><Box component="span" sx={{ color: colors.ink500, fontWeight: 500 }}>{i + 1}. </Box>{s.title}</Typography>
                  <Typography sx={{ fontSize: 13.5, color: colors.ink600 }}>{s.text}</Typography>
                </Box>
              </Box>
            )
          })}
        </Box>

        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'minmax(0,1.4fr) minmax(0,1fr)' }, mt: 3, alignItems: 'start' }}>
          <Box component="section" aria-labelledby="items-title" sx={{ border: `1px solid ${colors.line}`, borderRadius: radius.xl, p: { xs: 2, md: 2.5 } }}>
            <Typography id="items-title" component="h2" variant="h3" sx={{ mb: 2 }}>Items</Typography>
            <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {o.lines.map((l) => {
                const p = productBySku(l.sku)
                if (!p) return null
                return (
                  <Box component="li" key={l.sku} sx={{ display: 'grid', gridTemplateColumns: '52px minmax(0,1fr) auto', gap: 1.5, alignItems: 'center' }}>
                    <Box sx={{ borderRadius: radius.sm, overflow: 'hidden', border: `1px solid ${colors.line}` }}><ProductImage product={p} caption={false} alt="" /></Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontSize: 14, lineHeight: 1.35 }}>{p.name}</Typography>
                      <Typography sx={{ fontSize: 13, color: colors.ink500 }}>{l.qty} × {money(l.price)}</Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 600, fontSize: 14, fontVariantNumeric: 'tabular-nums' }}>{money(l.price * l.qty)}</Typography>
                  </Box>
                )
              })}
            </Box>
            <Divider sx={{ my: 2 }} />
            {[['Subtotal', money(o.subtotal)], ...(o.discount ? [[`Coupon ${o.coupon?.code ?? ''}`, `−${money(o.discount)}`]] : []), [pickup ? 'Pickup' : 'Delivery', 'Free'], ['HST', money(o.tax)]].map(([k, v]) => (
              <Box key={k} sx={{ display: 'flex', justifyContent: 'space-between', fontSize: 14.5, color: colors.ink700, py: 0.25 }}><span>{k}</span><span style={{ fontVariantNumeric: 'tabular-nums' }}>{v}</span></Box>
            ))}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: 17, fontWeight: 700, mt: 1 }}><span>Total paid</span><span>{money(o.total)}</span></Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ border: `1px solid ${colors.line}`, borderRadius: radius.xl, p: { xs: 2, md: 2.5 } }}>
              <Typography component="h2" variant="h4" sx={{ mb: 1 }}>{pickup ? 'Pickup' : 'Delivery'}</Typography>
              {pickup ? (
                <Typography sx={{ fontSize: 14.5, color: colors.ink700 }}><b style={{ color: colors.ink }}>{zones.pickup.name}</b><br />{zones.pickup.address}<br />{zones.pickup.hours}</Typography>
              ) : (
                <><AddressBlock a={o.address} /><Typography sx={{ mt: 1, fontSize: 14, fontWeight: 600 }}>{o.slotLabel}</Typography></>
              )}
              <Divider sx={{ my: 1.5 }} />
              <Typography component="h2" variant="h4" sx={{ mb: 0.5 }}>Payment</Typography>
              <Typography sx={{ fontSize: 14.5, color: colors.ink700 }}>{o.paymentLabel}</Typography>
            </Box>
            {o.guest && (
              <Box sx={{ borderRadius: radius.xl, p: 2.5, bgcolor: colors.navyTint, '@media print': { display: 'none' } }}>
                <Typography component="h2" variant="h4" sx={{ color: colors.navy }}>Save time on your next order</Typography>
                <Typography sx={{ fontSize: 14, color: colors.ink700, mt: 0.5 }}>Open a free business account to reorder in one tap, see business pricing and apply for credit terms.</Typography>
                <Button component={Link} href={`/account/signin?mode=register&email=${encodeURIComponent(o.email)}`} variant="contained" color="secondary" sx={{ mt: 1.5 }}>Create a business account</Button>
              </Box>
            )}
            <Typography sx={{ fontSize: 14, color: colors.ink600 }}>
              Need to change something? Call <Box component="a" href={PHONE_HREF} sx={{ color: colors.redText, fontWeight: 600 }}>{PHONE}</Box> before your order is packed.
            </Typography>
          </Box>
        </Box>
      </PageContainer>
    </>
  )
}
