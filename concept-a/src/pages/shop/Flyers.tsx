import { useMemo, useState } from 'react'
import { Box, Button, Chip, InputBase, Stack, Tab, Tabs, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import MenuBookRounded from '@mui/icons-material/MenuBookRounded'
import LocalFireDepartmentRounded from '@mui/icons-material/LocalFireDepartmentRounded'
import Inventory2Rounded from '@mui/icons-material/Inventory2Rounded'
import RestaurantRounded from '@mui/icons-material/RestaurantRounded'
import WarehouseRounded from '@mui/icons-material/WarehouseRounded'
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded'
import EventRounded from '@mui/icons-material/EventRounded'
import NotificationsActiveRounded from '@mui/icons-material/NotificationsActiveRounded'
import LocalOfferRounded from '@mui/icons-material/LocalOfferRounded'
import PictureAsPdfOutlined from '@mui/icons-material/PictureAsPdfOutlined'
import LockClockRounded from '@mui/icons-material/LockClockRounded'
import SearchOffRounded from '@mui/icons-material/SearchOffRounded'
import { tokens } from '../../theme'
import { dealTypes, money, offers, productBySku, warehouses, type Offer } from '../../data/catalog'
import { useApp } from '../../state/AppState'
import { Container, EmptyState, NewFeatureTag, PackChip, SectionHeader, Sku } from '../../components/ui'
import { AddToCart, ProductCardSkeleton } from '../../components/Commerce'
import { ProductImage } from '../../components/Brand'
import { Breadcrumbs } from '../../components/Shared'
import { FlipText } from './home/FlipBoard'

const c = tokens.color
const TODAY = new Date('2026-10-06T12:00:00')
const dealIcon: Record<string, typeof MenuBookRounded> = { monthly: MenuBookRounded, weekly: LocalFireDepartmentRounded, bulk: Inventory2Rounded, bundle: RestaurantRounded }
const dealColor: Record<string, { bg: string; fg: string }> = {
  'Monthly Flyer': { bg: c.navy, fg: '#fff' },
  'Weekly Hot Picks': { bg: c.red, fg: '#fff' },
  'Bulk Saver': { bg: '#0F5132', fg: '#fff' },
  'Restaurant Bundles': { bg: '#7C2D12', fg: '#fff' },
}

const fmt = (d: string) => new Date(d + 'T12:00:00').toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })
const daysLeft = (to: string) => Math.max(0, Math.ceil((new Date(to + 'T23:59:59').getTime() - TODAY.getTime()) / 86400000))

/* ------------------------------------------------------------------ Warehouse picker */

function WarehousePicker({ value, onChange, counts }: { value: string; onChange: (id: string) => void; counts?: Record<string, number> }) {
  return (
    <Box role="radiogroup" aria-label="Choose your warehouse" sx={{ display: 'grid', gap: 1.25, gridTemplateColumns: { xs: 'minmax(0,1fr)', sm: 'repeat(3, minmax(0,1fr))' } }}>
      {warehouses.map((w) => {
        const on = w.id === value
        return (
          <Box
            key={w.id}
            role="radio"
            aria-checked={on}
            tabIndex={0}
            onClick={() => onChange(w.id)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onChange(w.id))}
            sx={{
              display: 'flex', alignItems: 'center', gap: 1.5, p: 1.75, cursor: 'pointer', borderRadius: `${tokens.radius.md}px`, bgcolor: '#fff',
              border: `2px solid ${on ? c.navy : c.line}`, boxShadow: on ? `0 0 0 4px ${c.navyTint}` : 'none', transition: 'all .15s',
              '&:hover': { borderColor: on ? c.navy : c.line2 }, '&:focus-visible': { outline: `3px solid ${c.navy}`, outlineOffset: 2 },
            }}
          >
            <Box sx={{ width: 44, height: 44, borderRadius: `${tokens.radius.sm}px`, display: 'grid', placeItems: 'center', bgcolor: on ? c.navy : c.navyTint, color: on ? '#fff' : c.navy, flexShrink: 0 }}>
              <WarehouseRounded />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 15 }}>{w.name}</Typography>
              <Typography sx={{ fontSize: 12.5, color: c.text2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.area}</Typography>
            </Box>
            {counts ? (
              <Box sx={{ fontSize: 12, fontWeight: 700, color: on ? c.navy : c.text2, bgcolor: on ? c.navyTint : c.surface2, px: 1, py: 0.25, borderRadius: 999, flexShrink: 0 }}>{counts[w.id] ?? 0} deals</Box>
            ) : on ? <CheckCircleRounded sx={{ color: c.navy }} /> : null}
          </Box>
        )
      })}
    </Box>
  )
}

