import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { Box, Button, IconButton, Typography } from '@mui/material'
import { tokens, focusRing } from '../theme'
import { useApp } from '../state/app'
import { money, type Product } from '../data/catalog'
import { productPath } from './ProductCard'
import { MinusIcon, PlusIcon, TrashIcon } from './icons'

const c = tokens.color
/** Card surfaces from the current MySupreme app: white photo well, light grey text area, hairline border. */
export const live = { body: '#F6F7F9', border: '#ECEDF0', radius: 14 }

/** Product photo, or the app's own placeholder — the SUPREME wordmark — when there is none. */
export function LiveImage({ product, ratio = '1 / 1' }: { product: Product; ratio?: string }) {
  const src = product.images[0]
  const [loaded, setLoaded] = useState(false)
  return (
    <Box sx={{ position: 'relative', aspectRatio: ratio, bgcolor: '#fff', overflow: 'hidden', containerType: 'inline-size' }}>
      {src ? (
        <Box component="img" src={src} alt="" loading="lazy" onLoad={() => setLoaded(true)} sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: loaded ? 1 : 0, transition: 'opacity .3s' }} />
      ) : (
        <Box role="img" aria-label={`${product.name}, photo coming soon`} sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
          <Box aria-hidden sx={{ fontWeight: 800, color: c.navy, fontSize: '13.5cqw', letterSpacing: '.02em', lineHeight: 1 }}>SUPREME</Box>
        </Box>
      )}
    </Box>
  )
}

/** The app's outlined "Add to cart" button; once added it becomes a − qty + stepper in the same footprint. */
export function AddToCart({ product, offerId, size = 'md', tone = 'red' }: { product: Product; offerId?: string; size?: 'sm' | 'md'; tone?: 'red' | 'green' }) {
  const { qtyOf, add, setQty } = useApp()
  const navigate = useNavigate()
  const q = qtyOf(product.sku)
  const ink = tone === 'green' ? '#3B7A57' : c.red
  const wash = tone === 'green' ? '#F2F7F3' : '#FFF5F5'
  const h = size === 'sm' ? 34 : 40
  const base = { width: '100%', height: h, minHeight: h, borderRadius: '12px', fontSize: size === 'sm' ? 13 : 14.5, fontWeight: 600 } as const
  if (product.stock === 'OUT_OF_STOCK') return <Button disabled sx={{ ...base, border: `1.5px solid ${live.border}`, bgcolor: '#fff' }}>Out of stock</Button>
  if (product.type !== 'simple') {
    return <Button onClick={() => navigate(productPath(product))} aria-label={`Choose options, ${product.name}`} sx={{ ...base, border: `1.5px solid ${live.border}`, bgcolor: '#fff', color: ink, '&:hover': { bgcolor: '#fff', borderColor: ink } }}>Choose options</Button>
  }
  if (!q) {
    return <Button onClick={() => add(product.sku, 1, { offerId })} aria-label={`Add to cart, ${product.name}`} sx={{ ...base, border: `1.5px solid ${live.border}`, bgcolor: '#fff', color: ink, '&:hover': { bgcolor: wash, borderColor: ink } }}>Add to cart</Button>
  }
  return (
    <Box role="group" aria-label={`${q} ${product.name} in cart`} sx={{ ...base, display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: `1.5px solid ${ink}`, bgcolor: '#fff', color: ink, overflow: 'hidden' }}>
      <IconButton aria-label={q === 1 ? 'Remove from cart' : 'Decrease quantity'} onClick={() => setQty(product.sku, q - 1)} sx={{ width: h, height: h, borderRadius: 0, color: ink }}>
        {q === 1 ? <TrashIcon sx={{ fontSize: 17 }} /> : <MinusIcon sx={{ fontSize: 18 }} />}
      </IconButton>
      <Typography aria-live="polite" sx={{ fontWeight: 700, fontSize: 15, color: c.ink, fontVariantNumeric: 'tabular-nums' }}>{q}</Typography>
      <IconButton aria-label="Increase quantity" onClick={() => setQty(product.sku, q + 1)} sx={{ width: h, height: h, borderRadius: 0, color: ink }}><PlusIcon sx={{ fontSize: 18 }} /></IconButton>
    </Box>
  )
}

/**
 * Product card as drawn in the current app. `grid` = the 3-up Recommended grid (one-line name), `rail` = New Arrivals
 * (two-line name), `discover` = the 2-up feed with an Add to cart button.
 */
export default function LiveCard({ product, variant, width }: { product: Product; variant: 'grid' | 'rail' | 'discover'; width?: number }) {
  const { priceFor } = useApp()
  const href = productPath(product)
  const lines = variant === 'grid' ? 1 : 2
  const small = variant === 'grid'
  return (
    <Box component="article" aria-label={`${product.name}, ${money(priceFor(product))}`} sx={{ width, minWidth: 0, height: '100%', display: 'flex', flexDirection: 'column', bgcolor: live.body, border: `1px solid ${live.border}`, borderRadius: `${live.radius}px`, overflow: 'hidden' }}>
      <Box component={RouterLink} to={href} tabIndex={-1} aria-hidden sx={{ display: 'block', opacity: product.stock === 'OUT_OF_STOCK' ? 0.55 : 1 }}><LiveImage product={product} /></Box>
      <Box sx={{ px: small ? 1 : 1.25, pt: small ? 0.875 : 1, pb: small ? 1 : 1.25, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Box component={RouterLink} to={href} sx={{ color: c.ink, textDecoration: 'none', borderRadius: 1, ...focusRing }}>
          <Typography component="h3" title={product.name} sx={{ fontSize: small ? 13 : 14.5, fontWeight: 500, lineHeight: 1.35, minHeight: `${1.35 * lines}em`, display: '-webkit-box', WebkitLineClamp: lines, WebkitBoxOrient: 'vertical', overflow: 'hidden', overflowWrap: 'anywhere' }}>{product.name}</Typography>
        </Box>
        <Typography sx={{ mt: small ? 0.5 : 0.75, fontSize: small ? 14.5 : 16, fontWeight: 700, color: c.ink, fontVariantNumeric: 'tabular-nums' }}>{money(priceFor(product))}</Typography>
        {variant === 'discover' && <Box sx={{ mt: 'auto', pt: 1 }}><AddToCart product={product} /></Box>}
      </Box>
    </Box>
  )
}
