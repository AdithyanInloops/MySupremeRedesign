import { useMemo, useState, type ReactNode } from 'react'
import {
  Box, Button, Drawer, IconButton, LinearProgress, MenuItem, Select, Stack, ToggleButton, ToggleButtonGroup, Typography,
} from '@mui/material'
import { useParams, useSearchParams } from 'react-router-dom'
import TuneRounded from '@mui/icons-material/TuneRounded'
import GridViewRounded from '@mui/icons-material/GridViewRounded'
import ViewListRounded from '@mui/icons-material/ViewListRounded'
import CloseRounded from '@mui/icons-material/CloseRounded'
import { tokens } from '../../theme'
import type { Product } from '../../data/catalog'
import { categoryTree, type CategoryNode } from '../../data/categoryTree'
import { listings, magentoAsShopProducts, magentoProducts } from '../../data/magento'
import { useApp } from '../../state/AppState'
import { Container, Panel } from '../../components/ui'
import { ProductCard, ProductCardSkeleton } from '../../components/Commerce'
import { PageTitle } from '../../components/Shared'
import NotFound from '../company/NotFound'
import { AppliedChips, FilterPanel, PRICE_MAX, activeCount, emptyFilters, type Facet, type FilterState } from './listing/Filters'
import { packType } from './Listing'

/*
 * Department listing opened from All categories: Concept A's listing design (filter sidebar, sort, grid / list,
 * load more) fed with the Magento snapshot shared with Concept B (categories, products, brand aggregations).
 */

type Sort = 'relevance' | 'name' | 'price-asc' | 'price-desc'

const c = tokens.color
const PAGE = 12

// Sub-category names each product belongs to (its Magento categories), for the Sub-category facet.
const catNames = new Map(magentoProducts.map((p) => [p.sku, p.categories.map((cat) => cat.name)]))

const facetOf = (items: Product[], key: (p: Product) => string): Facet[] => {
  const m = new Map<string, number>()
  items.forEach((p) => m.set(key(p), (m.get(key(p)) ?? 0) + 1))
  return [...m.entries()].map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count)
}

export default function DepartmentListing() {
  const { dept: key = '' } = useParams()
  const dept = categoryTree.find((d) => d.url_key === key)
  if (!dept) return <NotFound />
  // Remount per department so filters never leak between departments.
  return <Listing key={key} dept={dept} />
}

function Listing({ dept }: { dept: CategoryNode }) {
  const [params] = useSearchParams()
  const { review, priceFor } = useApp()
  // ?sub=<url_key> from All categories pre-selects that sub-category; unknown values are ignored.
  const initialSub = dept.children.find((s) => s.url_key === params.get('sub'))?.name
  const [filters, setFilters] = useState<FilterState>(() => ({ ...emptyFilters(), sub: initialSub ? [initialSub] : [] }))
  const [sort, setSort] = useState<Sort>('relevance')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [drawer, setDrawer] = useState(false)
  const [limit, setLimit] = useState(PAGE)
  const [loadingMore, setLoadingMore] = useState(false)

  // The snapshot holds ~15 products per department; pad with other departments so the grid reads like the live page.
  const base = useMemo(() => {
    const own = magentoAsShopProducts.filter((p) => p.dept === dept.url_key)
    return [...own, ...magentoAsShopProducts.filter((p) => p.dept !== dept.url_key)].slice(0, 40)
  }, [dept.url_key])

  const filtered = useMemo(() => {
    let r = base.filter((p) => {
      if (filters.sub.length && !filters.sub.some((s) => catNames.get(p.sku)?.includes(s))) return false
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

  // Facets (Magento aggregations): sub-categories from the category tree, brands from the listing aggregation.
  const subFacets: Facet[] = dept.children.map((s) => ({ value: s.name, count: s.product_count ?? 0 }))
  const brandAgg = listings[dept.url_key]?.aggregations.find((a) => a.attribute_code === 'brand')
  const brandFacets: Facet[] = brandAgg ? brandAgg.options.map((o) => ({ value: o.label, count: o.count })) : facetOf(base, (p) => p.brand).filter((f) => f.value)
  const packFacets = facetOf(base, (p) => packType(p.pack))
  const inStockCount = base.filter((p) => p.stock !== 'OUT_OF_STOCK').length

  const nActive = activeCount(filters)
  const onlySub = nActive === 1 && filters.sub.length === 1 ? dept.children.find((s) => s.name === filters.sub[0]) : undefined
  // Unfiltered counts are the real Magento totals; filtered counts are what the snapshot holds.
  const total = nActive === 0 ? listings[dept.url_key]?.total_count ?? dept.product_count : onlySub?.product_count ?? filtered.length
  const visible = filtered.slice(0, limit)
  const loading = review.loading
  const title = onlySub?.name ?? dept.name

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

  return (
    <Box>
      <Container>
        <PageTitle
          dense
          title={title}
          subtitle={`${total.toLocaleString()} product${total === 1 ? '' : 's'}`}
        />
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
                sx={{ minWidth: { xs: 0, sm: 220 }, height: 44, flexShrink: 1, bgcolor: '#fff' }}
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
      </Container>

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

/** Same grid / list wrapper as the main listing page. */
function Results({ view, children }: { view: 'grid' | 'list'; children: ReactNode }) {
  return view === 'grid' ? (
    <Box sx={{ display: 'grid', gap: { xs: 1.25, md: 2 }, gridTemplateColumns: { xs: 'repeat(2,minmax(0,1fr))', md: 'repeat(3,minmax(0,1fr))', xl: 'repeat(4,minmax(0,1fr))' } }}>{children}</Box>
  ) : (
    <Stack
      spacing={1.25}
      sx={{
        '& [role=img] > div:nth-of-type(2) > div:nth-of-type(2)': { display: 'none' },
        '& [role=img] > div:nth-of-type(2) > div:nth-of-type(1)': { width: 44, height: 44, fontSize: 15 },
      }}
    >
      {children}
    </Stack>
  )
}
