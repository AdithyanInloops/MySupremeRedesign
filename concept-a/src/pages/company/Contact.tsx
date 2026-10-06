import { useState } from 'react'
import { Alert, Box, Button, CircularProgress, MenuItem, Stack, TextField, Typography } from '@mui/material'
import WhatsApp from '@mui/icons-material/WhatsApp'
import MailOutlineRounded from '@mui/icons-material/MailOutlineRounded'
import PlaceOutlined from '@mui/icons-material/PlaceOutlined'
import ScheduleRounded from '@mui/icons-material/ScheduleRounded'
import SendRounded from '@mui/icons-material/SendRounded'
import { tokens } from '../../theme'
import { contact, photo } from '../../data/catalog'
import { Container, Panel } from '../../components/ui'
import { CompanyHero, FileDrop, FormSuccess } from './parts/CompanyParts'
import { MapPlaceholder } from './About'

const c = tokens.color

const cards = [
  { icon: <WhatsApp />, title: 'Call or WhatsApp', value: contact.phone, href: 'https://wa.me/13657770999', note: 'Fastest for order changes' },
  { icon: <MailOutlineRounded />, title: 'Email sales', value: contact.email, href: `mailto:${contact.email}`, note: 'Quotes & bulk pricing' },
  { icon: <PlaceOutlined />, title: 'Warehouse', value: '3750A Laird Road, Unit 9', href: 'https://maps.google.com/?q=3750A+Laird+Road+Mississauga', note: 'Mississauga, ON' },
  { icon: <ScheduleRounded />, title: 'Hours', value: contact.hours, note: 'Closed Sundays & stat holidays' },
]

const topics = ['Place or change an order', 'Delivery question', 'Account & credit terms', 'Pricing / quote request', 'Product request', 'Something else']

type Errors = Partial<Record<'name' | 'email' | 'topic' | 'message', string>>

export default function Contact() {
  const [v, setV] = useState({ name: '', business: '', email: '', phone: '', topic: '', message: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle')
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement>) => setV({ ...v, [k]: e.target.value })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const er: Errors = {}
    if (!v.name.trim()) er.name = 'Enter your name'
    if (!/^\S+@\S+\.\S+$/.test(v.email)) er.email = 'Enter a valid email, e.g. chef@yourkitchen.ca'
    if (!v.topic) er.topic = 'Choose a topic'
    if (v.message.trim().length < 10) er.message = 'Tell us a little more (10+ characters)'
    setErrors(er)
    if (Object.keys(er).length) return
    setState('sending')
    window.setTimeout(() => setState('sent'), 900)
  }

  return (
    <Box>
      <CompanyHero
        crumbs={[{ label: 'Contact' }]}
        eyebrow="24x7 Customer Care"
        title="Talk to a real person"
        body="Our counter team answers calls and WhatsApp Mon–Sat 9am–6pm. Outside those hours, chat with us using the bubble — we reply first thing."
        image={photo('cafe', 1800)}
      />
      <Container sx={{ mt: { xs: -3, md: -5 }, position: 'relative' }}>
        <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4,1fr)' } }}>
          {cards.map((k) => (
            <Box key={k.title} component={k.href ? 'a' : 'div'} href={k.href}
              sx={{ display: 'flex', gap: 1.5, p: 2.5, bgcolor: '#fff', border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.lg}px`, color: c.ink, textDecoration: 'none', boxShadow: tokens.shadow.card, transition: 'box-shadow .2s', '&:hover': k.href ? { boxShadow: tokens.shadow.hover } : {} }}>
              <Box sx={{ width: 44, height: 44, flexShrink: 0, borderRadius: `${tokens.radius.sm}px`, bgcolor: c.redTint, color: c.red, display: 'grid', placeItems: 'center' }}>{k.icon}</Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: 12.5, color: c.text3, fontWeight: 600 }}>{k.title}</Typography>
                <Typography sx={{ fontWeight: 700, fontSize: 15, overflowWrap: 'anywhere' }}>{k.value}</Typography>
                <Typography variant="caption" color="text.secondary">{k.note}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>

      <Container sx={{ mt: { xs: 4, md: 6 } }}>
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: '1.4fr 1fr' }, alignItems: 'start' }}>
          <Panel sx={{ p: { xs: 2.5, md: 4 } }}>
            {state === 'sent' ? (
              <FormSuccess title="Message sent — ticket #CS-48213" body={`Thanks ${v.name.split(' ')[0]}. We’ll reply to ${v.email} within one business hour (Mon–Sat 9am–6pm).`} onReset={() => { setState('idle'); setV({ name: '', business: '', email: '', phone: '', topic: '', message: '' }) }} />
            ) : (
              <Box component="form" noValidate onSubmit={submit}>
                <Typography variant="h3" sx={{ mb: 0.5 }}>Send us a message</Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>Fields marked * are required.</Typography>
                {Object.keys(errors).length > 0 && <Alert severity="error" sx={{ mb: 2.5 }}>Please fix {Object.keys(errors).length} field{Object.keys(errors).length > 1 ? 's' : ''} below.</Alert>}
                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                  <TextField label="Your name *" value={v.name} onChange={set('name')} error={!!errors.name} helperText={errors.name} autoComplete="name" />
                  <TextField label="Business name" value={v.business} onChange={set('business')} placeholder="e.g. Spice Route Kitchen" autoComplete="organization" />
                  <TextField label="Email *" type="email" value={v.email} onChange={set('email')} error={!!errors.email} helperText={errors.email} autoComplete="email" />
                  <TextField label="Phone" type="tel" value={v.phone} onChange={set('phone')} autoComplete="tel" placeholder="+1 905-555-0182" />
                  <TextField select label="Topic *" value={v.topic} onChange={set('topic')} error={!!errors.topic} helperText={errors.topic} sx={{ gridColumn: { sm: '1 / -1' } }}>
                    {topics.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                  </TextField>
                  <TextField label="Message *" multiline minRows={5} value={v.message} onChange={set('message')} error={!!errors.message} helperText={errors.message ?? 'Include order number or SKU if you have one'} sx={{ gridColumn: { sm: '1 / -1' } }} />
                  <Box sx={{ gridColumn: { sm: '1 / -1' } }}><FileDrop label="Attachment (optional)" hint="Photo of a damaged case, invoice or label · up to 10 MB" /></Box>
                </Box>
                <Button type="submit" variant="contained" size="large" disabled={state === 'sending'} startIcon={state === 'sending' ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : <SendRounded />} sx={{ mt: 3, '&.Mui-disabled': { bgcolor: c.red, color: '#fff', opacity: 0.8 } }}>
                  {state === 'sending' ? 'Sending…' : 'Send message'}
                </Button>
              </Box>
            )}
          </Panel>
          <Stack spacing={2}>
            <Box sx={{ borderRadius: `${tokens.radius.lg}px`, overflow: 'hidden', border: `1px solid ${c.line}` }}><MapPlaceholder /></Box>
            <Panel>
              <Typography variant="h5" sx={{ mb: 1 }}>Already a customer?</Typography>
              <Typography variant="body2" color="text.secondary">Your account rep and order history are in My Account → Orders. For a missed delivery, WhatsApp us your order number for the fastest fix.</Typography>
            </Panel>
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}
