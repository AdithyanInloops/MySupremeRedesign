import { useEffect, useState } from 'react'
import { Box, Button, IconButton, InputBase, Stack, Typography } from '@mui/material'
import BoltRounded from '@mui/icons-material/BoltRounded'
import { Link as RouterLink } from 'react-router-dom'
import ChevronLeftRounded from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded'
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded'
import { tokens } from '../../../theme'
import { heroBanners, productBySku, promoTiles, type Banner } from '../../../data/catalog'
import { useApp } from '../../../state/AppState'

const c = tokens.color

const prefersReduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/** Magento Page Builder banner slide. Overlay copy is optional — slide also works as a pure image. */
function Slide({ b, active }: { b: Banner; active: boolean }) {
  const dark = b.tone !== 'light'
  const overlay =
    b.tone === 'navy'
      ? 'linear-gradient(90deg, rgba(27,25,80,.94) 0%, rgba(27,25,80,.75) 42%, rgba(27,25,80,0) 78%)'
      : b.tone === 'red'
        ? 'linear-gradient(90deg, rgba(163,0,0,.94) 0%, rgba(213,0,0,.7) 42%, rgba(213,0,0,0) 80%)'
        : 'linear-gradient(90deg, rgba(255,255,255,.96) 0%, rgba(255,255,255,.82) 42%, rgba(255,255,255,0) 80%)'
  return (
    <Box
      aria-hidden={!active}
      sx={{ position: 'absolute', inset: 0, opacity: active ? 1 : 0, transition: 'opacity .6s ease', pointerEvents: active ? 'auto' : 'none' }}
    >
      <Box component="img" src={b.image} alt="" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: active ? 'scale(1)' : 'scale(1.04)', transition: 'transform 6s ease' }} />
      <Box sx={{ position: 'absolute', inset: 0, background: { xs: overlay.replace('90deg', '0deg').replace(/78%|80%/, '100%'), md: overlay } }} />
      <Box sx={{ position: 'absolute', left: { xs: 20, md: 48 }, right: { xs: 20, md: 'auto' }, bottom: { xs: 52, md: 'auto' }, top: { md: '50%' }, transform: { md: 'translateY(-50%)' }, maxWidth: 520, color: dark ? '#fff' : c.ink }}>
        <Typography variant="overline" sx={{ color: dark ? c.saffron : c.red, display: 'block', mb: 1 }}>{b.eyebrow}</Typography>
        <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 26, sm: 32, md: 44 }, lineHeight: 1.08, letterSpacing: '-.02em', color: 'inherit' }}>{b.title}</Typography>
        <Typography sx={{ mt: 1.5, fontSize: { xs: 14, md: 16 }, opacity: dark ? 0.9 : 1, color: dark ? '#fff' : c.text2, maxWidth: 440 }}>{b.body}</Typography>
        <Button
          component={RouterLink}
          to={b.href}
          tabIndex={active ? 0 : -1}
          variant="contained"
          size="large"
          endIcon={<ArrowForwardRounded />}
          sx={{ mt: 3, ...(b.tone === 'red' ? { bgcolor: '#fff', color: c.red, '&:hover': { bgcolor: c.redTint } } : {}) }}
        >
          {b.cta}
        </Button>
      </Box>
    </Box>
  )
}

export function HeroSlider() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const n = heroBanners.length
  useEffect(() => {
    if (paused || prefersReduced()) return
    const t = window.setInterval(() => setI((x) => (x + 1) % n), 6000)
    return () => window.clearInterval(t)
  }, [paused, n])
  const arrow = (dir: number) => (
    <IconButton
      aria-label={dir < 0 ? 'Previous banner' : 'Next banner'}
      onClick={() => setI((x) => (x + dir + n) % n)}
      sx={{ width: 44, height: 44, bgcolor: 'rgba(255,255,255,.92)', color: c.ink, '&:hover': { bgcolor: '#fff' }, boxShadow: tokens.shadow.card }}
    >
      {dir < 0 ? <ChevronLeftRounded /> : <ChevronRightRounded />}
    </IconButton>
  )
  return (
    <Box
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured promotions"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      sx={{ position: 'relative', borderRadius: `${tokens.radius.xl}px`, overflow: 'hidden', minHeight: { xs: 420, sm: 400, md: 460 }, height: '100%', bgcolor: c.navy }}
    >
      {heroBanners.map((b, idx) => <Slide key={b.id} b={b} active={idx === i} />)}
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ position: 'absolute', left: { xs: 20, md: 48 }, bottom: { xs: 16, md: 28 }, zIndex: 2 }}>
        {heroBanners.map((b, idx) => (
          <Box
            key={b.id}
            component="button"
            aria-label={`Show banner ${idx + 1} of ${n}`}
            aria-current={idx === i}
            onClick={() => setI(idx)}
            sx={{ border: 0, p: 0, cursor: 'pointer', bgcolor: 'transparent', height: 24, display: 'grid', placeItems: 'center' }}
          >
            <Box sx={{ width: idx === i ? 32 : 10, height: 10, borderRadius: 5, bgcolor: heroBanners[i].tone === 'light' ? (idx === i ? c.navy : 'rgba(45,41,125,.3)') : (idx === i ? '#fff' : 'rgba(255,255,255,.5)'), transition: 'width .3s, background-color .3s' }} />
          </Box>
        ))}
      </Stack>
      <Stack direction="row" spacing={1} sx={{ position: 'absolute', right: { xs: 16, md: 24 }, bottom: { xs: 10, md: 22 }, zIndex: 2, display: { xs: 'none', sm: 'flex' } }}>
        {arrow(-1)}
        {arrow(1)}
      </Stack>
    </Box>
  )
}

