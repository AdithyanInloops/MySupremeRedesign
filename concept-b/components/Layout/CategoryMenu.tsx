import Link from 'next/link'
import { Box, Typography } from '@mui/material'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined'
import AcUnitOutlinedIcon from '@mui/icons-material/AcUnitOutlined'
import SpaOutlinedIcon from '@mui/icons-material/SpaOutlined'
import LocalDrinkOutlinedIcon from '@mui/icons-material/LocalDrinkOutlined'
import EggOutlinedIcon from '@mui/icons-material/EggOutlined'
import KebabDiningOutlinedIcon from '@mui/icons-material/KebabDiningOutlined'
import CleaningServicesOutlinedIcon from '@mui/icons-material/CleaningServicesOutlined'
import BlenderOutlinedIcon from '@mui/icons-material/BlenderOutlined'
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined'
import EastIcon from '@mui/icons-material/East'
import type { SvgIconComponent } from '@mui/icons-material'
import subImagesJson from '../../data/subcategory-images.json'
import { departments, type Category } from '../../lib/data'

/**
 * Concept B — redesigned category dropdown (reference: Alibaba "All categories").
 * The red bar is the department selector; the panel shows sub-categories as round picture tiles. Same data as today (Magento category tree); the tile
 * photo is the category image when Magento has one, otherwise a product photo from that sub-category.
 */

const subImages = subImagesJson as Record<string, string>

export const deptIcons: Record<string, SvgIconComponent> = {
  packaging: Inventory2OutlinedIcon,
  grocery: ShoppingBasketOutlinedIcon,
  frozen: AcUnitOutlinedIcon,
  produce: SpaOutlinedIcon,
  beverage: LocalDrinkOutlinedIcon,
  'dairy-eggs': EggOutlinedIcon,
  'meat-poultry': KebabDiningOutlinedIcon,
  janitorial: CleaningServicesOutlinedIcon,
  'ware-equipment': BlenderOutlinedIcon,
}

export const POPULAR = 'popular'

type Tile = { name: string; href: string; image?: string | null; count?: number; dept: string }

/** Largest sub-categories across all departments — "Popular categories" (existing data: product_count). */
const popularTiles: Tile[] = departments
  .flatMap((d) => d.children.map((s) => ({ name: s.name, href: `/${d.url_key}?sub=${s.url_key}`, image: s.image || subImages[s.url_key], count: s.product_count, dept: d.url_key })))
  .filter((t) => t.image)
  .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
  .slice(0, 14)

const tilesFor = (d: Category): Tile[] =>
  d.children.map((s) => ({ name: s.name, href: `/${d.url_key}?sub=${s.url_key}`, image: s.image || subImages[s.url_key], count: s.product_count, dept: d.url_key }))

/** Round picture tile; falls back to the department icon on a soft tint when there is no photo. */
export function CategoryCircle({ tile, size = 104, cover = false, onNavigate }: { tile: Tile; size?: number; cover?: boolean; onNavigate?: () => void }) {
  const Icon = deptIcons[tile.dept] ?? CategoryOutlinedIcon
  return (
    <Box
      component={Link}
      href={tile.href}
      onClick={onNavigate}
      sx={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.25, textDecoration: 'none', color: '#0C0C0C', textAlign: 'center',
        borderRadius: '12px', p: 1, outline: 'none',
        '&:hover .circle, &:focus-visible .circle': { borderColor: '#FF0000', transform: 'translateY(-2px)', boxShadow: '0 8px 18px rgba(0,0,0,.08)' },
        '&:hover .name, &:focus-visible .name': { color: '#D50000' },
        '&:focus-visible': { boxShadow: '0 0 0 3px rgba(255,0,0,.35)' },
      }}
    >
      <Box
        className="circle"
        sx={{
          width: size, height: size, borderRadius: '50%', bgcolor: '#F3F4F6', border: '2px solid transparent', overflow: 'hidden',
          display: 'grid', placeItems: 'center', transition: 'border-color .15s, transform .15s, box-shadow .15s', flexShrink: 0,
          '@media (prefers-reduced-motion: reduce)': { transition: 'none', transform: 'none !important' },
        }}
      >
        {tile.image ? (
          <Box component="img" src={tile.image} alt="" sx={cover ? { width: '100%', height: '100%', objectFit: 'cover' } : { width: '78%', height: '78%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
        ) : (
          <Icon sx={{ fontSize: size * 0.38, color: '#9CA3AF' }} />
        )}
      </Box>
      <Box>
        <Typography className="name" sx={{ fontSize: 14, lineHeight: 1.3, transition: 'color .15s', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {tile.name}
        </Typography>
        {!!tile.count && <Typography sx={{ fontSize: 11.5, color: '#6B7280', mt: 0.25 }}>{tile.count.toLocaleString()} products</Typography>}
      </Box>
    </Box>
  )
}

function PanelHeader({ title, subtitle, href, cta, onClose }: { title: string; subtitle: string; href: string; cta: string; onClose: () => void }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 2, mb: 2 }}>
      <Box>
        <Typography component="h2" sx={{ fontSize: 22, fontWeight: 600, color: '#0C0C0C' }}>{title}</Typography>
        <Typography sx={{ fontSize: 13, color: '#6B7280', mt: 0.25 }}>{subtitle}</Typography>
      </Box>
      <Box
        component={Link}
        href={href}
        onClick={onClose}
        sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, color: '#D50000', fontWeight: 600, fontSize: 14, textDecoration: 'none', whiteSpace: 'nowrap', '&:hover': { textDecoration: 'underline' }, '&:focus-visible': { outline: '2px solid #FF0000', outlineOffset: 2 } }}
      >
        {cta} <EastIcon sx={{ fontSize: 18 }} />
      </Box>
    </Box>
  )
}

