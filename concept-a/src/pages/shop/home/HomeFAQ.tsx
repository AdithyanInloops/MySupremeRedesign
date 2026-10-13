import { useState } from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded'
import PhoneOutlined from '@mui/icons-material/PhoneOutlined'
import WhatsApp from '@mui/icons-material/WhatsApp'
import { tokens } from '../../../theme'
import { contact } from '../../../data/catalog'
import { SectionHeader } from '../../../components/ui'

/* Quick answers (Concept B, CMS block). Cut-off, minimum and returns wording are prototype copy — confirm with operations. */

const c = tokens.color

const faqs = [
  { q: 'Where do you deliver?', a: 'We deliver daily across the GTA, Hamilton and the Niagara Region on scheduled cold-chain routes. Outside those areas you can pick up from our Mississauga cash & carry warehouse.' },
  { q: 'What is the order cut-off for next-day delivery?', a: 'Orders placed by 2 PM are delivered on the next route day. Same-day delivery is available on selected routes — your rep can confirm yours.' },
  { q: 'Is there a delivery minimum?', a: 'Delivery is available on orders of $350 or more. Smaller orders can be picked up at the warehouse.' },
  { q: 'Do I need a business account to order?', a: 'You can browse and order as a guest, but a business account gives you customer-group pricing, credit terms and faster checkout.' },
  { q: 'What is your returns policy?', a: 'If something arrives damaged or isn’t right, contact us within 48 hours and we’ll replace or credit it — perishables are checked on delivery.' },
  { q: 'Can I pick up my order instead?', a: 'Yes — walk in or pick up at 3750A Laird Road, Unit 9, Mississauga, Mon–Sat 9am–6pm.' },
]

const outlinedRed = { borderColor: c.red, color: c.red, '&:hover': { borderColor: c.redDark, bgcolor: c.redTint } }

export default function HomeFAQ() {
  const [open, setOpen] = useState<number | false>(0)
  return (
    <Box component="section" aria-labelledby="faq-title" sx={{ display: 'grid', gap: { xs: 2.5, lg: 6 }, gridTemplateColumns: { xs: 'minmax(0,1fr)', lg: '360px minmax(0,1fr)' }, alignItems: 'start' }}>
      <Box>
        <SectionHeader id="faq-title" eyebrow="Need help?" title="Quick answers" subtitle="Can’t find what you need? Our team answers Mon–Sat, 9am–6pm." />
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button component="a" href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`} variant="outlined" startIcon={<PhoneOutlined />} sx={outlinedRed}>{contact.phone}</Button>
          <Button component="a" href="https://wa.me/13657770999" target="_blank" rel="noopener noreferrer" variant="outlined" startIcon={<WhatsApp />} sx={outlinedRed}>WhatsApp</Button>
          <Button component={RouterLink} to="/contact" sx={{ color: c.red }}>Contact us</Button>
        </Box>
      </Box>
      <Box>
        {faqs.map((f, i) => (
          <Accordion
            key={f.q}
            disableGutters
            elevation={0}
            expanded={open === i}
            onChange={(_, isOpen) => setOpen(isOpen ? i : false)}
            sx={{ border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.md}px !important`, '&::before': { display: 'none' }, '& + &': { mt: 1 } }}
          >
            <AccordionSummary expandIcon={<ExpandMoreRounded />} id={`faq-${i}-header`} aria-controls={`faq-${i}-content`} sx={{ minHeight: 56, px: 2.25 }}>
              <Typography component="h3" sx={{ fontSize: 15, fontWeight: 600 }}>{f.q}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 2.25, pt: 0, pb: 2.25, color: c.text2, fontSize: 14.5, lineHeight: 1.6 }}>{f.a}</AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  )
}
