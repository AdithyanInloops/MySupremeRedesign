import { useRef, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Box, Button, Checkbox, CircularProgress, FormControlLabel, MenuItem, Typography } from '@mui/material'
import { departments } from '../../lib/data'
import { emailError, phoneError } from '../../lib/validate'
import { colors, focusRing, layout, radius, shadow } from '../../lib/theme'
import PageHeader from '../../components/ui/PageHeader'
import Section, { PageContainer } from '../../components/ui/Section'
import Field from '../../components/ui/Field'
import HomeFAQ, { type Faq } from '../../components/HomeComponents/HomeFAQ'
import { PHONE, PHONE_HREF, WHATSAPP_HREF } from '../../components/Layout/Header'
import { type IconComponent, AlertCircleIcon, CheckCircleIcon, ClockIcon, DirectionsIcon, MailIcon, MapIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from '../../components/ui/icons'

/*
 * Contact — the ways to reach us first (call, WhatsApp, email, visit), then the "Request pricing & supply
 * solutions" form from the live page with the same fields, regrouped, with inline validation and a clear success
 * state. Submit is simulated (live: /api/contactus-info).
 */

const MAPS = 'https://www.google.com/maps/search/?api=1&query=3750A+Laird+Road+Unit+9+Mississauga+ON'

const methods: { icon: IconComponent; title: string; value: string; note: string; href: string; external?: boolean }[] = [
  { icon: PhoneIcon, title: 'Call sales & support', value: PHONE, note: 'Mon–Sat, 9am–6pm', href: PHONE_HREF },
  { icon: WhatsAppIcon, title: 'WhatsApp', value: 'Message us', note: 'Photos of labels welcome', href: WHATSAPP_HREF, external: true },
  { icon: MailIcon, title: 'Email', value: 'sales@mysupreme.ca', note: 'We reply within 1 business day', href: 'mailto:sales@mysupreme.ca' },
  { icon: MapPinIcon, title: 'Visit the warehouse', value: '3750A Laird Rd, Unit 9', note: 'Mississauga · Get directions', href: MAPS, external: true },
]

const SPEND = [['under1k', 'Under $1K'], ['1k-5k', '$1K – $5K'], ['5k-15k', '$5K – $15K'], ['15k-30k', '$15K – $30K'], ['30k-60k', '$30K – $60K'], ['60k-100k', '$60K – $100K']]
const REQUIREMENT = [['regular', 'Regular supply partnership'], ['bulk', 'Bulk purchasing'], ['urgent', 'Urgent restocking'], ['one-time', 'One-time purchase']]
const SERVICES = ['Cash & Carry pickup', 'Delivery service', 'Online ordering (mysupreme.ca)', 'Dedicated sales representative']

const faqs: Faq[] = [
  { q: 'Do you offer delivery or pickup?', a: 'Both. Pick up at our Mississauga cash & carry, or get same-day or next-day delivery across the GTA, Hamilton and Niagara.' },
  { q: 'What is the minimum order for delivery?', a: 'Delivery is available on orders of $350 or more. Smaller orders can be picked up at the warehouse.' },
  { q: 'Do I need a business account?', a: 'We mainly serve registered foodservice businesses. A free business account gives you customer-group pricing and credit terms.' },
  { q: 'How fast is delivery?', a: 'Orders placed by 2 PM go out on the next route day; same-day is available on selected routes.' },
]

type Form = { business: string; contact: string; phone: string; email: string; type: string; location: string; spend: string; requirement: string; services: string[]; categories: string[]; message: string }
const empty: Form = { business: '', contact: '', phone: '', email: '', type: '', location: '', spend: '', requirement: '', services: [], categories: [], message: '' }

function PricingForm() {
  const [f, setF] = useState<Form>(empty)
  const [touched, setTouched] = useState(false)
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState<Form | null>(null)
  const doneRef = useRef<HTMLDivElement>(null)
  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value })
  const toggle = (k: 'services' | 'categories', v: string) => setF({ ...f, [k]: f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v] })
  const errors: Partial<Record<keyof Form, string>> = {
    business: f.business.trim() ? '' : 'Enter your business name.',
    contact: f.contact.trim() ? '' : 'Enter the name of the person we should contact.',
    phone: phoneError(f.phone),
    email: emailError(f.email),
    spend: f.spend ? '' : 'Choose an estimated monthly spend so we can size your pricing.',
    requirement: f.requirement ? '' : 'Choose what kind of supply you need.',
  }
  const err = (k: keyof Form) => (touched ? errors[k] || undefined : undefined)
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)
    const first = (Object.keys(errors) as (keyof Form)[]).find((k) => errors[k])
    if (first) {
      const el = document.getElementById(`cf-${first}`)
      el?.focus()
      el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      return
    }
    setBusy(true)
    await new Promise((r) => setTimeout(r, 900))
    setBusy(false)
    setSent(f)
    setF(empty)
    setTouched(false)
    window.requestAnimationFrame(() => doneRef.current?.focus())
  }

  if (sent) {
    return (
      <Box ref={doneRef} tabIndex={-1} role="status" sx={{ textAlign: 'center', py: { xs: 3, md: 6 }, outline: 'none' }}>
        <CheckCircleIcon sx={{ fontSize: 56, color: colors.success }} />
        <Typography variant="h2" component="h2" sx={{ mt: 1 }}>Request sent — thank you</Typography>
        <Typography sx={{ color: colors.ink600, mt: 1, maxWidth: 440, mx: 'auto' }}>
          Our B2B team will call {sent.contact.split(' ')[0]} at {sent.phone} or email {sent.email} within 24 hours with pricing for {sent.business}.
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', mt: 3 }}>
          <Button component={Link} href="/" variant="contained">Browse products</Button>
          <Button variant="outlined" onClick={() => setSent(null)}>Send another request</Button>
        </Box>
      </Box>
    )
  }

  const group = (title: string, children: React.ReactNode) => (
    <Box component="fieldset" sx={{ border: 0, p: 0, m: 0, display: 'grid', gap: 2, gridTemplateColumns: { xs: 'minmax(0,1fr)', sm: 'minmax(0,1fr) minmax(0,1fr)' } }}>
      <Box component="legend" sx={{ fontSize: 13, fontWeight: 600, color: colors.ink500, letterSpacing: '.08em', textTransform: 'uppercase', mb: 1.5, p: 0 }}>{title}</Box>
      {children}
    </Box>
  )

  return (
    <Box component="form" noValidate onSubmit={submit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {group('Your business', <>
        <Field id="cf-business" label="Business name" autoComplete="organization" value={f.business} onChange={set('business')} error={err('business')} />
        <Field id="cf-contact" label="Contact person" autoComplete="name" value={f.contact} onChange={set('contact')} error={err('contact')} />
        <Field id="cf-phone" label="Phone" type="tel" autoComplete="tel" value={f.phone} onChange={set('phone')} error={err('phone')} inputProps={{ inputMode: 'tel' }} />
        <Field id="cf-email" label="Email" type="email" autoComplete="email" value={f.email} onChange={set('email')} error={err('email')} inputProps={{ inputMode: 'email' }} />
        <Field id="cf-type" label="Business type" optional value={f.type} onChange={set('type')} placeholder="Restaurant, café, bakery…" />
        <Field id="cf-location" label="City or region" optional value={f.location} onChange={set('location')} placeholder="Toronto, Hamilton, Niagara…" />
      </>)}
      {group('What you need', <>
        <Field id="cf-spend" label="Estimated monthly spend" select value={f.spend} onChange={set('spend')} error={err('spend')} SelectProps={{ displayEmpty: true }}>
          <MenuItem value="" disabled>Choose a range</MenuItem>
          {SPEND.map(([v, l]) => <MenuItem key={v} value={v}>{l}</MenuItem>)}
        </Field>
        <Field id="cf-requirement" label="Type of supply" select value={f.requirement} onChange={set('requirement')} error={err('requirement')} SelectProps={{ displayEmpty: true }}>
          <MenuItem value="" disabled>Choose one</MenuItem>
          {REQUIREMENT.map(([v, l]) => <MenuItem key={v} value={v}>{l}</MenuItem>)}
        </Field>
        <Box component="fieldset" sx={{ gridColumn: '1 / -1', border: 0, p: 0, m: 0 }}>
          <Box component="legend" sx={{ fontSize: 14, fontWeight: 500, mb: 0.5 }}>How you’d like to buy <Box component="span" sx={{ color: colors.ink500, fontWeight: 400 }}>(optional)</Box></Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', sm: 'minmax(0,1fr) minmax(0,1fr)' } }}>
            {SERVICES.map((s) => <FormControlLabel key={s} control={<Checkbox size="small" checked={f.services.includes(s)} onChange={() => toggle('services', s)} />} label={<Typography sx={{ fontSize: 14 }}>{s}</Typography>} />)}
          </Box>
        </Box>
        <Box component="fieldset" sx={{ gridColumn: '1 / -1', border: 0, p: 0, m: 0 }}>
          <Box component="legend" sx={{ fontSize: 14, fontWeight: 500, mb: 1 }}>Departments you buy from <Box component="span" sx={{ color: colors.ink500, fontWeight: 400 }}>(optional)</Box></Box>
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
            {departments.map((d) => {
              const on = f.categories.includes(d.name)
              return (
                <Box key={d.uid} component="button" type="button" aria-pressed={on} onClick={() => toggle('categories', d.name)}
                  sx={{ all: 'unset', boxSizing: 'border-box', cursor: 'pointer', minHeight: 36, px: 1.5, display: 'inline-flex', alignItems: 'center', borderRadius: radius.pill, fontSize: 13.5, fontWeight: 500, border: `1px solid ${on ? colors.ink : colors.line2}`, bgcolor: on ? colors.ink : '#fff', color: on ? '#fff' : colors.ink, ...focusRing }}>
                  {d.name}
                </Box>
              )
            })}
          </Box>
        </Box>
        <Box sx={{ gridColumn: '1 / -1' }}>
          <Field id="cf-message" label="Anything else?" optional multiline minRows={3} value={f.message} onChange={set('message')} placeholder="Products you buy weekly, delivery days, current supplier pain points…" />
        </Box>
      </>)}
      {touched && Object.values(errors).some(Boolean) && (
        <Box role="alert" sx={{ display: 'flex', gap: 1, p: 1.5, borderRadius: radius.md, bgcolor: colors.errorTint, color: '#7F1D1D', fontSize: 14 }}>
          <AlertCircleIcon sx={{ color: colors.error, fontSize: 20 }} /> Please fix the highlighted fields to send your request.
        </Box>
      )}
      <Box>
        <Button type="submit" variant="contained" size="large" fullWidth disabled={busy} startIcon={busy ? <CircularProgress size={18} sx={{ color: 'inherit' }} /> : undefined}>
          {busy ? 'Sending…' : 'Get custom pricing'}
        </Button>
        <Typography sx={{ mt: 1.25, fontSize: 13, color: colors.ink500, textAlign: 'center' }}>We respond within 24 hours with pricing and supply details for your business.</Typography>
      </Box>
    </Box>
  )
}

