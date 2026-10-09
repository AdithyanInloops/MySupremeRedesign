import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, IconButton, Switch, Typography } from '@mui/material'
import { tokens, focusRing, pressable } from '../theme'
import { useApp } from '../state/app'
import { dealTypes, money, offers, productBySku, warehouses, type Offer, type Product } from '../data/catalog'
import { endOf } from '../data/format'
import { Crown, EmptyState, HScroll, Pill } from '../components/ui'
import { LiveImage } from '../components/LiveProductCard'
import Burst from '../components/Burst'
import { ACCENT, DealCard, GREEN } from '../cms/OfferBlocks'
import type { Accent } from '../cms/types'
import { BellIcon, BoxIcon, CalendarIcon, ChevronLeftIcon, FlameIcon, MapPinIcon, TagIcon, UtensilsIcon, type IconComponent } from '../components/icons'

const c = tokens.color
type TypeId = 'monthly' | 'weekly' | 'bulk' | 'bundle'
const TYPE_BY_NAME: Record<string, TypeId> = { 'Monthly Flyer': 'monthly', 'Weekly Hot Picks': 'weekly', 'Bulk Saver': 'bulk', 'Restaurant Bundles': 'bundle' }
/** Flyer look per deal type — the offers section's muted pastel greens, same as the CMS flyer blocks. */
const STYLE: Record<TypeId, { accent: Accent; icon: IconComponent }> = {
  weekly: { accent: 'mint', icon: FlameIcon },
  monthly: { accent: 'seafoam', icon: CalendarIcon },
  bulk: { accent: 'pistachio', icon: BoxIcon },
  bundle: { accent: 'sage', icon: UtensilsIcon },
}
type Deal = { offer: Offer; product: Product; type: TypeId; pct: number }

function Countdown({ to }: { to: string }) {
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => { setNow(Date.now()); const t = window.setInterval(() => setNow(Date.now()), 30000); return () => window.clearInterval(t) }, [])
  if (now === null) return null
  const ms = Math.max(0, endOf(to) - now)
  const parts: [number, string][] = [[Math.floor(ms / 864e5), 'days'], [Math.floor((ms % 864e5) / 36e5), 'hrs'], [Math.floor((ms % 36e5) / 6e4), 'min']]
  return (
    <Box role="timer" aria-label={`Weekly hot picks end in ${parts.map(([v, u]) => `${v} ${u}`).join(' ')}`} sx={{ display: 'flex', gap: 0.75 }}>
      {parts.map(([v, u]) => (
        <Box key={u} aria-hidden sx={{ minWidth: 50, py: 0.5, borderRadius: `${tokens.radius.sm}px`, bgcolor: 'rgba(255,255,255,.75)', border: `1px solid ${GREEN.line}`, textAlign: 'center' }}>
          <Box sx={{ fontSize: 20, fontWeight: 800, lineHeight: 1.15, fontVariantNumeric: 'tabular-nums' }}>{String(v).padStart(2, '0')}</Box>
          <Box sx={{ fontSize: 10, color: GREEN.main, textTransform: 'uppercase', letterSpacing: '.08em' }}>{u}</Box>
        </Box>
      ))}
    </Box>
  )
}

