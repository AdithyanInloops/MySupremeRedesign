import { useState } from 'react'
import { Box, IconButton, Stack } from '@mui/material'
import ChevronLeftRounded from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded'
import { tokens } from '../../../theme'
import { pctOff, type Product } from '../../../data/catalog'
import { ProductImage } from '../../../components/Brand'
import { WishlistButton } from '../../../components/Commerce'

const c = tokens.color

/** PDP gallery — handles 0 (placeholder), 1 (no controls) and 2+ images (arrows, dots, thumbnails). */
export default function Gallery({ product }: { product: Product }) {
  const imgs = product.images
  const [i, setI] = useState(0)
  const many = imgs.length > 1
  const go = (d: number) => setI((x) => (x + d + imgs.length) % imgs.length)
  const off = pctOff(product)
  const arrow = (d: number) => (
    <IconButton
      aria-label={d < 0 ? 'Previous image' : 'Next image'}
      onClick={() => go(d)}
      sx={{ position: 'absolute', top: '50%', [d < 0 ? 'left' : 'right']: 12, transform: 'translateY(-50%)', width: 44, height: 44, bgcolor: 'rgba(255,255,255,.92)', boxShadow: tokens.shadow.hover, '&:hover': { bgcolor: '#fff', color: c.red } }}
    >
      {d < 0 ? <ChevronLeftRounded /> : <ChevronRightRounded />}
    </IconButton>
  )
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: many ? '76px 1fr' : '1fr' }, gap: 1.5 }}>
      {many && (
        <Stack direction={{ xs: 'row', md: 'column' }} spacing={1} sx={{ order: { xs: 2, md: 1 } }}>
          {imgs.map((src, k) => (
            <Box
              key={src}
              component="button"
              onClick={() => setI(k)}
              aria-label={`Show image ${k + 1}`}
              aria-current={k === i}
              sx={{ p: 0, width: 76, height: 76, borderRadius: `${tokens.radius.sm}px`, overflow: 'hidden', cursor: 'pointer', bgcolor: '#fff', border: `2px solid ${k === i ? c.navy : c.line}` }}
            >
              <Box component="img" src={src} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Box>
          ))}
        </Stack>
      )}
      <Box sx={{ position: 'relative', order: { xs: 1, md: 2 }, bgcolor: '#fff', border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.lg}px`, p: { xs: 1, md: 1.5 } }}>
        <Stack spacing={0.5} sx={{ position: 'absolute', top: 20, left: 20, zIndex: 1, alignItems: 'flex-start' }}>
          {off > 0 && <Box sx={{ bgcolor: c.red, color: '#fff', fontSize: 13, fontWeight: 700, px: 1.25, py: 0.4, borderRadius: 1 }}>−{off}% off</Box>}
          {product.isNew && <Box sx={{ bgcolor: c.navy, color: '#fff', fontSize: 12, fontWeight: 700, px: 1.25, py: 0.4, borderRadius: 1 }}>NEW</Box>}
        </Stack>
        <WishlistButton sku={product.sku} sx={{ position: 'absolute', top: 18, right: 18, zIndex: 1 }} />
        <ProductImage src={imgs[i]} alt={`${product.name}${many ? ` — image ${i + 1} of ${imgs.length}` : ''}`} brand={product.brand} sx={{ borderRadius: `${tokens.radius.md}px` }} />
        {many && arrow(-1)}
        {many && arrow(1)}
        {many && (
          <Stack direction="row" spacing={0.75} justifyContent="center" sx={{ position: 'absolute', bottom: 22, left: 0, right: 0 }}>
            {imgs.map((_, k) => (
              <Box key={k} sx={{ width: k === i ? 22 : 8, height: 8, borderRadius: 4, bgcolor: k === i ? c.navy : 'rgba(255,255,255,.9)', boxShadow: '0 0 0 1px rgba(17,24,39,.15)', transition: 'width .2s' }} />
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  )
}
