import { useEffect, useMemo, useRef, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Box, Switch, Typography } from '@mui/material'
import { tokens, focusRing, pressable } from '../theme'
import { useApp } from '../state/app'
import { dealTypes, money, offers, productBySku, warehouses, type Offer, type Product } from '../data/catalog'
import { dayDate, endOf } from '../data/format'
import { FloatAdd, productPath } from '../components/ProductCard'
import { Crown, EmptyState, HScroll, Pill, ProductImage } from '../components/ui'
import { BellIcon, BoxIcon, CalendarIcon, ClockIcon, FlameIcon, MapPinIcon, TagIcon, UtensilsIcon, type IconComponent } from '../components/icons'

const c = tokens.color
type TypeId = 'monthly' | 'weekly' | 'bulk' | 'bundle'
const TYPE_BY_NAME: Record<string, TypeId> = { 'Monthly Flyer': 'monthly', 'Weekly Hot Picks': 'weekly', 'Bulk Saver': 'bulk', 'Restaurant Bundles': 'bundle' }
/** Flyer colours per deal type, in Concept A's palette (saffron only ever behind ink). */
const STYLE: Record<TypeId, { bg: string; fg: string; icon: IconComponent }> = {
  weekly: { bg: c.red, fg: '#fff', icon: FlameIcon },
  monthly: { bg: c.navy, fg: '#fff', icon: CalendarIcon },
  bulk: { bg: c.saffron, fg: c.ink, icon: BoxIcon },
  bundle: { bg: c.ink, fg: '#fff', icon: UtensilsIcon },
}
type Deal = { offer: Offer; product: Product; type: TypeId; pct: number }

/** Star-shaped price burst (flyer sticker). */
function Burst({ children, size = 54, fill = c.saffron, color = c.ink }: { children: React.ReactNode; size?: number; fill?: string; color?: string }) {
  const pts = Array.from({ length: 32 }, (_, i) => { const r = i % 2 ? 41 : 50; const a = (Math.PI * 2 * i) / 32 - Math.PI / 2; return `${(50 + r * Math.cos(a)).toFixed(1)},${(50 + r * Math.sin(a)).toFixed(1)}` }).join(' ')
  return (
    <Box aria-hidden sx={{ position: 'relative', width: size, height: size, transform: 'rotate(-10deg)', filter: 'drop-shadow(0 3px 6px rgba(17,24,39,.2))' }}>
      <Box component="svg" viewBox="0 0 100 100" sx={{ position: 'absolute', inset: 0 }}><polygon points={pts} fill={fill} /></Box>
      <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color, fontWeight: 800, lineHeight: 1 }}>{children}</Box>
    </Box>
  )
}

function Countdown({ to }: { to: string }) {
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => { setNow(Date.now()); const t = window.setInterval(() => setNow(Date.now()), 30000); return () => window.clearInterval(t) }, [])
  if (now === null) return null
  const ms = Math.max(0, endOf(to) - now)
  const parts: [number, string][] = [[Math.floor(ms / 864e5), 'days'], [Math.floor((ms % 864e5) / 36e5), 'hrs'], [Math.floor((ms % 36e5) / 6e4), 'min']]
  return (
    <Box role="timer" aria-label={`Weekly hot picks end in ${parts.map(([v, u]) => `${v} ${u}`).join(' ')}`} sx={{ display: 'flex', gap: 0.75 }}>
      {parts.map(([v, u]) => (
        <Box key={u} aria-hidden sx={{ minWidth: 50, py: 0.5, borderRadius: `${tokens.radius.sm}px`, bgcolor: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.2)', textAlign: 'center' }}>
          <Box sx={{ fontSize: 20, fontWeight: 800, lineHeight: 1.15, fontVariantNumeric: 'tabular-nums' }}>{String(v).padStart(2, '0')}</Box>
          <Box sx={{ fontSize: 10, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '.08em' }}>{u}</Box>
        </Box>
      ))}
    </Box>
  )
}

