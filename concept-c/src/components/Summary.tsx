import { useState } from 'react'
import { Box, Button, Divider, IconButton, InputBase, LinearProgress, Typography } from '@mui/material'
import { tokens } from '../theme'
import { useApp } from '../state/app'
import { money } from '../data/catalog'
import { DELIVERY_MINIMUM } from '../data/app'
import { Sheet } from './ui'
import { AlertCircleIcon, CheckCircleIcon, ChevronRightIcon, CloseIcon, TagIcon, TruckIcon } from './icons'

const c = tokens.color

/** Free-delivery progress ($350 minimum). */
export function DeliveryMeter() {
  const { subtotal, remaining } = useApp()
  const ok = remaining <= 0
  return (
    <Box sx={{ p: 1.5, borderRadius: `${tokens.radius.md}px`, bgcolor: ok ? c.successTint : '#fff', border: `1px solid ${ok ? '#BDEFD3' : c.line}` }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {ok ? <CheckCircleIcon sx={{ color: c.successText, fontSize: 20 }} /> : <TruckIcon sx={{ color: c.navy, fontSize: 20 }} />}
        <Typography sx={{ fontSize: 13.5, flex: 1 }}>{ok ? <><b>Free delivery unlocked.</b> Order by 12 PM for today.</> : <>Add <b>{money(remaining)}</b> for free delivery, or pick up at the warehouse.</>}</Typography>
      </Box>
      {!ok && <LinearProgress variant="determinate" value={Math.min(100, (subtotal / DELIVERY_MINIMUM) * 100)} sx={{ mt: 1.25, '& .MuiLinearProgress-bar': { bgcolor: c.navy } }} aria-label={`${money(subtotal)} of ${money(DELIVERY_MINIMUM)} delivery minimum`} />}
    </Box>
  )
}

export function PromoRow() {
  const { coupon, applyCoupon, removeCoupon } = useApp()
  const [open, setOpen] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  if (coupon) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, p: 1.25, pl: 1.5, borderRadius: `${tokens.radius.md}px`, bgcolor: c.successTint }}>
        <TagIcon sx={{ color: c.successText, fontSize: 20 }} />
        <Typography sx={{ flex: 1, fontSize: 14 }}><b>{coupon.code}</b> · {coupon.pct}% off</Typography>
        <IconButton size="small" aria-label={`Remove promo ${coupon.code}`} onClick={removeCoupon}><CloseIcon sx={{ fontSize: 18 }} /></IconButton>
      </Box>
    )
  }
  return (
    <>
      <Box component="button" onClick={() => setOpen(true)} sx={{ all: 'unset', boxSizing: 'border-box', cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', gap: 1.25, p: 1.5, borderRadius: `${tokens.radius.md}px`, bgcolor: '#fff', border: `1px dashed ${c.line2}`, '&:focus-visible': { outline: `3px solid ${c.navyTint}` } }}>
        <TagIcon sx={{ color: c.navy, fontSize: 20 }} />
        <Typography sx={{ flex: 1, fontSize: 14, fontWeight: 600 }}>Add a promo code</Typography>
        <ChevronRightIcon sx={{ color: c.text4 }} />
      </Box>
      <Sheet open={open} onClose={() => setOpen(false)} title="Promo code">
        <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); const err = applyCoupon(code); setError(err ?? ''); if (!err) { setOpen(false); setCode('') } }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <InputBase autoFocus value={code} onChange={(e) => { setCode(e.target.value.toUpperCase()); setError('') }} placeholder="e.g. SUPREME10" inputProps={{ 'aria-label': 'Promo code', 'aria-invalid': !!error, autoCapitalize: 'characters' }}
              sx={{ flex: 1, height: 48, px: 1.5, borderRadius: `${tokens.radius.sm}px`, border: `1.5px solid ${error ? c.error : c.line2}`, fontSize: 16, '&.Mui-focused': { borderColor: error ? c.error : c.navy } }} />
            <Button type="submit" variant="contained" color="secondary" disabled={!code.trim()} sx={{ height: 48 }}>Apply</Button>
          </Box>
          {error && <Typography role="alert" sx={{ display: 'flex', gap: 0.5, mt: 1, fontSize: 13, color: c.error }}><AlertCircleIcon sx={{ fontSize: 17 }} /> {error}</Typography>}
          <Typography sx={{ mt: 1.5, fontSize: 12.5, color: c.text3 }}>Prototype: SUPREME10 takes 10% off.</Typography>
        </Box>
      </Sheet>
    </>
  )
}

export function Totals({ method = 'delivery' }: { method?: 'delivery' | 'pickup' }) {
  const { subtotal, discount, tax, total, count, remaining, coupon } = useApp()
  const row = (k: string, v: string, strong = false, green = false) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
      <Typography sx={{ fontSize: strong ? 16 : 14, fontWeight: strong ? 700 : 400, color: strong ? c.ink : c.text2 }}>{k}</Typography>
      <Typography sx={{ fontSize: strong ? 18 : 14, fontWeight: strong ? 800 : 500, color: green ? c.successText : c.ink, fontVariantNumeric: 'tabular-nums' }}>{v}</Typography>
    </Box>
  )
  return (
    <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: `${tokens.radius.md}px`, border: `1px solid ${c.line}` }}>
      {row(`Subtotal (${count} items)`, money(subtotal))}
      {discount > 0 && row(`Promo ${coupon?.code}`, `−${money(discount)}`, false, true)}
      {row(method === 'pickup' ? 'Pickup' : 'Delivery', method === 'pickup' ? 'Free' : remaining > 0 ? 'Pickup only' : 'Free')}
      {row('HST (est.)', money(tax))}
      <Divider sx={{ my: 1 }} />
      {row('Total', money(total), true)}
    </Box>
  )
}
