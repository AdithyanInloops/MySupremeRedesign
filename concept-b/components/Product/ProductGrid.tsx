import { Box } from '@mui/material'
import type { Product } from '../../lib/data'
import ProductCard from './ProductCard'

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <Box sx={{ display: 'grid', gap: { xs: 1.5, md: 2 }, gridTemplateColumns: { xs: 'repeat(2, minmax(0,1fr))', md: 'repeat(3, minmax(0,1fr))', lg: 'repeat(4, minmax(0,1fr))' } }}>
      {products.map((p) => <ProductCard key={p.sku} product={p} />)}
    </Box>
  )
}
