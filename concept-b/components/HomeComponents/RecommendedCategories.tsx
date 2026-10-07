import { Box } from '@mui/material'
import { SectionHeading } from './HomeSection'
import type { Category } from '../../lib/data'
import CategoryCard from './CategoryCard'

/** Recommended Categories row (real: RecommendedCategories.tsx). */
function RecommendedCategories({ data }: { data: Category[] }) {
  return (
    <Box>
      <SectionHeading id="departments-title" eyebrow="Browse" title="Shop by department" subtitle="Nine departments, everything a commercial kitchen needs" action={{ label: 'View all categories', href: '/all-categories' }} />
      <Box
        sx={{
          display: 'grid', gridAutoColumns: { xs: 'minmax(100px, 1fr)', sm: 'minmax(140px, 1fr)', md: 'minmax(187px, 1fr)' }, gridAutoFlow: 'column',
          gap: { xs: 1.5, sm: 2, md: 3 }, overflowX: 'auto', pb: 2, scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {data.map((c) => <CategoryCard key={c.uid} name={c.name} image={c.image} href={`/${c.url_key}`} />)}
      </Box>
    </Box>
  )
}

export default RecommendedCategories
