import Link from 'next/link'
import { Box, Button, Typography } from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { packSize, type Product } from '../../../lib/data'
import { useCart } from '../../../lib/cart'
import { CardImage, CardName, PriceLine, RED_AA, cardLabel, focusRing, productHref, reduceMotion } from './shared'

/**
 * Concept B — New Arrivals card: minimal and editorial — no border, a tinted rounded photo panel with a
 * navy NEW pill, then name, pack, price and a text-style "Add to cart +".
 */
export default function NewArrivalCard({ product }: { product: Product }) {
  const { add } = useCart()
  const pack = packSize(product)
  return (
    <Box component="article" aria-label={`New: ${cardLabel(product)}`} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box
        component={Link}
        href={productHref(product)}
        tabIndex={-1}
        aria-hidden
        sx={{
          position: 'relative', display: 'block', aspectRatio: '4 / 5', borderRadius: '18px', overflow: 'hidden',
          // White panel with a faint cool tint + hairline border so it reads on both white and grey bands.
          background: 'linear-gradient(160deg, #FFFFFF 0%, #F4F6FB 100%)', border: '1px solid #E6E9F0',
          '& img': { transition: 'transform .35s ease' }, '&:hover img': { transform: 'scale(1.05)' }, ...reduceMotion,
        }}
      >
        <CardImage product={product} placeholderSize={30} />
        <Box sx={{ position: 'absolute', top: 12, left: 12, bgcolor: '#2d297d', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '.12em', px: 1.25, py: '3px', borderRadius: '40px' }}>
          NEW
        </Box>
      </Box>
      <Box sx={{ pt: 1.5, px: 0.25, display: 'flex', flexDirection: 'column', gap: 0.5, flex: 1 }}>
        <CardName product={product} sx={{ fontSize: 14.5, minHeight: '2.7em' }} />
        {pack && <Typography sx={{ fontSize: 12.5, color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pack}</Typography>}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mt: 'auto', pt: 0.5 }}>
          <PriceLine product={product} size={16} />
          <Button
            onClick={() => add(product.sku, 1)}
            endIcon={<AddRoundedIcon sx={{ fontSize: '18px !important' }} />}
            aria-label={`Add ${product.name} to cart`}
            sx={{ minHeight: 40, px: 1, color: RED_AA, textTransform: 'none', fontWeight: 600, fontSize: 13.5, whiteSpace: 'nowrap', '&:hover': { bgcolor: '#FFF1F1' }, ...focusRing, '& .MuiButton-endIcon': { ml: 0.25 } }}
          >
            Add to cart
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
