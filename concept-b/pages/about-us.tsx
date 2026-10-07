import Head from 'next/head'
import Link from 'next/link'
import { Box, Button, Typography } from '@mui/material'
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded'
import LocalCafeRoundedIcon from '@mui/icons-material/LocalCafeRounded'
import BakeryDiningRoundedIcon from '@mui/icons-material/BakeryDiningRounded'
import CelebrationRoundedIcon from '@mui/icons-material/CelebrationRounded'
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded'
import DeliveryDiningRoundedIcon from '@mui/icons-material/DeliveryDiningRounded'
import HotelRoundedIcon from '@mui/icons-material/HotelRounded'
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined'
import SellOutlinedIcon from '@mui/icons-material/SellOutlined'
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined'
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined'
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import EastRoundedIcon from '@mui/icons-material/EastRounded'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import type { SvgIconComponent } from '@mui/icons-material'
import { colors, focusRing, motion, radius, shadow } from '../lib/theme'
import Section, { PageContainer } from '../components/ui/Section'
import { Breadcrumbs } from '../components/ui/PageHeader'
import { PHONE, PHONE_HREF } from '../components/Layout/Header'

/*
 * About — the company story, reorganised around what a buyer wants to know: who you are, how I can buy, what you
 * stock, who you serve, why you. Copy is the live page's, tightened; the repeated CTA bands are merged into one.
 */

const stats = [['4,300+', 'products online'], ['9', 'departments'], ['Same / next-day', 'delivery'], ['GTA · Hamilton · Niagara', 'service area']]

const channels: { title: string; text: string; image: string; points: string[]; cta: [string, string] }[] = [
  { title: 'Cash & Carry warehouse', text: 'Shop the warehouse directly at wholesale prices — ideal for urgent restocking and bulk buying. Walk in, pick, pay and go.', image: '/assets/dry-groceries.png', points: ['3750A Laird Road, Mississauga', 'Mon–Sat, 9am–6pm'], cta: ['Plan a visit', '/service/contact-us#visit'] },
  { title: 'Online & in the app', text: 'Order anytime from mysupreme.ca or the MySupreme app, track deliveries and catch promotions from your phone.', image: '/assets/order-anytime.png', points: ['Real-time pricing on every stock item', 'Search by name or SKU', 'Order history and 1-tap reordering'], cta: ['Get the app', '/download-app'] },
  { title: 'Dedicated sales reps', text: 'Field reps work directly with restaurant operators on supply plans that fit the menu and the budget.', image: '/assets/personalized-support.png', points: ['Product recommendations', 'Cost optimisation and menu-based planning', 'New product introductions'], cta: ['Talk to sales', '/service/contact-us'] },
  { title: 'Delivery when you need it', text: 'Same-day or next-day delivery across the GTA, Hamilton and Niagara, on scheduled cold-chain routes.', image: '/assets/truck.png', points: ['Scheduled delivery routes', 'Cold-chain handling', 'Reliable product availability'], cta: ['Check your postal code', '/#delivery'] },
]

const categories: [string, string, string][] = [
  ['Fresh produce', '/assets/produce.png', '/produce'], ['Meat & poultry', '/assets/chicken-meat.png', '/meat-poultry'], ['Dairy', '/assets/butter-milk.png', '/dairy-eggs'], ['Frozen foods', '/assets/frozen-foods.png', '/frozen'],
  ['Packaging & disposables', '/assets/packaging.png', '/packaging'], ['Dry groceries', '/assets/dry-groceries.png', '/grocery'], ['Cleaning supplies', '/assets/cleaning.png', '/janitorial'], ['Seafood', '/assets/sea-food.png', '/frozen'],
]

const served: [string, SvgIconComponent][] = [['Restaurants', RestaurantRoundedIcon], ['Cafés', LocalCafeRoundedIcon], ['Bakeries', BakeryDiningRoundedIcon], ['Catering companies', CelebrationRoundedIcon], ['Food trucks', LocalShippingRoundedIcon], ['Ghost kitchens', DeliveryDiningRoundedIcon], ['Hospitality & event venues', HotelRoundedIcon]]

const commitments: [string, string, SvgIconComponent][] = [
  ['Reliable supply', 'Stock you can plan a menu around.', VerifiedOutlinedIcon],
  ['Competitive pricing', 'Wholesale prices and volume deals.', SellOutlinedIcon],
  ['Professional service', 'A team that knows foodservice.', SupportAgentOutlinedIcon],
  ['Fast delivery', 'Same-day and next-day routes.', BoltOutlinedIcon],
  ['Consistent quality', 'The same product, every order.', WorkspacePremiumOutlinedIcon],
]

