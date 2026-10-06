import Link from 'next/link'
import { Box, LinearProgress, Typography } from '@mui/material'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import { useCart } from '../../lib/cart'
import { money } from '../../lib/data'

/**
 * Concept B #11 — Delivery-minimum progress bar, shown under the header while the cart has items.
 * The $350 threshold is the live delivery minimum ("Delivery available for orders above $350 CAD").
 * In production read it from Magento store config / the shipping rule — no new data model needed.
 */
export default function DeliveryMinimumBar({ minimum = 350 }: { minimum?: number }) {
  const { count, subtotal } = useCart()
  if (!count) return null
  const ok = subtotal >= minimum
  const pct = Math.min(100, (subtotal / minimum) * 100)
  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{ bgcolor: ok ? '#ECFDF3' : '#FFF5F5', borderBottom: `1px solid ${ok ? '#C6F0D7' : '#FFE0E0'}`, px: { xs: '15px', md: 3, lg: '40px' } }}
    >
      <Box sx={{ maxWidth: 1500, mx: 'auto', minHeight: 40, display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
        {ok ? (
          <CheckCircleRoundedIcon sx={{ color: '#05753D', fontSize: 20, flexShrink: 0 }} />
        ) : (
          <LocalShippingOutlinedIcon sx={{ color: '#D50000', fontSize: 20, flexShrink: 0 }} />
        )}
        <Typography sx={{ fontSize: { xs: 12, md: 13.5 }, color: '#0C0C0C', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>
          {ok ? (
            <>
              <b>Your order qualifies for delivery</b>
              <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}> · Order by 2 PM for next-day</Box>
            </>
          ) : (
            <>
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Add </Box>
              <b>{money(minimum - subtotal)}</b>
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}> more</Box> to unlock delivery
              <Box component="span" sx={{ display: { xs: 'none', md: 'inline' }, color: '#4B5563' }}> · {money(subtotal)} of {money(minimum)}</Box>
            </>
          )}
        </Typography>
        {!ok && (
          <LinearProgress
            variant="determinate"
            value={pct}
            aria-label={`Delivery minimum progress, ${Math.round(pct)}%`}
            sx={{ flex: 1, minWidth: 40, maxWidth: 320, height: 6, borderRadius: 3, bgcolor: '#FFD6D6', '& .MuiLinearProgress-bar': { bgcolor: '#D50000', borderRadius: 3 } }}
          />
        )}
        <Box
          component={Link}
          href="/cart"
          sx={{
            ml: 'auto', flexShrink: 0, fontSize: { xs: 12, md: 13.5 }, fontWeight: 600, color: '#D50000', textDecoration: 'none', px: 1, py: 0.5, borderRadius: '4px',
            '&:hover': { textDecoration: 'underline' }, '&:focus-visible': { outline: '3px solid #2d297d', outlineOffset: 2 },
          }}
        >
          View cart
        </Box>
      </Box>
    </Box>
  )
}
