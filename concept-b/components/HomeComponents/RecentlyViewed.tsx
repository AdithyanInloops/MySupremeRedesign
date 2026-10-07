import { useEffect, useState } from 'react'
import { Box, Button } from '@mui/material'
import ReorderCard from '../Product/cards/ReorderCard'
import { CardRow } from '../Product/cards/shared'
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
  // Two rows when there's enough history; columns fill the row width instead of leaving a gap.
  const shown = items.slice(0, 12)
  const rows = shown.length > 4 ? 2 : 1
  const cols = Math.ceil(shown.length / rows)
  const colWidth = (n: number) => (n <= 1 ? '360px' : `calc((100% - ${(n - 1) * 16}px) / ${n})`)

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
      {/* Concept B — compact reorder cards, two rows on wider screens */}
      <CardRow itemWidth={{ xs: '85%', sm: '320px', md: colWidth(Math.min(3, cols)), lg: colWidth(Math.min(4, cols)) }} rows={rows}>
        {shown.map((p) => <ReorderCard key={p.sku} product={p} />)}
      </CardRow>
    </Box>
  )
}
