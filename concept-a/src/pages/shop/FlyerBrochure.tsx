import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Box, Button, Drawer, IconButton, Stack, Tooltip, Typography, useMediaQuery, useTheme, type SxProps, type Theme } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import ChevronLeftRounded from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded'
import ShareRounded from '@mui/icons-material/ShareRounded'
import FullscreenRounded from '@mui/icons-material/FullscreenRounded'
import FullscreenExitRounded from '@mui/icons-material/FullscreenExitRounded'
import CloseRounded from '@mui/icons-material/CloseRounded'
import PlaylistAddRounded from '@mui/icons-material/PlaylistAddRounded'
import PlaylistAddCheckRounded from '@mui/icons-material/PlaylistAddCheckRounded'
import ContentCutRounded from '@mui/icons-material/ContentCutRounded'
import ViewModuleRounded from '@mui/icons-material/ViewModuleRounded'
import AutoStoriesRounded from '@mui/icons-material/AutoStoriesRounded'
import ViewCarouselRounded from '@mui/icons-material/ViewCarouselRounded'
import AddShoppingCartRounded from '@mui/icons-material/AddShoppingCartRounded'
import WarehouseRounded from '@mui/icons-material/WarehouseRounded'
import EventRounded from '@mui/icons-material/EventRounded'
import PictureAsPdfOutlined from '@mui/icons-material/PictureAsPdfOutlined'
import TouchAppRounded from '@mui/icons-material/TouchAppRounded'
import { tokens } from '../../theme'
import { contact, img, money, photo, productBySku, warehouses, type Offer } from '../../data/catalog'
import { dealById, dealPhoto, pctOff } from '../../data/flyerDeals'
import { useApp } from '../../state/AppState'
import { Container, NewFeatureTag, PackChip, Sku } from '../../components/ui'
import { AddToCart } from '../../components/Commerce'
import { Crown } from '../../components/Brand'

/**
 * Flyers & Offers — "Brochure" concept. The same offer data as /flyers-offers, presented as printed
 * flyers you flip through: a rack of covers, a two-page spread with a page-turn on desktop and a
 * swipeable single page on mobile. Every deal on a page is tappable and opens the add-to-cart drawer.
 * Page artwork is sized in container units (cqw), so one page design renders as a cover in the rack,
 * a thumbnail and a full page without separate layouts.
 */

const c = tokens.color
const TODAY = new Date('2026-10-06T12:00:00')
const TURN_MS = 750
const EASE = 'cubic-bezier(.45,.05,.3,1)'

const fmt = (d: string) => new Date(d + 'T12:00:00').toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })
const daysLeft = (to: string) => Math.max(0, Math.ceil((new Date(to + 'T23:59:59').getTime() - TODAY.getTime()) / 86400000))
const reduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/* ------------------------------------------------------------------ Flyer data (prototype only) */

type Tone = { bg: string; deep: string; accent: string; paper: string }
type PageDef =
  | { kind: 'cover' }
  | { kind: 'hero'; eyebrow: string; title: string; ids: string[] }
  | { kind: 'grid'; eyebrow: string; title: string; ids: string[] }
  | { kind: 'menu'; title: string; sections: { name: string; blurb: string; ids: string[] }[] }
  | { kind: 'coupons'; title: string; ids: string[] }
  | { kind: 'back' }
type Flyer = { id: string; name: string; kicker: string; headline: [string, string]; valid: string; next: string; tone: Tone; cover: keyof typeof img; pages: PageDef[] }

const menuKits: Extract<PageDef, { kind: 'menu' }> = {
  kind: 'menu',
  title: 'Restaurant Bundles',
  sections: [
    { name: 'Pizza Night', blurb: 'Cheese and boxes for 50 pies.', ids: ['o5', 'x15'] },
    { name: 'Biryani Station', blurb: 'Spice, sides and bread for the dinner rush.', ids: ['x14', 'x13'] },
    { name: 'Burger Bar', blurb: 'Patties and the sauce they need.', ids: ['x17', 'x16'] },
  ],
}

const flyers: Flyer[] = [
  {
    id: 'monthly', name: 'October Monthly Flyer', kicker: 'Monthly flyer · Issue 10', headline: ['October', 'Flyer'], valid: 'Oct 1 – Oct 31, 2026', next: 'November flyer drops Nov 1',
    tone: { bg: c.navy, deep: c.navyDark, accent: c.saffron, paper: '#FFFDF7' }, cover: 'spread',
    pages: [
      { kind: 'cover' },
      { kind: 'grid', eyebrow: 'This week only', title: 'Hot picks', ids: ['o2', 'o6', 'x4', 'x5', 'x6', 'x9'] },
      { kind: 'hero', eyebrow: 'Cover deal', title: 'Pantry staples', ids: ['o3', 'x7', 'x8'] },
      { kind: 'grid', eyebrow: 'Butcher & seafood', title: 'Protein', ids: ['o8', 'x1', 'x2', 'x3'] },
      { kind: 'grid', eyebrow: 'Packaging & take-out', title: 'To go', ids: ['o4', 'o7', 'o1', 'x10'] },
      { kind: 'coupons', title: 'Bulk saver', ids: ['o1', 'o7', 'x11', 'x12'] },
      menuKits,
      { kind: 'back' },
    ],
  },
]

const flyerDeals = (f: Flyer) => {
  const ids = f.pages.flatMap((p) => (p.kind === 'menu' ? p.sections.flatMap((s) => s.ids) : 'ids' in p ? p.ids : []))
  return [...new Set(ids)].map(dealById)
}
const maxOff = (f: Flyer) => Math.max(...flyerDeals(f).map(pctOff))

/* ------------------------------------------------------------------ Page context */

type Ctx = { flyer: Flyer; wh: string; live: boolean; listed: string[]; onPick: (o: Offer) => void }
const PageCtx = createContext<Ctx | null>(null)
const usePage = () => useContext(PageCtx)!

/** Re-provides the context with a flag, e.g. non-interactive copies in thumbnails and the turning leaf. */
function Static({ children, flyer }: { children: ReactNode; flyer?: Flyer }) {
  const ctx = usePage()
  return <PageCtx.Provider value={{ ...ctx, flyer: flyer ?? ctx.flyer, live: false }}>{children}</PageCtx.Provider>
}

/* ------------------------------------------------------------------ Print primitives (sized in cqw) */

function Sheet({ children, bg, sx }: { children: ReactNode; bg: string; sx?: SxProps<Theme> }) {
  return (
    <Box sx={{ position: 'relative', width: '100%', aspectRatio: '8.5 / 11', containerType: 'inline-size', bgcolor: bg, overflow: 'hidden', color: c.ink, textAlign: 'left', ...((sx as object) ?? {}) }}>
      {children}
    </Box>
  )
}

/** Classic flyer price: big dollars, superscript cents. */
function PriceTag({ value, size, color }: { value: number; size: number; color: string }) {
  const [d, cents] = value.toFixed(2).split('.')
  return (
    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'flex-start', fontWeight: 900, lineHeight: 0.85, letterSpacing: '-.05em', fontSize: `${size}cqw`, color }}>
      <Box component="span" sx={{ fontSize: '.42em', mt: '.1em', mr: '.04em' }}>$</Box>
      {d}
      <Box component="span" sx={{ fontSize: '.42em', mt: '.1em', ml: '.06em', letterSpacing: 0 }}>{cents}</Box>
    </Box>
  )
}

