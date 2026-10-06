import { useEffect, useState, type ReactNode } from 'react'
import { Box, Button, Dialog, DialogContent, Fab, IconButton, Menu, MenuItem, Stack, Switch, Tooltip, Typography, FormControlLabel } from '@mui/material'
import { Link as RouterLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import MicRounded from '@mui/icons-material/MicRounded'
import ChatBubbleRounded from '@mui/icons-material/ChatBubbleRounded'
import CloseRounded from '@mui/icons-material/CloseRounded'
import ViewQuiltOutlined from '@mui/icons-material/ViewQuiltOutlined'
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded'
import { tokens } from '../theme'
import { useApp } from '../state/AppState'
import Header from './Header'
import Footer from './Footer'
import { photo, productBySku } from '../data/catalog'

const c = tokens.color

/** Bottom-left voice assistant + bottom-right Botpress chat. Sticky bars reserve 80px each side. */
export function FloatingSupport() {
  return (
    <>
      <Tooltip title="Voice assistant" placement="right">
        <Fab aria-label="Open voice assistant" sx={{ position: 'fixed', left: 16, bottom: 16, zIndex: 1250, bgcolor: c.red, color: '#fff', width: 56, height: 56, '&:hover': { bgcolor: c.redDark }, boxShadow: tokens.shadow.pop }}>
          <MicRounded />
        </Fab>
      </Tooltip>
      <Tooltip title="Chat with us" placement="left">
        <Fab aria-label="Open chat" sx={{ position: 'fixed', right: 16, bottom: 16, zIndex: 1250, bgcolor: c.navy, color: '#fff', width: 56, height: 56, '&:hover': { bgcolor: c.navyDark }, boxShadow: tokens.shadow.pop }}>
          <ChatBubbleRounded />
        </Fab>
      </Tooltip>
    </>
  )
}

/** Plasmic promo popup — home page only, on/off from Magento admin. */
function PromoPopup() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (pathname !== '/') return
    let seen = false
    try { seen = sessionStorage.getItem('ms-promo') === '1' } catch { /* storage blocked */ }
    if (seen) return
    const t = window.setTimeout(() => setOpen(true), 2500)
    return () => window.clearTimeout(t)
  }, [pathname])
  const close = () => {
    setOpen(false)
    try { sessionStorage.setItem('ms-promo', '1') } catch { /* storage blocked */ }
  }
  return (
    <Dialog open={open} onClose={close} maxWidth="sm" fullWidth PaperProps={{ sx: { overflow: 'hidden' } }}>
      <IconButton aria-label="Close offer" onClick={close} sx={{ position: 'absolute', right: 10, top: 10, zIndex: 1, bgcolor: 'rgba(255,255,255,.9)', '&:hover': { bgcolor: '#fff' } }}>
        <CloseRounded />
      </IconButton>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
        <Box component="img" src={photo('steak', 700, 700)} alt="Fries and steak on a plate" sx={{ width: '100%', height: { xs: 180, sm: '100%' }, objectFit: 'cover' }} />
        <DialogContent sx={{ p: { xs: 3, sm: 4 }, bgcolor: c.navy, color: '#fff' }}>
          <Typography variant="overline" sx={{ color: c.saffron }}>First online order</Typography>
          <Typography variant="h2" sx={{ color: '#fff', my: 1 }}>$25 off orders over $250</Typography>
          <Typography sx={{ opacity: 0.85, mb: 3 }}>Use code at checkout. Valid on delivery orders across the GTA, Hamilton &amp; Niagara.</Typography>
          <Box sx={{ border: '2px dashed rgba(255,255,255,.5)', borderRadius: `${tokens.radius.sm}px`, p: 1.5, textAlign: 'center', fontFamily: tokens.font.mono, fontWeight: 600, fontSize: 20, letterSpacing: '.12em', mb: 2 }}>KITCHEN25</Box>
          <Button fullWidth variant="contained" size="large" onClick={close} sx={{ bgcolor: '#fff', color: c.red, '&:hover': { bgcolor: c.redTint } }}>Start shopping</Button>
        </DialogContent>
      </Box>
    </Dialog>
  )
}

