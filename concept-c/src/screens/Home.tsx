import { useMemo, type ReactNode } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import { tokens, focusRing, pressable, srOnly } from '../theme'
import { deptBySlug, newArrivals, products, recommended } from '../data/catalog'
import AppHeader from '../components/AppHeader'
import BannerCarousel from '../components/BannerCarousel'
import Section from '../components/LiveSection'
import LiveCard, { live } from '../components/LiveProductCard'
import { CmsSections } from '../cms/OfferBlocks'
import { homeOfferBlocks } from '../cms/home'
import { HScroll } from '../components/ui'
import { useDragScroll } from '../components/useDragScroll'
import CategoryArt, { CATEGORY_TONES } from '../components/CategoryArt'
import { CategoryIcon, ChevronRightIcon } from '../components/icons'

const c = tokens.color
const asset = (f: string) => `${import.meta.env.BASE_URL}${f}`

/*
 * Home — the current MySupreme app home (header, categories, banners, Recommended Products, Our Brands, New Arrivals,
 * Discover Products for you, tabs) with three changes: illustrated category tiles, round brand badges, and the
 * Offers & Flyers area under the banners, drawn from CMS blocks (src/cms) so it's managed in Magento.
 */

/* ------------------------------------------------------------------ Categories: our own two-tone illustrations */

const CATEGORY_ORDER = ['packaging', 'grocery', 'frozen', 'produce', 'dairy-eggs', 'beverage', 'meat-poultry', 'janitorial', 'ware-equipment']

function CategoryRow() {
  const drag = useDragScroll<HTMLUListElement>()
  const tile = (bg: string, child: ReactNode) => (
    <Box sx={{ width: 64, height: 64, borderRadius: '18px', bgcolor: bg, display: 'grid', placeItems: 'center', boxShadow: 'inset 0 0 0 1px rgba(17,24,39,.04)', transition: `transform ${tokens.motion.fast}` }}>{child}</Box>
  )
  const label = { mt: 0.75, width: '100%', fontSize: 12, fontWeight: 500, lineHeight: 1.25, textAlign: 'center', minHeight: '2.5em', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as const
  const link = { display: 'flex', flexDirection: 'column', alignItems: 'center', width: 70, color: c.ink, textDecoration: 'none', borderRadius: '16px', ...pressable, ...focusRing } as const
  return (
    <Box component="ul" aria-label="Categories" className="no-scrollbar" {...drag}
      sx={{ listStyle: 'none', m: 0, display: 'flex', gap: 1, overflowX: 'auto', px: 2, pt: 1.75, pb: 0.25, scrollSnapType: 'x mandatory', scrollPaddingInline: '16px', '& > li': { scrollSnapAlign: 'start', flexShrink: 0 } }}>
      {CATEGORY_ORDER.map((slug) => {
        const d = deptBySlug(slug)
        if (!d) return null
        return (
          <li key={slug}>
            <Box component={RouterLink} to={`/shop/${slug}`} draggable={false} sx={link}>
              {tile(CATEGORY_TONES[slug].bg, <CategoryArt slug={slug} size={40} />)}
              <Typography sx={label}>{d.name}</Typography>
            </Box>
          </li>
        )
      })}
      <li>
        <Box component={RouterLink} to="/shop" draggable={false} aria-label="All categories" sx={link}>
          {tile('#FFF1F1', <CategoryIcon sx={{ fontSize: 30, color: c.red }} />)}
          <Typography aria-hidden sx={label}>All</Typography>
        </Box>
      </li>
    </Box>
  )
}

/* ------------------------------------------------------------------ Our Brands: round logo badges */

const BRANDS: [file: string, name: string][] = [
  ['ecogate', 'Ecogate'], ['morning-dew', 'Morning Dew'], ['mayfair', 'MayFair'], ['golden-maple', 'Golden Maple'], ['value-plus', 'Value+'],
  ['chartland', 'Chartland'], ['rhino', 'Rhino'], ['tropical-delight', 'Tropical Delight'], ['dispose', 'Dispose'], ['spartano', 'Spartano'],
]

/** One swipe row of round logo badges with the name underneath (prototype: brand pages need live brand data). */
function Brands() {
  const drag = useDragScroll<HTMLUListElement>()
  return (
    <Section id="h-brands" title="Our Brands" to="/shop">
      <Box component="ul" aria-label="Brands" className="no-scrollbar" {...drag}
        sx={{ listStyle: 'none', m: 0, display: 'flex', gap: 1.5, overflowX: 'auto', px: 2, pt: 0.5, pb: 0.5, scrollSnapType: 'x mandatory', scrollPaddingInline: '16px', '& > li': { flexShrink: 0, width: 76, scrollSnapAlign: 'start' } }}>
        {BRANDS.map(([file, name]) => (
          <li key={file}>
            <Box sx={{ width: 72, height: 72, mx: 'auto', borderRadius: '50%', bgcolor: '#fff', border: `1px solid ${live.border}`, boxShadow: '0 6px 14px -10px rgba(17,24,39,.35)', display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
              <Box component="img" src={asset(`brands/${file}.jpg`)} alt="" loading="lazy" draggable={false} sx={{ display: 'block', width: '100%', height: '76%', objectFit: 'contain' }} />
            </Box>
            <Typography sx={{ mt: 0.75, fontSize: 12, fontWeight: 500, lineHeight: 1.25, textAlign: 'center', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{name}</Typography>
          </li>
        ))}
      </Box>
    </Section>
  )
}

/* ------------------------------------------------------------------ Screen */

export default function Home() {
  const recs = useMemo(() => [...recommended, ...products.filter((p) => !p.recommended)].slice(0, 9), [])
  // photos first, as the live feed leads with them
  const discover = useMemo(() => products.filter((p) => !p.recommended && !p.isNew).sort((a, b) => Number(!a.images.length) - Number(!b.images.length)).slice(0, 10), [])
  return (
    <Box sx={{ bgcolor: '#fff', pb: 3 }}>
      <AppHeader />
      <Typography component="h1" sx={srOnly}>Supreme Cash &amp; Carry — home</Typography>
      <CategoryRow />
      <Box sx={{ mt: 2.25 }}><BannerCarousel /></Box>
      <CmsSections blocks={homeOfferBlocks} />

      <Section id="h-recommended" title="Recommended Products" to="/search?q=recommended">
        <Box component="ul" sx={{ listStyle: 'none', m: 0, px: 2, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 1.25 }}>
          {recs.map((p) => <li key={p.sku}><LiveCard product={p} variant="grid" /></li>)}
        </Box>
      </Section>

      <Brands />

      <Section id="h-new" title="New Arrivals" to="/search?q=new">
        <HScroll gap={1.5}>{newArrivals.map((p) => <LiveCard key={p.sku} product={p} variant="rail" width={150} />)}</HScroll>
      </Section>

      <Section id="h-discover" title="Discover Products for you">
        <Box component="ul" sx={{ listStyle: 'none', m: 0, px: 2, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 1.5 }}>
          {discover.map((p) => <li key={p.sku}><LiveCard product={p} variant="discover" /></li>)}
        </Box>
        <Box component={RouterLink} to="/shop" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mx: 2, mt: 2, minHeight: 44, borderRadius: '12px', border: `1.5px solid ${live.border}`, color: c.red, fontWeight: 600, fontSize: 14.5, textDecoration: 'none', ...focusRing }}>
          Browse all categories <ChevronRightIcon sx={{ fontSize: 18 }} />
        </Box>
      </Section>
    </Box>
  )
}
