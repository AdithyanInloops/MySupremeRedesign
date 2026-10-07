import { useEffect, useState } from 'react'
import { Box, Button } from '@mui/material'
import { productBySku, type Product } from '../../lib/data'
import { useCart } from '../../lib/cart'
import Section from '../ui/Section'
import ProductCard from '../Product/ProductCard'
import { Rail } from '../Product/ProductRail'
import { HistoryIcon } from '../ui/icons'

/**
 * "Pick up where you left off": the buyer's recently viewed products as compact cards with an in-place cart control.
 * Shown only when there is history — first-time visitors aren't shown a block of guesses.
 * Production: GraphCommerce recently-viewed store (signed-in: last order lines).
 */
export default function RecentlyViewed() {
  const { recentlyViewed, clearViewed, ready } = useCart()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const viewed = recentlyViewed.map((s) => productBySku(s)).filter(Boolean) as Product[]
  if (!mounted || !ready || !viewed.length) return null
  return (
    <Section
      id="recently-viewed"
      band="subtle"
      eyebrow="Welcome back"
      title="Pick up where you left off"
      subtitle={`${viewed.length} product${viewed.length === 1 ? '' : 's'} you looked at recently`}
      extra={<Button onClick={clearViewed} startIcon={<HistoryIcon />} sx={{ color: 'text.secondary' }}>Clear history</Button>}
    >
      <Rail label="Recently viewed products" itemWidth={{ xs: '86%', sm: '58%', md: '40%', lg: '31.5%', xl: '24%' }}>
        {viewed.map((p) => <Box role="listitem" key={p.sku}><ProductCard product={p} variant="compact" /></Box>)}
      </Rail>
    </Section>
  )
}
