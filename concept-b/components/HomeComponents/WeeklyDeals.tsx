import Link from 'next/link'
import { Box, Typography } from '@mui/material'
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded'
import { money, regularPrice, type Product } from '../../lib/data'
import { colors, focusRing, motion, radius, shadow } from '../../lib/theme'
import ProductImage from '../ui/ProductImage'
import { PackChip, Sku } from '../ui/ProductMeta'
import CartControl from '../Product/CartControl'

/*
 * This week's deals — real offers with validity dates and add to cart.
 * NEW FEATURE: needs an offer entity — deal type, sku, offer price, valid from/to (prototype: data/offers.json).
 * Name, image, pack size and regular price are existing product fields.
 */

export type Offer = { id: string; deal_type: string; sku: string; offer_price: number; valid_from: string; valid_to: string; note?: string; warehouses?: string[] }

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
/** "2026-10-12" → "Mon, Oct 12" without timezone or locale drift between server and browser. */
export const shortDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return `${DAYS[new Date(y, m - 1, d).getDay()]}, ${MONTHS[m - 1]} ${d}`
}

export function DealCard({ offer, product }: { offer: Offer; product: Product }) {
  const regular = regularPrice(product)
  const save = Math.max(0, regular - offer.offer_price)
  const pct = regular ? Math.round((save / regular) * 100) : 0
  const href = `/p/${product.url_key}`
  return (
    <Box
      component="article"
      aria-label={`${offer.deal_type}: ${product.name}, ${money(offer.offer_price)}, ends ${shortDate(offer.valid_to)}`}
      sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#fff', border: `1px solid ${colors.line}`, borderRadius: radius.lg, overflow: 'hidden', transition: `box-shadow ${motion.base}`, '&:hover': { boxShadow: shadow.md } }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, px: 2, py: 1.25, bgcolor: colors.redTint, borderBottom: `1px solid ${colors.redLine}` }}>
        <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: colors.redText, letterSpacing: '.04em', textTransform: 'uppercase' }}>{offer.deal_type}</Typography>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, color: colors.ink700, fontSize: 12.5, fontWeight: 500 }}>
          <ScheduleRoundedIcon sx={{ fontSize: 16 }} /> Ends {shortDate(offer.valid_to)}
        </Box>
      </Box>
      <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'flex-start', flex: 1 }}>
        <Box component={Link} href={href} tabIndex={-1} aria-hidden sx={{ width: { xs: 96, md: 112 }, flexShrink: 0, borderRadius: radius.md, overflow: 'hidden', border: `1px solid ${colors.line}` }}>
          <ProductImage product={product} alt="" caption={false} />
        </Box>
        <Box sx={{ minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Sku sku={product.sku} />
          <Box component={Link} href={href} title={product.name} sx={{ color: colors.ink, textDecoration: 'none', borderRadius: '4px', '&:hover': { color: colors.redText, textDecoration: 'underline' }, ...focusRing }}>
            <Typography component="h3" sx={{ fontSize: 15, fontWeight: 600, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</Typography>
          </Box>
          <Box><PackChip product={product} /></Box>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
            <Typography sx={{ fontSize: 24, fontWeight: 700, color: colors.redText, lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' }}>{money(offer.offer_price)}</Typography>
            {save > 0 && <Typography sx={{ fontSize: 14, color: colors.ink500, textDecoration: 'line-through' }} aria-label={`Regular price ${money(regular)}`}>{money(regular)}</Typography>}
          </Box>
          {save > 0 && <Typography sx={{ fontSize: 13, fontWeight: 600, color: colors.success }}>Save {money(save)} ({pct}%){offer.note ? <Box component="span" sx={{ color: colors.ink600, fontWeight: 400 }}> · {offer.note}</Box> : null}</Typography>}
        </Box>
      </Box>
      <Box sx={{ px: 2, pb: 2 }}><CartControl product={product} /></Box>
    </Box>
  )
}

export default function WeeklyDeals({ offers, products }: { offers: Offer[]; products: Product[] }) {
  const deals = offers
    .map((o) => ({ offer: o, product: products.find((p) => p.sku === o.sku) }))
    .filter((d): d is { offer: Offer; product: Product } => !!d.product)
  if (!deals.length) return null
  return (
    <Box component="ul" aria-label="This week's deals" sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gap: { xs: 1.5, md: 2 }, gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'repeat(3, minmax(0,1fr))' } }}>
      {deals.map((d) => <li key={d.offer.id}><DealCard offer={d.offer} product={d.product} /></li>)}
    </Box>
  )
}
