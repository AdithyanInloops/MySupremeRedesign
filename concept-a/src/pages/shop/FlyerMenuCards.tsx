import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Box, Button, Drawer, IconButton, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import ChevronLeftRounded from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded'
import PauseRounded from '@mui/icons-material/PauseRounded'
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded'
import WarehouseRounded from '@mui/icons-material/WarehouseRounded'
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded'
import ViewModuleRounded from '@mui/icons-material/ViewModuleRounded'
import AutoStoriesRounded from '@mui/icons-material/AutoStoriesRounded'
import ViewCarouselRounded from '@mui/icons-material/ViewCarouselRounded'
import PictureAsPdfOutlined from '@mui/icons-material/PictureAsPdfOutlined'
import TouchAppRounded from '@mui/icons-material/TouchAppRounded'
import CloseRounded from '@mui/icons-material/CloseRounded'
import { tokens } from '../../theme'
import { img, money, photo, productBySku, warehouses, type Offer } from '../../data/catalog'
import { allDeals, dealPhoto, pctOff } from '../../data/flyerDeals'
import { useApp } from '../../state/AppState'
import { Container, NewFeatureTag, PackChip } from '../../components/ui'
import { AddToCart } from '../../components/Commerce'
import { Crown } from '../../components/Brand'

/**
 * Flyers & Offers — "Menu cards" concept. One flyer per warehouse, cut into full-bleed menu cards that slide
 * in a 3D carousel (not a flip-book, which is what competitors embed). Every price on a card is tappable and
 * jumps to the shoppable shelf under the carousel, which always shows the deals on the current card.
 * Card artwork is sized in container units (cqw) so it scales from phone to desktop without a second layout.
 */

const c = tokens.color
const SLIDE_MS = 6500
const reduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const dept = (o: Offer) => productBySku(o.sku)?.dept ?? ''
const unit = (o: Offer) => (/x|case|ct|sets/i.test(productBySku(o.sku)?.pack ?? '') ? 'Case' : 'Each')

/* ------------------------------------------------------------------ Card definitions */

type Layout = 'cover' | 'feature' | 'stack' | 'board'
type CardDef = { id: string; label: string; eyebrow: string; title: string; layout: Layout; photo: keyof typeof img; deals: Offer[] }

function buildCards(wh: string): CardDef[] {
  const here = allDeals.filter((o) => o.warehouses.includes(wh))
  // A deal can appear in two promotions; the shelf shows each product once per card.
  const uniq = (list: Offer[]) => list.filter((o, i) => list.findIndex((x) => x.sku === o.sku) === i)
  const best = [...here].sort((a, b) => pctOff(b) - pctOff(a))[0]
  const cards: CardDef[] = [
    { id: 'cover', label: 'Cover', eyebrow: 'October flyer', title: 'Cover', layout: 'cover', photo: 'spread', deals: uniq(here) },
    { id: 'feature', label: 'Cover deal', eyebrow: `Save ${best ? pctOff(best) : 0}%`, title: 'Cover deal', layout: 'feature', photo: 'spread', deals: best ? [best] : [] },
    { id: 'weekly', label: 'Hot this week', eyebrow: 'Oct 5 – 11 only', title: 'Hot this week', layout: 'stack', photo: 'produceStall', deals: uniq(here.filter((o) => o.deal === 'Weekly Hot Picks')) },
    { id: 'protein', label: 'Butcher & seafood', eyebrow: 'Halal · fresh & frozen', title: 'Butcher & seafood', layout: 'stack', photo: 'steak', deals: uniq(here.filter((o) => o.deal === 'Monthly Flyer' && (dept(o) === 'meat-poultry' || dept(o) === 'frozen'))) },
    { id: 'pantry', label: 'Pantry & take-out', eyebrow: 'Kitchen staples', title: 'Pantry & take-out', layout: 'stack', photo: 'rice', deals: uniq(here.filter((o) => o.deal === 'Monthly Flyer' && dept(o) !== 'meat-poultry' && dept(o) !== 'frozen')) },
    { id: 'bulk', label: 'Bulk saver', eyebrow: 'Buy 5+ cases', title: 'Bulk saver', layout: 'stack', photo: 'aisle', deals: uniq(here.filter((o) => o.deal === 'Bulk Saver')) },
    { id: 'bundles', label: 'Restaurant bundles', eyebrow: 'Kitchen menu', title: 'Restaurant bundles', layout: 'board', photo: 'fineDining', deals: uniq(here.filter((o) => o.deal === 'Restaurant Bundles')) },
  ]
  // Stack cards hold three deals; longer sections continue on a second card so every deal is on a card.
  return cards
    .filter((k) => k.layout === 'cover' || k.deals.length > 0)
    .flatMap((k) => {
      if (k.layout !== 'stack' || k.deals.length <= 3) return [k]
      const parts = Math.ceil(k.deals.length / 3)
      return Array.from({ length: parts }, (_, i) => ({
        ...k, id: `${k.id}-${i + 1}`, label: `${k.label} ${i + 1}/${parts}`, deals: k.deals.slice(i * 3, i * 3 + 3),
      }))
    })
}

