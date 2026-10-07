import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  Accordion, AccordionDetails, AccordionSummary, Badge, Box, Button, Checkbox, Chip, Drawer, FormControlLabel, IconButton, InputAdornment, InputBase,
  MenuItem, Pagination, Select, Slider, Typography, useMediaQuery,
} from '@mui/material'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import FilterAltOffOutlinedIcon from '@mui/icons-material/FilterAltOffOutlined'
import { finalPrice, money, type Aggregation, type Product } from '../../lib/data'
import { colors, focusRing, radius, z } from '../../lib/theme'
import ProductGrid from '../Product/ProductGrid'
import EmptyState from '../ui/EmptyState'
import PageHeader, { type Crumb } from '../ui/PageHeader'
import { PageContainer } from '../ui/Section'

/*
 * Category + search listing. Filters come from Magento aggregations (with counts); applied filters show as removable
 * chips; sort covers relevance, name and both price directions; state lives in the URL so Back restores it and
 * links can be shared. Desktop: sidebar ≥1100px. Smaller: a "Filters" button opens a drawer with a live count.
 */

export type SortKey = 'relevance' | 'name' | 'price-asc' | 'price-desc'
export type FilterOption = { label: string; value: string; count: number }
export type FilterGroup = { code: string; label: string; options: FilterOption[] }

export type ListingConfig = {
  title: string
  breadcrumbs?: Crumb[]
  description?: ReactNode
  totalCount: number
  products: Product[]
  /** Sub-category links (category page only). */
  subCategories?: { name: string; url_key: string; product_count?: number }[]
  activeSub?: string
  baseHref?: string
  /** Department name for "All ‹Dept›" in the category list. */
  allLabel?: string
  filters: FilterGroup[]
  /** Content above the grid (e.g. exact SKU match on search). */
  intro?: ReactNode
  /** Rendered instead of the default empty state when the listing itself has no products. */
  empty?: ReactNode
  sortLabel?: string
}

const SORTS: [SortKey, string][] = [['relevance', 'Recommended'], ['name', 'Name: A to Z'], ['price-asc', 'Price: low to high'], ['price-desc', 'Price: high to low']]
const PER_PAGE = [20, 40, 60]

const asArray = (v: string | string[] | undefined) => (Array.isArray(v) ? v : v ? v.split(',') : [])

/* ------------------------------------------------------------------ Filter parts */

