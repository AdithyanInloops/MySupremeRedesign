import { useEffect, useState } from 'react'
import { Box, Button } from '@mui/material'
import { ProductRow } from '../Product/ProductCarousel'
import { SectionHeading } from './HomeSection'
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
    <Box>
      <SectionHeading
        id="recently-viewed-title"
        eyebrow={hasHistory ? 'Welcome back' : 'Popular right now'}
        title={hasHistory ? 'Pick up where you left off' : 'Popular with kitchens like yours'}
        subtitle={hasHistory ? `${viewed.length} product${viewed.length === 1 ? '' : 's'} you viewed recently` : 'Products you view will appear here for quick reordering'}
        extra={hasHistory ? (
          <Button onClick={clearViewed} sx={{ color: '#4B5563', textTransform: 'none', fontWeight: 500, flexShrink: 0, '&.Mui-focusVisible': { outline: '3px solid #2d297d' } }}>
            Clear history
          </Button>
        ) : undefined}
      />
      <ProductRow products={items.slice(0, 12)} />
    </Box>
  )
}
