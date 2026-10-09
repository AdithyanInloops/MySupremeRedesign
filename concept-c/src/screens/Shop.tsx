import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { Box, IconButton, Typography } from '@mui/material'
import { tokens, focusRing, pressable } from '../theme'
import { brands, departments } from '../data/catalog'
import { Crown, HScroll, Pill } from '../components/ui'
import AppHeader from '../components/AppHeader'
import { BarcodeIcon, ChevronRightIcon, SearchIcon } from '../components/icons'

const c = tokens.color

/** Category tab: search entry, every department as a photo tile, and brands. */
export default function Shop() {
  const navigate = useNavigate()
  return (
    <Box>
      <AppHeader />
      <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
        <Typography component="h1" sx={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.01em', mb: 1.25 }}>Categories</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Box component="button" onClick={() => navigate('/search')} aria-label="Search products, brands or SKU" sx={{ all: 'unset', boxSizing: 'border-box', cursor: 'text', flex: 1, display: 'flex', alignItems: 'center', gap: 1.25, height: 48, px: 1.75, borderRadius: `${tokens.radius.md}px`, bgcolor: '#fff', border: `1px solid ${c.line}`, color: c.text3, fontSize: 15, ...focusRing }}>
            <SearchIcon sx={{ color: c.navy }} /> Search 4,300+ products
          </Box>
          <IconButton component={RouterLink} to="/scan" aria-label="Scan a barcode" sx={{ width: 48, height: 48, borderRadius: `${tokens.radius.md}px`, bgcolor: '#fff', border: `1px solid ${c.line}`, color: c.red }}><BarcodeIcon /></IconButton>
        </Box>
      </Box>

      <Box component="ul" aria-label="Departments" sx={{ listStyle: 'none', m: 0, px: 2, pt: 0.5, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 1.25 }}>
        {departments.map((d, i) => (
          <Box component="li" key={d.id} sx={{ gridColumn: i === 0 ? 'span 2' : 'auto' }}>
            <Box component={RouterLink} to={`/shop/${d.slug}`} aria-label={`${d.name}, ${d.count.toLocaleString()} products`}
              sx={{ position: 'relative', display: 'block', height: i === 0 ? 168 : 150, borderRadius: `${tokens.radius.lg}px`, overflow: 'hidden', bgcolor: c.navy, color: '#fff', textDecoration: 'none', ...pressable, ...focusRing }}>
              {d.image ? (
                <Box component="img" src={d.image} alt="" loading="lazy" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Box sx={{ position: 'absolute', right: -16, top: -10, opacity: 0.18 }}><Crown size={130} color="#fff" /></Box>
              )}
              <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(27,25,80,0) 30%, rgba(27,25,80,.9) 100%)' }} />
              <Box sx={{ position: 'absolute', left: 14, right: 14, bottom: 12 }}>
                <Typography sx={{ fontSize: i === 0 ? 20 : 16, fontWeight: 800, lineHeight: 1.15 }}>{d.name}</Typography>
                <Typography sx={{ fontSize: 12, opacity: 0.85, mt: 0.25, display: 'flex', alignItems: 'center', gap: 0.25 }}>
                  {i === 0 ? `${d.tagline} · ` : ''}{d.count.toLocaleString()} products <ChevronRightIcon sx={{ fontSize: 15 }} />
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 3, mb: 3 }}>
        <Typography component="h2" sx={{ px: 2, fontSize: 18, fontWeight: 700, mb: 1.25 }}>Shop by brand</Typography>
        <HScroll gap={1}>{brands.map((b) => <Pill key={b.slug} onClick={() => navigate(`/search?q=${encodeURIComponent(b.name)}`)}>{b.name}</Pill>)}</HScroll>
      </Box>
    </Box>
  )
}