function OptionList({ group, selected, onToggle }: { group: FilterGroup; selected: string[]; onToggle: (v: string) => void }) {
  const [more, setMore] = useState(false)
  const [q, setQ] = useState('')
  const searchable = group.options.length > 8
  const matches = q ? group.options.filter((o) => o.label.toLowerCase().includes(q.toLowerCase())) : group.options
  // Selected options always stay visible, even when they'd fall under "Show more".
  const base = more || q ? matches : matches.slice(0, 6)
  const list = [...group.options.filter((o) => selected.includes(o.value) && !base.includes(o)), ...base]
  return (
    <Box>
      {searchable && (
        <InputBase
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Search ${group.label.toLowerCase()}`}
          inputProps={{ 'aria-label': `Search ${group.label}` }}
          startAdornment={<InputAdornment position="start"><SearchRoundedIcon sx={{ fontSize: 18, color: colors.ink500 }} /></InputAdornment>}
          sx={{ width: '100%', height: 38, px: 1.25, mb: 1, border: `1px solid ${colors.line2}`, borderRadius: radius.sm, fontSize: 14, '&.Mui-focused': { borderColor: colors.navy } }}
        />
      )}
      <Box sx={{ display: 'flex', flexDirection: 'column', maxHeight: more || q ? 300 : 'none', overflowY: 'auto', mx: -0.5, px: 0.5 }}>
        {list.map((o) => (
          <FormControlLabel
            key={o.value}
            control={<Checkbox size="small" checked={selected.includes(o.value)} onChange={() => onToggle(o.value)} />}
            label={
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, width: '100%' }}>
                <Box component="span" sx={{ fontSize: 14, overflowWrap: 'anywhere' }}>{o.label}</Box>
                <Box component="span" sx={{ fontSize: 12.5, color: colors.ink500, flexShrink: 0 }}>{o.count.toLocaleString()}</Box>
              </Box>
            }
            sx={{ mx: 0, minHeight: 36, borderRadius: radius.sm, '& .MuiFormControlLabel-label': { flex: 1, minWidth: 0 }, '&:hover': { bgcolor: colors.subtle } }}
          />
        ))}
        {q && !matches.length && <Typography sx={{ fontSize: 13.5, color: colors.ink500, py: 1 }}>No {group.label.toLowerCase()} matches “{q}”.</Typography>}
      </Box>
      {!q && group.options.length > 6 && (
        <Button size="small" onClick={() => setMore(!more)} sx={{ mt: 0.5, ml: -1, color: colors.redText }}>
          {more ? 'Show fewer' : `Show all ${group.options.length}`}
        </Button>
      )}
    </Box>
  )
}

function PriceFilter({ max, value, onChange }: { max: number; value: [number, number]; onChange: (v: [number, number]) => void }) {
  const [local, setLocal] = useState(value)
  useEffect(() => setLocal(value), [value])
  const field = (i: 0 | 1, label: string) => (
    <InputBase
      value={local[i]}
      onChange={(e) => { const n = Math.max(0, Math.min(max, parseInt(e.target.value.replace(/\D/g, '') || '0', 10))); setLocal(i ? [local[0], n] : [n, local[1]]) }}
      onBlur={() => onChange([Math.min(local[0], local[1]), Math.max(local[0], local[1])])}
      onKeyDown={(e) => e.key === 'Enter' && onChange([Math.min(local[0], local[1]), Math.max(local[0], local[1])])}
      inputProps={{ 'aria-label': label, inputMode: 'numeric' }}
      startAdornment={<Box component="span" sx={{ color: colors.ink500, mr: 0.5 }}>$</Box>}
      sx={{ flex: 1, minWidth: 0, height: 38, px: 1.25, border: `1px solid ${colors.line2}`, borderRadius: radius.sm, fontSize: 14, '&.Mui-focused': { borderColor: colors.navy } }}
    />
  )
  return (
    <Box sx={{ px: 1.25 }}>
      <Slider value={local} min={0} max={max} onChange={(_, v) => setLocal(v as [number, number])} onChangeCommitted={(_, v) => onChange(v as [number, number])} getAriaLabel={(i) => (i === 0 ? 'Minimum price' : 'Maximum price')} getAriaValueText={(v) => money(v)} sx={{ mt: 0.5 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mx: -1.25 }}>
        {field(0, 'Minimum price')}
        <Box component="span" sx={{ color: colors.ink400 }}>–</Box>
        {field(1, 'Maximum price')}
      </Box>
    </Box>
  )
}

function FilterSection({ title, children, defaultOpen = true, count }: { title: string; children: ReactNode; defaultOpen?: boolean; count?: number }) {
  return (
    <Accordion defaultExpanded={defaultOpen} sx={{ border: 0, borderBottom: `1px solid ${colors.line}`, borderRadius: '0 !important', '& + &': { mt: 0 } }}>
      <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />} sx={{ px: 0, minHeight: 52 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {title}
          {!!count && <Box component="span" sx={{ fontSize: 12, fontWeight: 700, color: '#fff', bgcolor: colors.ink, borderRadius: radius.pill, minWidth: 20, height: 20, px: 0.75, display: 'grid', placeItems: 'center' }}>{count}</Box>}
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 0, pb: 2 }}>{children}</AccordionDetails>
    </Accordion>
  )
}

/* ------------------------------------------------------------------ Layout */

export default function ProductListLayout(cfg: ListingConfig) {
  const router = useRouter()
  const resultsRef = useRef<HTMLDivElement>(null)
  const maxPrice = useMemo(() => {
    const m = Math.max(10, ...cfg.products.map(finalPrice))
    return m > 100 ? Math.ceil(m / 50) * 50 : Math.ceil(m / 10) * 10
  }, [cfg.products])

  // URL is the source of truth for sort, page, price and attribute filters.
  const q = router.query
  const sort = (SORTS.find(([k]) => k === q.sort)?.[0] ?? 'relevance') as SortKey
  const perPage = PER_PAGE.includes(Number(q.per)) ? Number(q.per) : 40
  const page = Math.max(1, Number(q.page) || 1)
  const price: [number, number] = [Number(q.min) || 0, q.max ? Math.min(maxPrice, Number(q.max)) : maxPrice]
  const selected: Record<string, string[]> = Object.fromEntries(cfg.filters.map((g) => [g.code, asArray(q[`f_${g.code}`] as string | undefined)]))

  const update = (patch: Record<string, string | number | undefined>, resetPage = true) => {
    const next: Record<string, string | string[]> = {}
    for (const [k, v] of Object.entries({ ...q, ...(resetPage ? { page: undefined } : {}), ...patch })) {
      if (v !== undefined && v !== '' && v !== null) next[k] = String(v)
    }
    router.replace({ pathname: router.pathname, query: next }, undefined, { shallow: true, scroll: false })
  }
  const toggleOpt = (code: string, v: string) => {
    const cur = selected[code] ?? []
    const vals = cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]
    update({ [`f_${code}`]: vals.join(',') || undefined })
  }
  const setPrice = (v: [number, number]) => update({ min: v[0] > 0 ? v[0] : undefined, max: v[1] < maxPrice ? v[1] : undefined })
  const clearAll = () => update({ min: undefined, max: undefined, ...Object.fromEntries(cfg.filters.map((g) => [`f_${g.code}`, undefined])) })

  const filtered = useMemo(() => {
    let list = cfg.products.filter((p) => {
      const pr = finalPrice(p)
      if (pr < price[0] || pr > price[1]) return false
      return Object.entries(selected).every(([code, vals]) => {
        if (!vals.length) return true
        const group = cfg.filters.find((g) => g.code === code)
        const labels = vals.map((v) => group?.options.find((o) => o.value === v)?.label.toLowerCase() ?? '')
        // Brand / manufacturer use the Magento labels; other attributes (not in the snapshot) match the product name.
        const own = code === 'brand' ? p.brand_label : code === 'manufacturer' ? p.manufacturer_label : undefined
        if (own !== undefined) return labels.includes((own ?? '').toLowerCase())
        return labels.some((l) => p.name.toLowerCase().includes(l))
      })
    })
    if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'price-asc') list = [...list].sort((a, b) => finalPrice(a) - finalPrice(b))
    if (sort === 'price-desc') list = [...list].sort((a, b) => finalPrice(b) - finalPrice(a))
    return list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cfg.products, cfg.filters, JSON.stringify(selected), price[0], price[1], sort])

  const activeCount = Object.values(selected).reduce((a, v) => a + v.length, 0) + (price[0] > 0 || price[1] < maxPrice ? 1 : 0)
  const isFiltered = activeCount > 0
  const total = isFiltered ? filtered.length : cfg.totalCount
  const pages = Math.max(1, Math.ceil(total / perPage))
  const current = Math.min(page, pages)
  // The snapshot holds a few dozen products per department while counts are the real Magento totals, so unfiltered
  // pages cycle through the snapshot (prototype only). Filtered results paginate exactly.
  const shown = useMemo(() => {
    const start = (current - 1) * perPage
    const n = Math.min(perPage, total - start)
    if (isFiltered || filtered.length >= total) return filtered.slice(start, start + perPage)
    return Array.from({ length: Math.max(0, n) }, (_, i) => filtered[(start + i) % filtered.length]).filter(Boolean)
  }, [filtered, current, perPage, total, isFiltered])

  const [drawer, setDrawer] = useState(false)
  const phone = useMediaQuery('(max-width:599.98px)')
  const goPage = (n: number) => {
    update({ page: n > 1 ? n : undefined }, false)
    window.requestAnimationFrame(() => {
      const el = resultsRef.current
      if (!el) return
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 180, behavior: 'smooth' })
      el.focus({ preventScroll: true })
    })
  }

  const chips = [
    ...(price[0] > 0 || price[1] < maxPrice ? [{ key: 'price', label: `${money(price[0])} – ${money(price[1])}`, onDelete: () => setPrice([0, maxPrice]) }] : []),
    ...cfg.filters.flatMap((g) => (selected[g.code] ?? []).map((v) => ({ key: `${g.code}-${v}`, label: g.options.find((o) => o.value === v)?.label ?? v, onDelete: () => toggleOpt(g.code, v) }))),
  ]

  const subLinks = cfg.subCategories ?? []
  const categoryList = subLinks.length > 0 && (
    <FilterSection title="Category">
      <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
        <li>
          <Box component={Link} href={cfg.baseHref ?? '/'} aria-current={!cfg.activeSub ? 'page' : undefined} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75, px: 1, mx: -1, borderRadius: radius.sm, textDecoration: 'none', fontSize: 14, color: colors.ink, fontWeight: !cfg.activeSub ? 600 : 400, bgcolor: !cfg.activeSub ? colors.sunken : 'transparent', '&:hover': { bgcolor: colors.sunken }, ...focusRing }}>
            All {cfg.allLabel ?? ''}
          </Box>
        </li>
        {subLinks.map((s) => {
          const on = cfg.activeSub === s.url_key
          return (
            <li key={s.url_key}>
              <Box component={Link} href={`${cfg.baseHref}?sub=${s.url_key}`} aria-current={on ? 'page' : undefined} sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, py: 0.75, px: 1, mx: -1, borderRadius: radius.sm, textDecoration: 'none', fontSize: 14, color: colors.ink, fontWeight: on ? 600 : 400, bgcolor: on ? colors.sunken : 'transparent', '&:hover': { bgcolor: colors.sunken }, ...focusRing }}>
                <span>{s.name}</span>
                {s.product_count != null && <Box component="span" sx={{ fontSize: 12.5, color: colors.ink500 }}>{s.product_count.toLocaleString()}</Box>}
              </Box>
            </li>
          )
        })}
      </Box>
    </FilterSection>
  )
  const filterPanels = (
    <>
      <FilterSection title="Price" count={price[0] > 0 || price[1] < maxPrice ? 1 : 0}>
        <PriceFilter max={maxPrice} value={price} onChange={setPrice} />
      </FilterSection>
      {cfg.filters.map((g) => (
        <FilterSection key={g.code} title={g.label} defaultOpen={g.options.length <= 40 || (selected[g.code]?.length ?? 0) > 0} count={selected[g.code]?.length}>
          <OptionList group={g} selected={selected[g.code] ?? []} onToggle={(v) => toggleOpt(g.code, v)} />
        </FilterSection>
      ))}
    </>
  )

  const from = total ? (current - 1) * perPage + 1 : 0
  const to = Math.min(total, current * perPage)

  return (
    <PageContainer sx={{ pb: { xs: 5, md: 8 } }}>
      <PageHeader breadcrumbs={cfg.breadcrumbs} title={cfg.title} meta={`${cfg.totalCount.toLocaleString()} product${cfg.totalCount === 1 ? '' : 's'}`} description={cfg.description} />

      {/* Phones/tablets: sub-categories as a swipeable chip row */}
      {subLinks.length > 0 && (
        <Box component="nav" aria-label="Sub-categories" sx={{ display: { xs: 'flex', lg: 'none' }, gap: 1, overflowX: 'auto', pb: 2, mx: -2, px: 2, scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
          <Chip component={Link} href={cfg.baseHref ?? '/'} clickable label={`All ${cfg.allLabel ?? ''}`} color={!cfg.activeSub ? 'secondary' : 'default'} variant={!cfg.activeSub ? 'filled' : 'outlined'} />
          {subLinks.map((s) => (
            <Chip key={s.url_key} component={Link} href={`${cfg.baseHref}?sub=${s.url_key}`} clickable label={s.name} color={cfg.activeSub === s.url_key ? 'secondary' : 'default'} variant={cfg.activeSub === s.url_key ? 'filled' : 'outlined'} />
          ))}
        </Box>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', lg: '256px minmax(0,1fr)' }, gap: { lg: 4 } }}>
        <Box component="aside" aria-label="Filters" sx={{ display: { xs: 'none', lg: 'block' } }}>
          <Box sx={{ position: 'sticky', top: 180, maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', pr: 1, mr: -1, borderTop: `1px solid ${colors.line}` }}>
            {categoryList}
            {filterPanels}
          </Box>
        </Box>

        <Box sx={{ minWidth: 0 }}>
          {/* Toolbar */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', pb: 1.5, mb: 2, borderBottom: `1px solid ${colors.line}` }}>
            <Badge badgeContent={activeCount} color="primary" sx={{ display: { lg: 'none' } }}>
              <Button variant="outlined" startIcon={<TuneRoundedIcon />} onClick={() => setDrawer(true)}>Filters</Button>
            </Badge>
            <Typography role="status" aria-live="polite" sx={{ fontSize: 14, color: colors.ink600, mr: 'auto', display: { xs: 'none', sm: 'block' } }}>
              {total ? <>Showing <b style={{ color: colors.ink }}>{from}–{to}</b> of {total.toLocaleString()}</> : 'No matches'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: { xs: 'auto', sm: 0 } }}>
              <Typography component="label" htmlFor="sort-select" sx={{ fontSize: 14, color: colors.ink600, display: { xs: 'none', md: 'block' } }}>Sort by</Typography>
              <Select id="sort-select" size="small" value={sort} onChange={(e) => update({ sort: e.target.value === 'relevance' ? undefined : e.target.value })} inputProps={{ 'aria-label': 'Sort by' }} sx={{ minWidth: 190, fontSize: 14, '& .MuiSelect-select': { py: 1.1 } }}>
                {SORTS.map(([k, label]) => <MenuItem key={k} value={k}>{label}</MenuItem>)}
              </Select>
            </Box>
          </Box>

          {chips.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center', mb: 2 }} aria-label="Applied filters" role="group">
              {chips.map((c) => <Chip key={c.key} label={c.label} onDelete={c.onDelete} variant="outlined" deleteIcon={<CloseRoundedIcon aria-label={`Remove filter ${c.label}`} />} />)}
              <Button size="small" onClick={clearAll} sx={{ color: colors.redText }}>Clear all</Button>
            </Box>
          )}

          {cfg.intro}

          <Box ref={resultsRef} tabIndex={-1} aria-label={`${cfg.title}, page ${current} of ${pages}`} sx={{ outline: 'none' }}>
            {shown.length ? (
              <ProductGrid products={shown} label={cfg.title} columns={{ xs: 'repeat(2, minmax(0,1fr))', md: 'repeat(auto-fill, minmax(212px, 1fr))' }} />
            ) : isFiltered ? (
              <EmptyState
                size="inline"
                icon={<FilterAltOffOutlinedIcon />}
                title="No products match these filters"
                actions={<><Button variant="contained" onClick={clearAll}>Clear all filters</Button>{chips[chips.length - 1] && <Button variant="outlined" onClick={chips[chips.length - 1].onDelete}>Undo last filter</Button>}</>}
              >
                Try removing a filter or widening the price range.
              </EmptyState>
            ) : (
              cfg.empty ?? <EmptyState size="inline" title="Nothing here yet" actions={<Button component={Link} href="/all-categories" variant="outlined">Browse all categories</Button>}>This category has no products online right now.</EmptyState>
            )}
          </Box>

          {shown.length > 0 && (
            <Box sx={{ mt: { xs: 4, md: 6 }, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
              <Pagination
                count={pages}
                page={current}
                onChange={(_, n) => goPage(n)}
                siblingCount={phone ? 0 : 1}
                boundaryCount={1}
                shape="rounded"
                getItemAriaLabel={(type, p, sel) => (type === 'page' ? `${sel ? 'Current page, ' : 'Go to '}page ${p}` : type === 'next' ? 'Next page' : type === 'previous' ? 'Previous page' : type)}
                sx={{ '& ul': { flexWrap: 'nowrap' }, mx: { xs: 'auto', sm: 0 } }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mx: { xs: 'auto', sm: 0 } }}>
                <Typography component="label" htmlFor="per-page" sx={{ fontSize: 14, color: colors.ink600 }}>Per page</Typography>
                <Select id="per-page" size="small" value={perPage} onChange={(e) => update({ per: Number(e.target.value) === 40 ? undefined : e.target.value })} sx={{ fontSize: 14, '& .MuiSelect-select': { py: 1 } }}>
                  {PER_PAGE.map((n) => <MenuItem key={n} value={n}>{n}</MenuItem>)}
                </Select>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* Filter drawer (<1100px): full height, live result count in the footer */}
      <Drawer anchor="right" open={drawer} onClose={() => setDrawer(false)} sx={{ zIndex: z.modal }} PaperProps={{ sx: { width: { xs: '100%', sm: 400 }, display: 'flex', flexDirection: 'column' } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, height: 60, borderBottom: `1px solid ${colors.line}`, flexShrink: 0 }}>
          <Typography component="h2" variant="h3">Filters</Typography>
          <IconButton aria-label="Close filters" onClick={() => setDrawer(false)}><CloseRoundedIcon /></IconButton>
        </Box>
        <Box sx={{ flex: 1, overflowY: 'auto', px: 2 }}>
          {categoryList}
          {filterPanels}
        </Box>
        <Box sx={{ display: 'flex', gap: 1, p: 2, borderTop: `1px solid ${colors.line}`, pb: 'calc(16px + env(safe-area-inset-bottom))', flexShrink: 0 }}>
          <Button variant="outlined" onClick={clearAll} disabled={!isFiltered} sx={{ flex: 1 }}>Clear all</Button>
          <Button variant="contained" onClick={() => setDrawer(false)} sx={{ flex: 2 }}>Show {total.toLocaleString()} product{total === 1 ? '' : 's'}</Button>
        </Box>
      </Drawer>
    </PageContainer>
  )
}

/** Turn Magento aggregations into sidebar filter groups (price and category handled separately). */
export function aggregationsToFilters(aggs: Aggregation[], codes: string[]): FilterGroup[] {
  return codes
    .map((code) => aggs.find((a) => a.attribute_code === code))
    .filter(Boolean)
    .map((a) => ({ code: a!.attribute_code, label: a!.label, options: a!.options.map((o) => ({ label: o.label, value: o.value, count: o.count })) }))
}