/* ------------------------------------------------------------------ Offer card (live) */

function OfferCard({ o }: { o: Offer }) {
  const p = productBySku(o.sku)
  if (!p) return null
  const off = Math.round((1 - o.offerPrice / o.regular) * 100)
  const left = daysLeft(o.to)
  const col = dealColor[o.deal] ?? dealColor['Monthly Flyer']
  // Offer price overrides catalog price for this card's add-to-cart.
  const offerProduct = { ...p, price: o.offerPrice, regular: o.regular, groupPrice: undefined }
  return (
    <Box
      component="article"
      aria-label={`${p.name}, ${p.pack}, offer ${money(o.offerPrice)}, regular ${money(o.regular)}`}
      sx={{
        position: 'relative', display: 'flex', flexDirection: 'column', bgcolor: '#fff', border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.lg}px`, overflow: 'hidden',
        transition: 'box-shadow .2s, transform .2s', '&:hover': { boxShadow: tokens.shadow.hover, transform: 'translateY(-2px)' },
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 1.75, py: 1, bgcolor: col.bg, color: col.fg }}>
        <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}>{o.deal}</Typography>
        {o.note && <Box sx={{ fontSize: 11.5, fontWeight: 700, bgcolor: 'rgba(255,255,255,.18)', px: 1, borderRadius: 999 }}>{o.note}</Box>}
      </Stack>
      <Box sx={{ display: { xs: 'grid', sm: 'flex' }, flexDirection: 'column', gridTemplateColumns: '112px minmax(0,1fr)', flex: 1, columnGap: 0.5 }}>
      <Box sx={{ p: 1.5, position: 'relative' }}>
        <Box sx={{ position: 'absolute', top: { xs: 10, sm: 20 }, left: { xs: 10, sm: 20 }, zIndex: 1, bgcolor: c.saffron, color: c.navyDark, fontWeight: 800, fontSize: { xs: 12, sm: 15 }, px: { xs: 0.75, sm: 1.25 }, py: 0.5, borderRadius: `${tokens.radius.sm}px`, boxShadow: tokens.shadow.card }}>
          −{off}%
        </Box>
        <Box component={RouterLink} to={`/p/${p.slug}`} tabIndex={-1} aria-hidden sx={{ display: 'block' }}>
          <ProductImage src={p.images[0]} alt={p.name} brand={p.brand} />
        </Box>
      </Box>
      <Box sx={{ px: { xs: 0.5, sm: 1.75 }, pr: 1.75, pt: { xs: 1.5, sm: 0 }, pb: 1.75, display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: c.navy }}>{p.brand}</Typography>
        <Box component={RouterLink} to={`/p/${p.slug}`} title={p.name}
          sx={{ color: c.ink, textDecoration: 'none', fontWeight: 600, fontSize: 14, lineHeight: 1.4, minHeight: '2.8em', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', '&:hover': { color: c.red } }}>
          {p.name}
        </Box>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.75, minWidth: 0 }}>
          <PackChip pack={p.pack} size="sm" />
          <Box sx={{ minWidth: 0 }}><Sku sku={p.sku} /></Box>
        </Stack>
        <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mt: 1.5 }}>
          <Typography sx={{ fontSize: 26, fontWeight: 800, color: c.red, letterSpacing: '-.02em', lineHeight: 1 }}>{money(o.offerPrice)}</Typography>
          <Typography sx={{ fontSize: 14, color: c.text3, textDecoration: 'line-through' }}>{money(o.regular)}</Typography>
        </Stack>
        <Typography sx={{ fontSize: 12.5, color: c.successText, fontWeight: 600, mt: 0.5 }}>You save {money(o.regular - o.offerPrice)}{o.note?.includes('case') ? ' per case' : ''}</Typography>
        <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 1.25, fontSize: 12.5, color: c.text2 }}>
          <EventRounded sx={{ fontSize: 16, display: { xs: 'none', sm: 'block' } }} />
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' }, whiteSpace: 'nowrap' }}>{fmt(o.from)} – {fmt(o.to)}</Box>
          <Box component="span" sx={{ ml: { xs: '0 !important', sm: 'auto !important' }, fontWeight: 700, color: left <= 6 ? c.red : c.navy, bgcolor: left <= 6 ? c.redTint : c.navyTint, px: 1, borderRadius: 999, whiteSpace: 'nowrap' }}>
            {left === 0 ? 'Ends today' : `Ends in ${left} day${left === 1 ? '' : 's'}`}
          </Box>
        </Stack>
        <Box sx={{ mt: 'auto', pt: 1.75 }}>
          <AddToCart product={offerProduct} size="sm" />
        </Box>
      </Box>
      </Box>
    </Box>
  )
}

/* ------------------------------------------------------------------ Live flyer */

function LiveFlyer({ wh, setWh }: { wh: string; setWh: (id: string) => void }) {
  const { review } = useApp()
  const [deal, setDeal] = useState<string>('All')
  const whName = warehouses.find((w) => w.id === wh)!
  const inWh = review.empty ? [] : offers.filter((o) => o.warehouses.includes(wh))
  const list = deal === 'All' ? inWh : inWh.filter((o) => o.deal === deal)
  const counts = useMemo(() => Object.fromEntries(warehouses.map((w) => [w.id, review.empty ? 0 : offers.filter((o) => o.warehouses.includes(w.id)).length])), [review.empty])
  const endMonthly = daysLeft('2026-10-31')

  return (
    <Stack spacing={{ xs: 3, md: 4 }}>
      {/* Flyer hero */}
      <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: `${tokens.radius.xl}px`, bgcolor: c.navyDark, color: '#fff', p: { xs: 3, md: 5 }, display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1.5fr 1fr' }, alignItems: 'center' }}>
        <Box sx={{ position: 'absolute', inset: 0, background: `radial-gradient(60% 120% at 100% 0%, rgba(213,0,0,.55), transparent 60%)` }} />
        <Box sx={{ position: 'relative' }}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
            <Typography variant="overline" sx={{ color: c.saffron }}>October 2026 flyer · {whName.name}</Typography>
            <NewFeatureTag note="offers (deal type, offer price, valid from/to) and warehouses" sx={{ bgcolor: 'rgba(255,255,255,.12)', color: '#fff', borderColor: 'rgba(255,255,255,.4)' }} />
          </Stack>
          <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 30, md: 46 }, lineHeight: 1.05, letterSpacing: '-.02em', mt: 1 }}>
            Warehouse prices, locked in for your kitchen.
          </Typography>
          <Typography sx={{ mt: 1.5, opacity: 0.85, maxWidth: 520 }}>
            {inWh.length} live deals for {whName.area}. Prices apply online, in the app and at the cash &amp; carry counter.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 3 }}>
            <Button variant="contained" size="large" startIcon={<LocalOfferRounded />} onClick={() => document.getElementById('offer-grid')?.scrollIntoView({ behavior: 'smooth' })} sx={{ bgcolor: '#fff', color: c.red, '&:hover': { bgcolor: c.redTint } }}>
              Shop {inWh.length} deals
            </Button>
            <Button variant="outlined" size="large" startIcon={<PictureAsPdfOutlined />} sx={{ color: '#fff', borderColor: 'rgba(255,255,255,.5)', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,.08)' } }}>
              Download flyer (PDF)
            </Button>
          </Stack>
        </Box>
        <Box sx={{ position: 'relative', justifySelf: { md: 'end' }, textAlign: { md: 'right' } }}>
          <Typography sx={{ fontSize: 13, opacity: 0.8, mb: 1 }}>Monthly flyer ends in</Typography>
          <FlipText text={`${endMonthly} DAYS`} size={30} />
          <Typography sx={{ fontSize: 13, opacity: 0.8, mt: 1.5 }}>Weekly Hot Picks refresh every Monday</Typography>
        </Box>
      </Box>

      <Box>
        <Typography variant="h5" component="h2" sx={{ mb: 1.5 }}>Your warehouse</Typography>
        <WarehousePicker value={wh} onChange={setWh} counts={counts} />
      </Box>

      <Box id="offer-grid" sx={{ scrollMarginTop: { xs: 150, md: 190 } }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ md: 'center' }} sx={{ mb: 2.5 }}>
          <Typography variant="h3" component="h2">{list.length} {deal === 'All' ? 'deals' : deal} in {whName.name}</Typography>
          <Stack direction="row" gap={1} className="no-scrollbar" sx={{ overflowX: 'auto', mx: { xs: -2, md: 0 }, px: { xs: 2, md: 0 } }} role="group" aria-label="Filter by deal type">
            {['All', ...dealTypes.map((d) => d.name)].map((d) => {
              const n = d === 'All' ? inWh.length : inWh.filter((o) => o.deal === d).length
              const on = deal === d
              return (
                <Chip
                  key={d}
                  label={`${d} · ${n}`}
                  onClick={() => setDeal(d)}
                  aria-pressed={on}
                  sx={{
                    height: 44, px: 0.5, flexShrink: 0, fontSize: 13.5, bgcolor: on ? c.navy : '#fff', color: on ? '#fff' : c.ink,
                    border: `1px solid ${on ? c.navy : c.line}`, '&:hover': { bgcolor: on ? c.navyDark : c.bg },
                  }}
                />
              )
            })}
          </Stack>
        </Stack>
        {review.loading ? (
          <Box sx={{ display: 'grid', gap: { xs: 1.25, md: 2 }, gridTemplateColumns: { xs: 'repeat(2, minmax(0,1fr))', md: 'repeat(3, minmax(0,1fr))', lg: 'repeat(4, minmax(0,1fr))' } }}>
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </Box>
        ) : list.length === 0 ? (
          <Box sx={{ bgcolor: '#fff', border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.xl}px` }}>
            <EmptyState
              icon={<SearchOffRounded />}
              title={review.empty ? 'No live offers right now' : `No ${deal} deals at ${whName.name} this week`}
              body={review.empty ? 'The next flyer drops on the 1st. Get a heads-up by email or WhatsApp the moment it goes live.' : 'Try another deal type or warehouse — Bulk Saver pricing also applies automatically at checkout.'}
              action={review.empty ? 'Notify me' : 'Show all deals'}
              onAction={() => setDeal('All')}
              secondary={<Button component={RouterLink} to="/all-categories" variant="outlined" size="large">Browse all products</Button>}
            />
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gap: { xs: 1.25, md: 2 }, gridTemplateColumns: { xs: 'minmax(0,1fr)', sm: 'repeat(2, minmax(0,1fr))', md: 'repeat(3, minmax(0,1fr))', lg: 'repeat(4, minmax(0,1fr))' } }}>
            {list.map((o) => <OfferCard key={o.id} o={o} />)}
          </Box>
        )}
      </Box>
    </Stack>
  )
}