const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', columnGap: 1, rowGap: 2 } as const

/**
 * Desktop dropdown panel (≥1100px), rendered under the red category bar. The red bar itself is the department
 * selector (no duplicate side list): hovering a department shows its sub-categories; "All Categories" shows an
 * overview of every department plus the most popular sub-categories.
 */
export default function CategoryMenu({ active, onClose }: { active: string; onActive?: (key: string) => void; onClose: () => void }) {
  const dept = departments.find((d) => d.url_key === active)
  return (
    <Box
      role="region"
      aria-label={dept ? `${dept.name} categories` : 'All categories'}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
      sx={{
        position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1200, bgcolor: '#fff', borderTop: '1px solid #E5E7EB',
        boxShadow: '0 24px 40px -12px rgba(0,0,0,.18)', borderRadius: '0 0 16px 16px',
      }}
    >
      <Box sx={{ maxWidth: 1500, mx: 'auto', maxHeight: 'min(600px, 72vh)', overflowY: 'auto', px: { lg: 4, xl: 6 }, py: 3 }}>
        {dept ? (
          <>
            <PanelHeader
              title={dept.name}
              subtitle={`${dept.product_count.toLocaleString()} products · ${dept.children.length} categories`}
              href={`/${dept.url_key}`}
              cta={`Shop all ${dept.name}`}
              onClose={onClose}
            />
            <Box sx={grid}>{tilesFor(dept).map((t) => <CategoryCircle key={t.href} tile={t} onNavigate={onClose} />)}</Box>
          </>
        ) : (
          <>
            <PanelHeader title="Shop by department" subtitle={`${departments.length} departments · 4,300+ products`} href="/all-categories" cta="View all categories" onClose={onClose} />
            <Box sx={grid}>
              {departments.map((d) => (
                <CategoryCircle
                  key={d.uid}
                  cover
                  tile={{ name: d.name, href: `/${d.url_key}`, image: d.image, count: d.product_count, dept: d.url_key }}
                  onNavigate={onClose}
                />
              ))}
            </Box>
            <Box sx={{ borderTop: '1px solid #E5E7EB', mt: 3, pt: 3 }}>
              <PanelHeader title="Popular categories" subtitle="The biggest ranges across every department" href="/all-categories" cta="See more" onClose={onClose} />
              <Box sx={grid}>{popularTiles.map((t) => <CategoryCircle key={t.href} tile={t} onNavigate={onClose} />)}</Box>
            </Box>
          </>
        )}
      </Box>
    </Box>
  )
}

export { tilesFor }

/** Warms the browser cache with every tile photo so the panel opens fully drawn (called on first bar hover). */
let preloaded = false
export function preloadCategoryImages() {
  if (preloaded || typeof window === 'undefined') return
  preloaded = true
  for (const url of new Set(Object.values(subImages))) {
    const img = new window.Image()
    img.decoding = 'async'
    img.src = url
  }
}
