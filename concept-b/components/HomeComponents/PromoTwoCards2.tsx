import Link from 'next/link'
import { Box, Button, Typography } from '@mui/material'

export type PromoItem = { image: string; title: string; subtitle: string; link: string }

/** Two red cards, image right (real: PromoTwoCards2.tsx). */
const PromoTwoCards2 = ({ items }: { items: PromoItem[] }) => {
  if (!items?.length) return null
  return (
    <Box sx={{ display: 'flex', gap: 3, flexWrap: { xs: 'wrap', md: 'nowrap' }, width: '100%' }}>
      {items.map((item) => (
        <Box key={item.title} sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, width: { xs: '100%', md: '50%' }, borderRadius: '12px', overflow: 'hidden', flex: { md: 1 } }}>
          
          <Box
            sx={{
              width: { xs: '100%', md: '50%' }, backgroundColor: '#FF0000', color: '#fff', p: { xs: 3, sm: 4 }, display: 'flex', flexDirection: 'column',
              justifyContent: 'center', alignItems: { xs: 'center', sm: 'flex-start' }, textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            <Typography variant="h6" fontWeight={700} mb={1} sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>{item.title}</Typography>
            <Typography variant="body2" mb={3} sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>{item.subtitle}</Typography>
            <Button component={Link} href={item.link} sx={{ backgroundColor: '#fff', color: '#FF0000', borderRadius: '20px', px: 3, width: 'fit-content', fontWeight: 600, textTransform: 'none', fontSize: 16, '&:hover': { backgroundColor: '#f5f5f5' } }}>
              Shop Now
            </Button>
          </Box>
          <Box sx={{ width: { xs: '100%', md: '50%' }, height: { xs: '250px', md: 'auto' }, minHeight: { md: 230 }, position: 'relative' }}>
            <Box component="img" src={item.image} alt={`${item.title} Wholesale Restaurant & Food Supplies in Ontario mysupreme`} sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </Box>
        </Box>
      ))}
    </Box>
  )
}

export default PromoTwoCards2
