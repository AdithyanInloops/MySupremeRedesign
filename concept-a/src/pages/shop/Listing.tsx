import { useEffect, useMemo, useState } from 'react'
import {
  Box, Button, Drawer, IconButton, LinearProgress, MenuItem, Select, Stack, ToggleButton, ToggleButtonGroup, Typography,
} from '@mui/material'
import { Link as RouterLink, useLocation, useParams, useSearchParams } from 'react-router-dom'
import TuneRounded from '@mui/icons-material/TuneRounded'
import GridViewRounded from '@mui/icons-material/GridViewRounded'
import ViewListRounded from '@mui/icons-material/ViewListRounded'
import CloseRounded from '@mui/icons-material/CloseRounded'
import SearchOffRounded from '@mui/icons-material/SearchOffRounded'
import PhotoCameraOutlined from '@mui/icons-material/PhotoCameraOutlined'
import WhatsApp from '@mui/icons-material/WhatsApp'
import TrendingUpRounded from '@mui/icons-material/TrendingUpRounded'
import QrCode2Rounded from '@mui/icons-material/QrCode2Rounded'
import { tokens } from '../../theme'
import {
  brands, departments, deptBySlug, photo, products, productsInDept, searchProducts, trendingSearches, recommended, type Product,
} from '../../data/catalog'
import { useApp } from '../../state/AppState'
import { Container, Panel, SectionHeader } from '../../components/ui'
import { ProductCard, ProductCardSkeleton, ProductRail } from '../../components/Commerce'
import { Breadcrumbs } from '../../components/Shared'
import NotFound from '../company/NotFound'
import { AppliedChips, FilterPanel, PRICE_MAX, activeCount, emptyFilters, type Facet, type FilterState } from './listing/Filters'

const c = tokens.color
const PAGE = 12

export const packType = (pack: string) => {
  const p = pack.toLowerCase()
  if (/\d\s*x\s*\d/.test(p) || p.includes('case')) return 'Case / multi-pack'
  if (/\b(ct|pcs|sets|rolls|bunches)\b/.test(p)) return 'Count (ct)'
  if (/(kg|lb|\bg\b|\dg)/.test(p)) return 'By weight'
  if (/(ltr|lt|\bl\b|ml|\dl)/.test(p)) return 'By volume'
  return 'Each'
}

type Sort = 'relevance' | 'name' | 'price-asc' | 'price-desc'

const facetOf = (items: Product[], key: (p: Product) => string): Facet[] => {
  const m = new Map<string, number>()
  items.forEach((p) => m.set(key(p), (m.get(key(p)) ?? 0) + 1))
  return [...m.entries()].map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count)
}

// Similar-looking pseudo-random "closest matches" for the image search demo.
const imageMatches = () => products.filter((p) => p.dept === 'beverage' || p.sub === 'Syrups & Mixers').slice(0, 8)