function DealCard({ deal }: { deal: Deal }) {
  const s = STYLE[deal.type]
  const Icon = s.icon
  return (
    <Box component="article" aria-label={`${deal.offer.deal}: ${deal.product.name}, ${money(deal.offer.offerPrice)}, ends ${dayDate(deal.offer.to)}`} sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#fff', borderRadius: `${tokens.radius.md}px`, border: `1px solid ${c.line}`, overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1.25, py: 0.5, bgcolor: s.bg, color: s.fg, fontSize: 10.5, fontWeight: 800, letterSpacing: '.06em', textTransform: 'uppercase' }}><Icon sx={{ fontSize: 14 }} /> {deal.offer.deal}</Box>
      <Box sx={{ position: 'relative' }}>
        <Box component={RouterLink} to={productPath(deal.product)} tabIndex={-1} aria-hidden sx={{ display: 'block' }}><ProductImage product={deal.product} ratio="4 / 3" radius={0} caption={false} /></Box>
        {deal.pct > 0 && <Box sx={{ position: 'absolute', top: 6, left: 6 }}><Burst><Box component="span" sx={{ fontSize: 8.5 }}>SAVE</Box><Box component="span" sx={{ fontSize: 15 }}>{deal.pct}%</Box></Burst></Box>}
        <Box sx={{ position: 'absolute', right: 8, bottom: 8 }}><FloatAdd product={deal.product} offerId={deal.offer.id} /></Box>
      </Box>
      <Box component={RouterLink} to={productPath(deal.product)} sx={{ px: 1.25, pt: 0.875, pb: 1.125, display: 'flex', flexDirection: 'column', gap: 0.375, flex: 1, color: 'inherit', textDecoration: 'none', ...focusRing }}>
        <Typography component="h3" sx={{ fontSize: 13, fontWeight: 600, lineHeight: 1.35, minHeight: '2.7em', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{deal.product.name}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, flexWrap: 'wrap' }}>
          <Typography sx={{ fontSize: 17, fontWeight: 800, color: c.red, lineHeight: 1.2, fontVariantNumeric: 'tabular-nums' }}>{money(deal.offer.offerPrice)}</Typography>
          <Typography sx={{ fontSize: 12, color: c.text3, textDecoration: 'line-through' }}>{money(deal.offer.regular)}</Typography>
        </Box>
        <Typography sx={{ mt: 'auto', display: 'flex', alignItems: 'center', gap: 0.5, fontSize: 11.5, color: c.text3, whiteSpace: 'nowrap', overflow: 'hidden' }}>
          <ClockIcon sx={{ fontSize: 13, flexShrink: 0 }} />
          <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{deal.offer.note ? <Box component="span" sx={{ color: c.navy, fontWeight: 600 }}>{deal.offer.note} · </Box> : null}Ends {dayDate(deal.offer.to)}</Box>
        </Typography>
      </Box>
    </Box>
  )
}

