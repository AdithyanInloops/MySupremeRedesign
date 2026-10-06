import Link from 'next/link'
import { Box, Card, Grid } from '@mui/material'

const promoTestData3 = [
  { image: '/assets/sum-offer-1.jpeg', title: 'Thanksgiving Catering Pack', link: '/packaging' },
  { image: '/assets/sum-offer-2.jpeg', title: 'Restaurant Essentials Pack', link: '/grocery' },
]

/** Two large promo images (inline block in the real pages/index.tsx). */
export default function SumOfferImages() {
  return (
    <Box sx={{ mt: 1, mb: 8, width: '100%', px: { xs: 2, md: 3 } }}>
      <Grid container spacing={{ xs: 4, sm: 5, md: 6 }} justifyContent="space-between">
        {promoTestData3.map((item) => (
          <Grid item xs={12} sm={6} md={6} key={item.image}>
            <Card sx={{ backgroundColor: '#EBF2FE', boxShadow: 2, borderRadius: 3, border: '1px solid transparent', height: '100%' }}>
              <Link href={item.link}>
                <Box component="img" src={item.image} alt={item.title} sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: 'inherit' }} />
              </Link>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