/* ------------------------------------------------------------------ Coming soon (today's page, redesigned) */

function NotifyForm({ dark }: { dark?: boolean }) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'error' | 'done'>('idle')
  if (state === 'done')
    return (
      <Stack direction="row" spacing={1} alignItems="center" role="status" sx={{ color: dark ? '#fff' : c.successText, fontWeight: 600 }}>
        <CheckCircleRounded sx={{ color: c.success }} /> <span>You’re on the list — we’ll email {email} when the first flyer drops.</span>
      </Stack>
    )
  return (
    <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); setState(/^\S+@\S+\.\S+$/.test(email) ? 'done' : 'error') }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
        <InputBase
          value={email}
          onChange={(e) => { setEmail(e.target.value); setState('idle') }}
          placeholder="you@restaurant.ca"
          type="email"
          inputProps={{ 'aria-label': 'Email for flyer alerts', 'aria-invalid': state === 'error', 'aria-describedby': 'notify-help' }}
          sx={{ flex: 1, height: 52, px: 2, bgcolor: '#fff', borderRadius: `${tokens.radius.sm}px`, border: `2px solid ${state === 'error' ? c.error : 'transparent'}`, fontSize: 15 }}
        />
        <Button type="submit" variant="contained" size="large" startIcon={<NotificationsActiveRounded />} sx={{ height: 52 }}>Notify me</Button>
      </Stack>
      <Typography id="notify-help" sx={{ fontSize: 12.5, mt: 1, color: state === 'error' ? (dark ? '#FFC9C4' : c.error) : dark ? 'rgba(255,255,255,.7)' : c.text3 }}>
        {state === 'error' ? 'Enter a valid email address, e.g. orders@spiceroute.ca' : 'One email per flyer. Unsubscribe anytime.'}
      </Typography>
    </Box>
  )
}

