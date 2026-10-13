import { useState } from 'react'
import { Box, Button, Stack, Tab, Tabs, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded'
import ReplayRounded from '@mui/icons-material/ReplayRounded'
import LocalShippingRounded from '@mui/icons-material/LocalShippingRounded'
import AcUnitRounded from '@mui/icons-material/AcUnitRounded'
import StorefrontRounded from '@mui/icons-material/StorefrontRounded'
import SupportAgentRounded from '@mui/icons-material/SupportAgentRounded'
import LockOpenRounded from '@mui/icons-material/LockOpenRounded'
import BusinessCenterRounded from '@mui/icons-material/BusinessCenterRounded'
import KitchenRounded from '@mui/icons-material/KitchenRounded'
import LocalOfferRounded from '@mui/icons-material/LocalOfferRounded'
import CheckRounded from '@mui/icons-material/CheckRounded'
import RestaurantRounded from '@mui/icons-material/RestaurantRounded'
import BakeryDiningRounded from '@mui/icons-material/BakeryDiningRounded'
import AutoAwesomeRounded from '@mui/icons-material/AutoAwesomeRounded'
import DeliveryDiningRounded from '@mui/icons-material/DeliveryDiningRounded'
import { tokens } from '../../../theme'
import { departments, money, productBySku, whyFeatures, type Department, type Product } from '../../../data/catalog'
import { orders } from '../../../data/account'
import { useApp } from '../../../state/AppState'
import { ProductRail } from '../../../components/Commerce'
import { Crown } from '../../../components/Brand'
import { SectionHeader } from '../../../components/ui'

const c = tokens.color

/* ------------------------------------------------------------------ Buy it again */

export function BuyAgain() {
  const { review, addToCart } = useApp()
  if (!review.signedIn) {
    return (
      <Box
        sx={{
          display: 'grid', gap: 3, alignItems: 'center', gridTemplateColumns: { xs: '1fr', md: '1.4fr 1fr' },
          p: { xs: 2.5, md: 4 }, borderRadius: `${tokens.radius.xl}px`, bgcolor: c.navyTint, border: `1px solid #DCDAF3`, position: 'relative', overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'absolute', right: -30, top: -20, opacity: 0.07 }}><Crown size={260} color={c.navy} /></Box>
        <Box sx={{ position: 'relative' }}>
          <Typography variant="overline" sx={{ color: c.navy }}>For restaurants, cafés &amp; caterers</Typography>
          <Typography variant="h2" sx={{ color: c.navy, mt: 0.5 }}>Sign in to see your business prices and reorder in one tap</Typography>
          <Stack direction="row" flexWrap="wrap" gap={1.5} sx={{ mt: 2 }}>
            {['Customer-group pricing', 'Buy-it-again list', 'Net 30 credit terms', 'Invoices & statements'].map((t) => (
              <Stack key={t} direction="row" spacing={0.5} alignItems="center" sx={{ fontSize: 13.5, fontWeight: 500, color: c.ink }}>
                <CheckRounded sx={{ fontSize: 18, color: c.successText }} /> <span>{t}</span>
              </Stack>
            ))}
          </Stack>
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row', md: 'column', lg: 'row' }} spacing={1.5} sx={{ position: 'relative', justifySelf: { md: 'end' } }}>
          <Button component={RouterLink} to="/account/signin" variant="contained" size="large" startIcon={<LockOpenRounded />}>Sign in</Button>
          <Button component={RouterLink} to="/account/signin?mode=create" variant="outlined" color="secondary" size="large" startIcon={<BusinessCenterRounded />} sx={{ bgcolor: '#fff' }}>
            Open a business account
          </Button>
        </Stack>
      </Box>
    )
  }

  const seen = new Set<string>()
  const items: Product[] = []
  orders.filter((o) => o.status !== 'Cancelled').forEach((o) => o.items.forEach((i) => {
    if (seen.has(i.sku)) return
    seen.add(i.sku)
    const p = productBySku(i.sku)
    if (p) items.push(p)
  }))
  const last = orders[0]

  return (
    <Box sx={{ p: { xs: 0, md: 3 }, borderRadius: `${tokens.radius.xl}px`, bgcolor: { xs: 'transparent', md: '#fff' }, border: { xs: 0, md: `1px solid ${c.line}` } }}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'flex-end' }} spacing={2} sx={{ mb: tokens.space.headingGap }}>
        <Box>
          <Typography variant="overline" sx={{ color: c.red }}>Spice Route Kitchen · your usuals</Typography>
          <Typography variant="h2">Buy it again</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            From your last {orders.length} online &amp; in-store orders. Last order <b>#{last.number}</b> · {money(last.total)}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} sx={{ flexShrink: 0, "& .MuiButton-root": { whiteSpace: "nowrap" } }}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<ReplayRounded />}
            onClick={() => last.items.forEach((i) => addToCart(i.sku, i.qty))}
            disabled={review.loading}
          >
            Reorder #{last.number}
          </Button>
          <Button component={RouterLink} to="/account/orders" sx={{ color: c.navy, display: { xs: 'none', sm: 'inline-flex' } }} endIcon={<ArrowForwardRounded />}>
            All orders
          </Button>
        </Stack>
      </Stack>
      <ProductRail items={items} loading={review.loading} />
    </Box>
  )
}

