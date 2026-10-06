import { useEffect, useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import ProductCard from '../Product/ProductCard'
import { productBySku, type Product } from '../../lib/data'
import { useCart } from '../../lib/cart'

/**
 * Concept B #7 — "Pick up where you left off": the buyer's recently viewed products (front-end history,
 * existing product data only). First visit: shows `fallback` products so the section is never empty.
 */
export default function RecentlyViewed({ fallback }: { fallback: Product[] }) {
  const { recentlyViewed, clearViewed } = useCart()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const viewed = (recentlyViewed.map((s) => productBySku(s)).filter(Boolean) as Product[])
  const hasHistory = viewed.length > 0
  const items = hasHistory ? viewed : fallback
  if (!items.length) return null

  return (
    <Box component="section" aria-labelledby="recently-viewed-title" sx={{ px: '12px', py: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, gap: 2 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography id="recently-viewed-title" component="h2" sx={{ fontSize: { xs: 18, md: 26 }, fontWeight: 500, color: '#0C0C0C' }}>
            {hasHistory ? 'Pick up where you left off' : 'Popular with kitchens like yours'}
          </Typography>
          <Typography sx={{ fontSize: { xs: 12, md: 14 }, color: '#6B7280' }}>
            {hasHistory ? `${viewed.length} product${viewed.length === 1 ? '' : 's'} you viewed recently` : 'Products you view will appear here for quick reordering'}
          </Typography>
        </Box>
        {hasHistory && (
          <Button
            onClick={clearViewed}
            sx={{ color: '#4B5563', textTransform: 'none', fontWeight: 500, flexShrink: 0, '&.Mui-focusVisible': { outline: '3px solid #2d297d' } }}
          >
            Clear
          </Button>
        )}
      </Box>
      <Box sx={{ display: 'flex', gap: { xs: 1.5, md: 2 }, overflowX: 'auto', pb: 1, scrollSnapType: 'x mandatory', '&::-webkit-scrollbar': { height: 6 }, '&::-webkit-scrollbar-thumb': { bgcolor: '#E5E7EB', borderRadius: 3 } }}>
        {items.slice(0, 12).map((p) => (
          <Box key={p.sku} sx={{ flex: '0 0 auto', width: { xs: 175, sm: 200, md: 220, lg: 237 }, scrollSnapAlign: 'start' }}>
            <ProductCard product={p} />
          </Box>
        ))}
      </Box>
    </Box>
  )
}
