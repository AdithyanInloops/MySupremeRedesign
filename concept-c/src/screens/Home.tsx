import { useEffect, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { Badge, Box, Button, IconButton, Typography } from '@mui/material'
import { tokens, focusRing, pressable } from '../theme'
import { useApp } from '../state/app'
import { departments, money, newArrivals, offers, photo, productBySku, promoTiles, recommended } from '../data/catalog'
import { addresses, credit, customer, orders as seedOrders } from '../data/account'
import { DELIVERY_MINIMUM, usualSkus } from '../data/app'
import { endOf, greeting } from '../data/format'
import ProductCard, { ProductTile } from '../components/ProductCard'
import BannerCarousel from '../components/BannerCarousel'
import { Card, Crown, HScroll, ProductImage, SectionHeader, Sheet } from '../components/ui'
import {
  AlertCircleIcon, BarcodeIcon, BellIcon, BoltIcon, CheckIcon, ChevronDownIcon, ChevronRightIcon, GridIcon, MapPinIcon, PhoneIcon, ReceiptIcon,
  RotateCcwIcon, SearchIcon, TruckIcon, WhatsAppIcon, type IconComponent,
} from '../components/icons'

const c = tokens.color

/** "Deliver to" address picker (bottom sheet). */
function AddressSheet({ open, onClose, value, onPick }: { open: boolean; onClose: () => void; value: string; onPick: (id: string) => void }) {
  return (
    <Sheet open={open} onClose={onClose} title="Deliver to">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {addresses.map((a) => {
          const on = a.id === value
          return (
            <Box key={a.id} component="button" onClick={() => { onPick(a.id); onClose() }} aria-pressed={on}
              sx={{ all: 'unset', boxSizing: 'border-box', cursor: 'pointer', display: 'flex', gap: 1.5, p: 1.5, borderRadius: `${tokens.radius.md}px`, border: `${on ? 2 : 1}px solid ${on ? c.navy : c.line}`, ...focusRing }}>
              <MapPinIcon sx={{ color: on ? c.navy : c.text3, mt: 0.25 }} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 600, fontSize: 14.5 }}>{a.company}</Typography>
                <Typography sx={{ fontSize: 13, color: c.text2 }}>{a.street}, {a.city}</Typography>
                {a.inArea === false && <Typography sx={{ fontSize: 12.5, color: c.warning, fontWeight: 600, mt: 0.5 }}>Outside delivery routes · pickup only</Typography>}
              </Box>
              {on && <CheckIcon sx={{ color: c.navy }} />}
            </Box>
          )
        })}
        <Button component={RouterLink} to="/account/addresses" onClick={onClose} sx={{ color: c.navy, mt: 0.5 }}>Manage addresses</Button>
      </Box>
    </Sheet>
  )
}

function LiveOrder() {
  const order = seedOrders.find((o) => o.status === 'On the way')
  if (!order) return null
  const steps = ['Placed', 'Packed', 'On the way', 'Delivered']
  return (
    <Card to={`/orders/${order.number}`} sx={{ p: 1.5, boxShadow: tokens.shadow.card, border: 'none' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ width: 44, height: 44, borderRadius: `${tokens.radius.sm}px`, bgcolor: c.navyTint, color: c.navy, display: 'grid', placeItems: 'center', flexShrink: 0, position: 'relative' }}>
          <TruckIcon />
          <Box sx={{ position: 'absolute', top: -3, right: -3, width: 12, height: 12, borderRadius: '50%', bgcolor: c.success, border: '2px solid #fff', animation: 'pulse 1.6s ease-in-out infinite', '@keyframes pulse': { '50%': { transform: 'scale(1.25)' } } }} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: c.successText }}>Arriving {order.eta}</Typography>
          <Typography sx={{ fontWeight: 700, fontSize: 15 }}>Order #{order.number} is on the way</Typography>
        </Box>
        <ChevronRightIcon sx={{ color: c.text4 }} />
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 0.5, mt: 1.25 }} aria-label="Delivery progress: on the way">
        {steps.map((s, i) => (
          <Box key={s}>
            <Box sx={{ height: 5, borderRadius: 3, bgcolor: i <= 2 ? c.navy : c.surface2, ...(i === 2 ? { background: `linear-gradient(90deg, ${c.navy} 60%, ${c.surface2} 60%)` } : {}) }} />
            <Typography sx={{ fontSize: 10.5, color: i <= 2 ? c.navy : c.text3, fontWeight: i === 2 ? 700 : 500, mt: 0.5 }}>{s}</Typography>
          </Box>
        ))}
      </Box>
    </Card>
  )
}

