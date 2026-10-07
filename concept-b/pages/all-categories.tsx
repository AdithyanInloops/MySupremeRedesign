import { useMemo, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Box, Button, InputAdornment, InputBase, Typography } from '@mui/material'
import { departments } from '../lib/data'
import { colors, focusRing, layout, radius } from '../lib/theme'
import PageHeader from '../components/ui/PageHeader'
import { PageContainer } from '../components/ui/Section'
import EmptyState from '../components/ui/EmptyState'
import { deptIcons } from '../components/Layout/CategoryMenu'
import { ArrowRightIcon, CloseIcon, SearchIcon } from '../components/ui/icons'

/**
 * Every department and sub-category on one scannable page, with a sticky jump list and "find a category".
 * Replaces the old pick-a-department-then-look-right layout, where only one department was visible at a time.
 */
export default function AllCategories() {
  const [q, setQ] = useState('')
  const t = q.trim().toLowerCase()
  const list = useMemo(
    () => departments
      .map((d) => ({ ...d, subs: t ? d.children.filter((c) => c.name.toLowerCase().includes(t) || d.name.toLowerCase().includes(t)) : d.children }))
      .filter((d) => d.subs.length || d.name.toLowerCase().includes(t)),
    [t],
  )
  const total = departments.reduce((a, d) => a + d.children.length, 0)
  return (
    <>
      <Head><title>All categories | MySupreme</title></Head>
      <PageContainer sx={{ pb: { xs: 5, md: 8 } }}>
        <PageHeader breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'All categories' }]} title="All categories" meta={`${departments.length} departments · ${total} categories`} />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', lg: '240px minmax(0,1fr)' }, gap: { lg: 5 } }}>
          <Box component="nav" aria-label="Jump to department" sx={{ display: { xs: 'none', lg: 'block' } }}>
            <Box sx={{ position: 'sticky', top: 180, display: 'flex', flexDirection: 'column', gap: 0.25 }}>
              {departments.map((d) => {
                const Icon = deptIcons[d.url_key]
                return (
                  <Box key={d.uid} component="a" href={`#dept-${d.url_key}`} sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 1.25, py: 1, borderRadius: radius.md, color: colors.ink700, textDecoration: 'none', fontSize: 14.5, '&:hover': { bgcolor: colors.sunken, color: colors.ink }, ...focusRing }}>
                    {Icon && <Icon sx={{ fontSize: 20, color: colors.ink500 }} />}{d.name}
                  </Box>
                )
              })}
            </Box>
          </Box>
          <Box>
            <InputBase
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Find a category, e.g. rice, cups, gloves"
              inputProps={{ 'aria-label': 'Find a category' }}
              startAdornment={<InputAdornment position="start"><SearchIcon sx={{ color: colors.ink500 }} /></InputAdornment>}
              endAdornment={q ? <InputAdornment position="end"><Button size="small" onClick={() => setQ('')} startIcon={<CloseIcon />}>Clear</Button></InputAdornment> : undefined}
              sx={{ width: '100%', maxWidth: 520, height: 48, px: 1.75, border: `1px solid ${colors.line2}`, borderRadius: radius.md, fontSize: 15, mb: 3, '&.Mui-focused': { borderColor: colors.navy, boxShadow: `0 0 0 3px ${colors.navyTint}` } }}
            />
            {!list.length ? (
              <EmptyState size="inline" title={`No categories match “${q}”`} actions={<><Button variant="outlined" onClick={() => setQ('')}>Clear</Button><Button component={Link} href={`/search/${encodeURIComponent(q)}`} variant="contained">Search products for “{q}”</Button></>}>
                Try a broader word, or search products instead.
              </EmptyState>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 4, md: 5 } }}>
                {list.map((d) => (
                  <Box key={d.uid} component="section" id={`dept-${d.url_key}`} aria-labelledby={`dept-${d.url_key}-title`} sx={{ scrollMarginTop: layout.headerOffset }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Box sx={{ width: 64, height: 64, borderRadius: radius.lg, overflow: 'hidden', bgcolor: colors.sunken, flexShrink: 0 }}>
                        {d.image && <Box component="img" src={d.image} alt="" loading="lazy" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography id={`dept-${d.url_key}-title`} component="h2" variant="h2" sx={{ fontSize: { xs: 20, md: 22 } }}>{d.name}</Typography>
                        <Typography sx={{ fontSize: 13.5, color: colors.ink500 }}>{d.product_count.toLocaleString()} products · {d.children.length} categories</Typography>
                      </Box>
                      <Button component={Link} href={`/${d.url_key}`} endIcon={<ArrowRightIcon />} color="primary" sx={{ flexShrink: 0, display: { xs: 'none', sm: 'inline-flex' } }}>Shop all</Button>
                    </Box>
                    <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: 1, gridTemplateColumns: { xs: 'minmax(0,1fr) minmax(0,1fr)', md: 'repeat(3, minmax(0,1fr))', xl: 'repeat(4, minmax(0,1fr))' } }}>
                      {d.subs.map((s) => (
                        <li key={s.url_key}>
                          <Box component={Link} href={`/${d.url_key}?sub=${s.url_key}`} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, px: 1.75, py: 1.25, minHeight: 48, borderRadius: radius.md, border: `1px solid ${colors.line}`, color: colors.ink, textDecoration: 'none', fontSize: 14.5, '&:hover': { borderColor: colors.ink400, bgcolor: colors.subtle }, ...focusRing }}>
                            <span>{s.name}</span>
                            {s.product_count != null && <Box component="span" sx={{ fontSize: 12.5, color: colors.ink500, flexShrink: 0 }}>{s.product_count.toLocaleString()}</Box>}
                          </Box>
                        </li>
                      ))}
                      <Box component="li" sx={{ display: { sm: 'none' } }}>
                        <Box component={Link} href={`/${d.url_key}`} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1.75, minHeight: 48, color: colors.redText, fontWeight: 600, fontSize: 14.5, textDecoration: 'none' }}>Shop all <ArrowRightIcon sx={{ fontSize: 18 }} /></Box>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </PageContainer>
    </>
  )
}