/* ------------------------------------------------------------------ Print primitives (cqw) */

/** A1-style price block: save tag, pack chip, regular price, big dollars with superscript cents + unit. */
function PriceBlock({ o, size = 13, align = 'left' }: { o: Offer; size?: number; align?: 'left' | 'right' }) {
  const p = productBySku(o.sku)!
  const [d, cents] = o.offerPrice.toFixed(2).split('.')
  return (
    <Stack alignItems={align === 'left' ? 'flex-start' : 'flex-end'} sx={{ gap: '.7cqw' }}>
      <Stack direction="row" sx={{ gap: '1cqw' }}>
        <Box sx={{ bgcolor: c.red, color: '#fff', fontWeight: 900, fontSize: `${size * 0.2}cqw`, px: '1.2cqw', py: '.2cqw', borderRadius: '.6cqw' }}>SAVE {money(o.regular - o.offerPrice).replace('.00', '')}</Box>
        <Box sx={{ bgcolor: '#2F6FDB', color: '#fff', fontWeight: 700, fontSize: `${size * 0.17}cqw`, px: '1.2cqw', py: '.2cqw', borderRadius: '.6cqw', whiteSpace: 'nowrap' }}>{p.pack}</Box>
      </Stack>
      <Box sx={{ fontSize: `${size * 0.16}cqw`, fontWeight: 700, opacity: 0.85 }}>REG. {money(o.regular)}</Box>
      <Stack direction="row" alignItems="flex-start" sx={{ lineHeight: 0.82, fontWeight: 900, letterSpacing: '-.05em' }}>
        <Box component="span" sx={{ fontSize: `${size}cqw` }}>{d}</Box>
        <Stack sx={{ ml: '.5cqw', mt: `${size * 0.04}cqw` }}>
          <Box component="span" sx={{ fontSize: `${size * 0.42}cqw`, letterSpacing: 0 }}>{cents}</Box>
          <Box component="span" sx={{ fontSize: `${size * 0.16}cqw`, letterSpacing: 0, fontWeight: 700, mt: '.6cqw' }}>{unit(o)}</Box>
        </Stack>
      </Stack>
    </Stack>
  )
}

/** Tappable deal area on the active card. */
function Hot({ o, live, onPick, children, sx }: { o: Offer; live: boolean; onPick: (o: Offer) => void; children: ReactNode; sx?: object }) {
  const p = productBySku(o.sku)
  if (!live) return <Box sx={{ position: 'relative', ...sx }}>{children}</Box>
  return (
    <Box
      component="button"
      type="button"
      onClick={(e: React.MouseEvent) => { e.stopPropagation(); onPick(o) }}
      aria-label={`${p?.name}, ${money(o.offerPrice)}. View deal`}
      sx={{
        appearance: 'none', border: 0, p: 0, m: 0, bgcolor: 'transparent', font: 'inherit', color: 'inherit', textAlign: 'inherit', cursor: 'pointer', display: 'block', width: '100%', position: 'relative',
        '&::after': { content: '""', position: 'absolute', inset: '.6cqw', border: `0.5cqw solid ${c.saffron}`, borderRadius: '1.4cqw', opacity: 0, transition: 'opacity .15s', pointerEvents: 'none' },
        '&:hover::after, &:focus-visible::after': { opacity: 1 }, '&:focus-visible': { outline: 'none' },
        ...sx,
      }}
    >
      {children}
    </Box>
  )
}

