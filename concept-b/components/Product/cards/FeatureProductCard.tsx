import Link from 'next/link'
import { Box, Button, Typography } from '@mui/material'
import AddShoppingCartRoundedIcon from '@mui/icons-material/AddShoppingCartRounded'
import type { Product } from '../../../lib/data'
import { useCart } from '../../../lib/cart'
import { CardImage, CardName, HeartButton, MiniStepper, PackChip, PriceLine, RED_AA, SaleBadge, cardLabel, focusRing, productHref, reduceMotion, useQty } from './shared'

/**
 * Concept B — Recommended Products card: a taller "premium" card with the photo on a soft rounded panel,
 * heart top-right, large price, and a quantity stepper + full-width Add to cart.
 */
export default function FeatureProductCard({ product }: { product: Product }) {
  const { add } = useCart()
  const { qty, setQty } = useQty()
  return (
    <Box
      component="article"
      aria-label={cardLabel(product)}
      sx={{
        height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#fff', borderRadius: '16px', border: '1px solid #ECEEF1', p: 1.25,
        transition: 'transform .2s ease, box-shadow .2s ease', '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 14px 30px -12px rgba(17,24,39,.22)' }, ...reduceMotion,
      }}
    >
      <Box sx={{ position: 'relative', aspectRatio: '1 / 1', borderRadius: '12px', bgcolor: '#F5F6F8', overflow: 'hidden' }}>
        <Box component={Link} href={productHref(product)} tabIndex={-1} aria-hidden sx={{ position: 'absolute', inset: 0 }}>
          <CardImage product={product} placeholderSize={34} />
        </Box>
        <SaleBadge product={product} sx={{ position: 'absolute', top: 10, left: 10 }} />
        <HeartButton product={product} sx={{ position: 'absolute', top: 8, right: 8 }} />
      </Box>
      <Box sx={{ px: 0.5, pt: 1.5, display: 'flex', flexDirection: 'column', gap: 0.75, flex: 1 }}>
        <Typography sx={{ fontSize: 11.5, color: '#6B7280', letterSpacing: '.04em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>SKU {product.sku}</Typography>
        <CardName product={product} sx={{ fontSize: 15, minHeight: '2.7em' }} />
        <Box><PackChip product={product} /></Box>
        <Box sx={{ mt: 'auto', pt: 0.5 }}><PriceLine product={product} size={20} /></Box>
        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
          <MiniStepper qty={qty} setQty={setQty} label={product.name} />
          <Button
            onClick={() => { add(product.sku, qty); setQty(1) }}
            variant="contained"
            disableElevation
            startIcon={<AddShoppingCartRoundedIcon />}
            aria-label={`Add ${qty} ${product.name} to cart`}
            sx={{ flex: 1, minWidth: 0, height: 42, borderRadius: '10px', bgcolor: RED_AA, textTransform: 'none', fontWeight: 600, fontSize: 13.5, whiteSpace: 'nowrap', '&:hover': { bgcolor: '#B00000' }, ...focusRing, '& .MuiButton-startIcon': { mr: 0.5 } }}
          >
            Add
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
