import Head from 'next/head'
import { Box, Typography } from '@mui/material'
import { brands, departments, hasImage, newArrivals, products, productsIn, recommendedProducts } from '../lib/data'
import offersJson from '../data/offers.json'
import zonesJson from '../data/delivery-zones.json'
import kitsJson from '../data/kits.json'
import { colors, srOnly } from '../lib/theme'
import Section from '../components/ui/Section'
import HomeHero from '../components/HomeComponents/HomeHero'
import type { HeroSlide } from '../components/HomeComponents/Supremebanner'
import RecentlyViewed from '../components/HomeComponents/RecentlyViewed'
import BrowseCatalogue from '../components/HomeComponents/BrowseCatalogue'
import WeeklyDeals, { type Offer } from '../components/HomeComponents/WeeklyDeals'
import FeaturedOffersCarousel, { type PromoSlide } from '../components/HomeComponents/FeaturedOffersCarousel'
import FeaturedProducts from '../components/HomeComponents/FeaturedProducts'
import TrendingByDepartment from '../components/HomeComponents/TrendingByDepartment'
import StarterKits, { type Kit } from '../components/HomeComponents/StarterKits'
import BrandStrip from '../components/HomeComponents/BrandStrip'
import DeliveryCheckBanner, { type DeliveryZones } from '../components/HomeComponents/DeliveryCheckBanner'
import BusinessAccountSteps from '../components/HomeComponents/BusinessAccountSteps'
import HomeFAQ from '../components/HomeComponents/HomeFAQ'

const banner = (f: string) => `/assets/banners/${f}`

/** Magento Page Builder banners (desktop + mobile image + link). Alt text describes each banner's baked-in copy. */
const heroSlides: HeroSlide[] = [
  { desktop: banner('Banner-1.png'), mobile: banner('Banner1-mobile_3.jpg'), href: '/download-app', alt: 'Download the MySupreme app and get money off your first app order. Same-day or next-day delivery across the GTA, Hamilton and Niagara.' },
  { desktop: banner('Banner2.jpg'), mobile: banner('Banner2-mobile_2.jpg'), href: '/account/signin?mode=register', alt: 'Wholesale made simple, business made better. Shop now or register for a business account.' },
  { desktop: banner('banner3.jpg'), mobile: banner('BANEER-3.jpg'), href: '/produce', alt: 'Fresh produce, best price guaranteed. Shop produce.' },
  { desktop: banner('1920_1.jpg'), mobile: banner('1280_1.jpg'), href: '/service/contact-us', alt: 'Shop from our cash and carry store at 3750A Laird Road, Unit 9, Mississauga.' },
  { desktop: banner('2_3.png'), mobile: banner('1280_-720_5.jpg'), href: '/#delivery', alt: 'Fast and reliable B2B delivery for businesses that can’t wait.' },
  { desktop: banner('20260902-111751_1.png'), mobile: banner('20260902-111744.png'), href: '/about-us', alt: 'Meet the people who help keep your kitchen moving.' },
]

// Promotions (a CMS block in production). Department promos use Magento category photos; the dated
// package-offer / produce-offer posters are not reused (they carry their own old text).
const deptImage = (key: string) => departments.find((d) => d.url_key === key)?.image ?? ''
const promotions: PromoSlide[] = [
  { id: 'canola', tag: 'In-store deal', title: '16L canola oil — now $42.99', subtitle: 'Limited-time offer at our Mississauga cash & carry', href: '/search/canola', media: { kind: 'poster', src: '/assets/sum-offer-2.jpeg', alt: 'Business owners: 16L canola oil deal, now $42.99, was $46.99' } },
  { id: 'wholesale', tag: 'Business pricing', title: 'Wholesale sourcing, made simple', subtitle: 'Quality brands across every department', href: '/account/signin?mode=register', cta: 'Register for business pricing', media: { kind: 'poster', src: '/assets/sum-offer-1.jpeg', alt: 'Elevate your business: wholesale sourcing made simple' } },
  { id: 'packaging', tag: 'Department', title: 'Packaging for every order', subtitle: 'Containers, cups, bags and cutlery for takeout and delivery', href: '/packaging', media: { kind: 'photo', src: deptImage('packaging'), alt: '', overlayTitle: 'Packaging' } },
  { id: 'produce', tag: 'Department', title: 'Fresh produce, picked for kitchens', subtitle: 'Fruit, vegetables and herbs on cold-chain routes', href: '/produce', media: { kind: 'photo', src: deptImage('produce'), alt: '', overlayTitle: 'Produce' } },
  { id: 'dairy', tag: 'Department', title: 'Dairy & eggs, stocked daily', subtitle: 'Milk, cheese, butter and eggs in foodservice sizes', href: '/dairy-eggs', media: { kind: 'photo', src: '/assets/dairyandeggs.png', alt: '', overlayTitle: 'Dairy & Eggs' } },
  { id: 'grocery', tag: 'Department', title: 'Pantry staples, stock-ready', subtitle: 'Rice, oil, spices and sauces in bulk', href: '/grocery', media: { kind: 'photo', src: '/assets/grocery.png', alt: '', overlayTitle: 'Grocery' } },
]

// Prototype stand-in for Algolia trending: per department, products with photos first.
const productsByDepartment = Object.fromEntries(
  departments.map((d) => [d.url_key, [...productsIn(d.url_key)].sort((a, b) => Number(hasImage(b)) - Number(hasImage(a)))]),
)

/**
 * Home, grouped by what buyers come to do:
 *   Order fast (hero + quick order, recently viewed) → Browse (departments / kitchen types) → Deals →
 *   Discover (featured, trending, kits, brands) → Delivery & pickup → Account & trust → Help.
 * Every live section is still here; near-duplicates were merged (see CHANGES.md).
 */
export default function Home() {
  return (
    <Box>
      <Head>
        <title>MySupreme — Wholesale Food &amp; Restaurant Supply</title>
        <meta name="description" content="Wholesale food, packaging and restaurant supplies with same-day and next-day delivery across the GTA, Hamilton and Niagara." />
      </Head>
      <Typography component="h1" sx={srOnly}>MySupreme wholesale food and restaurant supply</Typography>

      <HomeHero slides={heroSlides} />
      <RecentlyViewed />
      <BrowseCatalogue departments={departments} />

      <Section id="deals" band="subtle" eyebrow="Flyers & offers" title="This week’s deals" subtitle="Limited-time prices on kitchen staples — while stock lasts" action={{ label: 'All flyers & offers', href: '/flyers-offers' }}>
        <WeeklyDeals offers={(offersJson.offers as Offer[]).slice(0, 3)} products={products} />
        <Typography component="h3" variant="h3" sx={{ mt: { xs: 4, md: 5 }, mb: 2, color: colors.ink }}>More promotions</Typography>
        <FeaturedOffersCarousel slides={promotions} />
      </Section>

      <TrendingByDepartment departments={departments} productsByDepartment={productsByDepartment} initialTab="produce" />
      <FeaturedProducts recommended={recommendedProducts} newArrivals={newArrivals} />
      <StarterKits kits={kitsJson.kits as Kit[]} products={products} />
      <BrandStrip brands={brands} />

      <Section id="delivery" labelledBy="delivery-title">
        <DeliveryCheckBanner data={zonesJson as DeliveryZones} />
      </Section>

      <Section id="business-account" band="subtle" labelledBy="business-account-title">
        <BusinessAccountSteps />
      </Section>

      <Section id="faq" labelledBy="faq-title">
        <HomeFAQ />
      </Section>
    </Box>
  )
}
