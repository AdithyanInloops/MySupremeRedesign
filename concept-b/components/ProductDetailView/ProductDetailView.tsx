import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Box, Button, IconButton, InputBase, Typography } from '@mui/material'
import ArrowBackIos from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'
import EastIcon from '@mui/icons-material/East'
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'
import { finalPrice, hasImage, money, packSize, percentOff, regularPrice, type Product } from '../../lib/data'
import { useCart } from '../../lib/cart'
import { SupremePlaceholder, WishlistStar } from '../Product/ProductCard'

/** Brand = text before " - " (or "- ") in the product name, as the live PDP shows it. */
export const brandOf = (p: Product) => p.name.split(/\s+-\s+|-\s/)[0].trim()

function Gallery({ product }: { product: Product }) {
  const imgs = hasImage(product)
    ? (product.media_gallery?.length ? product.media_gallery : [product.small_image!]).filter((i) => !i.url.includes('/placeholder/'))
    : []
  const [i, setI] = useState(0)
  const box = { position: 'relative', width: '100%', aspectRatio: '1.25 / 1', border: '1px solid #E0E0E0', borderRadius: '4px', bgcolor: '#fff', overflow: 'hidden' } as const
  if (!imgs.length) return <Box sx={box}><SupremePlaceholder size={64} /></Box>
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Box sx={box}>
        <Box component="img" src={imgs[i].url} alt={`${product.name} my supreme`} sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' }} />
      </Box>
      {imgs.length > 1 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton aria-label="Previous image" onClick={() => setI((i - 1 + imgs.length) % imgs.length)}><ArrowBackIos fontSize="small" /></IconButton>
          <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto' }}>
            {imgs.map((im, k) => (
              <Box key={im.url} component="button" onClick={() => setI(k)} aria-label={`Show image ${k + 1}`} sx={{ all: 'unset', cursor: 'pointer', width: 64, height: 64, flexShrink: 0, borderRadius: '4px', border: k === i ? '2px solid #FF413D' : '1px solid #E0E0E0', overflow: 'hidden', bgcolor: '#fff' }}>
                <Box component="img" src={im.url} alt="" sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </Box>
            ))}
          </Box>
          <IconButton aria-label="Next image" onClick={() => setI((i + 1) % imgs.length)}><ArrowForwardIos fontSize="small" /></IconButton>
        </Box>
      )}
    </Box>
  )
}

function Stepper({ qty, setQty, uom }: { qty: number; setQty: (n: number) => void; uom: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #FF413D', borderRadius: '4px', height: 48, width: { xs: 174, md: 174 }, px: 0.5, bgcolor: '#fff' }}>
      <IconButton aria-label="Decrease quantity" size="small" onClick={() => setQty(Math.max(1, qty - 1))} sx={{ color: '#FF413D' }}><RemoveIcon fontSize="small" /></IconButton>
      <InputBase
        value={qty}
        onChange={(e) => setQty(Math.max(1, parseInt(e.target.value.replace(/\D/g, '') || '1', 10)))}
        inputProps={{ 'aria-label': 'Quantity', inputMode: 'numeric', style: { textAlign: 'center', fontWeight: 600, fontSize: 15 } }}
        sx={{ flex: 1, minWidth: 0 }}
      />
      <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#FF413D', mr: 0.5 }}>{uom.toUpperCase()}</Typography>
      <IconButton aria-label="Increase quantity" size="small" onClick={() => setQty(qty + 1)} sx={{ color: '#FF413D' }}><AddIcon fontSize="small" /></IconButton>
    </Box>
  )
}

