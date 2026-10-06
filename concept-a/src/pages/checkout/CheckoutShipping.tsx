import { useState, type ReactNode } from 'react'
import {
  Alert, Box, Button, Collapse, Dialog, DialogContent, IconButton, Radio, Skeleton, Stack, TextField, Typography, useMediaQuery, useTheme,
} from '@mui/material'
import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom'
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded'
import AddRounded from '@mui/icons-material/AddRounded'
import CloseRounded from '@mui/icons-material/CloseRounded'
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined'
import BoltRounded from '@mui/icons-material/BoltRounded'
import StorefrontOutlined from '@mui/icons-material/StorefrontOutlined'
import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded'
import MailOutlineRounded from '@mui/icons-material/MailOutlineRounded'
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded'
import { tokens } from '../../theme'
import { money } from '../../data/catalog'
import type { Address } from '../../data/account'
import { useApp } from '../../state/AppState'
import { Container, NewFeatureTag, Panel } from '../../components/ui'
import { AddressCard } from '../../components/Shared'
import { AddressForm, CartLineItem, CheckoutStepper, OrderSummary, cartTotals } from '../../components/CheckoutParts'
import { checkoutSession, deliveryMethods, type DeliveryMethod } from './checkoutStore'

const c = tokens.color

export function StepHeading({ n, title, aside }: { n: number; title: string; aside?: ReactNode }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
      <Box sx={{ width: 30, height: 30, borderRadius: '50%', bgcolor: c.navy, color: '#fff', fontWeight: 700, fontSize: 14, display: 'grid', placeItems: 'center', flexShrink: 0 }}>{n}</Box>
      <Typography variant="h4" component="h2" sx={{ flex: 1 }}>{title}</Typography>
      {aside}
    </Stack>
  )
}

const methodIcon: Record<DeliveryMethod['id'], ReactNode> = {
  scheduled: <LocalShippingOutlined />,
  express: <BoltRounded />,
  pickup: <StorefrontOutlined />,
}

