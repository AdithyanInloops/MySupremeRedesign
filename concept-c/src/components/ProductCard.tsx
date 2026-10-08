import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { Badge, Box, Button, IconButton, Typography, type SxProps, type Theme } from '@mui/material'
import { tokens, focusRing, pressable } from '../theme'
import { useApp } from '../state/app'
import { pctOff, type Product } from '../data/catalog'
import { PackChip, Price, ProductImage, QtyStepper, Sku } from './ui'
import { CartPlusIcon, ChevronRightIcon, HeartFilledIcon, HeartIcon, MinusIcon, PlusIcon, TrashIcon } from './icons'

const c = tokens.color
export const productPath = (p: Product) => `/p/${p.slug}`

/**
 * Floating add control (Instacart pattern): a red "+" on the photo corner; once the item is in the cart it expands
 * into a compact "− qty +" pill so the buyer adjusts quantities without leaving the list. Products that need a choice
 * (configurable / grouped) open the product page; out-of-stock items can't be added.
 */
export function FloatAdd({ product, offerId }: { product: Product; offerId?: string }) {
  const { qtyOf, add, setQty } = useApp()
  const navigate = useNavigate()
  const q = qtyOf(product.sku)
  const oos = product.stock === 'OUT_OF_STOCK'
  const round = { width: 38, height: 38, borderRadius: '50%', bgcolor: c.red, color: '#fff', boxShadow: '0 6px 14px -4px rgba(213,0,0,.5)', '&:hover': { bgcolor: c.redDark }, ...pressable } as const
  if (oos) return null
  if (product.type !== 'simple') {
    return <IconButton aria-label={`Choose options for ${product.name}`} onClick={() => navigate(productPath(product))} sx={{ ...round, bgcolor: '#fff', color: c.navy, boxShadow: tokens.shadow.raised, '&:hover': { bgcolor: '#fff' } }}><ChevronRightIcon sx={{ fontSize: 20 }} /></IconButton>
  }
  if (!q) return <IconButton aria-label={`Add ${product.name} to cart`} onClick={() => add(product.sku, 1, { offerId })} sx={round}><PlusIcon sx={{ fontSize: 21 }} /></IconButton>
  return (
    <Box role="group" aria-label={`${q} ${product.name} in cart`} sx={{ display: 'inline-flex', alignItems: 'center', height: 38, borderRadius: `${tokens.radius.pill}px`, bgcolor: c.red, color: '#fff', boxShadow: '0 6px 14px -4px rgba(213,0,0,.5)', animation: 'grow .18s ease-out', '@keyframes grow': { from: { transform: 'scale(.85)', opacity: 0.6 }, to: { transform: 'none', opacity: 1 } } }}>
      <IconButton aria-label={q === 1 ? 'Remove from cart' : 'Decrease quantity'} onClick={() => setQty(product.sku, q - 1)} sx={{ width: 38, height: 38, color: '#fff' }}>
        {q === 1 ? <TrashIcon sx={{ fontSize: 17 }} /> : <MinusIcon sx={{ fontSize: 18 }} />}
      </IconButton>
      <Typography aria-live="polite" sx={{ minWidth: 18, textAlign: 'center', fontWeight: 700, fontSize: 14.5, fontVariantNumeric: 'tabular-nums' }}>{q}</Typography>
      <IconButton aria-label="Increase quantity" onClick={() => setQty(product.sku, q + 1)} sx={{ width: 38, height: 38, color: '#fff' }}><PlusIcon sx={{ fontSize: 18 }} /></IconButton>
    </Box>
  )
}

export function Heart({ product, sx }: { product: Product; sx?: SxProps<Theme> }) {
  const { wishlist, toggleWish } = useApp()
  const on = wishlist.includes(product.sku)
  return (
    <IconButton
      aria-pressed={on}
      aria-label={on ? `Remove ${product.name} from Favorites` : `Save ${product.name} to Favorites`}
      onClick={(e) => { e.preventDefault(); toggleWish(product.sku) }}
      sx={{ width: 34, height: 34, bgcolor: 'rgba(255,255,255,.94)', color: on ? c.red : c.text2, boxShadow: tokens.shadow.card, '&:hover': { bgcolor: '#fff' }, ...pressable, ...((sx as object) ?? {}) }}
    >
      {on ? <HeartFilledIcon sx={{ fontSize: 18 }} /> : <HeartIcon sx={{ fontSize: 18 }} />}
    </IconButton>
  )
}

