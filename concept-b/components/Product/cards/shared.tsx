import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { Box, IconButton, Typography, type SxProps, type Theme } from '@mui/material'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { finalPrice, hasImage, money, packSize, percentOff, regularPrice, type Product } from '../../../lib/data'
import { useCart } from '../../../lib/cart'
import { SupremePlaceholder } from '../ProductCard'

/** Shared bits for the Concept B home-page card designs (FeatureProductCard, ReorderCard, RankedProductCard, NewArrivalCard). */

export const RED_AA = '#D50000'
export const focusRing = { '&:focus-visible': { outline: '3px solid rgba(213,0,0,.45)', outlineOffset: 2 } } as const
export const reduceMotion = { '@media (prefers-reduced-motion: reduce)': { transition: 'none', transform: 'none !important' } } as const

export const cardLabel = (p: Product) => `${p.name}, ${packSize(p) || 'single unit'}, ${money(finalPrice(p))}`
export const productHref = (p: Product) => `/p/${p.url_key}`

/** Product photo (contain) or the SUPREME placeholder, filling its parent. */
export function CardImage({ product, placeholderSize = 32 }: { product: Product; placeholderSize?: number }) {
  return hasImage(product) ? (
    <Box component="img" src={product.small_image!.url} alt="" loading="lazy" sx={{ position: 'absolute', inset: '8%', width: '84%', height: '84%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
  ) : (
    <Box sx={{ position: 'absolute', inset: 0, '& > [role=img]': { bgcolor: 'transparent' } }}>
      <SupremePlaceholder size={placeholderSize} />
    </Box>
  )
}

/** Name link with a 2-line clamp; the full name stays available as the title tooltip. */
export function CardName({ product, sx }: { product: Product; sx?: SxProps<Theme> }) {
  return (
    <Box component={Link} href={productHref(product)} title={product.name} sx={{ textDecoration: 'none', color: '#0C0C0C', borderRadius: '4px', '&:hover': { color: RED_AA }, ...focusRing }}>
      <Typography
        component="h3"
        sx={{ fontSize: 14.5, fontWeight: 500, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', ...((sx as object) ?? {}) }}
      >
        {product.name}
      </Typography>
    </Box>
  )
}

export function PackChip({ product }: { product: Product }) {
  const pack = packSize(product)
  if (!pack) return null
  return (
    <Box component="span" sx={{ display: 'inline-block', maxWidth: '100%', fontSize: 11, color: '#555', bgcolor: '#F5F5F5', border: '1px solid #EAEAEA', borderRadius: '6px', px: 0.75, py: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
      {pack}
    </Box>
  )
}

export function PriceLine({ product, size = 16 }: { product: Product; size?: number }) {
  const off = percentOff(product)
  return (
    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, flexWrap: 'wrap' }}>
      <Typography component="span" sx={{ fontSize: size, fontWeight: 600, color: off ? RED_AA : '#0C0C0C', lineHeight: 1.2 }}>{money(finalPrice(product))}</Typography>
      {off > 0 && <Typography component="span" sx={{ fontSize: size * 0.72, color: '#6B7280', textDecoration: 'line-through' }}>{money(regularPrice(product))}</Typography>}
    </Box>
  )
}

export function SaleBadge({ product, sx }: { product: Product; sx?: SxProps<Theme> }) {
  const off = percentOff(product)
  if (!off) return null
  return <Box sx={{ bgcolor: RED_AA, color: '#fff', fontSize: 11.5, fontWeight: 700, px: 1, py: '2px', borderRadius: '6px', ...((sx as object) ?? {}) }}>-{off}%</Box>
}

/** Round heart toggle on a white disc (home cards). */
export function HeartButton({ product, sx }: { product: Product; sx?: SxProps<Theme> }) {
  const { wishlist, toggleWish } = useCart()
  const on = wishlist.includes(product.sku)
  return (
    <IconButton
      aria-label={on ? `Remove ${product.name} from Favorites` : `Add ${product.name} to Favorites`}
      aria-pressed={on}
      onClick={() => toggleWish(product.sku)}
      sx={{ width: 40, height: 40, bgcolor: '#fff', color: on ? RED_AA : '#4B5563', boxShadow: '0 2px 8px rgba(0,0,0,.08)', '&:hover': { bgcolor: '#fff', color: RED_AA }, ...focusRing, ...((sx as object) ?? {}) }}
    >
      {on ? <FavoriteRoundedIcon sx={{ fontSize: 20 }} /> : <FavoriteBorderRoundedIcon sx={{ fontSize: 20 }} />}
    </IconButton>
  )
}

/** Small − qty + stepper. */
export function MiniStepper({ qty, setQty, label }: { qty: number; setQty: (n: number) => void; label: string }) {
  const btn = { width: 34, height: 40, borderRadius: '8px', color: '#0C0C0C', ...focusRing } as const
  return (
    <Box role="group" aria-label={`Quantity for ${label}`} sx={{ display: 'flex', alignItems: 'center', border: '1px solid #E5E7EB', borderRadius: '10px', bgcolor: '#fff', flexShrink: 0 }}>
      <IconButton aria-label="Decrease quantity" onClick={() => setQty(Math.max(1, qty - 1))} disabled={qty <= 1} sx={btn}><RemoveRoundedIcon sx={{ fontSize: 18 }} /></IconButton>
      <Typography aria-live="polite" sx={{ minWidth: 22, textAlign: 'center', fontSize: 14, fontWeight: 600 }}>{qty}</Typography>
      <IconButton aria-label="Increase quantity" onClick={() => setQty(Math.min(999, qty + 1))} sx={btn}><AddRoundedIcon sx={{ fontSize: 18 }} /></IconButton>
    </Box>
  )
}

export function useQty() {
  const [qty, setQty] = useState(1)
  return { qty, setQty }
}

/** Horizontal scroll-snap row; `itemWidth` per breakpoint, `rows` for a two-row grid on wide screens. */
export function CardRow({ children, itemWidth, rows = 1, gap = { xs: 1.5, md: 2 } }: {
  children: ReactNode
  itemWidth: Record<string, number | string>
  rows?: 1 | 2
  gap?: Record<string, number>
}) {
  return (
    <Box
      sx={{
        display: 'grid', gridAutoFlow: 'column', gridAutoColumns: itemWidth, gap,
        gridTemplateRows: rows === 2 ? { xs: 'auto', md: 'repeat(2, auto)' } : 'auto',
        overflowX: 'auto', pb: 1.5, pt: 0.5, px: 0.5, mx: -0.5, scrollSnapType: 'x mandatory',
        '& > *': { scrollSnapAlign: 'start', minWidth: 0 },
        '&::-webkit-scrollbar': { height: 6 }, '&::-webkit-scrollbar-thumb': { bgcolor: '#E5E7EB', borderRadius: 3 },
      }}
    >
      {children}
    </Box>
  )
}
