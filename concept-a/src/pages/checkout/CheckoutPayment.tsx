import { useState, type ReactNode } from 'react'
import {
  Alert, Box, Button, Checkbox, CircularProgress, FormControlLabel, FormHelperText, Link, Radio, Stack, Switch, TextField, Typography,
} from '@mui/material'
import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom'
import LockOutlined from '@mui/icons-material/LockOutlined'
import CreditCardOutlined from '@mui/icons-material/CreditCardOutlined'
import AccountBalanceOutlined from '@mui/icons-material/AccountBalanceOutlined'
import ReceiptLongOutlined from '@mui/icons-material/ReceiptLongOutlined'
import EditOutlined from '@mui/icons-material/EditOutlined'
import ErrorOutlineRounded from '@mui/icons-material/ErrorOutlineRounded'
import { tokens } from '../../theme'
import { money } from '../../data/catalog'
import { credit, type Address } from '../../data/account'
import { useApp } from '../../state/AppState'
import { Container, Panel } from '../../components/ui'
import { AddressCard } from '../../components/Shared'
import { CheckoutStepper, cartTotals } from '../../components/CheckoutParts'
import { checkoutSession, currentMethod, currentShipping } from './checkoutStore'
import { AddressDialog, CheckoutSidebar, MobileCta, MobileSummaryToggle, StepHeading } from './CheckoutShipping'

const c = tokens.color

type MethodId = 'visa' | 'mc' | 'new' | 'account' | 'etransfer'

function CardBrand({ brand }: { brand: 'visa' | 'mc' }) {
  return brand === 'visa' ? (
    <Box sx={{ width: 44, height: 30, borderRadius: 1, bgcolor: '#1A1F71', color: '#fff', fontWeight: 800, fontStyle: 'italic', fontSize: 12, display: 'grid', placeItems: 'center', flexShrink: 0 }}>VISA</Box>
  ) : (
    <Box sx={{ width: 44, height: 30, borderRadius: 1, bgcolor: '#252525', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: '#EB001B' }} />
      <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: '#F79E1B', ml: -0.6, opacity: 0.9 }} />
    </Box>
  )
}

/** Visual stand-in for Stripe's single-line CardElement (the real one is an iframe Stripe renders). */
function StripeCardElement({ error }: { error?: string }) {
  const [num, setNum] = useState('')
  const [focus, setFocus] = useState(false)
  const fmt = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  const brand = num.startsWith('4') ? 'visa' : num.startsWith('5') ? 'mc' : null
  return (
    <Box>
      <Box
        sx={{
          display: 'flex', alignItems: 'center', gap: 1, height: 48, px: 1.5, bgcolor: '#fff', borderRadius: '6px',
          border: `1px solid ${error ? c.error : focus ? '#0570DE' : '#E0E0E6'}`,
          boxShadow: focus ? '0 0 0 3px rgba(5,112,222,.18), 0 1px 1px rgba(0,0,0,.03)' : '0 1px 1px rgba(0,0,0,.03), 0 3px 6px rgba(0,0,0,.02)',
          fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif', fontSize: 15, transition: 'box-shadow .15s, border-color .15s',
        }}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      >
        {brand ? <Box sx={{ transform: 'scale(.75)', transformOrigin: 'left center', width: 34 }}><CardBrand brand={brand} /></Box> : <CreditCardOutlined sx={{ color: '#8792A2', fontSize: 22 }} />}
        <Box component="input" aria-label="Card number" inputMode="numeric" placeholder="Card number" value={num} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNum(fmt(e.target.value))}
          sx={{ flex: 1, minWidth: 0, border: 0, outline: 0, font: 'inherit', color: '#30313D', '&::placeholder': { color: '#8792A2' } }} />
        <Box component="input" aria-label="Expiry date" placeholder="MM / YY" sx={{ width: 64, border: 0, outline: 0, font: 'inherit', color: '#30313D', '&::placeholder': { color: '#8792A2' } }} />
        <Box component="input" aria-label="CVC" placeholder="CVC" sx={{ width: 44, border: 0, outline: 0, font: 'inherit', color: '#30313D', '&::placeholder': { color: '#8792A2' } }} />
        <Box component="input" aria-label="Postal code" placeholder="Postal" sx={{ width: 64, border: 0, outline: 0, font: 'inherit', color: '#30313D', display: { xs: 'none', sm: 'block' }, '&::placeholder': { color: '#8792A2' } }} />
      </Box>
      <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.75 }}>
        <Typography sx={{ fontSize: 12, color: error ? c.error : c.text3 }}>{error ?? 'Try 4242 4242 4242 4242'}</Typography>
        <Typography sx={{ fontSize: 11.5, color: c.text3, display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <LockOutlined sx={{ fontSize: 13 }} /> Secured by <b style={{ color: '#635BFF' }}>stripe</b>
        </Typography>
      </Stack>
      <FormControlLabel control={<Checkbox defaultChecked size="small" />} label="Save this card for future orders" sx={{ mt: 0.5, '& .MuiFormControlLabel-label': { fontSize: 13.5 } }} />
    </Box>
  )
}

