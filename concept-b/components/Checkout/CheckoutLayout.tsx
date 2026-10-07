import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Skeleton, Typography } from '@mui/material'
import { finalPrice, money, productBySku, type Product } from '../../lib/data'
import { useCart } from '../../lib/cart'
import { totals, type Method } from '../../lib/pricing'
import { colors, radius } from '../../lib/theme'
import { PageContainer } from '../ui/Section'
import EmptyState from '../ui/EmptyState'
import ProductImage from '../ui/ProductImage'
import OrderSummary from '../Cart/OrderSummary'
import { AlertCircleIcon, CartIcon, CheckIcon, ChevronDownIcon } from '../ui/icons'

const STEPS = [
  { key: 'cart', label: 'Cart', href: '/cart' },
  { key: 'delivery', label: 'Delivery', href: '/checkout' },
  { key: 'payment', label: 'Payment', href: '/checkout/payment' },
  { key: 'done', label: 'Confirmation' },
] as const
export type StepKey = (typeof STEPS)[number]['key']

/** Where you are in checkout, what's done (✓, linkable) and what's next. Phones get a one-line version. */
export function CheckoutSteps({ current }: { current: StepKey }) {
  const idx = STEPS.findIndex((s) => s.key === current)
  return (
    <Box component="nav" aria-label="Checkout progress">
      <Typography sx={{ display: { xs: 'block', sm: 'none' }, fontSize: 13.5, color: colors.ink600 }}>
        Step {idx} of {STEPS.length - 1} · <b style={{ color: colors.ink }}>{STEPS[idx].label}</b>
      </Typography>
      <Box component="ol" sx={{ display: { xs: 'none', sm: 'flex' }, listStyle: 'none', m: 0, p: 0, alignItems: 'center', gap: 1 }}>
        {STEPS.map((s, i) => {
          const done = i < idx
          const now = i === idx
          const dot = (
            <Box sx={{ width: 26, height: 26, borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0, bgcolor: done ? colors.success : now ? colors.ink : '#fff', color: done || now ? '#fff' : colors.ink500, border: done || now ? 'none' : `1px solid ${colors.line2}` }}>
              {done ? <CheckIcon sx={{ fontSize: 16 }} /> : i + 1}
            </Box>
          )
          return (
            <Box component="li" key={s.key} sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: i < STEPS.length - 1 ? 1 : 'none' }} aria-current={now ? 'step' : undefined}>
              {done && 'href' in s ? (
                <Box component={Link} href={s.href} sx={{ display: 'flex', alignItems: 'center', gap: 1, color: colors.ink, textDecoration: 'none', fontSize: 14, fontWeight: 500, borderRadius: radius.sm, '&:hover span': { textDecoration: 'underline' }, '&:focus-visible': { outline: `2px solid ${colors.navy}`, outlineOffset: 2 } }}>
                  {dot}<span>{s.label}</span>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: 14, fontWeight: now ? 600 : 500, color: now ? colors.ink : colors.ink500 }}>{dot}<span>{s.label}</span></Box>
              )}
              {i < STEPS.length - 1 && <Box aria-hidden sx={{ flex: 1, height: 2, borderRadius: 1, bgcolor: done ? colors.success : colors.line, minWidth: 16 }} />}
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

function ItemList() {
  const { lines } = useCart()
  const items = lines.map((l) => ({ ...l, product: productBySku(l.sku) })).filter((l): l is typeof l & { product: Product } => !!l.product)
  return (
    <Box component="ul" aria-label="Items in this order" sx={{ listStyle: 'none', m: 0, p: 0, pt: 0.75, pr: 0.75, display: 'flex', flexDirection: 'column', gap: 1.5, maxHeight: { md: 300 }, overflowY: 'auto' }}>
      {items.map((l) => (
        <Box component="li" key={l.sku} sx={{ display: 'grid', gridTemplateColumns: '48px minmax(0,1fr) auto', gap: 1.25, alignItems: 'center' }}>
          <Box sx={{ position: 'relative', borderRadius: radius.sm, overflow: 'visible' }}>
            <Box sx={{ borderRadius: radius.sm, overflow: 'hidden', border: `1px solid ${colors.line}` }}><ProductImage product={l.product} caption={false} alt="" /></Box>
            <Box sx={{ position: 'absolute', top: -6, right: -6, minWidth: 20, height: 20, px: 0.5, borderRadius: radius.pill, bgcolor: colors.ink600, color: '#fff', fontSize: 11, fontWeight: 700, display: 'grid', placeItems: 'center' }} aria-label={`Quantity ${l.qty}`}>{l.qty}</Box>
          </Box>
          <Typography sx={{ fontSize: 13.5, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{l.product.name}</Typography>
          <Typography sx={{ fontSize: 13.5, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{money(finalPrice(l.product) * l.qty)}</Typography>
        </Box>
      ))}
    </Box>
  )
}

/** Error summary at the top of a form: lists every problem with a link that jumps to the field. */
export function ErrorSummary({ errors }: { errors: { id: string; message: string }[] }) {
  if (!errors.length) return null
  return (
    <Box id="error-summary" role="alert" tabIndex={-1} sx={{ p: 2, borderRadius: radius.lg, bgcolor: colors.errorTint, border: `1px solid ${colors.errorLine}`, outline: 'none', '&:focus-visible': { outline: `2px solid ${colors.navy}`, outlineOffset: 2 } }}>
      <Typography sx={{ display: 'flex', alignItems: 'center', gap: 0.75, fontWeight: 600, color: '#7F1D1D' }}>
        <AlertCircleIcon sx={{ color: colors.error }} /> Please fix {errors.length === 1 ? 'this' : `these ${errors.length}`} to continue
      </Typography>
      <Box component="ul" sx={{ m: 0, mt: 1, pl: 4.5 }}>
        {errors.map((e) => (
          <li key={e.id}>
            <Box component="a" href={`#${e.id}`} onClick={(ev: React.MouseEvent) => { ev.preventDefault(); const el = document.getElementById(e.id); el?.focus(); el?.scrollIntoView({ block: 'center', behavior: 'smooth' }) }} sx={{ color: colors.error, fontSize: 14 }}>
              {e.message}
            </Box>
          </li>
        ))}
      </Box>
    </Box>
  )
}

/** A titled card section inside the checkout form column. */
export function CheckoutCard({ id, title, step, action, children }: { id?: string; title: string; step?: number; action?: ReactNode; children: ReactNode }) {
  return (
    <Box component="section" aria-labelledby={id ? `${id}-title` : undefined} sx={{ bgcolor: '#fff', border: `1px solid ${colors.line}`, borderRadius: radius.xl, p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2 }}>
        {step && <Box aria-hidden sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: colors.ink, color: '#fff', fontSize: 13, fontWeight: 700, display: 'grid', placeItems: 'center', flexShrink: 0 }}>{step}</Box>}
        <Typography id={id ? `${id}-title` : undefined} component="h2" variant="h3" sx={{ flex: 1 }}>{title}</Typography>
        {action}
      </Box>
      {children}
    </Box>
  )
}

export default function CheckoutLayout({ step, title, method, children }: { step: StepKey; title: string; method?: Method; children: ReactNode }) {
  const { lines, ready, coupon } = useCart()
  const [open, setOpen] = useState(false)
  const t = totals(lines, { coupon, method })
  if (!ready) {
    return (
      <PageContainer sx={{ py: 4 }}>
        <Skeleton width={320} height={28} />
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'minmax(0,1fr) 380px' }, mt: 3 }}>
          <Skeleton variant="rounded" height={420} />
          <Skeleton variant="rounded" height={320} />
        </Box>
      </PageContainer>
    )
  }
  if (!lines.length) {
    return (
      <PageContainer>
        <EmptyState icon={<CartIcon />} title="Your cart is empty" headingLevel="h1" actions={<Button component={Link} href="/" variant="contained" size="large">Start shopping</Button>}>
          Add products to your cart before checking out. Items you add stay saved on this device.
        </EmptyState>
      </PageContainer>
    )
  }
  const items = lines.reduce((a, l) => a + l.qty, 0)
  return (
    <PageContainer sx={{ pt: { xs: 2, md: 3.5 }, pb: { xs: 4, md: 8 } }}>
      <CheckoutSteps current={step} />
      <Typography variant="h1" sx={{ mt: { xs: 1.5, md: 3 }, mb: { xs: 2, md: 3 } }}>{title}</Typography>

      {/* Phones: summary collapsed above the form so the total is always one tap away */}
      <Accordion expanded={open} onChange={(_, v) => setOpen(v)} sx={{ display: { md: 'none' }, mb: 2, bgcolor: '#fff' }}>
        <AccordionSummary expandIcon={<ChevronDownIcon />} aria-controls="mobile-summary" id="mobile-summary-header">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', pr: 1 }}>
            <span>{open ? 'Hide' : 'Show'} order summary ({items})</span>
            <b style={{ fontVariantNumeric: 'tabular-nums' }}>{money(t.total)}</b>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <ItemList />
          <OrderSummary method={method} title="Totals" />
        </AccordionDetails>
      </Accordion>

      <Box sx={{ display: 'grid', gap: { xs: 2, md: 3 }, gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'minmax(0,1fr) 340px', lg: 'minmax(0,1fr) 400px' }, alignItems: 'start' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>{children}</Box>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', gap: 2, position: 'sticky', top: 24 }}>
          <Box sx={{ bgcolor: '#fff', border: `1px solid ${colors.line}`, borderRadius: radius.xl, p: 2.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 1.5 }}>
              <Typography component="h2" variant="h4">In your order</Typography>
              <Box component={Link} href="/cart" sx={{ fontSize: 14, color: colors.redText, fontWeight: 500 }}>Edit cart</Box>
            </Box>
            <ItemList />
          </Box>
          <OrderSummary method={method} />
        </Box>
      </Box>
    </PageContainer>
  )
}
