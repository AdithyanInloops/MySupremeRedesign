import { useMemo, useState } from 'react'
import { Link as RouterLink, useParams, useSearchParams } from 'react-router-dom'
import { Box, Button, Checkbox, FormControlLabel, IconButton, Typography } from '@mui/material'
import { tokens } from '../theme'
import { useApp } from '../state/app'
import { deptBySlug, productsInDept, type Product } from '../data/catalog'
import ProductCard, { ProductRow } from '../components/ProductCard'
import { EmptyState, Pill, Sheet, TopBar } from '../components/ui'
import { BoxIcon, CheckIcon, GridViewIcon, ListIcon, SearchIcon, SlidersIcon } from '../components/icons'

const c = tokens.color
type Sort = 'popular' | 'price-asc' | 'price-desc' | 'name'
const SORTS: [Sort, string][] = [['popular', 'Most popular'], ['price-asc', 'Price: low to high'], ['price-desc', 'Price: high to low'], ['name', 'Name A–Z']]

/** Department listing: sticky sub-category pills, sort + filter sheets, grid / list toggle. */
export default function Department() {
  const { dept: slug } = useParams()
  const [params, setParams] = useSearchParams()
  const { priceFor } = useApp()
  const dept = deptBySlug(slug)
  const sub = params.get('sub') ?? ''
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [sort, setSort] = useState<Sort>('popular')
  const [sheet, setSheet] = useState<'sort' | 'filter' | null>(null)
  const [brandsOn, setBrandsOn] = useState<string[]>([])
  const [inStock, setInStock] = useState(false)
  const [onSale, setOnSale] = useState(false)

  const all = useMemo(() => (dept ? productsInDept(dept.slug) : []), [dept])
  const brandOptions = useMemo(() => Array.from(new Set(all.map((p) => p.brand))).sort(), [all])
  const subName = dept?.children.find((s) => s.slug === sub)?.name
  const list = useMemo(() => {
    let l: Product[] = all.filter((p) => (!subName || p.sub === subName) && (!brandsOn.length || brandsOn.includes(p.brand)) && (!inStock || p.stock !== 'OUT_OF_STOCK') && (!onSale || !!p.regular))
    if (sort === 'price-asc') l = [...l].sort((a, b) => priceFor(a) - priceFor(b))
    if (sort === 'price-desc') l = [...l].sort((a, b) => priceFor(b) - priceFor(a))
    if (sort === 'name') l = [...l].sort((a, b) => a.name.localeCompare(b.name))
    return l
  }, [all, subName, brandsOn, inStock, onSale, sort, priceFor])
  const filters = brandsOn.length + (inStock ? 1 : 0) + (onSale ? 1 : 0)

  if (!dept) return <><TopBar title="Not found" /><EmptyState icon={BoxIcon} title="Department not found" body="It may have moved. Browse all departments instead." action="All departments" to="/shop" /></>

  return (
    <Box>
      <TopBar title={dept.name} subtitle={`${dept.count.toLocaleString()} products`} actions={<IconButton component={RouterLink} to="/search" aria-label="Search"><SearchIcon /></IconButton>} />
      <Box sx={{ position: 'sticky', top: 56, zIndex: 15, bgcolor: 'rgba(244,244,246,.96)', backdropFilter: 'blur(12px)', pt: 1.25, pb: 1 }}>
        <Box className="no-scrollbar" role="tablist" aria-label="Sub-categories" sx={{ display: 'flex', gap: 1, overflowX: 'auto', px: 2 }}>
          <Pill active={!sub} onClick={() => setParams({}, { replace: true })}>All</Pill>
          {dept.children.map((s) => <Pill key={s.slug} active={sub === s.slug} onClick={() => setParams({ sub: s.slug }, { replace: true })}>{s.name}</Pill>)}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, mt: 1 }}>
          <Button size="small" variant="outlined" color="inherit" startIcon={<SlidersIcon />} onClick={() => setSheet('filter')} sx={{ borderColor: filters ? c.navy : c.line2, color: filters ? c.navy : c.ink, bgcolor: '#fff' }}>
            Filter{filters ? ` · ${filters}` : ''}
          </Button>
          <Button size="small" variant="outlined" color="inherit" onClick={() => setSheet('sort')} sx={{ borderColor: c.line2, bgcolor: '#fff' }}>{SORTS.find(([k]) => k === sort)?.[1]}</Button>
          <Typography role="status" sx={{ ml: 'auto', fontSize: 12.5, color: c.text3 }}>{list.length} shown</Typography>
          <IconButton aria-label={view === 'grid' ? 'Show as list' : 'Show as grid'} onClick={() => setView(view === 'grid' ? 'list' : 'grid')} sx={{ bgcolor: '#fff', border: `1px solid ${c.line}`, width: 36, height: 36 }}>
            {view === 'grid' ? <ListIcon sx={{ fontSize: 19 }} /> : <GridViewIcon sx={{ fontSize: 19 }} />}
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ px: 2, pt: 1, pb: 2 }}>
        {!list.length ? (
          <EmptyState icon={BoxIcon} title="Nothing matches these filters" body="Try another sub-category or clear the filters." action="Clear filters" onAction={() => { setBrandsOn([]); setInStock(false); setOnSale(false); setParams({}, { replace: true }) }} />
        ) : view === 'grid' ? (
          <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 1.25 }}>
            {list.map((p) => <li key={p.sku}><ProductCard product={p} /></li>)}
          </Box>
        ) : (
          <Box sx={{ bgcolor: '#fff', borderRadius: `${tokens.radius.md}px`, border: `1px solid ${c.line}`, px: 1.5, '& > * + *': { borderTop: `1px solid ${c.line}` } }}>
            {list.map((p) => <ProductRow key={p.sku} product={p} />)}
          </Box>
        )}
        <Typography sx={{ textAlign: 'center', fontSize: 12.5, color: c.text3, mt: 2.5 }}>Prototype shows a sample of {dept.count.toLocaleString()} {dept.name.toLowerCase()} products.</Typography>
      </Box>

      <Sheet open={sheet === 'sort'} onClose={() => setSheet(null)} title="Sort by">
        {SORTS.map(([k, label]) => (
          <Box key={k} component="button" onClick={() => { setSort(k); setSheet(null) }} aria-pressed={sort === k} sx={{ all: 'unset', boxSizing: 'border-box', cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', minHeight: 52, borderTop: `1px solid ${c.line}`, fontSize: 15, fontWeight: sort === k ? 700 : 500, color: sort === k ? c.navy : c.ink }}>
            <Box sx={{ flex: 1 }}>{label}</Box>{sort === k && <CheckIcon />}
          </Box>
        ))}
      </Sheet>
      <Sheet open={sheet === 'filter'} onClose={() => setSheet(null)} title="Filter"
        footer={<Box sx={{ display: 'flex', gap: 1 }}><Button variant="outlined" color="secondary" onClick={() => { setBrandsOn([]); setInStock(false); setOnSale(false) }} sx={{ flex: 1 }}>Clear</Button><Button variant="contained" onClick={() => setSheet(null)} sx={{ flex: 2 }}>Show {list.length} products</Button></Box>}>
        <Typography variant="overline" component="h3" sx={{ color: c.text3 }}>Availability</Typography>
        <FormControlLabel control={<Checkbox checked={inStock} onChange={(e) => setInStock(e.target.checked)} />} label="In stock only" sx={{ display: 'flex' }} />
        <FormControlLabel control={<Checkbox checked={onSale} onChange={(e) => setOnSale(e.target.checked)} />} label="On sale" sx={{ display: 'flex' }} />
        <Typography variant="overline" component="h3" sx={{ color: c.text3, display: 'block', mt: 1.5 }}>Brand</Typography>
        {brandOptions.map((b) => (
          <FormControlLabel key={b} control={<Checkbox checked={brandsOn.includes(b)} onChange={() => setBrandsOn((x) => (x.includes(b) ? x.filter((y) => y !== b) : [...x, b]))} />} label={b} sx={{ display: 'flex' }} />
        ))}
      </Sheet>
    </Box>
  )
}
