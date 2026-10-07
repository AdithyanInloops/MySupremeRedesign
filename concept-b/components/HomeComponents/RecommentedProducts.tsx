import { Box } from '@mui/material'
import type { Product } from '../../lib/data'
import { SectionHeading } from './HomeSection'
import FeatureProductCard from '../Product/cards/FeatureProductCard'
import { CardRow } from '../Product/cards/shared'

/** Recommended Products rail (real: RecommentedProducts.tsx, Magento "recommended" flag) — Concept B feature cards. */
const RecommentedProducts = ({ products }: { products: Product[] }) =>
  products.length ? (
    <Box>
      <SectionHeading id="recommended-title" eyebrow="Picked for you" title="Recommended Products" subtitle="Best-sellers our team recommends this week" action={{ label: 'View all', href: '/search/all' }} />
      <CardRow itemWidth={{ xs: '47%', sm: '31%', md: '250px' }}>
        {products.map((p) => <FeatureProductCard key={p.sku} product={p} />)}
      </CardRow>
    </Box>
  ) : null

export default RecommentedProducts