function Badges({ product, offPct }: { product: Product; offPct?: number }) {
  const off = offPct ?? pctOff(product)
  return (
    <Box sx={{ position: 'absolute', top: 6, left: 6, display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'flex-start', zIndex: 1 }}>
      {off > 0 && <Box sx={{ bgcolor: c.red, color: '#fff', fontSize: 11, fontWeight: 700, px: 0.75, borderRadius: 1, lineHeight: '20px' }}>−{off}%</Box>}
      {product.isNew && <Box sx={{ bgcolor: c.navy, color: '#fff', fontSize: 10.5, fontWeight: 700, px: 0.75, borderRadius: 1, letterSpacing: '.05em', lineHeight: '20px' }}>NEW</Box>}
      {product.stock === 'LOW_STOCK' && <Box sx={{ bgcolor: c.saffron, color: c.ink, fontSize: 10.5, fontWeight: 700, px: 0.75, borderRadius: 1, lineHeight: '20px' }}>Low stock</Box>}
    </Box>
  )
}

/**
 * Grid / rail card. Compact by design: a 4:3 photo carrying the controls (badges, favourite, add), then the name on a
 * fixed two lines, pack size and one price row — so neighbouring cards are the same height with no gaps inside.
 * The brand is left to the name (catalogue names lead with it) and the product page.
 */
