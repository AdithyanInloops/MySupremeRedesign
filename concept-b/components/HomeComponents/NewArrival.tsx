import { Box } from '@mui/material'
import type { Product } from '../../lib/data'
import { SectionHeading } from './HomeSection'
import NewArrivalCard from '../Product/cards/NewArrivalCard'
import { CardRow } from '../Product/cards/shared'

/** New Arrivals rail (real: NewArrival.tsx — only rendered with 4+ products) — Concept B editorial cards. */
const NewArrival = ({ products }: { products: Product[] }) =>
  products.length >= 4 ? (
    <Box>
      <SectionHeading id="new-arrivals-title" eyebrow="Just in" title="New Arrivals" subtitle="The latest products added to the warehouse" action={{ label: 'View all', href: '/search/all' }} />
      <CardRow itemWidth={{ xs: '47%', sm: '31%', md: '220px' }} gap={{ xs: 1.5, md: 2.5 }}>
        {products.map((p) => <NewArrivalCard key={p.sku} product={p} />)}
      </CardRow>
    </Box>
  ) : null

export default NewArrival
