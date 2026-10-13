import { useMemo, useState } from 'react'
import { Box, Button, InputAdornment, InputBase, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import SearchRounded from '@mui/icons-material/SearchRounded'
import CloseRounded from '@mui/icons-material/CloseRounded'
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded'
import SearchOffRounded from '@mui/icons-material/SearchOffRounded'
import KitchenRounded from '@mui/icons-material/KitchenRounded'
import { tokens } from '../../theme'
import { categoryTree as departments } from '../../data/categoryTree'
import { departments as shopDepts } from '../../data/catalog'
import { Container, EmptyState } from '../../components/ui'
import { PageTitle } from '../../components/Shared'
import { deptIcons } from '../../components/DeptIcons'
import { Crown } from '../../components/Brand'

const c = tokens.color

/** One-line department description (Concept A copy), e.g. "Take-out, containers & disposables". */
const taglineOf = (key: string) => shopDepts.find((d) => d.slug === key)?.tagline

/** Concept A department photo; navy tile with crown watermark when a department has no photo (Ware & Equipment). */
function DeptImage({ slug }: { slug: string }) {
  const image = shopDepts.find((d) => d.slug === slug)?.image
  return (
    <Box sx={{ position: 'relative', width: { xs: 72, md: 96 }, height: { xs: 72, md: 96 }, borderRadius: `${tokens.radius.md}px`, overflow: 'hidden', flexShrink: 0, bgcolor: c.navy }}>
      {image ? (
        <Box component="img" src={image} alt="" loading="lazy" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: `linear-gradient(135deg, ${c.navy}, ${c.navyDark})` }}>
          <Box sx={{ position: 'absolute', right: -10, bottom: -8, opacity: 0.15 }}><Crown size={70} color="#fff" /></Box>
          <KitchenRounded sx={{ color: '#fff', fontSize: 34 }} />
        </Box>
      )}
    </Box>
  )
}

const focusRing = { '&:focus-visible': { outline: `3px solid ${c.navy}`, outlineOffset: 2 } }

/**
 * Every department and sub-category on one scannable page, with a sticky jump list (desktop) and "find a category".
 */
export default function AllCategories() {
  const [q, setQ] = useState('')
  const t = q.trim().toLowerCase()
  const list = useMemo(
    () => departments
      .map((d) => ({ ...d, subs: t ? d.children.filter((s) => s.name.toLowerCase().includes(t) || d.name.toLowerCase().includes(t)) : d.children }))
      .filter((d) => d.subs.length || d.name.toLowerCase().includes(t)),
    [t],
  )
  const total = departments.reduce((a, d) => a + d.children.length, 0)

  return (
    <Container sx={{ pb: { xs: 5, md: 8 } }}>
      <PageTitle
        dense
        title="All categories"
        subtitle={`${departments.length} departments · ${total} categories`}
        action={
          <InputBase
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Find a category, e.g. rice, cups, gloves"
            inputProps={{ 'aria-label': 'Find a category' }}
            startAdornment={<InputAdornment position="start"><SearchRounded sx={{ color: c.text3 }} /></InputAdornment>}
            endAdornment={q ? <InputAdornment position="end"><Button size="small" onClick={() => setQ('')} startIcon={<CloseRounded />}>Clear</Button></InputAdornment> : undefined}
            sx={{
              width: '100%', maxWidth: { md: 400 }, height: 48, px: 1.75, fontSize: 15, bgcolor: '#fff',
              border: `1px solid ${c.line2}`, borderRadius: `${tokens.radius.sm}px`,
              '&.Mui-focused': { borderColor: c.navy, boxShadow: `0 0 0 3px ${c.navyTint}` },
            }}
          />
        }
      />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', lg: '240px minmax(0,1fr)' }, gap: { lg: 5 } }}>
        <Box component="nav" aria-label="Jump to department" sx={{ display: { xs: 'none', lg: 'block' } }}>
          <Box sx={{ position: 'sticky', top: 180, display: 'flex', flexDirection: 'column', gap: 0.25 }}>
            {departments.map((d) => {
              const Icon = deptIcons[d.url_key]
              return (
                <Box
                  key={d.url_key}
                  component="a"
                  href={`#dept-${d.url_key}`}
                  onClick={(e: React.MouseEvent) => { e.preventDefault(); document.getElementById(`dept-${d.url_key}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 1.25, px: 1.25, py: 1, borderRadius: `${tokens.radius.sm}px`,
                    color: c.text2, textDecoration: 'none', fontSize: 14.5, '&:hover': { bgcolor: c.surface2, color: c.ink }, ...focusRing,
                  }}
                >
                  {Icon && <Icon sx={{ fontSize: 20, color: c.text3 }} />}{d.name}
                </Box>
              )
            })}
          </Box>
        </Box>

        <Box>
          {!list.length ? (
            <EmptyState
              icon={<SearchOffRounded />}
              title={`No categories match “${q}”`}
              body="Try a broader word, or search products instead."
              action={`Search products for “${q}”`}
              href={`/search/${encodeURIComponent(q)}`}
              secondary={<Button variant="outlined" size="large" onClick={() => setQ('')}>Clear</Button>}
            />
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 4, md: 5 } }}>
              {list.map((d) => (
                <Box key={d.url_key} component="section" id={`dept-${d.url_key}`} aria-labelledby={`dept-${d.url_key}-title`} sx={{ scrollMarginTop: { xs: 150, md: 200 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 2 }, mb: 1.5 }}>
                    <DeptImage slug={d.url_key} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography id={`dept-${d.url_key}-title`} variant="h3" component="h2">{d.name}</Typography>
                      <Typography variant="body2" sx={{ color: c.text2 }}>
                        {[taglineOf(d.url_key), `${d.product_count.toLocaleString()} products`].filter(Boolean).join(' · ')}
                      </Typography>
                    </Box>
                    <Button component={RouterLink} to={`/shop/${d.url_key}`} variant="outlined" color="secondary" endIcon={<ArrowForwardRounded />} sx={{ flexShrink: 0, display: { xs: 'none', sm: 'inline-flex' } }}>
                      Shop all
                    </Button>
                  </Box>
                  <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: 1, gridTemplateColumns: { xs: 'minmax(0,1fr) minmax(0,1fr)', md: 'repeat(3, minmax(0,1fr))', xl: 'repeat(4, minmax(0,1fr))' } }}>
                    {d.subs.map((s) => (
                      <li key={s.url_key}>
                        <Box
                          component={RouterLink}
                          to={`/shop/${d.url_key}?sub=${s.url_key}`}
                          sx={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, px: 1.75, py: 1.25, minHeight: 48,
                            borderRadius: `${tokens.radius.sm}px`, border: `1px solid ${c.line}`, bgcolor: '#fff', color: c.ink, textDecoration: 'none', fontSize: 14.5,
                            '&:hover': { borderColor: c.line2, bgcolor: c.surface2 }, ...focusRing,
                          }}
                        >
                          <span>{s.name}</span>
                          {s.product_count != null && <Box component="span" sx={{ fontSize: 12.5, color: c.text3, flexShrink: 0 }}>{s.product_count.toLocaleString()}</Box>}
                        </Box>
                      </li>
                    ))}
                    <Box component="li" sx={{ display: { sm: 'none' } }}>
                      <Box component={RouterLink} to={`/shop/${d.url_key}`} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1.75, minHeight: 48, color: c.red, fontWeight: 600, fontSize: 14.5, textDecoration: 'none' }}>
                        Shop all <ArrowForwardRounded sx={{ fontSize: 18 }} />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  )
}
