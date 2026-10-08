import { useEffect, useMemo, useRef, useState } from 'react'
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom'
import { Box, Button, IconButton, InputBase, Typography } from '@mui/material'
import { tokens, focusRing, srOnly } from '../theme'
import { useApp } from '../state/app'
import { departments, newArrivals, productBySku, recommended, searchProducts, trendingSearches } from '../data/catalog'
import { ProductRow, ProductTile } from '../components/ProductCard'
import { EmptyState, HScroll, Pill } from '../components/ui'
import { ArrowUpLeftIcon, BarcodeIcon, ChevronLeftIcon, CloseIcon, HistoryIcon, SearchIcon, SearchXIcon, TrendingUpIcon } from '../components/icons'

const c = tokens.color

/** Full-screen search: recent + trending when empty, live results (products + matching categories) as you type. */
export default function Search() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const { recentSearches, pushSearch, clearSearches, recentlyViewed } = useApp()
  const viewed = recentlyViewed.map(productBySku).filter((p): p is NonNullable<typeof p> => !!p).slice(0, 8)
  const [q, setQ] = useState(params.get('q') ?? '')
  const input = useRef<HTMLInputElement>(null)
  useEffect(() => { if (!params.get('q')) input.current?.focus() }, [params])

  const term = q.trim()
  const special = term === 'recommended' ? recommended : term === 'new' ? newArrivals : null
  const results = useMemo(() => special ?? searchProducts(term), [term, special])
  const cats = useMemo(() => (term.length > 1 && !special ? departments.flatMap((d) => [d, ...d.children.map((s) => ({ ...s, parent: d }))]).filter((x) => x.name.toLowerCase().includes(term.toLowerCase())).slice(0, 4) : []), [term, special])
  const submit = (v = q) => { const t = v.trim(); if (!t) return; setQ(t); setParams({ q: t }, { replace: true }); pushSearch(t); input.current?.blur() }
  const title = term === 'recommended' ? 'Recommended for your kitchen' : term === 'new' ? 'New arrivals' : null

  return (
    <Box sx={{ minHeight: '100%', bgcolor: '#fff' }}>
      <Typography component="h1" sx={srOnly}>Search</Typography>
      <Box component="form" role="search" onSubmit={(e) => { e.preventDefault(); submit() }} sx={{ position: 'sticky', top: 0, zIndex: 20, display: 'flex', alignItems: 'center', gap: 0.75, px: 1, pt: 'calc(8px + env(safe-area-inset-top))', pb: 1, bgcolor: '#fff', borderBottom: `1px solid ${c.line}` }}>
        <IconButton aria-label="Back" onClick={() => navigate(-1)}><ChevronLeftIcon /></IconButton>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1, height: 46, px: 1.5, borderRadius: `${tokens.radius.md}px`, bgcolor: c.surface2, border: `1.5px solid transparent`, '&:focus-within': { borderColor: c.navy, bgcolor: '#fff' } }}>
          <SearchIcon sx={{ color: c.text3, fontSize: 21 }} />
          <InputBase inputRef={input} value={title ?? q} onChange={(e) => setQ(e.target.value)} placeholder="Products, brands or SKU" inputProps={{ 'aria-label': 'Search products, brands or SKU', enterKeyHint: 'search', autoComplete: 'off' }} sx={{ flex: 1, fontSize: 16 }} />
          {q && <IconButton aria-label="Clear search" size="small" onClick={() => { setQ(''); setParams({}, { replace: true }); input.current?.focus() }}><CloseIcon sx={{ fontSize: 18 }} /></IconButton>}
        </Box>
        <IconButton component={RouterLink} to="/scan" aria-label="Scan a barcode" sx={{ color: c.red }}><BarcodeIcon /></IconButton>
      </Box>

      {!term ? (
        <Box sx={{ px: 2, py: 2 }}>
          {recentSearches.length > 0 && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="overline" component="h2" sx={{ color: c.text3 }}>Recent</Typography>
                <Button size="small" onClick={clearSearches} sx={{ color: c.text2 }}>Clear</Button>
              </Box>
              <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, mb: 2 }}>
                {recentSearches.map((r) => (
                  <li key={r}>
                    <Box component="button" onClick={() => submit(r)} sx={{ all: 'unset', boxSizing: 'border-box', cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', gap: 1.5, minHeight: 46, ...focusRing }}>
                      <HistoryIcon sx={{ color: c.text4, fontSize: 20 }} /><Typography sx={{ flex: 1, fontSize: 15 }}>{r}</Typography><ArrowUpLeftIcon sx={{ color: c.text4, fontSize: 18 }} />
                    </Box>
                  </li>
                ))}
              </Box>
            </>
          )}
          {viewed.length > 0 && (
            <Box sx={{ mx: -2, mb: 2.5 }}>
              <Typography variant="overline" component="h2" sx={{ color: c.text3, px: 2, display: 'block', mb: 0.5 }}>Recently viewed</Typography>
              <HScroll gap={1}>{viewed.map((p) => <ProductTile key={p.sku} product={p} width={232} />)}</HScroll>
            </Box>
          )}
          <Typography variant="overline" component="h2" sx={{ color: c.text3, display: 'flex', alignItems: 'center', gap: 0.5 }}><TrendingUpIcon sx={{ fontSize: 16 }} /> Trending this week</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1, mb: 3 }}>
            {trendingSearches.map((t) => <Pill key={t} onClick={() => submit(t)}>{t}</Pill>)}
          </Box>
          <Typography variant="overline" component="h2" sx={{ color: c.text3 }}>Browse departments</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 1, mt: 1 }}>
            {departments.map((d) => (
              <Box key={d.id} component={RouterLink} to={`/shop/${d.slug}`} sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, borderRadius: `${tokens.radius.sm}px`, bgcolor: c.surface2, textDecoration: 'none', color: c.ink, fontSize: 13.5, fontWeight: 600, ...focusRing }}>
                <Box sx={{ width: 32, height: 32, borderRadius: '50%', overflow: 'hidden', bgcolor: c.navyTint, flexShrink: 0 }}>{d.image && <Box component="img" src={d.image} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />}</Box>
                {d.name}
              </Box>
            ))}
          </Box>
        </Box>
      ) : (
        <Box sx={{ px: 2, pb: 3 }}>
          {cats.length > 0 && (
            <Box className="no-scrollbar" sx={{ display: 'flex', gap: 1, overflowX: 'auto', py: 1.5, mx: -2, px: 2 }}>
              {cats.map((x) => {
                const parent = 'parent' in x ? x.parent : null
                return <Pill key={x.slug + (parent?.slug ?? '')} onClick={() => navigate(parent ? `/shop/${parent.slug}?sub=${x.slug}` : `/shop/${x.slug}`)}>{x.name}{parent ? ` · ${parent.name}` : ''}</Pill>
              })}
            </Box>
          )}
          <Typography role="status" sx={{ fontSize: 13, color: c.text3, py: 1 }}>{results.length} {results.length === 1 ? 'product' : 'products'}{title ? '' : ` for “${term}”`}</Typography>
          {results.length ? (
            <Box sx={{ '& > * + *': { borderTop: `1px solid ${c.line}` } }}>{results.map((p) => <ProductRow key={p.sku} product={p} />)}</Box>
          ) : (
            <EmptyState icon={SearchXIcon} title={`No products match “${term}”`} body="Check the spelling or SKU, or try a broader word like “rice” or “cups”." action="Browse departments" to="/shop" />
          )}
        </Box>
      )}
    </Box>
  )
}