function ComingSoon({ wh, setWh }: { wh: string; setWh: (id: string) => void }) {
  const rows = [
    { deal: 'MONTHLY FLYER', dept: 'ALL DEPTS', status: 'BOARDING NOV 1' },
    { deal: 'WEEKLY HOT PICKS', dept: 'PRODUCE', status: 'EVERY MONDAY' },
    { deal: 'BULK SAVER', dept: 'PACKAGING', status: '5+ CASES' },
    { deal: 'RESTAURANT BUNDLES', dept: 'KITS', status: 'COMING SOON' },
  ]
  const peeks = offers.slice(0, 4)
  return (
    <Stack spacing={{ xs: 4, md: 6 }}>
      {/* Departure board hero */}
      <Box sx={{ borderRadius: `${tokens.radius.xl}px`, overflow: 'hidden', bgcolor: '#0D0C24', color: '#fff', p: { xs: 2.5, md: 5 } }}>
        <Typography variant="overline" sx={{ color: c.saffron }}>Flyers &amp; Offers · Now boarding</Typography>
        <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 30, md: 48 }, lineHeight: 1.05, letterSpacing: '-.02em', mt: 0.5, maxWidth: 760 }}>
          Warehouse deals are about to depart.
        </Typography>
        <Typography sx={{ mt: 1.5, opacity: 0.8, maxWidth: 560 }}>
          Monthly flyers, weekly hot picks and bulk pricing — straight from the Supreme Cash &amp; Carry floor to your order screen.
        </Typography>
        <Box sx={{ mt: { xs: 3, md: 4 }, bgcolor: '#1B1A3D', borderRadius: `${tokens.radius.md}px`, p: { xs: 1.5, md: 2.5 } }}>
          {/* Desktop: 3-column board */}
          <Box sx={{ display: { xs: 'none', md: 'grid' }, gridTemplateColumns: '1.4fr .8fr 1fr', gap: 2, alignItems: 'center' }}>
            {['Deal', 'Department', 'Status'].map((h) => (
              <Typography key={h} sx={{ fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,.55)', fontWeight: 600 }}>{h}</Typography>
            ))}
            {rows.map((r, i) => (
              <Box key={r.deal} sx={{ display: 'contents' }}>
                <FlipText text={r.deal} delay={i * 250} size={18} color="#fff" />
                <FlipText text={r.dept} delay={i * 250 + 150} size={18} color="#C7C5F2" />
                <FlipText text={r.status} delay={i * 250 + 300} size={18} />
              </Box>
            ))}
          </Box>
          {/* Mobile: stacked rows, deal above status */}
          <Stack spacing={1.5} sx={{ display: { xs: 'flex', md: 'none' } }}>
            {rows.map((r, i) => (
              <Box key={r.deal} sx={{ pb: 1.5, borderBottom: i < rows.length - 1 ? '1px solid rgba(255,255,255,.08)' : 0 }}>
                <FlipText text={r.deal} delay={i * 250} size={15} color="#fff" />
                <Box sx={{ mt: 0.75 }}><FlipText text={r.status} delay={i * 250 + 200} size={13} /></Box>
              </Box>
            ))}
          </Stack>
        </Box>
        <Box sx={{ mt: 3, maxWidth: 560 }}><NotifyForm dark /></Box>
      </Box>

      {/* Deal-type showcase */}
      <Box>
        <SectionHeader eyebrow="Four ways to save" title="What’s coming to the flyer" />
        <Box sx={{ display: 'grid', gap: { xs: 1.25, md: 2 }, gridTemplateColumns: { xs: '1fr 1fr', lg: 'repeat(4, 1fr)' } }}>
          {dealTypes.map((d, i) => {
            const Icon = dealIcon[d.id] ?? LocalOfferRounded
            const col = dealColor[d.name]
            return (
              <Box key={d.id} sx={{ position: 'relative', overflow: 'hidden', p: { xs: 2, md: 3 }, borderRadius: `${tokens.radius.lg}px`, bgcolor: '#fff', border: `1px solid ${c.line}`, minHeight: 190 }}>
                <Box sx={{ position: 'absolute', right: -16, top: -16, width: 96, height: 96, borderRadius: '50%', bgcolor: col.bg, opacity: 0.08 }} />
                <Box sx={{ width: 52, height: 52, borderRadius: `${tokens.radius.md}px`, bgcolor: col.bg, color: col.fg, display: 'grid', placeItems: 'center', mb: 2 }}><Icon /></Box>
                <Typography sx={{ fontWeight: 700, fontSize: { xs: 15, md: 18 } }}>{d.name}</Typography>
                <Typography sx={{ fontSize: 13.5, color: c.text2, mt: 0.75 }}>{d.body}</Typography>
                <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: c.text3, mt: 1.5, letterSpacing: '.08em' }}>0{i + 1} / 04</Typography>
              </Box>
            )
          })}
        </Box>
      </Box>

      {/* Warehouse picker */}
      <Box>
        <SectionHeader eyebrow="Prices vary by warehouse" title="Pick your warehouse" />
        <WarehousePicker value={wh} onChange={setWh} />
      </Box>

      {/* Sneak peek */}
      <Box>
        <SectionHeader eyebrow="Sneak peek" title="A taste of the first flyer" />
        <Box sx={{ display: 'grid', gap: { xs: 1.25, md: 2 }, gridTemplateColumns: { xs: 'repeat(2, minmax(0,1fr))', lg: 'repeat(4, minmax(0,1fr))' } }}>
          {peeks.map((o) => {
            const p = productBySku(o.sku)!
            return (
              <Box key={o.id} sx={{ bgcolor: '#fff', border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.lg}px`, p: 1.5 }}>
                <ProductImage src={p.images[0]} alt={p.name} brand={p.brand} />
                <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: c.red, mt: 1.25, letterSpacing: '.06em', textTransform: 'uppercase' }}>{o.deal}</Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 600, lineHeight: 1.4, minHeight: '2.8em', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }} title={p.name}>{p.name}</Typography>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                  <Box aria-label="Price revealed when the flyer goes live" sx={{ fontSize: 22, fontWeight: 800, color: c.navy, filter: 'blur(6px)', userSelect: 'none' }}>{money(o.offerPrice)}</Box>
                  <LockClockRounded sx={{ color: c.text3, fontSize: 20 }} />
                </Stack>
                <Typography sx={{ fontSize: 12.5, color: c.text3 }}>Was {money(o.regular)} · price reveals Nov 1</Typography>
              </Box>
            )
          })}
        </Box>
      </Box>

      <Box sx={{ borderRadius: `${tokens.radius.xl}px`, bgcolor: c.redTint, p: { xs: 3, md: 5 }, display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, alignItems: 'center' }}>
        <Box>
          <Typography variant="h2" sx={{ color: c.ink }}>Be first in line when it drops</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>We’ll send one email per flyer with the best deals for your warehouse.</Typography>
        </Box>
        <NotifyForm />
      </Box>
    </Stack>
  )
}

/* ------------------------------------------------------------------ Page */

export default function Flyers() {
  const [tab, setTab] = useState(0)
  const [wh, setWh] = useState('mis')
  return (
    <Container>
      <Box sx={{ pt: { xs: 2, md: 3 }, pb: { xs: 2, md: 2.5 } }}>
        <Breadcrumbs items={[{ label: 'Flyers & Offers' }]} sx={{ mb: 1.5 }} />
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'flex-end' }} spacing={2}>
          <Box>
            <Typography variant="h1" sx={{ fontSize: { xs: 28, md: 40 } }}>Flyers &amp; Offers</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.75 }}>Warehouse deals for restaurants across the GTA, Hamilton &amp; Niagara</Typography>
          </Box>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} aria-label="Flyer version" sx={{ bgcolor: '#fff', border: `1px solid ${c.line}`, borderRadius: 999, p: 0.5, minHeight: 0, '& .MuiTabs-indicator': { display: 'none' } }}>
            {[
              <Stack key="l" direction="row" spacing={1} alignItems="center" component="span"><span>Live flyer</span><NewFeatureTag label="New" note="offer & warehouse data" /></Stack>,
              'Coming soon (today)',
            ].map((l, i) => (
              <Tab
                key={i}
                label={l}
                sx={{ minHeight: 44, borderRadius: 999, px: 2.25, fontSize: 14, color: c.text2, '&.Mui-selected': { bgcolor: c.navy, color: '#fff', '& span[class]': {} } }}
              />
            ))}
          </Tabs>
        </Stack>
      </Box>
      {tab === 0 ? <LiveFlyer wh={wh} setWh={setWh} /> : <ComingSoon wh={wh} setWh={setWh} />}
    </Container>
  )
}
