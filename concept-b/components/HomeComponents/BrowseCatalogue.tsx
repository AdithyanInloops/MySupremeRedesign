import { useState } from 'react'
import Link from 'next/link'
import { Box, Tab, Tabs, Typography } from '@mui/material'
import type { Category } from '../../lib/data'
import { colors, focusRing, motion, radius, shadow } from '../../lib/theme'
import Section from '../ui/Section'
import { type IconComponent, ArrowRightIcon, BreadIcon, ScooterIcon, SparklesIcon, StoreIcon, TruckIcon, UtensilsIcon } from '../ui/icons'

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

/**
 * Department photo. The Magento category art is square with a logo wedge in the bottom-left corner, so the image is
 * drawn 40% taller than its tile and anchored to the top — the wedge always falls outside the crop.
 */
function DeptPhoto({ src }: { src: string | null }) {
  return (
    <Box
      component="img"
      src={src || '/assets/placeholder-image.png'}
      alt=""
      loading="lazy"
      className="dept-photo"
      sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '140%', objectFit: 'cover', objectPosition: 'center top', transition: `transform ${motion.slow}`, transformOrigin: 'center top' }}
    />
  )
}

const tileBase = {
  position: 'relative', display: 'block', height: '100%', borderRadius: radius.lg, overflow: 'hidden', bgcolor: colors.sunken, color: '#fff', textDecoration: 'none',
  transition: `box-shadow ${motion.base}`, '&:hover': { boxShadow: shadow.md }, '&:hover .dept-photo': { transform: 'scale(1.05)' }, '&:hover .dept-cta': { gap: 1 },
} as const
const scrim = { position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(17,24,39,0) 35%, rgba(17,24,39,.82) 100%)' } as const

function DepartmentTile({ d }: { d: Category }) {
  return (
    <Box component={Link} href={`/${d.url_key}`} aria-label={`${d.name}, ${d.product_count.toLocaleString()} products`} sx={{ ...tileBase, ...focusRing }}>
      <DeptPhoto src={d.image} />
      <Box sx={scrim} />
      <Box sx={{ position: 'absolute', left: { xs: 12, md: 16 }, right: { xs: 12, md: 16 }, bottom: { xs: 10, md: 14 } }}>
        <Typography component="h3" sx={{ fontSize: { xs: 15, md: 17 }, fontWeight: 600, lineHeight: 1.25 }}>{d.name}</Typography>
        <Typography className="dept-cta" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: { xs: 12.5, md: 13.5 }, color: 'rgba(255,255,255,.85)', transition: `gap ${motion.fast}` }}>
          {d.product_count.toLocaleString()} products <ArrowRightIcon sx={{ fontSize: 16, display: { xs: 'none', md: 'block' } }} />
        </Typography>
      </Box>
    </Box>
  )
}

/** The large 2×2 tile: the department plus its biggest sub-categories as shortcuts. */
function FeaturedDepartment({ d }: { d: Category }) {
  const subs = [...d.children].sort((a, b) => (b.product_count ?? 0) - (a.product_count ?? 0)).slice(0, 4)
  return (
    <Box sx={{ ...tileBase, '&:focus-within': { outline: `2px solid ${colors.navy}`, outlineOffset: 2 } }}>
      <DeptPhoto src={d.image} />
      <Box sx={{ ...scrim, background: 'linear-gradient(180deg, rgba(17,24,39,0) 20%, rgba(17,24,39,.88) 100%)' }} />
      <Box sx={{ position: 'absolute', left: { xs: 16, md: 24 }, right: { xs: 16, md: 24 }, bottom: { xs: 14, md: 22 } }}>
        <Typography variant="overline" component="p" sx={{ color: '#FCA5A5' }}>Featured department</Typography>
        {/* Stretched link: the whole tile opens the department; the sub-category chips stay separately clickable. */}
        <Box
          component={Link}
          href={`/${d.url_key}`}
          sx={{ color: '#fff', textDecoration: 'none', '&::after': { content: '""', position: 'absolute', inset: { xs: -400, md: -800 } }, '&:focus-visible': { outline: 'none' } }}
        >
          <Typography component="h3" sx={{ fontSize: { xs: 22, md: 30 }, fontWeight: 700, lineHeight: 1.15, mt: 0.25 }}>{d.name}</Typography>
        </Box>
        <Typography sx={{ fontSize: { xs: 13.5, md: 15 }, color: 'rgba(255,255,255,.85)', mt: 0.5 }}>{d.product_count.toLocaleString()} products · {d.children.length} categories</Typography>
        <Box component="ul" aria-label={`Popular in ${d.name}`} sx={{ listStyle: 'none', p: 0, m: 0, mt: 1.5, display: { xs: 'none', sm: 'flex' }, flexWrap: 'wrap', gap: 0.75 }}>
          {subs.map((s) => (
            <li key={s.url_key}>
              <Box
                component={Link}
                href={`/${d.url_key}?sub=${s.url_key}`}
                sx={{
                  position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', minHeight: 32, px: 1.5, borderRadius: radius.pill, fontSize: 13, fontWeight: 500,
                  color: '#fff', textDecoration: 'none', bgcolor: 'rgba(255,255,255,.16)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,.3)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,.28)' }, '&:focus-visible': { outline: '2px solid #fff', outlineOffset: 2 },
                }}
              >
                {s.name}
              </Box>
            </li>
          ))}
        </Box>
        <Box className="dept-cta" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, mt: 1.5, fontWeight: 600, fontSize: 14.5, transition: `gap ${motion.fast}` }}>
          Shop all {d.name} <ArrowRightIcon sx={{ fontSize: 18 }} />
        </Box>
      </Box>
    </Box>
  )
}

/**
 * Bento layout: 4 columns on desktop (one 2×2 feature tile + eight photo tiles = three full rows), 3 on tablets,
 * 2 on phones (feature tile spans the full width). Every row is complete at every breakpoint — no orphans.
 */
function DepartmentBento({ departments }: { departments: Category[] }) {
  const [featured, ...rest] = departments
  return (
    <Box
      component="ul"
      aria-label="Departments"
      sx={{
        listStyle: 'none', p: 0, m: 0, display: 'grid', gap: { xs: 1.25, md: 2 },
        gridTemplateColumns: { xs: 'repeat(2, minmax(0,1fr))', sm: 'repeat(3, minmax(0,1fr))', md: 'repeat(4, minmax(0,1fr))' },
        gridAutoRows: { xs: 150, sm: 160, md: 180, lg: 200 },
      }}
    >
      {featured && (
        <Box component="li" sx={{ gridColumn: 'span 2', gridRow: { xs: 'span 2', sm: 'span 2' }, minHeight: 0 }}>
          <FeaturedDepartment d={featured} />
        </Box>
      )}
      {rest.map((d) => <Box component="li" key={d.uid} sx={{ minHeight: 0 }}><DepartmentTile d={d} /></Box>)}
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
          <DepartmentBento departments={departments} />
        ) : (
          <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gap: { xs: 1.25, md: 2 }, gridTemplateColumns: { xs: 'minmax(0,1fr)', sm: 'repeat(2, minmax(0,1fr))', lg: 'repeat(3, minmax(0,1fr))' } }}>
            {types.map((t) => <li key={t.id}><KitchenTile t={t} /></li>)}
          </Box>
        )}
      </Box>
    </Section>
  )
}
