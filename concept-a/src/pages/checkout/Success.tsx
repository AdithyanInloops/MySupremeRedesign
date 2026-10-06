import { useEffect, useState } from 'react'
import { Box, Button, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import CheckRounded from '@mui/icons-material/CheckRounded'
import DownloadRounded from '@mui/icons-material/DownloadRounded'
import ReceiptLongOutlined from '@mui/icons-material/ReceiptLongOutlined'
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded'
import MailOutlineRounded from '@mui/icons-material/MailOutlineRounded'
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined'
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined'
import WhatsApp from '@mui/icons-material/WhatsApp'
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlined from '@mui/icons-material/VisibilityOffOutlined'
import { tokens } from '../../theme'
import { money } from '../../data/catalog'
import { customer, orders } from '../../data/account'
import { useApp, type CartLine } from '../../state/AppState'
import { Container, Panel } from '../../components/ui'
import { Crown } from '../../components/Brand'
import { CartLineItem, cartTotals } from '../../components/CheckoutParts'
import { checkoutSession, currentMethod, currentShipping } from './checkoutStore'

const c = tokens.color

function Confirmation() {
  return (
    <Box sx={{ position: 'relative', width: 120, height: 120, mx: 'auto' }} aria-hidden>
      <Box sx={{ position: 'absolute', inset: 0, borderRadius: '50%', bgcolor: c.successTint, animation: 'pop .5s ease-out', '@keyframes pop': { from: { transform: 'scale(.6)', opacity: 0 }, to: { transform: 'scale(1)', opacity: 1 } } }} />
      <Box sx={{ position: 'absolute', inset: 16, borderRadius: '50%', bgcolor: c.success, display: 'grid', placeItems: 'center', boxShadow: '0 16px 30px -12px rgba(1,210,106,.7)' }}>
        <CheckRounded sx={{ color: '#fff', fontSize: 52 }} />
      </Box>
      <Box sx={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)' }}><Crown size={36} /></Box>
    </Box>
  )
}

export default function Success() {
  const { cart, clearCart, review, priceFor, toast } = useApp()
  // Snapshot what was ordered, then empty the cart (as Magento does once the order is placed).
  const [lines] = useState<CartLine[]>(() => (cart.length ? cart : orders[0].items.map((i) => ({ sku: i.sku, qty: i.qty }))))
  useEffect(() => { clearCart() }, [clearCart])
  const [pw, setPw] = useState('')
  const [show, setShow] = useState(false)
  const [created, setCreated] = useState(false)
  const ship = currentShipping()
  const dm = currentMethod()
  const t = cartTotals(lines, priceFor, 0, checkoutSession.fee)
  const email = review.signedIn ? customer.email : checkoutSession.email || 'orders@yourkitchen.ca'

  const steps = [
    { icon: <MailOutlineRounded />, title: 'Confirmation sent', body: `Receipt and invoice on their way to ${email}.`, done: true },
    { icon: <Inventory2Outlined />, title: 'Picking at Mississauga warehouse', body: 'Cold items packed last, straight onto the truck.', done: false },
    { icon: <LocalShippingOutlined />, title: dm.id === 'pickup' ? 'Ready for pickup' : 'Out for delivery', body: dm.id === 'pickup' ? 'We’ll text you when it’s at the counter.' : `${dm.eta} — driver calls on arrival.`, done: false },
  ]

  return (
    <Container sx={{ py: { xs: 3, md: 6 } }}>
      <Box sx={{ textAlign: 'center', maxWidth: 820, mx: 'auto', mb: { xs: 4, md: 6 }, '& h1': { textWrap: 'balance' } }}>
        <Confirmation />
        <Typography variant="overline" sx={{ color: c.successText, display: 'block', mt: 3 }}>Order placed</Typography>
        <Typography variant="h1" sx={{ fontSize: { xs: 30, md: 44 } }}>Thanks{review.signedIn ? `, ${customer.firstName}` : ''}! Your order is in.</Typography>
        <Typography color="text.secondary" sx={{ mt: 1.5, fontSize: 16 }}>
          Order <Box component="b" sx={{ color: c.ink, fontFamily: tokens.font.mono }}>#000132</Box> · {dm.id === 'pickup' ? 'Pickup' : 'Arrives'} <b style={{ color: c.successText }}>{dm.eta}</b>
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="center" sx={{ mt: 3 }}>
          <Button variant="contained" size="large" component={RouterLink} to="/" endIcon={<ArrowForwardRounded />}>Continue shopping</Button>
          {review.signedIn && <Button variant="outlined" size="large" color="secondary" component={RouterLink} to="/account/orders/000131" startIcon={<ReceiptLongOutlined />}>View order</Button>}
          <Button variant="text" size="large" startIcon={<DownloadRounded />} onClick={() => toast('Invoice INV-2048.pdf downloaded')} sx={{ color: c.navy }}>Invoice PDF</Button>
        </Stack>
      </Box>

      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: 'minmax(0,1fr) 420px' }, alignItems: 'start', maxWidth: 1200, mx: 'auto' }}>
        <Stack spacing={3} sx={{ minWidth: 0 }}>
          {!review.signedIn && (
            <Panel sx={{ bgcolor: c.navy, color: '#fff', borderColor: c.navy, position: 'relative', overflow: 'hidden' }}>
              <Box sx={{ position: 'absolute', right: -20, bottom: -20, opacity: 0.12 }}><Crown size={180} color="#fff" /></Box>
              {created ? (
                <Box sx={{ position: 'relative' }}>
                  <Typography variant="h3" sx={{ color: '#fff' }}>Account created ✓</Typography>
                  <Typography sx={{ opacity: 0.85, mt: 1 }}>Order #000132 is saved to your account. Next time, reorder it in one tap.</Typography>
                </Box>
              ) : (
                <Box sx={{ position: 'relative' }}>
                  <Typography variant="overline" sx={{ color: c.saffron }}>Save time on your next order</Typography>
                  <Typography variant="h3" sx={{ color: '#fff', mb: 1 }}>Set a password to create your business account</Typography>
                  <Typography sx={{ opacity: 0.85, mb: 2.5, fontSize: 14 }}>Track this order, reorder in one tap, see business pricing and apply for Net 30 credit terms.</Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                    <TextField
                      fullWidth type={show ? 'text' : 'password'} placeholder="Create a password" value={pw} onChange={(e) => setPw(e.target.value)}
                      inputProps={{ 'aria-label': 'Create a password' }}
                      InputProps={{ endAdornment: <InputAdornment position="end"><IconButton aria-label={show ? 'Hide password' : 'Show password'} onClick={() => setShow(!show)}>{show ? <VisibilityOffOutlined /> : <VisibilityOutlined />}</IconButton></InputAdornment> }}
                    />
                    <Button variant="contained" size="large" disabled={pw.length < 8} onClick={() => setCreated(true)}
                      sx={{ flexShrink: 0, bgcolor: '#fff', color: c.red, '&:hover': { bgcolor: c.redTint }, '&.Mui-disabled': { bgcolor: 'rgba(255,255,255,.3)', color: 'rgba(255,255,255,.8)' } }}>
                      Create account
                    </Button>
                  </Stack>
                  <Typography sx={{ fontSize: 12, opacity: 0.75, mt: 1 }}>For {email} · at least 8 characters</Typography>
                </Box>
              )}
            </Panel>
          )}

          <Panel>
            <Typography variant="h4" component="h2" sx={{ mb: 2.5 }}>What happens next</Typography>
            <Box component="ol" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {steps.map((s, i) => (
                <Box component="li" key={s.title} sx={{ display: 'grid', gridTemplateColumns: '44px 1fr', gap: 2, position: 'relative', pb: i < steps.length - 1 ? 3 : 0 }}>
                  {i < steps.length - 1 && <Box sx={{ position: 'absolute', left: 21, top: 44, bottom: 0, width: 2, bgcolor: s.done ? c.success : c.line }} />}
                  <Box sx={{ width: 44, height: 44, borderRadius: '50%', display: 'grid', placeItems: 'center', bgcolor: s.done ? c.success : c.navyTint, color: s.done ? '#fff' : c.navy, '& svg': { fontSize: 20 } }}>
                    {s.done ? <CheckRounded /> : s.icon}
                  </Box>
                  <Box sx={{ pt: 0.5 }}>
                    <Typography sx={{ fontWeight: 700 }}>{s.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{s.body}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Panel>

          <Panel>
            <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
              <Box>
                <Typography variant="overline" sx={{ color: c.text3 }}>{dm.id === 'pickup' ? 'Pickup at' : 'Delivering to'}</Typography>
                {dm.id === 'pickup' ? (
                  <Typography sx={{ fontSize: 14 }}><b>Supreme Cash &amp; Carry</b><br />3750A Laird Road, Unit 9<br />Mississauga, ON</Typography>
                ) : (
                  <Typography sx={{ fontSize: 14 }}><b>{ship.company || ship.name}</b><br />{ship.street}<br />{ship.city}, {ship.province} {ship.postal}</Typography>
                )}
              </Box>
              <Box>
                <Typography variant="overline" sx={{ color: c.text3 }}>Need to change something?</Typography>
                <Typography sx={{ fontSize: 14, mb: 1 }}>Edits are possible until we start picking (about 1 hour).</Typography>
                <Button size="small" variant="outlined" color="secondary" startIcon={<WhatsApp />} href="https://wa.me/13657770999">WhatsApp +1 365-777-0999</Button>
              </Box>
            </Box>
          </Panel>
        </Stack>

        <Panel>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: 1 }}>
            <Typography variant="h4" component="h2">Order #000132</Typography>
            <Typography variant="body2" color="text.secondary">{lines.reduce((a, l) => a + l.qty, 0)} items</Typography>
          </Stack>
          <Box sx={{ borderBottom: `1px solid ${c.line}`, mb: 1.5, pb: 1 }}>
            {lines.map((l) => <CartLineItem key={l.sku} line={l} compact />)}
          </Box>
          {[['Subtotal', money(t.subtotal)], ['Delivery', t.delivery ? money(t.delivery) : 'Free'], ['HST (13%)', money(t.tax)]].map(([k, v]) => (
            <Stack key={k} direction="row" justifyContent="space-between" sx={{ py: 0.5, fontSize: 14 }}><span>{k}</span><span>{v}</span></Stack>
          ))}
          <Stack direction="row" justifyContent="space-between" sx={{ pt: 1.25, mt: 1, borderTop: `1px solid ${c.line}`, fontSize: 17, fontWeight: 700 }}><span>Total paid</span><span>{money(t.total)}</span></Stack>
        </Panel>
      </Box>
    </Container>
  )
}
