import { useState } from 'react'
import { Alert, Box, Button, Checkbox, CircularProgress, FormControlLabel, MenuItem, Stack, TextField, Typography } from '@mui/material'
import StorefrontOutlined from '@mui/icons-material/StorefrontOutlined'
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined'
import PaymentsOutlined from '@mui/icons-material/PaymentsOutlined'
import InsightsOutlined from '@mui/icons-material/InsightsOutlined'
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded'
import { tokens } from '../../theme'
import { departments, photo } from '../../data/catalog'
import { Container, Panel, SectionHeader } from '../../components/ui'
import { CompanyHero, FeatureCard, FileDrop, FormSuccess } from './parts/CompanyParts'

const c = tokens.color

const props = [
  { icon: <StorefrontOutlined />, title: 'Reach 3,000+ kitchens', body: 'Restaurants, cafés and caterers across the GTA, Hamilton and Niagara order from us every week.' },
  { icon: <LocalShippingOutlined />, title: 'We handle the last mile', body: 'Deliver to one dock in Mississauga. Our cold-chain routes take it from there.' },
  { icon: <PaymentsOutlined />, title: 'Reliable payment terms', body: 'Clear purchase orders and on-time payment on agreed terms.' },
  { icon: <InsightsOutlined />, title: 'Shelf + online + app', body: 'Your products in the cash & carry, on mysupreme.ca and in our iOS/Android app.' },
]

const steps = ['Apply with your catalogue', 'Category manager review (5 business days)', 'Samples & pricing call', 'Listed online and in-store']

export default function Supplier() {
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [err, setErr] = useState<Record<string, string>>({})
  const [v, setV] = useState({ company: '', contact: '', email: '', phone: '', category: '', products: '', website: '', volume: '', agree: false })
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement>) => setV({ ...v, [k]: e.target.value })
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const er: Record<string, string> = {}
    if (!v.company) er.company = 'Enter your company name'
    if (!v.contact) er.contact = 'Enter a contact name'
    if (!/^\S+@\S+\.\S+$/.test(v.email)) er.email = 'Enter a valid email'
    if (!v.category) er.category = 'Choose a department'
    if (!v.agree) er.agree = 'Please confirm to continue'
    setErr(er)
    if (Object.keys(er).length) return
    setState('sending')
    window.setTimeout(() => setState('sent'), 900)
  }
  return (
    <Box>
      <CompanyHero
        crumbs={[{ label: 'Become a supplier' }]}
        eyebrow="Become a supplier"
        title="Put your products in front of Ontario’s busiest kitchens."
        body="We’re always looking for food-service brands, local producers and packaging manufacturers who can supply consistently at volume."
        image={photo('flatlay', 1800)}
        actions={<Button variant="contained" size="large" href="#apply">Apply now</Button>}
      />
      <Container sx={{ mt: { xs: 5, md: 8 } }}>
        <SectionHeader eyebrow="Why partner with us" title="A wholesale channel that sells for you" />
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4,1fr)' } }}>
          {props.map((p) => <FeatureCard key={p.title} {...p} />)}
        </Box>
      </Container>
      <Container sx={{ mt: { xs: 5, md: 8 } }}>
        <Box id="apply" sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: '1fr 1.6fr' }, alignItems: 'start', scrollMarginTop: 180 }}>
          <Box sx={{ position: { lg: 'sticky' }, top: 200 }}>
            <Typography variant="overline" sx={{ color: c.red }}>How it works</Typography>
            <Typography variant="h2" sx={{ mt: 0.5, mb: 3 }}>From application to shelf</Typography>
            <Stack spacing={0}>
              {steps.map((s, i) => (
                <Stack key={s} direction="row" spacing={2} sx={{ pb: i < steps.length - 1 ? 3 : 0, position: 'relative' }}>
                  {i < steps.length - 1 && <Box sx={{ position: 'absolute', left: 17, top: 38, bottom: 4, width: 2, bgcolor: c.line }} />}
                  <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: c.navy, color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700, flexShrink: 0 }}>{i + 1}</Box>
                  <Typography sx={{ fontWeight: 600, pt: 0.75 }}>{s}</Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
          <Panel sx={{ p: { xs: 2.5, md: 4 } }}>
            {state === 'sent' ? (
              <FormSuccess title="Application received — ref SUP-0193" body={`Thanks, ${v.company}. A category manager will email ${v.email} within 5 business days.`} onReset={() => setState('idle')} />
            ) : (
              <Box component="form" noValidate onSubmit={submit}>
                <Typography variant="h3" sx={{ mb: 3 }}>Supplier application</Typography>
                {Object.keys(err).length > 0 && <Alert severity="error" sx={{ mb: 2.5 }}>Some details are missing — check the highlighted fields.</Alert>}
                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                  <TextField label="Company name *" value={v.company} onChange={set('company')} error={!!err.company} helperText={err.company} />
                  <TextField label="Contact name *" value={v.contact} onChange={set('contact')} error={!!err.contact} helperText={err.contact} />
                  <TextField label="Work email *" type="email" value={v.email} onChange={set('email')} error={!!err.email} helperText={err.email} />
                  <TextField label="Phone" type="tel" value={v.phone} onChange={set('phone')} />
                  <TextField select label="Department *" value={v.category} onChange={set('category')} error={!!err.category} helperText={err.category}>
                    {departments.map((d) => <MenuItem key={d.id} value={d.name}>{d.name}</MenuItem>)}
                  </TextField>
                  <TextField select label="Monthly capacity" value={v.volume} onChange={set('volume')}>
                    {['Under 100 cases', '100–500 cases', '500–2,000 cases', '2,000+ cases'].map((x) => <MenuItem key={x} value={x}>{x}</MenuItem>)}
                  </TextField>
                  <TextField label="Website" value={v.website} onChange={set('website')} placeholder="https://" sx={{ gridColumn: { sm: '1 / -1' } }} />
                  <TextField label="Products you’d like to list" multiline minRows={4} value={v.products} onChange={set('products')} placeholder="e.g. Halal chicken breast 4x2 kg, frozen naan 6x5 pcs…" sx={{ gridColumn: { sm: '1 / -1' } }} />
                  <Box sx={{ gridColumn: { sm: '1 / -1' } }}><FileDrop label="Product catalogue or price list" hint="PDF, XLSX or CSV · up to 20 MB" accept=".pdf,.xlsx,.csv" /></Box>
                  <Box sx={{ gridColumn: { sm: '1 / -1' } }}>
                    <FormControlLabel control={<Checkbox checked={v.agree} onChange={(e) => setV({ ...v, agree: e.target.checked })} />} label="I confirm our products meet CFIA labelling and food-safety requirements." />
                    {err.agree && <Typography sx={{ color: c.error, fontSize: 12, ml: 4 }}>{err.agree}</Typography>}
                  </Box>
                </Box>
                <Button type="submit" variant="contained" size="large" disabled={state === 'sending'} startIcon={state === 'sending' ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : <CheckCircleRounded />} sx={{ mt: 2, '&.Mui-disabled': { bgcolor: c.red, color: '#fff', opacity: 0.8 } }}>
                  {state === 'sending' ? 'Submitting…' : 'Submit application'}
                </Button>
              </Box>
            )}
          </Panel>
        </Box>
      </Container>
    </Box>
  )
}