/* ------------------------------------------------------------------ Category tile */

export function CategoryTile({ d }: { d: Department }) {
  return (
    <Box
      component={RouterLink}
      to={`/c/${d.slug}`}
      aria-label={`${d.name}, ${d.count.toLocaleString()} products`}
      sx={{
        position: 'relative', display: 'flex', flexDirection: 'column', textDecoration: 'none', color: c.ink,
        borderRadius: `${tokens.radius.lg}px`, bgcolor: '#fff', border: `1px solid ${c.line}`, overflow: 'hidden',
        transition: 'box-shadow .22s, transform .22s', '&:hover': { boxShadow: tokens.shadow.hover, transform: 'translateY(-3px)' },
        '&:hover img': { transform: 'scale(1.06)' }, '&:focus-visible': { outline: `3px solid ${c.navy}`, outlineOffset: 2 },
      }}
    >
      <Box sx={{ position: 'relative', aspectRatio: '4 / 3', overflow: 'hidden', bgcolor: c.navy }}>
        {d.image ? (
          <Box component="img" src={d.image} alt="" loading="lazy" sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .5s ease' }} />
        ) : (
          // Missing-image fallback: navy tile with crown watermark and department initial.
          <Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: `linear-gradient(135deg, ${c.navy}, ${c.navyDark})` }}>
            <Box sx={{ position: 'absolute', right: -20, bottom: -18, opacity: 0.12 }}><Crown size={160} color="#fff" /></Box>
            <KitchenRounded sx={{ fontSize: 56, color: '#fff', opacity: 0.9 }} />
          </Box>
        )}
      </Box>
      <Box sx={{ p: { xs: 1.5, md: 2 } }}>
        <Typography sx={{ fontWeight: 700, fontSize: { xs: 14.5, md: 16 }, lineHeight: 1.25 }}>{d.name}</Typography>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 0.5 }}>
          <Typography sx={{ fontSize: 12.5, color: c.text3 }}>{d.count.toLocaleString()} products</Typography>
          <ArrowForwardRounded sx={{ fontSize: 18, color: c.red }} />
        </Stack>
      </Box>
    </Box>
  )
}

/* ------------------------------------------------------------------ Kitchen types */

type KitchenType = { id: string; title: string; blurb: string; icon: typeof StorefrontRounded; depts: string[] }

