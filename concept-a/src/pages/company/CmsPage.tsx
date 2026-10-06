import { useEffect, useState } from 'react'
import { Box, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'
import { tokens } from '../../theme'
import { contact } from '../../data/catalog'
import { Container } from '../../components/ui'
import { PageTitle } from '../../components/Shared'

const c = tokens.color

const titles: Record<string, string> = {
  'privacy-policy': 'Privacy Policy',
  terms: 'Terms & Uses',
  'safety-security': 'Safety & Security',
}

const sections = [
  { id: 'overview', h: 'Overview', p: ['This page explains how MySupreme Food Service Inc. (“MySupreme”, “we”) handles the information you share with us when you open a business account, order online, use our iOS or Android app, or shop at our Mississauga cash & carry.', 'It applies to mysupreme.ca, the MySupreme app and orders placed with your field sales rep.'] },
  { id: 'collect', h: 'Information we collect', p: ['Business details you give us: business name, business category and structure, HST number, contact name, email, phone and delivery addresses.', 'Order details: products, quantities, delivery windows, invoices and payments. Card details are processed by Stripe and never stored on our servers.'] },
  { id: 'use', h: 'How we use it', p: ['To deliver your orders on scheduled routes across the GTA, Hamilton and Niagara, to manage credit terms and statements, and to show you business pricing for your customer group.', 'With your consent, to send the weekly hot picks and monthly flyer. You can unsubscribe at any time.'] },
  { id: 'share', h: 'Sharing', p: ['We share only what is needed with service providers that help us run the business — payment processing, delivery routing, search and customer support chat. We never sell your information.'] },
  { id: 'security', h: 'Security', p: ['Accounts are protected by password and session controls; payment pages are hosted by Stripe; access to customer data is limited to staff who need it for your orders.'] },
  { id: 'rights', h: 'Your choices', p: ['You can update business and contact details in My Account, delete saved addresses and cards, or ask us to close your account. Some records (invoices, tax) are kept as required by law.'] },
  { id: 'contact', h: 'Contact us', p: [`Questions? Email ${contact.email} or call ${contact.phone} (${contact.hours}).`] },
]

/** Long-form CMS template (Magento CMS page). Sticky table of contents on desktop, 70ch measure. */
export default function CmsPage() {
  const { slug = '' } = useParams()
  const title = titles[slug] ?? slug.split('-').map((w) => w[0]?.toUpperCase() + w.slice(1)).join(' ')
  const [active, setActive] = useState('overview')
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-200px 0px -60% 0px' })
    sections.forEach((s) => { const el = document.getElementById(s.id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [slug])
  return (
    <Container>
      <PageTitle crumbs={[{ label: title }]} title={title} subtitle="Last updated September 15, 2026" />
      <Box sx={{ display: { xs: 'block', lg: 'none' }, mb: 3 }}>
        <TextField select fullWidth label="Jump to section" value={active} onChange={(e) => { document.getElementById(e.target.value)?.scrollIntoView({ behavior: 'smooth' }) }}>
          {sections.map((s) => <MenuItem key={s.id} value={s.id}>{s.h}</MenuItem>)}
        </TextField>
      </Box>
      <Box sx={{ display: 'grid', gap: 6, gridTemplateColumns: { xs: '1fr', lg: '260px minmax(0,1fr)' }, alignItems: 'start' }}>
        <Box component="nav" aria-label="On this page" sx={{ display: { xs: 'none', lg: 'block' }, position: 'sticky', top: 220 }}>
          <Typography variant="overline" sx={{ color: c.text3 }}>On this page</Typography>
          <Stack sx={{ mt: 1, borderLeft: `2px solid ${c.line}` }}>
            {sections.map((s) => (
              <Box key={s.id} component="a" href={`#/page/${slug}`} onClick={(e: React.MouseEvent) => { e.preventDefault(); document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' }) }}
                sx={{ py: 1, pl: 2, ml: '-2px', fontSize: 14, textDecoration: 'none', borderLeft: `2px solid ${active === s.id ? c.red : 'transparent'}`, color: active === s.id ? c.red : c.text2, fontWeight: active === s.id ? 600 : 400, '&:hover': { color: c.ink } }}>
                {s.h}
              </Box>
            ))}
          </Stack>
        </Box>
        <Box component="article" sx={{ maxWidth: '70ch', bgcolor: '#fff', border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.lg}px`, p: { xs: 2.5, md: 5 } }}>
          {sections.map((s, i) => (
            <Box key={s.id} id={s.id} component="section" sx={{ scrollMarginTop: 200, mt: i ? 4 : 0 }}>
              <Typography variant="h3" component="h2" sx={{ mb: 1.5 }}>{i + 1}. {s.h}</Typography>
              {s.p.map((t, j) => <Typography key={j} sx={{ color: c.text2, fontSize: 16, lineHeight: 1.75, mb: 1.5 }}>{t}</Typography>)}
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  )
}
