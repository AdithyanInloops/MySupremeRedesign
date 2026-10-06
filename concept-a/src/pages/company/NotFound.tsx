import { useState } from 'react'
import { Box, Button, Menu, MenuItem, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import HomeRounded from '@mui/icons-material/HomeRounded'
import StorefrontOutlined from '@mui/icons-material/StorefrontOutlined'
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded'
import CheckRounded from '@mui/icons-material/CheckRounded'
import { tokens } from '../../theme'
import { departments } from '../../data/catalog'
import { Crown } from '../../components/Brand'
import SearchBar from '../../components/SearchBar'
import { Container } from '../../components/ui'

const c = tokens.color

/** Store switcher (priority 3) — one store today; designed so a second store/locale can slot in. */
function StoreSwitcher() {
  const [a, setA] = useState<HTMLElement | null>(null)
  return (
    <Box sx={{ p: 2, bgcolor: '#fff', border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.md}px`, display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <StorefrontOutlined sx={{ color: c.navy }} />
      <Box sx={{ flex: 1 }}>
        <Typography variant="caption" color="text.secondary">Store</Typography>
        <Typography sx={{ fontWeight: 600, fontSize: 14 }}>MySupreme Ontario (en-CA)</Typography>
      </Box>
      <Button size="small" endIcon={<KeyboardArrowDownRounded />} onClick={(e) => setA(e.currentTarget)} sx={{ color: c.navy }}>Change</Button>
      <Menu anchorEl={a} open={!!a} onClose={() => setA(null)}>
        <MenuItem selected onClick={() => setA(null)} sx={{ minHeight: 44, gap: 1 }}><CheckRounded fontSize="small" /> MySupreme Ontario · English (CA) · CAD</MenuItem>
        <MenuItem disabled sx={{ minHeight: 44 }}>Français (CA) — coming later</MenuItem>
      </Menu>
    </Box>
  )
}

export default function NotFound() {
  return (
    <Container sx={{ py: { xs: 5, md: 9 } }}>
      <Box sx={{ maxWidth: 760, mx: 'auto', textAlign: 'center' }}>
        <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
          <Typography aria-hidden sx={{ fontSize: { xs: 110, md: 170 }, fontWeight: 800, lineHeight: 1, color: c.navy, letterSpacing: '-.04em' }}>4<Box component="span" sx={{ color: c.red }}>0</Box>4</Typography>
          <Box sx={{ position: 'absolute', top: { xs: -18, md: -26 }, left: '50%', transform: 'translateX(-50%) rotate(-8deg)' }}><Crown size={56} /></Box>
        </Box>
        <Typography variant="h1" component="h1" sx={{ fontSize: { xs: 26, md: 36 } }}>This shelf is empty</Typography>
        <Typography color="text.secondary" sx={{ mt: 1.5, mb: 3 }}>The page you’re looking for has moved or no longer exists. Search 4,300+ products by name or SKU instead.</Typography>
        <Box sx={{ maxWidth: 620, mx: 'auto', textAlign: 'left' }}><SearchBar /></Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="center" sx={{ mt: 3 }}>
          <Button variant="contained" size="large" startIcon={<HomeRounded />} component={RouterLink} to="/">Back to home</Button>
          <Button variant="outlined" color="secondary" size="large" component={RouterLink} to="/contact">Contact support</Button>
        </Stack>
      </Box>
      <Box sx={{ maxWidth: 1000, mx: 'auto', mt: { xs: 5, md: 7 } }}>
        <Typography variant="overline" sx={{ color: c.text3, display: 'block', textAlign: 'center', mb: 2 }}>Popular departments</Typography>
        <Box sx={{ display: 'grid', gap: 1.25, gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3,1fr)', md: 'repeat(5,1fr)' } }}>
          {departments.slice(0, 5).map((d) => (
            <Box key={d.id} component={RouterLink} to={`/c/${d.slug}`} sx={{ display: 'flex', alignItems: 'center', gap: 1.25, p: 1, pr: 1.5, bgcolor: '#fff', border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.md}px`, textDecoration: 'none', color: c.ink, '&:hover': { borderColor: c.red, color: c.red } }}>
              <Box component="img" src={d.image} alt="" sx={{ width: 44, height: 44, borderRadius: `${tokens.radius.sm}px`, objectFit: 'cover' }} />
              <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{d.name}</Typography>
            </Box>
          ))}
        </Box>
        <Box sx={{ maxWidth: 440, mx: 'auto', mt: 4 }}><StoreSwitcher /></Box>
      </Box>
    </Container>
  )
}
