import { useState } from 'react'
import Link from 'next/link'
import { Box, Tab, Tabs, Typography } from '@mui/material'
import type { Category } from '../../lib/data'
import { colors, focusRing, motion, radius, shadow } from '../../lib/theme'
import Section from '../ui/Section'
import { type IconComponent, BreadIcon, ScooterIcon, SparklesIcon, StoreIcon, TruckIcon, UtensilsIcon } from '../ui/icons'

/**
 * One "Browse" block with two ways in: by department (the 9 Magento departments with photos and counts) or by
 * kitchen type (business-type shortcuts into departments — CMS copy, existing routes). Tabs keep both one click
 * away without stacking two more sections on the page.
 */

export type BusinessType = { id: string; title: string; blurb: string; icon: IconComponent; departments: { label: string; href: string }[] }

export const defaultBusinessTypes: BusinessType[] = [
  { id: 'restaurant', title: 'Restaurant', blurb: 'For the line and the pass', icon: UtensilsIcon, departments: [{ label: 'Meat & Poultry', href: '/meat-poultry' }, { label: 'Produce', href: '/produce' }, { label: 'Grocery', href: '/grocery' }] },
  { id: 'cafe-bakery', title: 'Café & Bakery', blurb: 'For the counter and the oven', icon: BreadIcon, departments: [{ label: 'Beverage', href: '/beverage' }, { label: 'Dairy & Eggs', href: '/dairy-eggs' }, { label: 'Packaging', href: '/packaging' }] },
  { id: 'caterer', title: 'Caterer & Events', blurb: 'For trays, buffets and banquets', icon: SparklesIcon, departments: [{ label: 'Packaging', href: '/packaging' }, { label: 'Ware & Equipment', href: '/ware-equipment' }, { label: 'Frozen', href: '/frozen' }] },
  { id: 'food-truck', title: 'Food Truck', blurb: 'For service in a small space', icon: TruckIcon, departments: [{ label: 'Frozen', href: '/frozen' }, { label: 'Packaging', href: '/packaging' }, { label: 'Beverage', href: '/beverage' }] },
  { id: 'ghost-kitchen', title: 'Ghost Kitchen', blurb: 'For delivery-only menus', icon: ScooterIcon, departments: [{ label: 'Packaging', href: '/packaging' }, { label: 'Grocery', href: '/grocery' }, { label: 'Meat & Poultry', href: '/meat-poultry' }] },
  { id: 'retail', title: 'Grocery & Retail', blurb: 'For shelves and coolers', icon: StoreIcon, departments: [{ label: 'Grocery', href: '/grocery' }, { label: 'Beverage', href: '/beverage' }, { label: 'Janitorial', href: '/janitorial' }] },
]