/** Mobile: collapsible summary above the form so totals stay visible without scrolling to the bottom. */
export function MobileSummaryToggle({ deliveryFee }: { deliveryFee: number }) {
  const { cart, priceFor } = useApp()
  const [open, setOpen] = useState(false)
  const t = cartTotals(cart, priceFor, 0, deliveryFee)
  return (
    <Box sx={{ display: { lg: 'none' }, mb: 2, bgcolor: '#fff', border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.md}px` }}>
      <Button fullWidth onClick={() => setOpen(!open)} aria-expanded={open}
        sx={{ justifyContent: 'space-between', px: 2, minHeight: 56, color: c.ink }}
        endIcon={<ExpandMoreRounded sx={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />}>
        <Box component="span" sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{open ? 'Hide' : 'Show'} summary <Box component="span" sx={{ color: c.text3, fontWeight: 500 }}>· {cart.length} products</Box></Box>
        <Box component="span" sx={{ ml: 'auto', mr: 1, fontWeight: 700 }}>{money(t.total)}</Box>
      </Button>
      <Collapse in={open}>
        <Box sx={{ px: 2, pb: 2 }}>
          {cart.map((l) => <CartLineItem key={l.sku} line={l} compact />)}
        </Box>
      </Collapse>
    </Box>
  )
}

export function CheckoutSidebar({ deliveryFee, action }: { deliveryFee: number; action?: ReactNode }) {
  const { cart } = useApp()
  return (
    <Box sx={{ display: { xs: 'none', lg: 'block' }, position: 'sticky', top: 190 }}>
      <OrderSummary lines={cart} deliveryFee={deliveryFee} showCoupon action={action}>
        <Box sx={{ maxHeight: 'clamp(120px, calc(100vh - 760px), 320px)', overflowY: 'auto', mb: 2, pr: 0.5, borderBottom: `1px solid ${c.line}` }}>
          {cart.map((l) => <CartLineItem key={l.sku} line={l} compact />)}
        </Box>
      </OrderSummary>
    </Box>
  )
}

/** Mobile sticky CTA — inset 80px each side so it never sits under the voice / chat buttons. */
export function MobileCta({ label, onClick, total, disabled, loading }: { label: string; onClick: () => void; total: number; disabled?: boolean; loading?: boolean }) {
  return (
    <Box sx={{ display: { md: 'none' }, position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 1140, bgcolor: '#fff', borderTop: `1px solid ${c.line}`, boxShadow: '0 -10px 30px -12px rgba(17,24,39,.25)', py: 1.25, px: '80px' }}>
      <Typography sx={{ fontSize: 12, color: c.text2, textAlign: 'center', lineHeight: 1.2, mb: 0.75 }}>
        Total <b style={{ color: c.ink, fontSize: 15 }}>{money(total)}</b> incl. HST
      </Typography>
      <Button fullWidth variant="contained" onClick={onClick} disabled={disabled || loading} sx={{ minHeight: 48 }}>{loading ? 'Placing order…' : label}</Button>
    </Box>
  )
}

export function AddressDialog({ open, onClose, onSave, initial, title, requireArea = true }: { open: boolean; onClose: () => void; onSave: (a: Address) => void; initial?: Partial<Address>; title: string; requireArea?: boolean }) {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('md'))
  return (
    <Dialog open={open} onClose={onClose} fullScreen={mobile} maxWidth="md" fullWidth PaperProps={{ sx: mobile ? { borderRadius: 0 } : {} }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: { xs: 2, md: 4 }, pt: { xs: 1.5, md: 3 }, pb: 1, borderBottom: { xs: `1px solid ${c.line}`, md: 0 } }}>
        <Typography variant="h3">{title}</Typography>
        <IconButton aria-label="Close" onClick={onClose}><CloseRounded /></IconButton>
      </Stack>
      <DialogContent sx={{ px: { xs: 2, md: 4 }, pb: { xs: 3, md: 4 }, pt: { xs: 2.5, md: 1 } }}>
        <AddressForm initial={initial} onSubmit={onSave} onCancel={onClose} requireArea={requireArea} />
      </DialogContent>
    </Dialog>
  )
}

export default function CheckoutShipping() {
  const { cart, review, priceFor } = useApp()
  const nav = useNavigate()
  const [list, setList] = useState<Address[]>(checkoutSession.addressList)
  const [selected, setSelected] = useState(checkoutSession.shippingId)
  const [method, setMethod] = useState<DeliveryMethod['id']>(checkoutSession.methodId)
  const [email, setEmail] = useState(checkoutSession.email)
  const [notes, setNotes] = useState(checkoutSession.notes)
  const [dialog, setDialog] = useState<null | { initial?: Address }>(null)
  const [tried, setTried] = useState(false)

  if (!review.loading && cart.length === 0) return <Navigate to="/cart" replace />

  const addr = list.find((a) => a.id === selected)
  const outOfArea = method !== 'pickup' && addr?.inArea === false
  const emailBad = !review.signedIn && !/^\S+@\S+\.\S+$/.test(email)
  const guestAddrMissing = !review.signedIn && !list.some((a) => a.id === selected && a.id.startsWith('new-'))
  const methods = deliveryMethods.map((m) => (m.id === 'scheduled' && cartTotals(cart, priceFor).subtotal < 250 ? { ...m, fee: 15 } : m))
  const fee = methods.find((m) => m.id === method)?.fee ?? 0
  const total = cartTotals(cart, priceFor, 0, fee).total

  const proceed = () => {
    setTried(true)
    if (outOfArea || emailBad || guestAddrMissing) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    Object.assign(checkoutSession, { addressList: list, shippingId: selected, methodId: method, email, notes, fee })
    nav('/checkout/payment')
  }

  const saveAddress = (a: Address) => {
    const edited = dialog?.initial
    const next = edited ? list.map((x) => (x.id === edited.id ? { ...a, id: edited.id, defaultShipping: edited.defaultShipping, defaultBilling: edited.defaultBilling } : x)) : [...list, a]
    setList(next)
    setSelected(edited ? edited.id : a.id)
    setDialog(null)
  }

  const cta = <Button fullWidth variant="contained" size="large" endIcon={<ArrowForwardRounded />} onClick={proceed}>Continue to payment</Button>

  return (
    <Container sx={{ pb: { xs: 16, md: 6 } }}>
      <Box sx={{ py: { xs: 2, md: 3 }, maxWidth: 640 }}>
        <CheckoutStepper active={1} />
      </Box>
      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: 'minmax(0,1fr) 420px' }, alignItems: 'start' }}>
        <Stack spacing={2.5} sx={{ minWidth: 0 }}>
          <Typography variant="h1" sx={{ fontSize: { xs: 26, md: 36 } }}>Where should we deliver?</Typography>
          <MobileSummaryToggle deliveryFee={fee} />

          {tried && outOfArea && (
            <Alert severity="error" icon={<WarningAmberRounded />} sx={{ borderRadius: `${tokens.radius.md}px` }}>
              <b>{addr?.city} is outside our delivery area.</b> Pick a GTA, Hamilton or Niagara address, or switch to pickup at our Mississauga cash &amp; carry.
            </Alert>
          )}

          {!review.signedIn && (
            <Panel>
              <StepHeading n={1} title="Contact email" aside={<Button component={RouterLink} to="/account/signin" size="small" sx={{ color: c.navy }}>Sign in for saved addresses</Button>} />
              <TextField
                fullWidth type="email" label="Email for order updates" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email"
                error={tried && emailBad} helperText={tried && emailBad ? 'Enter a valid email so we can send your invoice' : 'We’ll send your confirmation and invoice here.'}
                InputProps={{ startAdornment: <MailOutlineRounded sx={{ color: c.text3, mr: 1 }} /> }}
              />
            </Panel>
          )}

          <Panel>
            <StepHeading
              n={review.signedIn ? 1 : 2}
              title="Delivery address"
              aside={<Button startIcon={<AddRounded />} onClick={() => setDialog({})} sx={{ color: c.navy, display: { xs: 'none', sm: 'inline-flex' } }}>Add new address</Button>}
            />
            {review.loading ? (
              <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                {[0, 1].map((i) => <Skeleton key={i} variant="rounded" height={150} />)}
              </Box>
            ) : review.signedIn || list.some((a) => a.id.startsWith('new-')) ? (
              <Box role="radiogroup" aria-label="Delivery address" sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                {(review.signedIn ? list : list.filter((a) => a.id.startsWith('new-'))).map((a) => (
                  <AddressCard key={a.id} address={a} selected={a.id === selected} onSelect={() => setSelected(a.id)} onEdit={() => setDialog({ initial: a })}
                    sx={a.id === selected && a.inArea === false && method !== 'pickup' ? { borderColor: c.error, boxShadow: `0 0 0 4px ${c.errorTint}` } : undefined} />
                ))}
              </Box>
            ) : (
              <Box sx={{ p: 3, borderRadius: `${tokens.radius.md}px`, border: `2px dashed ${tried ? c.error : c.line2}`, textAlign: 'center' }}>
                <Typography sx={{ fontWeight: 600 }}>No address yet</Typography>
                <Typography variant="body2" color={tried ? 'error' : 'text.secondary'} sx={{ mb: 2 }}>{tried ? 'Add a delivery address to continue.' : 'Start typing and pick from Google suggestions.'}</Typography>
                <Button variant="contained" startIcon={<AddRounded />} onClick={() => setDialog({})}>Add delivery address</Button>
              </Box>
            )}
            {selected && addr?.inArea === false && method !== 'pickup' && (
              <Typography sx={{ mt: 1.5, fontSize: 13, color: c.error, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <WarningAmberRounded sx={{ fontSize: 18 }} /> This address can’t take delivery. Choose another or select pickup below.
              </Typography>
            )}
            <Button fullWidth variant="outlined" color="secondary" startIcon={<AddRounded />} onClick={() => setDialog({})} sx={{ mt: 1.5, display: { sm: 'none' } }}>Add new address</Button>
          </Panel>

          <Panel>
            <StepHeading n={review.signedIn ? 2 : 3} title="Delivery method" />
            <Stack spacing={1.25} role="radiogroup" aria-label="Delivery method">
              {methods.map((m) => {
                const on = m.id === method
                return (
                  <Box key={m.id} component="label"
                    sx={{
                      display: 'grid', gridTemplateColumns: { xs: 'auto minmax(0,1fr) auto', sm: 'auto 44px minmax(0,1fr) auto' }, alignItems: 'center', gap: { xs: 1, sm: 1.5 }, p: 1.5, pr: 2, cursor: 'pointer',
                      borderRadius: `${tokens.radius.md}px`, border: `2px solid ${on ? c.navy : c.line}`, bgcolor: on ? '#FBFBFF' : '#fff',
                      boxShadow: on ? `0 0 0 4px ${c.navyTint}` : 'none', transition: 'all .15s', '&:hover': { borderColor: on ? c.navy : c.line2 },
                    }}>
                    <Radio checked={on} onChange={() => setMethod(m.id)} value={m.id} inputProps={{ 'aria-label': m.title }} sx={{ p: 1 }} />
                    <Box sx={{ display: { xs: 'none', sm: 'grid' }, width: 44, height: 44, borderRadius: `${tokens.radius.sm}px`, bgcolor: on ? c.navy : c.navyTint, color: on ? '#fff' : c.navy, placeItems: 'center' }}>{methodIcon[m.id]}</Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: 14.5 }}>{m.title}</Typography>
                      <Typography sx={{ fontSize: 13, color: c.successText, fontWeight: 600 }}>{m.eta}</Typography>
                      <Typography sx={{ fontSize: 12.5, color: c.text2 }}>{m.body}</Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 700, color: m.fee ? c.ink : c.successText, whiteSpace: 'nowrap' }}>{m.fee ? money(m.fee) : 'Free'}</Typography>
                  </Box>
                )
              })}
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1.5 }}>
              <Typography variant="body2" color="text.secondary">Want a specific 1-hour drop window?</Typography>
              <NewFeatureTag label="Time slots" note="route capacity + delivery time-slot API" />
            </Stack>
          </Panel>

          <Panel>
            <StepHeading n={review.signedIn ? 3 : 4} title="Receiving notes" aside={<Typography variant="caption" color="text.secondary">Optional</Typography>} />
            <TextField fullWidth multiline minRows={3} value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Use the rear dock on Burnhamthorpe. Receiving 7–11 AM. Ask for Arjun — walk-in freezer is on the left."
              helperText={`${notes.length}/250 · shown to your driver`} inputProps={{ maxLength: 250 }} />
          </Panel>

          <Box sx={{ display: { xs: 'none', md: 'flex', lg: 'none' } }}>{cta}</Box>
          <Stack direction="row" justifyContent="space-between" sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Button component={RouterLink} to="/cart" sx={{ color: c.navy }}>← Back to cart</Button>
          </Stack>
        </Stack>

        <CheckoutSidebar deliveryFee={fee} action={cta} />
      </Box>

      <MobileCta label="Continue to payment" onClick={proceed} total={total} />
      <AddressDialog open={!!dialog} onClose={() => setDialog(null)} onSave={saveAddress} initial={dialog?.initial} title={dialog?.initial ? 'Edit address' : 'Add a delivery address'} />
    </Container>
  )
}