function QuickActions({ onReorder }: { onReorder: () => void }) {
  const { orders } = useApp()
  const live = orders.some((o) => o.status === 'On the way')
  const items: { label: string; icon: IconComponent; to?: string; onClick?: () => void; tone: [string, string]; dot?: boolean }[] = [
    { label: 'Reorder', icon: RotateCcwIcon, onClick: onReorder, tone: [c.navyTint, c.navy] },
    { label: 'Quick order', icon: BoltIcon, to: '/quick-order', tone: [c.redTint, c.red] },
    { label: 'Scan item', icon: BarcodeIcon, to: '/scan', tone: [c.saffronTint, '#8A5A00'] },
    { label: 'Orders', icon: ReceiptIcon, to: '/orders', tone: [c.successTint, c.successText], dot: live },
  ]
  return (
    <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 1 }}>
      {items.map((it) => {
        const Icon = it.icon
        const inner = (
          <>
            <Box sx={{ position: 'relative', width: 52, height: 52, borderRadius: `${tokens.radius.md}px`, bgcolor: it.tone[0], color: it.tone[1], display: 'grid', placeItems: 'center' }}>
              <Icon sx={{ fontSize: 24 }} />
              {it.dot && <Box sx={{ position: 'absolute', top: 6, right: 6, width: 10, height: 10, borderRadius: '50%', bgcolor: c.success, border: '2px solid #fff' }} />}
            </Box>
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: c.ink, mt: 0.75, textAlign: 'center', lineHeight: 1.2 }}>{it.label}</Typography>
          </>
        )
        const sx = { display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', width: '100%', ...pressable, ...focusRing, borderRadius: `${tokens.radius.md}px` } as const
        return (
          <li key={it.label}>
            {it.to ? <Box component={RouterLink} to={it.to} sx={sx}>{inner}</Box> : <Box component="button" onClick={it.onClick} sx={{ all: 'unset', boxSizing: 'border-box', cursor: 'pointer', ...sx }}>{inner}</Box>}
          </li>
        )
      })}
    </Box>
  )
}

