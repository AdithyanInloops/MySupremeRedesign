import Link from 'next/link'
import { Box, Button, Typography } from '@mui/material'
import type { Product } from '../../lib/data'
import ProductCard from './ProductCard'

/** Title + outlined red "View all" pill + horizontal scroll row (RecommentedProducts / NewArrival). */
export default function ProductCarousel({ title, products, href = '/all-categories' }: { title: string; products: Product[]; href?: string }) {
  return (
    <Box component="section" sx={{ px: { xs: '12px', md: '12px' }, py: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography component="h2" sx={{ fontSize: { xs: 18, md: 26 }, fontWeight: 500, color: '#0C0C0C' }}>{title}</Typography>
        <Button component={Link} href={href} variant="outlined" sx={{ borderRadius: '40px', borderColor: '#FF0000', color: '#FF0000', textTransform: 'none', fontWeight: 500, fontSize: { xs: 13, md: 15 }, px: { xs: 2, md: 3 }, height: { xs: 34, md: 40 }, '&:hover': { borderColor: '#FF0000', bgcolor: 'rgba(255,0,0,.04)' } }}>
          View all
        </Button>
      </Box>
      <Box sx={{ display: 'flex', gap: { xs: 1.5, md: 2 }, overflowX: 'auto', pb: 1, scrollSnapType: 'x mandatory', '&::-webkit-scrollbar': { height: 6 }, '&::-webkit-scrollbar-thumb': { bgcolor: '#E5E7EB', borderRadius: 3 } }}>
        {products.map((p) => (
          <Box key={p.sku} sx={{ flex: '0 0 auto', width: { xs: 175, sm: 200, md: 220, lg: 237 }, scrollSnapAlign: 'start' }}>
            <ProductCard product={p} />
          </Box>
        ))}
      </Box>
    </Box>
  )
}
