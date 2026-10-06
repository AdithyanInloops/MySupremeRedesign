import { useEffect, useRef, useState } from 'react'
import { Box, Button, IconButton, MenuItem, Stack, TextField, Tooltip, Typography } from '@mui/material'
import { Link as RouterLink, useSearchParams } from 'react-router-dom'
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded'
import RefreshRounded from '@mui/icons-material/RefreshRounded'
import OpenInNewRounded from '@mui/icons-material/OpenInNewRounded'
import PhoneIphoneRounded from '@mui/icons-material/PhoneIphoneRounded'
import DesktopWindowsOutlined from '@mui/icons-material/DesktopWindowsOutlined'
import { tokens } from '../../theme'
import { productBySku } from '../../data/catalog'
import { Crown } from '../../components/Brand'

const c = tokens.color

const pages: [string, string][] = [
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
  ['Become a supplier', '/become-a-supplier'],
  ['Download app', '/download-app'],
  ['Online help', '/service'],
  ['CMS page', '/page/privacy-policy'],
  ['Region landing', '/region/hamilton'],
  ['404', '/this-page-does-not-exist'],
  ['Concept summary', '/review/summary'],
  ['Component library', '/review/components'],
]

/** Presentation view: the same route at 390 px (phone) and 1440 px (scaled desktop), side by side. */
export default function Preview() {
  const [params, setParams] = useSearchParams()
  const route = params.get('page') ?? '/'
  const [nonce, setNonce] = useState(0)
  const deskWrap = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.6)

  useEffect(() => {
    const el = deskWrap.current
    if (!el) return
    const ro = new ResizeObserver(() => setScale(Math.min(1, el.clientWidth / 1440)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const src = `${window.location.pathname}#${route}`
  const deskH = 900
  const label = pages.find(([, r]) => r === route)?.[0] ?? route
  const idx = pages.findIndex(([, r]) => r === route)
  const go = (r: string) => setParams({ page: r })

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0B0B12', color: '#fff', backgroundImage: 'radial-gradient(1200px 600px at 80% -10%, rgba(213,0,0,.22), transparent 60%), radial-gradient(900px 500px at 0% 110%, rgba(45,41,125,.5), transparent 60%)' }}>
      <Box sx={{ maxWidth: 1800, mx: 'auto', px: { xs: 2, md: 4 }, py: 2.5 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }} justifyContent="space-between">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Button component={RouterLink} to={route} startIcon={<ArrowBackRounded />} sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,.08)', '&:hover': { bgcolor: 'rgba(255,255,255,.16)' } }}>Back to prototype</Button>
            <Crown size={26} color="#fff" />
            <Box>
              <Typography sx={{ fontWeight: 700, lineHeight: 1.2 }}>Concept A · “Pro Counter”</Typography>
              <Typography sx={{ fontSize: 12.5, opacity: 0.7 }}>Responsive preview · 390 px and 1440 px</Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button disabled={idx <= 0} onClick={() => go(pages[idx - 1][1])} sx={{ color: '#fff', minWidth: 44, '&.Mui-disabled': { color: 'rgba(255,255,255,.3)' } }} aria-label="Previous page">‹</Button>
            <TextField select size="small" value={idx >= 0 ? route : ''} onChange={(e) => go(e.target.value)} label="Page"
              sx={{ minWidth: 260, '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,.06)', color: '#fff' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,.25) !important' }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,.7) !important' }, '& .MuiSvgIcon-root': { color: '#fff' } }}>
              {pages.map(([t, r]) => <MenuItem key={r} value={r}>{t}</MenuItem>)}
            </TextField>
            <Button disabled={idx < 0 || idx >= pages.length - 1} onClick={() => go(pages[idx + 1][1])} sx={{ color: '#fff', minWidth: 44, '&.Mui-disabled': { color: 'rgba(255,255,255,.3)' } }} aria-label="Next page">›</Button>
            <Tooltip title="Reload both"><IconButton onClick={() => setNonce((n) => n + 1)} sx={{ color: '#fff' }} aria-label="Reload frames"><RefreshRounded /></IconButton></Tooltip>
            <Tooltip title="Open full page"><IconButton component={RouterLink} to={route} sx={{ color: '#fff' }} aria-label="Open full page"><OpenInNewRounded /></IconButton></Tooltip>
          </Stack>
        </Stack>

        <Box sx={{ display: 'grid', gap: { xs: 3, lg: 5 }, gridTemplateColumns: { xs: '1fr', lg: '430px minmax(0,1fr)' }, alignItems: 'start', mt: 3 }}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5, opacity: 0.8, justifyContent: 'center' }}>
              <PhoneIphoneRounded sx={{ fontSize: 18 }} /><Typography sx={{ fontSize: 13, fontWeight: 600 }}>Mobile · 390 × 844</Typography>
            </Stack>
            <Box sx={{ width: 414, mx: 'auto', p: 1.5, borderRadius: '54px', bgcolor: '#1A1A22', boxShadow: '0 40px 80px -30px rgba(0,0,0,.8), inset 0 0 0 2px #2A2A35', position: 'relative', maxWidth: '100%' }}>
              <Box sx={{ position: 'absolute', top: 26, left: '50%', transform: 'translateX(-50%)', width: 110, height: 30, borderRadius: 999, bgcolor: '#000', zIndex: 2 }} />
              <Box sx={{ borderRadius: '42px', overflow: 'hidden', bgcolor: '#fff', width: 390, maxWidth: '100%' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ height: 50, px: 4, bgcolor: '#0B0B12', color: '#fff', fontSize: 13, fontWeight: 600 }}><span>9:41</span><span>●●● 5G</span></Stack>
                <Box component="iframe" key={`m-${route}-${nonce}`} title={`${label} — mobile 390px`} src={src} sx={{ width: 390, height: 844, border: 0, display: 'block' }} />
              </Box>
            </Box>
          </Box>
          <Box ref={deskWrap} sx={{ minWidth: 0 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5, opacity: 0.8, justifyContent: 'center' }}>
              <DesktopWindowsOutlined sx={{ fontSize: 18 }} /><Typography sx={{ fontSize: 13, fontWeight: 600 }}>Desktop · 1440 × {deskH} · shown at {Math.round(scale * 100)}%</Typography>
            </Stack>
            <Box sx={{ borderRadius: '14px', overflow: 'hidden', bgcolor: '#1A1A22', boxShadow: '0 40px 80px -30px rgba(0,0,0,.8)', border: '1px solid #2A2A35' }}>
              <Stack direction="row" spacing={0.75} alignItems="center" sx={{ px: 1.5, height: 34, bgcolor: '#16161D' }}>
                {['#FF5F57', '#FEBC2E', '#28C840'].map((col) => <Box key={col} sx={{ width: 11, height: 11, borderRadius: '50%', bgcolor: col }} />)}
                <Box sx={{ ml: 1.5, flex: 1, height: 22, borderRadius: 1, bgcolor: '#0B0B12', fontSize: 11.5, color: 'rgba(255,255,255,.6)', display: 'flex', alignItems: 'center', px: 1.25, overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  mysupreme.ca{route === '/' ? '' : route.replace('/c/', '/')}
                </Box>
              </Stack>
              <Box sx={{ height: deskH * scale, overflow: 'hidden', bgcolor: '#fff' }}>
                <Box component="iframe" key={`d-${route}-${nonce}`} title={`${label} — desktop 1440px`} src={src}
                  sx={{ width: 1440, height: deskH, border: 0, display: 'block', transform: `scale(${scale})`, transformOrigin: '0 0' }} />
              </Box>
            </Box>
            <Typography sx={{ mt: 1.5, fontSize: 12.5, opacity: 0.65, textAlign: 'center' }}>Both frames are live — scroll, click and add to cart inside them. Toggle signed-in / loading / empty from the full prototype’s review bar.</Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ height: 24 }} />
    </Box>
  )
}
