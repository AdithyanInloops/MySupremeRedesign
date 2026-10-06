import { Box, Chip, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { tokens } from '../../theme'
import { photo } from '../../data/catalog'
import { Container } from '../../components/ui'
import { PageTitle } from '../../components/Shared'
import { PlasmicNote } from './parts/CompanyParts'

const c = tokens.color

const posts = [
  { tag: 'Menu costing', title: 'How to cut take-out packaging cost per order by 18%', body: 'Bagasse vs. PP clamshells, real numbers from three Mississauga kitchens.', img: photo('bowl', 900, 600), date: 'Oct 2, 2026', read: '6 min' },
  { tag: 'Seasonal', title: 'Thanksgiving catering: the 300-cover order sheet', body: 'Quantities, cut-off dates and what to order frozen vs. fresh.', img: photo('spread', 900, 600), date: 'Sep 28, 2026', read: '8 min' },
  { tag: 'Bar & café', title: 'Five Monin syrups every café should stock', body: 'Lime, salted caramel and the three our baristas reorder most.', img: photo('shake', 900, 600), date: 'Sep 21, 2026', read: '4 min' },
  { tag: 'Food safety', title: 'Cold-chain 101 for small walk-ins', body: 'Receiving checklists that keep dairy and meat in spec.', img: photo('fridge', 900, 600), date: 'Sep 14, 2026', read: '5 min' },
  { tag: 'Produce', title: 'Avocado season: buying by the case without waste', body: 'Ripeness stages, storage and when to order.', img: photo('avocado', 900, 600), date: 'Sep 7, 2026', read: '3 min' },
  { tag: 'Operations', title: 'Ghost kitchens: one supplier, three brands', body: 'How a Hamilton operator consolidated six suppliers into one invoice.', img: photo('chef', 900, 600), date: 'Aug 30, 2026', read: '7 min' },
]

export default function Blog() {
  const [hero, ...rest] = posts
  return (
    <Container>
      <PageTitle crumbs={[{ label: 'Blog' }]} title="The Kitchen Counter" subtitle="Practical ideas for running a tighter, more profitable kitchen." />
      <Box sx={{ mb: 3 }}><PlasmicNote>Blog posts are authored in Plasmic; this layout is the reusable template (featured post + 3-column grid).</PlasmicNote></Box>
      <Box component={RouterLink} to="/blog" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.3fr 1fr' }, bgcolor: '#fff', border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.xl}px`, overflow: 'hidden', textDecoration: 'none', color: c.ink, mb: 4, '&:hover img': { transform: 'scale(1.03)' } }}>
        <Box sx={{ overflow: 'hidden', height: { xs: 220, md: 400 } }}><Box component="img" src={hero.img} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s' }} /></Box>
        <Box sx={{ p: { xs: 3, md: 5 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Chip label={`Featured · ${hero.tag}`} sx={{ alignSelf: 'flex-start', bgcolor: c.redTint, color: c.red, mb: 2 }} />
          <Typography variant="h2">{hero.title}</Typography>
          <Typography color="text.secondary" sx={{ mt: 1.5 }}>{hero.body}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>{hero.date} · {hero.read} read</Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3,1fr)' } }}>
        {rest.map((p) => (
          <Box key={p.title} component={RouterLink} to="/blog" sx={{ bgcolor: '#fff', border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.lg}px`, overflow: 'hidden', textDecoration: 'none', color: c.ink, transition: 'box-shadow .2s, transform .2s', '&:hover': { boxShadow: tokens.shadow.hover, transform: 'translateY(-2px)' } }}>
            <Box component="img" src={p.img} alt="" sx={{ width: '100%', aspectRatio: '3/2', objectFit: 'cover' }} />
            <Box sx={{ p: 2.5 }}>
              <Typography variant="overline" sx={{ color: c.red }}>{p.tag}</Typography>
              <Typography variant="h4" sx={{ mt: 0.5 }}>{p.title}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{p.body}</Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}><Typography variant="caption" color="text.secondary">{p.date} · {p.read} read</Typography></Stack>
            </Box>
          </Box>
        ))}
      </Box>
    </Container>
  )
}
