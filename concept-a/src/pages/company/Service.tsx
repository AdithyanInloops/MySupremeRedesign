import { useState } from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button, Checkbox, FormControlLabel, InputBase, Stack, TextField, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import SearchRounded from '@mui/icons-material/SearchRounded'
import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded'
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined'
import ReceiptLongOutlined from '@mui/icons-material/ReceiptLongOutlined'
import CreditCardOutlined from '@mui/icons-material/CreditCardOutlined'
import AssignmentReturnOutlined from '@mui/icons-material/AssignmentReturnOutlined'
import ManageAccountsOutlined from '@mui/icons-material/ManageAccountsOutlined'
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined'
import WhatsApp from '@mui/icons-material/WhatsApp'
import ChatBubbleOutlineRounded from '@mui/icons-material/ChatBubbleOutlineRounded'
import MailOutlineRounded from '@mui/icons-material/MailOutlineRounded'
import MarkEmailReadOutlined from '@mui/icons-material/MarkEmailReadOutlined'
import { tokens } from '../../theme'
import { contact } from '../../data/catalog'
import { Container, Panel, SectionHeader } from '../../components/ui'
import { Breadcrumbs } from '../../components/Shared'

const c = tokens.color

const topics = [
  { icon: <LocalShippingOutlined />, t: 'Delivery & areas', d: 'Routes, cut-offs, cold-chain' },
  { icon: <ReceiptLongOutlined />, t: 'Orders & reorder', d: 'Track, change, cancel' },
  { icon: <CreditCardOutlined />, t: 'Payments & credit', d: 'Terms, invoices, statements' },
  { icon: <AssignmentReturnOutlined />, t: 'Returns & credits', d: 'Damaged or missing items' },
  { icon: <ManageAccountsOutlined />, t: 'Your account', d: 'Business info, users, password' },
  { icon: <Inventory2Outlined />, t: 'Products & pack sizes', d: 'Cases, SKUs, substitutions' },
]

const faqs = [
  { q: 'Which areas do you deliver to?', a: 'We deliver across the GTA, the GTHA (including Hamilton, Burlington and Halton) and the Niagara Region (St. Catharines, Niagara Falls, Welland). Addresses outside these areas can still order for pickup at our Mississauga cash & carry.' },
  { q: 'What is the order cut-off for next-day delivery?', a: 'Orders placed by 2 PM are delivered the next business day on your scheduled route. Same-day delivery is available in Peel and West GTA for orders placed before 10 AM. (Per-route cut-off times are shown in the header once the cut-off feature ships.)' },
  { q: 'How do credit terms work?', a: 'Approved business accounts get a credit limit and payment terms (typically Net 15 or Net 30). Your available credit, outstanding and overdue balances are always visible in My Account → Credit dashboard, and invoices download as PDF.' },
  { q: 'Something arrived damaged or missing — what do I do?', a: 'Tell the driver, or WhatsApp us a photo within 24 hours with your order number. We’ll issue a credit note to your account or send a replacement on the next route.' },
  { q: 'Can I return products?', a: 'Unopened dry goods and packaging can be returned within 7 days. Fresh, frozen, dairy and meat can’t be returned unless they arrive damaged or out of temperature.' },
  { q: 'Is there a minimum order?', a: 'Free delivery starts at $250 per order. Below that a $15 delivery fee applies. There’s no minimum for cash & carry walk-in.' },
]

