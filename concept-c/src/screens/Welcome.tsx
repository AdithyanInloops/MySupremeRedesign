import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { Box, Button, Typography } from '@mui/material'
import { tokens, srOnly } from '../theme'
import { useApp } from '../state/app'
import { photo } from '../data/catalog'
import { Logo } from '../components/ui'
import { RotateCcwIcon, TruckIcon, WalletIcon } from '../components/icons'
import { useDragScroll } from '../components/useDragScroll'

const c = tokens.color

const slides = [
  { icon: RotateCcwIcon, title: 'Reorder your usuals in seconds', body: 'Last orders, favourites and SKUs one tap away. Scan a barcode on your shelf to add it straight to the cart.' },
  { icon: TruckIcon, title: 'Know exactly when it arrives', body: 'Live delivery tracking across the GTA, Hamilton & Niagara, with cut-off times and delivery windows up front.' },
  { icon: WalletIcon, title: 'Business prices & Net 30 credit', body: 'Your customer-group prices, invoices and available credit in one place — pay an invoice right from the app.' },
]

/** First run: brand moment + three value slides (swipe), then sign in, open an account or browse as a guest. */
export default function Welcome() {
  const { continueAsGuest } = useApp()
  const navigate = useNavigate()
  const [i, setI] = useState(0)
  const { ref: track, ...drag } = useDragScroll<HTMLDivElement>()
  const go = (n: number) => track.current?.scrollTo({ left: n * track.current.clientWidth, behavior: 'smooth' })

  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: c.navyDark, color: '#fff', display: 'flex', flexDirection: 'column' }}>
      <Typography component="h1" sx={srOnly}>Welcome to the MySupreme app</Typography>
      <Box sx={{ position: 'relative', height: { xs: '46dvh' }, minHeight: 280, maxHeight: 420, flexShrink: 0 }}>
        <Box component="img" src={photo('chef', 900)} alt="" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <Box sx={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, rgba(27,25,80,.55) 0%, rgba(27,25,80,.1) 35%, ${c.navyDark} 100%)` }} />
        <Box sx={{ position: 'absolute', top: 'calc(20px + env(safe-area-inset-top))', left: 20 }}><Logo inverse size="lg" /></Box>
        <Box sx={{ position: 'absolute', left: 20, bottom: 12, display: 'inline-flex', alignItems: 'center', gap: 0.75, px: 1.25, py: 0.5, borderRadius: 999, bgcolor: 'rgba(255,255,255,.14)', backdropFilter: 'blur(6px)', fontSize: 12, fontWeight: 600 }}>
          <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: c.success }} /> 4,300+ products · Same & next-day delivery
        </Box>
      </Box>

      <Box
        ref={track}
        {...drag}
        className="no-scrollbar"
        onScroll={(e) => { const el = e.currentTarget; setI(Math.round(el.scrollLeft / el.clientWidth)) }}
        aria-roledescription="carousel"
        aria-label="What you can do in the app"
        sx={{ display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory', flex: 1, minHeight: 190 }}
      >
        {slides.map((s, k) => {
          const Icon = s.icon
          return (
            <Box key={s.title} role="group" aria-label={`${k + 1} of ${slides.length}`} sx={{ flex: '0 0 100%', scrollSnapAlign: 'start', px: 3, pt: 2.5 }}>
              <Box sx={{ width: 48, height: 48, borderRadius: `${tokens.radius.sm}px`, bgcolor: c.saffron, color: c.ink, display: 'grid', placeItems: 'center', mb: 2 }}><Icon /></Box>
              <Typography component="h2" sx={{ fontSize: 26, fontWeight: 800, lineHeight: 1.15, letterSpacing: '-.02em' }}>{s.title}</Typography>
              <Typography sx={{ mt: 1.25, fontSize: 15, color: 'rgba(255,255,255,.78)', lineHeight: 1.55 }}>{s.body}</Typography>
            </Box>
          )
        })}
      </Box>

      <Box sx={{ display: 'flex', px: 2.25, py: 1 }}>
        {slides.map((s, k) => (
          <Box key={s.title} component="button" onClick={() => go(k)} aria-label={`Show slide ${k + 1}`} aria-current={k === i ? 'true' : undefined}
            sx={{ all: 'unset', cursor: 'pointer', height: 28, minWidth: 24, px: 0.5, display: 'grid', placeItems: 'center', borderRadius: 2, '&:focus-visible': { outline: '2px solid #fff' } }}>
            <Box sx={{ height: 6, width: k === i ? 26 : 6, borderRadius: 3, bgcolor: k === i ? c.saffron : 'rgba(255,255,255,.35)', transition: 'width .25s' }} />
          </Box>
        ))}
      </Box>

      <Box sx={{ px: 3, pb: 'calc(24px + env(safe-area-inset-bottom))', display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        <Button component={RouterLink} to="/signin" variant="contained" size="large" fullWidth>Sign in</Button>
        <Button component={RouterLink} to="/signin?mode=register" size="large" fullWidth sx={{ color: '#fff', border: '1.5px solid rgba(255,255,255,.5)', '&:hover': { bgcolor: 'rgba(255,255,255,.08)' } }}>Open a business account</Button>
        <Button onClick={() => { continueAsGuest(); navigate('/') }} sx={{ color: 'rgba(255,255,255,.85)' }}>Browse as a guest</Button>
      </Box>
    </Box>
  )
}
