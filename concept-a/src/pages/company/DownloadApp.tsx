import { Box, Stack, Typography } from '@mui/material'
import ReplayRounded from '@mui/icons-material/ReplayRounded'
import QrCodeScannerRounded from '@mui/icons-material/QrCodeScannerRounded'
import NotificationsActiveOutlined from '@mui/icons-material/NotificationsActiveOutlined'
import ReceiptLongOutlined from '@mui/icons-material/ReceiptLongOutlined'
import MicRounded from '@mui/icons-material/MicRounded'
import FavoriteBorderRounded from '@mui/icons-material/FavoriteBorderRounded'
import { tokens } from '../../theme'
import { money, products } from '../../data/catalog'
import { Crown } from '../../components/Brand'
import { StoreBadge } from '../../components/Footer'
import { Container, SectionHeader } from '../../components/ui'
import { FeatureCard } from './parts/CompanyParts'
import { Breadcrumbs } from '../../components/Shared'

const c = tokens.color

const features = [
  { icon: <ReplayRounded />, title: 'Reorder in two taps', body: 'Your last order and favourites sit on the home screen, quantities pre-filled.' },
  { icon: <QrCodeScannerRounded />, title: 'Scan an empty case', body: 'Point the camera at a barcode or label and we find the exact SKU.' },
  { icon: <MicRounded />, title: 'Order by voice', body: '“Add four cases of Coke cans” — hands-free while you prep.' },
  { icon: <NotificationsActiveOutlined />, title: 'Delivery alerts', body: 'Know when the truck leaves the warehouse and when it’s 15 minutes out.' },
  { icon: <ReceiptLongOutlined />, title: 'Invoices & statements', body: 'Download invoice PDFs and check available credit anywhere.' },
  { icon: <FavoriteBorderRounded />, title: 'Shared favourites', body: 'Same Favorites list on web, app and with your sales rep.' },
]

