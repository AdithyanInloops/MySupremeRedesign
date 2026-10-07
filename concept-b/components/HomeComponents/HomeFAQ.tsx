import { useState } from 'react'
import Link from 'next/link'
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Typography } from '@mui/material'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import { colors } from '../../lib/theme'
import { PHONE, PHONE_HREF, WHATSAPP_HREF } from '../Layout/Header'

/*
 * Quick answers (CMS block). Cut-off, minimum and returns wording are prototype copy — confirm with operations.
 */

export type Faq = { q: string; a: string }

export const defaultFaqs: Faq[] = [
  { q: 'Where do you deliver?', a: 'We deliver daily across the GTA, Hamilton and the Niagara Region on scheduled cold-chain routes. Outside those areas you can pick up from our Mississauga cash & carry warehouse.' },
  { q: 'What is the order cut-off for next-day delivery?', a: 'Orders placed by 2 PM are delivered on the next route day. Same-day delivery is available on selected routes — your rep can confirm yours.' },
  { q: 'Is there a delivery minimum?', a: 'Delivery is available on orders of $350 or more. Smaller orders can be picked up at the warehouse.' },
  { q: 'Do I need a business account to order?', a: 'You can browse and order as a guest, but a business account gives you customer-group pricing, credit terms and faster checkout.' },
  { q: 'What is your returns policy?', a: 'If something arrives damaged or isn’t right, contact us within 48 hours and we’ll replace or credit it — perishables are checked on delivery.' },
  { q: 'Can I pick up my order instead?', a: 'Yes — walk in or pick up at 3750A Laird Road, Unit 9, Mississauga, Mon–Sat 9am–6pm.' },
]

export default function HomeFAQ({ faqs = defaultFaqs, contactLink = true }: { faqs?: Faq[]; contactLink?: boolean }) {
  const [open, setOpen] = useState<number | false>(0)
  return (
    <Box sx={{ display: 'grid', gap: { xs: 2.5, lg: 6 }, gridTemplateColumns: { xs: 'minmax(0,1fr)', lg: '360px minmax(0,1fr)' }, alignItems: 'start' }}>
      <Box>
        <Typography variant="overline" component="p" sx={{ color: colors.redText }}>Need help?</Typography>
        <Typography id="faq-title" component="h2" variant="h2" sx={{ mt: 0.5 }}>Quick answers</Typography>
        <Typography sx={{ color: colors.ink600, mt: 1, mb: 2.5 }}>Can’t find what you need? Our team answers Mon–Sat, 9am–6pm.</Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button component="a" href={PHONE_HREF} variant="outlined" startIcon={<PhoneOutlinedIcon />}>{PHONE}</Button>
          <Button component="a" href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" variant="outlined" startIcon={<WhatsAppIcon />}>WhatsApp</Button>
          {contactLink && <Button component={Link} href="/service/contact-us" color="primary">Contact us</Button>}
        </Box>
      </Box>
      <Box>
        {faqs.map((f, i) => (
          <Accordion key={f.q} expanded={open === i} onChange={(_, isOpen) => setOpen(isOpen ? i : false)}>
            <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />} id={`faq-${i}-header`} aria-controls={`faq-${i}-content`}>
              <Typography component="h3" sx={{ fontSize: 15, fontWeight: 600 }}>{f.q}</Typography>
            </AccordionSummary>
            <AccordionDetails>{f.a}</AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  )
}