const reviewPages: [string, string][] = [
  ['Concept summary', '/review/summary'],
  ['Component library', '/review/components'],
  ['Responsive preview (390 / 1440)', '/review/preview'],
  ['—', ''],
  ['Home', '/'],
  ['Category listing', '/c/packaging'],
  ['Search results', '/search/monin'],
  ['Search — no results', '/search/truffle%20caviar'],
  ['Product detail', '/p/' + (productBySku('A905')?.slug ?? '')],
  ['All categories', '/all-categories'],
  ['Brands', '/brands'],
  ['Flyers & Offers', '/flyers-offers'],
  ['Favorites', '/wishlist'],
  ['Cart', '/cart'],
  ['Checkout — shipping', '/checkout'],
  ['Checkout — payment', '/checkout/payment'],
  ['Order success', '/checkout/success'],
  ['Sign in / create account', '/account/signin'],
  ['Account dashboard', '/account'],
  ['Orders', '/account/orders'],
  ['Credit dashboard', '/account/customerdashbord'],
  ['Addresses', '/account/addresses'],
  ['Guest order status', '/guest/orderstatus'],
  ['About us', '/about'],
  ['Contact', '/contact'],
  ['CMS page', '/page/privacy-policy'],
  ['404', '/this-page-does-not-exist'],
]

/** Prototype-only bar so the client can flip guest/signed-in, loading and empty states on any screen. */
function ReviewBar() {
  const { review, setReview } = useApp()
  const nav = useNavigate()
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const sw = (label: string, key: 'signedIn' | 'loading' | 'empty') => (
    <FormControlLabel
      control={<Switch size="small" checked={review[key]} onChange={(e) => setReview({ [key]: e.target.checked })} color="warning" />}
      label={label}
      sx={{ m: 0, '& .MuiFormControlLabel-label': { fontSize: 12.5, fontWeight: 500 } }}
    />
  )
  return (
    <Box sx={{ bgcolor: '#0B0B12', color: '#fff', fontSize: 12.5 }} data-review-bar>
      <Box sx={{ maxWidth: tokens.container, mx: 'auto', px: { xs: 1.5, md: 4 }, minHeight: 40, display: 'flex', alignItems: 'center', gap: 2, overflowX: 'auto' }} className="no-scrollbar">
        <Stack direction="row" alignItems="center" spacing={1} sx={{ flexShrink: 0 }}>
          <ViewQuiltOutlined sx={{ fontSize: 18, color: c.saffron }} />
          <Box component="span" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Concept A · “Pro Counter”</Box>
          <Box component="span" sx={{ opacity: 0.6, whiteSpace: 'nowrap', display: { xs: 'none', md: 'inline' } }}>Design review prototype — dummy data</Box>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ ml: 'auto', flexShrink: 0 }}>
          {sw('Signed in', 'signedIn')}
          {sw('Loading', 'loading')}
          {sw('Empty', 'empty')}
          <Button size="small" onClick={(e) => setAnchor(e.currentTarget)} endIcon={<KeyboardArrowDownRounded />} sx={{ color: '#fff', minHeight: 32, bgcolor: 'rgba(255,255,255,.1)', '&:hover': { bgcolor: 'rgba(255,255,255,.18)' } }}>
            Jump to page
          </Button>
        </Stack>
        <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)} slotProps={{ paper: { sx: { maxHeight: 480 } } }}>
          {reviewPages.map(([t, to], i) =>
            t === '—' ? <Box key={i} sx={{ borderTop: `1px solid ${c.line}`, my: 0.5 }} /> : (
              <MenuItem key={to} onClick={() => { setAnchor(null); nav(to) }} sx={{ fontSize: 14, minHeight: 40, fontWeight: i < 3 ? 700 : 400 }}>{t}</MenuItem>
            ),
          )}
        </Menu>
      </Box>
    </Box>
  )
}

/** Scroll to top on route change (matches Next.js behaviour). */
function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function Layout({ children }: { children?: ReactNode }) {
  const { pathname } = useLocation()
  const inEmbed = typeof window !== 'undefined' && window.self !== window.top
  // Cart and checkout hide the footer on mobile so the summary and pay button stay in view.
  const hideFooterMobile = pathname.startsWith('/cart') || (pathname.startsWith('/checkout') && !pathname.includes('success'))
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ScrollTop />
      {!inEmbed && <ReviewBar />}
      <Header />
      <Box component="main" sx={{ flex: 1 }}>{children ?? <Outlet />}</Box>
      <Box sx={{ display: hideFooterMobile ? { xs: 'none', md: 'block' } : 'block' }}><Footer /></Box>
      <FloatingSupport />
      <PromoPopup />
    </Box>
  )
}

export { RouterLink }
