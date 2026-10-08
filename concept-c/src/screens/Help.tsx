import { useState } from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material'
import { tokens } from '../theme'
import { contact } from '../data/catalog'
import { Group, ListRow, TopBar } from '../components/ui'
import { ChatIcon, ChevronDownIcon, DirectionsIcon, MailIcon, PhoneIcon, WhatsAppIcon } from '../components/icons'

const c = tokens.color
const faqs = [
  ['Where do you deliver?', 'Daily routes across the GTA, Hamilton and the Niagara Region. Outside those areas, pick up at our Mississauga cash & carry.'],
  ['What’s the cut-off for same-day delivery?', 'Order by 12 PM for same-day on most routes, or by 2 PM for next-day. The app shows the windows available for your address at checkout.'],
  ['Is there a delivery minimum?', 'Delivery is free on orders of $350 or more. Smaller orders can be picked up at the warehouse.'],
  ['How do I pay an invoice?', 'Account › Invoices & payments › Pay. Card payments are instant; EFT clears in 1–2 business days.'],
  ['Something arrived damaged — what now?', 'Open the order, tap Help and send a photo within 48 hours. We’ll replace it or issue a credit note.'],
]

export default function Help() {
  const [open, setOpen] = useState<number | false>(0)
  return (
    <Box sx={{ pb: 3 }}>
      <TopBar title="Help & contact" />
      <Box sx={{ px: 2, pt: 2 }}>
        <Typography component="h2" sx={{ fontSize: 20, fontWeight: 800 }}>How can we help?</Typography>
        <Typography sx={{ color: c.text2, fontSize: 14, mt: 0.25 }}>Our team answers {contact.hours}.</Typography>
      </Box>
      <Group sx={{ mt: 2 }}>
        <ListRow icon={ChatIcon} title="Chat with us" subtitle="Typical reply in 5 minutes" onClick={() => window.open('https://wa.me/13657770999', '_blank')} tone="navy" />
        <ListRow icon={WhatsAppIcon} title="WhatsApp" subtitle={contact.phone} onClick={() => window.open('https://wa.me/13657770999', '_blank')} tone="green" />
        <ListRow icon={PhoneIcon} title="Call sales & support" subtitle={contact.phone} onClick={() => { window.location.href = 'tel:+13657770999' }} tone="red" />
        <ListRow icon={MailIcon} title="Email" subtitle={contact.email} onClick={() => { window.location.href = `mailto:${contact.email}` }} />
        <ListRow icon={DirectionsIcon} title="Visit the cash & carry" subtitle={contact.address} onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=3750A+Laird+Road+Unit+9+Mississauga', '_blank')} tone="saffron" />
      </Group>
      <Box sx={{ px: 2, mt: 3 }}>
        <Typography variant="overline" component="h2" sx={{ color: c.text3 }}>Quick answers</Typography>
        <Box sx={{ mt: 0.75 }}>
          {faqs.map(([q, a], i) => (
            <Accordion key={q} disableGutters elevation={0} expanded={open === i} onChange={(_, v) => setOpen(v ? i : false)} sx={{ border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.md}px !important`, mb: 1, '&::before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ChevronDownIcon />} sx={{ minHeight: 54, px: 1.75, '& .MuiAccordionSummary-content': { my: 1.25 } }}>
                <Typography component="h3" sx={{ fontWeight: 600, fontSize: 14.5 }}>{q}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 1.75, pt: 0, pb: 1.75, color: c.text2, fontSize: 14, lineHeight: 1.55 }}>{a}</AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