const Name = ({ children, size }: { children: ReactNode; size: number }) => (
  <Box sx={{ fontSize: `${size}cqw`, fontWeight: 900, lineHeight: 0.98, letterSpacing: '-.02em', textTransform: 'uppercase', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{children}</Box>
)

/* ------------------------------------------------------------------ Card layouts */

type CardProps = { card: CardDef; wh: string; live: boolean; onPick: (o: Offer) => void; contents: CardDef[] }

function CoverCard({ card, wh, contents }: CardProps) {
  const w = warehouses.find((x) => x.id === wh)!
  const maxOff = Math.max(0, ...card.deals.map(pctOff))
  return (
    <>
      <Box component="img" src={photo(card.photo, 900, 1200)} alt="" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(45,41,125,.55) 0%, rgba(45,41,125,0) 28%, rgba(45,41,125,.45) 50%, rgba(45,41,125,.95) 70%)' }} />
      <Box sx={{ position: 'relative', p: '7cqw', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box component="img" src="/assets/footerLogo.png" alt="MySupreme Cash & Carry" sx={{ width: '30cqw' }} />
          <Box sx={{ width: '24cqw', aspectRatio: '1', borderRadius: '50%', bgcolor: c.saffron, color: c.navyDark, display: 'grid', placeItems: 'center', textAlign: 'center', fontWeight: 900, lineHeight: 0.9, transform: 'rotate(-10deg)', boxShadow: '0 1cqw 3cqw rgba(0,0,0,.4)' }}>
            <Box><Box sx={{ fontSize: '2.8cqw' }}>UP TO</Box><Box sx={{ fontSize: '8.5cqw', letterSpacing: '-.04em' }}>{maxOff}%</Box><Box sx={{ fontSize: '3.4cqw' }}>OFF</Box></Box>
          </Box>
        </Stack>
        <Box sx={{ mt: 'auto' }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: '1.4cqw', fontSize: '3cqw', fontWeight: 800, letterSpacing: '.16em', textTransform: 'uppercase', color: c.saffron }}>
            <WarehouseRounded sx={{ fontSize: '4cqw' }} />{w.name} warehouse
          </Box>
          <Box sx={{ fontSize: '15cqw', fontWeight: 900, lineHeight: 0.86, letterSpacing: '-.05em', textTransform: 'uppercase', mt: '1.6cqw' }}>October<br /><Box component="span" sx={{ color: 'transparent', WebkitTextStroke: `0.4cqw ${c.saffron}` }}>Flyer</Box></Box>
          <Box sx={{ fontSize: '3.2cqw', opacity: 0.85, mt: '2cqw' }}>Oct 1 – 31, 2026 · {card.deals.length} deals for {w.area}</Box>
          <Box sx={{ mt: '5cqw', borderTop: '0.3cqw solid rgba(255,255,255,.25)', pt: '3cqw', display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '4cqw', rowGap: '1.4cqw' }}>
            {contents.map((k, i) => ({ k, n: i + 1 })).filter(({ k }) => k.id !== 'cover' && !/-[2-9]$/.test(k.id)).map(({ k, n }) => (
              <Stack key={k.id} direction="row" sx={{ gap: '1.6cqw', fontSize: '2.9cqw', alignItems: 'baseline', minWidth: 0 }}>
                <Box sx={{ color: c.saffron, fontWeight: 800 }}>{String(n).padStart(2, '0')}</Box>
                <Box sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{k.label.replace(/ \d\/\d$/, '')}</Box>
              </Stack>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  )
}

function FeatureCard({ card, live, onPick }: CardProps) {
  const o = card.deals[0]
  const p = productBySku(o.sku)!
  return (
    <Hot o={o} live={live} onPick={onPick} sx={{ position: 'absolute', inset: 0, bgcolor: '#fff', color: c.ink }}>
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60%' }}>
        <Box component="img" src={dealPhoto(o, 1000)} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <Box sx={{ position: 'absolute', top: '6cqw', left: '6cqw', bgcolor: c.saffron, color: c.navyDark, fontWeight: 900, fontSize: '3cqw', letterSpacing: '.14em', px: '2cqw', py: '.8cqw', transform: 'skew(-8deg)' }}>COVER DEAL</Box>
        <Box sx={{ position: 'absolute', right: '5cqw', bottom: '-9cqw', width: '22cqw', aspectRatio: '1', borderRadius: '50%', bgcolor: c.red, color: '#fff', display: 'grid', placeItems: 'center', textAlign: 'center', fontWeight: 900, lineHeight: 0.9, transform: 'rotate(8deg)', boxShadow: '0 1cqw 3cqw rgba(0,0,0,.25)' }}>
          <Box><Box sx={{ fontSize: '7.4cqw', letterSpacing: '-.04em' }}>-{pctOff(o)}%</Box><Box sx={{ fontSize: '2.6cqw', mt: '.6cqw' }}>THIS MONTH</Box></Box>
        </Box>
      </Box>
      <Box sx={{ position: 'absolute', left: '7cqw', right: '7cqw', top: '64%' }}>
        <Box sx={{ fontSize: '3cqw', fontWeight: 700, color: c.navy, letterSpacing: '.12em', textTransform: 'uppercase' }}>{p.brand}</Box>
        <Box sx={{ mt: '1cqw', mb: '3cqw' }}><Name size={6.4}>{p.name}</Name></Box>
        <Box sx={{ color: c.red }}><PriceBlock o={o} size={17} /></Box>
      </Box>
    </Hot>
  )
}

/** Like a printed flyer panel: a title band over a section photo, then deal rows with the price on the left. */
function StackCard({ card, live, onPick }: CardProps) {
  const rows = card.deals
  return (
    <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', bgcolor: '#FFFDF7', color: c.ink }}>
      <Box sx={{ position: 'relative', height: '24%', flexShrink: 0, overflow: 'hidden' }}>
        <Box component="img" src={photo(card.photo, 900, 400)} alt="" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(45,41,125,.92) 0%, rgba(45,41,125,.55) 60%, rgba(45,41,125,.1))' }} />
        <Box sx={{ position: 'relative', p: '6cqw', pt: '7cqw', color: '#fff' }}>
          <Box sx={{ fontSize: '2.8cqw', fontWeight: 800, letterSpacing: '.18em', textTransform: 'uppercase', color: c.saffron }}>{card.eyebrow}</Box>
          <Box sx={{ fontSize: '9cqw', fontWeight: 900, lineHeight: 0.92, letterSpacing: '-.03em', textTransform: 'uppercase', mt: '1cqw' }}>{card.title}</Box>
        </Box>
      </Box>
      <Stack sx={{ flex: 1, minHeight: 0 }}>
        {rows.map((o, i) => {
          const p = productBySku(o.sku)!
          return (
            <Hot key={o.id} o={o} live={live} onPick={onPick} sx={{ flex: 1, minHeight: 0, borderTop: `0.3cqw solid ${c.line}` }}>
              <Box sx={{ position: 'absolute', inset: 0, bgcolor: i % 2 ? '#F6F1E7' : '#FFFDF7', overflow: 'hidden' }}>
                <Box component="img" src={dealPhoto(o, 600)} alt="" sx={{ position: 'absolute', right: 0, top: 0, width: '58%', height: '100%', objectFit: 'cover', WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, #000 38%)', maskImage: 'linear-gradient(90deg, transparent 0%, #000 38%)' }} />
              </Box>
              <Stack sx={{ position: 'relative', height: '100%', justifyContent: 'center', px: '6cqw', maxWidth: '62%', gap: '1.6cqw' }}>
                <Name size={4.4}>{p.name}</Name>
                <Box sx={{ color: c.red }}><PriceBlock o={o} size={12} /></Box>
              </Stack>
            </Hot>
          )
        })}
      </Stack>
    </Box>
  )
}

/** Chalkboard kitchen menu for bundles, grouped by kit. */
function BoardCard({ card, live, onPick }: CardProps) {
  const kits = [...new Set(card.deals.map((o) => o.note ?? 'Bundle'))]
  return (
    <Box sx={{ position: 'absolute', inset: 0, bgcolor: '#FBF3E6', color: '#431407', backgroundImage: 'radial-gradient(120% 80% at 30% 10%, rgba(255,255,255,.7), transparent 60%), radial-gradient(rgba(124,45,18,.06) 1px, transparent 1px)', backgroundSize: 'auto, 1.2cqw 1.2cqw', p: '7cqw', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ position: 'absolute', inset: '3cqw', border: '0.5cqw solid #7C2D12', borderRadius: '1cqw', boxShadow: 'inset 0 0 0 0.9cqw #FBF3E6, inset 0 0 0 1.1cqw #7C2D12', pointerEvents: 'none' }} />
      <Box sx={{ textAlign: 'center', position: 'relative' }}>
        <Box sx={{ width: '10cqw', mx: 'auto', '& svg': { width: '100% !important', height: 'auto !important' } }}><Crown color="#7C2D12" /></Box>
        <Box sx={{ fontSize: '2.6cqw', letterSpacing: '.32em', textTransform: 'uppercase', color: '#7C2D12', fontWeight: 700, mt: '1.4cqw' }}>Today’s kitchen menu</Box>
        <Box sx={{ fontSize: '8.6cqw', fontWeight: 800, fontStyle: 'italic', lineHeight: 1.02, letterSpacing: '-.02em', mt: '.6cqw' }}>Restaurant Bundles</Box>
      </Box>
      <Stack sx={{ position: 'relative', mt: '4cqw', gap: '3.6cqw', flex: 1, minHeight: 0 }}>
        {kits.map((k) => (
          <Box key={k}>
            <Box sx={{ fontSize: '3.2cqw', fontWeight: 800, letterSpacing: '.14em', textTransform: 'uppercase', color: '#7C2D12', borderBottom: '0.3cqw solid rgba(124,45,18,.3)', pb: '.8cqw', mb: '1cqw' }}>{k}</Box>
            {card.deals.filter((o) => (o.note ?? 'Bundle') === k).map((o) => {
              const p = productBySku(o.sku)!
              return (
                <Hot key={o.id} o={o} live={live} onPick={onPick}>
                  <Stack direction="row" alignItems="baseline" sx={{ py: '1.1cqw' }}>
                    <Box sx={{ fontSize: '3.3cqw', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0, maxWidth: '70%' }}>{p.name}</Box>
                    <Box sx={{ flex: 1, minWidth: '4cqw', borderBottom: '0.45cqw dotted rgba(124,45,18,.45)', mx: '1.4cqw' }} />
                    <Box sx={{ fontSize: '4.4cqw', fontWeight: 900, color: c.red, flexShrink: 0 }}>{money(o.offerPrice)}</Box>
                  </Stack>
                </Hot>
              )
            })}
          </Box>
        ))}
      </Stack>
      <Box sx={{ position: 'relative', textAlign: 'center', fontSize: '2.5cqw', fontStyle: 'italic', opacity: 0.7 }}>Bundle prices apply per item · while kits last</Box>
    </Box>
  )
}

function Card(props: CardProps) {
  const { card } = props
  return (
    <Box sx={{ position: 'relative', width: '100%', aspectRatio: '3 / 4', containerType: 'inline-size', borderRadius: '18px', overflow: 'hidden', bgcolor: '#fff', color: '#fff', textAlign: 'left' }}>
      {card.layout === 'cover' && <CoverCard {...props} />}
      {card.layout === 'feature' && <FeatureCard {...props} />}
      {card.layout === 'stack' && <StackCard {...props} />}
      {card.layout === 'board' && <BoardCard {...props} />}
    </Box>
  )
}

/* ------------------------------------------------------------------ Coverflow carousel */

function Carousel({ cards, wh, active, setActive, onPick }: { cards: CardDef[]; wh: string; active: number; setActive: (i: number) => void; onPick: (o: Offer) => void }) {
  const [playing, setPlaying] = useState(() => !reduced())
  const [hover, setHover] = useState(false)
  const run = playing && !hover
  const n = cards.length
  const startX = useRef<number | null>(null)
  const tabsRef = useRef<HTMLDivElement | null>(null)

  // Keep the current section chip in view as the carousel moves.
  useEffect(() => {
    const list = tabsRef.current
    const tab = list?.children[active] as HTMLElement | undefined
    if (!list || !tab) return
    const left = tab.offsetLeft - list.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2
    list.scrollTo({ left, behavior: reduced() ? 'auto' : 'smooth' })
  }, [active])

  useEffect(() => {
    if (!run) return
    const t = window.setTimeout(() => setActive((active + 1) % n), SLIDE_MS)
    return () => window.clearTimeout(t)
  }, [run, active, n, setActive])

  const goTo = (i: number) => {
    setPlaying(false)
    setActive((i + n) % n)
  }

  return (
    <Box
      role="region"
      aria-roledescription="carousel"
      aria-label="Flyer menu cards"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') goTo(active + 1)
        if (e.key === 'ArrowLeft') goTo(active - 1)
      }}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(true)}
      onPointerLeave={() => setHover(false)}
      sx={{
        position: 'relative', borderRadius: { xs: `${tokens.radius.lg}px`, md: `${tokens.radius.xl}px` }, overflow: 'hidden', bgcolor: c.navyTint, color: c.ink, border: `1px solid ${c.line}`,
        backgroundImage: `radial-gradient(55% 50% at 50% 40%, rgba(255,255,255,.95), transparent 72%), radial-gradient(70% 50% at 50% 115%, rgba(213,0,0,.10), transparent 70%), radial-gradient(rgba(45,41,125,.08) 1px, transparent 1px)`,
        backgroundSize: 'auto, auto, 18px 18px',
        pt: { xs: 2.5, md: 4 }, pb: { xs: 2, md: 3 }, '&:focus-visible': { outline: `3px solid ${c.navy}`, outlineOffset: 3 },
        '--w': { xs: 'min(78vw, 360px)', md: 'min(440px, calc((100vh - 260px) * .75))' },
        '--step': { xs: 'calc(var(--w) * 1.02)', md: 'calc(var(--w) * .8)' },
      }}
    >
      {/* Stage */}
      <Box
        onPointerDown={(e) => { startX.current = e.clientX }}
        onPointerUp={(e) => {
          if (startX.current === null) return
          const dx = e.clientX - startX.current
          startX.current = null
          if (Math.abs(dx) > 45) goTo(active + (dx < 0 ? 1 : -1))
        }}
        sx={{ position: 'relative', height: 'calc(var(--w) * 4 / 3)', perspective: '1800px', touchAction: 'pan-y' }}
      >
        {cards.map((card, i) => {
          // Shortest way round so the last card sits to the left of the first.
          let d = i - active
          if (d > n / 2) d -= n
          if (d < -n / 2) d += n
          const ad = Math.abs(d)
          const isActive = d === 0
          return (
            <Box
              key={card.id}
              aria-hidden={!isActive}
              sx={{
                position: 'absolute', top: 0, left: '50%', width: 'var(--w)', zIndex: 20 - ad,
                transform: `translateX(calc(-50% + ${d} * var(--step))) translateZ(${-ad * 140}px) rotateY(${d === 0 ? 0 : d < 0 ? 32 : -32}deg)`,
                transition: reduced() ? 'none' : 'transform .65s cubic-bezier(.3,.7,.2,1), opacity .65s, filter .65s',
                filter: isActive ? 'none' : 'brightness(.92) saturate(.85)', opacity: ad > 2 ? 0 : isActive ? 1 : 0.8,
                boxShadow: isActive ? '0 34px 60px -28px rgba(27,25,80,.5), 0 0 0 1px rgba(17,24,39,.06)' : '0 18px 36px -20px rgba(27,25,80,.4)',
                borderRadius: '18px', pointerEvents: ad > 2 ? 'none' : 'auto',
                WebkitBoxReflect: { md: 'below 10px linear-gradient(transparent 85%, rgba(255,255,255,.35))' },
              }}
            >
              <Card card={card} wh={wh} live={isActive} onPick={onPick} contents={cards} />
            </Box>
          )
        })}
        {/* Side cards are one big click target each, so their prices are not tappable until centred. */}
        {[-1, 1].map((s) => (
          <Box
            key={s}
            component="button"
            type="button"
            aria-label={s < 0 ? 'Previous card' : 'Next card'}
            onClick={() => goTo(active + s)}
            sx={{ position: 'absolute', top: 0, bottom: 0, zIndex: 30, border: 0, p: 0, bgcolor: 'transparent', cursor: 'pointer', [s < 0 ? 'left' : 'right']: 0, width: 'calc(50% - var(--w) / 2)' }}
          />
        ))}
        {[-1, 1].map((s) => (
          <IconButton
            key={`a${s}`}
            aria-label={s < 0 ? 'Previous card' : 'Next card'}
            onClick={() => goTo(active + s)}
            sx={{
              display: { xs: 'none', md: 'inline-flex' }, position: 'absolute', top: '50%', zIndex: 31, transform: 'translateY(-50%)', [s < 0 ? 'left' : 'right']: 24,
              width: 56, height: 56, bgcolor: '#fff', color: c.navy, boxShadow: tokens.shadow.pop, '&:hover': { bgcolor: c.saffron },
            }}
          >
            {s < 0 ? <ChevronLeftRounded fontSize="large" /> : <ChevronRightRounded fontSize="large" />}
          </IconButton>
        ))}
      </Box>

      {/* Contents chips with autoplay progress */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: { xs: 2.5, md: 5 }, px: { xs: 2, md: 4 } }}>
        <IconButton aria-label={playing ? 'Pause slideshow' : 'Play slideshow'} onClick={() => setPlaying((v) => !v)} sx={{ color: '#fff', bgcolor: c.navy, flexShrink: 0, '&:hover': { bgcolor: c.navyDark } }}>
          {playing ? <PauseRounded /> : <PlayArrowRounded />}
        </IconButton>
        <Stack direction="row" spacing={1} className="no-scrollbar" role="tablist" aria-label="Flyer sections" ref={tabsRef} sx={{ overflowX: 'auto', flex: 1, py: 0.5, '& > :first-of-type': { ml: 'auto' }, '& > :last-of-type': { mr: 'auto' } }}>
          {cards.map((k, i) => {
            const on = i === active
            return (
              <Box
                key={k.id}
                component="button"
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => goTo(i)}
                sx={{
                  position: 'relative', overflow: 'hidden', flexShrink: 0, minHeight: 44, px: 1.75, borderRadius: 999, cursor: 'pointer', font: 'inherit', fontSize: 13.5, fontWeight: on ? 700 : 500,
                  color: on ? '#fff' : c.ink, bgcolor: on ? c.navy : '#fff', border: `1px solid ${on ? c.navy : c.line}`,
                  '&:hover': { bgcolor: on ? c.navy : c.bg }, '&:focus-visible': { outline: `2px solid ${c.navy}`, outlineOffset: 2 },
                }}
              >
                <Box component="span" sx={{ color: on ? c.saffron : c.red, fontWeight: 800, mr: 0.75 }}>{String(i + 1).padStart(2, '0')}</Box>
                {k.label}
                {on && (
                  <Box
                    key={`${active}-${run}`}
                    aria-hidden
                    sx={{
                      position: 'absolute', left: 0, bottom: 0, height: 3, bgcolor: c.saffron, width: run ? '100%' : 0,
                      animation: run ? `cardProgress ${SLIDE_MS}ms linear` : 'none', '@keyframes cardProgress': { from: { width: 0 }, to: { width: '100%' } },
                    }}
                  />
                )}
              </Box>
            )
          })}
        </Stack>
      </Stack>
      <Stack direction="row" spacing={0.75} alignItems="center" justifyContent="center" sx={{ mt: 1.5, fontSize: 12.5, color: c.text2 }}>
        <TouchAppRounded sx={{ fontSize: 16 }} />
        <span>Swipe or use ← → · tap any price to add it to your cart</span>
      </Stack>
    </Box>
  )
}

/* ------------------------------------------------------------------ Deal panel (opens from a tapped price) */

function DealPanel({ o, wh, onClose }: { o: Offer | null; wh: string; onClose: () => void }) {
  const desktop = useMediaQuery(useTheme().breakpoints.up('md'))
  const p = o ? productBySku(o.sku) : undefined
  const whName = warehouses.find((w) => w.id === wh)?.name
  const fmt = (d: string) => new Date(d + 'T12:00:00').toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })
  return (
    <Drawer
      anchor={desktop ? 'right' : 'bottom'}
      open={!!o}
      onClose={onClose}
      PaperProps={{ sx: { width: { md: 420 }, maxHeight: { xs: '90vh', md: 'none' }, borderRadius: { xs: `${tokens.radius.lg}px ${tokens.radius.lg}px 0 0`, md: 0 } } }}
    >
      {o && p && (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Box sx={{ fontSize: 12, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#fff', bgcolor: c.navy, px: 1.25, py: 0.5, borderRadius: 999 }}>{o.note ?? o.deal}</Box>
            <IconButton aria-label="Close" onClick={onClose}><CloseRounded /></IconButton>
          </Stack>
          <Box sx={{ position: 'relative', borderRadius: `${tokens.radius.md}px`, overflow: 'hidden', aspectRatio: '4 / 3', bgcolor: c.surface2 }}>
            <Box component="img" src={dealPhoto(o, 800)} alt={p.name} sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <Box sx={{ position: 'absolute', top: 12, left: 12, bgcolor: c.red, color: '#fff', fontWeight: 800, fontSize: 13, px: 1, py: 0.25, borderRadius: `${tokens.radius.xs}px` }}>SAVE {money(o.regular - o.offerPrice)}</Box>
          </Box>
          <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: c.navy, mt: 2 }}>{p.brand}</Typography>
          <Typography variant="h4" component="h2" sx={{ fontSize: 19, mt: 0.25 }}>{p.name}</Typography>
          <Box sx={{ mt: 1 }}><PackChip pack={p.pack} size="sm" /></Box>
          <Stack direction="row" alignItems="baseline" spacing={1.25} sx={{ mt: 2 }}>
            <Typography sx={{ fontSize: 30, fontWeight: 800, color: c.red, letterSpacing: '-.02em', lineHeight: 1 }}>{money(o.offerPrice)}</Typography>
            <Typography sx={{ fontSize: 15, color: c.text3, textDecoration: 'line-through' }}>{money(o.regular)}</Typography>
            <Typography sx={{ fontSize: 13.5, color: c.successText, fontWeight: 700 }}>−{pctOff(o)}%</Typography>
          </Stack>
          <Typography sx={{ fontSize: 13, color: c.text2, mt: 1 }}>Valid {fmt(o.from)} – {fmt(o.to)} at {whName}</Typography>
          <Box sx={{ mt: 2.5 }}>
            <AddToCart product={{ ...p, price: o.offerPrice, regular: o.regular, groupPrice: undefined }} size="lg" />
          </Box>
          <Button fullWidth component={RouterLink} to={`/p/${p.slug}`} sx={{ mt: 1, minHeight: 44, color: c.navy }}>Product details</Button>
        </Box>
      )}
    </Drawer>
  )
}

