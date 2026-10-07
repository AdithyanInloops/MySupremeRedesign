import { Box } from '@mui/material'
import type { Product } from '../../lib/data'
import ProductCard from './ProductCard'

export const gridColumns = { xs: 'repeat(2, minmax(0,1fr))', md: 'repeat(3, minmax(0,1fr))', lg: 'repeat(4, minmax(0,1fr))', xl: 'repeat(5, minmax(0,1fr))' }

/** 2 columns on phones up to 5 on wide desktops. `columns` overrides (e.g. next to a filter sidebar). */
export default function ProductGrid({ products, columns = gridColumns, label = 'Products' }: { products: Product[]; columns?: Record<string, string>; label?: string }) {
  return (
    <Box component="ul" aria-label={label} sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: { xs: 1.5, md: 2 }, gridTemplateColumns: columns }}>
      {products.map((p, i) => (
        <Box component="li" key={`${p.sku}-${i}`} sx={{ minWidth: 0 }}><ProductCard product={p} /></Box>
      ))}
    </Box>
  )
}
