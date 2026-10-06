import { Box, Divider, IconButton, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import FacebookRounded from '@mui/icons-material/FacebookRounded'
import Instagram from '@mui/icons-material/Instagram'
import LinkedIn from '@mui/icons-material/LinkedIn'
import Apple from '@mui/icons-material/Apple'
import Shop from '@mui/icons-material/Shop'
import WhatsApp from '@mui/icons-material/WhatsApp'
import MailOutlineRounded from '@mui/icons-material/MailOutlineRounded'
import PlaceOutlined from '@mui/icons-material/PlaceOutlined'
import { tokens } from '../theme'
import { contact } from '../data/catalog'
import { Logo } from './Brand'
import { Container } from './ui'

const c = tokens.color

const cols = [
  { h: 'Categories', l: [['Packaging', '/c/packaging'], ['Grocery', '/c/grocery'], ['Frozen', '/c/frozen'], ['Produce', '/c/produce'], ['Beverage', '/c/beverage'], ['Dairy', '/c/dairy-eggs'], ['Janitorial', '/c/janitorial']] },
  { h: 'About', l: [['About us', '/about'], ['Terms & Uses', '/page/terms'], ['Safety & Security', '/page/safety-security'], ['Privacy Policy', '/page/privacy-policy']] },
  { h: 'Help', l: [['Contact', '/contact'], ['Online Help', '/service'], ['Become a supplier', '/become-a-supplier'], ['Blog', '/blog']] },
]

function PayLogo({ label, bg, fg = '#fff' }: { label: string; bg: string; fg?: string }) {
  return (
    <Box aria-label={label} sx={{ height: 30, px: 1.25, borderRadius: 1, bgcolor: bg, color: fg, fontSize: 11, fontWeight: 800, display: 'grid', placeItems: 'center', letterSpacing: '.02em', fontStyle: label === 'Visa' ? 'italic' : 'normal' }}>
      {label === 'Mastercard' ? (
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#EB001B' }} />
          <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#F79E1B', ml: -0.75, mixBlendMode: 'multiply' }} />
        </Box>
      ) : label.toUpperCase()}
    </Box>
  )
}

export function StoreBadge({ store }: { store: 'apple' | 'google' }) {
  return (
    <Box component="a" href="#" aria-label={store === 'apple' ? 'Download on the App Store' : 'Get it on Google Play'}
      sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, height: 46, px: 1.5, borderRadius: `${tokens.radius.sm}px`, bgcolor: '#000', color: '#fff', textDecoration: 'none', border: '1px solid rgba(255,255,255,.25)', minWidth: 150 }}>
      {store === 'apple' ? <Apple /> : <Shop />}
      <Box sx={{ lineHeight: 1.1 }}>
        <Box sx={{ fontSize: 9.5, opacity: 0.85 }}>{store === 'apple' ? 'Download on the' : 'GET IT ON'}</Box>
        <Box sx={{ fontSize: 15, fontWeight: 600 }}>{store === 'apple' ? 'App Store' : 'Google Play'}</Box>
      </Box>
    </Box>
  )
}

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: c.navyDark, color: 'rgba(255,255,255,.82)', mt: { xs: 6, md: 10 }, pb: { xs: 12, md: 4 } }}>
      <Container sx={{ pt: { xs: 5, md: 7 } }}>
        <Box sx={{ display: 'grid', gap: { xs: 4, md: 5 }, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr', lg: '1.6fr 1fr 1fr 1fr 1.2fr' } }}>
          <Box sx={{ gridColumn: { md: '1 / -1', lg: 'auto' } }}>
            <Logo inverse />
            <Typography sx={{ mt: 2, fontSize: 13.5, lineHeight: 1.7 }}>
              MySupreme Food Service — Supreme Cash &amp; Carry — is an Ontario wholesale food and restaurant supplier built to be your kitchen’s single supplier.
            </Typography>
            <Typography sx={{ mt: 1.5, fontSize: 13.5, lineHeight: 1.7 }}>
              Shop 4,300+ products online, in our app, with your sales rep, or walk in to our Mississauga cash &amp; carry warehouse.
            </Typography>
            <Typography sx={{ mt: 1.5, fontSize: 13.5, lineHeight: 1.7 }}>
              Same-day and next-day cold-chain delivery across the GTA, Hamilton and Niagara on scheduled routes.
            </Typography>
          </Box>
          {cols.map((col) => (
            <Box key={col.h} component="nav" aria-label={col.h}>
              <Typography sx={{ color: '#fff', fontWeight: 700, mb: 1.5, fontSize: 15 }}>{col.h}</Typography>
              <Stack spacing={0.25}>
                {col.l.map(([t, to]) => (
                  <Box key={t} component={RouterLink} to={to} sx={{ color: 'inherit', textDecoration: 'none', fontSize: 14, py: 0.6, '&:hover': { color: '#fff', textDecoration: 'underline' } }}>{t}</Box>
                ))}
              </Stack>
            </Box>
          ))}
          <Box>
            <Typography sx={{ color: '#fff', fontWeight: 700, mb: 1.5, fontSize: 15 }}>Talk to us</Typography>
            <Stack spacing={1.25} sx={{ fontSize: 14 }}>
              <Box component="a" href="https://wa.me/13657770999" sx={{ display: 'flex', gap: 1, color: '#fff', textDecoration: 'none', fontWeight: 600 }}><WhatsApp fontSize="small" />{contact.phone}</Box>
              <Box component="a" href={`mailto:${contact.email}`} sx={{ display: 'flex', gap: 1, color: 'inherit', textDecoration: 'none' }}><MailOutlineRounded fontSize="small" />{contact.email}</Box>
              <Box sx={{ display: 'flex', gap: 1 }}><PlaceOutlined fontSize="small" />{contact.address}</Box>
              <Box sx={{ opacity: 0.8 }}>{contact.hours}</Box>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ mt: 2.5, flexWrap: 'wrap', gap: 1 }}>
              <StoreBadge store="apple" />
              <StoreBadge store="google" />
            </Stack>
          </Box>
        </Box>
        <Divider sx={{ borderColor: 'rgba(255,255,255,.14)', my: 4 }} />
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2.5} alignItems={{ md: 'center' }} justifyContent="space-between">
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
            <Typography sx={{ fontSize: 12.5, mr: 0.5 }}>Secure payments</Typography>
            <PayLogo label="Mastercard" bg="#fff" />
            <PayLogo label="Visa" bg="#fff" fg="#1A1F71" />
            <PayLogo label="PayPal" bg="#fff" fg="#003087" />
            <PayLogo label="Shop Pay" bg="#5A31F4" />
          </Stack>
          <Stack direction="row" spacing={0.5}>
            {[[FacebookRounded, 'Facebook'], [Instagram, 'Instagram'], [LinkedIn, 'LinkedIn']].map(([I, l]) => {
              const Icon = I as typeof FacebookRounded
              return (
                <IconButton key={l as string} aria-label={l as string} href="#" sx={{ color: '#fff', width: 44, height: 44, border: '1px solid rgba(255,255,255,.2)', '&:hover': { bgcolor: 'rgba(255,255,255,.08)' } }}>
                  <Icon fontSize="small" />
                </IconButton>
              )
            })}
          </Stack>
        </Stack>
        <Typography sx={{ fontSize: 12.5, mt: 3, opacity: 0.7 }}>© 2026 MySupreme Food Service Inc. · Supreme Cash &amp; Carry · All rights reserved.</Typography>
      </Container>
    </Box>
  )
}
