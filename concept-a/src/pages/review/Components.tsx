import { useEffect, useState, type ReactNode } from 'react'
import {
  Alert, AlertTitle, Box, Breadcrumbs as MuiBreadcrumbs, Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControlLabel, IconButton, InputAdornment, Link, LinearProgress, MenuItem, Pagination, Radio, RadioGroup, Skeleton, Stack, TextField, Typography,
  Autocomplete,
} from '@mui/material'
import AddShoppingCartRounded from '@mui/icons-material/AddShoppingCartRounded'
import CheckRounded from '@mui/icons-material/CheckRounded'
import FavoriteBorderRounded from '@mui/icons-material/FavoriteBorderRounded'
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded'
import TuneRounded from '@mui/icons-material/TuneRounded'
import VisibilityRounded from '@mui/icons-material/VisibilityRounded'
import VisibilityOffRounded from '@mui/icons-material/VisibilityOffRounded'
import PlaceOutlined from '@mui/icons-material/PlaceOutlined'
import MicRounded from '@mui/icons-material/MicRounded'
import CloudUploadOutlined from '@mui/icons-material/CloudUploadOutlined'
import SearchRounded from '@mui/icons-material/SearchRounded'
import ShoppingCartOutlined from '@mui/icons-material/ShoppingCartOutlined'
import ReceiptLongOutlined from '@mui/icons-material/ReceiptLongOutlined'
import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined'
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded'
import NavigateNextRounded from '@mui/icons-material/NavigateNextRounded'
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded'
import { tokens } from '../../theme'
import { departments, money, photo, productBySku, products, promoTiles, type Product } from '../../data/catalog'
import { addresses, invoices } from '../../data/account'
import { AppStateProvider, useApp } from '../../state/AppState'
import { AddToCart, Price, ProductCard, ProductCardSkeleton, ProductRail, QtyStepper, WishlistButton } from '../../components/Commerce'
import { Logo } from '../../components/Brand'
import SearchBar from '../../components/SearchBar'
import { Container, EmptyState, NewFeatureTag, PackChip, Panel, Sku, StatusChip, type StatusKind } from '../../components/ui'
import { AddressCard, Breadcrumbs, DataTable, type Column } from '../../components/Shared'
import { AddressForm, CartLineItem, CheckoutStepper, OrderSummary } from '../../components/CheckoutParts'
import { FilterPanel, AppliedChips, emptyFilters, type FilterState } from '../shop/listing/Filters'
import { PromoTile } from '../shop/home/Hero'
import { BrandTile, CategoryTile } from '../shop/home/Sections'
import { Demo, DemoGrid, LibSection, Swatch, contrast, forceFocus, forceHover } from './parts/LibraryParts'
import { FileDrop } from '../company/parts/CompanyParts'

const c = tokens.color
const P = (sku: string) => productBySku(sku) as Product

/** Renders children inside an isolated state scope so a specimen can show guest vs signed-in side by side. */
function Scope({ signedIn, children }: { signedIn: boolean; children: ReactNode }) {
  return (
    <AppStateProvider>
      <ScopeInner signedIn={signedIn}>{children}</ScopeInner>
    </AppStateProvider>
  )
}
function ScopeInner({ signedIn, children }: { signedIn: boolean; children: ReactNode }) {
  const { review, setReview } = useApp()
  useEffect(() => { if (review.signedIn !== signedIn) setReview({ signedIn }) }, [signedIn, review.signedIn, setReview])
  return review.signedIn === signedIn ? <>{children}</> : null
}

const sections = [
  ['tokens', 'Design tokens'],
  ['product-card', 'Product card'],
  ['price', 'Price'],
  ['qty', 'Quantity + Add to cart'],
  ['buttons', 'Buttons'],
  ['search', 'Search bar + dropdown'],
  ['mega', 'Mega menu / mobile drawer'],
  ['breadcrumbs', 'Breadcrumbs'],
  ['filters', 'Filter panel + chips'],
  ['sort', 'Sort select, pagination'],
  ['carousel', 'Carousel / slider'],
  ['banner', 'Banner / promo tile'],
  ['tiles', 'Category tile, brand tile'],
  ['cart-line', 'Cart line item'],
  ['summary', 'Order summary'],
  ['address', 'Address card'],
  ['forms', 'Form fields'],
  ['stepper', 'Stepper'],
  ['status', 'Status chip'],
  ['table', 'Data table / list'],
  ['feedback', 'Feedback'],
] as const

/* ================================================================== Tokens */

