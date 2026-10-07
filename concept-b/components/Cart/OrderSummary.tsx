import { useId, useState, type ReactNode } from 'react'
import { Box, Button, Collapse, Divider, IconButton, InputBase, Tooltip, Typography } from '@mui/material'
import { money } from '../../lib/data'
import { useCart } from '../../lib/cart'
import { checkCoupon, totals, type Method } from '../../lib/pricing'
import { colors, radius } from '../../lib/theme'
import { AlertCircleIcon, CloseIcon, InfoIcon, TagIcon } from '../ui/icons'

/** Coupon entry: collapsed link → field + Apply; applied state shows the code with a remove button. */
export function CouponField() {
  const { coupon, setCoupon, notify } = useCart()
  const [open, setOpen] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const id = `coupon-${useId().replace(/:/g, '')}`
  if (coupon) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.25, pl: 1.5, borderRadius: radius.md, bgcolor: colors.successTint, border: `1px solid ${colors.successLine}` }}>
        <TagIcon sx={{ fontSize: 18, color: colors.success }} />
        <Typography sx={{ fontSize: 14, flex: 1 }}><b>{coupon.code}</b> applied · {coupon.label}</Typography>
        <Tooltip title="Remove coupon">
          <IconButton size="small" aria-label={`Remove coupon ${coupon.code}`} onClick={() => { setCoupon(null); notify('Coupon removed', 'info') }}><CloseIcon fontSize="small" /></IconButton>
        </Tooltip>
      </Box>
    )
  }
  const apply = () => {
    const r = checkCoupon(code)
    if (!r.ok) return setError(r.error)
    setCoupon(r.coupon)
    setError('')
    setCode('')
    notify(`${r.coupon.code} applied — ${r.coupon.label}`)
  }
  return (
    <Box>
      {!open ? (
        <Button size="small" startIcon={<TagIcon />} onClick={() => setOpen(true)} sx={{ ml: -1, color: colors.ink700 }}>Have a coupon code?</Button>
      ) : null}
      <Collapse in={open} unmountOnExit>
        <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); apply() }}>
          <Box component="label" htmlFor={id} sx={{ display: 'block', fontSize: 14, fontWeight: 500, mb: 0.75 }}>Coupon code</Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <InputBase
              id={id}
              autoFocus
              value={code}
              onChange={(e) => { setCode(e.target.value.toUpperCase()); setError('') }}
              placeholder="e.g. SUPREME10"
              inputProps={{ 'aria-invalid': !!error, 'aria-describedby': error ? `${id}-error` : undefined, autoComplete: 'off' }}
              sx={{ flex: 1, minWidth: 0, height: 44, px: 1.5, border: `1px solid ${error ? colors.error : colors.line2}`, borderRadius: radius.md, fontSize: 15, '&.Mui-focused': { borderColor: error ? colors.error : colors.navy, boxShadow: `0 0 0 3px ${error ? colors.errorTint : colors.navyTint}` } }}
            />
            <Button type="submit" variant="outlined" disabled={!code.trim()}>Apply</Button>
          </Box>
          {error && (
            <Typography id={`${id}-error`} role="alert" sx={{ display: 'flex', gap: 0.5, mt: 0.75, fontSize: 13, color: colors.error }}>
              <AlertCircleIcon sx={{ fontSize: 16, mt: '1px' }} /> {error}
            </Typography>
          )}
        </Box>
      </Collapse>
    </Box>
  )
}

function Row({ label, value, strong = false, tone, hint }: { label: ReactNode; value: ReactNode; strong?: boolean; tone?: 'success'; hint?: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 2 }}>
      <Typography sx={{ fontSize: strong ? 16 : 14.5, fontWeight: strong ? 600 : 400, color: strong ? colors.ink : colors.ink700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {label}
        {hint && <Tooltip title={hint}><InfoIcon tabIndex={0} aria-label={hint} sx={{ fontSize: 16, color: colors.ink400, outline: 'none', '&:focus-visible': { outline: `2px solid ${colors.navy}`, borderRadius: '50%' } }} /></Tooltip>}
      </Typography>
      <Typography sx={{ fontSize: strong ? 20 : 14.5, fontWeight: strong ? 700 : 500, color: tone === 'success' ? colors.success : colors.ink, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{value}</Typography>
    </Box>
  )
}

/** Price breakdown shared by cart and checkout. `method` changes the delivery line once the buyer has chosen. */
export default function OrderSummary({ method, children, title = 'Order summary', showCoupon = true }: { method?: Method; children?: ReactNode; title?: string; showCoupon?: boolean }) {
  const { lines, coupon } = useCart()
  const t = totals(lines, { coupon, method })
  const items = lines.reduce((a, l) => a + l.qty, 0)
  const titleId = `summary-${useId().replace(/:/g, '')}`
  const delivery = method === 'pickup' ? 'Free pickup' : t.deliveryEligible ? 'Free' : method === 'delivery' ? 'Not available' : 'Pickup only'
  return (
    <Box component="section" aria-labelledby={titleId} sx={{ bgcolor: '#fff', border: `1px solid ${colors.line}`, borderRadius: radius.xl, p: { xs: 2, md: 2.5 }, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Typography id={titleId} component="h2" variant="h3">{title}</Typography>
      <Row label={`Subtotal (${items} item${items === 1 ? '' : 's'})`} value={money(t.subtotal)} />
      {t.discount > 0 && <Row label={`Coupon ${coupon?.code}`} value={`−${money(t.discount)}`} tone="success" />}
      <Row label="Delivery" value={delivery} hint={`Delivery is free on orders over $350. Smaller orders can be picked up free at our Mississauga warehouse.`} />
      <Row label="Estimated HST" value={money(t.tax)} hint="Basic groceries are zero-rated. HST applies to packaging, janitorial and equipment. Final tax is confirmed on your invoice." />
      <Divider />
      <Row label="Total" value={money(t.total)} strong />
      <Typography sx={{ fontSize: 12.5, color: colors.ink500, mt: -0.75 }}>Prices in CAD. Business pricing applies after sign-in.</Typography>
      {showCoupon && <CouponField />}
      {children}
    </Box>
  )
}