function DepartmentTile({ d }: { d: Category }) {
  return (
    <Box
      component={Link}
      href={`/${d.url_key}`}
      sx={{
        display: 'flex', flexDirection: 'column', textDecoration: 'none', color: colors.ink, borderRadius: radius.lg, overflow: 'hidden', bgcolor: '#fff',
        border: `1px solid ${colors.line}`, transition: `box-shadow ${motion.base}, border-color ${motion.base}, transform ${motion.base}`,
        '&:hover': { boxShadow: shadow.md, borderColor: colors.line2, transform: 'translateY(-2px)' }, '&:hover img': { transform: 'scale(1.05)' }, ...focusRing,
      }}
    >
      <Box sx={{ aspectRatio: '16 / 11', overflow: 'hidden', bgcolor: colors.sunken }}>
        <Box component="img" src={d.image || '/assets/placeholder-image.png'} alt="" loading="lazy" sx={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block', transition: `transform ${motion.slow}`, transformOrigin: 'center top' }} />
      </Box>
      <Box sx={{ px: 1.5, py: 1.25 }}>
        <Typography sx={{ fontSize: 14.5, fontWeight: 600, lineHeight: 1.3 }}>{d.name}</Typography>
        <Typography sx={{ fontSize: 12.5, color: colors.ink500 }}>{d.product_count.toLocaleString()} products</Typography>
      </Box>
    </Box>
  )
}

function KitchenTile({ t }: { t: BusinessType }) {
  const Icon = t.icon
  return (
    <Box sx={{ position: 'relative', height: '100%', bgcolor: '#fff', border: `1px solid ${colors.line}`, borderRadius: radius.lg, p: 2, display: 'flex', flexDirection: 'column', gap: 1.25, transition: `border-color ${motion.base}, box-shadow ${motion.base}`, '&:hover': { borderColor: colors.line2, boxShadow: shadow.md } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
        <Box sx={{ width: 44, height: 44, borderRadius: '50%', bgcolor: colors.redTint, color: colors.redText, display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon /></Box>
        <Box sx={{ minWidth: 0 }}>
          {/* Stretched link: the tile opens the main department; chips stay separately clickable. */}
          <Box component={Link} href={t.departments[0].href} sx={{ color: colors.ink, textDecoration: 'none', fontWeight: 600, fontSize: 15.5, '&::after': { content: '""', position: 'absolute', inset: 0, borderRadius: radius.lg }, '&:hover': { color: colors.redText }, '&:focus-visible': { outline: 'none' }, '&:focus-visible::after': { outline: `2px solid ${colors.navy}`, outlineOffset: 2 } }}>
            {t.title}
          </Box>
          <Typography sx={{ fontSize: 13, color: colors.ink600 }}>{t.blurb}</Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 'auto' }}>
        {t.departments.map((d) => (
          <Box key={d.href} component={Link} href={d.href} sx={{ position: 'relative', zIndex: 1, fontSize: 12.5, fontWeight: 500, color: colors.ink700, textDecoration: 'none', bgcolor: colors.subtle, border: `1px solid ${colors.line}`, borderRadius: radius.pill, px: 1.25, minHeight: 30, display: 'inline-flex', alignItems: 'center', '&:hover': { borderColor: colors.ink400, color: colors.ink }, ...focusRing }}>
            {d.label}
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default function BrowseCatalogue({ departments, types = defaultBusinessTypes }: { departments: Category[]; types?: BusinessType[] }) {
  const [tab, setTab] = useState<'dept' | 'kitchen'>('dept')
  const total = departments.reduce((a, d) => a + d.product_count, 0)
  return (
    <Section
      id="browse"
      eyebrow="Browse"
      title="Shop the catalogue"
      subtitle={`${departments.length} departments and ${total.toLocaleString()}+ products for commercial kitchens`}
      action={{ label: 'All categories', href: '/all-categories' }}
    >
      <Tabs value={tab} onChange={(_, v) => setTab(v)} aria-label="Browse by" sx={{ mb: 2.5, borderBottom: `1px solid ${colors.line}` }}>
        <Tab value="dept" label="By department" id="browse-tab-dept" aria-controls="browse-panel" />
        <Tab value="kitchen" label="By kitchen type" id="browse-tab-kitchen" aria-controls="browse-panel" />
      </Tabs>
      <Box id="browse-panel" role="tabpanel" aria-labelledby={`browse-tab-${tab}`}>
        {tab === 'dept' ? (
          <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gap: { xs: 1.25, md: 2 }, gridTemplateColumns: { xs: 'repeat(3, minmax(0,1fr))', sm: 'repeat(3, minmax(0,1fr))', md: 'repeat(5, minmax(0,1fr))', xl: 'repeat(9, minmax(0,1fr))' } }}>
            {departments.map((d) => <li key={d.uid}><DepartmentTile d={d} /></li>)}
          </Box>
        ) : (
          <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gap: { xs: 1.25, md: 2 }, gridTemplateColumns: { xs: 'minmax(0,1fr)', sm: 'repeat(2, minmax(0,1fr))', lg: 'repeat(3, minmax(0,1fr))' } }}>
            {types.map((t) => <li key={t.id}><KitchenTile t={t} /></li>)}
          </Box>
        )}
      </Box>
    </Section>
  )
}
