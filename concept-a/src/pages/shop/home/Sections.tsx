import { Box, Button, Chip, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded'
import ReplayRounded from '@mui/icons-material/ReplayRounded'
import LocalShippingRounded from '@mui/icons-material/LocalShippingRounded'
import AcUnitRounded from '@mui/icons-material/AcUnitRounded'
import StorefrontRounded from '@mui/icons-material/StorefrontRounded'
import SupportAgentRounded from '@mui/icons-material/SupportAgentRounded'
import PlaceRounded from '@mui/icons-material/PlaceRounded'
import LockOpenRounded from '@mui/icons-material/LockOpenRounded'
import BusinessCenterRounded from '@mui/icons-material/BusinessCenterRounded'
import KitchenRounded from '@mui/icons-material/KitchenRounded'
import LocalOfferRounded from '@mui/icons-material/LocalOfferRounded'
import CheckRounded from '@mui/icons-material/CheckRounded'
import { tokens } from '../../../theme'
import { brands, departments, money, offers, photo, productBySku, whyFeatures, type Department, type Product } from '../../../data/catalog'
import { orders } from '../../../data/account'
import { useApp } from '../../../state/AppState'
import { ProductRail } from '../../../components/Commerce'
import { Crown } from '../../../components/Brand'
import { StoreBadge } from '../../../components/Footer'
import { NewFeatureTag, SectionHeader } from '../../../components/ui'

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
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'flex-end' }} spacing={2} sx={{ mb: { xs: 2, md: 2.5 } }}>
        <Box>
          <Typography variant="overline" sx={{ color: c.red }}>Spice Route Kitchen · your usuals</Typography>
          <Typography variant="h2">Buy it again</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            From your last {orders.length} online &amp; in-store orders. Last order <b>#{last.number}</b> · {money(last.total)}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
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

export function DepartmentGrid() {
  return (
    <Box>
      <SectionHeader eyebrow="9 departments · 4,300+ products" title="Shop by department" action="All categories" href="/all-categories" />
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
    </Box>
  )
}

/* ------------------------------------------------------------------ Delivery banner */

export function DeliveryBanner() {
  const regions = ['Toronto', 'Mississauga', 'Brampton', 'Vaughan', 'Markham', 'Oakville', 'Hamilton', 'Burlington', 'St. Catharines', 'Niagara Falls']
  return (
    <Box
      sx={{
        position: 'relative', overflow: 'hidden', borderRadius: `${tokens.radius.xl}px`, bgcolor: c.navyDark, color: '#fff',
        display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.2fr 1fr' }, minHeight: { md: 340 },
      }}
    >
      <Box sx={{ p: { xs: 3, md: 6 }, position: 'relative', zIndex: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ color: c.saffron, mb: 1.5 }}>
          <LocalShippingRounded />
          <Typography variant="overline" sx={{ color: c.saffron }}>Same-day &amp; next-day</Typography>
        </Stack>
        <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 28, md: 40 }, lineHeight: 1.1, letterSpacing: '-.02em' }}>
          We deliver daily across the GTA, Hamilton &amp; Niagara
        </Typography>
        <Typography sx={{ mt: 1.5, opacity: 0.85, maxWidth: 520 }}>
          Scheduled routes six days a week. Frozen, dairy and meat travel cold-chain in temperature-controlled trucks.
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 2.5 }}>
          {regions.map((r) => (
            <Chip key={r} icon={<PlaceRounded />} label={r} sx={{ bgcolor: 'rgba(255,255,255,.1)', color: '#fff', border: '1px solid rgba(255,255,255,.18)', '& .MuiChip-icon': { color: c.saffron, fontSize: 16 } }} />
          ))}
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2.5, fontSize: 13.5 }}>
          <AcUnitRounded sx={{ fontSize: 18, color: '#9CC8FF' }} />
          <span>Cold-chain from dock to your walk-in</span>
        </Stack>
      </Box>
      <Box sx={{ position: 'relative', minHeight: { xs: 200, md: 'auto' } }}>
        <Box component="img" src={photo('aisle', 1000)} alt="Warehouse aisles at the Mississauga cash & carry" loading="lazy" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <Box sx={{ position: 'absolute', inset: 0, background: { xs: `linear-gradient(180deg, ${c.navyDark} 0%, rgba(27,25,80,.2) 40%)`, md: `linear-gradient(90deg, ${c.navyDark} 0%, rgba(27,25,80,.15) 45%)` } }} />
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