export default function ContactUs() {
  return (
    <>
      <Head>
        <title>Contact us | MySupreme</title>
        <meta name="description" content="Contact MySupreme Food Service for wholesale pricing, supply solutions and order help. Call, WhatsApp, email or visit our Mississauga cash & carry." />
      </Head>
      <PageContainer>
        <PageHeader
          breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Contact us' }]}
          eyebrow="We’re here to help"
          title="Contact us"
          description="Wholesale pricing, delivery questions or help with an order — our team answers Mon–Sat, 9am–6pm."
        />
        <Box component="ul" aria-label="Ways to reach us" sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gap: { xs: 1.25, md: 2 }, gridTemplateColumns: { xs: 'minmax(0,1fr)', sm: 'repeat(2, minmax(0,1fr))', lg: 'repeat(4, minmax(0,1fr))' } }}>
          {methods.map((m) => {
            const Icon = m.icon
            return (
              <li key={m.title}>
                <Box component="a" href={m.href} {...(m.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  sx={{ display: 'flex', gap: 1.5, alignItems: 'center', p: 2, height: '100%', borderRadius: radius.lg, border: `1px solid ${colors.line}`, textDecoration: 'none', color: colors.ink, transition: 'box-shadow .2s, border-color .2s', '&:hover': { borderColor: colors.line2, boxShadow: shadow.md }, ...focusRing }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: '50%', bgcolor: colors.redTint, color: colors.redText, display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon /></Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontSize: 13, color: colors.ink600 }}>{m.title}</Typography>
                    <Typography sx={{ fontWeight: 600, fontSize: 15.5, overflowWrap: 'anywhere' }}>{m.value}</Typography>
                    <Typography sx={{ fontSize: 13, color: colors.ink500 }}>{m.note}</Typography>
                  </Box>
                </Box>
              </li>
            )
          })}
        </Box>
      </PageContainer>

      <Section id="pricing" labelledBy="pricing-title">
        <Box sx={{ display: 'grid', gap: { xs: 3, md: 5 }, gridTemplateColumns: { xs: 'minmax(0,1fr)', lg: 'minmax(0,1.35fr) minmax(0,1fr)' }, alignItems: 'start' }}>
          <Box sx={{ border: `1px solid ${colors.line}`, borderRadius: radius.xl, p: { xs: 2, md: 3.5 } }}>
            <Typography variant="overline" component="p" sx={{ color: colors.redText }}>For businesses</Typography>
            <Typography id="pricing-title" component="h2" variant="h2" sx={{ mt: 0.5 }}>Request pricing &amp; supply solutions</Typography>
            <Typography sx={{ color: colors.ink600, mt: 0.75, mb: 3 }}>Tell us about your kitchen and our B2B team will reply within 24 hours.</Typography>
            <PricingForm />
          </Box>

          <Box id="visit" sx={{ display: 'flex', flexDirection: 'column', gap: 2, scrollMarginTop: layout.headerOffset }}>
            <Box sx={{ borderRadius: radius.xl, overflow: 'hidden', border: `1px solid ${colors.line}` }}>
              {/* TODO(asset): static map of 3750A Laird Road (Google Static Maps or a designed map illustration), 16:9. */}
              <Box role="img" aria-label="Map placeholder: Supreme Cash & Carry, 3750A Laird Road, Mississauga" sx={{ aspectRatio: '16 / 9', bgcolor: colors.sunken, display: 'grid', placeItems: 'center', backgroundImage: `linear-gradient(${colors.line} 1px, transparent 1px), linear-gradient(90deg, ${colors.line} 1px, transparent 1px)`, backgroundSize: '32px 32px' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, bgcolor: '#fff', px: 2, py: 1.25, borderRadius: radius.md, boxShadow: shadow.md }}>
                  <MapIcon sx={{ color: colors.redText }} />
                  <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Supreme Cash &amp; Carry</Typography>
                </Box>
              </Box>
              <Box sx={{ p: { xs: 2, md: 2.5 } }}>
                <Typography component="h2" variant="h3">Visit our cash &amp; carry</Typography>
                <Typography sx={{ color: colors.ink700, mt: 0.75, display: 'flex', gap: 1 }}><MapPinIcon sx={{ fontSize: 20, color: colors.ink500 }} /> 3750A Laird Road, Unit 9, Mississauga, ON L5L 0A2</Typography>
                <Typography sx={{ color: colors.ink700, mt: 0.5, display: 'flex', gap: 1 }}><ClockIcon sx={{ fontSize: 20, color: colors.ink500 }} /> Mon–Sat, 9am–6pm</Typography>
                <Box component="ol" sx={{ m: 0, mt: 2, pl: 2.5, color: colors.ink700, fontSize: 14.5, '& li': { mb: 0.5 } }}>
                  <li>Walk in and explore thousands of products</li>
                  <li>Pick what your business needs, at wholesale prices</li>
                  <li>Check out and take it with you — ideal for urgent restocks</li>
                </Box>
                <Button component="a" href={MAPS} target="_blank" rel="noopener noreferrer" variant="outlined" startIcon={<DirectionsIcon />} sx={{ mt: 2 }}>Get directions</Button>
              </Box>
            </Box>
            <Box sx={{ p: { xs: 2, md: 2.5 }, borderRadius: radius.xl, bgcolor: colors.subtle }}>
              <Typography component="h2" variant="h4">Four ways to order</Typography>
              <Box component="ul" sx={{ m: 0, mt: 1, pl: 2.5, color: colors.ink700, fontSize: 14.5, '& li': { mb: 0.5 } }}>
                <li>Online anytime at mysupreme.ca</li>
                <li>On the MySupreme app — fast reordering</li>
                <li>With a dedicated sales representative</li>
                <li>In person at the cash &amp; carry</li>
              </Box>
              <Typography sx={{ fontSize: 14, color: colors.ink600, mt: 1.5 }}>Delivery across the GTA, Hamilton &amp; Niagara. <Box component={Link} href="/#delivery" sx={{ color: colors.redText, fontWeight: 600 }}>Check your postal code</Box></Typography>
            </Box>
          </Box>
        </Box>
      </Section>

      <Section id="contact-faq" band="subtle" labelledBy="faq-title">
        <HomeFAQ faqs={faqs} contactLink={false} />
      </Section>
    </>
  )
}