const BURST = (() => {
  const n = 16
  const pts = Array.from({ length: n * 2 }, (_, i) => {
    const r = i % 2 ? 41 : 50
    const a = (i * Math.PI) / n
    return `${(50 + r * Math.cos(a)).toFixed(2)}% ${(50 + r * Math.sin(a)).toFixed(2)}%`
  })
  return `polygon(${pts.join(',')})`
})()

function Burst({ size, bg, color, children, sx }: { size: number; bg: string; color: string; children: ReactNode; sx?: SxProps<Theme> }) {
  return (
    <Box sx={{ width: `${size}cqw`, aspectRatio: '1', clipPath: BURST, bgcolor: bg, color, display: 'grid', placeItems: 'center', textAlign: 'center', fontWeight: 900, lineHeight: 0.9, transform: 'rotate(-12deg)', ...((sx as object) ?? {}) }}>
      <Box>{children}</Box>
    </Box>
  )
}

/** Every deal on a page is a button on the live spread, and plain artwork everywhere else. */
function Hot({ o, children, sx }: { o: Offer; children: ReactNode; sx?: SxProps<Theme> }) {
  const { live, onPick, listed, flyer } = usePage()
  const p = productBySku(o.sku)
  const on = listed.includes(o.id)
  const badge = on && (
    <Box sx={{ position: 'absolute', top: '-1.2cqw', right: '-1.2cqw', zIndex: 2, width: '5cqw', height: '5cqw', borderRadius: '50%', bgcolor: c.successText, color: '#fff', display: 'grid', placeItems: 'center', boxShadow: '0 .4cqw 1cqw rgba(0,0,0,.25)' }}>
      <PlaylistAddCheckRounded sx={{ fontSize: '3.2cqw' }} />
    </Box>
  )
  if (!live) return <Box sx={{ position: 'relative', ...((sx as object) ?? {}) }}>{badge}{children}</Box>
  return (
    <Box
      component="button"
      type="button"
      onClick={() => onPick(o)}
      aria-label={`${p?.name ?? o.sku}, ${money(o.offerPrice)}, was ${money(o.regular)}. View deal`}
      sx={{
        appearance: 'none', border: 0, p: 0, m: 0, bgcolor: 'transparent', font: 'inherit', color: 'inherit', textAlign: 'inherit', cursor: 'pointer',
        display: 'block', width: '100%', position: 'relative', borderRadius: '1.6cqw',
        '& .hot-ring': { position: 'absolute', inset: '-1cqw', borderRadius: '2.2cqw', border: `0.5cqw solid ${flyer.tone.accent}`, opacity: 0, transition: 'opacity .15s', pointerEvents: 'none', zIndex: 1 },
        '&:hover .hot-ring, &:focus-visible .hot-ring': { opacity: 1 },
        '&:focus-visible': { outline: 'none' },
        ...((sx as object) ?? {}),
      }}
    >
      <Box className="hot-ring" />
      {badge}
      {children}
    </Box>
  )
}

function Band({ eyebrow, title }: { eyebrow: string; title: string }) {
  const { flyer: f } = usePage()
  return (
    <Box sx={{ position: 'relative', bgcolor: f.tone.bg, color: '#fff', px: '5cqw', pt: '5cqw', pb: '6cqw', clipPath: 'polygon(0 0,100% 0,100% 78%,0 100%)', overflow: 'hidden' }}>
      <Box sx={{ position: 'absolute', right: '-3cqw', top: '-2cqw', width: '30cqw', opacity: 0.12, '& svg': { width: '100% !important', height: 'auto !important' } }}>
        <Crown color="#fff" />
      </Box>
      <Box sx={{ fontSize: '2.2cqw', fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: f.tone.accent }}>{eyebrow}</Box>
      <Box sx={{ fontSize: '8cqw', fontWeight: 900, lineHeight: 0.95, letterSpacing: '-.03em', textTransform: 'uppercase', mt: '.8cqw' }}>{title}</Box>
    </Box>
  )
}

function Foot({ n }: { n: number }) {
  const { flyer: f, wh } = usePage()
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ position: 'absolute', left: '5cqw', right: '5cqw', bottom: '2.6cqw', fontSize: '1.6cqw', color: c.text3, gap: '2cqw' }}>
      <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        Prices valid {f.valid} · {warehouses.find((w) => w.id === wh)?.name} · While quantities last
      </Box>
      <Box sx={{ fontWeight: 800, color: f.tone.bg, flexShrink: 0 }}>{String(n).padStart(2, '0')}</Box>
    </Stack>
  )
}

/* ------------------------------------------------------------------ Pages */

function CoverPage() {
  const { flyer: f, wh } = usePage()
  const t = f.tone
  const w = warehouses.find((x) => x.id === wh)!
  const peek = flyerDeals(f).slice(0, 3)
  const big = { fontSize: '13cqw', fontWeight: 900, lineHeight: 0.88, letterSpacing: '-.045em', textTransform: 'uppercase' } as const
  return (
    <Sheet bg={t.bg}>
      <Box component="img" src={photo(f.cover, 900, 1000)} alt="" loading="lazy" sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '62%', objectFit: 'cover' }} />
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '62.5%', background: `linear-gradient(180deg, rgba(0,0,0,.5) 0%, transparent 28%, transparent 50%, ${t.bg} 99%)` }} />
      <Box sx={{ position: 'absolute', left: '-10%', right: '-10%', top: '46%', height: '4.4cqw', bgcolor: c.red, transform: 'rotate(-6deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2cqw', fontWeight: 800, letterSpacing: '.3em', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden' }}>
        WAREHOUSE PRICES · LOCKED IN · WAREHOUSE PRICES · LOCKED IN
      </Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ position: 'absolute', top: '4.5cqw', left: '5cqw', right: '5cqw' }}>
        <Box component="img" src="/assets/footerLogo.png" alt="MySupreme Cash & Carry" sx={{ width: '25cqw', height: 'auto' }} />
        <Box sx={{ fontSize: '1.9cqw', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#fff', border: '0.25cqw solid rgba(255,255,255,.75)', borderRadius: 99, px: '2cqw', py: '.8cqw', backdropFilter: 'blur(4px)' }}>
          {w.name}
        </Box>
      </Stack>
      <Burst size={27} bg={t.accent} color={t.deep} sx={{ position: 'absolute', top: '22cqw', right: '4cqw', boxShadow: 'none' }}>
        <Box sx={{ fontSize: '2.4cqw', fontWeight: 800 }}>UP TO</Box>
        <Box sx={{ fontSize: '8.5cqw', letterSpacing: '-.04em' }}>{maxOff(f)}%</Box>
        <Box sx={{ fontSize: '3.2cqw' }}>OFF</Box>
      </Burst>
      <Box sx={{ position: 'absolute', left: '5cqw', right: '5cqw', top: '55%' }}>
        <Box sx={{ fontSize: '2.3cqw', fontWeight: 700, letterSpacing: '.2em', color: t.accent, textTransform: 'uppercase' }}>{f.kicker}</Box>
        <Box sx={{ ...big, color: '#fff', mt: '1.2cqw' }}>{f.headline[0]}</Box>
        <Box sx={{ ...big, color: 'transparent', WebkitTextStroke: `0.35cqw ${t.accent}` }}>{f.headline[1]}</Box>
        <Box sx={{ display: 'inline-block', mt: '2.6cqw', bgcolor: t.accent, color: t.deep, fontWeight: 800, fontSize: '2.4cqw', px: '2cqw', py: '.8cqw', transform: 'skew(-8deg)' }}>{f.valid}</Box>
      </Box>
      <Stack direction="row" alignItems="center" sx={{ position: 'absolute', bottom: '5cqw', left: '5cqw', right: '5cqw', gap: '3cqw' }}>
        <Box sx={{ fontSize: '1.9cqw', color: 'rgba(255,255,255,.75)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.14em', mr: 'auto', lineHeight: 1.4 }}>
          Inside<br />this issue
        </Box>
        {peek.map((o) => (
          <Box key={o.id} sx={{ position: 'relative' }}>
            <Box component="img" src={dealPhoto(o, 200)} alt="" loading="lazy" sx={{ width: '12cqw', height: '12cqw', borderRadius: '50%', objectFit: 'cover', border: '0.5cqw solid #fff', display: 'block' }} />
            <Box sx={{ position: 'absolute', bottom: '-1.4cqw', left: '50%', transform: 'translateX(-50%)', bgcolor: c.red, color: '#fff', fontSize: '1.8cqw', fontWeight: 800, px: '1.1cqw', py: '.2cqw', borderRadius: 99, whiteSpace: 'nowrap' }}>
              {money(o.offerPrice)}
            </Box>
          </Box>
        ))}
      </Stack>
    </Sheet>
  )
}

