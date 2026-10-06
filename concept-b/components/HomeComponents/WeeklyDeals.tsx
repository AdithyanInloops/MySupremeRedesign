import { useState } from 'react'
import Link from 'next/link'
import { Box, Button, Card, Grid, InputBase, Typography } from '@mui/material'
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'
import ScheduleIcon from '@mui/icons-material/Schedule'
import { money, packSize, regularPrice, type Product } from '../../lib/data'
import { useCart } from '../../lib/cart'
import { ProductImage } from '../Product/ProductCard'

/*
 * CONCEPT B — CHANGE #4 (replaces OfferCards.tsx; keeps its three #EBF2FE cards and grid).
 * NEW FEATURE: needs an offer entity — deal type, sku, offer price, valid from/to
 * (prototype data: data/offers.json). Product name, image, pack size and regular price are existing fields.
 */

const RED_AA = '#D50000'
const focusRing = { '&.Mui-focusVisible, &:focus-visible': { outline: `3px solid ${RED_AA}`, outlineOffset: 2 } }

export type Offer = { id: string; deal_type: string; sku: string; offer_price: number; valid_from: string; valid_to: string; note?: string }

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
/** "2026-10-12" → "Mon, Oct 12" without timezone or locale drift between server and browser. */
const shortDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  return `${DAYS[dt.getDay()]}, ${MONTHS[m - 1]} ${d}`
}

function DealCard({ offer, product }: { offer: Offer; product: Product }) {
  const { add } = useCart()
  const [qty, setQty] = useState('1')
  const regular = regularPrice(product)
  const save = Math.max(0, regular - offer.offer_price)
  const pack = packSize(product)
  const href = `/p/${product.url_key}`

  return (
    <Card
      component="article"
      aria-label={`${offer.deal_type}: ${product.name}, ${pack}, ${money(offer.offer_price)}`}
      sx={{
        backgroundColor: '#EBF2FE', boxShadow: 2, borderRadius: 3, border: '1px solid transparent', transition: '0.3s', '&:hover': { borderColor: '#2196F3' },
        height: '100%', display: 'flex', flexDirection: 'column', p: { xs: 2, md: 2.5 }, gap: 1.75,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, bgcolor: RED_AA, color: '#fff', px: 1.25, height: 26, borderRadius: '40px', fontSize: 12, fontWeight: 700 }}>
          <LocalOfferOutlinedIcon sx={{ fontSize: 14 }} /> {offer.deal_type}
        </Box>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, color: '#4B5563', fontSize: 12.5, fontWeight: 500 }}>
          <ScheduleIcon sx={{ fontSize: 15 }} /> Ends {shortDate(offer.valid_to)}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
        <Box component={Link} href={href} tabIndex={-1} aria-hidden sx={{ width: { xs: 96, md: 110 }, flexShrink: 0, bgcolor: '#fff', borderRadius: '8px', overflow: 'hidden', border: '1px solid #DCE6F8' }}>
          <ProductImage product={product} size={18} />
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography sx={{ fontSize: 12, color: '#6B7280' }}>{product.sku}</Typography>
          <Box component={Link} href={href} title={product.name} sx={{ color: '#0C0C0C', textDecoration: 'none', '&:hover': { color: RED_AA }, '&:focus-visible': { outline: `3px solid ${RED_AA}`, outlineOffset: 2 } }}>
            <Typography component="h3" sx={{ fontSize: { xs: 15, md: 16 }, fontWeight: 600, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {product.name}
            </Typography>
          </Box>
          {pack && (
            <Box component="span" sx={{ display: 'inline-block', mt: 0.75, fontSize: '11px', fontWeight: 500, color: '#555', bgcolor: '#F5F5F5', border: '1px solid #EAEAEA', borderRadius: '4px', p: '2px 6px', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {pack}
            </Box>
          )}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, flexWrap: 'wrap' }}>
        <Typography sx={{ fontSize: { xs: 24, md: 26 }, fontWeight: 700, color: RED_AA, lineHeight: 1 }}>{money(offer.offer_price)}</Typography>
        {save > 0 && <Typography sx={{ fontSize: 14, color: '#6B7280', textDecoration: 'line-through' }} aria-label={`Regular price ${money(regular)}`}>{money(regular)}</Typography>}
        {save > 0 && <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#05753D' }}>Save {money(save)}</Typography>}
        {offer.note && <Typography sx={{ fontSize: 12.5, color: '#4B5563', width: '100%' }}>{offer.note}</Typography>}
      </Box>

      <Box sx={{ display: 'flex', height: 44, mt: 'auto' }}>
        <InputBase
          value={qty}
          onChange={(e) => setQty(e.target.value.replace(/\D/g, '').slice(0, 3))}
          inputProps={{ 'aria-label': `Quantity for ${product.name}`, inputMode: 'numeric', style: { padding: '0 12px' } }}
          sx={{ width: 72, height: 44, border: '1px solid #D1D5DB', borderRight: 'none', borderRadius: '8px 0 0 8px', fontSize: 14, bgcolor: '#fff' }}
        />
        <Button
          onClick={() => add(product.sku, Math.max(1, parseInt(qty || '1', 10)))}
          variant="contained"
          disableElevation
          sx={{ flex: 1, height: 44, bgcolor: RED_AA, color: '#fff', borderRadius: '0 8px 8px 0', textTransform: 'none', fontWeight: 600, fontSize: 14, '&:hover': { bgcolor: '#B00000' }, ...focusRing }}
        >
          Add to Cart
        </Button>
      </Box>
    </Card>
  )
}

export default function WeeklyDeals({ offers, products }: { offers: Offer[]; products: Product[] }) {
  const deals = offers
    .map((o) => ({ offer: o, product: products.find((p) => p.sku === o.sku) }))
    .filter((d): d is { offer: Offer; product: Product } => !!d.product)
  if (!deals.length) return null

  return (
    <Box component="section" aria-labelledby="deals-title" sx={{ pt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography sx={{ fontSize: { xs: '9px', sm: '11px' }, fontWeight: 800, color: '#FF413D', letterSpacing: '2px', textTransform: 'uppercase' }}>Flyers &amp; Offers</Typography>
          <Typography id="deals-title" component="h2" sx={{ fontWeight: 700, color: '#0C0C0C', fontSize: { xs: '18px', sm: '20px', md: '24px' }, lineHeight: 1.2 }}>This Week&apos;s Deals</Typography>
        </Box>
        <Button
          component={Link}
          href="/flyers-offers"
          sx={{ borderColor: RED_AA, color: RED_AA, fontWeight: 700, border: 1, borderRadius: '100px', height: { xs: 40, md: 45 }, px: 3, textTransform: 'none', fontSize: { xs: 13, md: 15 }, '&:hover': { backgroundColor: RED_AA, color: 'white' }, ...focusRing }}
        >
          See all Flyers &amp; Offers
        </Button>
      </Box>
      <Grid container spacing={4} sx={{ pt: 2.5, pb: 4 }}>
        {deals.map((d) => (
          <Grid item xs={12} sm={6} md={4} key={d.offer.id}>
            <DealCard offer={d.offer} product={d.product} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
