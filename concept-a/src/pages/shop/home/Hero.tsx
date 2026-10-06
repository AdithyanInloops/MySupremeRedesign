import { useEffect, useState } from 'react'
import { Box, Button, Dialog, DialogContent, IconButton, InputBase, Stack, Typography } from '@mui/material'
import BoltRounded from '@mui/icons-material/BoltRounded'
import { Link as RouterLink } from 'react-router-dom'
import ChevronLeftRounded from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded'
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded'
import ListAltRounded from '@mui/icons-material/ListAltRounded'
import QrCodeScannerRounded from '@mui/icons-material/QrCodeScannerRounded'
import AddShoppingCartRounded from '@mui/icons-material/AddShoppingCartRounded'
import ErrorOutlineRounded from '@mui/icons-material/ErrorOutlineRounded'
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded'
import CloseRounded from '@mui/icons-material/CloseRounded'
import { tokens } from '../../../theme'
import { heroBanners, money, productBySku, promoTiles, recommended, searchProducts, type Banner } from '../../../data/catalog'
import { orders } from '../../../data/account'
import { ProductImage } from '../../../components/Brand'
import { QtyStepper } from '../../../components/Commerce'
import { PackChip } from '../../../components/ui'
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

/**
 * Bento hero: slider (2/3) + quick-order pad and one promo tile stacked on desktop.
 * Below 1100px the pad and tile sit side by side under the slider (stacked under 800px) — no scroll row.
 */
