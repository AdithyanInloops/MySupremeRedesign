import { Link as RouterLink, useLocation, useParams } from 'react-router-dom'
import { Box, Button, Typography } from '@mui/material'
import { tokens } from '../theme'
import { useApp } from '../state/app'
import { money } from '../data/catalog'
import { BellIcon, CheckIcon, StoreIcon, TruckIcon } from '../components/icons'

const c = tokens.color

/** Order confirmation: what happened, when it arrives, what's next. */
export default function OrderPlaced() {
  const { number } = useParams()
  const { state } = useLocation() as { state?: { method?: string } }
  const { orders } = useApp()
  const order = orders.find((o) => o.number === number)
  const pickup = state?.method === 'pickup'
  const Icon = pickup ? StoreIcon : TruckIcon
  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: c.navyDark, color: '#fff', display: 'flex', flexDirection: 'column', px: 3, pt: 'calc(48px + env(safe-area-inset-top))', pb: 'calc(24px + env(safe-area-inset-bottom))' }}>
      <Box sx={{ position: 'relative', width: 96, height: 96, mx: 'auto' }}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <Box key={i} aria-hidden sx={{ position: 'absolute', left: '50%', top: '50%', width: 8, height: 8, borderRadius: '50%', bgcolor: i % 2 ? c.saffron : '#fff', transform: `rotate(${i * 45}deg) translateY(-62px)`, animation: 'spark .7s ease-out both', animationDelay: '.15s', '@keyframes spark': { from: { opacity: 0, transform: `rotate(${i * 45}deg) translateY(-30px) scale(.4)` }, to: { opacity: 1 } } }} />
        ))}
        <Box sx={{ width: 96, height: 96, borderRadius: '50%', bgcolor: c.success, display: 'grid', placeItems: 'center', animation: 'pop .4s cubic-bezier(.2,1.4,.4,1) both', '@keyframes pop': { from: { transform: 'scale(.5)', opacity: 0 }, to: { transform: 'none', opacity: 1 } } }}>
          <CheckIcon sx={{ fontSize: 52, color: '#fff' }} />
        </Box>
      </Box>
      <Typography component="h1" sx={{ fontSize: 26, fontWeight: 800, textAlign: 'center', mt: 3, letterSpacing: '-.02em' }}>Order placed</Typography>
      <Typography sx={{ textAlign: 'center', mt: 0.75, opacity: 0.8 }}>Order <b>#{number}</b>{order ? ` · ${money(order.total)}` : ''}</Typography>

      <Box sx={{ mt: 4, p: 2, borderRadius: `${tokens.radius.lg}px`, bgcolor: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.14)', display: 'flex', gap: 1.5, alignItems: 'center' }}>
        <Box sx={{ width: 48, height: 48, borderRadius: `${tokens.radius.sm}px`, bgcolor: c.saffron, color: c.ink, display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon /></Box>
        <Box>
          <Typography sx={{ fontSize: 12.5, opacity: 0.75 }}>{pickup ? 'Pickup' : 'Delivery'}</Typography>
          <Typography sx={{ fontWeight: 700, fontSize: 16 }}>{order?.eta ?? 'We’ll confirm shortly'}</Typography>
        </Box>
      </Box>
      <Box sx={{ mt: 1.5, p: 2, borderRadius: `${tokens.radius.lg}px`, bgcolor: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.14)', display: 'flex', gap: 1.5, alignItems: 'center' }}>
        <BellIcon sx={{ color: c.saffron }} />
        <Typography sx={{ fontSize: 14, opacity: 0.9 }}>We’ll notify you when it’s packed and when the driver is on the way. Invoice sent to priya@spiceroutekitchen.ca.</Typography>
      </Box>

      <Box sx={{ mt: 'auto', pt: 4, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        <Button component={RouterLink} to={`/orders/${number}`} replace variant="contained" size="large" fullWidth>Track order</Button>
        <Button component={RouterLink} to="/" replace size="large" fullWidth sx={{ color: '#fff', border: '1.5px solid rgba(255,255,255,.4)' }}>Back to home</Button>
      </Box>
    </Box>
  )
}
