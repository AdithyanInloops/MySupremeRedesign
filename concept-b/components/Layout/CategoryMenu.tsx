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
import EastRoundedIcon from '@mui/icons-material/EastRounded'
import type { SvgIconComponent } from '@mui/icons-material'
import subImagesJson from '../../data/subcategory-images.json'
import { departments, type Category } from '../../lib/data'
import { colors, focusRing, layout, motion, radius, shadow, z } from '../../lib/theme'

/**
 * Category dropdown (Alibaba-style "All categories"). The red bar is the department selector; the panel shows
 * sub-categories as round picture tiles with product counts. Same data as today (Magento category tree); the tile
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

export type Tile = { name: string; href: string; image?: string | null; count?: number; dept: string }

/** Largest sub-categories across all departments — "Popular categories" (existing data: product_count). */
const popularTiles: Tile[] = departments
  .flatMap((d) => d.children.map((s) => ({ name: s.name, href: `/${d.url_key}?sub=${s.url_key}`, image: s.image || subImages[s.url_key], count: s.product_count, dept: d.url_key })))
  .filter((t) => t.image)
  .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
  .slice(0, 14)

export const tilesFor = (d: Category): Tile[] =>
  d.children.map((s) => ({ name: s.name, href: `/${d.url_key}?sub=${s.url_key}`, image: s.image || subImages[s.url_key], count: s.product_count, dept: d.url_key }))

/** Round picture tile; falls back to the department icon on a soft tint when there is no photo. */
export function CategoryCircle({ tile, size = 96, cover = false, onNavigate }: { tile: Tile; size?: number; cover?: boolean; onNavigate?: () => void }) {
  const Icon = deptIcons[tile.dept] ?? CategoryOutlinedIcon
  return (
    <Box
      component={Link}
      href={tile.href}
      onClick={onNavigate}
      sx={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, textDecoration: 'none', color: colors.ink, textAlign: 'center', borderRadius: radius.md, p: 1,
        '&:hover .circle': { borderColor: colors.red, transform: 'translateY(-2px)', boxShadow: shadow.md },
        '&:hover .name': { color: colors.redText },
        ...focusRing,
      }}
    >
      <Box
        className="circle"
        sx={{
          width: size, height: size, borderRadius: '50%', bgcolor: colors.sunken, border: '2px solid transparent', overflow: 'hidden', display: 'grid', placeItems: 'center', flexShrink: 0,
          transition: `border-color ${motion.fast}, transform ${motion.fast}, box-shadow ${motion.fast}`,
        }}
      >
        {tile.image ? (
          <Box component="img" src={tile.image} alt="" loading="lazy" sx={cover ? { width: '100%', height: '100%', objectFit: 'cover' } : { width: '76%', height: '76%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
        ) : (
          <Icon sx={{ fontSize: size * 0.38, color: colors.ink400 }} />
        )}
      </Box>
      <Box>
        <Typography className="name" sx={{ fontSize: 13.5, fontWeight: 500, lineHeight: 1.3, transition: `color ${motion.fast}`, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {tile.name}
        </Typography>
        {!!tile.count && <Typography sx={{ fontSize: 12, color: colors.ink500, mt: 0.25 }}>{tile.count.toLocaleString()} products</Typography>}
      </Box>
    </Box>
  )
}

function PanelHeader({ id, title, subtitle, href, cta, onClose }: { id: string; title: string; subtitle: string; href: string; cta: string; onClose: () => void }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 2, mb: 2 }}>
      <Box>
        <Typography id={id} component="h2" variant="h3" sx={{ fontSize: 20 }}>{title}</Typography>
        <Typography sx={{ fontSize: 13.5, color: colors.ink500, mt: 0.25 }}>{subtitle}</Typography>
      </Box>
      <Box
        component={Link}
        href={href}
        onClick={onClose}
        sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, color: colors.redText, fontWeight: 600, fontSize: 14.5, textDecoration: 'none', whiteSpace: 'nowrap', borderRadius: '4px', '&:hover': { textDecoration: 'underline' }, ...focusRing }}
      >
        {cta} <EastRoundedIcon sx={{ fontSize: 18 }} />
      </Box>
    </Box>
  )
}

const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(132px, 1fr))', columnGap: 1, rowGap: 1.5 } as const

/**
 * Desktop dropdown panel (≥1100px), rendered under the red category bar. Hovering a department (or pressing its
 * chevron button) shows its sub-categories; "All categories" shows every department plus the most popular
 * sub-categories. Escape closes it and returns focus to the bar.
 */
export default function CategoryMenu({ active, onClose, id }: { active: string; onClose: (refocus?: boolean) => void; id: string }) {
  const dept = departments.find((d) => d.url_key === active)
  const titleId = `${id}-title`
  return (
    <Box
      id={id}
      role="region"
      aria-labelledby={titleId}
      onKeyDown={(e) => e.key === 'Escape' && onClose(true)}
      sx={{
        position: 'absolute', top: '100%', left: 0, right: 0, zIndex: z.menu, bgcolor: '#fff', borderTop: `1px solid ${colors.line}`,
        boxShadow: shadow.lg, borderRadius: `0 0 ${radius.xl} ${radius.xl}`, animation: 'menuIn .16s ease-out',
        '@keyframes menuIn': { from: { opacity: 0, transform: 'translateY(-4px)' }, to: { opacity: 1, transform: 'none' } },
      }}
    >
      <Box sx={{ maxWidth: layout.maxWidth, mx: 'auto', maxHeight: 'min(600px, 72vh)', overflowY: 'auto', px: layout.gutter, py: 3 }}>
        {dept ? (
          <>
            <PanelHeader id={titleId} title={dept.name} subtitle={`${dept.product_count.toLocaleString()} products · ${dept.children.length} categories`} href={`/${dept.url_key}`} cta={`Shop all ${dept.name}`} onClose={() => onClose()} />
            <Box sx={grid}>{tilesFor(dept).map((t) => <CategoryCircle key={t.href} tile={t} onNavigate={() => onClose()} />)}</Box>
          </>
        ) : (
          <>
            <PanelHeader id={titleId} title="Shop by department" subtitle={`${departments.length} departments · 4,300+ products`} href="/all-categories" cta="View all categories" onClose={() => onClose()} />
            <Box sx={grid}>
              {departments.map((d) => (
                <CategoryCircle key={d.uid} cover tile={{ name: d.name, href: `/${d.url_key}`, image: d.image, count: d.product_count, dept: d.url_key }} onNavigate={() => onClose()} />
              ))}
            </Box>
            <Box sx={{ borderTop: `1px solid ${colors.line}`, mt: 3, pt: 3 }}>
              <PanelHeader id={`${titleId}-popular`} title="Popular categories" subtitle="The biggest ranges across every department" href="/all-categories" cta="See more" onClose={() => onClose()} />
              <Box sx={grid}>{popularTiles.map((t) => <CategoryCircle key={t.href} tile={t} onNavigate={() => onClose()} />)}</Box>
            </Box>
          </>
        )}
      </Box>
    </Box>
  )
}

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
