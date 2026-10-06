import { Box, Button, Stack, Typography } from '@mui/material'
import { Link as RouterLink, useParams } from 'react-router-dom'
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined'
import FormatQuoteRounded from '@mui/icons-material/FormatQuoteRounded'
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded'
import { tokens } from '../../theme'
import { photo, recommended } from '../../data/catalog'
import { ProductRail } from '../../components/Commerce'
import { Container, SectionHeader } from '../../components/ui'
import { CompanyHero, CtaBand, ghostBtn, PlasmicNote, whiteBtn } from './parts/CompanyParts'

const c = tokens.color

const regions: Record<string, { name: string; area: string; days: [string, string][] }> = {
  hamilton: { name: 'Hamilton', area: 'Hamilton, Burlington, Stoney Creek & Ancaster', days: [['Mon', 'Downtown & Westdale'], ['Tue', 'Burlington & Waterdown'], ['Wed', 'Stoney Creek & Mountain'], ['Thu', 'Downtown & Westdale'], ['Fri', 'Ancaster & Dundas'], ['Sat', 'All Hamilton routes']] },
  mississauga: { name: 'Mississauga', area: 'Mississauga, Brampton & Oakville', days: [['Mon–Sat', 'Same-day before 10 AM'], ['Mon–Sat', 'Next-day by 2 PM cut-off']] },
  niagara: { name: 'Niagara', area: 'St. Catharines, Niagara Falls & Welland', days: [['Tue', 'St. Catharines'], ['Thu', 'Niagara Falls & Welland'], ['Sat', 'All Niagara routes']] },
}

const quotes = [
  { q: 'Our order used to come from five suppliers. Now it’s one truck on Tuesday and one invoice.', who: 'Marco D., owner — Trattoria on James St.' },
  { q: 'I reorder from the app between lunch and dinner. The driver knows our back door by name.', who: 'Aisha K., chef — Locke St. café' },
  { q: 'Credit terms made it possible to stock up for wedding season without stress.', who: 'Ravi P., caterer — Stoney Creek' },
]

/** Region landing page template (built in Plasmic per city). */
export default function Region() {
  const { city = 'hamilton' } = useParams()
  const r = regions[city] ?? { ...regions.hamilton, name: city[0].toUpperCase() + city.slice(1) }
  return (
    <Box>
      <CompanyHero
        crumbs={[{ label: 'Delivery areas' }, { label: r.name }]}
        eyebrow={`Delivery area · ${r.area}`}
        title={`Restaurant supply delivered in ${r.name}`}
        body="4,300+ products, business pricing and cold-chain trucks on a schedule you can plan your prep around."
        image={photo('produceStall', 1800)}
        actions={
          <>
            <Button variant="contained" size="large" component={RouterLink} to="/account/signin?mode=create">Open an account</Button>
            <Button variant="outlined" size="large" component={RouterLink} to="/all-categories" sx={ghostBtn}>Browse products</Button>
          </>
        }
      />
      <Container sx={{ mt: 3 }}><PlasmicNote>Region pages are built in Plasmic from this template — swap city name, hero photo, schedule and testimonials.</PlasmicNote></Container>
      <Container sx={{ mt: { xs: 4, md: 7 } }}>
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: '1fr 1.6fr' }, alignItems: 'center' }}>
          <Box>
            <Typography variant="overline" sx={{ color: c.red }}>Delivery schedule</Typography>
            <Typography variant="h2" sx={{ mt: 0.5, mb: 2 }}>Your truck, your day</Typography>
            <Stack spacing={1}>
              {['Order by 2 PM for next-day on your route', 'Free delivery over $250', 'Frozen, dairy & meat delivered at temp'].map((t) => (
                <Stack key={t} direction="row" spacing={1} alignItems="center"><CheckCircleRounded sx={{ color: c.successText, fontSize: 20 }} /><Typography>{t}</Typography></Stack>
              ))}
            </Stack>
          </Box>
          <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(3,1fr)' } }}>
            {r.days.map(([d, a], i) => (
              <Box key={i} sx={{ p: 2, bgcolor: '#fff', border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.md}px` }}>
                <Stack direction="row" alignItems="center" spacing={1}><LocalShippingOutlined sx={{ color: c.navy, fontSize: 20 }} /><Typography sx={{ fontWeight: 800, color: c.navy }}>{d}</Typography></Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{a}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
      <Container sx={{ mt: { xs: 5, md: 8 } }}>
        <SectionHeader eyebrow={`Popular in ${r.name}`} title="What local kitchens reorder" action="See all" href="/all-categories" />
        <ProductRail items={recommended} />
      </Container>
      <Container sx={{ mt: { xs: 5, md: 8 } }}>
        <SectionHeader eyebrow="From our customers" title={`${r.name} kitchens on MySupreme`} />
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(3,1fr)' } }}>
          {quotes.map((q) => (
            <Box key={q.who} component="figure" sx={{ m: 0, p: 3, bgcolor: c.navyTint, borderRadius: `${tokens.radius.lg}px` }}>
              <FormatQuoteRounded sx={{ color: c.red, fontSize: 36 }} />
              <Typography component="blockquote" sx={{ m: 0, fontSize: 16, fontWeight: 500, color: c.ink }}>{q.q}</Typography>
              <Typography component="figcaption" variant="body2" color="text.secondary" sx={{ mt: 2 }}>{q.who}</Typography>
            </Box>
          ))}
        </Box>
      </Container>
      <CtaBand title={`Start delivery in ${r.name} this week`} body="Open a business account and your first order can be on the next route." actions={<Button variant="contained" size="large" component={RouterLink} to="/account/signin?mode=create" sx={whiteBtn}>Open account</Button>} />
    </Box>
  )
}
