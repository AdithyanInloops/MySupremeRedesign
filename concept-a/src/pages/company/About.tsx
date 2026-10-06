import { Box, Button, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import StorefrontOutlined from '@mui/icons-material/StorefrontOutlined'
import LanguageRounded from '@mui/icons-material/LanguageRounded'
import PhoneIphoneOutlined from '@mui/icons-material/PhoneIphoneOutlined'
import BadgeOutlined from '@mui/icons-material/BadgeOutlined'
import RestaurantRounded from '@mui/icons-material/RestaurantRounded'
import LocalCafeOutlined from '@mui/icons-material/LocalCafeOutlined'
import RoomServiceOutlined from '@mui/icons-material/RoomServiceOutlined'
import BakeryDiningOutlined from '@mui/icons-material/BakeryDiningOutlined'
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined'
import DeliveryDiningOutlined from '@mui/icons-material/DeliveryDiningOutlined'
import CelebrationOutlined from '@mui/icons-material/CelebrationOutlined'
import PlaceOutlined from '@mui/icons-material/PlaceOutlined'
import DirectionsRounded from '@mui/icons-material/DirectionsRounded'
import { tokens } from '../../theme'
import { contact, photo } from '../../data/catalog'
import { Container, SectionHeader } from '../../components/ui'
import { CompanyHero, CtaBand, FeatureCard, ghostBtn, whiteBtn } from './parts/CompanyParts'

const c = tokens.color

const stats = [
  ['4,300+', 'products online'],
  ['9', 'departments'],
  ['3', 'delivery regions'],
  ['Mon–Sat', '9am–6pm, walk in'],
]

const ways = [
  { icon: <StorefrontOutlined />, title: 'Cash & carry walk-in', body: 'Load up at our Mississauga warehouse — 3750A Laird Road, Unit 9. Business pricing at the till.' },
  { icon: <LanguageRounded />, title: 'Website', body: 'Search by product or SKU, reorder in a tap and track delivery to your back door.' },
  { icon: <PhoneIphoneOutlined />, title: 'iOS & Android app', body: 'Scan an empty case, reorder favourites and get delivery alerts on the go.' },
  { icon: <BadgeOutlined />, title: 'Field sales rep', body: 'A named rep who knows your menu, your volumes and your delivery window.' },
]

const customers = [
  [<RestaurantRounded />, 'Restaurants'], [<LocalCafeOutlined />, 'Cafés'], [<RoomServiceOutlined />, 'Caterers'], [<BakeryDiningOutlined />, 'Bakeries'],
  [<LocalShippingOutlined />, 'Food trucks'], [<DeliveryDiningOutlined />, 'Ghost kitchens'], [<CelebrationOutlined />, 'Hospitality & events'],
] as const

export default function About() {
  return (
    <Box>
      <CompanyHero
        crumbs={[{ label: 'About us' }]}
        eyebrow="About MySupreme"
        title="Built to be your kitchen’s single supplier."
        body="MySupreme Food Service — Supreme Cash & Carry — supplies Ontario’s restaurants, cafés and caterers with everything from basmati to bagasse clamshells. One order, one invoice, one delivery."
        image={photo('chef', 1800)}
        actions={
          <>
            <Button variant="contained" size="large" component={RouterLink} to="/account/signin?mode=create">Open a business account</Button>
            <Button variant="outlined" size="large" component={RouterLink} to="/contact" sx={ghostBtn}>Talk to sales</Button>
          </>
        }
      />

      <Container sx={{ mt: { xs: -3, md: -5 }, position: 'relative' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4,1fr)' }, bgcolor: '#fff', borderRadius: `${tokens.radius.lg}px`, boxShadow: tokens.shadow.pop, overflow: 'hidden' }}>
          {stats.map(([v, l], i) => (
            <Box key={l} sx={{ p: { xs: 2.5, md: 3.5 }, borderLeft: { md: i ? `1px solid ${c.line}` : 0 }, borderTop: { xs: i > 1 ? `1px solid ${c.line}` : 0, md: 0 }, borderRight: { xs: i % 2 === 0 ? `1px solid ${c.line}` : 0, md: 0 } }}>
              <Typography sx={{ fontSize: { xs: 28, md: 40 }, fontWeight: 800, color: c.navy, letterSpacing: '-.02em', lineHeight: 1.1 }}>{v}</Typography>
              <Typography color="text.secondary" sx={{ fontSize: 14 }}>{l}</Typography>
            </Box>
          ))}
        </Box>
      </Container>

      <Container sx={{ mt: { xs: 6, md: 10 } }}>
        <Box sx={{ display: 'grid', gap: { xs: 3, md: 6 }, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, alignItems: 'center' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            <Box component="img" src={photo('produceStall', 700, 900)} alt="Fresh produce stacked by the case" sx={{ borderRadius: `${tokens.radius.lg}px`, width: '100%', height: { xs: 220, md: 380 }, objectFit: 'cover' }} />
            <Box component="img" src={photo('aisle', 700, 900)} alt="Warehouse aisle stocked with grocery" sx={{ borderRadius: `${tokens.radius.lg}px`, width: '100%', height: { xs: 220, md: 380 }, objectFit: 'cover', mt: { xs: 3, md: 6 } }} />
          </Box>
          <Box>
            <Typography variant="overline" sx={{ color: c.red }}>Our story</Typography>
            <Typography variant="h2" sx={{ mt: 0.5, mb: 2 }}>From one warehouse counter to 3,000+ kitchens.</Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              We started as a cash &amp; carry for the restaurants on our own street in Mississauga. Owners kept asking the same thing: “Can you just bring it to me?”
              So we built scheduled routes across the GTA, then Hamilton, then Niagara — cold-chain trucks included.
            </Typography>
            <Typography color="text.secondary">
              Today the same counter sells 4,300+ products across nine departments, and the people behind it still pick up the phone on WhatsApp.
            </Typography>
          </Box>
        </Box>
      </Container>

      <Container sx={{ mt: { xs: 6, md: 10 } }}>
        <SectionHeader eyebrow="How you can buy" title="Four ways to order, one account" />
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4,1fr)' } }}>
          {ways.map((w) => <FeatureCard key={w.title} {...w} />)}
        </Box>
      </Container>

      <Container sx={{ mt: { xs: 6, md: 10 } }}>
        <SectionHeader eyebrow="Who we serve" title="If it has a kitchen, we supply it" />
        <Stack direction="row" flexWrap="wrap" gap={1.5}>
          {customers.map(([icon, label]) => (
            <Stack key={label} direction="row" alignItems="center" spacing={1.25} sx={{ px: 2.25, py: 1.5, bgcolor: '#fff', border: `1px solid ${c.line}`, borderRadius: 999, fontWeight: 600, '& svg': { color: c.red } }}>
              {icon}<span>{label}</span>
            </Stack>
          ))}
        </Stack>
      </Container>

      <Container sx={{ mt: { xs: 6, md: 10 } }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1.4fr' }, bgcolor: '#fff', border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.xl}px`, overflow: 'hidden' }}>
          <Box sx={{ p: { xs: 3, md: 5 } }}>
            <Typography variant="overline" sx={{ color: c.red }}>Visit the warehouse</Typography>
            <Typography variant="h2" sx={{ mt: 0.5, mb: 2 }}>Supreme Cash &amp; Carry</Typography>
            <Stack spacing={1.5} sx={{ mb: 3 }}>
              <Stack direction="row" spacing={1.25}><PlaceOutlined sx={{ color: c.navy }} /><Typography>{contact.address}</Typography></Stack>
              <Typography color="text.secondary">{contact.hours} · Free customer parking · Loading bay at the rear</Typography>
            </Stack>
            <Button variant="contained" startIcon={<DirectionsRounded />} href="https://maps.google.com/?q=3750A+Laird+Road+Mississauga">Get directions</Button>
          </Box>
          <MapPlaceholder />
        </Box>
      </Container>

      <CtaBand
        title="Open a business account in 2 minutes"
        body="Unlock business pricing, credit terms and same-day delivery. Have your HST number handy."
        actions={
          <>
            <Button variant="contained" size="large" component={RouterLink} to="/account/signin?mode=create" sx={whiteBtn}>Open account</Button>
            <Button variant="outlined" size="large" component={RouterLink} to="/all-categories" sx={ghostBtn}>Browse products</Button>
          </>
        }
      />
    </Box>
  )
}

/** Static map placeholder — Google Maps embed in the build. */
export function MapPlaceholder({ label = 'Supreme Cash & Carry' }: { label?: string }) {
  return (
    <Box role="img" aria-label={`Map showing ${label}`} sx={{ position: 'relative', minHeight: 300, bgcolor: '#E8EEF3', overflow: 'hidden' }}>
      <Box sx={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(#fff 2px, transparent 2px), linear-gradient(90deg, #fff 2px, transparent 2px)', backgroundSize: '64px 64px', opacity: 0.9 }} />
      <Box sx={{ position: 'absolute', left: '-10%', right: '-10%', top: '55%', height: 22, bgcolor: '#FFE7A8', transform: 'rotate(-8deg)' }} />
      <Box sx={{ position: 'absolute', top: '-10%', bottom: '-10%', left: '38%', width: 16, bgcolor: '#fff', transform: 'rotate(12deg)' }} />
      <Box sx={{ position: 'absolute', left: '60%', top: '20%', width: 120, height: 80, bgcolor: '#CDE8D2', borderRadius: 3 }} />
      <Box sx={{ position: 'absolute', left: '48%', top: '42%', transform: 'translate(-50%,-100%)', textAlign: 'center' }}>
        <Box sx={{ bgcolor: c.navy, color: '#fff', px: 1.5, py: 0.75, borderRadius: `${tokens.radius.sm}px`, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', boxShadow: tokens.shadow.pop }}>{label}</Box>
        <PlaceOutlined sx={{ color: c.red, fontSize: 44, mt: -0.5 }} />
      </Box>
    </Box>
  )
}
