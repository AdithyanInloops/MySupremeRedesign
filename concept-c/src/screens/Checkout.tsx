import { useState, type ReactNode } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material'
import { tokens, focusRing } from '../theme'
import { useApp } from '../state/app'
import { money } from '../data/catalog'
import { addresses, credit, type Order } from '../data/account'
import { deliverySlots } from '../data/app'
import { BottomBar, Segmented, Sheet, TopBar } from '../components/ui'
import { Totals } from '../components/Summary'
import { AlertCircleIcon, BankIcon, ChevronRightIcon, CreditCardIcon, LockIcon, MapPinIcon, StoreIcon, TruckIcon, WalletIcon, type IconComponent } from '../components/icons'

const c = tokens.color

function Block({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <Box component="section" aria-label={title}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', mb: 1 }}>
        <Typography component="h2" variant="overline" sx={{ color: c.text3 }}>{title}</Typography>
        {action}
      </Box>
      {children}
    </Box>
  )
}

function Choice({ on, onClick, icon: Icon, title, sub, trailing, disabled }: { on: boolean; onClick: () => void; icon: IconComponent; title: string; sub?: ReactNode; trailing?: ReactNode; disabled?: boolean }) {
  return (
    <Box component="button" role="radio" aria-checked={on} disabled={disabled} onClick={onClick}
      sx={{ all: 'unset', boxSizing: 'border-box', cursor: disabled ? 'not-allowed' : 'pointer', width: '100%', display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: `${tokens.radius.md}px`, bgcolor: disabled ? c.surface2 : '#fff', border: `${on ? 2 : 1}px solid ${on ? c.navy : c.line}`, m: on ? 0 : '1px', opacity: disabled ? 0.65 : 1, ...focusRing }}>
      <Box sx={{ width: 38, height: 38, borderRadius: `${tokens.radius.sm}px`, bgcolor: on ? c.navy : c.surface2, color: on ? '#fff' : c.text2, display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon sx={{ fontSize: 20 }} /></Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 14.5, fontWeight: 600 }}>{title}</Typography>
        {sub && <Typography component="div" sx={{ fontSize: 12.5, color: c.text3 }}>{sub}</Typography>}
      </Box>
      {trailing}
      <Box sx={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${on ? c.navy : c.line2}`, display: 'grid', placeItems: 'center', flexShrink: 0 }}>{on && <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: c.navy }} />}</Box>
    </Box>
  )
}

/** One-page mobile checkout. Production: Magento cart mutations + Stripe (card) / credit module (on account). */
export default function Checkout() {
  const { lines, count, total, remaining, signedIn, placeOrder, subtotal, tax, linePrice } = useApp()
  const navigate = useNavigate()
  const [method, setMethod] = useState<'delivery' | 'pickup'>(remaining > 0 ? 'pickup' : 'delivery')
  const [addr, setAddr] = useState(addresses[0].id)
  const [addrSheet, setAddrSheet] = useState(false)
  const [slot, setSlot] = useState(deliverySlots[0].id)
  const [pay, setPay] = useState<'account' | 'card' | 'apple' | 'store'>(signedIn ? 'account' : 'card')
  const [po, setPo] = useState('')
  const [notes, setNotes] = useState('')
  const [busy, setBusy] = useState(false)

  if (!lines.length && !busy) return <Navigate to="/cart" replace />
  const address = addresses.find((a) => a.id === addr) ?? addresses[0]
  const outOfArea = method === 'delivery' && address.inArea === false
  const s = deliverySlots.find((x) => x.id === slot) ?? deliverySlots[0]
  const blocked = outOfArea || (method === 'delivery' && remaining > 0)
  const payment = pay === 'store' && method !== 'pickup' ? 'card' : pay

  const place = async () => {
    if (blocked) return
    setBusy(true)
    await new Promise((r) => setTimeout(r, 1200))
    const number = String(132 + Math.floor(Math.random() * 60)).padStart(6, '0')
    const order: Order = {
      number, date: '2026-10-08', channel: 'Online', status: 'Confirmed',
      items: lines.map((l) => ({ sku: l.sku, qty: l.qty, price: linePrice(l) })), subtotal, tax, delivery: 0, total,
      eta: method === 'pickup' ? 'Ready in about 2 hours' : `${s.day}, ${s.window}`,
    }
    placeOrder(order)
    navigate(`/order-placed/${number}`, { replace: true, state: { method, payment } })
  }

  return (
    <Box>
      <TopBar title="Checkout" subtitle={`${count} items`} />
      <Box sx={{ px: 2, pt: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Segmented label="Fulfilment" value={method} onChange={setMethod} options={[
          { value: 'delivery', label: <><TruckIcon sx={{ fontSize: 18 }} /> Delivery</> },
          { value: 'pickup', label: <><StoreIcon sx={{ fontSize: 18 }} /> Pickup</> },
        ]} />

        {method === 'delivery' ? (
          <>
            <Block title="Deliver to" action={<Button size="small" onClick={() => setAddrSheet(true)} sx={{ color: c.navy, minHeight: 28 }}>Change</Button>}>
              <Box component="button" onClick={() => setAddrSheet(true)} sx={{ all: 'unset', boxSizing: 'border-box', cursor: 'pointer', width: '100%', display: 'flex', gap: 1.5, p: 1.5, bgcolor: '#fff', borderRadius: `${tokens.radius.md}px`, border: `1px solid ${outOfArea ? c.warning : c.line}`, ...focusRing }}>
                <MapPinIcon sx={{ color: c.navy, mt: 0.25 }} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: 14.5 }}>{address.company}</Typography>
                  <Typography sx={{ fontSize: 13, color: c.text2 }}>{address.street}, {address.city}, {address.province} {address.postal}</Typography>
                  <Typography sx={{ fontSize: 12.5, color: c.text3 }}>{address.name} · {address.phone}</Typography>
                </Box>
                <ChevronRightIcon sx={{ color: c.text4, alignSelf: 'center' }} />
              </Box>
              {outOfArea && <Typography role="alert" sx={{ display: 'flex', gap: 0.75, mt: 1, fontSize: 13, color: c.warning }}><AlertCircleIcon sx={{ fontSize: 18 }} /> {address.city} is outside our routes. Choose another address or switch to pickup.</Typography>}
              {remaining > 0 && <Typography role="alert" sx={{ display: 'flex', gap: 0.75, mt: 1, fontSize: 13, color: c.warning }}><AlertCircleIcon sx={{ fontSize: 18 }} /> Add {money(remaining)} more for delivery (minimum $350), or switch to pickup.</Typography>}
            </Block>
            <Block title="Delivery window">
              <Box role="radiogroup" aria-label="Delivery window" className="no-scrollbar" sx={{ display: 'flex', gap: 1, overflowX: 'auto', mx: -2, px: 2, pb: 0.5 }}>
                {deliverySlots.map((x) => {
                  const on = x.id === slot
                  return (
                    <Box key={x.id} component="button" role="radio" aria-checked={on} onClick={() => setSlot(x.id)}
                      sx={{ all: 'unset', boxSizing: 'border-box', cursor: 'pointer', flex: '0 0 132px', p: 1.25, borderRadius: `${tokens.radius.md}px`, bgcolor: on ? c.navy : '#fff', color: on ? '#fff' : c.ink, border: `1px solid ${on ? c.navy : c.line}`, ...focusRing }}>
                      <Typography sx={{ fontSize: 12, opacity: 0.8 }}>{x.day} · {x.date.split(', ')[1]}</Typography>
                      <Typography sx={{ fontSize: 15, fontWeight: 700 }}>{x.window}</Typography>
                      <Typography sx={{ fontSize: 11.5, color: on ? c.saffron : c.successText, fontWeight: 600, mt: 0.25 }}>{x.note ?? 'Free'}</Typography>
                    </Box>
                  )
                })}
              </Box>
            </Block>
          </>
        ) : (
          <Block title="Pick up at">
            <Box sx={{ display: 'flex', gap: 1.5, p: 1.5, bgcolor: '#fff', borderRadius: `${tokens.radius.md}px`, border: `1px solid ${c.line}` }}>
              <StoreIcon sx={{ color: c.navy, mt: 0.25 }} />
              <Box>
                <Typography sx={{ fontWeight: 600, fontSize: 14.5 }}>Supreme Cash & Carry · Mississauga</Typography>
                <Typography sx={{ fontSize: 13, color: c.text2 }}>3750A Laird Road, Unit 9 · Mon–Sat 9am–6pm</Typography>
                <Typography sx={{ fontSize: 12.5, color: c.successText, fontWeight: 600, mt: 0.25 }}>Ready in about 2 hours · we’ll send a push notification</Typography>
              </Box>
            </Box>
          </Block>
        )}

        <Block title="Payment">
          <Box role="radiogroup" aria-label="Payment method" sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {signedIn && <Choice on={payment === 'account'} onClick={() => setPay('account')} icon={BankIcon} title={`On account · ${credit.terms}`} sub={`${money(credit.available)} available credit`} />}
            <Choice on={payment === 'card'} onClick={() => setPay('card')} icon={CreditCardIcon} title="Visa •••• 4242" sub="Expires 08/28 · saved card" />
            <Choice on={payment === 'apple'} onClick={() => setPay('apple')} icon={WalletIcon} title="Apple Pay" sub="Confirm with Face ID" />
            {method === 'pickup' && <Choice on={payment === 'store'} onClick={() => setPay('store')} icon={StoreIcon} title="Pay at pickup" sub="Cash, debit or card at the counter" />}
          </Box>
        </Block>

        <Block title="Order details">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <TextField label="PO number (optional)" value={po} onChange={(e) => setPo(e.target.value)} fullWidth helperText="Shows on your invoice" />
            <TextField label={method === 'pickup' ? 'Pickup notes (optional)' : 'Delivery notes (optional)'} value={notes} onChange={(e) => setNotes(e.target.value)} fullWidth multiline minRows={2} placeholder={method === 'pickup' ? 'Who’s picking up?' : 'Back door, receiving hours, buzzer…'} />
          </Box>
        </Block>

        <Block title="Summary"><Totals method={method} /></Block>
        <Typography sx={{ fontSize: 12, color: c.text3, textAlign: 'center' }}>By placing this order you agree to the Terms & Uses and returns policy.</Typography>
      </Box>

      <BottomBar>
        <Button fullWidth variant="contained" size="large" disabled={busy || blocked} onClick={place} startIcon={busy ? <CircularProgress size={18} sx={{ color: 'inherit' }} /> : <LockIcon />}>
          {busy ? 'Placing order…' : blocked ? (outOfArea ? 'Choose a delivery address' : `Add ${money(remaining)} for delivery`) : `Place order · ${money(total)}`}
        </Button>
      </BottomBar>

      <Sheet open={addrSheet} onClose={() => setAddrSheet(false)} title="Deliver to">
        <Box role="radiogroup" aria-label="Delivery address" sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {addresses.map((a) => (
            <Choice key={a.id} on={a.id === addr} onClick={() => { setAddr(a.id); setAddrSheet(false) }} icon={MapPinIcon} title={a.company}
              sub={<>{a.street}, {a.city}{a.inArea === false && <Box component="span" sx={{ display: 'block', color: c.warning, fontWeight: 600 }}>Outside delivery routes</Box>}</>}
              trailing={a.defaultShipping ? <Box sx={{ fontSize: 11, fontWeight: 700, color: c.navy, bgcolor: c.navyTint, px: 0.75, borderRadius: 1 }}>Default</Box> : null} />
          ))}
        </Box>
      </Sheet>
    </Box>
  )
}

