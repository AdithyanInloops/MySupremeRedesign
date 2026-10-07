import { useMemo, useState } from 'react'
import Head from 'next/head'
import { Box, Button, InputAdornment, InputBase, Typography } from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { brands } from '../lib/data'
import { colors, radius } from '../lib/theme'
import PageHeader from '../components/ui/PageHeader'
import { PageContainer } from '../components/ui/Section'
import EmptyState from '../components/ui/EmptyState'
import { BrandTile } from '../components/HomeComponents/BrandStrip'

const PAGE = 60

/**
 * Brands: 650+ logos, so the page leads with "find a brand" and an A–Z filter, and loads more on request instead of
 * rendering everything at once. Each tile opens a brand-filtered search (live behaviour).
 */
export default function BrandsPage() {
  const [q, setQ] = useState('')
  const [letter, setLetter] = useState<string | null>(null)
  const [limit, setLimit] = useState(PAGE)
  const sorted = useMemo(() => [...brands].sort((a, b) => Number(!!b.image_url) - Number(!!a.image_url) || a.brand_name.localeCompare(b.brand_name)), [])
  const letters = useMemo(() => Array.from(new Set(brands.map((b) => (/[a-z]/i.test(b.brand_name[0]) ? b.brand_name[0].toUpperCase() : '#')))).sort(), [])
  const list = sorted.filter((b) => {
    const first = /[a-z]/i.test(b.brand_name[0]) ? b.brand_name[0].toUpperCase() : '#'
    return (!q.trim() || b.brand_name.toLowerCase().includes(q.trim().toLowerCase())) && (!letter || first === letter)
  })
  const shown = list.slice(0, limit)
  const reset = () => { setQ(''); setLetter(null); setLimit(PAGE) }

  return (
    <>
      <Head><title>Brands | MySupreme</title></Head>
      <PageContainer sx={{ pb: { xs: 5, md: 8 } }}>
        <PageHeader breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Brands' }]} title="Shop by brand" meta={`${brands.length.toLocaleString()} brands`} />
        <InputBase
          value={q}
          onChange={(e) => { setQ(e.target.value); setLimit(PAGE) }}
          placeholder="Find a brand"
          inputProps={{ 'aria-label': 'Find a brand' }}
          startAdornment={<InputAdornment position="start"><SearchRoundedIcon sx={{ color: colors.ink500 }} /></InputAdornment>}
          endAdornment={q ? <InputAdornment position="end"><Button size="small" onClick={() => setQ('')} startIcon={<CloseRoundedIcon />}>Clear</Button></InputAdornment> : undefined}
          sx={{ width: '100%', maxWidth: 520, height: 48, px: 1.75, border: `1px solid ${colors.line2}`, borderRadius: radius.md, fontSize: 15, '&.Mui-focused': { borderColor: colors.navy, boxShadow: `0 0 0 3px ${colors.navyTint}` } }}
        />
        <Box role="group" aria-label="Filter by first letter" sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 2, mb: 3 }}>
          <Button size="small" variant={letter ? 'text' : 'contained'} color={letter ? 'inherit' : 'secondary'} onClick={() => { setLetter(null); setLimit(PAGE) }} aria-pressed={!letter} sx={{ minWidth: 44 }}>All</Button>
          {letters.map((l) => (
            <Button key={l} size="small" variant={letter === l ? 'contained' : 'text'} color={letter === l ? 'secondary' : 'inherit'} onClick={() => { setLetter(l); setLimit(PAGE) }} aria-pressed={letter === l} sx={{ minWidth: 36, px: 1 }}>{l}</Button>
          ))}
        </Box>
        <Typography role="status" sx={{ fontSize: 14, color: colors.ink600, mb: 2 }}>{list.length ? `Showing ${shown.length} of ${list.length} brands` : ''}</Typography>
        {list.length ? (
          <>
            <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: { xs: 1.25, md: 2 }, gridTemplateColumns: { xs: 'repeat(2, minmax(0,1fr))', sm: 'repeat(3, minmax(0,1fr))', md: 'repeat(4, minmax(0,1fr))', lg: 'repeat(6, minmax(0,1fr))' } }}>
              {shown.map((b) => (
                <li key={b.brand_id}>
                  <BrandTile brand={b} />
                  <Typography sx={{ fontSize: 13, color: colors.ink700, textAlign: 'center', mt: 0.75, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.brand_name}</Typography>
                </li>
              ))}
            </Box>
            {shown.length < list.length && (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Button variant="outlined" size="large" onClick={() => setLimit((n) => n + PAGE)}>Show more brands ({list.length - shown.length} left)</Button>
              </Box>
            )}
          </>
        ) : (
          <EmptyState size="inline" title={`No brands match “${q}”`} actions={<Button variant="outlined" onClick={reset}>Show all brands</Button>}>Check the spelling, or search products by brand name from the search bar.</EmptyState>
        )}
      </PageContainer>
    </>
  )
}