export function BrandStrip() {
  return (
    <Box>
      <SectionHeader eyebrow="Trusted kitchen brands" title="Shop by brand" action="All brands" href="/brands" />
      <Box
        className="no-scrollbar"
        sx={{
          display: 'grid', gridAutoFlow: 'column', gridAutoColumns: { xs: '40%', sm: '26%', md: '16%', lg: '12%' }, gap: { xs: 1.25, md: 1.5 },
          overflowX: 'auto', scrollSnapType: 'x mandatory', mx: { xs: -2, md: 0 }, px: { xs: 2, md: 0 }, scrollPaddingInline: { xs: 16, md: 0 }, '& > *': { scrollSnapAlign: 'start' },
        }}
      >
        {brands.slice(0, 16).map((b) => <BrandTile key={b.slug} name={b.name} size="sm" />)}
      </Box>
    </Box>
  )
}

/* ------------------------------------------------------------------ Offer cards */

export function OfferCards() {
  const cards = [
    { o: offers[0], bg: c.red, fg: '#fff', accent: c.saffron, img: photo('steak', 600, 600) },
    { o: offers[1], bg: c.navy, fg: '#fff', accent: c.saffron, img: photo('coke', 600, 600) },
    { o: offers[2], bg: '#FFF4D6', fg: c.ink, accent: c.red, img: photo('spread', 600, 600) },
  ]
  return (
    <Box>
      <SectionHeader
        eyebrow={<Stack direction="row" gap={1} flexWrap="wrap" alignItems="center" component="span"><span>Warehouse deals</span><NewFeatureTag label="Offer data" note="offer price, validity dates and warehouse per deal" /></Stack>}
        title="This week’s offers"
        action="See all"
        href="/flyers-offers"
      />
      <Box sx={{ display: 'grid', gap: { xs: 1.5, md: 2 }, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' } }}>
        {cards.map(({ o, bg, fg, accent, img }) => {
          const p = productBySku(o.sku)!
          const off = Math.round((1 - o.offerPrice / o.regular) * 100)
          return (
            <Box key={o.id} sx={{ position: 'relative', overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 120px', alignItems: 'stretch', borderRadius: `${tokens.radius.xl}px`, bgcolor: bg, color: fg, minHeight: 200 }}>
              <Box sx={{ p: { xs: 2.5, md: 3 }, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="overline" sx={{ color: accent }}>{o.deal}{o.note ? ` · ${o.note}` : ''}</Typography>
                <Typography sx={{ fontWeight: 700, fontSize: 16, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.name}</Typography>
                <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mt: 1.5 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 30, letterSpacing: '-.02em' }}>{money(o.offerPrice)}</Typography>
                  <Typography sx={{ textDecoration: 'line-through', opacity: 0.75, fontSize: 14 }}>{money(o.regular)}</Typography>
                </Stack>
                <Box sx={{ mt: 'auto', pt: 2 }}>
                  <Button
                    component={RouterLink}
                    to="/flyers-offers"
                    variant="contained"
                    endIcon={<ArrowForwardRounded />}
                    sx={fg === '#fff' ? { bgcolor: '#fff', color: bg, '&:hover': { bgcolor: '#F3F4F6' } } : {}}
                  >
                    Save {off}%
                  </Button>
                </Box>
              </Box>
              <Box sx={{ position: 'relative' }}>
                <Box component="img" src={img} alt="" loading="lazy" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>
            </Box>
          )
        })}
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

/* ------------------------------------------------------------------ App band */

export function AppBand() {
  return (
    <Box
      sx={{
        position: 'relative', overflow: 'hidden', borderRadius: `${tokens.radius.xl}px`, p: { xs: 3, md: 5 },
        background: `linear-gradient(120deg, ${c.red} 0%, ${c.redDark} 100%)`, color: '#fff',
        display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1.4fr 1fr' }, alignItems: 'center',
      }}
    >
      <Box sx={{ position: 'absolute', right: { xs: -60, md: 40 }, bottom: -40, opacity: 0.12 }}><Crown size={300} color="#fff" /></Box>
      <Box sx={{ position: 'relative' }}>
        <Typography variant="overline" sx={{ color: '#FFE3E0' }}>MySupreme app · iOS &amp; Android</Typography>
        <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 26, md: 36 }, lineHeight: 1.12, letterSpacing: '-.02em', mt: 0.5 }}>
          Reorder from the walk-in. Scan a case, tap, done.
        </Typography>
        <Typography sx={{ mt: 1.5, opacity: 0.92, maxWidth: 520 }}>
          Your usuals, invoices and delivery tracking in your pocket — built for busy kitchen staff.
        </Typography>
      </Box>
      <Stack direction="row" flexWrap="wrap" gap={1.5} sx={{ position: 'relative', justifySelf: { md: 'end' } }}>
        <StoreBadge store="apple" />
        <StoreBadge store="google" />
      </Stack>
    </Box>
  )
}