export default function Service() {
  const [q, setQ] = useState('')
  const [email, setEmail] = useState('')
  const [nl, setNl] = useState<'idle' | 'error' | 'done'>('idle')
  const shown = faqs.filter((f) => !q || (f.q + f.a).toLowerCase().includes(q.toLowerCase()))
  return (
    <Box>
      <Box sx={{ bgcolor: c.navyTint, borderBottom: `1px solid ${c.line}` }}>
        <Container sx={{ py: { xs: 4, md: 7 }, textAlign: { md: 'center' } }}>
          <Breadcrumbs items={[{ label: 'Online help' }]} sx={{ mb: 2, '& ol': { justifyContent: { md: 'center' } } }} />
          <Typography variant="overline" sx={{ color: c.red }}>Help centre</Typography>
          <Typography variant="h1" sx={{ mt: 0.5 }}>How can we help your kitchen?</Typography>
          <Box component="form" onSubmit={(e) => e.preventDefault()} sx={{ mt: 3, mx: 'auto', maxWidth: 640, display: 'flex', alignItems: 'center', bgcolor: '#fff', border: `2px solid ${c.line2}`, borderRadius: `${tokens.radius.md}px`, px: 1.5, height: 56, '&:focus-within': { borderColor: c.navy } }}>
            <SearchRounded sx={{ color: c.text3, mr: 1 }} />
            <InputBase value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search help — e.g. cut-off, credit, returns" inputProps={{ 'aria-label': 'Search help articles' }} sx={{ flex: 1 }} />
          </Box>
        </Container>
      </Box>

      <Container sx={{ mt: { xs: 4, md: 6 } }}>
        <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(3,1fr)', xl: 'repeat(6,1fr)' } }}>
          {topics.map((t) => (
            <Box key={t.t} component="button" onClick={() => setQ(t.t.split(' ')[0])} sx={{ textAlign: 'left', font: 'inherit', cursor: 'pointer', p: 2, bgcolor: '#fff', border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.lg}px`, transition: 'box-shadow .2s, transform .2s', '&:hover': { boxShadow: tokens.shadow.hover, transform: 'translateY(-2px)' }, '&:focus-visible': { outline: `3px solid ${c.navy}` } }}>
              <Box sx={{ color: c.red, mb: 1 }}>{t.icon}</Box>
              <Typography sx={{ fontWeight: 700, fontSize: 14.5 }}>{t.t}</Typography>
              <Typography variant="caption" color="text.secondary">{t.d}</Typography>
            </Box>
          ))}
        </Box>
      </Container>

      <Container sx={{ mt: { xs: 5, md: 8 } }}>
        <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: { xs: '1fr', lg: '1.6fr 1fr' }, alignItems: 'start' }}>
          <Box>
            <SectionHeader eyebrow="Frequently asked" title={q ? `Results for “${q}”` : 'Top questions'} />
            {shown.length === 0 && <Alert severity="info">No articles match “{q}”. Try “delivery” or contact us below.</Alert>}
            {shown.map((f, i) => (
              <Accordion key={f.q} defaultExpanded={i === 0} disableGutters sx={{ border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.md}px !important`, mb: 1.25, '&::before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ExpandMoreRounded />} sx={{ minHeight: 60, '& .MuiAccordionSummary-content': { my: 1.5 } }}>
                  <Typography sx={{ fontWeight: 600 }}>{f.q}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0 }}><Typography color="text.secondary">{f.a}</Typography></AccordionDetails>
              </Accordion>
            ))}
          </Box>
          <Stack spacing={2}>
            <Panel>
              <Typography variant="h4" sx={{ mb: 2 }}>Still need help?</Typography>
              <Stack spacing={1.25}>
                <Button fullWidth variant="contained" startIcon={<WhatsApp />} href="https://wa.me/13657770999" sx={{ justifyContent: 'flex-start' }}>WhatsApp {contact.phone}</Button>
                <Button fullWidth variant="outlined" color="secondary" startIcon={<ChatBubbleOutlineRounded />} sx={{ justifyContent: 'flex-start' }}>Chat with us (bottom-right)</Button>
                <Button fullWidth variant="outlined" color="secondary" startIcon={<MailOutlineRounded />} component={RouterLink} to="/contact" sx={{ justifyContent: 'flex-start' }}>Send a message</Button>
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>{contact.hours}</Typography>
            </Panel>
            <Panel sx={{ bgcolor: c.navy, borderColor: c.navy, color: '#fff' }} id="newsletter">
              <MarkEmailReadOutlined sx={{ color: c.saffron, fontSize: 32 }} />
              <Typography variant="h4" sx={{ color: '#fff', mt: 1 }}>Get the weekly hot picks</Typography>
              <Typography sx={{ opacity: 0.85, fontSize: 14, mt: 0.5, mb: 2 }}>One email every Monday: new flyer deals, price drops and new arrivals. No spam.</Typography>
              {nl === 'done' ? (
                <Alert severity="success">You’re subscribed — first email lands Monday.</Alert>
              ) : (
                <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); setNl(/^\S+@\S+\.\S+$/.test(email) ? 'done' : 'error') }}>
                  <TextField fullWidth label="Work email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={nl === 'error'} helperText={nl === 'error' ? 'Enter a valid email address' : ' '}
                    sx={{ '& .MuiInputLabel-root': { color: c.text2 }, '& .MuiFormHelperText-root': { color: nl === 'error' ? '#FFB4B4' : 'transparent' } }} />
                  <FormControlLabel control={<Checkbox defaultChecked sx={{ color: '#fff', '&.Mui-checked': { color: '#fff' } }} />} label={<Typography sx={{ fontSize: 13 }}>Also send me the monthly flyer</Typography>} />
                  <Button type="submit" fullWidth variant="contained" sx={{ mt: 1, bgcolor: '#fff', color: c.red, '&:hover': { bgcolor: c.redTint } }}>Subscribe</Button>
                </Box>
              )}
            </Panel>
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}