function Tokens() {
  const colours: [string, string, string][] = [
    ['Brand red', c.brandRed, 'Crown & logo only — not for text'],
    ['Red (primary)', c.red, 'Buttons, links, sale prices'],
    ['Red dark', c.redDark, 'Hover / pressed'],
    ['Red tint', c.redTint, 'Soft fills, icon tiles'],
    ['Navy (secondary)', c.navy, 'Wordmark, headings, focus'],
    ['Navy dark', c.navyDark, 'Footer, dark bands'],
    ['Navy tint', c.navyTint, 'Pack chip, selected'],
    ['Saffron', c.saffron, 'Deal accent on navy only'],
    ['Ink', c.ink, 'Primary text'],
    ['Text 2', c.text2, 'Secondary text'],
    ['Text 3', c.text3, 'Captions, SKU'],
    ['Line', c.line, 'Borders, dividers'],
    ['Surface 2', c.surface2, 'Placeholders, skeletons'],
    ['Success', c.success, 'Fills & icons only'],
    ['Success text', c.successText, 'Delivered, Paid'],
    ['Warning', c.warning, 'Pending, Partial'],
    ['Info', c.info, 'Confirmed, Open'],
    ['Error', c.error, 'Overdue, errors'],
  ]
  const type: [string, string, string][] = [
    ['h1', '800 · 32–52px fluid', 'Everything your kitchen runs on'],
    ['h2', '700 · 24–36px fluid', 'Recommended for your kitchen'],
    ['h3', '700 · 20–26px fluid', 'Order summary'],
    ['h4', '700 · 20px', 'Spice Route Kitchen'],
    ['h5', '600 · 17px', 'Delivery method'],
    ['body1', '400 · 15px / 1.6', 'Same-day or next-day across the GTA, Hamilton & Niagara.'],
    ['body2', '400 · 14px / 1.55', 'Cold-chain from our dock to your walk-in.'],
    ['caption', '400 · 12px', 'Prices in CAD, before HST'],
    ['overline', '600 · 12px · .12em', 'FRESH THIS WEEK'],
  ]
  return (
    <>
      <Typography variant="h4" sx={{ mb: 1.5 }}>Colour</Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>Contrast ratios are computed live (WCAG 2.1). Text-bearing red uses <b>#D50000</b> (5.5:1 with white); the brighter #FF0000 stays on the crown.</Typography>
      <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4,1fr)', xl: 'repeat(6,1fr)' } }}>
        {colours.map(([n, h, u]) => <Swatch key={n} name={n} hex={h} use={u} />)}
      </Box>
      <Panel sx={{ mt: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Red button contrast check</Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          {[[c.red, 'Primary button'], [c.redDark, 'Hover'], ['#FF0000', 'Today (#FF0000)'], ['#FF413D', 'Today (#FF413D)']].map(([bg, l]) => {
            const r = contrast('#FFFFFF', bg)
            return (
              <Stack key={l} direction="row" spacing={1.5} alignItems="center">
                <Box sx={{ bgcolor: bg, color: '#fff', px: 2, py: 1.25, borderRadius: `${tokens.radius.sm}px`, fontWeight: 600, fontSize: 14 }}>Add to cart</Box>
                <Box sx={{ fontSize: 12.5 }}><b>{l}</b><br /><Box component="span" sx={{ color: r >= 4.5 ? c.successText : c.error, fontWeight: 700 }}>{r.toFixed(2)}:1 {r >= 4.5 ? 'pass' : 'fail AA'}</Box></Box>
              </Stack>
            )
          })}
        </Stack>
      </Panel>

      <Typography variant="h4" sx={{ mt: 4, mb: 1.5 }}>Type — Poppins (+ JetBrains Mono for SKUs)</Typography>
      <Panel sx={{ p: 0 }}>
        {type.map(([v, spec, sample], i) => (
          <Box key={v} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '120px 200px 1fr' }, gap: { xs: 0.5, md: 2 }, alignItems: 'center', px: 2.5, py: 1.75, borderTop: i ? `1px solid ${c.line}` : 0 }}>
            <Typography sx={{ fontFamily: tokens.font.mono, fontSize: 12.5, color: c.red }}>{v}</Typography>
            <Typography variant="caption" color="text.secondary">{spec}</Typography>
            <Typography variant={v as 'h1'} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sample}</Typography>
          </Box>
        ))}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '120px 200px 1fr' }, gap: { xs: 0.5, md: 2 }, alignItems: 'center', px: 2.5, py: 1.75, borderTop: `1px solid ${c.line}` }}>
          <Typography sx={{ fontFamily: tokens.font.mono, fontSize: 12.5, color: c.red }}>sku</Typography>
          <Typography variant="caption" color="text.secondary">JetBrains Mono 500 · 11.5px</Typography>
          <Box sx={{ maxWidth: 200 }}><Sku sku="59620000008478349" /></Box>
        </Box>
      </Panel>

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, mt: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ mb: 1.5 }}>Radius</Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            {Object.entries(tokens.radius).map(([k, v]) => (
              <Box key={k} sx={{ textAlign: 'center' }}>
                <Box sx={{ width: 72, height: 72, bgcolor: c.navyTint, border: `2px solid ${c.navy}`, borderRadius: `${Math.min(v, 36)}px` }} />
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}><b>{k}</b> {v === 999 ? 'pill' : `${v}px`}</Typography>
              </Box>
            ))}
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>xs inputs-small · sm buttons/inputs · md cards · lg panels · xl bands · pill chips</Typography>
        </Box>
        <Box>
          <Typography variant="h4" sx={{ mb: 1.5 }}>Spacing (MUI 8px base)</Typography>
          <Stack spacing={0.75}>
            {[0.5, 1, 1.5, 2, 3, 4, 6, 8, 10].map((s) => (
              <Stack key={s} direction="row" spacing={1.5} alignItems="center">
                <Typography sx={{ fontFamily: tokens.font.mono, fontSize: 12, width: 96, flexShrink: 0 }}>{s} · {s * 8}px</Typography>
                <Box sx={{ height: 12, width: s * 8 * 2, bgcolor: c.red, borderRadius: 1, opacity: 0.85 }} />
              </Stack>
            ))}
          </Stack>
        </Box>
        <Box>
          <Typography variant="h4" sx={{ mb: 1.5 }}>Shadows</Typography>
          <Stack direction="row" spacing={2}>
            {Object.entries(tokens.shadow).map(([k, v]) => (
              <Box key={k} sx={{ flex: 1, height: 90, bgcolor: '#fff', borderRadius: `${tokens.radius.md}px`, boxShadow: v, display: 'grid', placeItems: 'center', fontWeight: 600, fontSize: 13 }}>{k}</Box>
            ))}
          </Stack>
        </Box>
        <Box>
          <Typography variant="h4" sx={{ mb: 1.5 }}>Breakpoints</Typography>
          <Stack spacing={0.75}>
            {[['xs', 0, 'Phone (designed at 390)'], ['sm', 500, 'Large phone'], ['md', 800, 'Tablet — filter sidebar, tables'], ['lg', 1100, 'Desktop header + category bar'], ['xl', 1500, 'Container max width']].map(([k, v, d]) => (
              <Box key={k as string} sx={{ display: 'grid', gridTemplateColumns: '84px 1fr', gap: 1.5, alignItems: 'center' }}>
                <Typography sx={{ fontFamily: tokens.font.mono, fontSize: 12 }}>{k} {v}</Typography>
                <Box>
                  <Box sx={{ height: 8, width: `${Math.max(3, ((v as number) / 1500) * 100)}%`, bgcolor: c.navy, borderRadius: 1 }} />
                  <Typography variant="caption" color="text.secondary">{d}</Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </>
  )
}

/* ================================================================== Small static mocks */

const staticBtn = (content: ReactNode, sx: object = {}) => (
  <Button variant="contained" disabled sx={{ flex: 1, '&.Mui-disabled': { bgcolor: c.red, color: '#fff' }, ...sx }}>{content}</Button>
)

function MegaMock() {
  const d = departments[0]
  return (
    <Box sx={{ bgcolor: '#fff', border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.md}px`, overflow: 'hidden' }}>
      <Stack direction="row" spacing={2.5} sx={{ px: 2, borderBottom: `1px solid ${c.line}`, overflowX: 'auto', fontSize: 13.5, fontWeight: 600 }} className="no-scrollbar">
        {['Home', ...departments.slice(0, 6).map((x) => x.name)].map((n, i) => (
          <Box key={n} sx={{ py: 1.5, whiteSpace: 'nowrap', color: i === 1 ? c.red : c.ink, borderBottom: `3px solid ${i === 1 ? c.red : 'transparent'}` }}>{n}</Box>
        ))}
      </Stack>
      <Box sx={{ p: 2.5, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 200px' }, gap: 3 }}>
        <Box sx={{ columnCount: { xs: 2, md: 4 }, columnGap: 3 }}>
          {d.children.slice(0, 8).map((s) => (
            <Box key={s.slug} sx={{ breakInside: 'avoid', mb: 1.5 }}>
              <Typography sx={{ fontWeight: 600, fontSize: 13.5 }}>{s.name} <Box component="span" sx={{ color: c.text3, fontWeight: 400, fontSize: 11.5 }}>{s.count}</Box></Typography>
              {s.children?.slice(0, 3).map((l) => <Typography key={l.slug} sx={{ fontSize: 12.5, color: c.text2, py: 0.25 }}>{l.name}</Typography>)}
            </Box>
          ))}
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'block' }, borderRadius: `${tokens.radius.md}px`, overflow: 'hidden', position: 'relative', minHeight: 160, bgcolor: c.navy }}>
          <Box component="img" src={d.image} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7, position: 'absolute' }} />
          <Typography sx={{ position: 'absolute', left: 12, bottom: 10, color: '#fff', fontWeight: 700 }}>Shop all Packaging</Typography>
        </Box>
      </Box>
    </Box>
  )
}

function DrawerMock({ drill }: { drill?: boolean }) {
  const d = departments[1]
  return (
    <Box sx={{ width: '100%', maxWidth: 320, mx: 'auto', bgcolor: '#fff', border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.md}px`, overflow: 'hidden', boxShadow: tokens.shadow.hover }}>
      <Stack direction="row" alignItems="center" sx={{ px: 1.5, minHeight: 52, borderBottom: `1px solid ${c.line}` }}>
        {drill ? <Typography sx={{ fontWeight: 600, fontSize: 14 }}>‹ All departments</Typography> : <Logo compact />}
      </Stack>
      {(drill ? d.children.slice(0, 5).map((s) => [s.name, String(s.count)]) : departments.slice(0, 5).map((x) => [x.name, `${x.count.toLocaleString()} products`])).map(([n, m]) => (
        <Stack key={n} direction="row" alignItems="center" sx={{ px: 2, minHeight: 52, borderBottom: `1px solid ${c.line}` }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{n}</Typography>
            {!drill && <Typography variant="caption" color="text.secondary">{m}</Typography>}
          </Box>
          {drill ? <Typography variant="caption" color="text.secondary">{m}</Typography> : <ChevronRightRounded sx={{ color: c.text3 }} />}
        </Stack>
      ))}
    </Box>
  )
}

function MobileStackMock() {
  return (
    <Stack spacing={1.25} sx={{ maxWidth: 360 }}>
      {invoices.slice(0, 2).map((r) => (
        <Box key={r.number} sx={{ p: 2, bgcolor: '#fff', border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.md}px` }}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}><Typography sx={{ fontWeight: 700 }}>{r.number}</Typography><StatusChip status={r.status} /></Stack>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
            {[['Date', r.date], ['Due', r.due], ['Amount', money(r.amount)], ['Balance', money(r.balance)]].map(([k, v]) => (
              <Box key={k}><Typography sx={{ fontSize: 11, color: c.text3, textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 }}>{k}</Typography><Typography sx={{ fontSize: 13.5 }}>{v}</Typography></Box>
            ))}
          </Box>
          <Button size="small" startIcon={<FileDownloadOutlined />} variant="outlined" color="secondary" sx={{ mt: 1.5 }}>Invoice PDF</Button>
        </Box>
      ))}
    </Stack>
  )
}

/* ================================================================== Page */

export default function Components() {
  const { toast } = useApp()
  const [active, setActive] = useState<string>('tokens')
  const [dialog, setDialog] = useState(false)
  const [pw, setPw] = useState(false)
  const [filters, setFilters] = useState<FilterState>({ ...emptyFilters(), brand: ['Monin', 'Nestle'], sub: ['Syrups & Mixers'] })
  const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' }>({ key: 'date', dir: 'desc' })
  const [page, setPage] = useState(2)
  const [selAddr, setSelAddr] = useState('a1')

  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-220px 0px -65% 0px' })
    sections.forEach(([id]) => { const el = document.getElementById(id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [])

  const facet = (vals: string[]) => vals.map((v, i) => ({ value: v, count: [46, 31, 24, 18, 12, 9, 7, 5, 4, 3, 2, 2][i] ?? 1 }))
  const invCols: Column<(typeof invoices)[number]>[] = [
    { key: 'number', label: 'Invoice', render: (r) => <b>{r.number}</b>, sortable: true },
    { key: 'date', label: 'Date', render: (r) => r.date, sortable: true },
    { key: 'due', label: 'Due', render: (r) => r.due, sortable: true },
    { key: 'amount', label: 'Amount', render: (r) => money(r.amount), align: 'right', sortable: true },
    { key: 'status', label: 'Status', render: (r) => <StatusChip status={r.status} /> },
  ]
  const sortedInv = [...invoices].sort((a, b) => {
    const k = sort.key as keyof (typeof invoices)[number]
    const r = a[k] > b[k] ? 1 : -1
    return sort.dir === 'asc' ? r : -r
  })
  const sampleLines = [{ sku: 'A905', qty: 4 }, { sku: '59620000008252936', qty: 6 }, { sku: 'GR1001', qty: 2 }]
  const statuses: StatusKind[] = ['Pending', 'Confirmed', 'On the way', 'Delivered', 'Cancelled', 'Paid', 'Partial', 'Overdue', 'Open', 'Accepted', 'Applied']

  return (
    <Container sx={{ pt: { xs: 3, md: 5 } }}>
      <Box sx={{ mb: { xs: 3, md: 5 } }}>
        <Typography variant="overline" sx={{ color: c.red }}>Concept A · “Pro Counter”</Typography>
        <Typography variant="h1">Component library</Typography>
        <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 760 }}>
          The 20 shared components from the brief, each with its variants and states, plus the design tokens. Every page in the prototype is assembled from these — named to match the brief so the build team can map them 1:1 to MUI v5 components.
        </Typography>
      </Box>
      <Box sx={{ display: 'grid', gap: 5, gridTemplateColumns: { xs: '1fr', lg: '230px minmax(0,1fr)' }, alignItems: 'start' }}>
        <Box component="nav" aria-label="Components" sx={{ display: { xs: 'none', lg: 'block' }, position: 'sticky', top: 220, maxHeight: 'calc(100vh - 240px)', overflowY: 'auto' }}>
          <Stack sx={{ borderLeft: `2px solid ${c.line}` }}>
            {sections.map(([id, t], i) => (
              <Box key={id} component="a" href={`#/review/components`} onClick={(e: React.MouseEvent) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }}
                sx={{ py: 0.7, pl: 1.75, ml: '-2px', fontSize: 13.5, textDecoration: 'none', borderLeft: `2px solid ${active === id ? c.red : 'transparent'}`, color: active === id ? c.red : c.text2, fontWeight: active === id ? 600 : 400, '&:hover': { color: c.ink } }}>
                {i > 0 && <Box component="span" sx={{ fontFamily: tokens.font.mono, fontSize: 11, color: c.text3, mr: 1 }}>{String(i).padStart(2, '0')}</Box>}{t}
              </Box>
            ))}
          </Stack>
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <LibSection id="tokens" title="Design tokens"><Tokens /></LibSection>

          <LibSection id="product-card" n={1} title="Product card" usedOn="Home, listings, PDP carousels, wishlist, flyers"
            note="Square image, brand, 2-line clamped name (full name on hover tooltip and PDP), mono SKU that never breaks the layout, pack-size chip, price, wishlist heart and quantity + Add to cart. Try Add on the first card to see adding → added.">
            <DemoGrid min={210}>
              <Demo label="Photo · live add" bg={c.bg}><ProductCard product={P('GR1001')} /></Demo>
              <Demo label="Placeholder image" bg={c.bg}><ProductCard product={P('HD0031')} /></Demo>
              <Demo label="On sale + long name" bg={c.bg}><ProductCard product={P('A905')} /></Demo>
              <Demo label="17-digit SKU · sale" bg={c.bg}><ProductCard product={P('59620000008252936')} /></Demo>
              <Demo label="Out of stock" bg={c.bg}><ProductCard product={P('CD0219')} /></Demo>
              <Demo label="Configurable → View options" bg={c.bg}><ProductCard product={P('PK0778')} /></Demo>
              <Demo label="Logged-out price" bg={c.bg}><Scope signedIn={false}><ProductCard product={P('59620000008478349')} /></Scope></Demo>
              <Demo label="Customer-group price" bg={c.bg}><Scope signedIn><ProductCard product={P('59620000008478349')} /></Scope></Demo>
              <Demo label="Loading skeleton" bg={c.bg}><ProductCardSkeleton /></Demo>
              <Demo label="Hover (lift + shadow)" bg={c.bg}><ProductCard product={P('MT0011')} sx={{ boxShadow: tokens.shadow.hover, transform: 'translateY(-2px)', borderColor: 'transparent' }} /></Demo>
            </DemoGrid>
            <Box sx={{ mt: 2.5 }}>
              <Demo label="Variant · list row (dense pro view)" bg={c.bg}>
                <Stack spacing={1}>
                  <ProductCard product={P('PK1120')} variant="list" />
                  <ProductCard product={P('BW0028')} variant="list" />
                </Stack>
              </Demo>
            </Box>
            <Box sx={{ mt: 2.5 }}>
              <Demo label="Variant · carousel (narrow)" bg={c.bg}>
                <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 180px)' } }}>
                  {['BM0089', 'PR0101', 'FZ0101', 'DA0044'].map((s) => <ProductCard key={s} product={P(s)} variant="carousel" />)}
                </Box>
              </Demo>
            </Box>
          </LibSection>

          <LibSection id="price" n={2} title="Price" usedOn="Everywhere">
            <DemoGrid min={200}>
              <Demo label="Regular"><Price product={P('BM0089')} /></Demo>
              <Demo label="Sale (old price + % off)"><Price product={P('59620000008252936')} showUnit={false} /></Demo>
              <Demo label="Customer-group price"><Scope signedIn><Price product={P('HD0031')} /></Scope></Demo>
              <Demo label="Guest — business price locked"><Scope signedIn={false}><Price product={P('HD0031')} /></Scope></Demo>
              <Demo label="“From” price (configurable)"><Price product={P('PK0778')} /></Demo>
              <Demo label="Per-unit price"><Price product={P('59620000008478332')} /><Box sx={{ mt: 1 }}><NewFeatureTag note="unit-count attribute per product to compute $ / unit" /></Box></Demo>
              <Demo label="Large (PDP)"><Price product={P('A905')} size="lg" /></Demo>
            </DemoGrid>
          </LibSection>

          <LibSection id="qty" n={3} title="Quantity + Add to cart" usedOn="Cards, PDP, cart">
            <DemoGrid min={260}>
              <Demo label="Default (live)"><AddToCart product={P('BW0028')} /></Demo>
              <Demo label="Large (PDP)"><AddToCart product={P('GR2210')} size="lg" /></Demo>
              <Demo label="Disabled — out of stock"><AddToCart product={P('CD0219')} /></Demo>
              <Demo label="Loading"><Stack direction="row" spacing={1}><QtyStepper value={4} onChange={() => {}} size="sm" disabled />{staticBtn(<><CircularProgress size={16} sx={{ color: '#fff', mr: 1 }} />Adding…</>, { opacity: 0.85 })}</Stack></Demo>
              <Demo label="Success"><Stack direction="row" spacing={1}><QtyStepper value={1} onChange={() => {}} size="sm" />{staticBtn(<><CheckRounded sx={{ mr: 1 }} />Added</>, { '&.Mui-disabled': { bgcolor: c.successText, color: '#fff' } })}</Stack><Button size="small" sx={{ mt: 1 }} onClick={() => toast('Added 1 × Element O Water - 1Lt to cart')}>Show success toast</Button></Demo>
              <Demo label="Error — quantity limit"><Stack direction="row" spacing={1}><QtyStepper value={120} onChange={() => {}} size="sm" />{staticBtn(<><AddShoppingCartRounded sx={{ mr: 1 }} />Add</>)}</Stack><Typography sx={{ color: c.error, fontSize: 12, mt: 0.75 }}>Max 99 per order — call us for larger volumes</Typography></Demo>
              <Demo label="Configurable / grouped"><AddToCart product={P('MT0045')} /></Demo>
              <Demo label="Compact (carousel)"><AddToCart product={P('BM0089')} compact /></Demo>
            </DemoGrid>
          </LibSection>

          <LibSection id="buttons" n={4} title="Buttons" usedOn="All" note="44px minimum height (36px small for dense tables only). Focus ring is a 3px navy outline on every interactive element.">
            {[['Default', {}], ['Hover', forceHover], ['Focus', forceFocus]].map(([l, sx]) => (
              <Demo key={l as string} label={l as string} sx={{ mb: 2 }}>
                <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap alignItems="center" sx={sx as object}>
                  <Button variant="contained">Primary</Button>
                  <Button variant="outlined" color="secondary">Secondary</Button>
                  <Button sx={{ color: c.navy }} endIcon={<ArrowForwardRounded />}>Text</Button>
                  <IconButton aria-label="Favourite" sx={{ border: `1px solid ${c.line}`, width: 44, height: 44 }}><FavoriteBorderRounded /></IconButton>
                  <Button variant="contained" color="secondary" sx={{ borderRadius: 999 }}>Pill</Button>
                  <Button variant="outlined" color="inherit" sx={{ borderRadius: 999, borderColor: c.line, fontWeight: 500 }}>Filter pill</Button>
                </Stack>
              </Demo>
            ))}
            <Demo label="Disabled · loading · sizes">
              <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap alignItems="center">
                <Button variant="contained" disabled>Disabled</Button>
                <Button variant="outlined" disabled>Disabled</Button>
                <Button variant="contained" disabled startIcon={<CircularProgress size={16} sx={{ color: '#fff' }} />} sx={{ '&.Mui-disabled': { bgcolor: c.red, color: '#fff', opacity: 0.85 } }}>Placing order…</Button>
                <Button variant="contained" size="small">Small</Button>
                <Button variant="contained" size="large">Large</Button>
              </Stack>
            </Demo>
          </LibSection>

          <LibSection id="search" n={5} title="Search bar + dropdown" usedOn="Header" note="Live: focus the field to see trending terms, type “monin” or a SKU like “BM0089” for results with loading skeletons, or a nonsense word for no-results. Mic and camera open the voice and image dialogs.">
            <Demo label="Live" bg={c.bg} sx={{ mb: 2 }}><Box sx={{ maxWidth: 760, minHeight: 60 }}><SearchBar /></Box></Demo>
            <DemoGrid min={260}>
              <Demo label="Loading">
                {[0, 1, 2].map((i) => <Stack key={i} direction="row" spacing={1.5} sx={{ py: 0.75 }}><Skeleton variant="rounded" width={44} height={44} /><Box sx={{ flex: 1 }}><Skeleton width="80%" /><Skeleton width="40%" /></Box></Stack>)}
              </Demo>
              <Demo label="No results">
                <Typography variant="h6">No matches for “truffle caviar”</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>Check the SKU, try a brand, or search with a photo.</Typography>
                <Stack direction="row" gap={1} flexWrap="wrap">{['clamshell', 'monin syrup', 'basmati'].map((t) => <Button key={t} size="small" variant="outlined" sx={{ borderRadius: 999 }}>{t}</Button>)}</Stack>
              </Demo>
              <Demo label="Voice listening">
                <Stack alignItems="center" spacing={1} sx={{ py: 1 }}>
                  <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: c.red, color: '#fff', display: 'grid', placeItems: 'center', boxShadow: `0 0 0 10px ${c.redTint}` }}><MicRounded sx={{ fontSize: 30 }} /></Box>
                  <Typography sx={{ fontWeight: 700, mt: 1.5 }}>Listening…</Typography>
                  <Typography variant="caption" color="text.secondary">“Monin salted caramel”</Typography>
                </Stack>
              </Demo>
              <Demo label="Image upload dialog">
                <Box sx={{ border: `2px dashed ${c.line2}`, borderRadius: `${tokens.radius.md}px`, p: 2.5, textAlign: 'center', bgcolor: c.bg }}>
                  <CloudUploadOutlined sx={{ color: c.navy, fontSize: 34 }} />
                  <Typography sx={{ fontWeight: 600, fontSize: 14 }}>Drop a photo or tap to choose</Typography>
                  <Typography variant="caption" color="text.secondary">JPG, PNG, HEIC · 10 MB</Typography>
                </Box>
              </Demo>
            </DemoGrid>
          </LibSection>

          <LibSection id="mega" n={6} title="Mega menu / mobile drawer" usedOn="Header" note="Desktop (≥1100px): hover or focus a department to open columns of sub-categories, 3 levels deep, scrolling past ~10 groups, with a swappable promo card. Mobile: slide-in drawer with drill-down. Hover any department in the header above to try it live.">
            <Demo label="Desktop mega menu — open, active department" bg={c.bg} sx={{ mb: 2 }}><MegaMock /></Demo>
            <DemoGrid min={280}>
              <Demo label="Mobile drawer — departments" bg={c.bg}><DrawerMock /></Demo>
              <Demo label="Mobile drawer — drill-down" bg={c.bg}><DrawerMock drill /></Demo>
            </DemoGrid>
          </LibSection>

          <LibSection id="breadcrumbs" n={7} title="Breadcrumbs" usedOn="Listings, PDP">
            <Stack spacing={2}>
              <Demo label="Desktop — full trail"><Breadcrumbs items={[{ label: 'Packaging', to: '/c/packaging' }, { label: 'Take-out Containers', to: '/c/packaging' }, { label: 'Clamshells', to: '/c/packaging' }, { label: 'Eco-Craze – MFPP Clamshell Vented Cont. – 9"x5.5"x2.6" – A905' }]} /></Demo>
              <Demo label="Mobile — long trail truncated (middle collapses, last item ellipsizes)">
                <Box sx={{ maxWidth: 358 }}>
                  <MuiBreadcrumbs maxItems={3} itemsBeforeCollapse={1} itemsAfterCollapse={1} separator={<NavigateNextRounded sx={{ fontSize: 16 }} />} sx={{ fontSize: 13, '& ol': { flexWrap: 'nowrap' }, '& li': { minWidth: 0 } }}>
                    <Link href="#" sx={{ color: c.text2 }}>Home</Link>
                    <Link href="#" sx={{ color: c.text2 }}>Packaging</Link>
                    <Link href="#" sx={{ color: c.text2 }}>Take-out Containers</Link>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180 }}>Eco-Craze – MFPP Clamshell Vented Cont.</Typography>
                  </MuiBreadcrumbs>
                </Box>
              </Demo>
            </Stack>
          </LibSection>

          <LibSection id="filters" n={8} title="Filter panel + chips" usedOn="Listings" note="Checkbox lists with counts, price range, ‘show more’ after 6 options and search-within-filter for long lists (30+ brands). Left sidebar on desktop; the same panel fills a full-screen drawer on mobile with a sticky ‘Show N results’ button.">
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '300px 1fr' } }}>
              <Demo label="Expanded · applied (live)">
                <FilterPanel filters={filters} setFilters={setFilters}
                  subFacets={facet(['Syrups & Mixers', 'Soft Drinks', 'Coffee & Tea', 'Water', 'Juices'])}
                  brandFacets={facet(['Monin', 'Nestle', 'Coca Cola', 'Finest Call', 'Element O', 'Pepsi', 'Lipton', 'Aroy-D', 'Heinz', 'Kikkoman', 'Shan', 'MDH'])}
                  packFacets={facet(['1ltr', '24x1L in a case', '32x355ml', '10x20g', '1.8 kg'])}
                  inStockCount={268} />
              </Demo>
              <Stack spacing={2}>
                <Demo label="Applied chips + Clear all (live)"><AppliedChips filters={filters} setFilters={setFilters} /></Demo>
                <Demo label="Mobile trigger (opens full-screen drawer)">
                  <Stack direction="row" spacing={1}>
                    <Button variant="outlined" color="secondary" startIcon={<TuneRounded />} sx={{ flex: 1 }}>Filters · 3</Button>
                    <TextField select size="small" value="relevance" sx={{ flex: 1 }}><MenuItem value="relevance">Sort: Relevance</MenuItem></TextField>
                  </Stack>
                </Demo>
                <Demo label="Collapsed group">
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ minHeight: 48 }}><Typography sx={{ fontWeight: 600 }}>Brand</Typography><Typography variant="caption" color="text.secondary">28 options ⌄</Typography></Stack>
                </Demo>
              </Stack>
            </Box>
          </LibSection>

          <LibSection id="sort" n={9} title="Sort select, pagination" usedOn="Listings">
            <DemoGrid min={300}>
              <Demo label="Sort select">
                <TextField select fullWidth label="Sort by" defaultValue="relevance">
                  {[['relevance', 'Relevance'], ['name', 'Name A–Z'], ['price-asc', 'Price: low to high'], ['price-desc', 'Price: high to low']].map(([v, l]) => <MenuItem key={v} value={v}>{l}</MenuItem>)}
                </TextField>
              </Demo>
              <Demo label="Page numbers"><Pagination count={70} page={page} onChange={(_, p) => setPage(p)} color="primary" shape="rounded" siblingCount={0} sx={{ '& .MuiPaginationItem-root': { minWidth: 40, height: 40, fontWeight: 600 } }} /></Demo>
              <Demo label="Load more">
                <Typography variant="body2" color="text.secondary" align="center">Showing 24 of 1,672 products</Typography>
                <LinearProgress variant="determinate" value={(24 / 1672) * 100 * 10} sx={{ my: 1.5, height: 6, borderRadius: 3 }} />
                <Button fullWidth variant="outlined" color="secondary">Load 24 more</Button>
              </Demo>
            </DemoGrid>
          </LibSection>

          <LibSection id="carousel" n={10} title="Carousel / slider" usedOn="Home, PDP" note="Product rows scroll-snap with arrows on desktop and swipe on mobile; the previous arrow hides on the first slide and next on the last. Hero banners autoplay with dots and arrows, pause on hover/focus and never autoplay under reduced motion.">
            <Demo label="Product row — first slide (live, scroll to middle / last)" bg={c.bg} sx={{ mb: 2 }}><Box sx={{ px: { md: 3 } }}><ProductRail items={products.slice(0, 12)} /></Box></Demo>
            <DemoGrid min={220}>
              {['First', 'Middle', 'Last'].map((s, si) => (
                <Demo key={s} label={`Hero dots — ${s.toLowerCase()} slide`}>
                  <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ py: 1 }}>
                    <IconButton size="small" disabled={si === 0} sx={{ border: `1px solid ${c.line}` }}>‹</IconButton>
                    {[0, 1, 2].map((d) => <Box key={d} sx={{ width: d === si ? 28 : 8, height: 8, borderRadius: 999, bgcolor: d === si ? c.red : c.line2, transition: 'width .2s' }} />)}
                    <IconButton size="small" disabled={si === 2} sx={{ border: `1px solid ${c.line}` }}>›</IconButton>
                  </Stack>
                </Demo>
              ))}
            </DemoGrid>
          </LibSection>

          <LibSection id="banner" n={11} title="Banner / promo tile" usedOn="Home, flyers" note="Self-contained blocks a non-developer swaps in Magento Page Builder / Plasmic. Text is optional — the same slot accepts a pure image (1920×500 desktop + mobile crop).">
            <DemoGrid min={260}>
              <Demo label="Image + headline + CTA" pad={1}><Box sx={{ height: 220 }}><PromoTile t={promoTiles[0]} /></Box></Demo>
              <Demo label="Image + headline (tall)" pad={1}><Box sx={{ height: 220 }}><PromoTile t={promoTiles[1]} tall /></Box></Demo>
              <Demo label="Pure image from Magento" pad={1}>
                <Box component="img" src={photo('produceWall', 900, 500)} alt="Fresh produce — Shop produce" sx={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: `${tokens.radius.lg}px` }} />
              </Demo>
            </DemoGrid>
          </LibSection>

          <LibSection id="tiles" n={12} title="Category tile, brand tile" usedOn="Home, all-categories, brands">
            <DemoGrid min={170}>
              <Demo label="Category — with image">{<CategoryTile d={departments[2]} />}</Demo>
              <Demo label="Category — missing image">{<CategoryTile d={departments[8]} />}</Demo>
              <Demo label="Brand tile"><BrandTile name="Monin" /></Demo>
              <Demo label="Brand tile — long name"><BrandTile name="Lee Kum Kee" /></Demo>
              <Demo label="Brand tile — small"><BrandTile name="Cambro" size="sm" /></Demo>
            </DemoGrid>
          </LibSection>

          <LibSection id="cart-line" n={13} title="Cart line item" usedOn="Cart, mini summaries">
            <Stack spacing={2}>
              <Demo label="Idle (live stepper)"><CartLineItem line={{ sku: 'A905', qty: 4 }} /></Demo>
              <Demo label="Updating"><CartLineItem line={{ sku: 'GR1001', qty: 2 }} state="updating" /></Demo>
              <Demo label="Error — out of stock"><CartLineItem line={{ sku: 'CD0219', qty: 3 }} state="error" /></Demo>
              <Demo label="Compact (checkout summary)"><CartLineItem line={{ sku: '59620000008252936', qty: 6 }} compact /></Demo>
            </Stack>
          </LibSection>

          <LibSection id="summary" n={14} title="Order summary" usedOn="Cart, checkout">
            <DemoGrid min={300}>
              <Demo label="Default + coupon field" bg={c.bg}><OrderSummary lines={sampleLines} /></Demo>
              <Demo label="Coupon applied" bg={c.bg}><OrderSummary lines={sampleLines} coupon="applied" /></Demo>
              <Demo label="Coupon invalid" bg={c.bg}><OrderSummary lines={sampleLines} coupon="invalid" deliveryFee={15} /></Demo>
            </DemoGrid>
          </LibSection>

          <LibSection id="address" n={15} title="Address card" usedOn="Checkout, account">
            <DemoGrid min={260}>
              {addresses.map((a) => (
                <Demo key={a.id} label={a.id === selAddr ? 'Selected' : a.inArea === false ? 'Outside delivery area' : a.defaultShipping ? 'Default badges' : 'Selectable'}>
                  <AddressCard address={a} selected={a.id === selAddr} onSelect={() => setSelAddr(a.id)} onEdit={() => toast('Edit address dialog opens', 'info')} />
                </Demo>
              ))}
              <Demo label="Editing (inline form + Google autocomplete)" sx={{ gridColumn: '1 / -1' }}>
                <AddressForm initial={addresses[1]} onSubmit={() => toast('Address saved')} onCancel={() => toast('Edit cancelled', 'info')} />
              </Demo>
            </DemoGrid>
          </LibSection>

          <LibSection id="forms" n={16} title="Form fields" usedOn="Sign in, checkout, account, contact, supplier forms" note="Outlined MUI fields; react-hook-form + zod in the build. Labels always visible, errors in text + colour, focus is a 2px navy border.">
            <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', xl: '1fr 1fr 1fr' } }}>
              <TextField label="Business name" defaultValue="Spice Route Kitchen" />
              <TextField label="Email (focused)" defaultValue="priya@spiceroutekitchen.ca" focused />
              <TextField label="Phone" type="tel" defaultValue="+1 905-555-0182" />
              <TextField label="Password" type={pw ? 'text' : 'password'} defaultValue="kitchen2026" InputProps={{ endAdornment: <InputAdornment position="end"><IconButton aria-label={pw ? 'Hide password' : 'Show password'} onClick={() => setPw(!pw)} edge="end">{pw ? <VisibilityOffRounded /> : <VisibilityRounded />}</IconButton></InputAdornment> }} />
              <TextField label="HST number (error)" defaultValue="78452" error helperText="HST numbers are 15 characters, e.g. 78452 1190 RT0001" />
              <TextField label="Customer number (disabled)" defaultValue="C-004182" disabled />
              <TextField label="Postal code (success)" defaultValue="L5L 5Z5" helperText="✓ In our delivery area — next-day on Tue/Fri routes" FormHelperTextProps={{ sx: { color: c.successText, fontWeight: 600 } }} InputProps={{ endAdornment: <CheckCircleRounded sx={{ color: c.successText }} />, sx: { '& .MuiOutlinedInput-notchedOutline': { borderColor: `${c.successText} !important` } } }} />
              <TextField select label="Business category" defaultValue="Restaurant">
                {['Restaurant', 'Café', 'Caterer', 'Bakery', 'Food truck', 'Ghost kitchen'].map((x) => <MenuItem key={x} value={x}>{x}</MenuItem>)}
              </TextField>
              <Autocomplete
                options={['2150 Burnhamthorpe Rd W, Mississauga, ON L5L 5Z5', '2150 Dundas St E, Mississauga, ON L4X 1L9', '215 Lakeshore Rd E, Mississauga, ON L5G 1G2']}
                defaultValue="2150 Burnhamthorpe Rd W, Mississauga, ON L5L 5Z5"
                renderInput={(p) => <TextField {...p} label="Delivery address (Google Places)" InputProps={{ ...p.InputProps, startAdornment: <PlaceOutlined sx={{ color: c.text3, mr: 0.5 }} /> }} />}
              />
              <TextField label="Delivery notes" multiline minRows={3} defaultValue="Back door off the alley, ring the buzzer." sx={{ gridColumn: { md: 'span 2', xl: 'auto' } }} />
              <Box>
                <FormControlLabel control={<Checkbox defaultChecked />} label="Billing same as shipping" />
                <FormControlLabel control={<Checkbox />} label="Email me the weekly hot picks" />
                <FormControlLabel control={<Checkbox disabled />} label="Disabled option" disabled />
              </Box>
              <RadioGroup defaultValue="next">
                <FormControlLabel value="next" control={<Radio />} label="Next-day delivery · Free" />
                <FormControlLabel value="pickup" control={<Radio />} label="Pickup at Mississauga cash & carry" />
              </RadioGroup>
              <FileDrop label="File upload" hint="PDF, JPG or PNG · 10 MB" />
              <FileDrop label="File upload (error)" hint="PDF, XLSX or CSV" error="Please attach your catalogue" />
            </Box>
          </LibSection>

          <LibSection id="stepper" n={17} title="Stepper" usedOn="Checkout">
            <Stack spacing={2}>
              <Demo label="Shipping — current"><CheckoutStepper active={0} /></Demo>
              <Demo label="Payment — current, shipping done"><CheckoutStepper active={1} /></Demo>
              <Demo label="All done (success)"><CheckoutStepper active={2} /></Demo>
            </Stack>
          </LibSection>

          <LibSection id="status" n={18} title="Status chip" usedOn="Orders, invoices" note="Each status pairs a colour with an icon and its label — never colour alone.">
            <Stack direction="row" flexWrap="wrap" gap={1.25}>{statuses.map((s) => <StatusChip key={s} status={s} size="medium" />)}</Stack>
          </LibSection>

          <LibSection id="table" n={19} title="Data table / list" usedOn="Account (orders, invoices, payments, quotes)">
            <Demo label="Desktop — sortable (click headers) + download PDF action" bg={c.bg} sx={{ mb: 2 }}>
              <DataTable columns={invCols} rows={sortedInv.slice(0, 4)} rowKey={(r) => r.number} sort={sort}
                onSort={(k) => setSort((s) => ({ key: k, dir: s.key === k && s.dir === 'asc' ? 'desc' : 'asc' }))}
                mobileTitle={(r) => r.number} mobileAside={(r) => <StatusChip status={r.status} />}
                actions={() => <Button size="small" startIcon={<FileDownloadOutlined />} onClick={() => toast('INV-2047.pdf downloaded')}>PDF</Button>} />
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1.5 }}><Typography variant="body2" color="text.secondary">1–4 of 6</Typography><Pagination count={2} size="small" shape="rounded" /></Stack>
            </Demo>
            <DemoGrid min={300}>
              <Demo label="Mobile — stacked cards" bg={c.bg}><MobileStackMock /></Demo>
              <Demo label="Loading" bg={c.bg}><DataTable columns={invCols} rows={[]} rowKey={(r) => r.number} loading mobileTitle={(r) => r.number} /></Demo>
              <Demo label="Empty" bg={c.bg} pad={0}>
                <DataTable columns={invCols} rows={[]} rowKey={(r) => r.number} mobileTitle={(r) => r.number}
                  empty={<EmptyState icon={<ReceiptLongOutlined />} title="No invoices yet" body="Invoices appear here after your first delivered order." action="Start an order" href="/" />} />
              </Demo>
            </DemoGrid>
          </LibSection>

          <LibSection id="feedback" n={20} title="Feedback" usedOn="All" note="Toasts appear bottom-centre, clear of the two floating buttons and above sticky mobile bars.">
            <DemoGrid min={260}>
              <Demo label="Toast / snackbar (live)">
                <Stack spacing={1}>
                  <Button variant="contained" color="success" onClick={() => toast('Added 4 × Eco-Craze clamshells to cart')}>Success toast</Button>
                  <Button variant="contained" color="info" onClick={() => toast('Removed from Favorites', 'info')}>Info toast</Button>
                  <Button variant="contained" color="warning" onClick={() => toast('Only 3 cases left — order soon', 'warning')}>Warning toast</Button>
                  <Button variant="contained" color="error" onClick={() => toast('Payment declined — try another card', 'error')}>Error toast</Button>
                </Stack>
              </Demo>
              <Demo label="Dialog / modal">
                <Button variant="outlined" color="secondary" onClick={() => setDialog(true)}>Open dialog</Button>
                <Dialog open={dialog} onClose={() => setDialog(false)} maxWidth="xs" fullWidth>
                  <DialogTitle sx={{ fontWeight: 700 }}>Remove 4 items?</DialogTitle>
                  <DialogContent><Typography color="text.secondary">Eco-Craze – MFPP Clamshell Vented Cont. will be removed from your cart.</Typography></DialogContent>
                  <DialogActions sx={{ p: 2 }}><Button onClick={() => setDialog(false)}>Cancel</Button><Button variant="contained" onClick={() => { setDialog(false); toast('Item removed', 'info') }}>Remove</Button></DialogActions>
                </Dialog>
              </Demo>
              <Demo label="Skeleton loaders">
                <Stack direction="row" spacing={1.5}><Skeleton variant="circular" width={44} height={44} /><Box sx={{ flex: 1 }}><Skeleton width="60%" /><Skeleton width="90%" /></Box></Stack>
                <Skeleton variant="rounded" height={80} sx={{ mt: 1.5 }} />
                <Skeleton variant="rounded" height={44} sx={{ mt: 1 }} />
              </Demo>
              <Demo label="Empty-state block" pad={0}>
                <EmptyState icon={<ShoppingCartOutlined />} title="Your cart is empty" body="Reorder last week’s delivery or search 4,300+ products." action="Reorder last order" href="/account/orders" />
              </Demo>
            </DemoGrid>
            <Stack spacing={1.5} sx={{ mt: 2 }}>
              <Alert severity="success"><AlertTitle>Order #000132 placed</AlertTitle>Arriving Tue Oct 7, 9–11 AM.</Alert>
              <Alert severity="info">Prices shown are your business prices (customer group: Restaurant).</Alert>
              <Alert severity="warning">L5L 5Z5 is on our Tue/Fri route — order by 2 PM Monday for Tuesday delivery.</Alert>
              <Alert severity="error" action={<Button color="inherit" size="small">Change address</Button>}>We don’t deliver to Ottawa yet — choose pickup or another address.</Alert>
            </Stack>
          </LibSection>
          <Box sx={{ height: 40 }} />
        </Box>
      </Box>
    </Container>
  )
}

