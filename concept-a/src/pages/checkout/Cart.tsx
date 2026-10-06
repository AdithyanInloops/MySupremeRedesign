import { useEffect, useRef, useState } from 'react'
import { Alert, Box, Button, InputAdornment, Skeleton, Stack, TextField, Typography } from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import ShoppingCartOutlined from '@mui/icons-material/ShoppingCartOutlined'
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded'
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined'
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded'
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded'
import ReplayRounded from '@mui/icons-material/ReplayRounded'
import LockOutlined from '@mui/icons-material/LockOutlined'
import StorefrontOutlined from '@mui/icons-material/StorefrontOutlined'
import { tokens } from '../../theme'
import { departments, money, recommended } from '../../data/catalog'
import { orders } from '../../data/account'
import { useApp } from '../../state/AppState'
import { Container, EmptyState, Panel, SectionHeader } from '../../components/ui'
import { ProductRail } from '../../components/Commerce'
import { Breadcrumbs } from '../../components/Shared'
import { CartLineItem, CheckoutStepper, OrderSummary, cartTotals } from '../../components/CheckoutParts'

const c = tokens.color

/** Postal-code check against the GTA / Hamilton / Niagara service area (FSA prefixes). */
const inAreaFsa = /^(L[0-9]|M[0-9])/i
function DeliveryAreaCheck() {
  const [pc, setPc] = useState('L5L 5Z5')
  const [result, setResult] = useState<'in' | 'out' | null>('in')
  const check = () => setResult(pc.trim().length >= 3 ? (inAreaFsa.test(pc.trim()) ? 'in' : 'out') : null)
  return (
    <Panel sx={{ mt: 2 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
          <Box sx={{ width: 44, height: 44, borderRadius: `${tokens.radius.sm}px`, bgcolor: c.navyTint, color: c.navy, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <LocalShippingOutlined />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700 }}>We deliver daily across the GTA, Hamilton &amp; Niagara</Typography>
            <Typography variant="body2" color="text.secondary">Check your postal code — outside the area you can still pick up in Mississauga.</Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
          <TextField
            size="small"
            label="Postal code"
            value={pc}
            onChange={(e) => { setPc(e.target.value); setResult(null) }}
            onKeyDown={(e) => e.key === 'Enter' && check()}
            inputProps={{ style: { textTransform: 'uppercase', width: 96 } }}
            InputProps={{ sx: { minHeight: 44 } }}
          />
          <Button variant="outlined" color="secondary" onClick={check}>Check</Button>
        </Stack>
      </Stack>
      {result === 'in' && (
        <Alert icon={<CheckCircleRounded fontSize="inherit" />} severity="success" sx={{ mt: 2, borderRadius: `${tokens.radius.sm}px` }}>
          <b>{pc.toUpperCase()} is on our Peel &amp; West GTA route.</b> Next delivery: Tue Oct 7, 9 AM – 1 PM · same-day express available.
        </Alert>
      )}
      {result === 'out' && (
        <Alert icon={<WarningAmberRounded fontSize="inherit" />} severity="warning" sx={{ mt: 2, borderRadius: `${tokens.radius.sm}px` }}>
          <b>{pc.toUpperCase()} is outside our delivery area.</b> Choose “Pickup at cash &amp; carry” at checkout, or call +1 365-777-0999 for a custom route.
        </Alert>
      )}
    </Panel>
  )
}

function CartSkeleton() {
  return (
    <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: 'minmax(0,1fr) 400px' }, alignItems: 'start' }} aria-busy aria-label="Loading cart">
      <Panel>
        {[0, 1, 2, 3].map((i) => (
          <Stack key={i} direction="row" spacing={2} sx={{ py: 2, borderBottom: i < 3 ? `1px solid ${c.line}` : 0 }}>
            <Skeleton variant="rounded" width={96} height={96} />
            <Box sx={{ flex: 1 }}><Skeleton width="25%" /><Skeleton width="75%" /><Skeleton width="35%" /></Box>
            <Skeleton variant="rounded" width={130} height={40} sx={{ display: { xs: 'none', md: 'block' } }} />
          </Stack>
        ))}
      </Panel>
      <Panel><Skeleton width="50%" height={36} /><Skeleton variant="rounded" height={44} sx={{ my: 2 }} />{[0, 1, 2, 3].map((i) => <Skeleton key={i} />)}<Skeleton variant="rounded" height={52} sx={{ mt: 2 }} /></Panel>
    </Box>
  )
}

