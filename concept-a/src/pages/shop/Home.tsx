import { Box, Stack } from '@mui/material'
import { tokens } from '../../theme'
import { newArrivals, recommended } from '../../data/catalog'
import { useApp } from '../../state/AppState'
import { Container, SectionHeader } from '../../components/ui'
import { ProductRail } from '../../components/Commerce'
import { HeroBento } from './home/Hero'
import MorePromotions from './home/MorePromotions'
import DeliveryCheckBanner from './home/DeliveryCheckBanner'
import BusinessAccountSteps from './home/BusinessAccountSteps'
import HomeFAQ from './home/HomeFAQ'
import ProfileNudge from './home/ProfileNudge'
import BrandStrip from './home/BrandStrip'
import StarterKits from './home/StarterKits'
import { BuyAgain, DepartmentGrid, WhyCards } from './home/Sections'

/**
 * Home — every block is self-contained so Magento Page Builder / Plasmic can reorder or swap it.
 * Order: hero → buy again → recommended → departments → delivery → more promotions → new → kits → brands → why → business account → FAQ.
 */
export default function Home() {
  const { review } = useApp()
  const gap = tokens.space.section
  return (
    <Box sx={{ pt: { xs: 1.5, md: 3 } }}>
      <Container>
        <Stack spacing={gap}>
          <HeroBento />
          <ProfileNudge />
          <BuyAgain />
          <Box>
            <SectionHeader eyebrow="Picked by our buyers" title="Recommended for your kitchen" action="See all" href="/search/recommended" />
            <ProductRail items={recommended.slice(0, 12)} loading={review.loading} />
          </Box>
          <DepartmentGrid />
          <DeliveryCheckBanner />
          <MorePromotions />
          <Box>
            <SectionHeader eyebrow="Just landed" title="New arrivals" action="See all new" href="/search/new" />
            <ProductRail items={newArrivals} loading={review.loading} />
          </Box>
          <StarterKits />
          <BrandStrip />
          <WhyCards />
        </Stack>
      </Container>
      {/* Bottom bands (Concept B): business account on the page grey, quick answers on white running into the footer. */}
      <Box sx={{ mt: gap, py: gap, borderTop: `1px solid ${tokens.color.line}` }}>
        <Container><BusinessAccountSteps /></Container>
      </Box>
      {/* Negative margin cancels the footer's top margin; raised so the footer's transparent wrapper never blocks clicks. */}
      <Box sx={{ position: 'relative', zIndex: 1, bgcolor: '#fff', py: gap, mb: { xs: -6, md: -10 } }}>
        <Container><HomeFAQ /></Container>
      </Box>
    </Box>
  )
}