export function HeroBento() {
  return (
    <Box sx={{ display: 'grid', gap: { xs: 1.5, md: 2 }, gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' } }}>
      <HeroSlider />
      <Box sx={{ display: 'grid', gap: { xs: 1.5, md: 2 }, gridTemplateColumns: { xs: '1fr', md: '1.35fr 1fr', lg: '1fr' }, gridTemplateRows: { lg: 'auto 1fr' } }}>
        <QuickOrder />
        <PromoTile t={promoTiles[0]} />
      </Box>
    </Box>
  )
}

/* ------------------------------------------------------------------ Quick order pad */

const findProduct = (q: string) => {
  const t = q.trim()
  if (!t) return undefined
  return productBySku(t.toUpperCase()) ?? productBySku(t) ?? searchProducts(t)[0]
}

/**
 * Quick order pad — front-end only: existing product lookup + addProductsToCart, no new backend data.
 * Live match preview as you type, one-tap "usuals" (last order when signed in, popular SKUs for guests)
 * and a paste-a-list dialog for adding a whole order sheet at once.
 */
export function QuickOrder() {
  const { addToCart, review, priceFor } = useApp()
  const [sku, setSku] = useState('')
  const [qty, setQty] = useState(1)
  const [paste, setPaste] = useState(false)

  const usuals = (review.signedIn ? orders[0].items.map((i) => i.sku) : recommended.map((p) => p.sku))
    .map((s) => productBySku(s)!)
    .filter((p) => p.type === 'simple')
    .slice(0, 4)

  const match = findProduct(sku)
  const problem = !sku.trim()
    ? ''
    : !match
      ? `No product matches “${sku.trim()}”. Check the SKU or try the search bar.`
      : match.type !== 'simple'
        ? 'This product has options — choose a size on the product page.'
        : match.stock === 'OUT_OF_STOCK'
          ? 'Out of stock right now — back soon.'
          : ''

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!match || problem) return
    addToCart(match.sku, qty)
    setSku('')
    setQty(1)
  }

  return (
    <Box
      component="form"
      onSubmit={submit}
      aria-labelledby="qo-title"
      sx={{
        position: 'relative', overflow: 'hidden', borderRadius: `${tokens.radius.lg}px`, bgcolor: '#fff', border: `1px solid ${c.line}`,
        p: { xs: 2, md: 2.25 }, display: 'flex', flexDirection: 'column', gap: 1.5,
        backgroundImage: `radial-gradient(260px 160px at 100% 0%, ${c.redTint} 0%, rgba(255,240,238,0) 70%)`,
      }}
    >
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={1.25}>
        <Box sx={{ width: 40, height: 40, borderRadius: `${tokens.radius.sm}px`, bgcolor: c.red, color: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <BoltRounded />
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography id="qo-title" component="h2" sx={{ fontWeight: 700, fontSize: 17, lineHeight: 1.2, color: c.ink }}>Quick order</Typography>
          <Typography sx={{ fontSize: 12.5, color: c.text2 }}>Type a SKU or scan a barcode</Typography>
        </Box>
        <Button size="small" startIcon={<ListAltRounded />} onClick={() => setPaste(true)} sx={{ color: c.navy, flexShrink: 0 }}>
          Paste a list
        </Button>
      </Stack>

      {/* Entry row */}
      <Stack direction="row" spacing={1} alignItems="stretch">
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            flex: 1, minWidth: 0, height: 48, pl: 1.5, pr: 0.5, borderRadius: `${tokens.radius.sm}px`, bgcolor: '#fff',
            border: `1.5px solid ${problem ? c.error : c.line2}`, '&:focus-within': { borderColor: problem ? c.error : c.navy, boxShadow: `0 0 0 3px ${problem ? c.errorTint : c.navyTint}` },
          }}
        >
          <Box component="span" sx={{ fontFamily: tokens.font.mono, fontSize: 12, fontWeight: 600, color: c.text3, mr: 1 }}>SKU</Box>
          <InputBase
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="e.g. BM0089"
            inputProps={{ 'aria-label': 'SKU or barcode', 'aria-describedby': 'qo-status', autoComplete: 'off', spellCheck: false, style: { fontFamily: tokens.font.mono, fontSize: 14.5 } }}
            sx={{ flex: 1, minWidth: 0 }}
          />
          <IconButton aria-label="Scan a barcode" sx={{ width: 40, height: 40, color: c.navy }}>
            <QrCodeScannerRounded fontSize="small" />
          </IconButton>
        </Stack>
        <QtyStepper value={qty} onChange={setQty} size="md" label="Quick order quantity" />
      </Stack>

      {/* Live match / usuals */}
      <Box id="qo-status" role="status" aria-live="polite" sx={{ minHeight: 56 }}>
        {sku.trim() && match ? (
          <Stack direction="row" alignItems="center" spacing={1.25} sx={{ p: 1, pr: 1.25, borderRadius: `${tokens.radius.sm}px`, bgcolor: c.bg, border: `1px solid ${problem ? c.warningTint : c.line}` }}>
            <Box sx={{ width: 44, flexShrink: 0 }}>
              <ProductImage src={match.images[0]} alt={match.name} brand={match.brand} />
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography title={match.name} sx={{ fontSize: 13.5, fontWeight: 600, color: c.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{match.name}</Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.25, minWidth: 0 }}>
                <PackChip pack={match.pack} size="sm" />
                {problem ? (
                  <Typography sx={{ fontSize: 12, color: c.warning, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{problem}</Typography>
                ) : (
                  <Typography sx={{ fontSize: 12, color: c.text2, whiteSpace: 'nowrap' }}>{money(priceFor(match))} each</Typography>
                )}
              </Stack>
            </Box>
            {match.type !== 'simple' ? (
              <Button size="small" component={RouterLink} to={`/p/${match.slug}`} sx={{ flexShrink: 0, color: c.navy }}>Options</Button>
            ) : (
              <Typography sx={{ fontWeight: 700, fontSize: 15, flexShrink: 0, color: c.ink }}>{money(priceFor(match) * qty)}</Typography>
            )}
          </Stack>
        ) : sku.trim() ? (
          <Stack direction="row" alignItems="center" spacing={1} sx={{ p: 1.25, borderRadius: `${tokens.radius.sm}px`, bgcolor: c.errorTint, color: c.error }}>
            <ErrorOutlineRounded fontSize="small" />
            <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{problem}</Typography>
          </Stack>
        ) : (
          <Box>
            <Typography sx={{ fontSize: 11.5, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: c.text3, mb: 0.75 }}>
              {review.signedIn ? 'Your usuals' : 'Popular SKUs'}
            </Typography>
            <Stack direction="row" gap={0.75} flexWrap="wrap">
              {usuals.map((p) => (
                <Box
                  key={p.sku}
                  component="button"
                  type="button"
                  onClick={() => setSku(p.sku)}
                  title={p.name}
                  sx={{
                    display: 'inline-flex', alignItems: 'center', gap: 0.75, minHeight: 36, maxWidth: '100%', px: 1.25, borderRadius: 999,
                    border: `1px solid ${c.line2}`, bgcolor: '#fff', cursor: 'pointer', font: 'inherit',
                    '&:hover': { borderColor: c.navy, bgcolor: c.navyTint }, '&:focus-visible': { outline: `3px solid ${c.navy}`, outlineOffset: 2 },
                  }}
                >
                  <Box component="span" sx={{ fontFamily: tokens.font.mono, fontSize: 11.5, fontWeight: 600, color: c.navy, maxWidth: 92, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.sku}</Box>
                  <Box component="span" sx={{ fontSize: 12.5, color: c.text2, maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.brand}</Box>
                </Box>
              ))}
            </Stack>
          </Box>
        )}
      </Box>

      <Button type="submit" variant="contained" size="large" fullWidth startIcon={<AddShoppingCartRounded />} disabled={!!sku.trim() && !!problem} sx={{ mt: 'auto' }}>
        {match && !problem && sku.trim() ? `Add ${qty} to cart` : 'Add to cart'}
      </Button>

      <PasteListDialog open={paste} onClose={() => setPaste(false)} />
    </Box>
  )
}

/** Paste an order sheet: one SKU per line, optional quantity ("BM0089, 4" or "A905 x2"). */
function PasteListDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addToCart, priceFor } = useApp()
  const [text, setText] = useState('BM0089, 4\nA905 x2\n59620000008252936 6\nXY12345')
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [code, q] = l.split(/[\s,x×]+/i)
      const p = productBySku(code.toUpperCase()) ?? productBySku(code)
      const qty = Math.max(1, parseInt(q ?? '1', 10) || 1)
      const issue = !p ? 'SKU not found' : p.type !== 'simple' ? 'Needs options' : p.stock === 'OUT_OF_STOCK' ? 'Out of stock' : ''
      return { code, qty, p, issue }
    })
  const ok = lines.filter((l) => l.p && !l.issue)
  const total = ok.reduce((a, l) => a + priceFor(l.p!) * l.qty, 0)

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="h3" component="h2">Paste an order list</Typography>
          <IconButton aria-label="Close" onClick={onClose}><CloseRounded /></IconButton>
        </Stack>
        <Typography color="text.secondary" sx={{ mb: 2, fontSize: 14 }}>
          One SKU per line, with an optional quantity — straight from your order sheet or spreadsheet.
        </Typography>
        <InputBase
          multiline
          minRows={4}
          maxRows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          inputProps={{ 'aria-label': 'SKU list', spellCheck: false, style: { fontFamily: tokens.font.mono, fontSize: 14 } }}
          sx={{ width: '100%', p: 1.5, border: `1.5px solid ${c.line2}`, borderRadius: `${tokens.radius.sm}px`, '&.Mui-focused': { borderColor: c.navy } }}
        />
        <Stack spacing={0.75} sx={{ mt: 2, maxHeight: 280, overflowY: 'auto' }}>
          {lines.map((l, i) => (
            <Stack key={i} direction="row" alignItems="center" spacing={1.25} sx={{ p: 1, borderRadius: `${tokens.radius.sm}px`, bgcolor: l.issue ? c.errorTint : c.bg }}>
              {l.issue ? <ErrorOutlineRounded sx={{ color: c.error, fontSize: 20 }} /> : <CheckCircleRounded sx={{ color: c.successText, fontSize: 20 }} />}
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography sx={{ fontSize: 13.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.p?.name ?? l.code}</Typography>
                <Typography sx={{ fontFamily: tokens.font.mono, fontSize: 11.5, color: l.issue ? c.error : c.text3 }}>{l.issue || `${l.code} · ${l.p?.pack}`}</Typography>
              </Box>
              <Typography sx={{ fontSize: 13.5, fontWeight: 600, flexShrink: 0 }}>× {l.qty}</Typography>
            </Stack>
          ))}
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'center' }} justifyContent="space-between" sx={{ mt: 2.5 }}>
          <Typography sx={{ fontSize: 14, color: c.text2 }}>
            {ok.length} of {lines.length} ready · <b style={{ color: c.ink }}>{money(total)}</b>
          </Typography>
          <Button
            variant="contained"
            size="large"
            disabled={!ok.length}
            startIcon={<AddShoppingCartRounded />}
            onClick={() => { ok.forEach((l) => addToCart(l.p!.sku, l.qty)); onClose() }}
          >
            Add {ok.length} to cart
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
