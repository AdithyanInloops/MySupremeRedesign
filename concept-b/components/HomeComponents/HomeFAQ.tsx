import { useState } from 'react'
import Link from 'next/link'
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'

/*
 * CONCEPT B — NEW SECTION #10 "Quick answers".
 * CMS content (Magento CMS block or Plasmic). Cut-off and minimum values are prototype copy — confirm with ops.
 */

const RED_AA = '#D50000'

export type Faq = { q: string; a: string }

export const defaultFaqs: Faq[] = [
  { q: 'Where do you deliver?', a: 'We deliver daily across the GTA, Hamilton and the Niagara Region on scheduled cold-chain routes. Outside those areas you can pick up from our Mississauga cash & carry warehouse.' },
  { q: 'What is the order cut-off for next-day delivery?', a: 'Orders placed by 2 PM are delivered on the next route day. Same-day delivery is available on selected routes — your rep can confirm yours.' },
  { q: 'Is there a delivery minimum?', a: 'Delivery is available on orders of $350 or more. Smaller orders can be picked up at the warehouse.' },
  { q: 'Do I need a business account to order?', a: 'You can browse without one, but a business account is normally required to check out and gives you customer-group pricing and credit terms.' },
  { q: 'What is your returns policy?', a: 'If something arrives damaged or isn’t right, contact us within 48 hours and we’ll replace or credit it — perishables are checked on delivery.' },
  { q: 'Can I pick up my order instead?', a: 'Yes — walk in or pick up at 3750A Laird Road, Unit 9, Mississauga, Mon–Sat 9am–6pm.' },
]

export default function HomeFAQ({ faqs = defaultFaqs }: { faqs?: Faq[] }) {
  const [open, setOpen] = useState<number | false>(0)
  return (
    <Box>
      <Box sx={{ display: 'grid', gap: { xs: 2, lg: 5 }, gridTemplateColumns: { xs: '1fr', lg: '340px minmax(0,1fr)' }, alignItems: 'start' }}>
        <Box>
          <Typography sx={{ fontSize: { xs: 11.5, md: 12.5 }, fontWeight: 600, letterSpacing: '.14em', color: '#D50000', textTransform: 'uppercase', mb: 0.75 }}>Need help?</Typography>
          <Typography id="home-faq" component="h2" sx={{ fontSize: { xs: 22, sm: 26, md: 30 }, fontWeight: 600, color: '#0C0C0C', lineHeight: 1.2, letterSpacing: '-0.01em' }}>Quick answers</Typography>
          <Typography sx={{ fontSize: { xs: 14, md: 15 }, color: '#4B5563', mt: 0.75, mb: 2, lineHeight: 1.55 }}>
            Still need help? Call or WhatsApp us Mon–Sat 9am–6pm.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.25, flexWrap: 'wrap' }}>
            <Button
              href="tel:+13657770999"
              variant="outlined"
              startIcon={<PhoneOutlinedIcon />}
              sx={{ borderColor: '#FF0000', color: RED_AA, borderRadius: '40px', textTransform: 'none', fontWeight: 500, height: 42, px: 2, '&:hover': { borderColor: '#FF0000', bgcolor: 'rgba(255,0,0,.04)' }, '&.Mui-focusVisible': { outline: `3px solid ${RED_AA}`, outlineOffset: 2 } }}
            >
              +1 365-777-0999
            </Button>
            <Button
              component={Link}
              href="/service/contact-us"
              sx={{ color: '#0C0C0C', textTransform: 'none', fontWeight: 500, height: 42, px: 1.5, '&:hover': { color: RED_AA, bgcolor: 'transparent' }, '&.Mui-focusVisible': { outline: `3px solid ${RED_AA}`, outlineOffset: 2 } }}
            >
              Contact us →
            </Button>
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
              TransitionProps={{ unmountOnExit: false }}
              sx={{
                border: '1px solid #E5E7EB', borderRadius: '10px !important', mb: 1, bgcolor: open === i ? '#F9FAFB' : '#fff', '&::before': { display: 'none' },
                '@media (prefers-reduced-motion: reduce)': { '& .MuiCollapse-root': { transition: 'none !important' } },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: open === i ? RED_AA : '#6B7280' }} />}
                id={`faq-${i}-header`}
                aria-controls={`faq-${i}-content`}
                sx={{ minHeight: 52, px: 2, '& .MuiAccordionSummary-content': { my: 1.25 }, '&.Mui-focusVisible': { outline: `3px solid ${RED_AA}`, outlineOffset: -3, borderRadius: '10px', bgcolor: 'transparent' } }}
              >
                <Typography component="h3" sx={{ fontSize: { xs: 14, md: 15 }, fontWeight: 600, color: '#0C0C0C' }}>{f.q}</Typography>
              </AccordionSummary>
              <AccordionDetails id={`faq-${i}-content`} sx={{ px: 2, pt: 0, pb: 2 }}>
                <Typography sx={{ fontSize: 14, color: '#4B5563', lineHeight: 1.6 }}>{f.a}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