function Tile({ o, dense }: { o: Offer; dense?: boolean }) {
  const { flyer: f } = usePage()
  const p = productBySku(o.sku)!
  return (
    <Hot o={o} sx={{ height: '100%' }}>
      <Box sx={{ bgcolor: '#fff', borderRadius: '1.6cqw', overflow: 'hidden', boxShadow: '0 .3cqw 1.2cqw rgba(17,24,39,.1)', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ position: 'relative', aspectRatio: dense ? '1' : '3 / 2' }}>
          <Box component="img" src={dealPhoto(o)} alt="" loading="lazy" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <Box sx={{ position: 'absolute', top: '1.6cqw', left: 0, bgcolor: c.red, color: '#fff', fontWeight: 800, fontSize: dense ? '1.6cqw' : '1.9cqw', pl: '1.4cqw', pr: '2.6cqw', py: '.5cqw', clipPath: 'polygon(0 0,100% 0,88% 50%,100% 100%,0 100%)' }}>
            SAVE {money(o.regular - o.offerPrice)}
          </Box>
        </Box>
        <Box sx={{ p: dense ? '1.4cqw 1.6cqw 1.8cqw' : '1.6cqw 2cqw 2cqw', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <Box sx={{ fontSize: '1.5cqw', fontWeight: 700, color: f.tone.bg, textTransform: 'uppercase', letterSpacing: '.08em' }}>{p.brand}</Box>
          <Box sx={{ fontSize: dense ? '1.9cqw' : '2.3cqw', fontWeight: 700, lineHeight: 1.2, minHeight: '2.4em', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', mt: '.3cqw' }}>
            {p.name}
          </Box>
          <Stack direction="row" alignItems="flex-end" justifyContent="space-between" sx={{ mt: 'auto', pt: '1.2cqw', gap: '1cqw' }}>
            <PriceTag value={o.offerPrice} size={dense ? 5.6 : 7.4} color={c.red} />
            <Box sx={{ fontSize: dense ? '1.4cqw' : '1.6cqw', color: c.text3, textAlign: 'right', lineHeight: 1.3 }}>
              <Box sx={{ textDecoration: 'line-through' }}>{money(o.regular)}</Box>
              <Box>{p.pack}</Box>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Hot>
  )
}

function GridPage({ def, n }: { def: Extract<PageDef, { kind: 'grid' }>; n: number }) {
  const { flyer: f } = usePage()
  const dense = def.ids.length > 4
  return (
    <Sheet bg={f.tone.paper}>
      <Band eyebrow={def.eyebrow} title={def.title} />
      <Box sx={{ display: 'grid', gridTemplateColumns: dense ? 'repeat(3, minmax(0,1fr))' : 'repeat(2, minmax(0,1fr))', gap: '3cqw', px: '5cqw', mt: '1cqw' }}>
        {def.ids.map((id) => <Tile key={id} o={dealById(id)} dense={dense} />)}
      </Box>
      <Foot n={n} />
    </Sheet>
  )
}

function HeroPage({ def, n }: { def: Extract<PageDef, { kind: 'hero' }>; n: number }) {
  const { flyer: f } = usePage()
  const [main, ...rest] = def.ids.map(dealById)
  const p = productBySku(main.sku)!
  return (
    <Sheet bg={f.tone.paper}>
      <Band eyebrow={def.eyebrow} title={def.title} />
      <Box sx={{ px: '5cqw', mt: '1cqw' }}>
        <Hot o={main}>
          <Box sx={{ position: 'relative', borderRadius: '2cqw', overflow: 'hidden', height: '42cqw' }}>
            <Box component="img" src={dealPhoto(main, 900)} alt="" loading="lazy" sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <Burst size={18} bg={c.red} color="#fff" sx={{ position: 'absolute', top: '2cqw', right: '2cqw' }}>
              <Box sx={{ fontSize: '2cqw' }}>SAVE</Box>
              <Box sx={{ fontSize: '5.4cqw', letterSpacing: '-.04em' }}>{pctOff(main)}%</Box>
            </Burst>
          </Box>
          <Stack direction="row" alignItems="flex-end" justifyContent="space-between" sx={{ mt: '2.6cqw', gap: '3cqw' }}>
            <Box sx={{ minWidth: 0 }}>
              <Box sx={{ fontSize: '1.7cqw', fontWeight: 700, color: f.tone.bg, textTransform: 'uppercase', letterSpacing: '.1em' }}>{p.brand}</Box>
              <Box sx={{ fontSize: '3.4cqw', fontWeight: 800, lineHeight: 1.15, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.name}</Box>
              <Box sx={{ fontSize: '1.9cqw', color: c.text2, mt: '.8cqw' }}>{p.pack} · Reg. {money(main.regular)}</Box>
            </Box>
            <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
              <PriceTag value={main.offerPrice} size={13} color={c.red} />
              <Box sx={{ fontSize: '2cqw', fontWeight: 700, color: c.successText, mt: '.6cqw' }}>Save {money(main.regular - main.offerPrice)}</Box>
            </Box>
          </Stack>
        </Hot>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: '3cqw', px: '5cqw', mt: '4cqw' }}>
        {rest.map((o) => {
          const q = productBySku(o.sku)!
          return (
            <Hot key={o.id} o={o}>
              <Stack direction="row" sx={{ bgcolor: '#fff', borderRadius: '1.6cqw', overflow: 'hidden', boxShadow: '0 .3cqw 1.2cqw rgba(17,24,39,.1)', height: '19cqw' }}>
                <Box component="img" src={dealPhoto(o, 300)} alt="" loading="lazy" sx={{ width: '16cqw', height: '100%', objectFit: 'cover', flexShrink: 0 }} />
                <Stack sx={{ p: '1.6cqw', minWidth: 0, flex: 1 }}>
                  <Box sx={{ fontSize: '1.9cqw', fontWeight: 700, lineHeight: 1.2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{q.name}</Box>
                  <Box sx={{ mt: 'auto' }}>
                    <PriceTag value={o.offerPrice} size={6} color={c.red} />
                    <Box sx={{ fontSize: '1.5cqw', color: c.text3, textDecoration: 'line-through' }}>{money(o.regular)}</Box>
                  </Box>
                </Stack>
              </Stack>
            </Hot>
          )
        })}
      </Box>
      <Foot n={n} />
    </Sheet>
  )
}

function MenuPage({ def, n }: { def: Extract<PageDef, { kind: 'menu' }>; n: number }) {
  const { flyer: f } = usePage()
  const t = f.tone
  return (
    <Sheet bg={t.paper}>
      <Box sx={{ position: 'absolute', inset: '3cqw', border: `0.4cqw solid ${t.bg}`, borderRadius: '1cqw', pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', inset: '4.4cqw', border: `0.15cqw solid ${t.bg}`, borderRadius: '.6cqw', pointerEvents: 'none' }} />
      <Box sx={{ position: 'relative', px: '9cqw', pt: '7cqw', textAlign: 'center' }}>
        <Box sx={{ width: '8cqw', mx: 'auto', '& svg': { width: '100% !important', height: 'auto !important' } }}><Crown color={t.bg} /></Box>
        <Box sx={{ fontSize: '1.8cqw', letterSpacing: '.32em', textTransform: 'uppercase', color: t.bg, fontWeight: 700, mt: '1.2cqw' }}>MySupreme kitchen menu</Box>
        <Box sx={{ fontSize: '6.6cqw', fontWeight: 800, fontStyle: 'italic', color: t.deep, letterSpacing: '-.02em', lineHeight: 1.05, mt: '.6cqw' }}>{def.title}</Box>
        <Stack direction="row" alignItems="center" sx={{ gap: '2cqw', mt: '1.4cqw', color: t.bg, fontSize: '2.2cqw' }}>
          <Box sx={{ flex: 1, borderTop: `0.2cqw solid ${t.bg}` }} />✦<Box sx={{ flex: 1, borderTop: `0.2cqw solid ${t.bg}` }} />
        </Stack>
      </Box>
      {def.sections.map((s) => (
        <Box key={s.name} sx={{ position: 'relative', px: '9cqw', mt: '2.4cqw' }}>
          <Box sx={{ fontSize: '2.6cqw', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.16em', color: t.bg }}>{s.name}</Box>
          <Box sx={{ fontSize: '1.8cqw', fontStyle: 'italic', color: c.text2, mb: '.6cqw' }}>{s.blurb}</Box>
          {s.ids.map((id) => {
            const o = dealById(id)
            const p = productBySku(o.sku)!
            return (
              <Hot key={id} o={o}>
                <Stack direction="row" alignItems="center" sx={{ gap: '2cqw', py: '.7cqw' }}>
                  <Box component="img" src={dealPhoto(o, 200)} alt="" loading="lazy" sx={{ width: '7.4cqw', height: '7.4cqw', borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: `0.3cqw solid ${t.bg}` }} />
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Stack direction="row" alignItems="baseline">
                      <Box sx={{ fontSize: '2.2cqw', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0, maxWidth: '72%' }}>{p.name}</Box>
                      <Box sx={{ flex: 1, minWidth: '3cqw', borderBottom: `0.35cqw dotted ${t.bg}`, mx: '1cqw', opacity: 0.6 }} />
                      <Box sx={{ fontSize: '3cqw', fontWeight: 900, color: c.red, flexShrink: 0 }}>{money(o.offerPrice)}</Box>
                    </Stack>
                    <Box sx={{ fontSize: '1.6cqw', color: c.text3 }}>{p.pack} · <Box component="span" sx={{ textDecoration: 'line-through' }}>{money(o.regular)}</Box></Box>
                  </Box>
                </Stack>
              </Hot>
            )
          })}
        </Box>
      ))}
      <Box sx={{ position: 'absolute', bottom: '5.4cqw', left: 0, right: 0, textAlign: 'center', fontSize: '1.5cqw', color: c.text3, fontStyle: 'italic' }}>
        Bundle prices apply per item · page {n}
      </Box>
    </Sheet>
  )
}

function CouponsPage({ def, n }: { def: Extract<PageDef, { kind: 'coupons' }>; n: number }) {
  const { flyer: f } = usePage()
  const t = f.tone
  return (
    <Sheet bg={t.paper}>
      <Band eyebrow="Clip & save" title={def.title} />
      <Stack sx={{ px: '5cqw', gap: '3cqw', mt: '1.5cqw' }}>
        {def.ids.map((id) => {
          const o = dealById(id)
          const p = productBySku(o.sku)!
          return (
            <Hot key={id} o={o}>
              <Box sx={{ position: 'relative', display: 'grid', gridTemplateColumns: '24cqw minmax(0,1fr)', border: `0.4cqw dashed ${t.bg}`, borderRadius: '1.6cqw', bgcolor: '#fff' }}>
                <ContentCutRounded sx={{ position: 'absolute', top: '-2cqw', left: '4cqw', fontSize: '3.4cqw', color: t.bg, bgcolor: t.paper, px: '.4cqw' }} />
                <Box sx={{ bgcolor: t.bg, color: '#fff', display: 'grid', placeItems: 'center', textAlign: 'center', p: '1.6cqw', m: '1cqw', borderRadius: '1cqw' }}>
                  <Box>
                    <Box sx={{ fontSize: '1.6cqw', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.14em' }}>You save</Box>
                    <Box sx={{ fontSize: '5cqw', fontWeight: 900, color: t.accent, letterSpacing: '-.03em', lineHeight: 1.05 }}>{money(o.regular - o.offerPrice)}</Box>
                    <Box sx={{ fontSize: '1.5cqw', opacity: 0.85 }}>{o.note ?? 'per item'}</Box>
                  </Box>
                </Box>
                <Stack direction="row" alignItems="center" sx={{ gap: '2cqw', p: '1.6cqw', pl: '.6cqw', minWidth: 0 }}>
                  <Box component="img" src={dealPhoto(o, 200)} alt="" loading="lazy" sx={{ width: '13cqw', height: '13cqw', borderRadius: '1cqw', objectFit: 'cover', flexShrink: 0 }} />
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Box sx={{ fontSize: '1.5cqw', fontWeight: 700, color: t.bg, textTransform: 'uppercase', letterSpacing: '.08em' }}>{p.brand}</Box>
                    <Box sx={{ fontSize: '2.1cqw', fontWeight: 700, lineHeight: 1.2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.name}</Box>
                    <Stack direction="row" alignItems="flex-end" justifyContent="space-between" sx={{ mt: '1cqw', gap: '1cqw' }}>
                      <PriceTag value={o.offerPrice} size={5.6} color={c.red} />
                      <Box aria-hidden sx={{ width: '13cqw', height: '3.6cqw', background: 'repeating-linear-gradient(90deg, #111 0 .3cqw, transparent .3cqw .6cqw, #111 .6cqw .75cqw, transparent .75cqw 1.3cqw, #111 1.3cqw 1.8cqw, transparent 1.8cqw 2.1cqw)' }} />
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            </Hot>
          )
        })}
      </Stack>
      <Foot n={n} />
    </Sheet>
  )
}

function BackPage() {
  const { flyer: f, wh } = usePage()
  const t = f.tone
  return (
    <Sheet bg={t.bg} sx={{ color: '#fff' }}>
      <Box sx={{ position: 'absolute', right: '-14cqw', bottom: '-8cqw', width: '80cqw', opacity: 0.07, '& svg': { width: '100% !important', height: 'auto !important' } }}>
        <Crown color="#fff" />
      </Box>
      <Box sx={{ position: 'relative', p: '7cqw' }}>
        <Box component="img" src="/assets/footerLogo.png" alt="MySupreme Cash & Carry" sx={{ width: '28cqw', height: 'auto', display: 'block' }} />
        <Box sx={{ fontSize: '7.6cqw', fontWeight: 900, lineHeight: 0.98, letterSpacing: '-.03em', mt: '9cqw', textTransform: 'uppercase' }}>
          Three warehouses.<br /><Box component="span" sx={{ color: t.accent }}>One price list.</Box>
        </Box>
        <Stack sx={{ mt: '5cqw', gap: '2.6cqw' }}>
          {warehouses.map((w) => (
            <Stack key={w.id} direction="row" alignItems="center" sx={{ gap: '2.4cqw' }}>
              <Box sx={{ width: '7.5cqw', height: '7.5cqw', borderRadius: '50%', bgcolor: w.id === wh ? t.accent : 'rgba(255,255,255,.12)', color: w.id === wh ? t.deep : '#fff', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <WarehouseRounded sx={{ fontSize: '3.8cqw' }} />
              </Box>
              <Box>
                <Box sx={{ fontSize: '2.8cqw', fontWeight: 700 }}>
                  {w.name}
                  {w.id === wh && <Box component="span" sx={{ fontSize: '1.7cqw', color: t.accent, ml: '1.2cqw', letterSpacing: '.1em', textTransform: 'uppercase' }}>Your warehouse</Box>}
                </Box>
                <Box sx={{ fontSize: '1.9cqw', opacity: 0.75 }}>{w.area}</Box>
              </Box>
            </Stack>
          ))}
        </Stack>
        <Box sx={{ mt: '6cqw', borderTop: '0.2cqw solid rgba(255,255,255,.22)', pt: '4cqw' }}>
          <Box sx={{ fontSize: '1.9cqw', textTransform: 'uppercase', letterSpacing: '.18em', color: t.accent, fontWeight: 700 }}>Next issue</Box>
          <Box sx={{ fontSize: '4.2cqw', fontWeight: 800, lineHeight: 1.15, mt: '.6cqw' }}>{f.next}</Box>
          <Box sx={{ fontSize: '1.9cqw', opacity: 0.78, mt: '1.4cqw', lineHeight: 1.5 }}>
            Order online, in the app or at the cash &amp; carry counter.<br />{contact.phone} · {contact.hours}
          </Box>
          <Stack direction="row" sx={{ gap: '2cqw', mt: '3.4cqw' }}>
            <Box component="img" src="/assets/appstore1.svg" alt="App Store" sx={{ height: '6.4cqw', width: 'auto' }} />
            <Box component="img" src="/assets/playstore1.svg" alt="Google Play" sx={{ height: '6.4cqw', width: 'auto' }} />
          </Stack>
        </Box>
      </Box>
    </Sheet>
  )
}

function Page({ def, n }: { def: PageDef; n: number }) {
  switch (def.kind) {
    case 'cover': return <CoverPage />
    case 'hero': return <HeroPage def={def} n={n} />
    case 'grid': return <GridPage def={def} n={n} />
    case 'menu': return <MenuPage def={def} n={n} />
    case 'coupons': return <CouponsPage def={def} n={n} />
    case 'back': return <BackPage />
  }
}

/* ------------------------------------------------------------------ Desktop book with page turn */

// Spread 0 is the cover alone on the right; spread k shows pages 2k-1 | 2k; the last may be the back cover alone on the left.
const leftOf = (pages: PageDef[], k: number) => (k === 0 ? null : pages[2 * k - 1] ?? null)
const rightOf = (pages: PageDef[], k: number) => pages[2 * k] ?? null
const spreadOfPage = (i: number) => (i === 0 ? 0 : Math.floor((i + 1) / 2))

type Turn = { from: number; to: number; id: number }

function useFlip(pages: PageDef[]) {
  const last = Math.floor(pages.length / 2)
  const [spread, setSpread] = useState(0)
  const [turn, setTurn] = useState<Turn | null>(null)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])
  const go = useCallback(
    (to: number) => {
      if (turn || to === spread || to < 0 || to > last) return
      if (reduced()) return setSpread(to)
      setTurn({ from: spread, to, id: Date.now() })
      timer.current = window.setTimeout(() => {
        setSpread(to)
        setTurn(null)
      }, TURN_MS)
    },
    [turn, spread, last],
  )
  return { spread, turn, go, last }
}

function Half({ def, index, side }: { def: PageDef | null; index: number; side: 'left' | 'right' }) {
  if (!def) return <Box sx={{ aspectRatio: '8.5 / 11' }} />
  return (
    <Box sx={{ position: 'relative', boxShadow: '0 30px 60px -24px rgba(0,0,0,.6)' }}>
      <Page def={def} n={index} />
      <Box aria-hidden sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: side === 'left' ? 'linear-gradient(270deg, rgba(0,0,0,.22), rgba(0,0,0,0) 7%)' : 'linear-gradient(90deg, rgba(0,0,0,.22), rgba(0,0,0,0) 7%, rgba(255,255,255,0) 94%, rgba(0,0,0,.06))' }} />
    </Box>
  )
}

function Face({ def, index, back }: { def: PageDef | null; index: number; back?: boolean }) {
  return (
    <Box sx={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: back ? 'rotateY(180deg)' : 'none', boxShadow: def ? '0 20px 40px -20px rgba(0,0,0,.5)' : 'none' }}>
      {def && (
        <Static>
          <Page def={def} n={index} />
          <Box aria-hidden sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,.35), rgba(0,0,0,0) 60%)', animation: `bkShade ${TURN_MS}ms ${EASE}`, opacity: 0, '@keyframes bkShade': { '0%': { opacity: 0 }, '50%': { opacity: 1 }, '100%': { opacity: 0 } } }} />
        </Static>
      )}
    </Box>
  )
}

function Book({ pages, spread, turn, go }: { pages: PageDef[]; spread: number; turn: Turn | null; go: (to: number) => void }) {
  const next = turn ? turn.to > turn.from : true
  const base = turn
    ? next
      ? { l: leftOf(pages, turn.from), li: 2 * turn.from - 1, r: rightOf(pages, turn.to), ri: 2 * turn.to }
      : { l: leftOf(pages, turn.to), li: 2 * turn.to - 1, r: rightOf(pages, turn.from), ri: 2 * turn.from }
    : { l: leftOf(pages, spread), li: 2 * spread - 1, r: rightOf(pages, spread), ri: 2 * spread }
  const target = turn ? turn.to : spread
  // Centre a lone cover / back cover the way a real book sits closed.
  const shift = leftOf(pages, target) === null ? '-25%' : rightOf(pages, target) === null ? '25%' : '0%'
  const both = base.l && base.r

  return (
    <Box
      sx={{
        position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', perspective: '2800px',
        width: 'min(100%, 1080px, calc((100vh - 230px) * 1.545))', mx: 'auto',
        transform: `translateX(${shift})`, transition: `transform ${TURN_MS}ms ${EASE}`,
      }}
    >
      <Half def={base.l} index={base.li} side="left" />
      <Half def={base.r} index={base.ri} side="right" />
      {both && <Box aria-hidden sx={{ position: 'absolute', top: 0, bottom: 0, left: 'calc(50% - 1px)', width: 2, bgcolor: 'rgba(0,0,0,.18)', pointerEvents: 'none' }} />}

      {turn && (
        <Box
          key={turn.id}
          aria-hidden
          sx={{
            position: 'absolute', top: 0, bottom: 0, width: '50%', left: next ? '50%' : 0, zIndex: 3, pointerEvents: 'none',
            transformOrigin: next ? 'left center' : 'right center', transformStyle: 'preserve-3d',
            animation: `${next ? 'bkNext' : 'bkPrev'} ${TURN_MS}ms ${EASE} forwards`,
            '@keyframes bkNext': { from: { transform: 'rotateY(0deg)' }, to: { transform: 'rotateY(-180deg)' } },
            '@keyframes bkPrev': { from: { transform: 'rotateY(0deg)' }, to: { transform: 'rotateY(180deg)' } },
          }}
        >
          {next ? (
            <>
              <Face def={rightOf(pages, turn.from)} index={2 * turn.from} />
              <Face def={leftOf(pages, turn.to)} index={2 * turn.to - 1} back />
            </>
          ) : (
            <>
              <Face def={leftOf(pages, turn.from)} index={2 * turn.from - 1} />
              <Face def={rightOf(pages, turn.to)} index={2 * turn.to} back />
            </>
          )}
        </Box>
      )}

      {/* Page-curl corners: click to turn */}
      {!turn && base.r && spread < Math.floor(pages.length / 2) && (
        <Box component="button" type="button" aria-label="Next page" onClick={() => go(spread + 1)} sx={curl('right')} />
      )}
      {!turn && base.l && spread > 0 && (
        <Box component="button" type="button" aria-label="Previous page" onClick={() => go(spread - 1)} sx={curl('left')} />
      )}
    </Box>
  )
}

const curl = (side: 'left' | 'right'): SxProps<Theme> => ({
  position: 'absolute', bottom: 0, [side]: 0, zIndex: 4, width: 44, height: 44, p: 0, border: 0, cursor: 'pointer',
  background: side === 'right'
    ? 'linear-gradient(135deg, transparent 50%, #E8E4DA 50%, #fff 62%, rgba(0,0,0,.18) 100%)'
    : 'linear-gradient(225deg, transparent 50%, #E8E4DA 50%, #fff 62%, rgba(0,0,0,.18) 100%)',
  transition: 'width .2s, height .2s',
  '&:hover, &:focus-visible': { width: 72, height: 72 },
  '&:focus-visible': { outline: `3px solid ${c.saffron}`, outlineOffset: 2 },
})

/* ------------------------------------------------------------------ Mobile: swipe one page at a time */

function SwipeBook({ pages, index, onIndex, trackRef }: { pages: PageDef[]; index: number; onIndex: (i: number) => void; trackRef: React.RefObject<HTMLDivElement | null> }) {
  const onScroll = () => {
    const el = trackRef.current
    if (!el) return
    const mid = el.scrollLeft + el.clientWidth / 2
    let best = 0
    let dist = Infinity
    Array.from(el.children).forEach((ch, i) => {
      const n = ch as HTMLElement
      const d = Math.abs(n.offsetLeft + n.offsetWidth / 2 - mid)
      if (d < dist) { dist = d; best = i }
    })
    if (best !== index) onIndex(best)
  }
  return (
    <Box
      ref={trackRef}
      onScroll={onScroll}
      className="no-scrollbar"
      sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', scrollSnapType: 'x mandatory', px: '9%', py: 1, mx: -2 }}
    >
      {pages.map((p, i) => (
        <Box key={i} sx={{ flex: '0 0 82%', scrollSnapAlign: 'center', boxShadow: '0 18px 36px -18px rgba(0,0,0,.65)', transition: 'transform .3s, opacity .3s', transform: i === index ? 'none' : 'scale(.94)', opacity: i === index ? 1 : 0.6 }}>
          <Page def={p} n={i} />
        </Box>
      ))}
    </Box>
  )
}

/* ------------------------------------------------------------------ Reader (stage + controls + thumbnails) */

function Reader({ flyer }: { flyer: Flyer }) {
  const theme = useTheme()
  const desktop = useMediaQuery(theme.breakpoints.up('md'))
  const { toast } = useApp()
  const pages = flyer.pages
  const { spread, turn, go, last } = useFlip(pages)
  const [mIndex, setMIndex] = useState(0)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const [full, setFull] = useState(false)

  const shownSpread = turn ? turn.to : spread
  const current = desktop ? [2 * shownSpread - 1, 2 * shownSpread].filter((i) => i >= 0 && i < pages.length) : [mIndex]
  const label = current.length === 2 ? `Pages ${current[0] + 1}–${current[1] + 1}` : `Page ${current[0] + 1}`

  const goPage = (i: number) => {
    if (desktop) return go(spreadOfPage(i))
    const el = trackRef.current?.children[i] as HTMLElement | undefined
    trackRef.current?.scrollTo({ left: el ? el.offsetLeft - (trackRef.current.clientWidth - el.offsetWidth) / 2 : 0, behavior: reduced() ? 'auto' : 'smooth' })
  }
  const step = (d: 1 | -1) => (desktop ? go(spread + d) : goPage(Math.min(pages.length - 1, Math.max(0, mIndex + d))))
  const atStart = desktop ? spread === 0 : mIndex === 0
  const atEnd = desktop ? spread === last : mIndex === pages.length - 1

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (t.closest('input, textarea, [role="dialog"]')) return
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })
  useEffect(() => {
    const onFs = () => setFull(document.fullscreenElement === stageRef.current)
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  const toggleFull = () => (full ? document.exitFullscreen() : stageRef.current?.requestFullscreen?.())
  const share = () => {
    navigator.clipboard?.writeText(window.location.href).then(() => toast('Flyer link copied'), () => toast('Could not copy the link', 'error'))
  }
  const tool = { color: '#fff', bgcolor: 'rgba(255,255,255,.08)', '&:hover': { bgcolor: 'rgba(255,255,255,.16)' } }
  const arrow = (d: 1 | -1, disabled: boolean) => (
    <IconButton
      aria-label={d === 1 ? 'Next page' : 'Previous page'}
      onClick={() => step(d)}
      disabled={disabled}
      sx={{
        display: { xs: 'none', md: 'inline-flex' }, position: 'absolute', top: '50%', [d === 1 ? 'right' : 'left']: 20, transform: 'translateY(-50%)', zIndex: 5,
        width: 56, height: 56, bgcolor: '#fff', color: c.navy, boxShadow: tokens.shadow.pop, '&:hover': { bgcolor: c.saffron }, '&.Mui-disabled': { bgcolor: 'rgba(255,255,255,.15)', color: 'rgba(255,255,255,.4)' },
      }}
    >
      {d === 1 ? <ChevronRightRounded fontSize="large" /> : <ChevronLeftRounded fontSize="large" />}
    </IconButton>
  )

  return (
    <Box
      ref={stageRef}
      sx={{
        position: 'relative', borderRadius: full ? 0 : { xs: `${tokens.radius.lg}px`, md: `${tokens.radius.xl}px` }, overflow: 'hidden', color: '#fff',
        bgcolor: '#15133A', backgroundImage: 'radial-gradient(70% 60% at 50% 45%, rgba(77,72,170,.45), transparent 70%), radial-gradient(rgba(255,255,255,.07) 1px, transparent 1px)',
        backgroundSize: 'auto, 18px 18px', px: { xs: 2, md: 12 }, pt: { xs: 2, md: 3 }, pb: { xs: 2, md: 3 },
        ...(full ? { display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh' } : {}),
      }}
    >
      {/* Toolbar */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: { xs: 1.5, md: 2.5 }, mx: { md: -8 } }}>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: { xs: 15, md: 17 }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{flyer.name}</Typography>
          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ fontSize: 12.5, opacity: 0.75 }}>
            <EventRounded sx={{ fontSize: 15 }} /><span>{flyer.valid}</span><span>·</span><span aria-live="polite">{label} of {pages.length}</span>
          </Stack>
        </Box>
        <Tooltip title="Download PDF"><IconButton aria-label="Download PDF" sx={tool} onClick={() => toast('The PDF is generated when the flyer is published', 'info')}><PictureAsPdfOutlined /></IconButton></Tooltip>
        <Tooltip title="Copy link"><IconButton aria-label="Copy flyer link" sx={tool} onClick={share}><ShareRounded /></IconButton></Tooltip>
        <Tooltip title={full ? 'Exit full screen' : 'Full screen'}>
          <IconButton aria-label={full ? 'Exit full screen' : 'Full screen'} sx={{ ...tool, display: { xs: 'none', md: 'inline-flex' } }} onClick={toggleFull}>{full ? <FullscreenExitRounded /> : <FullscreenRounded />}</IconButton>
        </Tooltip>
      </Stack>

      {desktop ? <Book pages={pages} spread={spread} turn={turn} go={go} /> : <SwipeBook pages={pages} index={mIndex} onIndex={setMIndex} trackRef={trackRef} />}
      {arrow(-1, atStart)}
      {arrow(1, atEnd)}

      {/* Hint + mobile arrows */}
      <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mt: { xs: 1.5, md: 2.5 }, fontSize: 12.5, opacity: 0.75 }}>
        <IconButton aria-label="Previous page" onClick={() => step(-1)} disabled={atStart} sx={{ ...tool, display: { md: 'none' }, '&.Mui-disabled': { color: 'rgba(255,255,255,.3)' } }}><ChevronLeftRounded /></IconButton>
        <TouchAppRounded sx={{ fontSize: 16 }} />
        <span>{desktop ? 'Tap any deal to add it · use ← → or the page corners to flip' : 'Swipe to flip · tap any deal'}</span>
        <IconButton aria-label="Next page" onClick={() => step(1)} disabled={atEnd} sx={{ ...tool, display: { md: 'none' }, '&.Mui-disabled': { color: 'rgba(255,255,255,.3)' } }}><ChevronRightRounded /></IconButton>
      </Stack>

      {/* Thumbnails */}
      <Static>
        <Stack direction="row" spacing={1.25} className="no-scrollbar" sx={{ mt: 2, overflowX: 'auto', justifyContent: { md: 'center' }, mx: { xs: -2, md: -8 }, px: { xs: 2, md: 0 }, pb: 0.5 }} role="group" aria-label="Pages">
          {pages.map((p, i) => {
            const on = current.includes(i)
            return (
              <Box
                key={i}
                component="button"
                type="button"
                onClick={() => goPage(i)}
                aria-label={`Go to page ${i + 1}`}
                aria-current={on ? 'page' : undefined}
                sx={{
                  flex: '0 0 auto', width: { xs: 52, md: 62 }, p: 0, border: 0, bgcolor: 'transparent', cursor: 'pointer', color: '#fff',
                  '& .thumb': { outline: on ? `3px solid ${c.saffron}` : '1px solid rgba(255,255,255,.2)', outlineOffset: on ? 2 : 0, opacity: on ? 1 : 0.6, transition: 'opacity .15s' },
                  '&:hover .thumb': { opacity: 1 }, '&:focus-visible': { outline: `2px solid ${c.saffron}`, outlineOffset: 4, borderRadius: 1 },
                }}
              >
                <Box className="thumb" aria-hidden sx={{ pointerEvents: 'none', borderRadius: '2px', overflow: 'hidden' }}><Page def={p} n={i} /></Box>
                <Box sx={{ fontSize: 11, mt: 0.5, opacity: on ? 1 : 0.6, fontWeight: on ? 700 : 500 }}>{i === 0 ? 'Cover' : i + 1}</Box>
              </Box>
            )
          })}
        </Stack>
      </Static>
    </Box>
  )
}

/* ------------------------------------------------------------------ Deal drawer */

const dealTint: Record<string, string> = { 'Monthly Flyer': c.navy, 'Weekly Hot Picks': c.red, 'Bulk Saver': '#0F5132', 'Restaurant Bundles': '#7C2D12' }

function DealDrawer({ o, wh, listed, onToggle, onClose }: { o: Offer | null; wh: string; listed: boolean; onToggle: () => void; onClose: () => void }) {
  const theme = useTheme()
  const desktop = useMediaQuery(theme.breakpoints.up('md'))
  const p = o ? productBySku(o.sku) : undefined
  const whName = warehouses.find((w) => w.id === wh)?.name
  const left = o ? daysLeft(o.to) : 0
  return (
    <Drawer
      anchor={desktop ? 'right' : 'bottom'}
      open={!!o}
      onClose={onClose}
      PaperProps={{ sx: { width: { md: 440 }, maxHeight: { xs: '90vh', md: 'none' }, borderRadius: { xs: `${tokens.radius.lg}px ${tokens.radius.lg}px 0 0`, md: 0 } } }}
    >
      {o && p && (
        <Box sx={{ p: { xs: 2, md: 3 } }} role="dialog" aria-label={p.name}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Box sx={{ fontSize: 12, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#fff', bgcolor: dealTint[o.deal] ?? c.navy, px: 1.25, py: 0.5, borderRadius: 999 }}>
              {o.deal}{o.note ? ` · ${o.note}` : ''}
            </Box>
            <IconButton aria-label="Close" onClick={onClose}><CloseRounded /></IconButton>
          </Stack>
          <Box sx={{ position: 'relative', borderRadius: `${tokens.radius.md}px`, overflow: 'hidden', aspectRatio: '4 / 3', bgcolor: c.surface2 }}>
            <Box component="img" src={dealPhoto(o, 800)} alt={p.name} sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <Box sx={{ position: 'absolute', top: 12, left: 12, bgcolor: c.saffron, color: c.navyDark, fontWeight: 800, fontSize: 15, px: 1.25, py: 0.5, borderRadius: `${tokens.radius.sm}px` }}>−{pctOff(o)}%</Box>
          </Box>
          <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: c.navy, mt: 2 }}>{p.brand}</Typography>
          <Typography variant="h4" component="h2" sx={{ fontSize: 19, mt: 0.25 }}>{p.name}</Typography>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
            <PackChip pack={p.pack} size="sm" />
            <Sku sku={p.sku} />
          </Stack>
          <Stack direction="row" alignItems="baseline" spacing={1.25} sx={{ mt: 2 }}>
            <Typography sx={{ fontSize: 32, fontWeight: 800, color: c.red, letterSpacing: '-.02em', lineHeight: 1 }}>{money(o.offerPrice)}</Typography>
            <Typography sx={{ fontSize: 15, color: c.text3, textDecoration: 'line-through' }}>{money(o.regular)}</Typography>
          </Stack>
          <Typography sx={{ fontSize: 13.5, color: c.successText, fontWeight: 600, mt: 0.5 }}>You save {money(o.regular - o.offerPrice)}{o.note?.includes('case') ? ' per case' : ''}</Typography>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mt: 1.5, fontSize: 13, color: c.text2 }}>
            <EventRounded sx={{ fontSize: 17 }} />
            <span>{fmt(o.from)} – {fmt(o.to)}</span>
            <Box component="span" sx={{ fontWeight: 700, color: left <= 6 ? c.red : c.navy, bgcolor: left <= 6 ? c.redTint : c.navyTint, px: 1, borderRadius: 999 }}>
              {left === 0 ? 'Ends today' : `Ends in ${left} day${left === 1 ? '' : 's'}`}
            </Box>
          </Stack>
          <Typography sx={{ fontSize: 13, mt: 1, color: o.warehouses.includes(wh) ? c.successText : c.warning, fontWeight: 600 }}>
            {o.warehouses.includes(wh) ? `On offer at ${whName}` : `Not on offer at ${whName} — regular price applies`}
          </Typography>
          <Box sx={{ mt: 2.5 }}>
            <AddToCart product={{ ...p, price: o.offerPrice, regular: o.regular, groupPrice: undefined }} size="lg" />
          </Box>
          <Stack direction="row" spacing={1} sx={{ mt: 1.25 }}>
            <Button fullWidth variant="outlined" color="secondary" onClick={onToggle} startIcon={listed ? <PlaylistAddCheckRounded /> : <PlaylistAddRounded />} sx={{ minHeight: 44 }}>
              {listed ? 'On my list' : 'Add to my list'}
            </Button>
            <Button fullWidth component={RouterLink} to={`/p/${p.slug}`} sx={{ minHeight: 44, color: c.navy }}>Product details</Button>
          </Stack>
        </Box>
      )}
    </Drawer>
  )
}

/* ------------------------------------------------------------------ Page */

export default function FlyerBrochure() {
  const { addToCart } = useApp()
  const [wh, setWh] = useState('mis')
  const [picked, setPicked] = useState<Offer | null>(null)
  const [listed, setListed] = useState<string[]>([])
  const flyer = flyers[0]

  const toggle = (id: string) => setListed((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]))
  const ctx = useMemo<Ctx>(() => ({ flyer, wh, live: true, listed, onPick: setPicked }), [flyer, wh, listed])
  const listDeals = listed.map(dealById)
  const saving = listDeals.reduce((s, o) => s + (o.regular - o.offerPrice), 0)

  return (
    <PageCtx.Provider value={ctx}>
      <Container>
        <Box sx={{ pt: { xs: 2, md: 3 }, pb: { xs: 1, md: 1.5 } }}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'flex-end' }} spacing={2}>
            <Box>
              <Typography variant="h1" sx={{ fontSize: { xs: 28, md: 40 } }}>Flyers &amp; Offers</Typography>
              <Typography color="text.secondary" sx={{ mt: 0.75 }}>Flip through your warehouse’s October flyer. Tap any deal to add it to your cart.</Typography>
            </Box>
            <Stack direction="row" sx={{ bgcolor: '#fff', border: `1px solid ${c.line}`, borderRadius: 999, p: 0.5, alignSelf: { xs: 'flex-start', md: 'auto' } }} aria-label="Flyer view">
              <Button component={RouterLink} to="/flyers-offers" startIcon={<ViewModuleRounded />} sx={{ borderRadius: 999, px: 2, minHeight: 44, color: c.text2 }}>Deal grid</Button>
              <Button component={RouterLink} to="/flyers-offers/menu-cards" startIcon={<ViewCarouselRounded />} sx={{ borderRadius: 999, px: 2, minHeight: 44, color: c.text2 }}>Menu cards</Button>
              <Button aria-current="page" startIcon={<AutoStoriesRounded />} sx={{ borderRadius: 999, px: 2, minHeight: 44, bgcolor: c.navy, color: '#fff', '&:hover': { bgcolor: c.navyDark } }}>
                Brochure
              </Button>
            </Stack>
          </Stack>
        </Box>

        <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
          <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: c.text2, mr: 0.5 }}>Prices for</Typography>
          {warehouses.map((w) => {
            const on = w.id === wh
            return (
              <Button key={w.id} onClick={() => setWh(w.id)} aria-pressed={on} startIcon={<WarehouseRounded sx={{ fontSize: '18px !important' }} />}
                sx={{ borderRadius: 999, minHeight: 40, px: 1.75, fontSize: 13.5, bgcolor: on ? c.navy : '#fff', color: on ? '#fff' : c.ink, border: `1px solid ${on ? c.navy : c.line}`, '&:hover': { bgcolor: on ? c.navyDark : c.bg } }}>
                {w.name}
              </Button>
            )
          })}
          <NewFeatureTag label="New" note="flyer pages (layout per flyer issue) on top of offer & warehouse data" sx={{ ml: { sm: 'auto !important' } }} />
        </Stack>

        <Box sx={{ mt: { xs: 2, md: 2.5 } }}>
          <Reader key={wh} flyer={flyer} />
        </Box>

        {listed.length > 0 ? (
          <Box sx={{ position: 'sticky', bottom: { xs: 84, md: 20 }, zIndex: 6, mt: 3, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
            <Stack direction="row" alignItems="center" sx={{ pointerEvents: 'auto', bgcolor: c.navyDark, color: '#fff', borderRadius: 999, pl: { xs: 2, md: 2.5 }, pr: 0.75, py: 0.75, gap: { xs: 1, md: 2 }, boxShadow: tokens.shadow.pop, maxWidth: '100%' }}>
              <PlaylistAddCheckRounded sx={{ color: c.saffron, display: { xs: 'none', sm: 'block' } }} />
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap' }}>My flyer list · {listed.length}</Typography>
                <Typography sx={{ fontSize: 12, opacity: 0.75, whiteSpace: 'nowrap' }}>Saving {money(saving)}</Typography>
              </Box>
              <Button variant="contained" startIcon={<AddShoppingCartRounded />} onClick={() => listDeals.forEach((o) => addToCart(o.sku, 1))} sx={{ borderRadius: 999, minHeight: 44, whiteSpace: 'nowrap' }}>
                Add all
              </Button>
              <IconButton aria-label="Clear my flyer list" onClick={() => setListed([])} sx={{ color: '#fff' }}><CloseRounded /></IconButton>
            </Stack>
          </Box>
        ) : (
          <Box sx={{ height: 24 }} />
        )}
      </Container>

      <DealDrawer o={picked} wh={wh} listed={!!picked && listed.includes(picked.id)} onToggle={() => picked && toggle(picked.id)} onClose={() => setPicked(null)} />
    </PageCtx.Provider>
  )
}