export default function ProductCard({ product, width, offerId, offerPrice }: { product: Product; width?: number; offerId?: string; offerPrice?: number }) {
  const oos = product.stock === 'OUT_OF_STOCK'
  const href = productPath(product)
  const off = offerPrice ? Math.round((1 - offerPrice / (product.regular ?? product.price)) * 100) : undefined
  return (
    <Box component="article" aria-label={`${product.name}, ${product.brand}, ${product.pack}`} sx={{ width, minWidth: 0, display: 'flex', flexDirection: 'column', height: width ? 'auto' : '100%', bgcolor: '#fff', borderRadius: `${tokens.radius.md}px`, border: `1px solid ${c.line}`, overflow: 'hidden' }}>
      <Box sx={{ position: 'relative' }}>
        <Box component={RouterLink} to={href} tabIndex={-1} aria-hidden sx={{ display: 'block', opacity: oos ? 0.55 : 1, filter: oos ? 'grayscale(.6)' : 'none' }}>
          <ProductImage product={product} ratio="4 / 3" radius={0} caption={false} />
        </Box>
        <Badges product={product} offPct={off} />
        <Heart product={product} sx={{ position: 'absolute', top: 5, right: 5, width: 32, height: 32 }} />
        <Box sx={{ position: 'absolute', right: 6, bottom: 6 }}><FloatAdd product={product} offerId={offerId} /></Box>
        {oos && <Box sx={{ position: 'absolute', left: 6, right: 6, bottom: 6, bgcolor: 'rgba(17,24,39,.82)', color: '#fff', textAlign: 'center', fontSize: 11.5, fontWeight: 600, py: 0.5, borderRadius: 1 }}>Out of stock</Box>}
      </Box>
      <Box component={RouterLink} to={href} sx={{ px: 1.25, pt: 0.875, pb: 1.125, display: 'flex', flexDirection: 'column', gap: 0.5, flex: 1, minWidth: 0, color: 'inherit', textDecoration: 'none', ...focusRing }}>
        <Typography component="h3" title={product.name} sx={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.35, minHeight: '2.7em', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', overflowWrap: 'anywhere' }}>{product.name}</Typography>
        <Box sx={{ minWidth: 0, display: 'flex' }}><PackChip pack={product.pack} /></Box>
        <Box sx={{ mt: 'auto' }}><Price product={product} size="sm" offerPrice={offerPrice} /></Box>
      </Box>
    </Box>
  )
}

/**
 * Compact horizontal tile — thumbnail, name, price and a quick "+" — for "Pick up where you left off" and cart
 * top-ups, where several products should fit in one glance. The "+" shows how many are already in the cart.
 */
export function ProductTile({ product, width = 244 }: { product: Product; width?: number }) {
  const { qtyOf, add } = useApp()
  const navigate = useNavigate()
  const q = qtyOf(product.sku)
  const oos = product.stock === 'OUT_OF_STOCK'
  const href = productPath(product)
  return (
    <Box component="article" aria-label={`${product.name}, ${product.pack}`} sx={{ width, minWidth: 0, display: 'grid', gridTemplateColumns: '58px minmax(0,1fr) auto', alignItems: 'center', gap: 1.25, p: 1, bgcolor: '#fff', borderRadius: `${tokens.radius.md}px`, border: `1px solid ${c.line}` }}>
      <Box component={RouterLink} to={href} tabIndex={-1} aria-hidden sx={{ display: 'block', opacity: oos ? 0.55 : 1 }}><ProductImage product={product} radius={8} caption={false} /></Box>
      <Box component={RouterLink} to={href} sx={{ minWidth: 0, color: 'inherit', textDecoration: 'none', ...focusRing }}>
        <Typography component="h3" sx={{ fontSize: 12.5, fontWeight: 600, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', overflowWrap: 'anywhere' }}>{product.name}</Typography>
        <Box sx={{ mt: 0.25 }}>{oos ? <Typography sx={{ fontSize: 12, fontWeight: 600, color: c.text3 }}>Out of stock</Typography> : <Price product={product} size="xs" />}</Box>
      </Box>
      {!oos && (
        <Badge badgeContent={q} overlap="circular" sx={{ '& .MuiBadge-badge': { bgcolor: c.navy, color: '#fff', fontWeight: 800, fontSize: 10.5, minWidth: 18, height: 18, border: '2px solid #fff' } }}>
          <IconButton aria-label={product.type !== 'simple' ? `Choose options for ${product.name}` : q ? `Add another ${product.name}, ${q} in cart` : `Add ${product.name} to cart`}
            onClick={() => (product.type !== 'simple' ? navigate(href) : add(product.sku, 1))}
            sx={{ width: 36, height: 36, bgcolor: c.redTint, color: c.red, '&:hover': { bgcolor: '#FFE1DD' }, ...pressable }}>
            {product.type !== 'simple' ? <ChevronRightIcon sx={{ fontSize: 19 }} /> : <PlusIcon sx={{ fontSize: 19 }} />}
          </IconButton>
        </Badge>
      )}
    </Box>
  )
}

/** List row: thumbnail, details, price, add/stepper — for search results, reorder lists and favourites. */
export function ProductRow({ product, showSku = true, action }: { product: Product; showSku?: boolean; action?: 'stepper' | 'add' }) {
  const { qtyOf, add, setQty } = useApp()
  const navigate = useNavigate()
  const q = qtyOf(product.sku)
  const oos = product.stock === 'OUT_OF_STOCK'
  return (
    <Box component="article" aria-label={`${product.name}, ${product.pack}`} sx={{ display: 'grid', gridTemplateColumns: '72px minmax(0,1fr) auto', gap: 1.5, alignItems: 'center', py: 1.25 }}>
      <Box component={RouterLink} to={productPath(product)} tabIndex={-1} aria-hidden sx={{ display: 'block', opacity: oos ? 0.55 : 1 }}>
        <ProductImage product={product} />
      </Box>
      <Box component={RouterLink} to={productPath(product)} sx={{ minWidth: 0, color: 'inherit', textDecoration: 'none', ...focusRing }}>
        <Typography sx={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</Typography>
        {showSku && <Sku sku={product.sku} sx={{ mt: 0.25 }} />}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, minWidth: 0 }}>
          <Price product={product} size="sm" />
        </Box>
      </Box>
      <Box>
        {oos ? (
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: c.text3 }}>Sold out</Typography>
        ) : product.type !== 'simple' ? (
          <Button size="small" variant="outlined" color="secondary" onClick={() => navigate(productPath(product))}>Options</Button>
        ) : q && action !== 'add' ? (
          <QtyStepper size="sm" value={q} onChange={(n) => setQty(product.sku, n)} removeAtMin label={`Quantity of ${product.name}`} />
        ) : (
          <IconButton aria-label={`Add ${product.name} to cart`} onClick={() => add(product.sku, 1)} sx={{ width: 40, height: 40, borderRadius: `${tokens.radius.sm}px`, bgcolor: c.redTint, color: c.red, '&:hover': { bgcolor: '#FFE1DD' }, ...pressable }}>
            <CartPlusIcon sx={{ fontSize: 20 }} />
          </IconButton>
        )}
      </Box>
    </Box>
  )
}