export default function AboutUs() {
  return (
    <>
      <Head>
        <title>About us | MySupreme</title>
        <meta name="description" content="MySupreme Food Service is a wholesale distribution partner for restaurants across the GTA, Hamilton and Niagara — cash & carry, online, sales reps and delivery." />
      </Head>

      <PageContainer sx={{ pt: { xs: 1.5, md: 3 }, pb: { xs: 4, md: 6 } }}>
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About us' }]} />
        <Box sx={{ display: 'grid', gap: { xs: 3, md: 6 }, gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'minmax(0,1fr) minmax(0,1fr)' }, alignItems: 'center', mt: { xs: 2, md: 3 } }}>
          <Box>
            <Typography variant="overline" component="p" sx={{ color: colors.redText }}>About MySupreme</Typography>
            <Typography variant="h1" sx={{ fontSize: { xs: 30, md: 44 }, lineHeight: 1.1, mt: 1 }}>Built for restaurants. Designed for reliable supply.</Typography>
            <Typography sx={{ mt: 2, fontSize: { xs: 15.5, md: 17 }, color: colors.ink700, maxWidth: 560 }}>
              MySupreme Food Service is a wholesale distribution partner helping restaurants across the GTA, Hamilton and Niagara get quality products, competitive pricing and dependable service — from one supplier.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.25, flexWrap: 'wrap', mt: 3 }}>
              <Button component={Link} href="/account/signin?mode=register" variant="contained" size="large">Open a business account</Button>
              <Button component={Link} href="/service/contact-us" variant="outlined" size="large">Request wholesale pricing</Button>
            </Box>
          </Box>
          <Box sx={{ borderRadius: radius.xl, overflow: 'hidden', bgcolor: colors.sunken, aspectRatio: { xs: '16 / 10', md: '5 / 4' } }}>
            <Box component="img" src="/assets/trusted-partner.png" alt="A MySupreme sales representative shaking hands with a restaurant owner" sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </Box>
        </Box>
        <Box component="dl" sx={{ m: 0, mt: { xs: 4, md: 6 }, display: 'grid', gridTemplateColumns: { xs: 'repeat(2, minmax(0,1fr))', md: 'repeat(4, minmax(0,1fr))' }, gap: { xs: 2, md: 3 }, pt: 3, borderTop: `1px solid ${colors.line}` }}>
          {stats.map(([v, l]) => (
            <Box key={l}>
              <Box component="dt" sx={{ fontSize: { xs: 18, md: 24 }, fontWeight: 700, color: colors.navy, lineHeight: 1.2 }}>{v}</Box>
              <Box component="dd" sx={{ m: 0, fontSize: 14, color: colors.ink600 }}>{l}</Box>
            </Box>
          ))}
        </Box>
      </PageContainer>

      <Section id="mission" band="subtle" labelledBy="mission-title">
        <Box sx={{ display: 'grid', gap: { xs: 3, md: 6 }, gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'minmax(0,1.2fr) minmax(0,1fr)' }, alignItems: 'center' }}>
          <Box>
            <Typography variant="overline" component="p" sx={{ color: colors.redText }}>Who we are</Typography>
            <Typography id="mission-title" component="h2" variant="h2" sx={{ mt: 0.5 }}>Your trusted partner in restaurant supply</Typography>
            <Typography sx={{ mt: 1.5, color: colors.ink700, fontSize: 16 }}>
              MySupreme Food Service is a full-service wholesale food distributor built for the foodservice industry. We support restaurants, cafés, caterers, bakeries, food trucks and hospitality businesses with a complete supply solution designed for efficiency, reliability and growth.
            </Typography>
          </Box>
          <Box sx={{ bgcolor: colors.navy, color: '#fff', borderRadius: radius.xl, p: { xs: 3, md: 4 } }}>
            <Typography variant="overline" component="p" sx={{ color: '#FCA5A5' }}>Our mission</Typography>
            <Typography sx={{ mt: 1, fontSize: { xs: 17, md: 19 }, lineHeight: 1.55, fontWeight: 500 }}>
              To give restaurants the best products, the best prices and the most reliable service in the market — so they spend less time on supply and more on their guests.
            </Typography>
          </Box>
        </Box>
      </Section>

      <Section id="channels" eyebrow="One supply system" title="Four ways to buy from us" subtitle="Order, restock and manage supplies the way that works for your kitchen.">
        <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gap: { xs: 2, md: 2.5 }, gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'repeat(2, minmax(0,1fr))' } }}>
          {channels.map((c) => (
            <Box component="li" key={c.title} sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', sm: '180px minmax(0,1fr)' }, border: `1px solid ${colors.line}`, borderRadius: radius.xl, overflow: 'hidden', bgcolor: '#fff' }}>
              <Box sx={{ bgcolor: colors.sunken, minHeight: { xs: 160, sm: '100%' }, position: 'relative' }}>
                <Box component="img" src={c.image} alt="" loading="lazy" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>
              <Box sx={{ p: { xs: 2, md: 2.5 }, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography component="h3" variant="h3">{c.title}</Typography>
                <Typography sx={{ fontSize: 14.5, color: colors.ink700 }}>{c.text}</Typography>
                <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {c.points.map((p) => <Box component="li" key={p} sx={{ display: 'flex', gap: 0.75, fontSize: 14, color: colors.ink700 }}><CheckRoundedIcon sx={{ fontSize: 18, color: colors.success, mt: '1px' }} />{p}</Box>)}
                </Box>
                <Button component={Link} href={c.cta[1]} endIcon={<EastRoundedIcon />} color="primary" sx={{ alignSelf: 'flex-start', ml: -1.5, mt: 'auto' }}>{c.cta[0]}</Button>
              </Box>
            </Box>
          ))}
        </Box>
      </Section>

      <Section id="catalogue" band="subtle" eyebrow="Everything in one place" title="One supplier for the whole kitchen" subtitle="Thousands of products across every major restaurant supply category." action={{ label: 'All categories', href: '/all-categories' }}>
        <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gap: { xs: 1.25, md: 2 }, gridTemplateColumns: { xs: 'repeat(2, minmax(0,1fr))', md: 'repeat(4, minmax(0,1fr))' } }}>
          {categories.map(([name, img, href]) => (
            <li key={name}>
              <Box component={Link} href={href} sx={{ display: 'block', position: 'relative', borderRadius: radius.lg, overflow: 'hidden', aspectRatio: '4 / 3', color: '#fff', textDecoration: 'none', '&:hover img': { transform: 'scale(1.05)' }, ...focusRing }}>
                <Box component="img" src={img} alt="" loading="lazy" sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: `transform ${motion.slow}` }} />
                <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(17,24,39,0) 45%, rgba(17,24,39,.8) 100%)' }} />
                <Typography sx={{ position: 'absolute', left: 14, right: 14, bottom: 12, fontWeight: 600, fontSize: { xs: 14.5, md: 16 } }}>{name}</Typography>
              </Box>
            </li>
          ))}
        </Box>
      </Section>

      <Section id="served" eyebrow="Who we serve" title="Supporting the whole foodservice industry" subtitle="From small independent operators to multi-location groups, with supply that scales with you.">
        <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'flex', flexWrap: 'wrap', gap: 1.25 }}>
          {served.map(([name, Icon]) => (
            <Box component="li" key={name} sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, minHeight: 48, borderRadius: radius.pill, border: `1px solid ${colors.line}`, fontWeight: 500, fontSize: 14.5 }}>
              <Icon sx={{ fontSize: 20, color: colors.redText }} /> {name}
            </Box>
          ))}
        </Box>
        <Typography component="h3" variant="h3" sx={{ mt: { xs: 5, md: 6 }, mb: 2 }}>Committed to your success</Typography>
        <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gap: { xs: 1.5, md: 2 }, gridTemplateColumns: { xs: 'minmax(0,1fr)', sm: 'repeat(2, minmax(0,1fr))', lg: 'repeat(5, minmax(0,1fr))' } }}>
          {commitments.map(([t, d, Icon]) => (
            <Box component="li" key={t} sx={{ p: 2, borderRadius: radius.lg, bgcolor: colors.subtle, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              <Icon sx={{ color: colors.navy }} />
              <Typography sx={{ fontWeight: 600 }}>{t}</Typography>
              <Typography sx={{ fontSize: 14, color: colors.ink600 }}>{d}</Typography>
            </Box>
          ))}
        </Box>
      </Section>

      <PageContainer sx={{ pb: { xs: 5, md: 8 } }}>
        <Box sx={{ borderRadius: radius.xl, bgcolor: colors.red, color: '#fff', p: { xs: 3, md: 5 }, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'center' }, justifyContent: 'space-between', gap: 3, boxShadow: shadow.sm }}>
          <Box>
            <Typography component="h2" variant="h2" sx={{ color: '#fff' }}>Partner with MySupreme today</Typography>
            <Typography sx={{ mt: 1, color: 'rgba(255,255,255,.9)', fontSize: 16 }}>A smarter, more reliable way to manage your restaurant’s supply.</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.25, flexWrap: 'wrap' }}>
            <Button component={Link} href="/account/signin?mode=register" size="large" sx={{ bgcolor: '#fff', color: colors.redText, '&:hover': { bgcolor: colors.redTint }, '&.Mui-focusVisible': { outline: '2px solid #fff', outlineOffset: 2 } }}>Open a business account</Button>
            <Button component="a" href={PHONE_HREF} size="large" startIcon={<PhoneOutlinedIcon />} sx={{ color: '#fff', border: '1px solid rgba(255,255,255,.7)', '&:hover': { bgcolor: 'rgba(255,255,255,.12)' }, '&.Mui-focusVisible': { outline: '2px solid #fff', outlineOffset: 2 } }}>{PHONE}</Button>
          </Box>
        </Box>
      </PageContainer>
    </>
  )
}
