import { useEffect, useMemo, useRef, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Box, Button, Checkbox, CircularProgress, FormControlLabel, Typography } from '@mui/material'
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded'
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined'
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'
import { finalPrice, money, productBySku } from '../../lib/data'
import { useCart } from '../../lib/cart'
import { useSession, type Order, type Payment } from '../../lib/session'
import { useToast } from '../../lib/toast'
import { totals } from '../../lib/pricing'
import { slotsFor, zones } from '../../lib/delivery'
import { addressErrors, digits, luhn } from '../../lib/validate'
import { colors, focusRing, mono, radius } from '../../lib/theme'
import CheckoutLayout, { CheckoutCard, ErrorSummary } from '../../components/Checkout/CheckoutLayout'
import { AddressBlock, AddressForm, RadioCard } from '../../components/Checkout/CheckoutParts'
import Field from '../../components/ui/Field'
import { StickyBottomBar } from '../../components/ui/Feedback'

type Card = { number: string; expiry: string; cvc: string; name: string }
const DECLINE = '4000000000000002'

const fmtCard = (v: string) => digits(v).slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ')
const fmtExpiry = (v: string) => { const d = digits(v).slice(0, 4); return d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d }

function cardErrors(c: Card) {
  const e: Partial<Record<keyof Card, string>> = {}
  if (!luhn(c.number)) e.number = 'Enter the 16-digit card number from the front of your card.'
  const [mm, yy] = digits(c.expiry).match(/.{1,2}/g) ?? []
  const m = Number(mm), y = 2000 + Number(yy)
  if (!mm || !yy || m < 1 || m > 12) e.expiry = 'Enter the expiry date as MM / YY.'
  else if (y < 2026 || (y === 2026 && m < 10)) e.expiry = 'This card has expired. Use another card.'
  if (digits(c.cvc).length < 3) e.cvc = 'Enter the 3 or 4 digits on the back of the card.'
  if (!c.name.trim()) e.name = 'Enter the name as it appears on the card.'
  return e
}

/**
 * Checkout step 2 — review delivery, billing address, payment method, terms, place order.
 * The card fields stand in for Stripe Elements (TODO: mount Stripe's CardElement here in production).
 * Test: 4242 4242 4242 4242 succeeds, 4000 0000 0000 0002 is declined — so the error path can be reviewed.
 */
