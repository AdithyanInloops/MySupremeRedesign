import { useRef, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Box, Button, Checkbox, CircularProgress, FormControlLabel, Typography } from '@mui/material'
import { departments } from '../../lib/data'
import { emailError, phoneError } from '../../lib/validate'
import { colors, radius } from '../../lib/theme'
import PageHeader from '../ui/PageHeader'
import { PageContainer } from '../ui/Section'
import Field from '../ui/Field'
import { AlertCircleIcon, ChartIcon, CheckCircleIcon, HandshakeIcon, StoreIcon, TruckIcon } from '../ui/icons'

const perks = [
  { icon: StoreIcon, title: 'Reach 1,000s of kitchens', text: 'Restaurants, cafés, caterers and retailers across Ontario' },
  { icon: TruckIcon, title: 'We handle delivery', text: 'Daily cold-chain routes across the GTA, Hamilton & Niagara' },
  { icon: ChartIcon, title: 'Online, in-app and in-store', text: 'Listed on mysupreme.ca, the app and at our cash & carry' },
]

/** Become a supplier — a short application form (production: Magento contact/supplier form or CRM endpoint). */
export default function SupplierPage() {
  const [f, setF] = useState({ company: '', contact: '', email: '', phone: '', website: '', message: '' })
  const [cats, setCats] = useState<string[]>([])
  const [touched, setTouched] = useState(false)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const doneRef = useRef<HTMLDivElement>(null)
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value })
  const errors: Record<string, string> = {
    company: f.company.trim() ? '' : 'Enter your company name.',
    contact: f.contact.trim() ? '' : 'Enter your name.',
    email: emailError(f.email),
    phone: phoneError(f.phone),
    cats: cats.length ? '' : 'Choose at least one department you supply.',
  }
  const err = (k: string) => (touched ? errors[k] || undefined : undefined)
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)
    const first = Object.entries(errors).find(([, v]) => v)?.[0]
    if (first) return document.getElementById(`sp-${first}`)?.focus()
    setBusy(true)
    await new Promise((r) => setTimeout(r, 900))
    setBusy(false)
    setDone(true)
    window.requestAnimationFrame(() => doneRef.current?.focus())
  }

  return (
    <PageContainer sx={{ pb: { xs: 5, md: 9 } }}>
      <Head><title>Become a supplier | MySupreme</title></Head>
      <PageHeader breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Become a supplier' }]} eyebrow="Partner with us" title="Become a supplier" description="Sell your products to restaurants, cafés, caterers and foodservice businesses across the GTA, Hamilton and Niagara through MySupreme." />
      <Box sx={{ display: 'grid', gap: { xs: 3, md: 5 }, gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'minmax(0,1fr) minmax(0,1.3fr)' }, alignItems: 'start' }}>
        <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {perks.map((p) => {
            const Icon = p.icon
            return (
              <Box component="li" key={p.title} sx={{ display: 'flex', gap: 1.75 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: colors.redTint, color: colors.redText, display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon /></Box>
                <Box><Typography sx={{ fontWeight: 600, fontSize: 16 }}>{p.title}</Typography><Typography sx={{ color: colors.ink600, fontSize: 14.5 }}>{p.text}</Typography></Box>
              </Box>
            )
          })}
          <Box component="li" sx={{ p: 2.5, borderRadius: radius.lg, bgcolor: colors.subtle, display: 'flex', gap: 1.5 }}>
            <HandshakeIcon sx={{ color: colors.ink600 }} />
            <Typography sx={{ fontSize: 14.5, color: colors.ink700 }}>Our purchasing team reviews every application and replies within <b>3 business days</b>.</Typography>
          </Box>
        </Box>

        <Box sx={{ border: `1px solid ${colors.line}`, borderRadius: radius.xl, p: { xs: 2, md: 3.5 } }}>
          {done ? (
            <Box ref={doneRef} tabIndex={-1} role="status" sx={{ textAlign: 'center', py: 3, outline: 'none' }}>
              <CheckCircleIcon sx={{ fontSize: 56, color: colors.success }} />
              <Typography variant="h2" component="h2" sx={{ mt: 1 }}>Application sent</Typography>
              <Typography sx={{ color: colors.ink600, mt: 1 }}>Thanks, {f.contact.split(' ')[0]}. Our purchasing team will contact you at {f.email} within 3 business days.</Typography>
              <Button component={Link} href="/" variant="outlined" sx={{ mt: 3 }}>Back to the store</Button>
            </Box>
          ) : (
            <Box component="form" noValidate onSubmit={submit} sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: 'minmax(0,1fr)', sm: 'minmax(0,1fr) minmax(0,1fr)' } }}>
              <Typography component="h2" variant="h3" sx={{ gridColumn: '1 / -1' }}>Tell us about your products</Typography>
              <Box sx={{ gridColumn: '1 / -1' }}><Field id="sp-company" label="Company name" autoComplete="organization" value={f.company} onChange={set('company')} error={err('company')} /></Box>
              <Field id="sp-contact" label="Your name" autoComplete="name" value={f.contact} onChange={set('contact')} error={err('contact')} />
              <Field id="sp-phone" label="Phone" type="tel" autoComplete="tel" value={f.phone} onChange={set('phone')} error={err('phone')} />
              <Field id="sp-email" label="Email" type="email" autoComplete="email" value={f.email} onChange={set('email')} error={err('email')} />
              <Field id="sp-website" label="Website" optional autoComplete="url" value={f.website} onChange={set('website')} placeholder="https://" />
              <Box component="fieldset" sx={{ gridColumn: '1 / -1', border: 0, p: 0, m: 0 }} aria-describedby={err('cats') ? 'sp-cats-error' : undefined}>
                <Box component="legend" id="sp-cats" tabIndex={-1} sx={{ fontSize: 14, fontWeight: 500, mb: 0.75, outline: 'none' }}>Departments you supply</Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr) minmax(0,1fr)', sm: 'repeat(3, minmax(0,1fr))' } }}>
                  {departments.map((d) => (
                    <FormControlLabel key={d.uid} control={<Checkbox size="small" checked={cats.includes(d.url_key)} onChange={() => setCats((c) => (c.includes(d.url_key) ? c.filter((x) => x !== d.url_key) : [...c, d.url_key]))} />} label={<Typography sx={{ fontSize: 14 }}>{d.name}</Typography>} />
                  ))}
                </Box>
                {err('cats') && <Typography id="sp-cats-error" sx={{ display: 'flex', gap: 0.5, fontSize: 13, color: colors.error }}><AlertCircleIcon sx={{ fontSize: 16, mt: '1px' }} /> {err('cats')}</Typography>}
              </Box>
              <Box sx={{ gridColumn: '1 / -1' }}><Field id="sp-message" label="Products and brands" optional multiline minRows={3} value={f.message} onChange={set('message')} placeholder="What you make or distribute, pack sizes, certifications…" /></Box>
              <Button type="submit" variant="contained" size="large" disabled={busy} startIcon={busy ? <CircularProgress size={18} sx={{ color: 'inherit' }} /> : undefined} sx={{ gridColumn: '1 / -1' }}>
                {busy ? 'Sending…' : 'Send application'}
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </PageContainer>
  )
}
