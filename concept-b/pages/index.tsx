import Head from 'next/head'
import { Box } from '@mui/material'
import { brands, departments, hasImage, newArrivals, products, productsIn, recommendedProducts } from '../lib/data'
import offersJson from '../data/offers.json'
import zonesJson from '../data/delivery-zones.json'
import Supremebanner from '../components/HomeComponents/Supremebanner'
import RecommentedProducts from '../components/HomeComponents/RecommentedProducts'
import SumOfferImages from '../components/HomeComponents/SumOfferImages'
import PromoTwoCards from '../components/HomeComponents/PromoTwoCards'
import RecommendedCategories from '../components/HomeComponents/RecommendedCategories'
import Homebanner from '../components/HomeComponents/homebanner'
import PromoTwoCards2 from '../components/HomeComponents/PromoTwoCards2'
import NewArrival from '../components/HomeComponents/NewArrival'
import Banner from '../components/HomeComponents/Banner'
import FeatureCards from '../components/HomeComponents/FeatureCards'
// Concept B changes (see CLAUDE.md §9 and CHANGES.md)
import QuickOrderBar from '../components/HomeComponents/QuickOrderBar'
import TrendingByDepartment from '../components/HomeComponents/TrendingByDepartment'
import DeliveryCheckBanner, { type DeliveryZones } from '../components/HomeComponents/DeliveryCheckBanner'
import WeeklyDeals, { type Offer } from '../components/HomeComponents/WeeklyDeals'
// Concept B round 2 — new sections (#5–#10, see CHANGES.md)
import ShopByBusiness from '../components/HomeComponents/ShopByBusiness'
import StarterKits, { type Kit } from '../components/HomeComponents/StarterKits'
import RecentlyViewed from '../components/HomeComponents/RecentlyViewed'
import TrustStrip from '../components/HomeComponents/TrustStrip'
import BusinessAccountSteps from '../components/HomeComponents/BusinessAccountSteps'
import HomeFAQ from '../components/HomeComponents/HomeFAQ'
import kitsJson from '../data/kits.json'

const banner = (f: string) => `/assets/banners/${f}`
const imageUrls = ['Banner-1.png', '1920_1.jpg', 'Banner2.jpg', 'banner3.jpg', '20260902-111751_1.png', '2_3.png'].map(banner)
const mobileImageUrls = ['Banner1-mobile_3.jpg', '1280_1.jpg', 'Banner2-mobile_2.jpg', 'BANEER-3.jpg', '20260902-111744.png', '1280_-720_5.jpg'].map(banner)

// Same copy and images as the live pages/index.tsx
const promoTestData = [
  { image: '/assets/package-offer.jpeg', title: 'Packaging', subtitle: 'Foodservices Packaging Fresh Secure. Professional', link: '/packaging' },
  { image: '/assets/produce-offer-1.jpeg', title: 'Produce', subtitle: 'Fresh, quality produce selected for foodservice needs.', link: '/produce' },
]
const promoTestData2 = [
  { image: '/assets/dairyandeggs.png', title: 'Dairy & Eggs', subtitle: 'Fresh, dairy and eggs trusted supply.', link: '/dairy-eggs' },
  { image: '/assets/grocery.png', title: 'Grocery', subtitle: 'Reliable, Stock-ready', link: '/grocery' },
]

const popularSkus = ['HD0031', 'RM', '59620000008478349', 'CH0043', 'FP0020']
// Prototype stand-in for Algolia trending: per department, products with photos first.
const productsByDepartment = Object.fromEntries(
  departments.map((d) => [d.url_key, [...productsIn(d.url_key)].sort((a, b) => Number(hasImage(b)) - Number(hasImage(a)))]),
)

export default function Home() {
  return (
    <Box sx={{ maxWidth: 1500, mx: 'auto' }}>
      <Head>
        <title>MySupreme - Wholesale Food &amp; Restaurant Supply</title>
        <meta name="description" content="Fast, reliable support for all your wholesale food and restaurant supply needs." />
      </Head>

      {/*
        Concept B — home order regrouped so the page reads like a shopping trip (every live section is kept):
        Order fast → Browse → Deals → Discover → Delivery & service → Trust & help.
      */}

      {/* ── 1. Order fast ──────────────────────────── */}
      {/* 1. Hero banner slider */}
      <Box sx={{ mt: '2px', mx: '12px' }}>
        <Supremebanner imageUrls={imageUrls} mobileImageUrls={mobileImageUrls} />
      </Box>

      {/* NEW (Concept B #1) — Quick Order bar */}
      <QuickOrderBar products={products} popularSkus={popularSkus} />

      {/* NEW (Concept B #7) — Pick up where you left off (recently viewed) */}
      <RecentlyViewed fallback={recommendedProducts.slice(4, 10)} />

      {/* ── 2. Browse ──────────────────────────── */}
      {/* 5. Recommended Categories */}
      <RecommendedCategories data={departments} />

      {/* NEW (Concept B #5) — Shop by your kitchen */}
      <ShopByBusiness />

      {/* ── 3. Deals ──────────────────────────── */}
      {/* 11. Offer cards → CHANGED (Concept B #4) */}
      <Box sx={{ mx: { xs: '16px', sm: '40px' } }}>
        <WeeklyDeals offers={offersJson.offers as Offer[]} products={products} />
      </Box>

      {/* 3. Two large promo images */}
      <SumOfferImages />

      {/* 4. PromoTwoCards */}
      <Box sx={{ mt: 1, mx: '12px' }}>
        <PromoTwoCards items={promoTestData} />
      </Box>

      {/* ── 4. Discover ──────────────────────────── */}
      {/* 2. Recommended Products */}
      <Box sx={{ mt: '5px' }}>
        <RecommentedProducts products={recommendedProducts} />
      </Box>

      {/* NEW (Concept B #2) — Trending by Department */}
      <TrendingByDepartment departments={departments} productsByDepartment={productsByDepartment} initialTab="produce" />

      {/* NEW (Concept B #6) — Ready-to-order kits */}
      <StarterKits kits={kitsJson.kits as Kit[]} products={products} />

      {/* 9. New Arrivals */}
      <Box sx={{ mt: '5px' }}>
        <NewArrival products={newArrivals} />
      </Box>

      {/* 8. PromoTwoCards2 */}
      <Box sx={{ mt: 4, mx: '12px' }}>
        <PromoTwoCards2 items={promoTestData2} />
      </Box>

      {/* 7. Our Brands */}
      <Homebanner brandList={brands} />

      {/* ── 5. Delivery & service ──────────────────────────── */}
      {/* 6. Delivery banner → CHANGED (Concept B #3) */}
      <DeliveryCheckBanner data={zonesJson as DeliveryZones} />

      {/* 10. Click & Collect banner (desktop only, as live) */}
      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
        <Banner />
      </Box>

      {/* 12. Feature cards */}
      <Box sx={{ mx: '40px' }}>
        <FeatureCards />
      </Box>

      {/* ── 6. Trust & help ──────────────────────────── */}
      {/* NEW (Concept B #8) — Trusted by Ontario kitchens */}
      <TrustStrip />

      {/* NEW (Concept B #9) — Open a business account in 3 steps */}
      <BusinessAccountSteps />

      {/* NEW (Concept B #10) — Quick answers (FAQ) */}
      <HomeFAQ />
    </Box>
  )
}