export default function Listing() {
  const { dept: deptSlug, term } = useParams()
  const [params] = useSearchParams()
  const loc = useLocation()
  const { review, priceFor } = useApp()
  const dept = deptSlug ? deptBySlug(deptSlug) : undefined
  const isSearch = !!term
  const imageMode = isSearch && params.get('mode') === 'image'
  const q = term ? decodeURIComponent(term) : ''

  const [filters, setFilters] = useState<FilterState>(() => ({ ...emptyFilters(), sub: params.get('sub') ? [params.get('sub')!] : [] }))
  const [sort, setSort] = useState<Sort>('relevance')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [drawer, setDrawer] = useState(false)
  const [limit, setLimit] = useState(PAGE)
  const [loadingMore, setLoadingMore] = useState(false)

  // Reset when the route changes (department / term / ?sub=)
  useEffect(() => {
    setFilters({ ...emptyFilters(), sub: params.get('sub') ? [params.get('sub')!] : [] })
    setLimit(PAGE)
  }, [loc.pathname, loc.search]) // eslint-disable-line react-hooks/exhaustive-deps

  const base = useMemo<Product[]>(() => {
    if (review.empty && isSearch) return []
    if (imageMode) return imageMatches()
    if (isSearch) return searchProducts(q)
    if (!dept) return []
    const own = productsInDept(dept.slug)
    if (own.length >= 10) return own
    // Prototype padding so a small dummy department still reads like a real 100+ product grid.
    return [...own, ...products.filter((p) => p.dept !== dept.slug).slice(0, 14 - own.length)]
  }, [dept, isSearch, imageMode, q, review.empty])

  const filtered = useMemo(() => {
    let r = base.filter((p) => {
      if (filters.sub.length && !filters.sub.includes(p.sub)) return false
      if (filters.brand.length && !filters.brand.includes(p.brand)) return false
      if (filters.pack.length && !filters.pack.includes(packType(p.pack))) return false
      const pr = priceFor(p)
      if (pr < filters.price[0] || (filters.price[1] < PRICE_MAX && pr > filters.price[1])) return false
      if (filters.inStock && p.stock === 'OUT_OF_STOCK') return false
      return true
    })
    if (sort === 'name') r = [...r].sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'price-asc') r = [...r].sort((a, b) => priceFor(a) - priceFor(b))
    if (sort === 'price-desc') r = [...r].sort((a, b) => priceFor(b) - priceFor(a))
    return r
  }, [base, filters, sort, priceFor])

  if (!isSearch && !dept) return <NotFound />

  // Facets (Magento aggregations). Sub-categories come from the category tree with real counts.
  const subFacets: Facet[] = dept
    ? dept.children.map((s) => ({ value: s.name, count: s.count }))
    : facetOf(base, (p) => p.sub)
  const own = facetOf(base, (p) => p.brand)
  const brandFacets: Facet[] = [
    ...own,
    // Prototype padding: real departments carry 25–40 brands; search facets only show brands that match.
    ...(isSearch ? [] : brands.filter((b) => !own.some((o) => o.value === b.name)).map((b, i) => ({ value: b.name, count: ((i * 7) % 23) + 2 }))),
  ]
  const packFacets = facetOf(base, (p) => packType(p.pack))
  const inStockCount = base.filter((p) => p.stock !== 'OUT_OF_STOCK').length

  const nActive = activeCount(filters)
  const total = !isSearch && dept && nActive === 0 ? dept.count : filtered.length
  const visible = filtered.slice(0, limit)
  const loading = review.loading

  const loadMore = () => {
    setLoadingMore(true)
    window.setTimeout(() => {
      setLimit((l) => l + PAGE)
      setLoadingMore(false)
    }, 700)
  }

  const panel = (
    <FilterPanel filters={filters} setFilters={setFilters} subFacets={subFacets} brandFacets={brandFacets} packFacets={packFacets} inStockCount={inStockCount} />
  )

  const noResults = !loading && isSearch && base.length === 0

  return (
    <Box>
      {/* -------------------------------------------------- Header band */}
      {dept && !isSearch && <CategoryHero deptSlug={dept.slug} total={dept.count} activeSub={filters.sub} onSub={(s) => setFilters({ ...filters, sub: filters.sub[0] === s ? [] : [s] })} />}
      {isSearch && !noResults && <SearchHeader q={q} imageMode={imageMode} count={filtered.length} />}

      {noResults ? (
        <NoResults q={q} />
      ) : (
        <Container sx={{ pt: { xs: 2, md: 3 } }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '272px minmax(0,1fr)' }, gap: { lg: 4 }, alignItems: 'start' }}>
            {/* -------------------------------------------------- Sidebar */}
            <Box component="aside" aria-label="Filters" sx={{ display: { xs: 'none', lg: 'block' }, position: 'sticky', top: 184, maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', pr: 1, pb: 4 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>Filters</Typography>
                {nActive > 0 && <Button size="small" onClick={() => setFilters(emptyFilters())} sx={{ color: c.red }}>Clear all</Button>}
              </Stack>
              {panel}
            </Box>

            {/* -------------------------------------------------- Results */}
            <Box sx={{ minWidth: 0 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <Button
                  variant="outlined"
                  color="inherit"
                  startIcon={<TuneRounded />}
                  onClick={() => setDrawer(true)}
                  sx={{ display: { lg: 'none' }, borderColor: c.line2, bgcolor: '#fff', flexShrink: 0 }}
                >
                  Filters{nActive ? ` (${nActive})` : ''}
                </Button>
                <Typography sx={{ fontSize: 14, color: c.text2, display: { xs: 'none', md: 'block' } }}>
                  <b style={{ color: c.ink }}>{total.toLocaleString()}</b> products
                </Typography>
                <Box sx={{ flex: 1 }} />
                <Select
                  size="small"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                  inputProps={{ 'aria-label': 'Sort products' }}
                  renderValue={(v) => (
                    <Box component="span" sx={{ fontSize: 14 }}>
                      <Box component="span" sx={{ color: c.text3, display: { xs: 'none', sm: 'inline' } }}>Sort: </Box>
                      {{ relevance: 'Relevance', name: 'Name A–Z', 'price-asc': 'Price: low to high', 'price-desc': 'Price: high to low' }[v as Sort]}
                    </Box>
                  )}
                  sx={{ minWidth: { xs: 0, sm: 220 }, height: 44, flexShrink: 1 }}
                >
                  <MenuItem value="relevance">Relevance</MenuItem>
                  <MenuItem value="name">Name A–Z</MenuItem>
                  <MenuItem value="price-asc">Price: low to high</MenuItem>
                  <MenuItem value="price-desc">Price: high to low</MenuItem>
                </Select>
                <ToggleButtonGroup
                  value={view}
                  exclusive
                  onChange={(_, v) => v && setView(v)}
                  aria-label="Layout"
                  sx={{ bgcolor: '#fff', flexShrink: 0, '& .MuiToggleButton-root': { width: 44, height: 44, border: `1px solid ${c.line2}` }, '& .Mui-selected': { bgcolor: `${c.navyTint} !important`, color: `${c.navy} !important` } }}
                >
                  <ToggleButton value="grid" aria-label="Grid view"><GridViewRounded fontSize="small" /></ToggleButton>
                  <ToggleButton value="list" aria-label="List view (pro)"><ViewListRounded fontSize="small" /></ToggleButton>
                </ToggleButtonGroup>
              </Stack>

              <AppliedChips filters={filters} setFilters={setFilters} />

              {loading ? (
                <Results view={view}>{Array.from({ length: 10 }).map((_, i) => <ProductCardSkeleton key={i} variant={view} />)}</Results>
              ) : filtered.length === 0 ? (
                <Panel sx={{ textAlign: 'center', py: 6 }}>
                  <Typography variant="h4">No products match these filters</Typography>
                  <Typography color="text.secondary" sx={{ mt: 1, mb: 2.5 }}>Try removing a brand or widening the price range.</Typography>
                  <Button variant="contained" onClick={() => setFilters(emptyFilters())}>Clear all filters</Button>
                </Panel>
              ) : (
                <>
                  <Results view={view}>
                    {visible.map((p) => <ProductCard key={p.sku} product={p} variant={view} />)}
                    {loadingMore && Array.from({ length: Math.min(PAGE, filtered.length - limit) || 4 }).map((_, i) => <ProductCardSkeleton key={`s${i}`} variant={view} />)}
                  </Results>
                  <Box sx={{ textAlign: 'center', mt: 4, mb: 2, maxWidth: 360, mx: 'auto' }}>
                    <Typography sx={{ fontSize: 13.5, color: c.text2, mb: 1 }}>
                      Showing <b>{Math.min(limit, filtered.length)}</b> of <b>{total.toLocaleString()}</b> products
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(100, (Math.min(limit, filtered.length) / Math.max(total, 1)) * 100)}
                      sx={{ height: 6, borderRadius: 3, bgcolor: c.line, '& .MuiLinearProgress-bar': { bgcolor: c.navy, borderRadius: 3 } }}
                    />
                    {limit < filtered.length && (
                      <Button variant="outlined" color="secondary" size="large" onClick={loadMore} disabled={loadingMore} sx={{ mt: 2.5, minWidth: 220 }}>
                        {loadingMore ? 'Loading…' : `Load ${Math.min(PAGE, filtered.length - limit)} more`}
                      </Button>
                    )}
                  </Box>
                </>
              )}
            </Box>
          </Box>
          {isSearch && !loading && (
            <Box component="section" sx={{ mt: { xs: 5, md: 7 } }}>
              <SectionHeader eyebrow="Often ordered together" title="You might also need" />
              <ProductRail items={recommended.filter((p) => !filtered.some((f) => f.sku === p.sku))} />
            </Box>
          )}
        </Container>
      )}

      {/* -------------------------------------------------- Mobile filter drawer */}
      <Drawer anchor="bottom" open={drawer} onClose={() => setDrawer(false)} sx={{ zIndex: 1300 }} PaperProps={{ sx: { height: '100%', display: 'flex', flexDirection: 'column' } }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, minHeight: 60, borderBottom: `1px solid ${c.line}` }}>
          <Typography variant="h4">Filters{nActive ? ` (${nActive})` : ''}</Typography>
          <IconButton aria-label="Close filters" onClick={() => setDrawer(false)}><CloseRounded /></IconButton>
        </Stack>
        <Box sx={{ flex: 1, overflowY: 'auto', px: 2, pt: 1 }}>
          <AppliedChips filters={filters} setFilters={setFilters} />
          {panel}
        </Box>
        <Stack direction="row" spacing={1.5} sx={{ p: 2, borderTop: `1px solid ${c.line}`, bgcolor: '#fff', pb: 'calc(16px + env(safe-area-inset-bottom))' }}>
          <Button variant="outlined" color="inherit" onClick={() => setFilters(emptyFilters())} sx={{ borderColor: c.line2, flex: 1 }}>Clear all</Button>
          <Button variant="contained" size="large" onClick={() => setDrawer(false)} sx={{ flex: 2 }}>Show {filtered.length} results</Button>
        </Stack>
      </Drawer>
    </Box>
  )
}