/* ------------------------------------------------------------------ Page */

export default function FlyerMenuCards() {
  const { toast } = useApp()
  const [wh, setWh] = useState('mis')
  const [active, setActive] = useState(0)
  const [picked, setPicked] = useState<Offer | null>(null)
  const cards = useMemo(() => buildCards(wh), [wh])
  const counts = useMemo(() => Object.fromEntries(warehouses.map((w) => [w.id, buildCards(w.id)[0].deals.length])), [])

  return (
    <Container>
      <Box sx={{ pt: { xs: 2, md: 3 }, pb: { xs: 2, md: 2.5 } }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'flex-end' }} spacing={2}>
          <Box>
            <Typography variant="h1" sx={{ fontSize: { xs: 28, md: 40 } }}>Flyers &amp; Offers</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.75 }}>Your warehouse’s October flyer, one card at a time. Tap any price to add it to your cart.</Typography>
          </Box>
          <Stack direction="row" sx={{ bgcolor: '#fff', border: `1px solid ${c.line}`, borderRadius: 999, p: 0.5, alignSelf: { xs: 'flex-start', md: 'auto' }, maxWidth: '100%', overflowX: 'auto' }} className="no-scrollbar" aria-label="Flyer view">
            <Button component={RouterLink} to="/flyers-offers" startIcon={<ViewModuleRounded />} sx={{ borderRadius: 999, px: 1.75, minHeight: 44, color: c.text2, flexShrink: 0 }}>Grid</Button>
            <Button component={RouterLink} to="/flyers-offers/brochure" startIcon={<AutoStoriesRounded />} sx={{ borderRadius: 999, px: 1.75, minHeight: 44, color: c.text2, flexShrink: 0 }}>Flip-book</Button>
            <Button aria-current="page" startIcon={<ViewCarouselRounded />} sx={{ borderRadius: 999, px: 1.75, minHeight: 44, bgcolor: c.navy, color: '#fff', flexShrink: 0, '&:hover': { bgcolor: c.navyDark } }}>Menu cards</Button>
          </Stack>
        </Stack>
      </Box>

      {/* One flyer per warehouse */}
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} spacing={1.5} sx={{ mb: { xs: 2, md: 2.5 } }}>
        <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: c.text2, flexShrink: 0 }}>Flyer for</Typography>
        <Box role="radiogroup" aria-label="Choose your warehouse" sx={{ display: 'grid', gap: 1, gridTemplateColumns: 'repeat(3, minmax(0,1fr))', flex: { sm: 1 }, maxWidth: { sm: 640 } }}>
          {warehouses.map((w) => {
            const on = w.id === wh
            return (
              <Box
                key={w.id}
                component="button"
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => { setWh(w.id); setActive(0) }}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1, p: 1, pr: 1.25, minHeight: 52, cursor: 'pointer', font: 'inherit', textAlign: 'left', borderRadius: `${tokens.radius.md}px`, bgcolor: '#fff',
                  border: `2px solid ${on ? c.navy : c.line}`, boxShadow: on ? `0 0 0 4px ${c.navyTint}` : 'none', '&:focus-visible': { outline: `3px solid ${c.navy}`, outlineOffset: 2 },
                }}
              >
                <Box sx={{ width: 34, height: 34, borderRadius: `${tokens.radius.sm}px`, display: { xs: 'none', md: 'grid' }, placeItems: 'center', bgcolor: on ? c.navy : c.navyTint, color: on ? '#fff' : c.navy, flexShrink: 0 }}>
                  <WarehouseRounded sx={{ fontSize: 19 }} />
                </Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>{w.name}</Typography>
                  <Typography sx={{ fontSize: 12, color: c.text2 }}>{counts[w.id]} deals</Typography>
                </Box>
                {on && <CheckCircleRounded sx={{ color: c.navy, fontSize: 20, display: { xs: 'none', sm: 'block' } }} />}
              </Box>
            )
          })}
        </Box>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: { sm: 'auto !important' } }}>
          <NewFeatureTag label="New" note="flyer sections per warehouse on top of offer & warehouse data" />
          <Button size="small" startIcon={<PictureAsPdfOutlined />} onClick={() => toast('The PDF is generated when the flyer is published', 'info')} sx={{ color: c.navy, minHeight: 40 }}>PDF</Button>
        </Stack>
      </Stack>

      <Carousel key={wh} cards={cards} wh={wh} active={active} setActive={setActive} onPick={setPicked} />

      <Box sx={{ height: { xs: 24, md: 40 } }} />
      <DealPanel o={picked} wh={wh} onClose={() => setPicked(null)} />
    </Container>
  )
}
