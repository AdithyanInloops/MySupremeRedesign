import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material'

const btn = { borderColor: 'primary.main', color: 'primary.main', fontWeight: 700, border: 1, borderRadius: '100px', height: '45px', px: 3, textTransform: 'none', '&:hover': { backgroundColor: 'primary.main', color: 'white' }, fontSize: { md: '16px' } } as const
const card = { backgroundColor: '#EBF2FE', boxShadow: 2, borderRadius: 3, border: '1px solid transparent', transition: '0.3s', '&:hover': { borderColor: '#2196F3' }, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' } as const

/**
 * LIVE offer cards (real: OfferCards.tsx). Kept for reference —
 * Concept B replaces them on the home page with WeeklyDeals.tsx.
 */
const OfferCards = () => (
  <Box>
    <Grid container spacing={4} justifyContent="center" sx={{ py: 4 }}>
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={card}>
          <CardContent sx={{ textAlign: 'left', pr: '80px' }}>
            <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700, fontSize: { md: '20px' } }}>
              25% OFF <span style={{ color: 'black' }}>Aluminum Deep Trays</span> Limited Time Offer <span style={{ color: 'black' }}>Stock Up &amp; Save</span>
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 700, mt: 1, fontSize: { md: '16px' } }}>
              <span style={{ fontWeight: 400 }}>perfect for catering, takeout, and food prep. </span>Great for Restaurants, Banquets, and Events
            </Typography>
          </CardContent>
          <Box sx={{ p: 2 }}><Button href="/packaging" sx={btn}>Shop Now</Button></Box>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={card}>
          <CardContent sx={{ textAlign: 'left', pr: '80px' }}>
            <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700, fontSize: { md: '20px' } }}>
              $5 OFF Ecogate Bagasse Clamshell <span style={{ color: 'black' }}>Eco-Friendly | Durable</span>
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, fontSize: { md: '16px' } }}>Made from natural sugarcane fiber Bulk Orders Welcome</Typography>
          </CardContent>
          <Box sx={{ p: 2 }}><Button href="/packaging" sx={btn}>Shop Now</Button></Box>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={card}>
          <CardContent sx={{ textAlign: 'left', pr: '80px' }}>
            <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700, fontSize: { md: '20px' } }}>
              <span style={{ color: 'black' }}>Ecogate Eco-Friendly Packaging - </span>On Sale Now!
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 700, mt: 1, fontSize: { md: '16px' } }}>
              <span style={{ fontWeight: 400 }}>Durable, Compostable &amp; Perfect for Restaurants </span>Limited Time Only
            </Typography>
          </CardContent>
          <Box sx={{ p: 2 }}><Button href="/packaging" sx={btn}>Shop Now</Button></Box>
        </Card>
      </Grid>
    </Grid>
  </Box>
)

export default OfferCards
