import type { ReactNode } from 'react'
import { Box, Button, Chip, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import SearchRounded from '@mui/icons-material/SearchRounded'
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined'
import ReplayRounded from '@mui/icons-material/ReplayRounded'
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined'
import PhotoCameraBackOutlined from '@mui/icons-material/PhotoCameraBackOutlined'
import AccessibilityNewRounded from '@mui/icons-material/AccessibilityNewRounded'
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded'
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded'
import AutoAwesomeRounded from '@mui/icons-material/AutoAwesomeRounded'
import ToggleOnOutlined from '@mui/icons-material/ToggleOnOutlined'
import DevicesRounded from '@mui/icons-material/DevicesRounded'
import WidgetsOutlined from '@mui/icons-material/WidgetsOutlined'
import { tokens } from '../../theme'
import { photo, productBySku } from '../../data/catalog'
import { Container, NewFeatureTag, Panel, SectionHeader } from '../../components/ui'
import { Crown } from '../../components/Brand'

const c = tokens.color
const pdp = '/p/' + (productBySku('A905')?.slug ?? '')

const principles = [
  { icon: <SearchRounded />, t: 'Search & SKU first', b: 'A wide search bar with mic and camera on every screen; SKUs and barcodes match instantly with highlighted hits.' },
  { icon: <Inventory2Outlined />, t: 'Pack size always visible', b: 'One consistent pack-size chip on every card, row, cart line and order — “24x1L in a case” is never hidden.' },
  { icon: <ReplayRounded />, t: 'Reorder-first', b: 'Buy-again rail on home, one-tap reorder from any order, Favorites in the header, quick-add quantities on every card.' },
  { icon: <LocalShippingOutlined />, t: 'Delivery promise everywhere', b: 'Next-day cut-off in the header, delivery-area checks in cart and checkout, and order ETAs in the account.' },
  { icon: <PhotoCameraBackOutlined />, t: 'Warm, brand-true', b: 'MySupreme red and navy with warm food photography, bento promo tiles and a placeholder that looks intentional in a grid.' },
  { icon: <AccessibilityNewRounded />, t: 'Accessible by default', b: 'Deeper red #D50000 for every text-bearing button (5.5:1), 44px targets, icon + text status chips, reduced-motion.' },
]

const beforeAfter: [string, string][] = [
  ['Bright #FF0000 buttons fail AA contrast (4.0:1)', 'Text-bearing red is #D50000 (5.5:1); #FF0000 stays on the crown'],
  ['Grey “SUPREME” box for 7 of 8 products', 'Branded placeholder with brand monogram — a full grid of them still looks designed'],
  ['Pack size buried in the product name', 'Dedicated pack-size chip on every card, list row, cart line and order'],
  ['Long names and 17-digit SKUs break cards', '2-line clamp + full name on hover/PDP; mono SKU that ellipsizes, never wraps'],
  ['Reordering means searching again', 'Buy again on home, reorder on every order, Favorites one click away'],
  ['Same price for everyone until checkout', 'Business price shown after sign-in; guests see “Sign in for business price”'],
  ['No sense of when it arrives', 'Cut-off in the header, delivery-area checks, order ETAs and tracking'],
  ['Grid only', 'Grid + dense list view for pros ordering 40 lines at a time'],
]

type Row = { area: string; page: string; route: string; p: 1 | 2 | 3; link?: string; status: 'Designed' | 'Template' | 'Reuses layout' }
const inventory: Row[] = [
  { area: 'Shopping', page: 'Home', route: '/', p: 1, link: '/', status: 'Designed' },
  { area: 'Shopping', page: 'Category listing', route: '/packaging, /grocery/…', p: 1, link: '/c/packaging', status: 'Designed' },
  { area: 'Shopping', page: 'Search results (+ no results, image search)', route: '/search/<term>', p: 1, link: '/search/monin', status: 'Designed' },
  { area: 'Shopping', page: 'Product detail', route: '/p/<product>', p: 1, link: pdp, status: 'Designed' },
  { area: 'Shopping', page: 'All categories', route: '/all-categories', p: 2, link: '/all-categories', status: 'Designed' },
  { area: 'Shopping', page: 'Brands', route: '/brands', p: 2, link: '/brands', status: 'Designed' },
  { area: 'Shopping', page: 'Flyers & Offers (coming soon + live)', route: '/flyers-offers', p: 2, link: '/flyers-offers', status: 'Designed' },
  { area: 'Shopping', page: 'Compare', route: '/compare', p: 3, link: '/compare', status: 'Template' },
  { area: 'Shopping', page: 'Wishlist / Favorites', route: '/wishlist', p: 2, link: '/wishlist', status: 'Designed' },
  { area: 'Cart & checkout', page: 'Cart', route: '/cart', p: 1, link: '/cart', status: 'Designed' },
  { area: 'Cart & checkout', page: 'Checkout: shipping', route: '/checkout', p: 1, link: '/checkout', status: 'Designed' },
  { area: 'Cart & checkout', page: 'Checkout: payment', route: '/checkout/payment', p: 1, link: '/checkout/payment', status: 'Designed' },
  { area: 'Cart & checkout', page: 'Order success', route: '/checkout/success, /thank-you', p: 1, link: '/checkout/success', status: 'Designed' },
  { area: 'Cart & checkout', page: 'Edit billing / edit address', route: 'dialogs from checkout', p: 2, link: '/checkout', status: 'Designed' },
  { area: 'Account', page: 'Sign in / create account', route: '/account/signin', p: 1, link: '/account/signin', status: 'Designed' },
  { area: 'Account', page: 'Forgot / reset / create password, email confirm', route: '/account/forgot-password', p: 2, link: '/account/forgot-password', status: 'Designed' },
  { area: 'Account', page: 'Account dashboard', route: '/account', p: 1, link: '/account', status: 'Designed' },
  { area: 'Account', page: 'Orders list and order detail', route: '/account/orders', p: 1, link: '/account/orders', status: 'Designed' },
  { area: 'Account', page: 'Credit dashboard (invoices, quotes, payments, credit notes, statements)', route: '/account/customerdashbord', p: 1, link: '/account/customerdashbord', status: 'Designed' },
  { area: 'Account', page: 'Addresses (list, add, edit)', route: '/account/addresses', p: 2, link: '/account/addresses', status: 'Designed' },
  { area: 'Account', page: 'Business / company info, name, contact, settings, password', route: '/account/profile', p: 2, link: '/account/profile', status: 'Designed' },
  { area: 'Account', page: 'Reviews, downloads, delete account', route: '/account/…', p: 3, link: '/account/profile', status: 'Reuses layout' },
  { area: 'Account', page: 'Guest order status', route: '/guest/orderstatus', p: 3, link: '/guest/orderstatus', status: 'Designed' },
  { area: 'Company', page: 'About us', route: '/about', p: 2, link: '/about', status: 'Designed' },
  { area: 'Company', page: 'Contact us', route: '/contact', p: 2, link: '/contact', status: 'Designed' },
  { area: 'Company', page: 'Become a supplier', route: '/become-a-supplier', p: 2, link: '/become-a-supplier', status: 'Designed' },
  { area: 'Company', page: 'Download app', route: '/download-app', p: 2, link: '/download-app', status: 'Designed' },
  { area: 'Company', page: 'Online help + Newsletter', route: '/service', p: 2, link: '/service', status: 'Designed' },
  { area: 'Content', page: 'Blog', route: '/blog', p: 3, link: '/blog', status: 'Template' },
  { area: 'Content', page: 'Region landing pages', route: '/region/<city>', p: 3, link: '/region/hamilton', status: 'Template' },
  { area: 'Content', page: 'CMS pages, Privacy, Terms, Safety & security', route: '/page/<slug>', p: 3, link: '/page/privacy-policy', status: 'Template' },
  { area: 'System', page: '404 page + store switcher', route: '*', p: 3, link: '/this-page-does-not-exist', status: 'Template' },
]

const checklist = [
  'All priority 1 pages designed at 390 px and 1440 px',
  'Header (guest and signed in), mega menu, mobile drawer and footer',
  'Component library page with every component’s variants and states',
  'Product card shown with: photo, placeholder, sale price, long name, configurable product',
  'Empty, loading and error states for cart, search, account lists',
  'Checkout flow clickable end to end with dummy data',
  'Contrast checked on every red button and red text',
  'Voice and chat floating buttons placed on every screen',
  'Every “new feature” (needs backend work) labelled',
  'A one-page summary of the concept’s idea for the client',
]

const newFeatures: { t: string; where: string; data: string; link: string }[] = [
  { t: 'Next-day order cut-off', where: 'Header strip, product page countdown', data: 'Per-route cut-off time and next delivery date for the customer’s postal code', link: pdp },
  { t: 'Per-unit price', where: 'Price component (✦), cards, list rows', data: 'Unit-count attribute per product (e.g. 32 cans) to compute $ / unit', link: '/c/beverage' },
  { t: 'Tier / bulk pricing display', where: 'Product page', data: 'Magento tier prices exposed per customer group in GraphQL', link: pdp },
  { t: 'Live Flyers & Offers', where: 'Flyers page, home offer cards', data: 'Offer entity (deal type, product, regular + offer price, valid from/to) and Warehouse entity (name, service area)', link: '/flyers-offers' },
  { t: 'Delivery time slots', where: 'Checkout — delivery method', data: 'Route capacity + time-slot API per postal code', link: '/checkout' },
  { t: 'Live driver ETA / tracking', where: 'Order detail, dashboard', data: 'Route / driver ETA feed and status timestamps per order', link: '/account/orders' },
  { t: 'Spend insights', where: 'Account dashboard', data: 'Aggregated spend per department per month', link: '/account' },
  { t: 'SMS / WhatsApp notifications', where: 'Account settings', data: 'Notification opt-in + messaging integration', link: '/account/profile' },
]

function Block({ children, sx }: { children: ReactNode; sx?: object }) {
  return <Container sx={{ mt: { xs: 5, md: 8 }, ...(sx ?? {}) }}>{children}</Container>
}

export default function Summary() {
  return (
    <Box>
      {/* Hero */}
      <Box sx={{ position: 'relative', overflow: 'hidden', bgcolor: c.navyDark, color: '#fff' }}>
        <Box component="img" src={photo('market', 1800)} alt="" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.28 }} />
        <Box sx={{ position: 'absolute', inset: 0, background: `linear-gradient(100deg, ${c.navyDark} 30%, rgba(27,25,80,.6))` }} />
        <Container sx={{ position: 'relative', py: { xs: 5, md: 9 } }}>
          <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 2 }}>
            <Crown size={30} color="#fff" />
            <Typography variant="overline" sx={{ color: c.saffron }}>MySupreme redesign · Concept A · for client review</Typography>
          </Stack>
          <Typography variant="h1" sx={{ color: '#fff', fontSize: { xs: 44, md: 72 } }}>Pro Counter</Typography>
          <Typography sx={{ mt: 2, fontSize: { xs: 16, md: 20 }, maxWidth: 820, opacity: 0.92, lineHeight: 1.6 }}>
            A fast, reorder-first counter for busy kitchens. Search and SKU come first, pack sizes are always visible, and the delivery promise follows the buyer from the header to the order tracker — all in a brand-true red and navy with warm, Pinterest-style food photography that makes 4,300 products feel like a market, not a spreadsheet.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 4 }}>
            <Button variant="contained" size="large" component={RouterLink} to="/" endIcon={<ArrowForwardRounded />}>Open the prototype</Button>
            <Button variant="outlined" size="large" component={RouterLink} to="/review/preview" startIcon={<DevicesRounded />} sx={{ color: '#fff', borderColor: 'rgba(255,255,255,.6)', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,.08)' } }}>390 / 1440 preview</Button>
            <Button variant="outlined" size="large" component={RouterLink} to="/review/components" startIcon={<WidgetsOutlined />} sx={{ color: '#fff', borderColor: 'rgba(255,255,255,.6)', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,.08)' } }}>Component library</Button>
          </Stack>
        </Container>
      </Box>

      {/* How to review */}
      <Container sx={{ mt: { xs: -3, md: -4 }, position: 'relative' }}>
        <Panel sx={{ boxShadow: tokens.shadow.pop, borderColor: 'transparent', display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'auto 1fr' }, alignItems: 'center' }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box sx={{ width: 48, height: 48, borderRadius: `${tokens.radius.md}px`, bgcolor: c.navyTint, color: c.navy, display: 'grid', placeItems: 'center' }}><ToggleOnOutlined /></Box>
            <Typography variant="h5">How to review</Typography>
          </Stack>
          <Typography color="text.secondary">
            Use the black bar at the very top of every screen: <b>Signed in</b> switches between guest and business-customer views (header, prices, checkout), <b>Loading</b> shows the skeletons for personalised blocks, <b>Empty</b> shows the empty states (cart, favourites, orders, invoices), and <b>Jump to page</b> opens any screen. Everything is clickable with dummy data — add to cart, check out, reorder.
          </Typography>
        </Panel>
      </Container>

      <Block>
        <SectionHeader eyebrow="Design principles" title="Six ideas behind every screen" />
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3,1fr)' } }}>
          {principles.map((p, i) => (
            <Box key={p.t} sx={{ p: 3, bgcolor: '#fff', border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.lg}px` }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box sx={{ width: 48, height: 48, borderRadius: `${tokens.radius.md}px`, bgcolor: c.redTint, color: c.red, display: 'grid', placeItems: 'center' }}>{p.icon}</Box>
                <Typography sx={{ fontFamily: tokens.font.mono, color: c.text3, fontSize: 13 }}>0{i + 1}</Typography>
              </Stack>
              <Typography variant="h4" sx={{ mt: 2, mb: 0.75 }}>{p.t}</Typography>
              <Typography variant="body2" color="text.secondary">{p.b}</Typography>
            </Box>
          ))}
        </Box>
      </Block>

      <Block>
        <SectionHeader eyebrow="What changes" title="Today → Pro Counter" />
        <Box sx={{ bgcolor: '#fff', border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.lg}px`, overflow: 'hidden' }}>
          <Box sx={{ display: { xs: 'none', md: 'grid' }, gridTemplateColumns: '1fr 1fr', bgcolor: c.bg, px: 3, py: 1.5, fontWeight: 700, fontSize: 13, color: c.text2 }}>
            <span>Today</span><span>Concept A</span>
          </Box>
          {beforeAfter.map(([a, b]) => (
            <Box key={a} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 0.75, md: 3 }, px: 3, py: 2, borderTop: `1px solid ${c.line}` }}>
              <Typography sx={{ color: c.text2, fontSize: 14.5 }}><Box component="span" sx={{ display: { md: 'none' }, fontWeight: 700 }}>Today: </Box>{a}</Typography>
              <Stack direction="row" spacing={1}><CheckCircleRounded sx={{ color: c.successText, fontSize: 20, mt: 0.25 }} /><Typography sx={{ fontWeight: 600, fontSize: 14.5 }}>{b}</Typography></Stack>
            </Box>
          ))}
        </Box>
      </Block>

      <Block>
        <SectionHeader eyebrow="Page inventory" title="All pages in the brief" />
        <Typography color="text.secondary" sx={{ mb: 2.5, maxWidth: 820 }}>Every page from the brief’s 7 areas (42 designable pages, some grouped as in the brief). Priority 1 pages are fully designed at 390 px and 1440 px; priority 3 pages share one template family. Click any row to open the screen.</Typography>
        <Box sx={{ bgcolor: '#fff', border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.lg}px`, overflowX: 'auto' }}>
          <Table sx={{ minWidth: 720 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: c.bg }}>
                {['Area', 'Page', 'Route', 'Priority', 'Status', ''].map((h) => <TableCell key={h} sx={{ fontWeight: 600, fontSize: 12.5, color: c.text2 }}>{h}</TableCell>)}
              </TableRow>
            </TableHead>
            <TableBody>
              {inventory.map((r, i) => (
                <TableRow key={r.page} hover sx={{ '& td': { fontSize: 14 } }}>
                  <TableCell sx={{ color: c.text2, fontWeight: 600, borderTop: i && inventory[i - 1].area !== r.area ? `2px solid ${c.line2}` : undefined }}>{i === 0 || inventory[i - 1].area !== r.area ? r.area : ''}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{r.page}</TableCell>
                  <TableCell><Box component="code" sx={{ fontFamily: tokens.font.mono, fontSize: 12, color: c.navy }}>{r.route}</Box></TableCell>
                  <TableCell><Chip size="small" label={`P${r.p}`} sx={{ bgcolor: r.p === 1 ? c.redTint : r.p === 2 ? c.navyTint : c.surface2, color: r.p === 1 ? c.red : r.p === 2 ? c.navy : c.text2 }} /></TableCell>
                  <TableCell><Stack direction="row" spacing={0.75} alignItems="center"><CheckCircleRounded sx={{ fontSize: 16, color: r.status === 'Designed' ? c.successText : c.info }} /><span>{r.status}</span></Stack></TableCell>
                  <TableCell align="right">{r.link && <Button size="small" component={RouterLink} to={r.link} endIcon={<ArrowForwardRounded />} sx={{ color: c.red }}>Open</Button>}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Block>

      <Block>
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: '1fr 1.3fr' }, alignItems: 'start' }}>
          <Box>
            <SectionHeader eyebrow="Brief checklist" title="Ready for review" />
            <Panel>
              <Stack spacing={1.5}>
                {checklist.map((t) => (
                  <Stack key={t} direction="row" spacing={1.25} alignItems="flex-start">
                    <CheckCircleRounded sx={{ color: c.successText, mt: 0.15 }} />
                    <Typography sx={{ fontSize: 14.5 }}>{t}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Panel>
          </Box>
          <Box>
            <SectionHeader eyebrow={<Stack direction="row" spacing={1} alignItems="center" component="span"><AutoAwesomeRounded sx={{ fontSize: 14 }} /><span>Costed separately</span></Stack>} title="New features (need backend work)" />
            <Typography color="text.secondary" sx={{ mb: 2 }}>Everything else uses data Magento already returns. These are marked with <NewFeatureTag /> or ✦ in the prototype.</Typography>
            <Stack spacing={1.25}>
              {newFeatures.map((f) => (
                <Box key={f.t} component={RouterLink} to={f.link} sx={{ display: 'block', p: 2, bgcolor: '#fff', border: `1px solid ${c.line}`, borderLeft: '4px solid #A855F7', borderRadius: `${tokens.radius.md}px`, textDecoration: 'none', color: c.ink, '&:hover': { boxShadow: tokens.shadow.hover } }}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={0.5}>
                    <Typography sx={{ fontWeight: 700 }}>{f.t}</Typography>
                    <Typography variant="caption" color="text.secondary">{f.where}</Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}><b style={{ color: c.text2 }}>Data needed:</b> {f.data}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>
      </Block>

      <Block>
        <SectionHeader eyebrow="Hand-off notes" title="If the client picks Pro Counter" action="Component library" href="/review/components" />
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', xl: 'repeat(4,1fr)' } }}>
          {[
            ['Tokens', 'Colours, type scale, radius (6/10/14/20/28/pill), 8px spacing, three shadows and the MUI breakpoints 500/800/1100/1500 live in one theme file and map 1:1 to the GraphCommerce MUI theme.'],
            ['Fonts', 'Poppins (already self-hosted). One extra font: JetBrains Mono 500 for SKUs only (~20 KB) — or fall back to ui-monospace with no download.'],
            ['Libraries', 'None beyond MUI v5 + Emotion. Carousels are CSS scroll-snap (or the existing Swiper); no heavy motion, 3D or video.'],
            ['Interactions', 'Cards lift 2px with a soft shadow on hover; sticky header with category bar; sticky checkout CTA on mobile clears both floating buttons; mega menu opens on hover/focus; hero autoplay stops under reduced motion.'],
          ].map(([t, b]) => (
            <Panel key={t}><Typography variant="h5" sx={{ mb: 1 }}>{t}</Typography><Typography variant="body2" color="text.secondary">{b}</Typography></Panel>
          ))}
        </Box>
      </Block>
    </Box>
  )
}