/** Flyer poster per deal type — built from live offers, so it follows the selected warehouse. Tap to filter. */
function Poster({ type, deals, onOpen, active }: { type: TypeId; deals: Deal[]; onOpen: () => void; active: boolean }) {
  const s = STYLE[type]
  const a = ACCENT[s.accent]
  const Icon = s.icon
  const max = Math.max(...deals.map((d) => d.pct))
  const light = a.fg !== '#fff'
  return (
    <Box component="button" onClick={onOpen} aria-pressed={active} aria-label={`${dealTypes.find((d) => d.id === type)?.name} flyer, ${deals.length} deals, show them`}
      sx={{ all: 'unset', boxSizing: 'border-box', cursor: 'pointer', position: 'relative', flexShrink: 0, width: 210, aspectRatio: '3 / 4', borderRadius: `${tokens.radius.lg}px`, overflow: 'hidden', background: `repeating-linear-gradient(135deg, ${light ? 'rgba(20,83,45,.05)' : 'rgba(255,255,255,.06)'} 0 10px, transparent 10px 20px), ${a.bg}`, color: a.fg, p: 1.75, display: 'flex', flexDirection: 'column', outline: active ? `3px solid ${GREEN.deep}` : 'none', outlineOffset: 2, ...pressable, ...focusRing }}>
      <Box sx={{ position: 'absolute', right: -14, bottom: 40, opacity: light ? 0.08 : 0.12 }}><Crown size={110} color={light ? GREEN.deep : '#fff'} /></Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: 10.5, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', opacity: 0.9 }}><Icon sx={{ fontSize: 15 }} /> {deals.length} deals</Box>
      <Typography sx={{ fontSize: 23, fontWeight: 800, lineHeight: 1, textTransform: 'uppercase', mt: 0.75, pr: 6, letterSpacing: '-.01em' }}>{dealTypes.find((d) => d.id === type)?.name}</Typography>
      <Typography sx={{ fontSize: 12, lineHeight: 1.4, mt: 1, opacity: 0.88, pr: 1 }}>{dealTypes.find((d) => d.id === type)?.body}</Typography>
      {max > 0 && <Box sx={{ position: 'absolute', top: 12, right: 10 }}><Burst size={60} fill={light ? GREEN.main : '#fff'} color={light ? '#fff' : GREEN.deep}><Box component="span" sx={{ fontSize: 7.5 }}>UP TO</Box><Box component="span" sx={{ fontSize: 16 }}>{max}%</Box></Burst></Box>}
      <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 0.75, position: 'relative' }}>
        {deals.slice(0, 2).map((d) => (
          <Box key={d.offer.id} sx={{ display: 'grid', gridTemplateColumns: '34px minmax(0,1fr) auto', gap: 0.75, alignItems: 'center', bgcolor: '#fff', color: c.ink, borderRadius: `${tokens.radius.sm}px`, p: 0.75 }}>
            <Box sx={{ borderRadius: '6px', overflow: 'hidden', border: `1px solid ${c.line}` }}><LiveImage product={d.product} /></Box>
            <Typography sx={{ fontSize: 10.5, fontWeight: 500, lineHeight: 1.2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{d.product.name}</Typography>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: c.ink }}>{money(d.offer.offerPrice)}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default function Deals() {
  const { warehouse, setWarehouse, notify } = useApp()
  const navigate = useNavigate()
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
      <Box sx={{ color: GREEN.deep, px: 2, pt: 'calc(8px + env(safe-area-inset-top))', pb: 2.5, borderRadius: `0 0 ${tokens.radius.xl}px ${tokens.radius.xl}px`, position: 'relative', overflow: 'hidden', background: `repeating-linear-gradient(135deg, rgba(36,86,61,.035) 0 14px, transparent 14px 28px), ${ACCENT.sage.bg}` }}>
        <IconButton aria-label="Back" onClick={() => ((window.history.state?.idx ?? 0) > 0 ? navigate(-1) : navigate('/'))} sx={{ ml: -1, mb: 0.25, width: 44, height: 44, color: GREEN.deep, '&:hover': { bgcolor: 'rgba(36,86,61,.08)' } }}><ChevronLeftIcon /></IconButton>
        <Typography variant="overline" component="p" sx={{ color: GREEN.deep, opacity: 0.85 }}>Warehouse flyer</Typography>
        <Typography component="h1" sx={{ fontSize: 28, fontWeight: 800, letterSpacing: '-.02em', lineHeight: 1.1 }}>Flyers & Offers</Typography>
        <Typography sx={{ mt: 0.75, fontSize: 14 }}>{deals.length} deals at {wh.name} — save up to <b>{max}%</b></Typography>
        <Box role="radiogroup" aria-label="Your warehouse" sx={{ display: 'flex', gap: 0.75, mt: 1.75, flexWrap: 'wrap' }}>
          <MapPinIcon sx={{ fontSize: 18, color: GREEN.main, alignSelf: 'center' }} />
          {warehouses.map((w) => {
            const on = w.id === warehouse
            return (
              <Box key={w.id} component="button" role="radio" aria-checked={on} title={w.area} onClick={() => setWarehouse(w.id)}
                sx={{ all: 'unset', boxSizing: 'border-box', cursor: 'pointer', minHeight: 36, px: 1.5, display: 'inline-flex', alignItems: 'center', borderRadius: 999, fontSize: 13.5, fontWeight: 600, bgcolor: on ? GREEN.main : 'rgba(255,255,255,.7)', color: on ? '#fff' : GREEN.deep, border: `1px solid ${on ? GREEN.main : GREEN.line}`, '&:focus-visible': { outline: `2px solid ${GREEN.deep}`, outlineOffset: 2 } }}>
                {w.name}
              </Box>
            )
          })}
        </Box>
        {weekly && (
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ fontSize: 12.5, fontWeight: 600, mb: 0.75 }}>Weekly hot picks end in</Typography>
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
              <Pill tone="green" active={type === 'all'} onClick={() => setType('all')}>All ({deals.length})</Pill>
              {dealTypes.map((d) => { const n = byType(d.id as TypeId).length; return n ? <Pill key={d.id} tone="green" icon={STYLE[d.id as TypeId].icon} active={type === d.id} onClick={() => setType(d.id as TypeId)}>{d.name} ({n})</Pill> : null })}
            </Box>
            {type !== 'all' && <Typography sx={{ px: 2, pb: 1.25, fontSize: 13.5, color: c.text2 }}>{dealTypes.find((d) => d.id === type)?.body}</Typography>}
            <Box component="ul" aria-label={`Deals at ${wh.name}`} sx={{ listStyle: 'none', m: 0, px: 2, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 1.25 }}>
              {shown.map((d) => <li key={d.offer.id}><DealCard width="100%" item={{ product: d.product, final: d.offer.offerPrice, regular: d.offer.regular, pct: d.pct, offerId: d.offer.id }} /></li>)}
            </Box>
          </Box>
        </>
      ) : (
        <EmptyState icon={TagIcon} title={`No deals at ${wh.name} right now`} body="New deals start every Monday. Other warehouses may have offers today." />
      )}

      <Box sx={{ px: 2, mt: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, borderRadius: `${tokens.radius.md}px`, bgcolor: '#fff', border: `1px solid ${c.line}` }}>
          <Box sx={{ width: 44, height: 44, borderRadius: `${tokens.radius.sm}px`, bgcolor: GREEN.mint, color: GREEN.deep, display: 'grid', placeItems: 'center', flexShrink: 0 }}><BellIcon /></Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 14.5 }}>Monday deal alerts</Typography>
            <Typography sx={{ fontSize: 12.5, color: c.text3 }}>A push notification when the {wh.name} flyer drops.</Typography>
          </Box>
          <Switch checked={alerts} sx={{ '& .Mui-checked': { color: `${GREEN.main} !important` }, '& .Mui-checked + .MuiSwitch-track': { bgcolor: `${GREEN.main} !important` } }} onChange={(e) => { setAlerts(e.target.checked); notify({ message: e.target.checked ? 'Deal alerts on' : 'Deal alerts off', tone: 'info' }) }} inputProps={{ 'aria-label': 'Monday deal alerts' }} />
        </Box>
      </Box>
    </Box>
  )
}