/** Business-type shortcuts into existing departments — CMS copy, no new backend data. */
const kitchenTypes: KitchenType[] = [
  { id: 'restaurant', title: 'Restaurant', blurb: 'For the line and the pass', icon: RestaurantRounded, depts: ['meat-poultry', 'produce', 'grocery'] },
  { id: 'cafe-bakery', title: 'Café & Bakery', blurb: 'For the counter and the oven', icon: BakeryDiningRounded, depts: ['beverage', 'dairy-eggs', 'packaging'] },
  { id: 'caterer', title: 'Caterer & Events', blurb: 'For trays, buffets and banquets', icon: AutoAwesomeRounded, depts: ['packaging', 'ware-equipment', 'frozen'] },
  { id: 'food-truck', title: 'Food Truck', blurb: 'For service in a small space', icon: LocalShippingRounded, depts: ['frozen', 'packaging', 'beverage'] },
  { id: 'ghost-kitchen', title: 'Ghost Kitchen', blurb: 'For delivery-only menus', icon: DeliveryDiningRounded, depts: ['packaging', 'grocery', 'meat-poultry'] },
  { id: 'retail', title: 'Grocery & Retail', blurb: 'For shelves and coolers', icon: StorefrontRounded, depts: ['grocery', 'beverage', 'janitorial'] },
]

function KitchenTile({ t }: { t: KitchenType }) {
  const Icon = t.icon
  const depts = t.depts.map((slug) => departments.find((d) => d.slug === slug)).filter((d): d is Department => !!d)
  return (
    <Box
      sx={{
        position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', gap: 1.5, p: 2,
        bgcolor: '#fff', border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.md}px`,
        transition: 'border-color .2s, box-shadow .2s', '&:hover': { borderColor: c.line2, boxShadow: tokens.shadow.hover },
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Box sx={{ width: 44, height: 44, borderRadius: '50%', bgcolor: c.redTint, color: c.red, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <Icon sx={{ fontSize: 22 }} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          {/* Stretched link: the card opens the main department; chips stay separately clickable. */}
          <Box
            component={RouterLink}
            to={`/c/${t.depts[0]}`}
            sx={{
              color: c.ink, textDecoration: 'none', fontWeight: 600, fontSize: 15.5,
              '&::after': { content: '""', position: 'absolute', inset: 0, borderRadius: `${tokens.radius.md}px` },
              '&:hover': { color: c.red }, '&:focus-visible': { outline: 'none' }, '&:focus-visible::after': { outline: `3px solid ${c.navy}`, outlineOffset: 2 },
            }}
          >
            {t.title}
          </Box>
          <Typography sx={{ fontSize: 13, color: c.text2 }}>{t.blurb}</Typography>
        </Box>
      </Stack>
      <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ mt: 'auto' }}>
        {depts.map((d) => (
          <Box
            key={d.slug}
            component={RouterLink}
            to={`/c/${d.slug}`}
            sx={{
              position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', minHeight: 30, px: 1.25,
              fontSize: 12.5, fontWeight: 500, color: c.text2, textDecoration: 'none',
              bgcolor: c.surface2, border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.pill}px`,
              '&:hover': { borderColor: c.line2, color: c.ink }, '&:focus-visible': { outline: `3px solid ${c.navy}`, outlineOffset: 2 },
            }}
          >
            {d.name}
          </Box>
        ))}
      </Stack>
    </Box>
  )
}

/** "Browse" block — two ways in: by department (photo tiles) or by kitchen type, one click apart via tabs. */
export function DepartmentGrid() {
  const [tab, setTab] = useState<'dept' | 'kitchen'>('dept')
  return (
    <Box>
      <SectionHeader eyebrow="9 departments · 4,300+ products" title="Shop by department" action="All categories" href="/all-categories" />
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        aria-label="Browse by"
        sx={{ mb: tokens.space.headingGap, borderBottom: `1px solid ${c.line}` }}
      >
        <Tab value="dept" label="By department" id="browse-tab-dept" aria-controls="browse-panel" />
        <Tab value="kitchen" label="By kitchen type" id="browse-tab-kitchen" aria-controls="browse-panel" />
      </Tabs>
      <Box id="browse-panel" role="tabpanel" aria-labelledby={`browse-tab-${tab}`}>
        {tab === 'dept' ? (
          <Box sx={{ display: 'grid', gap: { xs: 1.25, md: 2 }, gridTemplateColumns: { xs: 'repeat(2, minmax(0,1fr))', sm: 'repeat(3, minmax(0,1fr))', md: 'repeat(4, minmax(0,1fr))', lg: 'repeat(5, minmax(0,1fr))' } }}>
            {departments.map((d) => <CategoryTile key={d.id} d={d} />)}
            <Box
              component={RouterLink}
              to="/flyers-offers"
              sx={{
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: { xs: 2, md: 2.5 }, minHeight: 180, textDecoration: 'none',
                borderRadius: `${tokens.radius.lg}px`, bgcolor: c.red, color: '#fff', transition: 'transform .22s', '&:hover': { transform: 'translateY(-3px)', bgcolor: c.redDark },
              }}
            >
              <LocalOfferRounded sx={{ fontSize: 36 }} />
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: 20, lineHeight: 1.15 }}>Flyers &amp; Offers</Typography>
                <Typography sx={{ fontSize: 13, opacity: 0.92, mt: 0.5 }}>Warehouse deals this week</Typography>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gap: { xs: 1.25, md: 2 }, gridTemplateColumns: { xs: 'minmax(0,1fr)', sm: 'repeat(2, minmax(0,1fr))', lg: 'repeat(3, minmax(0,1fr))' } }}>
            {kitchenTypes.map((t) => <li key={t.id}><KitchenTile t={t} /></li>)}
          </Box>
        )}
      </Box>
    </Box>
  )
}