export function PromoTile({ t, tall }: { t: (typeof promoTiles)[number]; tall?: boolean }) {
  return (
    <Box
      component={RouterLink}
      to={t.href}
      aria-label={`${t.title} — ${t.cta}`}
      sx={{
        position: 'relative', display: 'block', borderRadius: `${tokens.radius.lg}px`, overflow: 'hidden', minHeight: tall ? 220 : 180, height: '100%',
        textDecoration: 'none', color: '#fff', bgcolor: c.navy,
        '&:hover img': { transform: 'scale(1.05)' }, '&:hover .cta': { gap: 1.25 },
        '&:focus-visible': { outline: `3px solid ${c.navy}`, outlineOffset: 3 },
      }}
    >
      <Box component="img" src={t.image} alt="" loading="lazy" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .5s ease' }} />
      <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(17,24,39,0) 25%, rgba(17,24,39,.85) 100%)' }} />
      <Box sx={{ position: 'absolute', left: 20, right: 20, bottom: 18 }}>
        <Typography sx={{ fontSize: 12.5, fontWeight: 500, opacity: 0.9 }}>{t.body}</Typography>
        <Typography sx={{ fontSize: 21, fontWeight: 700, lineHeight: 1.2 }}>{t.title}</Typography>
        <Box className="cta" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, mt: 1, fontSize: 13.5, fontWeight: 600, color: c.saffron, transition: 'gap .2s' }}>
          {t.cta} <ArrowForwardRounded sx={{ fontSize: 17 }} />
        </Box>
      </Box>
    </Box>
  )
}

/** Bento hero: slider (2/3) + two stacked promo tiles. Mobile: slider, then tiles in a scroll row. */
export function HeroBento() {
  return (
    <Box sx={{ display: 'grid', gap: { xs: 1.5, md: 2 }, gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' } }}>
      <HeroSlider />
      <Box
        className="no-scrollbar"
        sx={{
          display: 'grid', gap: { xs: 1.5, md: 2 },
          gridTemplateRows: { lg: '1fr 1fr' },
          gridAutoFlow: { xs: 'column', lg: 'row' },
          gridAutoColumns: { xs: '78%', sm: '48%', lg: 'auto' },
          overflowX: { xs: 'auto', lg: 'visible' }, scrollSnapType: 'x mandatory',
          mx: { xs: -2, md: 0 }, px: { xs: 2, md: 0 }, scrollPaddingInline: { xs: 16, md: 0 },
          '& > *': { scrollSnapAlign: 'start' },
        }}
      >
        <QuickOrder />
        <PromoTile t={promoTiles[0]} />
      </Box>
    </Box>
  )
}

/** Quick order by SKU — front-end only (uses existing product lookup + add to cart). */
export function QuickOrder() {
  const { addToCart } = useApp()
  const [sku, setSku] = useState('')
  const [qty, setQty] = useState('1')
  const [err, setErr] = useState('')
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const p = productBySku(sku.trim().toUpperCase()) ?? productBySku(sku.trim())
    if (!p) return setErr(`No product with SKU “${sku || '—'}”. Try BM0089 or A905.`)
    if (p.type !== 'simple') return setErr(`${p.sku} has options — open the product to choose.`)
    setErr('')
    addToCart(p.sku, Math.max(1, parseInt(qty || '1', 10)))
    setSku('')
    setQty('1')
  }
  const field = { bgcolor: '#fff', borderRadius: `${tokens.radius.sm}px`, px: 1.5, height: 48, fontSize: 15, border: `1.5px solid transparent`, '&.Mui-focused': { borderColor: c.saffron } }
  return (
    <Box component="form" onSubmit={submit} sx={{ position: 'relative', overflow: 'hidden', borderRadius: `${tokens.radius.lg}px`, bgcolor: c.navy, color: '#fff', p: { xs: 2.25, md: 2.75 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 180 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ color: c.saffron }}>
        <BoltRounded sx={{ fontSize: 20 }} />
        <Typography variant="overline" sx={{ color: c.saffron }}>Quick order</Typography>
      </Stack>
      <Typography sx={{ fontWeight: 700, fontSize: 20, lineHeight: 1.2, mt: 0.25 }}>Know the SKU? Add it straight to cart.</Typography>
      <Stack direction="row" spacing={1} sx={{ mt: 1.75 }}>
        <InputBase value={sku} onChange={(e) => { setSku(e.target.value); setErr('') }} placeholder="BM0089" inputProps={{ 'aria-label': 'SKU', style: { fontFamily: tokens.font.mono } }} sx={{ ...field, flex: 1, minWidth: 0 }} />
        <InputBase value={qty} onChange={(e) => setQty(e.target.value.replace(/\D/g, ''))} inputProps={{ 'aria-label': 'Quantity', inputMode: 'numeric', style: { textAlign: 'center' } }} sx={{ ...field, width: 60, px: 0.5 }} />
        <Button type="submit" variant="contained" sx={{ minWidth: 64, height: 48 }}>Add</Button>
      </Stack>
      <Typography role="status" sx={{ fontSize: 12.5, mt: 1, minHeight: 18, color: err ? '#FFC9C4' : 'rgba(255,255,255,.75)' }}>
        {err || 'Tip: scan or paste a barcode — 17-digit SKUs work too.'}
      </Typography>
    </Box>
  )
}
