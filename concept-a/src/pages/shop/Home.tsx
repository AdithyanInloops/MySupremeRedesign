import { Box, Stack } from '@mui/material'
import { tokens } from '../../theme'
import { newArrivals, photo, promoTiles, recommended } from '../../data/catalog'
import { useApp } from '../../state/AppState'
import { Container, SectionHeader } from '../../components/ui'
import { ProductRail } from '../../components/Commerce'
import { HeroBento, PromoTile } from './home/Hero'
import { AppBand, BrandStrip, BuyAgain, DeliveryBanner, DepartmentGrid, OfferCards, WhyCards } from './home/Sections'

/**
 * Home — every block is self-contained so Magento Page Builder / Plasmic can reorder or swap it.
 * Order: hero → buy again → recommended → departments → promo tiles → delivery → offers → new → brands → why → app.
 */
export default function Home() {
  const { review } = useApp()
  const gap = { xs: 5, md: 8 }
  // Hero side uses tile 0; this row shows the rest plus a produce campaign tile.
  const tiles = [...promoTiles.slice(1), { id: 't4', title: 'Fresh Fruit by the Case', body: 'Citrus, avocado & tropicals', href: '/c/produce', image: photo('fruit', 900, 700), cta: 'Shop Produce' }]
  return (
    <Box sx={{ pt: { xs: 1.5, md: 3 } }}>
      <Container>
        <Stack spacing={gap}>
          <HeroBento />
          <BuyAgain />
          <Box>
            <SectionHeader eyebrow="Picked by our buyers" title="Recommended for your kitchen" action="See all" href="/search/recommended" />
            <ProductRail items={recommended.slice(0, 12)} loading={review.loading} />
          </Box>
          <DepartmentGrid />
          <Box sx={{ display: 'grid', gap: { xs: 1.5, md: 2 }, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' } }}>
            {tiles.map((t) => <PromoTile key={t.id} t={t} tall />)}
          </Box>
          <DeliveryBanner />
          <OfferCards />
          <Box>
            <SectionHeader eyebrow="Just landed" title="New arrivals" action="See all new" href="/search/new" />
            <ProductRail items={newArrivals} loading={review.loading} />
          </Box>
          <BrandStrip />
          <WhyCards />
          <AppBand />
        </Stack>
      </Container>
      <Box sx={{ height: { xs: 8, md: 0 }, bgcolor: tokens.color.bg }} />
    </Box>
  )
}
