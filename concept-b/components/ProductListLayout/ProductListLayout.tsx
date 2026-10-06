import { useMemo, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { Box, Button, Collapse, Drawer, IconButton, Slider, Typography } from '@mui/material'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import CloseIcon from '@mui/icons-material/Close'
import ProductCard from '../Product/ProductCard'
import { finalPrice, type Aggregation, type Product } from '../../lib/data'

/* Mirrors ProductListLayoutSidebar + productFilterProCategories from the real repo. */

const PANEL_BG = '#F6F8FB'

export type SortKey = 'position' | 'name' | 'price'
export type FilterOption = { label: string; value: string; count: number }
export type FilterGroup = { code: string; label: string; options: FilterOption[] }

export type ListingConfig = {
  title: string
  totalCount: number
  products: Product[]
  /** Sub-category links (category page only). */
  subCategories?: { name: string; url_key: string; product_count?: number }[]
  activeSub?: string
  baseHref?: string
  showSort?: boolean
  /** Search results list Price after the attribute filters (live behaviour). */
  priceLast?: boolean
  filters: FilterGroup[]
}

const panel = { bgcolor: PANEL_BG, borderRadius: '12px', mb: 2, overflow: 'hidden' } as const

function CollapsibleHeader({ label, open, onToggle }: { label: string; open: boolean; onToggle: () => void }) {
  return (
    <Box
      component="button"
      onClick={onToggle}
      aria-expanded={open}
      sx={{ all: 'unset', boxSizing: 'border-box', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', px: '4px', py: 1.5, fontSize: 18, color: '#0C0C0C', '&:focus-visible': { outline: '2px solid #FF413D' } }}
    >
      {label}
      {open ? <KeyboardArrowUpIcon sx={{ color: '#6B7280' }} /> : <KeyboardArrowDownIcon sx={{ color: '#6B7280' }} />}
    </Box>
  )
}

function OptionList({ group, selected, onToggle, initial = 4 }: { group: FilterGroup; selected: string[]; onToggle: (v: string) => void; initial?: number }) {
  const [more, setMore] = useState(false)
  const list = more ? group.options : group.options.slice(0, initial)
  return (
    <Box sx={{ px: 1.5, pb: 1 }}>
      {list.map((o) => {
        const on = selected.includes(o.value)
        return (
          <Box
            key={o.value}
            component="button"
            onClick={() => onToggle(o.value)}
            aria-pressed={on}
            sx={{
              all: 'unset', boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 2, width: '100%', cursor: 'pointer', minHeight: 52,
              px: 1.5, borderRadius: '8px', fontSize: 19, color: '#0C0C0C', bgcolor: on ? '#F8D7DA' : 'transparent',
              '&:hover': { bgcolor: on ? '#F8D7DA' : '#EEF1F6' }, '&:focus-visible': { outline: '2px solid #FF413D' },
            }}
          >
            {o.label}
            <Box component="span" sx={{ fontSize: 13, color: '#9E9E9E' }}>({o.count})</Box>
          </Box>
        )
      })}
      {group.options.length > initial && (
        <Button onClick={() => setMore(!more)} endIcon={<ExpandMoreIcon sx={{ transform: more ? 'rotate(180deg)' : 'none' }} />} sx={{ textTransform: 'none', color: '#FF0000', fontSize: 16, px: 1.5, mt: 1 }}>
          {more ? 'Less options' : 'More options'}
        </Button>
      )}
    </Box>
  )
}

function SelectList<T extends string | number>({ title, options, value, onChange }: { title: string; options: [T, string][]; value: T; onChange: (v: T) => void }) {
  return (
    <Box sx={{ ...panel, p: 2 }}>
      <Typography sx={{ fontWeight: 600, fontSize: 18, mb: 1.5, color: '#0C0C0C' }}>{title}</Typography>
      {options.map(([v, label]) => (
        <Box
          key={String(v)}
          component="button"
          onClick={() => onChange(v)}
          aria-pressed={value === v}
          sx={{
            all: 'unset', boxSizing: 'border-box', display: 'block', width: '100%', cursor: 'pointer', px: 1.5, py: 1.4, borderRadius: '8px', fontSize: 19,
            color: '#0C0C0C', bgcolor: value === v ? '#F8D7DA' : 'transparent', '&:hover': { bgcolor: value === v ? '#F8D7DA' : '#EEF1F6' }, '&:focus-visible': { outline: '2px solid #FF413D' },
          }}
        >
          {label}
        </Box>
      ))}
    </Box>
  )
}

function PriceFilter({ max, value, onChange }: { max: number; value: [number, number]; onChange: (v: [number, number]) => void }) {
  return (
    <Box sx={{ px: 2.5, pb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 14, mb: 0.5 }}>
        <span>${value[0]}</span>
        <span>${value[1]}</span>
      </Box>
      <Slider
        value={value}
        min={0}
        max={max}
        onChange={(_, v) => onChange(v as [number, number])}
        getAriaLabel={(i) => (i === 0 ? 'Minimum price' : 'Maximum price')}
        sx={{
          color: '#FF0000', height: 4,
          '& .MuiSlider-thumb': { width: 30, height: 30, bgcolor: '#fff', border: '1px solid #D1D5DB', boxShadow: '0 1px 3px rgba(0,0,0,.2)' },
          '& .MuiSlider-rail': { bgcolor: '#D1D5DB' },
        }}
      />
    </Box>
  )
}

/* ------------------------------------------------------------------ Layout */

export default function ProductListLayout(cfg: ListingConfig) {
  const maxPrice = useMemo(() => {
    const m = Math.max(10, ...cfg.products.map(finalPrice))
    return m > 100 ? Math.ceil(m / 100) * 100 : Math.ceil(m / 10) * 10
  }, [cfg.products])

  const [sort, setSort] = useState<SortKey>('position')
  const [perPage, setPerPage] = useState(40)
  const [price, setPrice] = useState<[number, number]>([0, maxPrice])
  const [selected, setSelected] = useState<Record<string, string[]>>({})
  const [open, setOpen] = useState<Record<string, boolean>>({ categories: true, price: true })
  const [mobileFilter, setMobileFilter] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const isOpen = (k: string) => open[k] ?? true
  const toggleOpen = (k: string) => setOpen((o) => ({ ...o, [k]: !isOpen(k) }))
  const toggleOpt = (code: string, v: string) =>
    setSelected((s) => ({ ...s, [code]: (s[code] ?? []).includes(v) ? s[code].filter((x) => x !== v) : [...(s[code] ?? []), v] }))

  // Prototype filtering: attribute options match against the product name (the snapshot has no brand attribute).
  const shown = useMemo(() => {
    let list = cfg.products.filter((p) => {
      const pr = finalPrice(p)
      if (pr < price[0] || pr > price[1]) return false
      return Object.entries(selected).every(([code, vals]) => {
        if (!vals.length) return true
        const group = cfg.filters.find((g) => g.code === code)
        const labels = vals.map((v) => group?.options.find((o) => o.value === v)?.label.toLowerCase() ?? '')
        return labels.some((l) => p.name.toLowerCase().includes(l))
      })
    })
    if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'price') list = [...list].sort((a, b) => finalPrice(a) - finalPrice(b))
    return list.slice(0, perPage)
  }, [cfg.products, cfg.filters, price, selected, sort, perPage])

  const filtered = Object.values(selected).some((v) => v.length) || price[0] > 0 || price[1] < maxPrice
  const count = filtered ? shown.length : cfg.totalCount
  const pages = Math.max(1, Math.ceil(count / perPage))

  const pricePanel = (
    <Box sx={{ ...panel, px: 1 }}>
      <CollapsibleHeader label="Price" open={isOpen('price')} onToggle={() => toggleOpen('price')} />
      <Collapse in={isOpen('price')}><PriceFilter max={maxPrice} value={price} onChange={setPrice} /></Collapse>
    </Box>
  )
  const filterPanels = (only?: string) => (
    <>
      {!cfg.priceLast && (!only || only === 'price') && pricePanel}
      {cfg.filters.filter((g) => !only || g.code === only).map((g) => (
        <Box key={g.code} sx={{ ...panel, px: 1 }}>
          <CollapsibleHeader label={g.label} open={isOpen(g.code)} onToggle={() => toggleOpen(g.code)} />
          <Collapse in={isOpen(g.code)}><OptionList group={g} selected={selected[g.code] ?? []} onToggle={(v) => toggleOpt(g.code, v)} /></Collapse>
        </Box>
      ))}
      {cfg.priceLast && (!only || only === 'price') && pricePanel}
    </>
  )

  const subLinks = cfg.subCategories ?? []

  return (
    <Box sx={{ display: 'flex', gap: { lg: 4 }, px: { xs: 1, md: 1.25 }, pt: { xs: 2, md: 5 }, pb: 6 }}>
      {/* Desktop sidebar */}
      <Box component="aside" aria-label="Filters" sx={{ display: { xs: 'none', md: 'block' }, width: 265, flexShrink: 0, pt: { md: 11 } }}>
        {subLinks.length > 0 && (
          <Box sx={{ ...panel, px: 0.5 }}>
            <CollapsibleHeader label="Categories" open={isOpen('categories')} onToggle={() => toggleOpen('categories')} />
            <Collapse in={isOpen('categories')}>
              <Box sx={{ px: 1, pb: 2 }}>
                {subLinks.map((s) => (
                  <Box
                    key={s.url_key}
                    component={Link}
                    href={`${cfg.baseHref}?sub=${s.url_key}`}
                    sx={{ display: 'block', px: 1, py: 1.4, fontSize: 19, color: cfg.activeSub === s.url_key ? '#FF0000' : '#0C0C0C', fontWeight: cfg.activeSub === s.url_key ? 600 : 400, textDecoration: 'none', borderRadius: '8px', lineHeight: 1.4, '&:hover': { bgcolor: '#EEF1F6' } }}
                  >
                    {s.name}
                  </Box>
                ))}
              </Box>
            </Collapse>
          </Box>
        )}
        {cfg.showSort && (
          <SelectList<SortKey> title="Sort" value={sort} onChange={setSort} options={[['position', 'Position'], ['name', 'Product Name'], ['price', 'Price']]} />
        )}
        <SelectList<number> title="Per page" value={perPage} onChange={(v) => { setPerPage(v); setPage(1) }} options={[[20, '20 Per page'], [36, '36 Per page'], [40, '40 Per page']]} />
        {filterPanels()}
      </Box>

      {/* Results */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography component="h1" sx={{ fontSize: { xs: 26, md: 52 }, fontWeight: 500, color: '#0C0C0C', letterSpacing: '-.01em', px: { xs: 1, md: 0.5 }, mb: { xs: 1, md: 3 } }}>
          {cfg.title}
        </Typography>

        {/* Mobile sub-category row + filter chips */}
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          {subLinks.length > 0 && (
            <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', px: 1, pb: 1.5, '&::-webkit-scrollbar': { display: 'none' } }}>
              {subLinks.map((s) => (
                <Box key={s.url_key} component={Link} href={`${cfg.baseHref}?sub=${s.url_key}`} sx={{ whiteSpace: 'nowrap', fontSize: 17, color: cfg.activeSub === s.url_key ? '#FF0000' : '#0C0C0C', textDecoration: 'none' }}>
                  {s.name}
                </Box>
              ))}
            </Box>
          )}
          <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { display: 'none' } }}>
            {[{ code: 'price', label: 'Price' }, ...cfg.filters.map((g) => ({ code: g.code, label: g.label }))].map((f) => (
              <Button
                key={f.code}
                onClick={() => setMobileFilter(f.code)}
                endIcon={<KeyboardArrowDownIcon />}
                sx={{ flexShrink: 0, textTransform: 'none', color: '#0C0C0C', border: '1px solid #D1D5DB', borderRadius: '20px', px: 1.5, height: 32, fontSize: 13, fontWeight: 400, bgcolor: (selected[f.code]?.length ?? 0) > 0 ? '#F8D7DA' : '#fff' }}
              >
                {f.label}
              </Button>
            ))}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mx: { xs: -1, md: 6 }, my: { xs: 1.5, md: 2 }, mb: { xs: 3, md: 5 } }}>
          <Box sx={{ flex: 1, height: '1px', bgcolor: '#E5E7EB' }} />
          <Typography sx={{ fontSize: 14, color: '#C4C4C4' }}>{count} {count === 1 ? 'product' : 'products'}</Typography>
          <Box sx={{ flex: 1, height: '1px', bgcolor: '#E5E7EB' }} />
        </Box>

        {shown.length ? (
          <Box sx={{ display: 'grid', columnGap: { xs: 2, md: 5 }, rowGap: { xs: 5, md: 6 }, gridTemplateColumns: { xs: 'repeat(2, minmax(0,1fr))', md: 'repeat(3, minmax(0,1fr))', lg: 'repeat(4, minmax(0,1fr))' }, px: { xs: 0.5, md: 0 },
            // SupremePlaceholder uses a fixed 40px wordmark; shrink it in the 2-up mobile grid so it isn't clipped.
            '& [role=img] p': { fontSize: { xs: 28, sm: 34, lg: 40 } } }}>
            {shown.map((p) => <ProductCard key={p.sku} product={p} />)}
          </Box>
        ) : (
          <NoResults />
        )}

        {shown.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mt: 6 }}>
            <IconButton aria-label="Previous page" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeftIcon /></IconButton>
            <Typography sx={{ fontSize: 17, color: '#0C0C0C' }}>Page {page} of {pages}</Typography>
            <IconButton aria-label="Next page" disabled={page >= pages} onClick={() => setPage(page + 1)} sx={{ color: '#0C0C0C' }}><ChevronRightIcon /></IconButton>
          </Box>
        )}
      </Box>

      {/* Mobile filter drawer */}
      <Drawer anchor="bottom" open={!!mobileFilter} onClose={() => setMobileFilter(null)} PaperProps={{ sx: { borderRadius: '16px 16px 0 0', maxHeight: '80vh', p: 2 } }} sx={{ zIndex: 1300 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography sx={{ fontWeight: 600, fontSize: 18 }}>Filters</Typography>
          <IconButton aria-label="Close filters" onClick={() => setMobileFilter(null)}><CloseIcon /></IconButton>
        </Box>
        {mobileFilter && filterPanels(mobileFilter)}
        <Button fullWidth variant="contained" disableElevation onClick={() => setMobileFilter(null)} sx={{ mt: 1, height: 48, textTransform: 'none', fontWeight: 600, bgcolor: '#FF0000', '&:hover': { bgcolor: '#e60000' } }}>
          Show {shown.length} products
        </Button>
      </Drawer>
    </Box>
  )
}

export function NoResults({ children }: { children?: ReactNode }) {
  return (
    <Box sx={{ textAlign: 'center', py: 8, px: 2 }}>
      <Typography sx={{ fontSize: 22, fontWeight: 600, color: '#0C0C0C', mb: 1 }}>We couldn’t find any products</Typography>
      <Typography sx={{ fontSize: 15, color: '#6B7280', mb: 3 }}>Try a different search term, check the SKU, or browse our categories.</Typography>
      {children}
      <Button component={Link} href="/all-categories" variant="outlined" sx={{ borderRadius: '40px', borderColor: '#FF0000', color: '#FF0000', textTransform: 'none', px: 3 }}>
        Browse all categories
      </Button>
    </Box>
  )
}

/** Turn Magento aggregations into sidebar filter groups (price and category handled separately). */
export function aggregationsToFilters(aggs: Aggregation[], codes: string[]): FilterGroup[] {
  return codes
    .map((code) => aggs.find((a) => a.attribute_code === code))
    .filter(Boolean)
    .map((a) => ({ code: a!.attribute_code, label: a!.label, options: a!.options.map((o) => ({ label: o.label, value: o.value, count: o.count })) }))
}
