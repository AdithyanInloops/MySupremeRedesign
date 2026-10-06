import { useState } from 'react'
import { Alert, Box, Button, CircularProgress, Divider, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined'
import WhatsApp from '@mui/icons-material/WhatsApp'
import { tokens } from '../../theme'
import { orders, type Order } from '../../data/account'
import { money } from '../../data/catalog'
import { Container, Panel, StatusChip } from '../../components/ui'
import { PageTitle } from '../../components/Shared'
import { OrderTracker, fmtDate, itemCount, whatsapp } from './parts/AccountParts'

const c = tokens.color

export default function GuestOrderStatus() {
  const [num, setNum] = useState('')
  const [by, setBy] = useState<'email' | 'postal'>('email')
  const [val, setVal] = useState('')
  const [tried, setTried] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Order | null | undefined>(undefined)

  const lookup = (e: React.FormEvent) => {
    e.preventDefault()
    setTried(true)
    if (!num || !val) return
    setLoading(true)
    setResult(undefined)
    window.setTimeout(() => {
      setLoading(false)
      setResult(orders.find((o) => o.number === num.replace(/\D/g, '').padStart(6, '0')) ?? null)
    }, 700)
  }

  return (
    <Container sx={{ pb: 6 }}>
      <PageTitle title="Track an order" subtitle="No account needed — use the order number from your confirmation email." crumbs={[{ label: 'Guest order status' }]} />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '440px 1fr' }, gap: { xs: 2, md: 3 }, alignItems: 'start' }}>
        <Panel>
          <Box component="form" noValidate onSubmit={lookup}>
            <Stack spacing={2}>
              <TextField label="Order number" placeholder="e.g. 000131" value={num} onChange={(e) => setNum(e.target.value)} required
                error={tried && !num} helperText={tried && !num ? 'Enter your order number' : 'Try 000131 (on the way) or 000999 (not found)'} inputProps={{ inputMode: 'numeric' }} />
              <ToggleButtonGroup exclusive value={by} onChange={(_, v) => v && setBy(v)} fullWidth color="secondary" aria-label="Verify with">
                <ToggleButton value="email" sx={{ minHeight: 44, textTransform: 'none', fontWeight: 600 }}>Email</ToggleButton>
                <ToggleButton value="postal" sx={{ minHeight: 44, textTransform: 'none', fontWeight: 600 }}>Postal code</ToggleButton>
              </ToggleButtonGroup>
              <TextField label={by === 'email' ? 'Email used at checkout' : 'Delivery postal code'} value={val} onChange={(e) => setVal(e.target.value)} required
                type={by === 'email' ? 'email' : 'text'} placeholder={by === 'email' ? 'name@restaurant.ca' : 'L5L 5Z5'}
                error={tried && !val} helperText={tried && !val ? `Enter your ${by === 'email' ? 'email' : 'postal code'}` : ' '} />
              <Button type="submit" variant="contained" size="large" disabled={loading} startIcon={loading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : <LocalShippingOutlined />}>
                {loading ? 'Looking up…' : 'Track order'}
              </Button>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                Have an account? <Box component={RouterLink} to="/account/signin" sx={{ color: c.navy, fontWeight: 600 }}>Sign in</Box> to see every order.
              </Typography>
            </Stack>
          </Box>
        </Panel>

        <Box>
          {result === null && (
            <Alert severity="error" sx={{ borderRadius: `${tokens.radius.md}px`, alignItems: 'center' }}
              action={<Button href={whatsapp} target="_blank" startIcon={<WhatsApp />} sx={{ color: c.error }}>Ask us</Button>}>
              <b>We couldn’t find that order.</b> Check the number and {by === 'email' ? 'email' : 'postal code'} match your confirmation email.
            </Alert>
          )}
          {result && (
            <Panel>
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1.5} alignItems={{ sm: 'center' }}>
                <Box>
                  <Stack direction="row" spacing={1.5} alignItems="center"><Typography variant="h3" component="h2">Order #{result.number}</Typography><StatusChip status={result.status} size="medium" /></Stack>
                  <Typography color="text.secondary" sx={{ mt: 0.5 }}>Placed {fmtDate(result.date)} · {itemCount(result)} items · {money(result.total)}</Typography>
                </Box>
              </Stack>
              <Box sx={{ mt: 3, p: { xs: 2, md: 3 }, bgcolor: c.bg, borderRadius: `${tokens.radius.md}px` }}>
                <OrderTracker status={result.status} eta={result.eta} date={result.date} />
              </Box>
              <Divider sx={{ my: 2.5 }} />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button variant="contained" component={RouterLink} to="/account/signin?mode=create">Create an account to reorder</Button>
                <Button variant="outlined" color="secondary" href={whatsapp} target="_blank" startIcon={<WhatsApp />}>Questions? WhatsApp us</Button>
              </Stack>
            </Panel>
          )}
          {result === undefined && !loading && (
            <Panel sx={{ bgcolor: c.navyTint, borderColor: 'transparent', textAlign: 'center', py: { xs: 4, md: 8 } }}>
              <LocalShippingOutlined sx={{ fontSize: 48, color: c.navy }} />
              <Typography variant="h4" sx={{ mt: 1 }}>Your order status shows here</Typography>
              <Typography color="text.secondary" sx={{ maxWidth: 420, mx: 'auto', mt: 0.5 }}>Same-day and next-day deliveries across the GTA, Hamilton &amp; Niagara are updated as the truck leaves our Mississauga warehouse.</Typography>
            </Panel>
          )}
          {loading && <Panel><Stack alignItems="center" sx={{ py: 6 }}><CircularProgress /></Stack></Panel>}
        </Box>
      </Box>
    </Container>
  )
}
