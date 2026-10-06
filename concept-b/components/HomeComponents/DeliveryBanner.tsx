import { Box } from '@mui/material'

/**
 * LIVE delivery banner (real: DeliveryBanner.tsx). Kept for reference —
 * Concept B replaces it on the home page with DeliveryCheckBanner.tsx.
 */
const DeliveryBanner = () => (
  <Box sx={{ width: '100%', px: { xs: '6px', sm: '12px' }, mb: { xs: 3, md: 5 }, mt: { xs: 1, md: 2 } }}>
    <Box sx={{ position: 'relative', width: '100%', aspectRatio: '1920 / 500', borderRadius: { xs: '8px', sm: '12px' }, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <Box component="img" src="/assets/stickydelivery.png" alt="Wholesale Restaurant & Food Supplies in Ontario mysupreme" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' }} />
    </Box>
  </Box>
)

export default DeliveryBanner