/** On narrow 2-up mobile grids the qty stepper + Add button don't fit side by side — stack them. */
function Results({ view, children }: { view: 'grid' | 'list'; children: React.ReactNode }) {
  return view === 'grid' ? (
    <Box sx={{ display: 'grid', gap: { xs: 1.25, md: 2 }, gridTemplateColumns: { xs: 'repeat(2,minmax(0,1fr))', md: 'repeat(3,minmax(0,1fr))', xl: 'repeat(4,minmax(0,1fr))' } }}>{children}</Box>
  ) : (
    <Stack
      spacing={1.25}
      sx={{
        // Thumbnail-sized placeholder: drop the caption and shrink the monogram.
        '& [role=img] > div:nth-of-type(2) > div:nth-of-type(2)': { display: 'none' },
        '& [role=img] > div:nth-of-type(2) > div:nth-of-type(1)': { width: 44, height: 44, fontSize: 15 },
      }}
    >
      {children}
    </Stack>
  )
}

/* ------------------------------------------------------------------ Category hero */

function CategoryHero({ deptSlug, total, activeSub, onSub }: { deptSlug: string; total: number; activeSub: string[]; onSub: (s: string) => void }) {
  const d = deptBySlug(deptSlug)!
  return (
    <Box sx={{ bgcolor: '#fff', borderBottom: `1px solid ${c.line}` }}>
      <Container sx={{ pt: { xs: 2, md: 2.5 }, pb: { xs: 2, md: 3 } }}>
        <Breadcrumbs items={[{ label: 'All categories', to: '/all-categories' }, { label: d.name }]} sx={{ mb: { xs: 1.5, md: 2 } }} />
        <Box
          sx={{
            position: 'relative', overflow: 'hidden', borderRadius: `${tokens.radius.lg}px`, bgcolor: c.navy, color: '#fff',
            minHeight: { xs: 132, md: 180 }, display: 'flex', alignItems: 'flex-end',
          }}
        >
          {d.image && (
            <Box component="img" src={d.image.replace('w=600&h=600', 'w=1600&h=500')} alt="" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }} />
          )}
          <Box sx={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg, ${c.navyDark} 0%, rgba(27,25,80,.7) 45%, rgba(27,25,80,.1) 100%)` }} />
          <Box sx={{ position: 'relative', p: { xs: 2.5, md: 4 }, maxWidth: 720 }}>
            <Typography variant="overline" sx={{ color: c.saffron }}>{total.toLocaleString()} products<Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}> · {d.tagline}</Box></Typography>
            <Typography variant="h1" component="h1" sx={{ color: '#fff', fontSize: { xs: 30, md: 44 } }}>{d.name}</Typography>
            <Typography sx={{ mt: 0.75, opacity: 0.88, display: { xs: 'none', md: 'block' } }}>
              Food-service {d.name.toLowerCase()} by the case, delivered same-day or next-day across the GTA, Hamilton &amp; Niagara.
            </Typography>
          </Box>
        </Box>
        <Box className="no-scrollbar" sx={{ display: 'flex', gap: 1, overflowX: 'auto', mt: 2, mx: { xs: -2, md: 0 }, px: { xs: 2, md: 0 } }}>
          {d.children.map((s) => {
            const on = activeSub.includes(s.name)
            return (
              <Button
                key={s.slug}
                onClick={() => onSub(s.name)}
                aria-pressed={on}
                sx={{
                  flexShrink: 0, borderRadius: 999, minHeight: 40, px: 2, fontWeight: 600, fontSize: 13.5,
                  bgcolor: on ? c.navy : c.bg, color: on ? '#fff' : c.ink, border: `1px solid ${on ? c.navy : c.line}`,
                  '&:hover': { bgcolor: on ? c.navyDark : c.navyTint },
                }}
              >
                {s.name}
                <Box component="span" sx={{ ml: 0.75, fontSize: 11.5, opacity: 0.7, fontWeight: 500 }}>{s.count}</Box>
              </Button>
            )
          })}
        </Box>
      </Container>
    </Box>
  )
}

/* ------------------------------------------------------------------ Search header */

function SearchHeader({ q, imageMode, count }: { q: string; imageMode: boolean; count: number }) {
  const cats = departments.filter((d) => d.name.toLowerCase().includes(q.toLowerCase()) || d.children.some((s) => s.name.toLowerCase().includes(q.toLowerCase()))).slice(0, 3)
  const related = trendingSearches.filter((t) => t !== q.toLowerCase()).slice(0, 5)
  return (
    <Box sx={{ bgcolor: '#fff', borderBottom: `1px solid ${c.line}` }}>
      <Container sx={{ pt: { xs: 2, md: 2.5 }, pb: { xs: 2, md: 3 } }}>
        <Breadcrumbs items={[{ label: 'Search' }, { label: imageMode ? 'Photo search' : q }]} sx={{ mb: 1.5 }} />
        {imageMode ? (
          <Stack direction="row" spacing={2.5} alignItems="center">
            <Box sx={{ position: 'relative', flexShrink: 0 }}>
              <Box component="img" src={photo('shake', 240, 240)} alt="Your uploaded photo" sx={{ width: { xs: 76, md: 104 }, height: { xs: 76, md: 104 }, borderRadius: `${tokens.radius.md}px`, objectFit: 'cover', border: `3px solid ${c.navyTint}` }} />
              <Box sx={{ position: 'absolute', right: -8, bottom: -8, width: 32, height: 32, borderRadius: '50%', bgcolor: c.navy, color: '#fff', display: 'grid', placeItems: 'center', border: '2px solid #fff' }}>
                <PhotoCameraOutlined sx={{ fontSize: 16 }} />
              </Box>
            </Box>
            <Box>
              <Typography variant="overline" sx={{ color: c.red }}>Photo search</Typography>
              <Typography variant="h1" component="h1" sx={{ fontSize: { xs: 24, md: 36 } }}>{count} closest matches</Typography>
              <Typography color="text.secondary" sx={{ fontSize: 14 }}>We spotted: <b>syrup bottle</b> · <b>beverage</b> · <b>caramel</b></Typography>
            </Box>
          </Stack>
        ) : (
          <>
            <Typography variant="h1" component="h1" sx={{ fontSize: { xs: 26, md: 38 } }}>
              Results for <Box component="span" sx={{ color: c.red }}>“{q}”</Box>
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>{count} products found</Typography>
          </>
        )}
        <Stack direction="row" spacing={1} alignItems="center" className="no-scrollbar" sx={{ mt: 2, overflowX: 'auto', mx: { xs: -2, md: 0 }, px: { xs: 2, md: 0 } }}>
          {cats.map((d) => (
            <Button key={d.id} component={RouterLink} to={`/c/${d.slug}`} size="small" sx={{ flexShrink: 0, borderRadius: 999, bgcolor: c.navy, color: '#fff', minHeight: 36, px: 1.75, '&:hover': { bgcolor: c.navyDark } }}>
              in {d.name}
            </Button>
          ))}
          <Typography sx={{ fontSize: 13, color: c.text3, flexShrink: 0, pl: cats.length ? 1 : 0 }}>Related:</Typography>
          {related.map((t) => (
            <Button key={t} component={RouterLink} to={`/search/${encodeURIComponent(t)}`} size="small" variant="outlined" color="inherit" sx={{ flexShrink: 0, borderRadius: 999, borderColor: c.line, minHeight: 36, fontWeight: 500 }}>
              {t}
            </Button>
          ))}
        </Stack>
      </Container>
    </Box>
  )
}

/* ------------------------------------------------------------------ No results */

function NoResults({ q }: { q: string }) {
  return (
    <Container sx={{ pt: { xs: 3, md: 5 } }}>
      <Panel sx={{ p: { xs: 3, md: 6 }, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.2fr 1fr' }, gap: { xs: 3, md: 6 }, alignItems: 'center' }}>
        <Box>
          <Box sx={{ width: 72, height: 72, borderRadius: '50%', bgcolor: c.redTint, color: c.red, display: 'grid', placeItems: 'center', mb: 2 }}>
            <SearchOffRounded sx={{ fontSize: 36 }} />
          </Box>
          <Typography variant="h2" component="h1">No results for “{q}”</Typography>
          <Typography color="text.secondary" sx={{ mt: 1, mb: 2.5 }}>
            We couldn’t find that in our 4,300 products. Check the spelling, try a brand, or search by the SKU printed on the case.
          </Typography>
          <Typography variant="overline" sx={{ color: c.text3 }}>Did you mean</Typography>
          <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1, mb: 2.5 }}>
            {trendingSearches.map((t) => (
              <Button key={t} component={RouterLink} to={`/search/${encodeURIComponent(t)}`} variant="outlined" color="inherit" startIcon={<TrendingUpRounded />} sx={{ borderRadius: 999, borderColor: c.line2, fontWeight: 500, minHeight: 40 }}>
                {t}
              </Button>
            ))}
          </Stack>
        </Box>
        <Stack spacing={1.5}>
          <Box sx={{ p: 2.5, borderRadius: `${tokens.radius.md}px`, bgcolor: c.navyTint }}>
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <QrCode2Rounded sx={{ color: c.navy }} />
              <Box>
                <Typography sx={{ fontWeight: 700 }}>Tip: search by SKU</Typography>
                <Typography sx={{ fontSize: 13.5, color: c.text2 }}>Short codes like <b>BM0089</b> or the 17-digit barcode both work.</Typography>
              </Box>
            </Stack>
          </Box>
          <Box sx={{ p: 2.5, borderRadius: `${tokens.radius.md}px`, bgcolor: c.navy, color: '#fff' }}>
            <Typography sx={{ fontWeight: 700, fontSize: 17 }}>Can’t find it? We’ll source it.</Typography>
            <Typography sx={{ fontSize: 13.5, opacity: 0.85, mt: 0.5, mb: 2 }}>Your rep can special-order items we don’t list online — usually within 48 hours.</Typography>
            <Button variant="contained" startIcon={<WhatsApp />} href="https://wa.me/13657770999" sx={{ bgcolor: '#fff', color: c.navy, '&:hover': { bgcolor: c.navyTint } }}>
              WhatsApp +1 365-777-0999
            </Button>
          </Box>
        </Stack>
      </Panel>
      <Box sx={{ mt: { xs: 5, md: 7 } }}>
        <SectionHeader eyebrow="Popular with kitchens" title="Customers are ordering" action="All categories" href="/all-categories" />
        <ProductRail items={recommended} />
      </Box>
    </Container>
  )
}
