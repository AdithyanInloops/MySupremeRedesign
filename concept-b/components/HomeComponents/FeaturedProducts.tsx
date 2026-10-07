import { useState } from 'react'
import { Box, Tab, Tabs } from '@mui/material'
import type { Product } from '../../lib/data'
import { colors } from '../../lib/theme'
import Section from '../ui/Section'
import ProductRail from '../Product/ProductRail'

/**
 * Recommended + New arrivals in one block (they were two near-identical rails). Same card, same rail;
 * the tab decides the feed. Production: Magento "recommended" / "new" product flags.
 */
export default function FeaturedProducts({ recommended, newArrivals }: { recommended: Product[]; newArrivals: Product[] }) {
  const [tab, setTab] = useState<'rec' | 'new'>('rec')
  const list = tab === 'rec' ? recommended : newArrivals
  return (
    <Section
      id="featured"
      band="subtle"
      eyebrow="Picked for you"
      title="Featured products"
      subtitle={tab === 'rec' ? 'Best-sellers our team recommends this week' : 'The latest additions to our warehouse'}
      action={{ label: 'Browse all products', href: '/all-categories' }}
    >
      <Tabs value={tab} onChange={(_, v) => setTab(v)} aria-label="Featured products" sx={{ mb: 2.5, borderBottom: `1px solid ${colors.line}` }}>
        <Tab value="rec" label="Recommended" id="featured-tab-rec" aria-controls="featured-panel" />
        <Tab value="new" label="New arrivals" id="featured-tab-new" aria-controls="featured-panel" />
      </Tabs>
      <Box id="featured-panel" role="tabpanel" aria-labelledby={`featured-tab-${tab}`}>
        <ProductRail key={tab} products={list} label={tab === 'rec' ? 'Recommended products' : 'New arrivals'} badge={tab === 'new' ? () => ({ label: 'NEW', tone: 'navy' }) : undefined} />
      </Box>
    </Section>
  )
}