export default function ProductDetailView({ product }: { product: Product }) {
  const { add, markViewed } = useCart()
  const [qty, setQty] = useState(1)
  // Concept B #7 — feeds the home "Pick up where you left off" row. Deferred one tick so it lands after the
  // cart provider restores the saved history on a full page load (otherwise the restore overwrites it).
  useEffect(() => {
    const t = window.setTimeout(() => markViewed(product.sku), 0)
    return () => window.clearTimeout(t)
  }, [product.sku, markViewed])
  const brand = brandOf(product)
  const off = percentOff(product)
  const uom = product.uom || 'pcs'

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 3, md: 4 }, alignItems: 'start' }}>
      <Gallery product={product} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pt: { md: 1 }, maxWidth: { md: 520 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography sx={{ fontSize: { xs: '13px', md: '16px' }, fontWeight: 500, color: '#FF413D', whiteSpace: 'nowrap' }}>{brand}</Typography>
          <Typography sx={{ fontSize: { xs: '12px', md: '14px' }, color: '#9E9E9E', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.sku}</Typography>
          <Box sx={{ flex: 1, height: '1px', bgcolor: '#E0E0E0', mx: 1 }} />
          <WishlistStar sku={product.sku} />
        </Box>
        <Typography component="h1" sx={{ color: '#0C0C0C', fontSize: { xs: '16px', sm: '17px', md: '18px' }, fontWeight: 600, lineHeight: 1.4, mt: 1 }}>
          {product.name}
        </Typography>
        {packSize(product) && <Typography sx={{ color: '#555', fontSize: '13px' }}>{packSize(product)}</Typography>}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 0.5 }}>
          <Typography sx={{ fontSize: { xs: '20px', md: '26px' }, fontWeight: 700, color: '#0C0C0C', lineHeight: 1.2 }}>{money(finalPrice(product))}</Typography>
          {off > 0 && (
            <>
              <Typography sx={{ fontSize: 15, color: '#9E9E9E', textDecoration: 'line-through' }}>{money(regularPrice(product))}</Typography>
              <Typography sx={{ color: '#fff', bgcolor: '#FF3B30', fontSize: '13px', fontWeight: 600, px: 1, borderRadius: '4px' }}>-{off}%</Typography>
            </>
          )}
        </Box>
        {off > 0 && <Typography sx={{ color: '#2FA84F', fontWeight: 600, fontSize: '13px', mt: -1 }}>You save {money(regularPrice(product) - finalPrice(product))}</Typography>}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'center' }, gap: { xs: 2.5, md: 2.25 }, mt: 1 }}>
          <Stepper qty={qty} setQty={setQty} uom={uom} />
          <Button
            onClick={() => add(product.sku, qty)}
            variant="contained"
            disableElevation
            sx={{
              height: 60, px: 4, width: { xs: '100%', md: 'auto' }, fontSize: '15px', fontWeight: 600, letterSpacing: '.08em', borderRadius: '4px',
              backgroundColor: '#E0000A', color: '#fff', '&:hover': { backgroundColor: '#b5000a' },
            }}
          >
            ADD TO CART
          </Button>
        </Box>
        <Box
          component={Link}
          href={`/search/${encodeURIComponent(brand)}`}
          sx={{
            mt: 4, display: 'flex', alignItems: 'center', gap: 1.5, p: '12px 16px', borderRadius: '8px', bgcolor: '#F7F7F7', border: '1px solid #EDEDED',
            textDecoration: 'none', transition: 'all .2s', '&:hover': { bgcolor: '#FFF0F0', borderColor: '#FF413D', '& .brand-tag': { color: '#FF413D' } },
          }}
        >
          <StorefrontOutlinedIcon sx={{ fontSize: '22px', color: '#9E9E9E' }} />
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: '14px', color: '#9E9E9E', fontWeight: 400, lineHeight: 1.2 }}>Explore more from</Typography>
            <Typography className="brand-tag" sx={{ fontSize: '16px', color: '#0C0C0C', fontWeight: 600, lineHeight: 1.4 }}>{brand}</Typography>
          </Box>
          <EastIcon sx={{ color: '#FF413D', fontSize: '18px' }} />
        </Box>
      </Box>
    </Box>
  )
}

export function ProductDescription({ product }: { product: Product }) {
  const [tab] = useState('details')
  const brand = brandOf(product)
  const html = product.description?.html?.trim() || product.short_description?.html || ''
  return (
    <Box sx={{ mt: { xs: 5, md: 4 } }}>
      <Typography component="h2" sx={{ fontSize: { xs: 18, md: 24 }, fontWeight: 600, color: '#0C0C0C', mb: 2, px: { xs: 1, md: 0 } }}>Product description</Typography>
      <Box sx={{ px: { xs: 3, md: 2 }, color: '#1C1C1C', fontSize: { xs: 15, md: 16 }, lineHeight: 1.75, '& p': { m: 0 } }} dangerouslySetInnerHTML={{ __html: html || `${product.name}.` }} />
      <Box role="tablist" sx={{ mt: 4, display: 'flex', px: { xs: 1, md: 0 } }}>
        <Box role="tab" aria-selected={tab === 'details'} sx={{ fontSize: { xs: 18, md: 16 }, fontWeight: 600, color: '#0C0C0C', pb: 1, borderBottom: '3px solid #FF413D', pr: 0.25 }}>
          Product Details
        </Box>
      </Box>
      <Box sx={{ mt: 1.5, border: '1px solid #EAEAEA', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,.04)' }}>
        {[['Uom', product.uom || 'pcs'], ['Brand', brand]].map(([k, v], i) => (
          <Box key={k} sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', px: { xs: 2.5, md: 3.5 }, py: 1.5, bgcolor: i % 2 ? '#fff' : '#F7F7F7' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#555' }}>{k}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#FF413D' }} />
              <Typography sx={{ fontSize: 14, color: '#0C0C0C' }}>{v}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
