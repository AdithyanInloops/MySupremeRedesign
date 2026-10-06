import { useMemo, useState } from 'react'
import { Box, Button, InputAdornment, Stack, TextField, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import SearchRounded from '@mui/icons-material/SearchRounded'
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded'
import KitchenRounded from '@mui/icons-material/KitchenRounded'
import SearchOffRounded from '@mui/icons-material/SearchOffRounded'
import { tokens } from '../../theme'
import { departments, type Department } from '../../data/catalog'
import { Container, EmptyState } from '../../components/ui'
import { PageTitle } from '../../components/Shared'
import { Crown } from '../../components/Brand'

const c = tokens.color

function DeptImage({ d }: { d: Department }) {
  return (
    <Box sx={{ position: 'relative', width: { xs: 72, md: 96 }, height: { xs: 72, md: 96 }, borderRadius: `${tokens.radius.md}px`, overflow: 'hidden', flexShrink: 0, bgcolor: c.navy }}>
      {d.image ? (
        <Box component="img" src={d.image} alt="" loading="lazy" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: `linear-gradient(135deg, ${c.navy}, ${c.navyDark})` }}>
          <Box sx={{ position: 'absolute', right: -10, bottom: -8, opacity: 0.15 }}><Crown size={70} color="#fff" /></Box>
          <KitchenRounded sx={{ color: '#fff', fontSize: 34 }} />
        </Box>
      )}
    </Box>
  )
}

export default function AllCategories() {
  const [q, setQ] = useState('')
  const t = q.trim().toLowerCase()

  // Filter keeps a department if its name, any level-2 or level-3 child matches.
  const list = useMemo(() => {
    if (!t) return departments
    return departments
      .map((d) => {
        if (d.name.toLowerCase().includes(t)) return d
        const children = d.children
          .map((s) => {
            if (s.name.toLowerCase().includes(t)) return s
            const kids = s.children?.filter((k) => k.name.toLowerCase().includes(t))
            return kids?.length ? { ...s, children: kids } : null
          })
          .filter(Boolean) as Department['children']
        return children.length ? { ...d, children } : null
      })
      .filter(Boolean) as Department[]
  }, [t])

  const mark = (txt: string) => {
    if (!t) return txt
    const i = txt.toLowerCase().indexOf(t)
    if (i < 0) return txt
    return <>{txt.slice(0, i)}<Box component="mark" sx={{ bgcolor: '#FFF3C4', color: 'inherit', borderRadius: 0.5 }}>{txt.slice(i, i + t.length)}</Box>{txt.slice(i + t.length)}</>
  }

  return (
    <Container>
      <PageTitle
        crumbs={[{ label: 'All categories' }]}
        title="All categories"
        subtitle="9 departments · 4,300+ products for restaurants, cafés and caterers"
        action={
          <TextField
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Find a category, e.g. clamshells"
            inputProps={{ 'aria-label': 'Search within categories' }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchRounded /></InputAdornment> }}
            sx={{ width: { xs: '100%', md: 360 } }}
          />
        }
      />

      {/* Quick jump nav — sticky under the header on desktop */}
      <Box
        component="nav"
        aria-label="Jump to department"
        className="no-scrollbar"
        sx={{
          position: { md: 'sticky' }, top: { md: 165 }, zIndex: 5, display: 'flex', gap: 1, overflowX: 'auto',
          py: 1.5, mb: 3, mx: { xs: -2, md: 0 }, px: { xs: 2, md: 0 }, bgcolor: c.bg,
        }}
      >
        {departments.map((d) => {
          const on = list.some((x) => x.id === d.id)
          return (
            <Button
              key={d.id}
              href={`#dept-${d.id}`}
              onClick={(e) => { e.preventDefault(); document.getElementById(`dept-${d.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}
              disabled={!on}
              variant="outlined"
              color="inherit"
              sx={{ flexShrink: 0, borderRadius: 999, borderColor: c.line, bgcolor: '#fff', fontWeight: 600, '&:hover': { borderColor: c.navy, color: c.navy } }}
            >
              {d.name}
            </Button>
          )
        })}
      </Box>

      {list.length === 0 ? (
        <EmptyState icon={<SearchOffRounded />} title={`No categories match “${q}”`} body="Try a broader word like “cups”, “rice” or “cleaning” — or search all 4,300 products." action={`Search products for “${q}”`} href={`/search/${encodeURIComponent(q)}`} />
      ) : (
        <Stack spacing={{ xs: 2, md: 3 }}>
          {list.map((d) => (
            <Box key={d.id} id={`dept-${d.id}`} component="section" aria-labelledby={`h-${d.id}`}
              sx={{ scrollMarginTop: { xs: 150, md: 240 }, bgcolor: '#fff', border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.xl}px`, p: { xs: 2, md: 3.5 } }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2.5 }}>
                <DeptImage d={d} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography id={`h-${d.id}`} variant="h3" component="h2">{mark(d.name)}</Typography>
                  <Typography variant="body2" color="text.secondary">{d.tagline} · {d.count.toLocaleString()} products</Typography>
                </Box>
                <Button component={RouterLink} to={`/c/${d.slug}`} variant="outlined" color="secondary" endIcon={<ArrowForwardRounded />} sx={{ display: { xs: 'none', sm: 'inline-flex' }, flexShrink: 0 }}>
                  Shop all
                </Button>
              </Stack>
              <Box sx={{ display: 'grid', gap: { xs: 1, md: 1.5 }, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' } }}>
                {d.children.map((s) => (
                  <Box key={s.slug} sx={{ p: 1.75, borderRadius: `${tokens.radius.md}px`, bgcolor: c.bg, border: `1px solid transparent`, '&:hover': { borderColor: c.line } }}>
                    <Box component={RouterLink} to={`/c/${d.slug}?sub=${encodeURIComponent(s.name)}`}
                      sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 32, fontWeight: 600, fontSize: 14.5, color: c.ink, textDecoration: 'none', '&:hover': { color: c.red } }}>
                      <span>{mark(s.name)}</span>
                      <Box component="span" sx={{ fontSize: 12, color: c.text3, fontWeight: 500, bgcolor: '#fff', px: 1, borderRadius: 999 }}>{s.count}</Box>
                    </Box>
                    {s.children && (
                      <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ mt: 1 }}>
                        {s.children.map((k) => (
                          <Box key={k.slug} component={RouterLink} to={`/c/${d.slug}?sub=${encodeURIComponent(s.name)}`}
                            sx={{ fontSize: 12.5, color: c.text2, textDecoration: 'none', bgcolor: '#fff', border: `1px solid ${c.line}`, borderRadius: 999, px: 1.25, py: 0.5, '&:hover': { color: c.red, borderColor: c.red } }}>
                            {mark(k.name)} <Box component="span" sx={{ color: c.text3 }}>· {k.count}</Box>
                          </Box>
                        ))}
                      </Stack>
                    )}
                  </Box>
                ))}
              </Box>
              <Button component={RouterLink} to={`/c/${d.slug}`} fullWidth variant="outlined" color="secondary" endIcon={<ArrowForwardRounded />} sx={{ display: { xs: 'flex', sm: 'none' }, mt: 2 }}>
                Shop all {d.name}
              </Button>
            </Box>
          ))}
        </Stack>
      )}
    </Container>
  )
}