function MethodRow({ id, selected, onSelect, icon, title, sub, aside, disabled, children }: {
  id: MethodId; selected: boolean; onSelect: (id: MethodId) => void; icon: ReactNode; title: ReactNode; sub?: ReactNode; aside?: ReactNode; disabled?: boolean; children?: ReactNode
}) {
  return (
    <Box sx={{
      borderRadius: `${tokens.radius.md}px`, border: `2px solid ${selected ? c.navy : c.line}`, bgcolor: disabled ? c.bg : selected ? '#FBFBFF' : '#fff',
      boxShadow: selected ? `0 0 0 4px ${c.navyTint}` : 'none', opacity: disabled ? 0.7 : 1, transition: 'all .15s',
    }}>
      <Box component="label" sx={{ display: 'flex', alignItems: 'center', gap: 1.25, p: 1.25, pr: 2, cursor: disabled ? 'not-allowed' : 'pointer', minHeight: 64 }}>
        <Radio checked={selected} disabled={disabled} onChange={() => onSelect(id)} inputProps={{ 'aria-label': typeof title === 'string' ? title : id }} />
        {icon}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 14.5 }}>{title}</Typography>
          {sub && <Typography component="div" sx={{ fontSize: 12.5, color: c.text2 }}>{sub}</Typography>}
        </Box>
        {aside}
      </Box>
      {selected && children && <Box sx={{ px: { xs: 1.5, sm: 2 }, pb: 2, pl: { sm: 8 } }}>{children}</Box>}
    </Box>
  )
}