/* ------------------------------------------------------------------ Brand tiles */

const brandHues = [c.navy, c.red, '#0F766E', '#7C2D12', '#1E40AF', '#9D174D', '#3F6212', '#5B21B6']

/** Wordmark brand tile — fallback used because Magento has no brand logo files yet. */
export function BrandTile({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) {
  const hue = brandHues[[...name].reduce((a, ch) => a + ch.charCodeAt(0), 0) % brandHues.length]
  return (
    <Box
      component={RouterLink}
      to={`/search/${encodeURIComponent(name)}`}
      aria-label={`Shop ${name}`}
      sx={{
        display: 'grid', placeItems: 'center', textAlign: 'center', px: 2, height: size === 'sm' ? 84 : 104, borderRadius: `${tokens.radius.md}px`,
        bgcolor: '#fff', border: `1px solid ${c.line}`, textDecoration: 'none', color: hue, transition: 'box-shadow .2s, border-color .2s, transform .2s',
        '&:hover': { boxShadow: tokens.shadow.hover, borderColor: 'transparent', transform: 'translateY(-2px)' },
        '&:focus-visible': { outline: `3px solid ${c.navy}`, outlineOffset: 2 },
      }}
    >
      <Box sx={{ fontWeight: 800, fontSize: name.length > 10 ? 15 : 18, letterSpacing: name.length > 8 ? '.01em' : '.04em', textTransform: 'uppercase', lineHeight: 1.1 }}>
        {name}
      </Box>
    </Box>
  )
}

/* ------------------------------------------------------------------ Why MySupreme */

const whyIcons: Record<string, typeof LocalShippingRounded> = {
  local_shipping: LocalShippingRounded, ac_unit: AcUnitRounded, storefront: StorefrontRounded, support_agent: SupportAgentRounded,
}

export function WhyCards({ items = whyFeatures }: { items?: typeof whyFeatures }) {
  return (
    <Box>
      <SectionHeader eyebrow="Why MySupreme" title="One supplier for your whole kitchen" />
      <Box sx={{ display: 'grid', gap: { xs: 1.25, md: 2 }, gridTemplateColumns: { xs: '1fr 1fr', lg: 'repeat(4, 1fr)' } }}>
        {items.map((f, i) => {
          const Icon = whyIcons[f.icon] ?? StorefrontRounded
          return (
            <Box key={f.title} sx={{ p: { xs: 2, md: 3 }, borderRadius: `${tokens.radius.lg}px`, bgcolor: '#fff', border: `1px solid ${c.line}` }}>
              <Box sx={{ width: 52, height: 52, borderRadius: `${tokens.radius.md}px`, bgcolor: i % 2 ? c.navyTint : c.redTint, color: i % 2 ? c.navy : c.red, display: 'grid', placeItems: 'center', mb: 2 }}>
                <Icon />
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: { xs: 14.5, md: 16.5 }, lineHeight: 1.3 }}>{f.title}</Typography>
              <Typography sx={{ fontSize: 13.5, color: c.text2, mt: 0.75 }}>{f.body}</Typography>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