/** Reorder last order — review the lines, then add them all in one tap. */
function ReorderSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addMany } = useApp()
  const navigate = useNavigate()
  const last = seedOrders[0]
  const items = last.items.map((i) => ({ ...i, product: productBySku(i.sku) })).filter((i) => i.product)
  return (
    <Sheet open={open} onClose={onClose} title={`Reorder #${last.number}`}
      footer={<Button variant="contained" size="large" fullWidth onClick={() => { addMany(items.map((i) => ({ sku: i.sku, qty: i.qty })), `Order #${last.number} added`); onClose(); navigate('/cart') }}>Add {items.reduce((a, i) => a + i.qty, 0)} items · {money(last.subtotal)}</Button>}>
      <Typography sx={{ color: c.text2, fontSize: 14, mb: 1 }}>Same items and quantities as your last order. You can change quantities in the cart.</Typography>
      {items.map((i) => (
        <Box key={i.sku} sx={{ display: 'grid', gridTemplateColumns: '52px minmax(0,1fr) auto', gap: 1.5, alignItems: 'center', py: 1, borderTop: `1px solid ${c.line}` }}>
          <ProductImage product={i.product!} />
          <Typography sx={{ fontSize: 13.5, fontWeight: 500, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{i.product!.name}</Typography>
          <Typography sx={{ fontWeight: 700, fontSize: 14 }}>×{i.qty}</Typography>
        </Box>
      ))}
    </Sheet>
  )
}

function DealsBanner() {
  const { warehouse } = useApp()
  const weekly = offers.filter((o) => o.deal === 'Weekly Hot Picks' && o.warehouses.includes(warehouse))
  const [left, setLeft] = useState('')
  useEffect(() => {
    if (!weekly[0]) return
    const tick = () => { const ms = Math.max(0, endOf(weekly[0].to) - Date.now()); const d = Math.floor(ms / 864e5); const h = Math.floor((ms % 864e5) / 36e5); setLeft(ms ? `${d}d ${h}h left` : 'Ends today') }
    tick()
    const t = window.setInterval(tick, 60000)
    return () => window.clearInterval(t)
  }, [weekly[0]?.to])
  const here = offers.filter((o) => o.warehouses.includes(warehouse))
  const max = Math.max(0, ...here.map((o) => Math.round((1 - o.offerPrice / o.regular) * 100)))
  const items = [...here].sort((a, b) => b.offerPrice / b.regular - a.offerPrice / a.regular).reverse().slice(0, 3).map((o) => ({ o, p: productBySku(o.sku) })).filter((x) => x.p)
  return (
    <Box component={RouterLink} to="/deals" sx={{ display: 'block', mx: 2, p: 2, borderRadius: `${tokens.radius.lg}px`, bgcolor: c.navy, color: '#fff', textDecoration: 'none', position: 'relative', overflow: 'hidden', ...pressable, ...focusRing }}>
      <Box sx={{ position: 'absolute', right: -20, top: -24, opacity: 0.12 }}><Crown size={150} color="#fff" /></Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, position: 'relative' }}>
        <Box>
          <Typography variant="overline" component="p" sx={{ color: c.saffron }}>Weekly hot picks</Typography>
          <Typography sx={{ fontSize: 19, fontWeight: 800, lineHeight: 1.2 }}>Save up to {max}% this week</Typography>
        </Box>
        {left && <Box sx={{ flexShrink: 0, px: 1.25, py: 0.5, borderRadius: 999, bgcolor: c.saffron, color: c.ink, fontSize: 12, fontWeight: 700 }}>{left}</Box>}
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 1, mt: 1.75, position: 'relative' }}>
        {items.map(({ o, p }) => (
          <Box key={o.id} sx={{ bgcolor: '#fff', color: c.ink, borderRadius: `${tokens.radius.sm}px`, p: 0.75 }}>
            <ProductImage product={p!} ratio="4 / 3" radius={6} caption={false} />
            <Typography sx={{ fontSize: 11, fontWeight: 500, lineHeight: 1.25, mt: 0.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.5em' }}>{p!.name}</Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 800, color: c.red, mt: 0.25, lineHeight: 1.1 }}>{money(o.offerPrice)}</Typography>
            <Typography sx={{ fontSize: 11, color: c.text3, textDecoration: 'line-through' }}>{money(o.regular)}</Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1.5, fontWeight: 600, fontSize: 14, position: 'relative' }}>See all flyers & offers <ChevronRightIcon sx={{ fontSize: 18 }} /></Box>
    </Box>
  )
}

/** "Pick up where you left off": the open cart (straight to checkout) and recently viewed products. */
function ResumeSection() {
  const { recentlyViewed, clearViewed, count, subtotal, remaining, lines } = useApp()
  const viewed = recentlyViewed.map(productBySku).filter((p): p is NonNullable<typeof p> => !!p).slice(0, 8)
  if (!viewed.length && !count) return null
  const thumbs = lines.slice(0, 3).map((l) => productBySku(l.sku)).filter((p): p is NonNullable<typeof p> => !!p)
  const pct = Math.min(100, (subtotal / DELIVERY_MINIMUM) * 100)
  return (
    <Box sx={{ mt: 3 }}>
      <SectionHeader eyebrow="Continue shopping" title="Pick up where you left off" action={viewed.length ? 'Clear' : undefined} actionLabel="Clear recently viewed" onAction={clearViewed} />
      {count > 0 && (
        <Box sx={{ px: 2, mb: viewed.length ? 1 : 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.25, bgcolor: '#fff', borderRadius: `${tokens.radius.md}px`, border: `1px solid ${c.line}` }}>
            <Box component={RouterLink} to="/cart" sx={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 1.25, color: 'inherit', textDecoration: 'none', borderRadius: `${tokens.radius.sm}px`, ...focusRing }}>
              <Box aria-hidden sx={{ display: 'flex', flexShrink: 0, pl: 1 }}>
                {thumbs.map((p, k) => <Box key={p.sku} sx={{ width: 34, ml: -1, borderRadius: '9px', border: '2px solid #fff', overflow: 'hidden', bgcolor: '#fff', position: 'relative', zIndex: 3 - k, boxShadow: tokens.shadow.card }}><ProductImage product={p} radius={7} caption={false} /></Box>)}
              </Box>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 14.5, lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Your cart · {count} items</Typography>
                <Typography sx={{ fontSize: 12, color: c.text3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <Box component="span" sx={{ fontWeight: 700, color: c.ink }}>{money(subtotal)}</Box> · {remaining > 0 ? `${money(remaining)} to free delivery` : <Box component="span" sx={{ color: c.successText, fontWeight: 600 }}>free delivery</Box>}
                </Typography>
                <Box sx={{ height: 4, borderRadius: 2, bgcolor: c.surface2, mt: 0.5, overflow: 'hidden' }}><Box sx={{ width: `${pct}%`, height: '100%', borderRadius: 2, bgcolor: remaining > 0 ? c.navy : c.success }} /></Box>
              </Box>
            </Box>
            <Button component={RouterLink} to="/checkout" variant="contained" size="small" sx={{ flexShrink: 0 }}>Checkout</Button>
          </Box>
        </Box>
      )}
      {viewed.length > 0 && <HScroll gap={1}>{viewed.map((p) => <ProductTile key={p.sku} product={p} />)}</HScroll>}
    </Box>
  )
}

/** Compact navy search bar that slides in once the header search scrolls away, so search is always one tap. */
function StickySearch({ show }: { show: boolean }) {
  const navigate = useNavigate()
  return (
    <Box sx={{ position: 'sticky', top: 0, zIndex: 25, height: 0 }}>
      <Box sx={{ position: 'absolute', left: 0, right: 0, top: 0, display: 'flex', gap: 1, px: 1.5, pt: 'calc(8px + env(safe-area-inset-top))', pb: 1, bgcolor: c.navy, boxShadow: '0 8px 20px -12px rgba(27,25,80,.7)', transform: show ? 'none' : 'translateY(-110%)', visibility: show ? 'visible' : 'hidden', transition: `transform ${tokens.motion.base}, visibility ${tokens.motion.base}` }}>
        <Box component="button" onClick={() => navigate('/search')} aria-label="Search products, brands or SKU"
          sx={{ all: 'unset', boxSizing: 'border-box', cursor: 'text', flex: 1, display: 'flex', alignItems: 'center', gap: 1, height: 42, px: 1.5, borderRadius: `${tokens.radius.sm}px`, bgcolor: '#fff', color: c.text3, fontSize: 14.5, ...focusRing }}>
          <SearchIcon sx={{ color: c.navy, fontSize: 20 }} /> Search products or SKU
        </Box>
        <IconButton component={RouterLink} to="/scan" aria-label="Scan a barcode" sx={{ width: 42, height: 42, borderRadius: `${tokens.radius.sm}px`, bgcolor: c.red, color: '#fff', '&:hover': { bgcolor: c.redDark } }}><BarcodeIcon sx={{ fontSize: 21 }} /></IconButton>
      </Box>
    </Box>
  )
}

export default function Home() {
  const { signedIn, unread, warehouse } = useApp()
  const navigate = useNavigate()
  const [addrOpen, setAddrOpen] = useState(false)
  const [addr, setAddr] = useState(addresses[0].id)
  const [reorder, setReorder] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const address = addresses.find((a) => a.id === addr) ?? addresses[0]
  const usuals = usualSkus.map(productBySku).filter((p): p is NonNullable<typeof p> => !!p)
  useEffect(() => {
    const el = document.getElementById('app-scroll')
    if (!el) return
    const on = () => setScrolled(el.scrollTop > 150)
    on()
    el.addEventListener('scroll', on, { passive: true })
    return () => el.removeEventListener('scroll', on)
  }, [])

  return (
    <Box sx={{ pb: 2 }}>
      <StickySearch show={scrolled} />
      {/* Navy brand header; the banner slider overlaps its lower edge */}
      <Box sx={{ bgcolor: c.navy, color: '#fff', px: 2, pt: 'calc(12px + env(safe-area-inset-top))', pb: 11, borderRadius: `0 0 ${tokens.radius.xl}px ${tokens.radius.xl}px`, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', right: -40, top: 10, opacity: 0.08 }}><Crown size={200} color="#fff" /></Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, position: 'relative' }}>
          <Box component="button" onClick={() => setAddrOpen(true)} aria-label={`Deliver to ${address.company}, change`}
            sx={{ all: 'unset', boxSizing: 'border-box', cursor: 'pointer', flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 1, py: 0.5, borderRadius: `${tokens.radius.sm}px`, ...focusRing }}>
            <MapPinIcon sx={{ fontSize: 20, color: c.saffron }} />
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: 11.5, opacity: 0.75, lineHeight: 1.2 }}>{signedIn ? 'Deliver to' : 'Delivering across'}</Typography>
              <Typography sx={{ fontSize: 14.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', gap: 0.25 }}>
                {signedIn ? `${address.company} · ${address.city}` : 'GTA, Hamilton & Niagara'} <ChevronDownIcon sx={{ fontSize: 18 }} />
              </Typography>
            </Box>
          </Box>
          <IconButton component={RouterLink} to="/notifications" aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'} sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,.12)', '&:hover': { bgcolor: 'rgba(255,255,255,.2)' } }}>
            <Badge badgeContent={unread} sx={{ '& .MuiBadge-badge': { bgcolor: c.saffron, color: c.ink, fontWeight: 800, fontSize: 10.5, minWidth: 18, height: 18 } }}><BellIcon /></Badge>
          </IconButton>
        </Box>
        <Typography component="h1" sx={{ fontSize: 22, fontWeight: 800, letterSpacing: '-.02em', mt: 1.25, position: 'relative' }}>
          {signedIn ? `${greeting()}, ${customer.firstName}` : 'Restaurant supply, simplified'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mt: 1.25, position: 'relative' }}>
          <Box component="button" onClick={() => navigate('/search')} aria-label="Search products, brands or SKU"
            sx={{ all: 'unset', boxSizing: 'border-box', cursor: 'text', flex: 1, display: 'flex', alignItems: 'center', gap: 1.25, height: 48, px: 1.75, borderRadius: `${tokens.radius.md}px`, bgcolor: '#fff', color: c.text3, fontSize: 15, ...focusRing }}>
            <SearchIcon sx={{ color: c.navy }} /> Search products or SKU
          </Box>
          <IconButton component={RouterLink} to="/scan" aria-label="Scan a barcode" sx={{ width: 48, height: 48, borderRadius: `${tokens.radius.md}px`, bgcolor: c.red, color: '#fff', '&:hover': { bgcolor: c.redDark } }}><BarcodeIcon /></IconButton>
        </Box>
      </Box>

      <Box sx={{ mt: -9.5, position: 'relative', zIndex: 1 }}><BannerCarousel /></Box>

      <Box sx={{ px: 2, mt: 1.25 }}><QuickActions onReorder={() => (signedIn ? setReorder(true) : navigate('/signin'))} /></Box>

      {/* Live delivery for business accounts, sign-in prompt for guests */}
      <Box sx={{ px: 2, mt: 2.25 }}>
        {signedIn ? <LiveOrder /> : (
          <Card sx={{ p: 1.75, border: 'none', boxShadow: tokens.shadow.card }}>
            <Typography sx={{ fontWeight: 700, fontSize: 15.5 }}>Buying for a business?</Typography>
            <Typography sx={{ fontSize: 13.5, color: c.text2, mt: 0.25 }}>Sign in for your prices, Net 30 credit and one-tap reorders.</Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1.25 }}>
              <Button component={RouterLink} to="/signin" variant="contained" color="secondary" sx={{ flex: 1 }}>Sign in</Button>
              <Button component={RouterLink} to="/signin?mode=register" variant="outlined" color="secondary" sx={{ flex: 1 }}>Open account</Button>
            </Box>
          </Card>
        )}
      </Box>

      <ResumeSection />

      {signedIn && (
        <Box sx={{ mt: 3 }}>
          <SectionHeader eyebrow="Your usuals" title="Buy it again" action="All orders" to="/orders" />
          <HScroll gap={1}>{usuals.map((p) => <ProductCard key={p.sku} product={p} width={150} />)}</HScroll>
        </Box>
      )}

      {signedIn && (
        <Box sx={{ px: 2, mt: 2 }}>
          <Card to="/account/credit" sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: 12, color: c.text3 }}>Available credit · {credit.terms}</Typography>
              <Typography sx={{ fontSize: 18, fontWeight: 800, color: c.navy, lineHeight: 1.3 }}>{money(credit.available)} <Box component="span" sx={{ fontSize: 12.5, fontWeight: 500, color: c.text3 }}>of {money(credit.limit)}</Box></Typography>
              <Box sx={{ height: 5, borderRadius: 3, bgcolor: c.surface2, mt: 0.5, overflow: 'hidden' }}><Box sx={{ width: `${(credit.available / credit.limit) * 100}%`, height: '100%', bgcolor: c.navy, borderRadius: 3 }} /></Box>
            </Box>
            <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.25, borderRadius: 999, bgcolor: c.errorTint, color: c.error, fontSize: 12, fontWeight: 700 }}><AlertCircleIcon sx={{ fontSize: 14 }} /> {money(credit.overdue)} overdue</Box>
              <Typography sx={{ fontSize: 12.5, color: c.navy, fontWeight: 600, mt: 0.5 }}>Pay now</Typography>
            </Box>
          </Card>
        </Box>
      )}

      <Box sx={{ mt: 3 }}><DealsBanner /></Box>

      <Box sx={{ mt: 3 }}>
        <SectionHeader eyebrow="9 departments · 4,300+ products" title="Shop by department" action="All" to="/shop" />
        <Box component="ul" sx={{ listStyle: 'none', m: 0, px: 2, display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', rowGap: 1.75, columnGap: 1 }}>
          {departments.slice(0, 7).map((d) => (
            <li key={d.id}>
              <Box component={RouterLink} to={`/shop/${d.slug}`} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.75, textDecoration: 'none', color: c.ink, borderRadius: `${tokens.radius.md}px`, ...pressable, ...focusRing }}>
                <Box sx={{ width: '100%', aspectRatio: '1 / 1', maxWidth: 72, borderRadius: '50%', overflow: 'hidden', bgcolor: c.navyTint, border: `2px solid #fff`, boxShadow: tokens.shadow.card }}>
                  {d.image && <Box component="img" src={d.image} alt="" loading="lazy" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </Box>
                <Typography sx={{ fontSize: 11.5, fontWeight: 600, textAlign: 'center', lineHeight: 1.2 }}>{d.name}</Typography>
              </Box>
            </li>
          ))}
          <li>
            <Box component={RouterLink} to="/shop" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.75, textDecoration: 'none', color: c.ink, ...pressable, ...focusRing, borderRadius: `${tokens.radius.md}px` }}>
              <Box sx={{ width: '100%', aspectRatio: '1 / 1', maxWidth: 72, borderRadius: '50%', bgcolor: c.navy, color: '#fff', display: 'grid', placeItems: 'center' }}><GridIcon /></Box>
              <Typography sx={{ fontSize: 11.5, fontWeight: 600, textAlign: 'center', lineHeight: 1.2 }}>All categories</Typography>
            </Box>
          </li>
        </Box>
      </Box>

      <Box sx={{ mt: 3 }}>
        <HScroll gap={1}>
          {promoTiles.map((t) => (
            <Box key={t.id} component={RouterLink} to={t.href.replace('/c/', '/shop/')} sx={{ position: 'relative', width: 272, height: 136, borderRadius: `${tokens.radius.lg}px`, overflow: 'hidden', color: '#fff', textDecoration: 'none', ...pressable, ...focusRing }}>
              <Box component="img" src={t.image} alt="" loading="lazy" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(27,25,80,0) 20%, rgba(27,25,80,.88) 100%)' }} />
              <Box sx={{ position: 'absolute', left: 14, right: 14, bottom: 12 }}>
                <Typography sx={{ fontSize: 12, opacity: 0.85 }}>{t.body}</Typography>
                <Typography sx={{ fontSize: 17, fontWeight: 800, lineHeight: 1.2 }}>{t.title}</Typography>
                <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: c.saffron, mt: 0.25 }}>{t.cta} →</Typography>
              </Box>
            </Box>
          ))}
        </HScroll>
      </Box>

      <Box sx={{ mt: 3 }}>
        <SectionHeader eyebrow="Picked by our buyers" title="Recommended for your kitchen" action="See all" to="/search?q=recommended" />
        <HScroll gap={1}>{recommended.slice(0, 10).map((p) => <ProductCard key={p.sku} product={p} width={150} />)}</HScroll>
      </Box>

      <Box sx={{ mt: 3 }}>
        <SectionHeader eyebrow="Just landed" title="New arrivals" action="See all" to="/search?q=new" />
        <HScroll gap={1}>{newArrivals.map((p) => <ProductCard key={p.sku} product={p} width={150} />)}</HScroll>
      </Box>

      <Box sx={{ px: 2, mt: 3 }}>
        <Card sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1.25, bgcolor: c.navyTint, border: 'none' }}>
          <Box sx={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}><Box component="img" src={photo('chef', 120, 120)} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} /></Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 14.5, color: c.navy }}>Questions? Talk to your rep</Typography>
            <Typography sx={{ fontSize: 12.5, color: c.text2 }}>Mon–Sat 9am–6pm · {warehouse === 'ham' ? 'Hamilton' : warehouse === 'nia' ? 'Niagara' : 'Mississauga'} team</Typography>
          </Box>
          <IconButton component="a" href="https://wa.me/13657770999" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp your rep" sx={{ bgcolor: '#fff', color: c.successText }}><WhatsAppIcon /></IconButton>
          <IconButton component="a" href="tel:+13657770999" aria-label="Call +1 365-777-0999" sx={{ bgcolor: '#fff', color: c.navy }}><PhoneIcon /></IconButton>
        </Card>
      </Box>

      <AddressSheet open={addrOpen} onClose={() => setAddrOpen(false)} value={addr} onPick={setAddr} />
      <ReorderSheet open={reorder} onClose={() => setReorder(false)} />
    </Box>
  )
}
