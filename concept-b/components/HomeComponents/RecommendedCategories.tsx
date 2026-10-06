import Link from 'next/link'
import { Box, Button, Typography } from '@mui/material'
import type { Category } from '../../lib/data'
import CategoryCard from './CategoryCard'

/** Recommended Categories row (real: RecommendedCategories.tsx). */
function RecommendedCategories({ data }: { data: Category[] }) {
  return (
    <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden', px: { xs: 2, sm: 4, md: 6, lg: '40px' } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', mx: 'auto' }}>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 700, color: '#0C0C0C', py: { xs: 1.5, sm: 2, md: 3 }, fontSize: { xs: '14px', md: '16px' }, letterSpacing: '-0.02em' }}>
          Recommended Categories
        </Typography>
        <Button
          component={Link}
          href="/all-categories"
          sx={{
            borderColor: 'primary.main', color: 'primary.main', fontWeight: 600, border: 1, borderRadius: '40px', height: { xs: '28px', sm: '34px', md: '40px' },
            px: { xs: 1.5, sm: 2, md: 3 }, '&:hover': { backgroundColor: '#FF0000', color: 'white', borderColor: '#FF0000' }, fontSize: { xs: '10px', sm: '12px', md: '14px' }, textTransform: 'none',
          }}
        >
          View all Categories
        </Button>
      </Box>
      <Box
        sx={{
          display: 'grid', gridAutoColumns: { xs: 'minmax(100px, 1fr)', sm: 'minmax(140px, 1fr)', md: 'minmax(187px, 1fr)' }, gridAutoFlow: 'column',
          gap: { xs: 1.5, sm: 2, md: 3 }, maxWidth: '1400px', overflowX: 'auto', pb: 2, scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {data.map((c) => <CategoryCard key={c.uid} name={c.name} image={c.image} href={`/${c.url_key}`} />)}
      </Box>
    </Box>
  )
}

export default RecommendedCategories
