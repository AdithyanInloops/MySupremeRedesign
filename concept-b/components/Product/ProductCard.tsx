import Link from 'next/link'
import { Box, Typography } from '@mui/material'
import { finalPrice, inStock, money, packSize, type Product } from '../../lib/data'
import { colors, focusRing, motion, radius, shadow } from '../../lib/theme'
import ProductImage from '../ui/ProductImage'
import { PackChip, Price, SaleBadge, Sku } from '../ui/ProductMeta'
import CartControl, { FavoriteButton } from './CartControl'

export const productHref = (p: Product) => `/p/${p.url_key}`
/** Cards read as "name, pack size, price" to screen readers (design brief). */
export const cardLabel = (p: Product) => `${p.name}, ${packSize(p) || 'single unit'}, ${money(finalPrice(p))}${inStock(p) ? '' : ', out of stock'}`

export type CardBadge = { label: string; tone?: 'navy' | 'red' | 'ink' }

const badgeBg = { navy: colors.navy, red: colors.red, ink: colors.ink }

function Badge({ badge }: { badge: CardBadge }) {
  return (
    <Box sx={{ bgcolor: badgeBg[badge.tone ?? 'navy'], color: '#fff', fontSize: 11.5, fontWeight: 700, letterSpacing: '.04em', px: 0.875, lineHeight: '22px', borderRadius: radius.xs }}>
      {badge.label}
    </Box>
  )
}

function Name({ product, lines = 2, size = 14.5 }: { product: Product; lines?: number; size?: number }) {
  return (
    <Box component={Link} href={productHref(product)} title={product.name} sx={{ color: colors.ink, textDecoration: 'none', borderRadius: '4px', '&:hover': { color: colors.redText, textDecoration: 'underline' }, ...focusRing }}>
      <Typography component="h3" sx={{ fontSize: size, fontWeight: 500, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: lines, WebkitBoxOrient: 'vertical', overflow: 'hidden', overflowWrap: 'anywhere' }}>
        {product.name}
      </Typography>
    </Box>
  )
}

/**
 * The one product card. `grid` for listings, rails and favourites; `compact` (image left) for reorder lists and
 * dense side panels. Optional `badge` (NEW, #1 …) sits on the image. Everything else is identical everywhere.
 */
export default function ProductCard({ product, variant = 'grid', badge }: { product: Product; variant?: 'grid' | 'compact'; badge?: CardBadge }) {
  if (variant === 'compact') {
    return (
      <Box
        component="article"
        aria-label={cardLabel(product)}
        sx={{
          display: 'grid', gridTemplateColumns: '84px minmax(0,1fr)', gap: 1.5, alignItems: 'center', height: '100%', p: 1.25,
          bgcolor: '#fff', border: `1px solid ${colors.line}`, borderRadius: radius.lg, transition: `box-shadow ${motion.base}, border-color ${motion.base}`,
          '&:hover': { borderColor: colors.line2, boxShadow: shadow.md },
        }}
      >
        <Box component={Link} href={productHref(product)} tabIndex={-1} aria-hidden sx={{ display: 'block', borderRadius: radius.md, overflow: 'hidden', border: `1px solid ${colors.sunken}` }}>
          <ProductImage product={product} caption={false} alt="" />
        </Box>
        <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Name product={product} size={14} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
            <Price product={product} size="sm" />
            <Box sx={{ minWidth: 0 }}><PackChip product={product} /></Box>
          </Box>
          <Box sx={{ mt: 0.5, maxWidth: 220 }}><CartControl product={product} size="sm" label="Add" /></Box>
        </Box>
      </Box>
    )
  }

  return (
    <Box
      component="article"
      aria-label={cardLabel(product)}
      sx={{
        position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', minWidth: 0, bgcolor: '#fff',
        border: `1px solid ${colors.line}`, borderRadius: radius.lg, overflow: 'hidden', transition: `box-shadow ${motion.base}, border-color ${motion.base}`,
        '&:hover': { borderColor: colors.line2, boxShadow: shadow.md },
        '&:hover .card-img img': { transform: 'scale(1.03)' },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Box component={Link} href={productHref(product)} tabIndex={-1} aria-hidden className="card-img" sx={{ display: 'block', '& img': { transition: `transform ${motion.slow}, opacity .25s ease` } }}>
          <ProductImage product={product} alt="" ratio="5 / 4" padding="6%" />
        </Box>
        <Box sx={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 0.5 }}>
          {badge && <Badge badge={badge} />}
          <SaleBadge product={product} />
          {!inStock(product) && <Badge badge={{ label: 'Out of stock', tone: 'ink' }} />}
        </Box>
        <Box sx={{ position: 'absolute', top: 8, right: 8 }}><FavoriteButton product={product} /></Box>
      </Box>
      <Box sx={{ p: { xs: 1.25, sm: 1.5 }, pt: { xs: 1, sm: 1.25 }, display: 'flex', flexDirection: 'column', gap: 0.5, flex: 1, borderTop: `1px solid ${colors.sunken}` }}>
        <Sku sku={product.sku} />
        <Name product={product} />
        {/* Price + pack size on one row, pinned to the bottom so buttons line up across a row. */}
        <Box sx={{ mt: 'auto', pt: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap', minWidth: 0 }}>
          <Price product={product} />
          <Box sx={{ minWidth: 0, maxWidth: '100%' }}><PackChip product={product} /></Box>
        </Box>
        <Box sx={{ mt: 0.5 }}><CartControl product={product} /></Box>
      </Box>
    </Box>
  )
}
