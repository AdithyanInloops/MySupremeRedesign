import Link from 'next/link'
import { Box, IconButton, Typography } from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded'
import type { Product } from '../../../lib/data'
import { useCart } from '../../../lib/cart'
import { CardImage, CardName, PackChip, PriceLine, RED_AA, cardLabel, focusRing, productHref, reduceMotion } from './shared'

/**
 * Concept B — Trending by Department card: image-led with a rank badge (#1, #2…), a "Trending" label
 * and a round quick-add button over the photo.
 */
export default function RankedProductCard({ product, rank }: { product: Product; rank: number }) {
  const { add } = useCart()
  return (
    <Box component="article" aria-label={`Trending number ${rank}: ${cardLabel(product)}`} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box
        sx={{
          position: 'relative', aspectRatio: '1 / 1', borderRadius: '16px', bgcolor: '#fff', border: '1px solid #ECEEF1', overflow: 'visible',
          transition: 'box-shadow .2s', '&:hover': { boxShadow: '0 12px 26px -14px rgba(17,24,39,.3)' }, ...reduceMotion,
        }}
      >
        <Box component={Link} href={productHref(product)} tabIndex={-1} aria-hidden sx={{ position: 'absolute', inset: 0, borderRadius: '16px', overflow: 'hidden' }}>
          <CardImage product={product} placeholderSize={30} />
        </Box>
        <Box
          aria-hidden
          sx={{
            position: 'absolute', top: 10, left: 10, minWidth: 40, height: 40, px: 1, borderRadius: '12px', display: 'grid', placeItems: 'center',
            bgcolor: rank <= 3 ? RED_AA : '#0C0C0C', color: '#fff', fontSize: 17, fontWeight: 700, letterSpacing: '-.02em', boxShadow: '0 4px 10px rgba(0,0,0,.15)',
          }}
        >
          #{rank}
        </Box>
        <IconButton
          onClick={() => add(product.sku, 1)}
          aria-label={`Add ${product.name} to cart`}
          sx={{
            position: 'absolute', right: 10, bottom: -18, width: 44, height: 44, bgcolor: RED_AA, color: '#fff', boxShadow: '0 6px 14px rgba(213,0,0,.35)',
            '&:hover': { bgcolor: '#B00000' }, ...focusRing,
          }}
        >
          <AddRoundedIcon />
        </IconButton>
      </Box>
      <Box sx={{ pt: 1.5, pr: 5.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25, fontSize: 11.5, fontWeight: 600, color: '#B45309' }}>
          <LocalFireDepartmentRoundedIcon sx={{ fontSize: 15, color: '#F97316' }} /> Trending
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.25 }}>
        <CardName product={product} sx={{ minHeight: '2.7em' }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <PriceLine product={product} size={16} />
          <PackChip product={product} />
        </Box>
      </Box>
    </Box>
  )
}
