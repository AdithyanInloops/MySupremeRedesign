import { useMemo, useState, type MouseEvent } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import { tokens, focusRing, srOnly } from '../theme'
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
import { ChevronRightIcon } from '../components/icons'

const c = tokens.color
const asset = (f: string) => `${import.meta.env.BASE_URL}${f}`

/*
 * Home — the current MySupreme app home (header, categories, banners, Recommended Products, Our Brands, New Arrivals,
 * Discover Products for you, tabs) with three changes: a floating category icon bar, round brand badges, and the
 * Offers & Flyers area under the banners, drawn from CMS blocks (src/cms) so it's managed in Magento.
 */

/* ------------------------------------------------------------------ Categories: floating icon bar */

const CATEGORY_ORDER = ['packaging', 'grocery', 'frozen', 'produce', 'dairy-eggs', 'beverage', 'meat-poultry', 'janitorial', 'ware-equipment']
const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/**
 * A floating white card of thin outline icons, each stroked in its department's colour, with labels — each category in its own soft colour. "For You"
 * (this page) is selected (bold label + a short bar in its colour). Tapping an item selects it with a small squash-and-bounce, then opens it.
 */
function CategoryBar() {
  const navigate = useNavigate()
  const drag = useDragScroll<HTMLUListElement>()
  const [active, setActive] = useState('for-you')
  const [tick, setTick] = useState(0)
  const items = [
    { slug: 'for-you', name: 'For You', to: '/' },
    { slug: 'offers', name: 'Offers', to: '/deals' },
    ...CATEGORY_ORDER.map((slug) => ({ slug, name: deptBySlug(slug)?.name ?? slug, to: `/shop/${slug}` })),
  ]
  const pick = (e: MouseEvent, slug: string, to: string) => {
    e.preventDefault()
    setActive(slug)
    setTick((t) => t + 1)
    if (to !== '/') window.setTimeout(() => navigate(to), reducedMotion() ? 0 : 340)
  }
  return (
    <Box sx={{ mx: 2, mt: 1.5, borderRadius: '24px', bgcolor: '#fff', border: '1px solid #EEF0F3', boxShadow: '0 12px 28px -16px rgba(17,24,39,.28)', overflow: 'hidden', position: 'relative',
      // fade on the right edge hints that the row scrolls
      '&::after': { content: '""', position: 'absolute', top: 0, right: 0, bottom: 0, width: 28, pointerEvents: 'none', background: 'linear-gradient(90deg, rgba(255,255,255,0), #fff)' } }}>
      <Box component="ul" aria-label="Categories" className="no-scrollbar" {...drag}
        sx={{ listStyle: 'none', m: 0, display: 'flex', overflowX: 'auto', px: 0.75, py: 1.5, scrollSnapType: 'x mandatory', scrollPaddingInline: '6px', '& > li': { flexShrink: 0, scrollSnapAlign: 'start' } }}>
        {items.map((it, i) => {
          const on = it.slug === active
          return (
            <li key={it.slug}>
              <Box component={RouterLink} to={it.to} draggable={false} aria-current={it.slug === 'for-you' ? 'page' : undefined} onClick={(e: MouseEvent) => pick(e, it.slug, it.to)}
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, minWidth: 68, px: 0.75, py: 0.25, borderRadius: '14px', textDecoration: 'none', color: on ? c.ink : '#6B7280', transition: `color ${tokens.motion.fast}`, ...focusRing }}>
                <Box sx={{ width: 40, height: 40, display: 'grid', placeItems: 'center' }}>
                  <Box key={on ? `${it.slug}-${tick}` : it.slug} sx={{ display: 'grid', placeItems: 'center', width: 32, height: 32, transformOrigin: '50% 100%',
                    animation: on && tick ? `catPop${i % 2} .42s cubic-bezier(.3,.7,.4,1.2)` : 'none',
                    '@keyframes catPop0': { '0%': { transform: 'none' }, '30%': { transform: 'scale(1.12, .8)' }, '62%': { transform: 'translateY(-4px) scale(.94, 1.08) rotate(-7deg)' }, '100%': { transform: 'none' } },
                    '@keyframes catPop1': { '0%': { transform: 'none' }, '30%': { transform: 'scale(1.12, .8)' }, '62%': { transform: 'translateY(-4px) scale(.94, 1.08) rotate(7deg)' }, '100%': { transform: 'none' } },
                    '@media (prefers-reduced-motion: reduce)': { animation: 'none' } }}>
                    <CategoryArt slug={it.slug} size={32} outline strokeWidth={on ? 3 : 2.6} />
                  </Box>
                </Box>
                <Typography component="span" sx={{ fontSize: 12.5, fontWeight: on ? 600 : 500, lineHeight: 1.2, whiteSpace: 'nowrap', color: 'inherit' }}>{it.name}</Typography>
                {/* selected marker in the item's own colour */}
                <Box aria-hidden sx={{ width: on ? 22 : 0, height: 3, borderRadius: 2, bgcolor: CATEGORY_TONES[it.slug].ink, transition: `width ${tokens.motion.base}` }} />
              </Box>
            </li>
          )
        })}
      </Box>
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
      <CategoryBar />
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