/** CSS-drawn phone with a miniature app screen. */
function Phone() {
  const list = products.slice(0, 4)
  return (
    <Box sx={{ width: 280, height: 570, borderRadius: '44px', bgcolor: '#0B0B12', p: 1.25, boxShadow: '0 40px 80px -30px rgba(0,0,0,.6)', mx: 'auto', position: 'relative', transform: { lg: 'rotate(-4deg)' } }}>
      <Box sx={{ position: 'absolute', top: 18, left: '50%', transform: 'translateX(-50%)', width: 90, height: 24, borderRadius: 999, bgcolor: '#0B0B12', zIndex: 2 }} />
      <Box sx={{ height: '100%', borderRadius: '34px', bgcolor: c.bg, color: c.ink, overflow: 'hidden' }}>
        <Box sx={{ bgcolor: c.red, color: '#fff', px: 2, pt: 6, pb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}><Crown size={22} color="#fff" /><Typography sx={{ fontWeight: 800, letterSpacing: '.06em', fontSize: 14 }}>SUPREME</Typography></Stack>
          <Typography sx={{ fontSize: 12, mt: 1.5, opacity: 0.9 }}>Good morning, Spice Route</Typography>
          <Box sx={{ mt: 1, bgcolor: '#fff', borderRadius: 2, height: 34, display: 'flex', alignItems: 'center', px: 1.25, color: c.text3, fontSize: 11 }}>Search by product or SKU</Box>
        </Box>
        <Box sx={{ p: 1.5 }}>
          <Box sx={{ bgcolor: c.navy, color: '#fff', borderRadius: 2, p: 1.5, mb: 1.5 }}>
            <Typography sx={{ fontSize: 10, color: c.saffron, fontWeight: 700 }}>ON THE WAY · ORDER #000131</Typography>
            <Typography sx={{ fontSize: 13, fontWeight: 700 }}>Arriving today, 2–4 PM</Typography>
          </Box>
          <Typography sx={{ fontSize: 11, fontWeight: 700, mb: 1 }}>Buy again</Typography>
          <Stack spacing={1}>
            {list.map((p) => (
              <Stack key={p.sku} direction="row" spacing={1} alignItems="center" sx={{ bgcolor: '#fff', borderRadius: 2, p: 1, border: `1px solid ${c.line}` }}>
                <Box sx={{ width: 34, height: 34, borderRadius: 1.5, bgcolor: c.surface2, flexShrink: 0, display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 700, color: c.navy }}>{p.brand.slice(0, 2).toUpperCase()}</Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography sx={{ fontSize: 10, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</Typography>
                  <Typography sx={{ fontSize: 10, color: c.text3 }}>{p.pack} · {money(p.price)}</Typography>
                </Box>
                <Box sx={{ width: 24, height: 24, borderRadius: 1, bgcolor: c.red, color: '#fff', display: 'grid', placeItems: 'center', fontSize: 14, fontWeight: 700 }}>+</Box>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}

function QrPlaceholder() {
  // Deterministic pseudo-QR pattern; the real QR is generated per store link.
  const cells = Array.from({ length: 21 * 21 }, (_, i) => {
    const x = i % 21, y = Math.floor(i / 21)
    const finder = (a: number, b: number) => x >= a && x < a + 7 && y >= b && y < b + 7
    if (finder(0, 0) || finder(14, 0) || finder(0, 14)) {
      const lx = x % 14 % 7, ly = y % 14 % 7
      return lx === 0 || lx === 6 || ly === 0 || ly === 6 || (lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4)
    }
    return ((x * 7 + y * 13 + x * y) % 5) < 2
  })
  return (
    <Box role="img" aria-label="QR code to download the MySupreme app" sx={{ p: 1.5, bgcolor: '#fff', borderRadius: `${tokens.radius.md}px`, display: 'inline-grid', gridTemplateColumns: 'repeat(21, 6px)', gap: 0 }}>
      {cells.map((on, i) => <Box key={i} sx={{ width: 6, height: 6, bgcolor: on ? c.navyDark : '#fff' }} />)}
    </Box>
  )
}

export default function DownloadApp() {
  return (
    <Box>
      <Box sx={{ bgcolor: c.navyDark, color: '#fff', overflow: 'hidden', position: 'relative' }}>
        <Box sx={{ position: 'absolute', right: '-10%', top: '-30%', width: 700, height: 700, borderRadius: '50%', background: `radial-gradient(circle, ${c.red} 0%, transparent 65%)`, opacity: 0.45 }} />
        <Container sx={{ position: 'relative', py: { xs: 4, md: 8 } }}>
          <Breadcrumbs items={[{ label: 'Download app' }]} sx={{ mb: 3, '& a, & span, & svg': { color: 'rgba(255,255,255,.85) !important' } }} />
          <Box sx={{ display: 'grid', gap: 5, gridTemplateColumns: { xs: '1fr', lg: '1.2fr 1fr' }, alignItems: 'center' }}>
            <Box>
              <Typography variant="overline" sx={{ color: c.saffron }}>MySupreme for iOS &amp; Android</Typography>
              <Typography variant="h1" sx={{ color: '#fff', mt: 1 }}>Your whole order list, in your apron pocket.</Typography>
              <Typography sx={{ mt: 2, opacity: 0.88, fontSize: 17, maxWidth: 560 }}>Reorder last week’s delivery between lunch and dinner service. Same account, prices and favourites as the website.</Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ sm: 'center' }} sx={{ mt: 4 }}>
                <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap><StoreBadge store="apple" /><StoreBadge store="google" /></Stack>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
                  <QrPlaceholder />
                  <Typography sx={{ fontSize: 13, opacity: 0.85, maxWidth: 120 }}>Scan with your phone camera to download</Typography>
                </Stack>
              </Stack>
              <Stack direction="row" spacing={3} sx={{ mt: 4, opacity: 0.9 }}>
                <Box><Typography sx={{ fontWeight: 800, fontSize: 24 }}>4.8★</Typography><Typography variant="caption">App Store rating</Typography></Box>
                <Box><Typography sx={{ fontWeight: 800, fontSize: 24 }}>2 taps</Typography><Typography variant="caption">to reorder</Typography></Box>
              </Stack>
            </Box>
            <Box sx={{ py: 2 }}><Phone /></Box>
          </Box>
        </Container>
      </Box>
      <Container sx={{ mt: { xs: 5, md: 8 } }}>
        <SectionHeader eyebrow="Made for the line, not the office" title="Why kitchens switch to the app" />
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3,1fr)' } }}>
          {features.map((f) => <FeatureCard key={f.title} {...f} />)}
        </Box>
      </Container>
    </Box>
  )
}
