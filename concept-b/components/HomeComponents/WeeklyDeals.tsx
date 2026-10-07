import Link from 'next/link'
import { Box, Typography } from '@mui/material'
import { money, regularPrice, type Product } from '../../lib/data'
import { colors, focusRing, motion, radius, shadow } from '../../lib/theme'
import ProductImage from '../ui/ProductImage'
import { PackChip, Sku } from '../ui/ProductMeta'
import CartControl from '../Product/CartControl'
import { ClockIcon } from '../ui/icons'
import { PriceBurst } from '../Deals/DealBits'
import { dealLabel, dealStyle, shortDate, toDeal, typeOf, type Offer } from '../Deals/deals'

/*
 * Deal card — flyer style: coloured deal-type ribbon, product photo with a savings burst, offer price, saving and end
 * date, add to cart. Content flows top-down with no reserved gaps; the price block sits at the bottom so cards in a
 * row line up.
 * NEW FEATURE: offer entity — deal type, sku, offer price, valid from/to, warehouses (prototype: data/offers.json).
 */

export type { Offer }
export { shortDate }

export function DealCard({ offer, product }: { offer: Offer; product: Product }) {
  const type = typeOf(offer)
  const style = dealStyle[type]
  const Icon = style.icon
  const regular = regularPrice(product)
  const save = Math.max(0, regular - offer.offer_price)
  const pct = regular ? Math.round((save / regular) * 100) : 0
  const href = `/p/${product.url_key}`
  return (
    <Box
      component="article"
      aria-label={`${dealLabel(type)}: ${product.name}, ${money(offer.offer_price)}${save ? `, save ${money(save)}` : ''}, ends ${shortDate(offer.valid_to)}`}
      sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#fff', border: `1px solid ${colors.line}`, borderRadius: radius.lg, overflow: 'hidden', transition: `box-shadow ${motion.base}`, '&:hover': { boxShadow: shadow.md }, '&:hover .deal-img img': { transform: 'scale(1.04)' } }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, px: 1.5, py: 0.75, bgcolor: style.bg, color: style.fg, fontSize: 12, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}>
        <Icon sx={{ fontSize: 16 }} /> {dealLabel(type)}
      </Box>
      <Box sx={{ position: 'relative' }}>
        <Box component={Link} href={href} tabIndex={-1} aria-hidden className="deal-img" sx={{ display: 'block', '& img': { transition: `transform ${motion.slow}, opacity .25s ease` } }}>
          <ProductImage product={product} alt="" ratio="5 / 4" padding="7%" />
        </Box>
        {pct > 0 && (
          <PriceBurst size={60} sx={{ position: 'absolute', right: 8, bottom: -14 }}>
            <Box component="span" sx={{ fontSize: 9.5, letterSpacing: '.06em' }}>SAVE</Box>
            <Box component="span" sx={{ fontSize: 17 }}>{pct}%</Box>
          </PriceBurst>
        )}
      </Box>
      <Box sx={{ p: 1.5, pt: 1.25, display: 'flex', flexDirection: 'column', gap: 0.5, flex: 1, borderTop: `1px solid ${colors.sunken}` }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, pr: pct > 0 ? 6 : 0 }}>
          <Sku sku={product.sku} />
        </Box>
        <Box component={Link} href={href} title={product.name} sx={{ color: colors.ink, textDecoration: 'none', borderRadius: '4px', '&:hover': { color: colors.redText, textDecoration: 'underline' }, ...focusRing }}>
          <Typography component="h3" sx={{ fontSize: 14.5, fontWeight: 600, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', overflowWrap: 'anywhere' }}>{product.name}</Typography>
        </Box>
        <Box sx={{ mt: 'auto', pt: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, flexWrap: 'wrap' }}>
            <Typography sx={{ fontSize: 22, fontWeight: 700, color: colors.redText, lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' }}>{money(offer.offer_price)}</Typography>
            {save > 0 && <Typography sx={{ fontSize: 13.5, color: colors.ink500, textDecoration: 'line-through' }} aria-label={`Regular price ${money(regular)}`}>{money(regular)}</Typography>}
            <Box sx={{ ml: 'auto', minWidth: 0, maxWidth: '100%' }}><PackChip product={product} /></Box>
          </Box>
          {save > 0 && <Typography sx={{ fontSize: 13, fontWeight: 600, color: colors.success, mt: 0.25 }}>You save {money(save)}{offer.note ? <Box component="span" sx={{ color: colors.ink600, fontWeight: 400 }}> · {offer.note}</Box> : null}</Typography>}
          <Typography sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: 12.5, color: colors.ink600, mt: 0.25 }}>
            <ClockIcon sx={{ fontSize: 15 }} /> Ends {shortDate(offer.valid_to)}
          </Typography>
        </Box>
        <Box sx={{ mt: 0.75 }}><CartControl product={product} /></Box>
      </Box>
    </Box>
  )
}

export const dealGrid = { xs: 'repeat(2, minmax(0,1fr))', lg: 'repeat(4, minmax(0,1fr))' }

export default function WeeklyDeals({ offers }: { offers: Offer[]; products?: Product[] }) {
  const deals = offers.map(toDeal).filter((d): d is NonNullable<typeof d> => !!d)
  if (!deals.length) return null
  return (
    <Box component="ul" aria-label="This week's deals" sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gap: { xs: 1.25, md: 2 }, gridTemplateColumns: dealGrid }}>
      {deals.map((d) => <li key={d.offer.id}><DealCard offer={d.offer} product={d.product} /></li>)}
    </Box>
  )
}