/** Flyer poster per deal type — built from live offers, so it follows the selected warehouse. Tap to filter. */
function Poster({ type, deals, onOpen, active }: { type: TypeId; deals: Deal[]; onOpen: () => void; active: boolean }) {
  const s = STYLE[type]
  const Icon = s.icon
  const max = Math.max(...deals.map((d) => d.pct))
  const light = s.fg !== '#fff'
  return (
    <Box component="button" onClick={onOpen} aria-pressed={active} aria-label={`${dealTypes.find((d) => d.id === type)?.name} flyer, ${deals.length} deals, show them`}
      sx={{ all: 'unset', boxSizing: 'border-box', cursor: 'pointer', position: 'relative', flexShrink: 0, width: 210, aspectRatio: '3 / 4', borderRadius: `${tokens.radius.lg}px`, overflow: 'hidden', bgcolor: s.bg, color: s.fg, p: 1.75, display: 'flex', flexDirection: 'column', outline: active ? `3px solid ${c.navy}` : 'none', outlineOffset: 2, backgroundImage: `repeating-linear-gradient(135deg, ${light ? 'rgba(17,24,39,.05)' : 'rgba(255,255,255,.06)'} 0 10px, transparent 10px 20px)`, ...pressable, ...focusRing }}>
      <Box sx={{ position: 'absolute', right: -14, bottom: 40, opacity: light ? 0.08 : 0.12 }}><Crown size={110} color={light ? c.ink : '#fff'} /></Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: 10.5, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', opacity: 0.9 }}><Icon sx={{ fontSize: 15 }} /> {deals.length} deals</Box>
      <Typography sx={{ fontSize: 23, fontWeight: 800, lineHeight: 1, textTransform: 'uppercase', mt: 0.75, pr: 6, letterSpacing: '-.01em' }}>{dealTypes.find((d) => d.id === type)?.name}</Typography>
      <Typography sx={{ fontSize: 12, lineHeight: 1.4, mt: 1, opacity: 0.88, pr: 1 }}>{dealTypes.find((d) => d.id === type)?.body}</Typography>
      {max > 0 && <Box sx={{ position: 'absolute', top: 12, right: 10 }}><Burst size={60} fill={light ? c.red : c.saffron} color={light ? '#fff' : c.ink}><Box component="span" sx={{ fontSize: 7.5 }}>UP TO</Box><Box component="span" sx={{ fontSize: 16 }}>{max}%</Box></Burst></Box>}
      <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 0.75, position: 'relative' }}>
        {deals.slice(0, 2).map((d) => (
          <Box key={d.offer.id} sx={{ display: 'grid', gridTemplateColumns: '34px minmax(0,1fr) auto', gap: 0.75, alignItems: 'center', bgcolor: '#fff', color: c.ink, borderRadius: `${tokens.radius.sm}px`, p: 0.75 }}>
            <ProductImage product={d.product} radius={6} />
            <Typography sx={{ fontSize: 10.5, fontWeight: 500, lineHeight: 1.2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{d.product.name}</Typography>
            <Typography sx={{ fontSize: 13, fontWeight: 800, color: c.red }}>{money(d.offer.offerPrice)}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default function Deals() {
  const { warehouse, setWarehouse, notify } = useApp()
  const [type, setType] = useState<TypeId | 'all'>('all')
  const [alerts, setAlerts] = useState(true)
  const grid = useRef<HTMLDivElement>(null)
  const deals: Deal[] = useMemo(() => offers.filter((o) => o.warehouses.includes(warehouse)).map((o) => {
    const product = productBySku(o.sku)
    return product ? { offer: o, product, type: TYPE_BY_NAME[o.deal] ?? 'monthly', pct: Math.round((1 - o.offerPrice / o.regular) * 100) } : null
  }).filter((d): d is Deal => !!d).sort((a, b) => b.pct - a.pct), [warehouse])
  const byType = (t: TypeId) => deals.filter((d) => d.type === t)
  const shown = deals.filter((d) => type === 'all' || d.type === type)
  const weekly = deals.find((d) => d.type === 'weekly')
  const max = Math.max(0, ...deals.map((d) => d.pct))
  const wh = warehouses.find((w) => w.id === warehouse) ?? warehouses[0]
  const pick = (t: TypeId | 'all') => { setType(t); window.setTimeout(() => grid.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50) }

  return (
    <Box>
      <Box sx={{ bgcolor: c.navy, color: '#fff', px: 2, pt: 'calc(16px + env(safe-area-inset-top))', pb: 2.5, borderRadius: `0 0 ${tokens.radius.xl}px ${tokens.radius.xl}px`, position: 'relative', overflow: 'hidden', backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,.04) 0 14px, transparent 14px 28px)' }}>
        <Typography variant="overline" component="p" sx={{ color: c.saffron }}>Warehouse flyer</Typography>
        <Typography component="h1" sx={{ fontSize: 28, fontWeight: 800, letterSpacing: '-.02em', lineHeight: 1.1 }}>Flyers & Offers</Typography>
        <Typography sx={{ mt: 0.75, fontSize: 14, opacity: 0.85 }}>{deals.length} deals at {wh.name} — save up to <b>{max}%</b></Typography>
        <Box role="radiogroup" aria-label="Your warehouse" sx={{ display: 'flex', gap: 0.75, mt: 1.75, flexWrap: 'wrap' }}>
          <MapPinIcon sx={{ fontSize: 18, color: c.saffron, alignSelf: 'center' }} />
          {warehouses.map((w) => {
            const on = w.id === warehouse
            return (
              <Box key={w.id} component="button" role="radio" aria-checked={on} title={w.area} onClick={() => setWarehouse(w.id)}
                sx={{ all: 'unset', boxSizing: 'border-box', cursor: 'pointer', minHeight: 36, px: 1.5, display: 'inline-flex', alignItems: 'center', borderRadius: 999, fontSize: 13.5, fontWeight: 600, bgcolor: on ? '#fff' : 'rgba(255,255,255,.12)', color: on ? c.navy : '#fff', border: `1px solid ${on ? '#fff' : 'rgba(255,255,255,.3)'}`, '&:focus-visible': { outline: '2px solid #fff', outlineOffset: 2 } }}>
                {w.name}
              </Box>
            )
          })}
        </Box>
        {weekly && (
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ fontSize: 12.5, fontWeight: 600, opacity: 0.9, mb: 0.75 }}>Weekly hot picks end in</Typography>
            <Countdown to={weekly.offer.to} />
          </Box>
        )}
      </Box>

      {deals.length ? (
        <>
          <Box sx={{ mt: 2.5 }}>
            <Typography component="h2" sx={{ px: 2, fontSize: 18, fontWeight: 700, mb: 1.25 }}>This week’s flyers</Typography>
            <HScroll>
              {(Object.keys(STYLE) as TypeId[]).filter((t) => byType(t).length).map((t) => <Poster key={t} type={t} deals={byType(t)} active={type === t} onOpen={() => pick(t)} />)}
            </HScroll>
          </Box>

          <Box ref={grid} sx={{ scrollMarginTop: 8, mt: 3 }}>
            <Box className="no-scrollbar" role="group" aria-label="Deal type" sx={{ display: 'flex', gap: 1, overflowX: 'auto', px: 2, pb: 1.25 }}>
              <Pill active={type === 'all'} onClick={() => setType('all')}>All ({deals.length})</Pill>
              {dealTypes.map((d) => { const n = byType(d.id as TypeId).length; return n ? <Pill key={d.id} icon={STYLE[d.id as TypeId].icon} active={type === d.id} onClick={() => setType(d.id as TypeId)}>{d.name} ({n})</Pill> : null })}
            </Box>
            {type !== 'all' && <Typography sx={{ px: 2, pb: 1.25, fontSize: 13.5, color: c.text2 }}>{dealTypes.find((d) => d.id === type)?.body}</Typography>}
            <Box component="ul" aria-label={`Deals at ${wh.name}`} sx={{ listStyle: 'none', m: 0, px: 2, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 1.25 }}>
              {shown.map((d) => <li key={d.offer.id}><DealCard deal={d} /></li>)}
            </Box>
          </Box>
        </>
      ) : (
        <EmptyState icon={TagIcon} title={`No deals at ${wh.name} right now`} body="New deals start every Monday. Other warehouses may have offers today." />
      )}

      <Box sx={{ px: 2, mt: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, borderRadius: `${tokens.radius.md}px`, bgcolor: '#fff', border: `1px solid ${c.line}` }}>
          <Box sx={{ width: 44, height: 44, borderRadius: `${tokens.radius.sm}px`, bgcolor: c.saffronTint, color: '#8A5A00', display: 'grid', placeItems: 'center', flexShrink: 0 }}><BellIcon /></Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 14.5 }}>Monday deal alerts</Typography>
            <Typography sx={{ fontSize: 12.5, color: c.text3 }}>A push notification when the {wh.name} flyer drops.</Typography>
          </Box>
          <Switch checked={alerts} onChange={(e) => { setAlerts(e.target.checked); notify({ message: e.target.checked ? 'Deal alerts on' : 'Deal alerts off', tone: 'info' }) }} inputProps={{ 'aria-label': 'Monday deal alerts' }} />
        </Box>
      </Box>
    </Box>
  )
}
