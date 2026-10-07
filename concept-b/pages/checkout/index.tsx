import { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Box, Button, Typography } from '@mui/material'
import { money } from '../../lib/data'
import { useCart } from '../../lib/cart'
import { useSession, type Address } from '../../lib/session'
import { totals } from '../../lib/pricing'
import { addressErrors, emailError, phoneError } from '../../lib/validate'
import { colors, focusRing, radius } from '../../lib/theme'
import CheckoutLayout, { CheckoutCard, ErrorSummary } from '../../components/Checkout/CheckoutLayout'
import { AddressBlock, AddressForm, RadioCard } from '../../components/Checkout/CheckoutParts'
import { PostalResultNote } from '../../components/HomeComponents/DeliveryCheckBanner'
import { checkPostal, slotsFor, zones } from '../../lib/delivery'
import Field from '../../components/ui/Field'
import { StickyBottomBar } from '../../components/ui/Feedback'
import { ArrowRightIcon, StoreIcon, TruckIcon } from '../../components/ui/icons'

/**
 * Checkout step 1 — contact, delivery or pickup, address and delivery window.
 * Validation runs on Continue (and per field once touched); errors are listed at the top with links and shown
 * under each field. Input is kept in session storage, so going back to the cart loses nothing.
 */
export default function CheckoutDelivery() {
  const router = useRouter()
  const { lines, coupon } = useCart()
  const { user, ready, draft, updateDraft } = useSession()
  const [submitted, setSubmitted] = useState(false)
  const [editAddress, setEditAddress] = useState(false)
  const t = totals(lines, { coupon })
  const method = draft.method === 'delivery' && !t.deliveryEligible ? 'pickup' : draft.method

  // Below the minimum, delivery isn't available — fall back to pickup (and say why on the card).
  useEffect(() => {
    if (ready && draft.method === 'delivery' && lines.length && !t.deliveryEligible) updateDraft({ method: 'pickup' })
  }, [ready, draft.method, t.deliveryEligible, lines.length, updateDraft])

  const postal = checkPostal(draft.address.postal, zones)
  const slots = useMemo(() => slotsFor(draft.address.postal), [draft.address.postal])
  useEffect(() => {
    if (method === 'delivery' && slots.length && !slots.some((s) => s.id === draft.slotId)) updateDraft({ slotId: slots[0].id })
  }, [slots, method, draft.slotId, updateDraft])

  const usingSaved = !!user && !editAddress && draft.address.street === user.address.street
  const errors = useMemo(() => {
    const e: { id: string; message: string }[] = []
    if (!user) { const m = emailError(draft.email); if (m) e.push({ id: 'co-email', message: m }) }
    if (method === 'delivery') {
      const a = addressErrors(draft.address)
      for (const [k, m] of Object.entries(a)) e.push({ id: `ship-${k}`, message: m as string })
      if (!a.postal && postal.kind === 'out') e.push({ id: 'ship-postal', message: `We don’t deliver to ${draft.address.postal} yet — choose pickup or use another address.` })
    } else {
      if (!draft.address.contact.trim()) e.push({ id: 'pickup-contact', message: 'Enter the name of the person picking up.' })
      const p = phoneError(draft.address.phone)
      if (p) e.push({ id: 'pickup-phone', message: p })
    }
    return e
  }, [user, draft, method, postal.kind])
  const fieldErr = (id: string) => (submitted ? errors.find((e) => e.id === id)?.message : undefined)
  const shipErrors = Object.fromEntries(['business', 'contact', 'phone', 'street', 'city', 'postal'].map((k) => [k, fieldErr(`ship-${k}`)])) as Partial<Record<keyof Address, string>>

  const next = () => {
    setSubmitted(true)
    if (errors.length) {
      window.requestAnimationFrame(() => document.getElementById('error-summary')?.focus())
      return
    }
    updateDraft({ method })
    router.push('/checkout/payment')
  }

  return (
    <>
      <Head><title>Checkout: delivery | MySupreme</title><meta name="robots" content="noindex" /></Head>
      <CheckoutLayout step="delivery" title="Delivery details" method={method}>
        <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); next() }} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {submitted && <ErrorSummary errors={errors} />}

          <CheckoutCard id="contact" step={1} title="Contact">
            {user ? (
              <Typography sx={{ fontSize: 14.5, color: colors.ink700 }}>
                Signed in as <b style={{ color: colors.ink }}>{user.business}</b> ({user.email}). Order updates go to this email.
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Field id="co-email" label="Email" type="email" autoComplete="email" value={draft.email} onChange={(e) => updateDraft({ email: e.target.value })} error={fieldErr('co-email')} hint="We’ll send your order confirmation and invoice here." inputProps={{ inputMode: 'email' }} />
                <Typography sx={{ fontSize: 14, color: colors.ink600 }}>
                  Have a business account? <Box component={Link} href="/account/signin?next=/checkout" sx={{ color: colors.redText, fontWeight: 600, borderRadius: '4px', ...focusRing }}>Sign in</Box> for your prices and saved address.
                </Typography>
              </Box>
            )}
          </CheckoutCard>

          <CheckoutCard id="method" step={2} title="How would you like to get it?">
            <Box role="radiogroup" aria-labelledby="method-title" sx={{ display: 'grid', gap: 1.25, gridTemplateColumns: { xs: 'minmax(0,1fr)', sm: 'minmax(0,1fr) minmax(0,1fr)' } }}>
              <RadioCard
                name="method" value="delivery" checked={method === 'delivery'} onChange={() => updateDraft({ method: 'delivery' })}
                icon={<TruckIcon />} title="Delivery" aside="Free"
                description="Scheduled routes across the GTA, Hamilton & Niagara"
                disabled={!t.deliveryEligible}
                disabledReason={<>Add {money(t.remaining)} more to unlock delivery (minimum $350). <Box component={Link} href="/cart" sx={{ color: colors.redText, fontWeight: 600 }}>Back to cart</Box></>}
              />
              <RadioCard
                name="method" value="pickup" checked={method === 'pickup'} onChange={() => updateDraft({ method: 'pickup' })}
                icon={<StoreIcon />} title="Pick up at the warehouse" aside="Free"
                description="Ready in about 2 hours · 3750A Laird Road, Mississauga"
              />
            </Box>
          </CheckoutCard>

          {method === 'delivery' ? (
            <CheckoutCard id="address" step={3} title="Delivery address" action={usingSaved ? <Button size="small" onClick={() => setEditAddress(true)}>Use a different address</Button> : undefined}>
              {usingSaved ? (
                <Box sx={{ p: 2, borderRadius: radius.lg, border: `2px solid ${colors.ink}`, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                  <AddressBlock a={draft.address} />
                  <Box sx={{ alignSelf: 'flex-start', fontSize: 12, fontWeight: 600, color: colors.navy, bgcolor: colors.navyTint, px: 1, py: 0.25, borderRadius: radius.pill, whiteSpace: 'nowrap' }}>Default</Box>
                </Box>
              ) : (
                <AddressForm prefix="ship" value={draft.address} onChange={(a) => updateDraft({ address: a })} errors={shipErrors} />
              )}
              {draft.address.postal.replace(/\s/g, '').length >= 3 && postal.kind !== 'invalid' && (
                <Box sx={{ mt: 2 }} role="status" aria-live="polite">
                  <PostalResultNote result={postal} data={zones} />
                  {postal.kind === 'out' && <Button sx={{ mt: 1 }} variant="outlined" onClick={() => updateDraft({ method: 'pickup' })}>Switch to pickup</Button>}
                </Box>
              )}
              {slots.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography id="slot-title" component="h3" variant="h4" sx={{ mb: 1.25 }}>Delivery window</Typography>
                  <Box role="radiogroup" aria-labelledby="slot-title" sx={{ display: 'grid', gap: 1.25, gridTemplateColumns: { xs: 'minmax(0,1fr)', sm: 'minmax(0,1fr) minmax(0,1fr)' } }}>
                    {slots.map((s) => <RadioCard key={s.id} name="slot" value={s.id} checked={draft.slotId === s.id} onChange={(v) => updateDraft({ slotId: v })} title={s.label} description={s.note} />)}
                  </Box>
                </Box>
              )}
              <Box sx={{ mt: 3 }}>
                <Field id="ship-notes" label="Delivery notes" optional multiline minRows={2} value={draft.notes} onChange={(e) => updateDraft({ notes: e.target.value })} placeholder="Receiving hours, dock door, buzzer code…" />
              </Box>
            </CheckoutCard>
          ) : (
            <CheckoutCard id="pickup" step={3} title="Pickup details">
              <Box sx={{ p: 2, borderRadius: radius.lg, bgcolor: colors.subtle, mb: 2.5, display: 'flex', gap: 1.5 }}>
                <StoreIcon sx={{ color: colors.ink600, mt: '2px' }} />
                <Box>
                  <Typography sx={{ fontWeight: 600 }}>{zones.pickup.name}</Typography>
                  <Typography sx={{ fontSize: 14, color: colors.ink700 }}>{zones.pickup.address}</Typography>
                  <Typography sx={{ fontSize: 14, color: colors.ink700 }}>{zones.pickup.hours} · We’ll text you when it’s ready (about 2 hours)</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: 'minmax(0,1fr)', sm: 'minmax(0,1fr) minmax(0,1fr)' } }}>
                <Field id="pickup-contact" label="Who’s picking up?" autoComplete="name" value={draft.address.contact} onChange={(e) => updateDraft({ address: { ...draft.address, contact: e.target.value } })} error={fieldErr('pickup-contact')} />
                <Field id="pickup-phone" label="Mobile number" type="tel" autoComplete="tel" value={draft.address.phone} onChange={(e) => updateDraft({ address: { ...draft.address, phone: e.target.value } })} error={fieldErr('pickup-phone')} hint="For the ‘ready for pickup’ text" inputProps={{ inputMode: 'tel' }} />
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Field id="pickup-business" label="Business name" optional autoComplete="organization" value={draft.address.business} onChange={(e) => updateDraft({ address: { ...draft.address, business: e.target.value } })} />
                </Box>
              </Box>
            </CheckoutCard>
          )}

          <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'space-between', alignItems: 'center', gap: 2, mt: 1 }}>
            <Button component={Link} href="/cart">Back to cart</Button>
            <Button type="submit" variant="contained" size="large" endIcon={<ArrowRightIcon />}>Continue to payment</Button>
          </Box>
          <StickyBottomBar>
            <Button type="button" onClick={next} variant="contained" size="large" fullWidth endIcon={<ArrowRightIcon />}>Continue to payment</Button>
          </StickyBottomBar>
        </Box>
      </CheckoutLayout>
    </>
  )
}
