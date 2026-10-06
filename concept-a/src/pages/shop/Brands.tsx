import { useMemo, useState } from 'react'
import { Box, InputAdornment, Stack, TextField, Typography } from '@mui/material'
import SearchRounded from '@mui/icons-material/SearchRounded'
import SearchOffRounded from '@mui/icons-material/SearchOffRounded'
import { tokens } from '../../theme'
import { brands } from '../../data/catalog'
import { Container, EmptyState } from '../../components/ui'
import { PageTitle } from '../../components/Shared'
import { BrandTile } from './home/Sections'

const c = tokens.color
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default function Brands() {
  const [q, setQ] = useState('')
  const filtered = useMemo(() => brands.filter((b) => b.name.toLowerCase().includes(q.trim().toLowerCase())).sort((a, b) => a.name.localeCompare(b.name)), [q])
  const groups = useMemo(() => {
    const g: Record<string, typeof brands> = {}
    filtered.forEach((b) => { (g[b.name[0].toUpperCase()] ??= []).push(b) })
    return g
  }, [filtered])

  return (
    <Container>
      <PageTitle
        crumbs={[{ label: 'Brands' }]}
        title="Brands"
        subtitle={`${brands.length} food-service brands, from Monin to McCain. Tap a brand to see everything we stock.`}
        action={
          <TextField
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter brands"
            inputProps={{ 'aria-label': 'Filter brands' }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchRounded /></InputAdornment> }}
            sx={{ width: { xs: '100%', md: 320 } }}
          />
        }
      />

      <Box component="nav" aria-label="Jump to letter" className="no-scrollbar"
        sx={{ position: { md: 'sticky' }, top: { md: 165 }, zIndex: 5, bgcolor: c.bg, display: 'flex', gap: 0.5, overflowX: 'auto', py: 1, mb: 3, mx: { xs: -2, md: 0 }, px: { xs: 2, md: 0 } }}>
        {letters.map((l) => {
          const on = !!groups[l]
          return (
            <Box
              key={l}
              component={on ? 'a' : 'span'}
              href={on ? `#brand-${l}` : undefined}
              onClick={(e: React.MouseEvent) => { if (!on) return; e.preventDefault(); document.getElementById(`brand-${l}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}
              aria-disabled={!on}
              sx={{
                flexShrink: 0, width: 44, height: 44, display: 'grid', placeItems: 'center', borderRadius: `${tokens.radius.sm}px`, fontWeight: 700, fontSize: 14, textDecoration: 'none',
                color: on ? c.navy : c.line2, bgcolor: on ? '#fff' : 'transparent', border: on ? `1px solid ${c.line}` : '1px solid transparent',
                cursor: on ? 'pointer' : 'default', '&:hover': on ? { bgcolor: c.navy, color: '#fff' } : {},
              }}
            >
              {l}
            </Box>
          )
        })}
      </Box>

      {filtered.length === 0 ? (
        <EmptyState icon={<SearchOffRounded />} title={`No brand called “${q}”`} body="We may still stock it under a different name — try searching products instead." action={`Search “${q}”`} href={`/search/${encodeURIComponent(q)}`} />
      ) : (
        <Stack spacing={4}>
          {Object.entries(groups).map(([l, list]) => (
            <Box key={l} id={`brand-${l}`} component="section" sx={{ scrollMarginTop: { xs: 150, md: 240 } }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1.5 }}>
                <Typography variant="h3" component="h2" sx={{ color: c.red, width: 32 }}>{l}</Typography>
                <Box sx={{ flex: 1, height: 1, bgcolor: c.line }} />
                <Typography variant="caption" color="text.secondary">{list.length} {list.length === 1 ? 'brand' : 'brands'}</Typography>
              </Stack>
              <Box sx={{ display: 'grid', gap: { xs: 1.25, md: 2 }, gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)', lg: 'repeat(6, 1fr)' } }}>
                {list.map((b) => <BrandTile key={b.slug} name={b.name} />)}
              </Box>
            </Box>
          ))}
        </Stack>
      )}
    </Container>
  )
}
