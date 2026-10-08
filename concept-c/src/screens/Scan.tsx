import { useEffect, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { Box, Button, IconButton, Typography } from '@mui/material'
import { tokens } from '../theme'
import { useApp } from '../state/app'
import { money, productBySku } from '../data/catalog'
import { PackChip, ProductImage, QtyStepper, Sheet } from '../components/ui'
import { CloseIcon, FlashlightIcon, KeyboardIcon } from '../components/icons'

const c = tokens.color
/** Prototype: cycles through these as "scanned" barcodes. Production: the device camera + a barcode library. */
const DEMO = ['59620000008252936', '59620000008478349', 'GR1001', 'FZ0101']

/** Barcode scanner. In this prototype the camera view is simulated and a product is "detected" after a moment. */
export default function Scan() {
  const navigate = useNavigate()
  const { add, priceFor } = useApp()
  const [torch, setTorch] = useState(false)
  const [n, setN] = useState(0)
  const [found, setFound] = useState<string | null>(null)
  const [qty, setQty] = useState(1)
  useEffect(() => {
    if (found) return
    const t = window.setTimeout(() => { setFound(DEMO[n % DEMO.length]); try { navigator.vibrate?.(40) } catch { /* unsupported */ } }, 2200)
    return () => window.clearTimeout(t)
  }, [found, n])
  const product = found ? productBySku(found) : undefined
  const next = () => { setFound(null); setQty(1); setN((x) => x + 1) }

  return (
    <Box sx={{ position: 'relative', minHeight: '100dvh', bgcolor: '#0B0B12', color: '#fff', overflow: 'hidden' }}>
      {/* Simulated camera feed: a soft, out-of-focus shelf so the screen reads as "camera" */}
      <Box aria-hidden sx={{ position: 'absolute', inset: 0, background: `radial-gradient(60% 40% at 30% 35%, rgba(213,0,0,.35), transparent 70%), radial-gradient(50% 35% at 75% 60%, rgba(45,41,125,.55), transparent 70%), radial-gradient(40% 30% at 50% 85%, rgba(255,197,49,.25), transparent 70%)`, filter: torch ? 'brightness(1.6)' : 'none', transition: 'filter .3s' }} />
      <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1.5, pt: 'calc(12px + env(safe-area-inset-top))' }}>
        <IconButton aria-label="Close scanner" onClick={() => navigate(-1)} sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,.14)' }}><CloseIcon /></IconButton>
        <Typography component="h1" sx={{ fontWeight: 700, fontSize: 16 }}>Scan a barcode</Typography>
        <IconButton aria-label={torch ? 'Turn off flashlight' : 'Turn on flashlight'} aria-pressed={torch} onClick={() => setTorch((t) => !t)} sx={{ color: torch ? c.ink : '#fff', bgcolor: torch ? c.saffron : 'rgba(255,255,255,.14)', '&:hover': { bgcolor: torch ? c.saffron : 'rgba(255,255,255,.22)' } }}><FlashlightIcon /></IconButton>
      </Box>

      <Box sx={{ position: 'relative', zIndex: 1, mx: 'auto', mt: '16vh', width: 'min(78%, 300px)', aspectRatio: '1.35 / 1' }}>
        {[['top', 'left'], ['top', 'right'], ['bottom', 'left'], ['bottom', 'right']].map(([v, h]) => (
          <Box key={v + h} aria-hidden sx={{ position: 'absolute', [v]: 0, [h]: 0, width: 36, height: 36, borderColor: found ? c.success : '#fff', borderStyle: 'solid', borderWidth: 0, [`border${v[0].toUpperCase() + v.slice(1)}Width`]: 4, [`border${h[0].toUpperCase() + h.slice(1)}Width`]: 4, borderRadius: `${v === 'top' && h === 'left' ? 14 : 0}px ${v === 'top' && h === 'right' ? 14 : 0}px ${v === 'bottom' && h === 'right' ? 14 : 0}px ${v === 'bottom' && h === 'left' ? 14 : 0}px`, transition: 'border-color .2s' }} />
        ))}
        {!found && <Box aria-hidden sx={{ position: 'absolute', left: '6%', right: '6%', height: 2, bgcolor: c.red, boxShadow: `0 0 12px 2px ${c.red}`, animation: 'scan 1.8s ease-in-out infinite alternate', '@keyframes scan': { from: { top: '12%' }, to: { top: '88%' } } }} />}
      </Box>
      <Typography role="status" aria-live="polite" sx={{ position: 'relative', zIndex: 1, textAlign: 'center', mt: 3, px: 4, fontSize: 15, opacity: 0.9 }}>
        {found ? 'Got it!' : 'Point at the barcode on a case, bag or shelf label'}
      </Typography>

      <Box sx={{ position: 'absolute', zIndex: 1, left: 0, right: 0, bottom: 'calc(28px + env(safe-area-inset-bottom))', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <Button component={RouterLink} to="/quick-order" startIcon={<KeyboardIcon />} sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,.14)', px: 2.5, '&:hover': { bgcolor: 'rgba(255,255,255,.22)' } }}>Type a SKU instead</Button>
        <Typography sx={{ fontSize: 11.5, opacity: 0.55 }}>Prototype: the camera is simulated</Typography>
      </Box>

      <Sheet open={!!product} onClose={next} title="Scanned"
        footer={product && <Box sx={{ display: 'flex', gap: 1 }}><QtyStepper value={qty} onChange={setQty} size="lg" /><Button fullWidth variant="contained" size="large" disabled={product.stock === 'OUT_OF_STOCK'} onClick={() => { add(product.sku, qty); next() }}>Add · {money(priceFor(product) * qty)}</Button></Box>}>
        {product && (
          <Box sx={{ display: 'grid', gridTemplateColumns: '84px minmax(0,1fr)', gap: 1.5, pb: 1 }}>
            <ProductImage product={product} />
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: 12, color: c.navy, fontWeight: 700 }}>{product.brand}</Typography>
              <Typography sx={{ fontSize: 15, fontWeight: 600, lineHeight: 1.3 }}>{product.name}</Typography>
              <Typography sx={{ fontFamily: tokens.font.mono, fontSize: 11.5, color: c.text3, mt: 0.25 }}>SKU {product.sku}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.75 }}><PackChip pack={product.pack} /><Typography sx={{ fontWeight: 800 }}>{money(priceFor(product))}</Typography></Box>
            </Box>
          </Box>
        )}
        <Button fullWidth onClick={next} sx={{ color: c.navy }}>Scan another</Button>
      </Sheet>
    </Box>
  )
}