export default function CheckoutPayment() {
  const { cart, review, priceFor } = useApp()
  const nav = useNavigate()
  const ship = currentShipping()
  const dm = currentMethod()
  const fee = checkoutSession.fee
  const [same, setSame] = useState(true)
  const [billingList, setBillingList] = useState<Address[]>(checkoutSession.addressList.filter((a) => a.inArea !== false || a.defaultBilling))
  const [billingId, setBillingId] = useState(checkoutSession.addressList.find((a) => a.defaultBilling)?.id ?? ship.id)
  const [editBilling, setEditBilling] = useState<null | { initial?: Address }>(null)
  const [method, setMethod] = useState<MethodId>(review.signedIn ? 'visa' : 'new')
  const [terms, setTerms] = useState(false)
  const [tried, setTried] = useState(false)
  const [placing, setPlacing] = useState(false)
  const [declined, setDeclined] = useState(false)
  const [simulateDecline, setSimulateDecline] = useState(false)

  if (!review.loading && cart.length === 0) return <Navigate to="/cart" replace />

  const total = cartTotals(cart, priceFor, 0, fee).total
  const overCredit = total > credit.available

  const place = () => {
    setTried(true)
    setDeclined(false)
    if (!terms) return
    setPlacing(true)
    window.setTimeout(() => {
      setPlacing(false)
      if (simulateDecline && (method === 'visa' || method === 'new')) {
        setDeclined(true)
        setSimulateDecline(false)
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      nav('/checkout/success')
    }, 1400)
  }

  const cta = (
    <Box>
      <Button fullWidth variant="contained" size="large" onClick={place} disabled={placing}
        startIcon={placing ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : <LockOutlined />}
        sx={{ '&.Mui-disabled': { bgcolor: c.red, color: '#fff', opacity: 0.85 } }}>
        {placing ? 'Placing order…' : `Place order · ${money(total)}`}
      </Button>
      <Link component="button" type="button" onClick={() => setSimulateDecline(true)}
        sx={{ display: 'block', mx: 'auto', mt: 1.5, fontSize: 12, color: c.text3 }}>
        {simulateDecline ? 'Next card payment will be declined (prototype)' : 'Prototype: simulate a declined card'}
      </Link>
    </Box>
  )

  return (
    <Container sx={{ pb: { xs: 18, md: 6 } }}>
      <Box sx={{ py: { xs: 2, md: 3 }, maxWidth: 640 }}>
        <CheckoutStepper active={2} />
      </Box>
      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: 'minmax(0,1fr) 420px' }, alignItems: 'start' }}>
        <Stack spacing={2.5} sx={{ minWidth: 0 }}>
          <Typography variant="h1" sx={{ fontSize: { xs: 26, md: 36 } }}>How would you like to pay?</Typography>
          <MobileSummaryToggle deliveryFee={fee} />

          {declined && (
            <Alert severity="error" icon={<ErrorOutlineRounded />} sx={{ borderRadius: `${tokens.radius.md}px` }}>
              <b>Your card was declined.</b> Your bank didn’t approve this payment (code: card_declined). Try another card, pay on account, or call your bank. Nothing was charged.
            </Alert>
          )}

          {/* Review what was chosen on step 1 */}
          <Panel sx={{ p: { xs: 2, md: 2.5 } }}>
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr auto' }, alignItems: 'start' }}>
              <Box>
                <Typography variant="overline" sx={{ color: c.text3 }}>Ship to</Typography>
                <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{dm.id === 'pickup' ? 'Pickup — Mississauga cash & carry' : `${ship.company || ship.name}`}</Typography>
                <Typography sx={{ fontSize: 13, color: c.text2 }}>{dm.id === 'pickup' ? '3750A Laird Road, Unit 9' : `${ship.street}, ${ship.city} ${ship.postal}`}</Typography>
              </Box>
              <Box>
                <Typography variant="overline" sx={{ color: c.text3 }}>Delivery</Typography>
                <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{dm.title}</Typography>
                <Typography sx={{ fontSize: 13, color: c.successText, fontWeight: 600 }}>{dm.eta}</Typography>
              </Box>
              <Button component={RouterLink} to="/checkout" size="small" startIcon={<EditOutlined />} sx={{ color: c.navy, justifySelf: { xs: 'start', md: 'end' } }}>Change</Button>
            </Box>
          </Panel>

          <Panel>
            <StepHeading n={1} title="Billing address" />
            <FormControlLabel
              control={<Switch checked={same} onChange={(e) => setSame(e.target.checked)} />}
              label={<Typography sx={{ fontWeight: 500 }}>Same as shipping address</Typography>}
              sx={{ ml: 0, mb: same ? 0 : 2, minHeight: 44 }}
            />
            {same ? (
              <Typography sx={{ fontSize: 13.5, color: c.text2, pl: 1 }}>{ship.company || ship.name} · {ship.street}, {ship.city} {ship.postal}</Typography>
            ) : (
              <>
                <Box role="radiogroup" aria-label="Billing address" sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                  {billingList.map((a) => (
                    <AddressCard key={a.id} address={{ ...a, inArea: undefined }} selected={a.id === billingId} onSelect={() => setBillingId(a.id)} onEdit={() => setEditBilling({ initial: a })} />
                  ))}
                </Box>
                <Button variant="outlined" color="secondary" onClick={() => setEditBilling({})} sx={{ mt: 1.5 }}>Add billing address</Button>
              </>
            )}
          </Panel>

          <Panel>
            <StepHeading n={2} title="Payment method" aside={<Stack direction="row" spacing={0.5} alignItems="center" sx={{ fontSize: 12, color: c.text3 }}><LockOutlined sx={{ fontSize: 15 }} /><span>Encrypted</span></Stack>} />
            <Stack spacing={1.25} role="radiogroup" aria-label="Payment method">
              {review.signedIn && (
                <>
                  <MethodRow id="visa" selected={method === 'visa'} onSelect={setMethod} icon={<CardBrand brand="visa" />} title="Visa •••• 4242" sub="Expires 08/28 · Priya Raman"
                    aside={<Box component="span" sx={{ fontSize: 11, fontWeight: 700, color: c.navy, bgcolor: c.navyTint, px: 1, py: 0.25, borderRadius: 999 }}>Default</Box>}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <TextField size="small" label="CVC" sx={{ width: 110, flexShrink: 0 }} inputProps={{ inputMode: 'numeric', maxLength: 4 }} InputProps={{ sx: { minHeight: 44 } }} />
                      <Typography sx={{ fontSize: 12.5, color: c.text3 }}>Stripe re-confirms the CVC on saved cards.</Typography>
                    </Stack>
                  </MethodRow>
                  <MethodRow id="mc" selected={false} onSelect={setMethod} disabled icon={<CardBrand brand="mc" />} title="Mastercard •••• 5454"
                    sub={<Box component="span" sx={{ color: c.error, fontWeight: 600 }}>Expired 09/26 — update in your account</Box>} />
                </>
              )}
              <MethodRow id="new" selected={method === 'new'} onSelect={setMethod}
                icon={<Box sx={{ width: 44, height: 30, borderRadius: 1, border: `1px solid ${c.line2}`, display: 'grid', placeItems: 'center', flexShrink: 0 }}><CreditCardOutlined sx={{ fontSize: 20, color: c.navy }} /></Box>}
                title={review.signedIn ? 'Add a new card' : 'Credit or debit card'} sub="Visa, Mastercard, Amex">
                <StripeCardElement error={declined && method === 'new' ? 'Your card was declined.' : undefined} />
              </MethodRow>
              {review.signedIn && (
                <MethodRow id="account" selected={method === 'account'} onSelect={setMethod}
                  icon={<Box sx={{ width: 44, height: 30, borderRadius: 1, bgcolor: c.navy, color: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0 }}><ReceiptLongOutlined sx={{ fontSize: 18 }} /></Box>}
                  title={`Pay on account — ${credit.terms}`} sub={<>Available credit <b style={{ color: c.successText }}>{money(credit.available)}</b> of {money(credit.limit)}</>}>
                  {overCredit ? (
                    <Alert severity="warning" sx={{ borderRadius: `${tokens.radius.sm}px` }}>This order exceeds your available credit. Pay the difference by card or call your rep.</Alert>
                  ) : (
                    <Typography sx={{ fontSize: 13, color: c.text2 }}>
                      We’ll add {money(total)} to invoice INV-2048, due Nov 5, 2026. After this order: <b>{money(credit.available - total)}</b> available.
                      {credit.overdue > 0 && <Box component="span" sx={{ display: 'block', color: c.warning, fontWeight: 600, mt: 0.5 }}>Heads-up: {money(credit.overdue)} is overdue on INV-2041.</Box>}
                    </Typography>
                  )}
                </MethodRow>
              )}
              <MethodRow id="etransfer" selected={method === 'etransfer'} onSelect={setMethod}
                icon={<Box sx={{ width: 44, height: 30, borderRadius: 1, bgcolor: '#FFC531', color: c.navyDark, display: 'grid', placeItems: 'center', flexShrink: 0 }}><AccountBalanceOutlined sx={{ fontSize: 18 }} /></Box>}
                title="Interac e-Transfer" sub="Send to payments@mysupreme.ca — we dispatch once received">
                <Typography sx={{ fontSize: 13, color: c.text2 }}>Use your order number as the message. Orders hold for 24 hours.</Typography>
              </MethodRow>
            </Stack>
          </Panel>

          <Panel>
            <FormControlLabel
              control={<Checkbox checked={terms} onChange={(e) => setTerms(e.target.checked)} sx={{ color: tried && !terms ? c.error : undefined }} />}
              label={<Typography sx={{ fontSize: 14 }}>I agree to the <Link component={RouterLink} to="/page/terms" sx={{ color: c.navy, fontWeight: 600 }}>Terms &amp; Uses</Link> and <Link component={RouterLink} to="/page/privacy-policy" sx={{ color: c.navy, fontWeight: 600 }}>Privacy Policy</Link>, including the substitution policy for out-of-stock items.</Typography>}
              sx={{ alignItems: 'flex-start', '& .MuiCheckbox-root': { mt: -0.75 } }}
            />
            {tried && !terms && <FormHelperText error sx={{ ml: 4, fontSize: 13 }}>Please accept the terms to place your order.</FormHelperText>}
          </Panel>

          <Box sx={{ display: { xs: 'none', md: 'block', lg: 'none' } }}>{cta}</Box>
          <Button component={RouterLink} to="/checkout" sx={{ color: c.navy, alignSelf: 'flex-start', display: { xs: 'none', md: 'inline-flex' } }}>← Back to shipping</Button>
          <Box sx={{ display: { md: 'none' }, textAlign: 'center' }}>
            <Link component="button" type="button" onClick={() => setSimulateDecline(true)} sx={{ fontSize: 12, color: c.text3 }}>
              {simulateDecline ? 'Next card payment will be declined (prototype)' : 'Prototype: simulate a declined card'}
            </Link>
          </Box>
        </Stack>

        <CheckoutSidebar deliveryFee={fee} action={cta} />
      </Box>
      <MobileCta label={`Place order`} onClick={place} total={total} loading={placing} />
      <AddressDialog
        open={!!editBilling}
        requireArea={false}
        onClose={() => setEditBilling(null)}
        initial={editBilling?.initial}
        title={editBilling?.initial ? 'Edit billing address' : 'Add billing address'}
        onSave={(a) => {
          const ed = editBilling?.initial
          setBillingList((l) => (ed ? l.map((x) => (x.id === ed.id ? { ...a, id: ed.id } : x)) : [...l, a]))
          setBillingId(ed ? ed.id : a.id)
          setEditBilling(null)
        }}
      />
    </Container>
  )
}
