import Head from 'next/head'
import { Box } from '@mui/material'
import { brands, departments, hasImage, newArrivals, products, productsIn, recommendedProducts } from '../lib/data'
import offersJson from '../data/offers.json'
import zonesJson from '../data/delivery-zones.json'
import Supremebanner from '../components/HomeComponents/Supremebanner'
import RecommentedProducts from '../components/HomeComponents/RecommentedProducts'
import FeaturedOffersCarousel, { type PromoSlide } from '../components/HomeComponents/FeaturedOffersCarousel'
import RecommendedCategories from '../components/HomeComponents/RecommendedCategories'
import Homebanner from '../components/HomeComponents/homebanner'
import PromoTwoCards2 from '../components/HomeComponents/PromoTwoCards2'
import NewArrival from '../components/HomeComponents/NewArrival'
import Banner from '../components/HomeComponents/Banner'
import FeatureCards from '../components/HomeComponents/FeatureCards'
import HomeSection from '../components/HomeComponents/HomeSection'
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
// Concept B — "Featured offers" carousel slides (a CMS block in production). The old Packaging / Produce
// posters (package-offer.jpeg, produce-offer-1.jpeg) carry their own dated text, so those slides use the
// Magento department photos instead (CLAUDE.md §7).
const deptImage = (key: string) => departments.find((d) => d.url_key === key)?.image ?? ''
const featuredOffers: PromoSlide[] = [
  {
    id: 'wholesale', tag: 'Wholesale', title: 'Wholesale sourcing, made simple', href: '/account/signin', cta: 'Register for business pricing',
    subtitle: 'Quality brands across every department — register for business pricing',
    media: { kind: 'poster', src: '/assets/sum-offer-1.jpeg', alt: 'Elevate your business — wholesale sourcing made simple' },
  },
  {
    id: 'canola', tag: 'In-store deal', title: '16L canola oil — now $42.99', href: '/search/canola',
    subtitle: 'Limited-time offer at our Mississauga cash & carry',
    media: { kind: 'poster', src: '/assets/sum-offer-2.jpeg', alt: 'Business owners — 16L canola oil deal, now $42.99' },
  },
  {
    id: 'packaging', tag: 'Department', title: 'Packaging for every order', href: '/packaging',
    subtitle: 'Containers, cups, bags and cutlery for takeout and delivery',
    media: { kind: 'photo', src: deptImage('packaging'), alt: 'Takeout packaging', overlayTitle: 'Packaging', overlayText: 'Foodservice packaging — fresh, secure, professional' },
  },
  {
    id: 'produce', tag: 'Department', title: 'Fresh produce, picked for kitchens', href: '/produce',
    subtitle: 'Fruit, vegetables and herbs delivered on cold-chain routes',
    media: { kind: 'photo', src: deptImage('produce'), alt: 'Fresh fruit and vegetables', overlayTitle: 'Produce', overlayText: 'Fresh, quality produce selected for foodservice' },
  },
  {
    id: 'dairy', tag: 'Department', title: 'Dairy & eggs, stocked daily', href: '/dairy-eggs',
    subtitle: 'Milk, cheese, butter and eggs in foodservice sizes',
    media: { kind: 'photo', src: deptImage('dairy-eggs'), alt: 'Dairy products and eggs', overlayTitle: 'Dairy & Eggs', overlayText: 'Fresh dairy and eggs you can trust' },
  },
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
    <Box sx={{ bgcolor: '#fff' }}>
      <Head>
        <title>MySupreme - Wholesale Food &amp; Restaurant Supply</title>
        <meta name="description" content="Fast, reliable support for all your wholesale food and restaurant supply needs." />
      </Head>

      {/*
        Concept B — every section sits in a HomeSection: same spacing, same heading style, and alternating
        white / soft-grey bands so each section reads as its own block. Order (every live section is kept):
        Order fast → Browse → Deals → Discover → Delivery & service → Trust & help.
      */}

      {/* ── 1. Order fast ──────────────────────────── */}
      {/* 1. Hero banner slider */}
      <Box sx={{ maxWidth: 1500, mx: 'auto', pt: '2px', px: '12px' }}>
        <Supremebanner imageUrls={imageUrls} mobileImageUrls={mobileImageUrls} />
      </Box>

      {/* NEW (Concept B #1) — Quick Order bar */}
      <HomeSection id="quick-order" tight>
        <QuickOrderBar products={products} popularSkus={popularSkus} />
      </HomeSection>

      {/* NEW (Concept B #7) — Pick up where you left off (recently viewed) */}
      <HomeSection id="recently-viewed" band="grey">
        <RecentlyViewed fallback={recommendedProducts.slice(4, 10)} />
      </HomeSection>

      {/* ── 2. Browse ──────────────────────────── */}
      {/* 5. Recommended Categories → "Shop by department" */}
      <HomeSection id="departments">
        <RecommendedCategories data={departments} />
      </HomeSection>

      {/* NEW (Concept B #5) — Shop by your kitchen */}
      <HomeSection id="shop-by-kitchen" band="grey">
        <ShopByBusiness />
      </HomeSection>

      {/* ── 3. Deals ──────────────────────────── */}
      {/* 11. Offer cards → CHANGED (Concept B #4) */}
      <HomeSection id="weekly-deals">
        <WeeklyDeals offers={offersJson.offers as Offer[]} products={products} />
      </HomeSection>

      {/* 3. Two large promo images + 4. PromoTwoCards */}
      <HomeSection id="featured-offers" band="grey" eyebrow="Promotions" title="Featured offers" subtitle="Current promotions from our warehouse">
        <FeaturedOffersCarousel slides={featuredOffers} />
      </HomeSection>

      {/* ── 4. Discover ──────────────────────────── */}
      {/* 2. Recommended Products */}
      <HomeSection id="recommended">
        <RecommentedProducts products={recommendedProducts} />
      </HomeSection>

      {/* NEW (Concept B #2) — Trending by Department */}
      <HomeSection id="trending" band="grey">
        <TrendingByDepartment departments={departments} productsByDepartment={productsByDepartment} initialTab="produce" />
      </HomeSection>

      {/* NEW (Concept B #6) — Ready-to-order kits */}
      <HomeSection id="kits">
        <StarterKits kits={kitsJson.kits as Kit[]} products={products} />
      </HomeSection>

      {/* 9. New Arrivals */}
      <HomeSection id="new-arrivals" band="grey">
        <NewArrival products={newArrivals} />
      </HomeSection>

      {/* 8. PromoTwoCards2 */}
      <HomeSection id="more-departments" eyebrow="Departments" title="Fresh and stock-ready" subtitle="Dairy, eggs and pantry staples for every kitchen">
        <PromoTwoCards2 items={promoTestData2} />
      </HomeSection>

      {/* 7. Our Brands */}
      <HomeSection id="brands" band="grey">
        <Homebanner brandList={brands} />
      </HomeSection>

      {/* ── 5. Delivery & service ──────────────────────────── */}
      {/* 6. Delivery banner → CHANGED (Concept B #3) */}
      <HomeSection id="delivery">
        <DeliveryCheckBanner data={zonesJson as DeliveryZones} />
      </HomeSection>

      {/* 10. Click & Collect banner (desktop only, as live) */}
      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
        <HomeSection id="click-and-collect" tight>
          <Banner />
        </HomeSection>
      </Box>

      {/* 12. Feature cards */}
      <HomeSection id="why-mysupreme" band="grey" eyebrow="Why MySupreme" title="Built for busy kitchens" align="center">
        <FeatureCards />
      </HomeSection>

      {/* ── 6. Trust & help ──────────────────────────── */}
      {/* NEW (Concept B #8) — Trusted by Ontario kitchens */}
      <HomeSection id="trust">
        <TrustStrip />
      </HomeSection>

      {/* NEW (Concept B #9) — Open a business account in 3 steps */}
      <HomeSection id="business-account" band="grey">
        <BusinessAccountSteps />
      </HomeSection>

      {/* NEW (Concept B #10) — Quick answers (FAQ) */}
      <HomeSection id="faq">
        <HomeFAQ />
      </HomeSection>
    </Box>
  )
}