export default function Cart() {
  const { cart, cartCount, review, clearCart, addToCart, priceFor, toast } = useApp()
  const nav = useNavigate()
  const [updating, setUpdating] = useState<string | null>(null)
  const prev = useRef(cart)

  // Show the "updating" state on whichever line just changed quantity (mirrors the Magento round-trip).
  useEffect(() => {
    const changed = cart.find((l) => prev.current.find((p) => p.sku === l.sku && p.qty !== l.qty))
    prev.current = cart
    if (!changed) return
    setUpdating(changed.sku)
    const t = window.setTimeout(() => setUpdating(null), 600)
    return () => window.clearTimeout(t)
  }, [cart])

  const totals = cartTotals(cart, priceFor)
  const freeGap = Math.max(0, 250 - totals.subtotal)
  const lastOrder = orders.find((o) => o.status === 'Delivered')

  const proceed = (
    <Button fullWidth variant="contained" size="large" endIcon={<ArrowForwardRounded />} onClick={() => nav('/checkout')}>
      Proceed to checkout
    </Button>
  )

  return (
    <Container sx={{ pb: { xs: 16, md: 4 } }}>
      <Box sx={{ pt: { xs: 2, md: 3 }, pb: { xs: 2, md: 3 } }}>
        <Breadcrumbs items={[{ label: 'Cart' }]} sx={{ mb: 1.5 }} />
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'center' }} spacing={2}>
          <Box>
            <Typography variant="h1" sx={{ fontSize: { xs: 28, md: 40 } }}>Your cart</Typography>
            {!review.loading && cart.length > 0 && (
              <Typography color="text.secondary" sx={{ mt: 0.5 }}>{cartCount} items · {cart.length} products</Typography>
            )}
          </Box>
          {cart.length > 0 && <Box sx={{ width: { xs: '100%', md: 460 } }}><CheckoutStepper active={0} /></Box>}
        </Stack>
      </Box>

      {review.loading ? (
        <CartSkeleton />
      ) : cart.length === 0 ? (
        <Panel sx={{ mb: 6 }}>
          <EmptyState
            icon={<ShoppingCartOutlined />}
            title="Your cart is empty"
            body="Search by product or SKU, reorder from a past delivery, or browse the departments below."
            action="Browse departments"
            href="/all-categories"
            secondary={review.signedIn && lastOrder ? (
              <Button variant="outlined" size="large" color="secondary" startIcon={<ReplayRounded />}
                onClick={() => { lastOrder.items.forEach((i) => addToCart(i.sku, i.qty)); toast(`Order #${lastOrder.number} added back to your cart`) }}>
                Buy again #{lastOrder.number}
              </Button>
            ) : (
              <Button variant="outlined" size="large" color="secondary" component={RouterLink} to="/account/signin">Sign in to reorder</Button>
            )}
          />
          <Stack direction="row" flexWrap="wrap" gap={1} justifyContent="center" sx={{ pb: 4 }}>
            {departments.map((d) => (
              <Button key={d.id} component={RouterLink} to={`/c/${d.slug}`} variant="outlined" color="inherit" sx={{ borderColor: c.line, borderRadius: 999, fontWeight: 500 }}>
                {d.name}
              </Button>
            ))}
          </Stack>
        </Panel>
      ) : (
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: 'minmax(0,1fr) 400px' }, alignItems: 'start' }}>
          <Box sx={{ minWidth: 0 }}>
            {freeGap > 0 ? (
              <Alert severity="info" icon={<LocalShippingOutlined />} sx={{ mb: 2, borderRadius: `${tokens.radius.md}px` }}>
                Add <b>{money(freeGap)}</b> more for free scheduled delivery.
              </Alert>
            ) : (
              <Alert severity="success" icon={<LocalShippingOutlined />} sx={{ mb: 2, borderRadius: `${tokens.radius.md}px` }}>
                <b>You’ve unlocked free scheduled delivery</b> on the Peel &amp; West GTA route.
              </Alert>
            )}
            <Panel sx={{ py: { xs: 0.5, md: 1 } }}>
              <Box sx={{ display: { xs: 'none', md: 'grid' }, gridTemplateColumns: '96px minmax(0,1fr) 140px 120px 44px', gap: 2.5, pt: 1.5, pb: 1, borderBottom: `1px solid ${c.line}`, fontSize: 12, fontWeight: 600, color: c.text3, textTransform: 'uppercase', letterSpacing: '.06em' }}>
                <span>Product</span><span /><span>Quantity</span><Box component="span" sx={{ textAlign: 'right' }}>Total</Box><span />
              </Box>
              {cart.map((l) => <CartLineItem key={l.sku} line={l} state={updating === l.sku ? 'updating' : l.error ? 'error' : 'idle'} />)}
              <Stack direction="row" justifyContent="space-between" sx={{ py: 1.5, borderTop: `1px solid ${c.line}` }}>
                <Button component={RouterLink} to="/" sx={{ color: c.navy }}>Continue shopping</Button>
                <Button color="inherit" onClick={() => { clearCart(); toast('Cart cleared', 'info') }} sx={{ color: c.text2 }}>Clear cart</Button>
              </Stack>
            </Panel>
            <DeliveryAreaCheck />
          </Box>

          <Box sx={{ position: { lg: 'sticky' }, top: { lg: 190 } }}>
            <OrderSummary lines={cart} action={<Box sx={{ display: { xs: 'none', md: 'block' } }}>{proceed}</Box>} />
            <Stack spacing={1} sx={{ mt: 2, px: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ fontSize: 13, color: c.text2 }}>
                <LockOutlined sx={{ fontSize: 17, color: c.successText }} /><span>Secure checkout · Stripe-encrypted payments</span>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ fontSize: 13, color: c.text2 }}>
                <StorefrontOutlined sx={{ fontSize: 17, color: c.navy }} /><span>Prefer to pay on account? Choose Net 30 at payment.</span>
              </Stack>
            </Stack>
          </Box>
        </Box>
      )}

      {!review.loading && (
        <Box sx={{ mt: { xs: 5, md: 7 } }}>
          <SectionHeader eyebrow="Don’t run out mid-service" title="Kitchens also add" action="See all" href="/c/packaging" />
          <ProductRail items={recommended.filter((p) => !cart.some((l) => l.sku === p.sku))} />
        </Box>
      )}

      {/* Mobile sticky checkout bar — inset 76px each side to clear the voice + chat buttons */}
      {!review.loading && cart.length > 0 && (
        <Box sx={{ display: { md: 'none' }, position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 1140, bgcolor: '#fff', borderTop: `1px solid ${c.line}`, boxShadow: '0 -10px 30px -12px rgba(17,24,39,.25)', py: 1.25, px: '80px' }}>
          <Typography sx={{ fontSize: 12, color: c.text2, textAlign: 'center', lineHeight: 1.2, mb: 0.75 }}>
            Total <b style={{ color: c.ink, fontSize: 15 }}>{money(totals.total)}</b> incl. HST
          </Typography>
          <Button fullWidth variant="contained" onClick={() => nav('/checkout')} sx={{ minHeight: 48 }}>Checkout</Button>
        </Box>
      )}
    </Container>
  )
}
