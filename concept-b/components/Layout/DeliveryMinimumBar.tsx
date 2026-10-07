import Link from 'next/link'
import { Box, LinearProgress, Typography } from '@mui/material'
import { useCart } from '../../lib/cart'
import { money } from '../../lib/data'
import { CUTOFF, DELIVERY_MINIMUM } from '../../lib/pricing'
import { colors, focusRing, layout } from '../../lib/theme'
import { CheckCircleIcon, TruckIcon } from '../ui/icons'

/**
 * Delivery-minimum progress, shown under the header on shopping pages while the cart has items.
 * The $350 threshold is the live rule; production reads it from Magento store config / the shipping rule.
 */
export function DeliveryProgress({ subtotal, minimum = DELIVERY_MINIMUM, dense = false }: { subtotal: number; minimum?: number; dense?: boolean }) {
  const ok = subtotal >= minimum
  const pct = Math.min(100, (subtotal / minimum) * 100)
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        {ok ? <CheckCircleIcon sx={{ color: colors.success, fontSize: 20, mt: '1px' }} /> : <TruckIcon sx={{ color: colors.redText, fontSize: 20, mt: '1px' }} />}
        <Typography sx={{ fontSize: dense ? 13.5 : 14 }}>
          {ok ? <><b>Your order qualifies for delivery.</b> Order by {CUTOFF} for next-day.</> : <>Add <b>{money(minimum - subtotal)}</b> more to unlock delivery, or pick up at our Mississauga warehouse.</>}
        </Typography>
      </Box>
      {!ok && <LinearProgress variant="determinate" value={pct} aria-label={`Delivery minimum: ${money(subtotal)} of ${money(minimum)}`} sx={{ '& .MuiLinearProgress-bar': { bgcolor: colors.red } }} />}
    </Box>
  )
}

export default function DeliveryMinimumBar({ minimum = DELIVERY_MINIMUM }: { minimum?: number }) {
  const { count, subtotal, ready } = useCart()
  if (!ready || !count) return null
  const ok = subtotal >= minimum
  const pct = Math.min(100, (subtotal / minimum) * 100)
  return (
    <Box role="status" aria-live="polite" sx={{ bgcolor: ok ? colors.successTint : colors.redTint, borderBottom: `1px solid ${ok ? colors.successLine : colors.redLine}` }}>
      <Box sx={{ maxWidth: layout.maxWidth, mx: 'auto', px: layout.gutter, minHeight: 40, display: 'flex', alignItems: 'center', gap: { xs: 1.25, md: 2 } }}>
        {ok ? <CheckCircleIcon sx={{ color: colors.success, fontSize: 20, flexShrink: 0 }} /> : <TruckIcon sx={{ color: colors.redText, fontSize: 20, flexShrink: 0 }} />}
        <Typography sx={{ fontSize: { xs: 13, md: 14 }, color: colors.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>
          {ok ? (
            <><b>Your order qualifies for delivery</b><Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}> · Order by {CUTOFF} for next-day</Box></>
          ) : (
            <>Add <b>{money(minimum - subtotal)}</b> more to unlock delivery<Box component="span" sx={{ display: { xs: 'none', md: 'inline' }, color: colors.ink600 }}> · {money(subtotal)} of {money(minimum)}</Box></>
          )}
        </Typography>
        {!ok && (
          <LinearProgress variant="determinate" value={pct} aria-hidden sx={{ flex: 1, minWidth: 40, maxWidth: 280, bgcolor: colors.redTint2, '& .MuiLinearProgress-bar': { bgcolor: colors.red } }} />
        )}
        <Box component={Link} href="/cart" sx={{ ml: 'auto', flexShrink: 0, fontSize: { xs: 13, md: 14 }, fontWeight: 600, color: colors.redText, textDecoration: 'none', px: 1, py: 0.75, borderRadius: '4px', '&:hover': { textDecoration: 'underline' }, ...focusRing }}>
          View cart
        </Box>
      </Box>
    </Box>
  )
}
