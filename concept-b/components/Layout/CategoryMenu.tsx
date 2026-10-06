import Link from 'next/link'
import { Box, Typography } from '@mui/material'
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded'
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
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import EastIcon from '@mui/icons-material/East'
import type { SvgIconComponent } from '@mui/icons-material'
import subImagesJson from '../../data/subcategory-images.json'
import { departments, type Category } from '../../lib/data'

/**
 * Concept B — redesigned category dropdown (reference: Alibaba "All categories").
 * Left rail: "Popular categories" + every department with an icon; hovering a row switches the right panel.
 * Right panel: sub-categories as round picture tiles. Same data as today (Magento category tree); the tile
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
export function CategoryCircle({ tile, size = 104, onNavigate }: { tile: Tile; size?: number; onNavigate?: () => void }) {
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
          <Box component="img" src={tile.image} alt="" sx={{ width: '78%', height: '78%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
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

function RailItem({ label, icon: Icon, active, href, onHover, onNavigate }: { label: string; icon: SvgIconComponent; active: boolean; href?: string; onHover: () => void; onNavigate: () => void }) {
  const sx = {
    display: 'flex', alignItems: 'center', gap: 1.75, minHeight: 50, px: 2.25, textDecoration: 'none', cursor: 'pointer', position: 'relative',
    color: '#0C0C0C', bgcolor: active ? '#F3F4F6' : 'transparent', fontSize: 15, fontWeight: active ? 600 : 400, borderRadius: '0 8px 8px 0',
    '&::before': { content: '""', position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, bgcolor: active ? '#FF0000' : 'transparent' },
    '&:hover': { bgcolor: '#F3F4F6' }, '&:focus-visible': { outline: '2px solid #FF0000', outlineOffset: -2 },
  } as const
  const inner = (
    <>
      <Icon sx={{ fontSize: 22, color: active ? '#D50000' : '#4B5563' }} />
      <Box component="span" sx={{ flex: 1 }}>{label}</Box>
      <ChevronRightRoundedIcon sx={{ fontSize: 20, color: active ? '#D50000' : '#9CA3AF' }} />
    </>
  )
  return href ? (
    <Box component={Link} href={href} onMouseEnter={onHover} onFocus={onHover} onClick={onNavigate} sx={sx} aria-current={active || undefined}>{inner}</Box>
  ) : (
    <Box component="button" type="button" onMouseEnter={onHover} onFocus={onHover} sx={{ ...sx, border: 0, width: '100%', font: 'inherit', textAlign: 'left' }} aria-current={active || undefined}>{inner}</Box>
  )
}

/** Desktop dropdown panel (≥1100px), rendered under the red category bar. */
export default function CategoryMenu({ active, onActive, onClose }: { active: string; onActive: (key: string) => void; onClose: () => void }) {
  const dept = departments.find((d) => d.url_key === active)
  const tiles = dept ? tilesFor(dept) : popularTiles
  return (
    <Box
      role="region"
      aria-label="All categories"
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
      sx={{
        position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1200, bgcolor: '#fff', borderTop: '1px solid #E5E7EB',
        boxShadow: '0 24px 40px -12px rgba(0,0,0,.18)', borderRadius: '0 0 16px 16px',
      }}
    >
      <Box sx={{ maxWidth: 1500, mx: 'auto', display: 'grid', gridTemplateColumns: '300px 1fr', height: 'min(560px, 70vh)' }}>
        {/* Left rail */}
        <Box component="nav" aria-label="Departments" sx={{ borderRight: '1px solid #E5E7EB', overflowY: 'auto', py: 1.5, pr: 1.5 }}>
          <RailItem label="Popular categories" icon={StarBorderRoundedIcon} active={!dept} onHover={() => onActive(POPULAR)} onNavigate={onClose} />
          {departments.map((d) => (
            <RailItem key={d.uid} label={d.name} icon={deptIcons[d.url_key] ?? CategoryOutlinedIcon} active={d.url_key === active} href={`/${d.url_key}`} onHover={() => onActive(d.url_key)} onNavigate={onClose} />
          ))}
        </Box>

        {/* Right panel */}
        <Box sx={{ overflowY: 'auto', px: 4, py: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 2, mb: 2.5 }}>
            <Box>
              <Typography component="h2" sx={{ fontSize: 24, fontWeight: 600, color: '#0C0C0C' }}>{dept ? dept.name : 'Popular categories'}</Typography>
              <Typography sx={{ fontSize: 13, color: '#6B7280', mt: 0.25 }}>
                {dept ? `${dept.product_count.toLocaleString()} products · ${dept.children.length} categories` : 'The biggest ranges across every department'}
              </Typography>
            </Box>
            <Box
              component={Link}
              href={dept ? `/${dept.url_key}` : '/all-categories'}
              onClick={onClose}
              sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, color: '#D50000', fontWeight: 600, fontSize: 14, textDecoration: 'none', whiteSpace: 'nowrap', '&:hover': { textDecoration: 'underline' } }}
            >
              {dept ? `Shop all ${dept.name}` : 'View all categories'} <EastIcon sx={{ fontSize: 18 }} />
            </Box>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', columnGap: 1, rowGap: 2 }}>
            {tiles.map((t) => <CategoryCircle key={t.href} tile={t} onNavigate={onClose} />)}
          </Box>
        </Box>
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
