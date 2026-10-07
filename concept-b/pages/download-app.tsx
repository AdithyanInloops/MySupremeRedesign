import Head from 'next/head'
import { Box, Typography } from '@mui/material'
import BoltRoundedIcon from '@mui/icons-material/BoltRounded'
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded'
import QrCodeScannerRoundedIcon from '@mui/icons-material/QrCodeScannerRounded'
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined'
import QrCode2RoundedIcon from '@mui/icons-material/QrCode2Rounded'
import { colors, radius } from '../lib/theme'
import PageHeader from '../components/ui/PageHeader'
import { PageContainer } from '../components/ui/Section'

const features = [
  { icon: BoltRoundedIcon, title: 'Search by name or SKU', text: 'Real-time pricing and stock as you type' },
  { icon: ReplayRoundedIcon, title: '1-tap reordering', text: 'Your full order history in your pocket' },
  { icon: QrCodeScannerRoundedIcon, title: 'Click & Collect', text: 'Order on the way, pick up at Laird Road' },
  { icon: NotificationsActiveOutlinedIcon, title: 'Delivery updates', text: 'Know when your order is packed and on the road' },
]

/** App download page: what the app does, store badges, and a QR code for desktop visitors. */
export default function DownloadApp() {
  return (
    <PageContainer sx={{ pb: { xs: 5, md: 9 } }}>
      <Head><title>Get the app | MySupreme</title></Head>
      <PageHeader breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Get the app' }]} eyebrow="MySupreme app" title="Order anytime, from anywhere" description="Everything on mysupreme.ca, built for the walk-in cooler and the delivery dock. Free on iOS and Android." />
      <Box sx={{ display: 'grid', gap: { xs: 3, md: 6 }, gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'minmax(0,1.2fr) minmax(0,1fr)' }, alignItems: 'center' }}>
        <Box>
          <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gap: 2.5, gridTemplateColumns: { xs: 'minmax(0,1fr)', sm: 'minmax(0,1fr) minmax(0,1fr)' } }}>
            {features.map((f) => {
              const Icon = f.icon
              return (
                <Box component="li" key={f.title} sx={{ display: 'flex', gap: 1.5 }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: radius.md, bgcolor: colors.redTint, color: colors.redText, display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon /></Box>
                  <Box><Typography sx={{ fontWeight: 600 }}>{f.title}</Typography><Typography sx={{ fontSize: 14, color: colors.ink600 }}>{f.text}</Typography></Box>
                </Box>
              )
            })}
          </Box>
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', mt: 4, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <Box component="a" href="https://apps.apple.com/in/app/mysupreme/id6749691637" target="_blank" rel="noopener noreferrer" sx={{ display: 'inline-flex', borderRadius: radius.sm }}><img src="/assets/appstore1.svg" alt="Download on the App Store" style={{ height: 48 }} /></Box>
              <Box component="a" href="https://play.google.com/store/apps/details?id=com.mysupreme.app" target="_blank" rel="noopener noreferrer" sx={{ display: 'inline-flex', borderRadius: radius.sm }}><img src="/assets/playstore1.svg" alt="Get it on Google Play" style={{ height: 48 }} /></Box>
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.5 }}>
              {/* TODO(asset): replace with a real QR code that deep-links to the right store (e.g. via a smart link). */}
              <Box role="img" aria-label="QR code to download the app (placeholder)" sx={{ width: 96, height: 96, borderRadius: radius.md, border: `1px dashed ${colors.line2}`, display: 'grid', placeItems: 'center', bgcolor: colors.subtle }}>
                <QrCode2RoundedIcon sx={{ fontSize: 64, color: colors.ink400 }} />
              </Box>
              <Typography sx={{ fontSize: 13.5, color: colors.ink600, maxWidth: 140 }}>On a computer? Scan with your phone’s camera.</Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ position: 'relative', borderRadius: radius.xl, bgcolor: colors.subtle, minHeight: { xs: 320, md: 460 }, display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
          <Box component="img" src="/assets/order-anytime.png" alt="The MySupreme app showing departments and restaurant categories" sx={{ height: { xs: 300, md: 440 }, width: 'auto' }} />
        </Box>
      </Box>
    </PageContainer>
  )
}