export default function CheckoutPayment() {
  const router = useRouter()
  const { toast } = useToast()
  const { lines, coupon, clear } = useCart()
  const { user, ready, draft, updateDraft, saveOrder } = useSession()
  const [card, setCard] = useState<Card>({ number: '', expiry: '', cvc: '', name: '' })
  const [terms, setTerms] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [placing, setPlacing] = useState(false)
  const [declined, setDeclined] = useState('')
  const declinedRef = useRef<HTMLDivElement>(null)
  // Set once the order is placed, so the step-1 guard below doesn't fire while the draft resets.
  const placed = useRef(false)
  const t = totals(lines, { coupon, method: draft.method })

  // Step 1 must be complete; otherwise send the buyer back with an explanation instead of a broken form.
  const step1Ok = draft.method === 'pickup' ? !!draft.address.contact && !!draft.address.phone : Object.keys(addressErrors(draft.address)).length === 0
  useEffect(() => {
    if (ready && lines.length && !step1Ok && !placed.current) {
      toast({ message: 'Add your delivery details first', severity: 'info' })
      router.replace('/checkout')
    }
  }, [ready, lines.length, step1Ok, router, toast])

  // Payment options depend on who's buying and how the order is fulfilled.
  const canAccount = !!user
  const canOnPickup = draft.method === 'pickup'
  const payment: Payment = draft.payment === 'account' && !canAccount ? 'card' : draft.payment === 'on-pickup' && !canOnPickup ? 'card' : draft.payment
  const slot = slotsFor(draft.address.postal).find((s) => s.id === draft.slotId)

  const errors = useMemo(() => {
    const e: { id: string; message: string }[] = []
    if (!draft.billingSame) for (const [k, m] of Object.entries(addressErrors(draft.billing))) e.push({ id: `bill-${k}`, message: m as string })
    if (payment === 'card') for (const [k, m] of Object.entries(cardErrors(card))) e.push({ id: `card-${k}`, message: m as string })
    if (!terms) e.push({ id: 'terms', message: 'Tick the box to accept the terms and returns policy.' })
    return e
  }, [draft.billingSame, draft.billing, payment, card, terms])
  const fieldErr = (id: string) => (submitted ? errors.find((e) => e.id === id)?.message : undefined)

  const place = async () => {
    setSubmitted(true)
    setDeclined('')
    if (errors.length) {
      window.requestAnimationFrame(() => document.getElementById('error-summary')?.focus())
      return
    }
    setPlacing(true)
    await new Promise((r) => setTimeout(r, 1400))
    if (payment === 'card' && digits(card.number) === DECLINE) {
      setPlacing(false)
      setDeclined('Your card was declined by the bank. No money was taken. Try another card, or choose another payment method.')
      window.requestAnimationFrame(() => declinedRef.current?.focus())
      return
    }
    const order: Order = {
      number: String(124 + Math.floor(Math.random() * 800)).padStart(9, '0'),
      placedAt: new Date().toISOString(),
      email: user?.email ?? draft.email,
      lines: lines.map((l) => ({ ...l, price: finalPrice(productBySku(l.sku)!) })),
      subtotal: t.subtotal, discount: t.discount, tax: t.tax, total: t.total, coupon,
      method: draft.method,
      address: draft.address,
      slotLabel: draft.method === 'pickup' ? 'Ready in about 2 hours' : slot?.label ?? '',
      paymentLabel: payment === 'card' ? `Card ending ${digits(card.number).slice(-4)}` : payment === 'account' ? `On account (${user?.terms})` : 'Pay at pickup',
      guest: !user,
    }
    placed.current = true
    saveOrder(order)
    await router.push('/checkout/success')
    clear({ silent: true })
  }

  const cardField = (k: keyof Card, label: string, extra: object) => (
    <Field id={`card-${k}`} label={label} value={card[k]} error={fieldErr(`card-${k}`)} {...extra} onChange={(e) => setCard({ ...card, [k]: k === 'number' ? fmtCard(e.target.value) : k === 'expiry' ? fmtExpiry(e.target.value) : k === 'cvc' ? digits(e.target.value).slice(0, 4) : e.target.value })} />
  )

  return (
    <>
      <Head><title>Checkout: payment | MySupreme</title><meta name="robots" content="noindex" /></Head>
      <CheckoutLayout step="payment" title="Payment" method={draft.method}>
        <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); place() }} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {submitted && <ErrorSummary errors={errors} />}
          {declined && (
            <Box ref={declinedRef} tabIndex={-1} role="alert" sx={{ display: 'flex', gap: 1.25, p: 2, borderRadius: radius.lg, bgcolor: colors.errorTint, border: `1px solid ${colors.errorLine}`, outline: 'none' }}>
              <ErrorOutlineRoundedIcon sx={{ color: colors.error, mt: '1px' }} />
              <Box>
                <Typography sx={{ fontWeight: 600, color: '#7F1D1D' }}>Payment didn’t go through</Typography>
                <Typography sx={{ fontSize: 14, color: '#7F1D1D' }}>{declined}</Typography>
              </Box>
            </Box>
          )}

          <CheckoutCard id="review" title={draft.method === 'pickup' ? 'Pickup' : 'Delivery'} action={<Button component={Link} href="/checkout" size="small">Change</Button>}>
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: 'minmax(0,1fr)', sm: 'minmax(0,1fr) minmax(0,1fr)' } }}>
              {draft.method === 'pickup' ? (
                <Box sx={{ fontSize: 14.5, color: colors.ink700 }}><b style={{ color: colors.ink }}>{zones.pickup.name}</b><br />{zones.pickup.address}<br />Picked up by {draft.address.contact} · {draft.address.phone}</Box>
              ) : (
                <AddressBlock a={draft.address} />
              )}
              <Box>
                <Typography sx={{ fontSize: 13, color: colors.ink500 }}>{draft.method === 'pickup' ? 'Ready' : 'Delivery window'}</Typography>
                <Typography sx={{ fontWeight: 600 }}>{draft.method === 'pickup' ? 'In about 2 hours · Mon–Sat 9am–6pm' : slot?.label ?? 'Next route day'}</Typography>
                <Typography sx={{ fontSize: 13, color: colors.ink500, mt: 1 }}>Confirmation to</Typography>
                <Typography sx={{ fontWeight: 500, overflowWrap: 'anywhere' }}>{user?.email ?? draft.email}</Typography>
              </Box>
            </Box>
          </CheckoutCard>

          <CheckoutCard id="pay" step={1} title="Payment method">
            <Box role="radiogroup" aria-labelledby="pay-title" sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              <RadioCard name="payment" value="card" checked={payment === 'card'} onChange={() => updateDraft({ payment: 'card' })} icon={<CreditCardRoundedIcon />} title="Credit or debit card" description="Visa, Mastercard — processed securely by Stripe">
                {/* TODO(Stripe): replace these fields with Stripe Elements (CardElement / saved cards) — same layout. */}
                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: 'minmax(0,1fr) minmax(0,1fr)', sm: '2fr minmax(0,1fr) minmax(0,1fr)' }, pt: 1 }}>
                  <Box sx={{ gridColumn: { xs: '1 / -1', sm: 'auto' } }}>{cardField('number', 'Card number', { autoComplete: 'cc-number', placeholder: '1234 1234 1234 1234', inputProps: { inputMode: 'numeric', style: { fontFamily: mono } } })}</Box>
                  {cardField('expiry', 'Expiry', { autoComplete: 'cc-exp', placeholder: 'MM / YY', inputProps: { inputMode: 'numeric' } })}
                  {cardField('cvc', 'CVC', { autoComplete: 'cc-csc', placeholder: '123', inputProps: { inputMode: 'numeric' } })}
                  <Box sx={{ gridColumn: '1 / -1' }}>{cardField('name', 'Name on card', { autoComplete: 'cc-name' })}</Box>
                </Box>
                <Typography sx={{ mt: 1.5, fontSize: 12.5, color: colors.ink500 }}>Prototype: use 4242 4242 4242 4242 to succeed, or 4000 0000 0000 0002 to see a declined card.</Typography>
              </RadioCard>
              <RadioCard
                name="payment" value="account" checked={payment === 'account'} onChange={() => updateDraft({ payment: 'account' })} icon={<AccountBalanceOutlinedIcon />}
                title="Pay on account" description={user ? `Invoiced on your ${user.terms} terms · Available credit $7,450.00` : undefined}
                disabled={!canAccount} disabledReason={<>For business accounts with credit terms. <Box component={Link} href="/account/signin?next=/checkout/payment" sx={{ color: colors.redText, fontWeight: 600 }}>Sign in</Box></>}
              />
              <RadioCard
                name="payment" value="on-pickup" checked={payment === 'on-pickup'} onChange={() => updateDraft({ payment: 'on-pickup' })} icon={<StorefrontOutlinedIcon />}
                title="Pay at pickup" description="Cash, debit or card at the warehouse counter"
                disabled={!canOnPickup} disabledReason="Available when you choose warehouse pickup."
              />
            </Box>
          </CheckoutCard>

          <CheckoutCard id="billing" step={2} title="Billing address">
            <FormControlLabel control={<Checkbox checked={draft.billingSame} onChange={(e) => updateDraft({ billingSame: e.target.checked })} />} label={draft.method === 'pickup' ? 'Same as my business details' : 'Same as delivery address'} />
            {!draft.billingSame && (
              <Box sx={{ mt: 2 }}>
                <AddressForm prefix="bill" value={draft.billing} onChange={(a) => updateDraft({ billing: a })} errors={Object.fromEntries(['business', 'contact', 'phone', 'street', 'city', 'postal'].map((k) => [k, fieldErr(`bill-${k}`)]))} />
              </Box>
            )}
          </CheckoutCard>

          <Box sx={{ bgcolor: '#fff', border: `1px solid ${fieldErr('terms') ? colors.error : colors.line}`, borderRadius: radius.xl, p: { xs: 2, md: 2.5 } }}>
            <FormControlLabel
              control={<Checkbox id="terms" checked={terms} onChange={(e) => setTerms(e.target.checked)} inputProps={{ 'aria-invalid': !!fieldErr('terms'), 'aria-describedby': fieldErr('terms') ? 'terms-error' : undefined }} />}
              label={<Typography sx={{ fontSize: 14.5 }}>I agree to the <Box component={Link} href="/terms-uses" target="_blank" sx={{ color: colors.redText, fontWeight: 500, borderRadius: '4px', ...focusRing }}>Terms &amp; Uses</Box> and the returns policy.</Typography>}
            />
            {fieldErr('terms') && <Typography id="terms-error" sx={{ display: 'flex', gap: 0.5, fontSize: 13, color: colors.error, ml: 4 }}><ErrorOutlineRoundedIcon sx={{ fontSize: 16, mt: '1px' }} /> {fieldErr('terms')}</Typography>}
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'space-between', alignItems: 'center', gap: 2, mt: 1 }}>
            <Button component={Link} href="/checkout">Back to delivery</Button>
            <Button type="submit" variant="contained" size="large" disabled={placing} startIcon={placing ? <CircularProgress size={18} sx={{ color: 'inherit' }} /> : <LockOutlinedIcon />} sx={{ minWidth: 260 }}>
              {placing ? 'Placing your order…' : `Place order · ${money(t.total)}`}
            </Button>
          </Box>
          <Typography sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'right', fontSize: 12.5, color: colors.ink500, mt: -1 }}>You’ll get an email confirmation and invoice right away.</Typography>
          <StickyBottomBar>
            <Button type="button" onClick={place} variant="contained" size="large" fullWidth disabled={placing} startIcon={placing ? <CircularProgress size={18} sx={{ color: 'inherit' }} /> : <LockOutlinedIcon />}>
              {placing ? 'Placing your order…' : `Place order · ${money(t.total)}`}
            </Button>
          </StickyBottomBar>
        </Box>
      </CheckoutLayout>
    </>
  )
}
