import { Box, Card, CardContent, Grid, Typography } from '@mui/material'

const features = [
  { icon: '/assets/time.svg', title: 'Order in 10 Minutes or Less', description: 'Ordering is easier than ever! Browse,select,and order in 10 minutes, so you can focus on running your kitchen.' },
  { icon: '/assets/best.svg', title: 'Best Price.Unmatched Value.', description: 'Exclusive deals for smart food businesses!Get great prices, volume discounts, and weekly specials to help your restaurant thrive' },
  { icon: '/assets/wideweb.svg', title: 'Wide Assortment', description: 'One source, endless choices! From staples to specialties, we have it all. Whatever your kitchen needs, we’ve got you covered' },
  { icon: '/assets/easyresult.svg', title: 'Easy Returns', description: 'Hassle-free returns, guaranteed! If something’s not right, our easy process ensures a quick, stress-free resolution' },
]

/** Four feature columns (real: FeatureCards.tsx — copy kept verbatim). */
export default function FeatureCards() {
  return (
    <Box>
      <Grid container spacing={4}>
        {features.map((f) => (
          <Grid item xs={12} sm={6} md={3} key={f.title}>
            <Card elevation={0} sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', border: 'none', boxShadow: 'none' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}><img src={f.icon} alt={f.title} width={48} height={48} /></Box>
              <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 600, fontSize: { md: '14px' }, color: '#000000' }}>{f.title}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 400, fontSize: { md: '14px' }, color: '#000000' }}>{f.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
