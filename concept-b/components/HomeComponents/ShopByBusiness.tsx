import Link from 'next/link'
import { Box, Typography } from '@mui/material'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import BakeryDiningIcon from '@mui/icons-material/BakeryDining'
import CelebrationIcon from '@mui/icons-material/Celebration'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining'
import StorefrontIcon from '@mui/icons-material/Storefront'
import type { SvgIconComponent } from '@mui/icons-material'
import { SectionHeading } from './HomeSection'

/*
 * CONCEPT B — NEW SECTION #5 "Shop by your kitchen".
 * Existing data only: the business types and their department shortcuts are CMS copy; every link is a live
 * department route. Drop in after PromoTwoCards in the real pages/index.tsx.
 */

const RED_AA = '#D50000'
const focusRing = { '&:focus-visible': { outline: `3px solid ${RED_AA}`, outlineOffset: 2 } }

export type BusinessType = {
  id: string
  title: string
  blurb: string
  icon: SvgIconComponent
  /** First entry is where the tile itself links. */
  departments: { label: string; href: string }[]
}

export const defaultBusinessTypes: BusinessType[] = [
  { id: 'restaurant', title: 'Restaurant', blurb: 'Everything for the line and the pass', icon: RestaurantIcon, departments: [{ label: 'Meat & Poultry', href: '/meat-poultry' }, { label: 'Produce', href: '/produce' }, { label: 'Grocery', href: '/grocery' }] },
  { id: 'cafe-bakery', title: 'Café & Bakery', blurb: 'Everything for the counter and the oven', icon: BakeryDiningIcon, departments: [{ label: 'Beverage', href: '/beverage' }, { label: 'Dairy & Eggs', href: '/dairy-eggs' }, { label: 'Packaging', href: '/packaging' }] },
  { id: 'caterer', title: 'Caterer & Events', blurb: 'Everything for trays, buffets and banquets', icon: CelebrationIcon, departments: [{ label: 'Packaging', href: '/packaging' }, { label: 'Ware & Equipment', href: '/ware-equipment' }, { label: 'Frozen', href: '/frozen' }] },
  { id: 'food-truck', title: 'Food Truck', blurb: 'Everything for service in a small space', icon: LocalShippingIcon, departments: [{ label: 'Frozen', href: '/frozen' }, { label: 'Packaging', href: '/packaging' }, { label: 'Beverage', href: '/beverage' }] },
  { id: 'ghost-kitchen', title: 'Ghost Kitchen', blurb: 'Everything for delivery-only menus', icon: DeliveryDiningIcon, departments: [{ label: 'Packaging', href: '/packaging' }, { label: 'Grocery', href: '/grocery' }, { label: 'Meat & Poultry', href: '/meat-poultry' }] },
  { id: 'retail', title: 'Grocery & Retail', blurb: 'Everything for shelves and coolers', icon: StorefrontIcon, departments: [{ label: 'Grocery', href: '/grocery' }, { label: 'Beverage', href: '/beverage' }, { label: 'Janitorial', href: '/janitorial' }] },
]

function Tile({ t }: { t: BusinessType }) {
  const Icon = t.icon
  return (
    <Box
      component="article"
      sx={{
        position: 'relative', height: '100%', bgcolor: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', p: { xs: 2, md: 2.25 },
        display: 'flex', flexDirection: 'column', gap: 1.25, transition: 'border-color .2s, box-shadow .2s',
        '&:hover': { borderColor: '#FF413D', boxShadow: '0 6px 18px rgba(0,0,0,.06)' },
      }}
    >
      <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: '#FFF0EE', color: '#FF0000', display: 'grid', placeItems: 'center' }}>
        <Icon />
      </Box>
      <Box>
        {/* Stretched link: the whole tile opens the primary department; chips below stay separately clickable. */}
        <Box
          component={Link}
          href={t.departments[0].href}
          sx={{
            color: '#0C0C0C', textDecoration: 'none', fontSize: { xs: 15, md: 16 }, fontWeight: 600, '&:hover': { color: RED_AA },
            '&::after': { content: '""', position: 'absolute', inset: 0, borderRadius: '12px' },
            '&:focus-visible': { outline: 'none' }, '&:focus-visible::after': { outline: `3px solid ${RED_AA}`, outlineOffset: 2 },
          }}
        >
          {t.title}
        </Box>
        <Typography sx={{ fontSize: 13, color: '#4B5563', mt: 0.25, lineHeight: 1.45 }}>{t.blurb}</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 'auto' }}>
        {t.departments.map((d) => (
          <Box
            key={d.href}
            component={Link}
            href={d.href}
            sx={{
              position: 'relative', zIndex: 1, fontSize: 11.5, fontWeight: 500, color: '#374151', textDecoration: 'none',
              bgcolor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '40px', px: 1.25, minHeight: 28, display: 'inline-flex', alignItems: 'center',
              '&:hover': { borderColor: '#FF413D', color: RED_AA }, ...focusRing,
            }}
          >
            {d.label}
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default function ShopByBusiness({ types = defaultBusinessTypes }: { types?: BusinessType[] }) {
  return (
    <Box>
      <SectionHeading id="shop-by-business" eyebrow="Shop by business" title="Shop by your kitchen" subtitle="Jump straight to the departments your type of kitchen orders from most" />
      <Box
        sx={{
          display: 'grid', gap: { xs: 1.5, md: 2 },
          gridAutoFlow: { xs: 'column', md: 'row' },
          gridAutoColumns: { xs: '72%', sm: '44%' },
          gridTemplateColumns: { md: 'repeat(3, minmax(0,1fr))', xl: 'repeat(6, minmax(0,1fr))' },
          overflowX: { xs: 'auto', md: 'visible' }, scrollSnapType: { xs: 'x mandatory', md: 'none' }, pb: { xs: 1, md: 0 },
          '& > *': { scrollSnapAlign: 'start' },
        }}
      >
        {types.map((t) => <Tile key={t.id} t={t} />)}
      </Box>
    </Box>
  )
}
