import Link from 'next/link'
import { Box, Card, Typography } from '@mui/material'

/** Square department tile with red-outlined name strip (real: CategoryCard.tsx). */
const CategoryCard = ({ name, image, href }: { name: string; image?: string | null; href: string }) => (
  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
    <Box component={Link} href={href} sx={{ textDecoration: 'none', '&:focus-visible': { outline: '2px solid #FF0000', outlineOffset: 2, borderRadius: '12px' } }}>
      <Card sx={{ position: 'relative', height: { xs: 100, sm: 140, md: 187 }, width: { xs: 100, sm: 140, md: 187 }, borderRadius: '12px 12px 0 0', boxShadow: 'none', border: '1px solid #eee', overflow: 'hidden' }}>
        <Box component="img" src={image || '/assets/placeholder-image.png'} alt={`${name} mysupreme category`} sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      </Card>
      <Box
        sx={{
          height: { xs: 32, sm: 40, md: 50 }, width: { xs: 100, sm: 140, md: 187 }, border: 1, borderTop: 0, borderColor: '#FF0000',
          borderBottomRightRadius: '12px', borderBottomLeftRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff',
        }}
      >
        <Typography sx={{ color: 'primary.main', fontWeight: 600, fontSize: { xs: '10px', sm: '12px', md: '15px' }, textAlign: 'center', px: 1, lineHeight: 1.2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {name}
        </Typography>
      </Box>
    </Box>
  </Box>
)

export default CategoryCard
