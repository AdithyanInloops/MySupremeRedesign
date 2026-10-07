import Link from 'next/link'
import { Box, Button } from '@mui/material'
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded'
import type { Product } from '../../../lib/data'
import { useCart } from '../../../lib/cart'
import { CardImage, CardName, PackChip, PriceLine, RED_AA, cardLabel, focusRing, productHref, reduceMotion } from './shared'

/**
 * Concept B — "Pick up where you left off" card: compact horizontal row card built for one-tap reordering
 * (image left, name, pack + price, "Add again").
 */
export default function ReorderCard({ product }: { product: Product }) {
  const { add } = useCart()
  return (
    <Box
      component="article"
      aria-label={cardLabel(product)}
      sx={{
        display: 'grid', gridTemplateColumns: '84px minmax(0,1fr)', gap: 1.5, alignItems: 'center', height: '100%', bgcolor: '#fff',
        border: '1px solid #ECEEF1', borderRadius: '14px', p: 1.25, transition: 'box-shadow .2s, border-color .2s',
        '&:hover': { borderColor: '#FFC9C9', boxShadow: '0 8px 20px -12px rgba(17,24,39,.25)' }, ...reduceMotion,
      }}
    >
      <Box component={Link} href={productHref(product)} tabIndex={-1} aria-hidden sx={{ position: 'relative', width: 84, height: 84, borderRadius: '10px', bgcolor: '#F5F6F8', overflow: 'hidden', display: 'block' }}>
        <CardImage product={product} placeholderSize={14} />
      </Box>
      <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <CardName product={product} sx={{ fontSize: 13.5 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
          <PriceLine product={product} size={15} />
          <Box sx={{ minWidth: 0 }}><PackChip product={product} /></Box>
        </Box>
        <Button
          onClick={() => add(product.sku, 1)}
          size="small"
          startIcon={<ReplayRoundedIcon sx={{ fontSize: '18px !important' }} />}
          aria-label={`Add ${product.name} to cart again`}
          sx={{ alignSelf: 'flex-start', minHeight: 36, px: 1.25, mt: 0.25, borderRadius: '8px', color: RED_AA, bgcolor: '#FFF1F1', textTransform: 'none', fontWeight: 600, fontSize: 13, '&:hover': { bgcolor: '#FFE1E1' }, ...focusRing }}
        >
          Add again
        </Button>
      </Box>
    </Box>
  )
}
