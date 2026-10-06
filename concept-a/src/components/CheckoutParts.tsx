import { useMemo, useState, type ReactNode } from 'react'
import {
  Alert, Box, Button, Chip, ClickAwayListener, Divider, Grid, IconButton, InputAdornment, LinearProgress, Link, MenuItem, Paper,
  Stack, TextField, Typography,
} from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded'
import CheckRounded from '@mui/icons-material/CheckRounded'
import LocalOfferOutlined from '@mui/icons-material/LocalOfferOutlined'
import PlaceOutlined from '@mui/icons-material/PlaceOutlined'
import ShoppingCartOutlined from '@mui/icons-material/ShoppingCartOutlined'
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined'
import CreditCardOutlined from '@mui/icons-material/CreditCardOutlined'
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded'
import { tokens } from '../theme'
import { money, productBySku } from '../data/catalog'
import type { Address } from '../data/account'
import { useApp, type CartLine } from '../state/AppState'
import { ProductImage } from './Brand'
import { QtyStepper } from './Commerce'
import { PackChip, Sku } from './ui'

const c = tokens.color

/* ------------------------------------------------------------------ Cart line item */


export function CartLineItem({ line, state = 'idle', compact = false }: { line: CartLine; state?: 'idle' | 'updating' | 'error'; compact?: boolean }) {
  const { setQty, removeFromCart, addToCart, priceFor, toast } = useApp()
  const p = productBySku(line.sku)
  if (!p) return null
  const unit = priceFor(p)
  const oos = p.stock === 'OUT_OF_STOCK'
  const error = state === 'error' ? line.error ?? (oos ? 'This item just went out of stock — remove it or we’ll substitute on approval.' : 'Max 99 per order — call us for larger volumes.') : line.error
  const remove = () => {
    removeFromCart(p.sku)
    toast(`Removed ${p.name}`, 'info')
  }
  void addToCart

  if (compact) {
    return (
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ py: 1 }}>
        <Box sx={{ width: 52, flexShrink: 0, position: 'relative' }}>
          <ProductImage src={p.images[0]} alt={p.name} brand={p.brand} />
          <Box sx={{ position: 'absolute', top: -6, right: -6, minWidth: 22, height: 22, px: 0.5, borderRadius: 11, bgcolor: c.navy, color: '#fff', fontSize: 11, fontWeight: 700, display: 'grid', placeItems: 'center', border: '2px solid #fff' }}>{line.qty}</Box>
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 600, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }} title={p.name}>{p.name}</Typography>
          <Typography sx={{ fontSize: 11.5, color: c.text3 }}>{p.pack}</Typography>
        </Box>
        <Typography sx={{ fontSize: 13.5, fontWeight: 700, whiteSpace: 'nowrap' }}>{money(unit * line.qty)}</Typography>
      </Stack>
    )
  }

  return (
    <Box
      component="article"
      aria-label={`${p.name}, ${p.pack}, ${line.qty} × ${money(unit)}`}
      aria-busy={state === 'updating'}
      sx={{ position: 'relative', py: { xs: 2, md: 2.5 }, borderBottom: `1px solid ${c.line}`, '&:last-of-type': { borderBottom: 0 } }}
    >
      {state === 'updating' && <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, borderRadius: 2 }} />}
      <Box
        sx={{
          display: 'grid', gap: { xs: 1.5, md: 2.5 }, alignItems: 'center', opacity: state === 'updating' ? 0.5 : 1, transition: 'opacity .2s',
          gridTemplateColumns: { xs: '84px minmax(0,1fr)', md: '96px minmax(0,1fr) 140px 120px 44px' },
        }}
      >
        <Box component={RouterLink} to={`/p/${p.slug}`} sx={{ display: 'block' }}>
          <ProductImage src={p.images[0]} alt={p.name} brand={p.brand} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: c.navy }}>{p.brand}</Typography>
          <Link component={RouterLink} to={`/p/${p.slug}`} title={p.name} underline="hover"
            sx={{ color: c.ink, fontWeight: 600, fontSize: 14.5, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {p.name}
          </Link>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.75, minWidth: 0 }}>
            <PackChip pack={p.pack} size="sm" />
            <Box sx={{ minWidth: 0, flex: 1 }}><Sku sku={p.sku} /></Box>
          </Stack>
          <Typography sx={{ fontSize: 12.5, color: c.text2, mt: 0.75 }}>
            {money(unit)} <Box component="span" sx={{ color: c.text3 }}>/ {p.pack.includes('case') ? 'case' : 'pack'}</Box>
            {p.regular && <Box component="span" sx={{ ml: 1, color: c.red, fontWeight: 600 }}>Sale</Box>}
          </Typography>
          {/* Mobile controls */}
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} sx={{ display: { md: 'none' }, mt: 1.25 }}>
            <QtyStepper value={line.qty} onChange={(v) => setQty(p.sku, v)} size="sm" disabled={state === 'updating'} label={`Quantity for ${p.name}`} />
            <Typography sx={{ fontWeight: 700, fontSize: 15 }}>{money(unit * line.qty)}</Typography>
            <IconButton aria-label={`Remove ${p.name}`} onClick={remove} sx={{ width: 44, height: 44, color: c.text2 }}><DeleteOutlineRounded /></IconButton>
          </Stack>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <QtyStepper value={line.qty} onChange={(v) => setQty(p.sku, v)} size="sm" disabled={state === 'updating'} label={`Quantity for ${p.name}`} />
        </Box>
        <Typography sx={{ display: { xs: 'none', md: 'block' }, fontWeight: 700, fontSize: 16, textAlign: 'right' }}>{money(unit * line.qty)}</Typography>
        <IconButton aria-label={`Remove ${p.name}`} onClick={remove} sx={{ display: { xs: 'none', md: 'inline-flex' }, width: 44, height: 44, color: c.text2, '&:hover': { color: c.red, bgcolor: c.redTint } }}>
          <DeleteOutlineRounded />
        </IconButton>
      </Box>
      {error && (
        <Alert severity="error" icon={<WarningAmberRounded fontSize="small" />} sx={{ mt: 1.5, py: 0, borderRadius: `${tokens.radius.sm}px`, fontSize: 13 }}>
          {error}
        </Alert>
      )}
    </Box>
  )
}

/* ------------------------------------------------------------------ Order summary */

export const cartTotals = (lines: CartLine[], priceFor: (p: NonNullable<ReturnType<typeof productBySku>>) => number, discount = 0, deliveryFee = 0) => {
  const subtotal = lines.reduce((a, l) => {
    const p = productBySku(l.sku)
    return a + (p ? priceFor(p) * l.qty : 0)
  }, 0)
  const tax = Math.max(0, subtotal - discount) * 0.13
  return { subtotal, discount, tax, delivery: deliveryFee, total: subtotal - discount + tax + deliveryFee }
}

export function OrderSummary({
  lines, coupon: couponInit = 'none', showCoupon = true, deliveryFee = 0, action, sticky = false, title = 'Order summary', children,
}: {
  lines: CartLine[]
  coupon?: 'none' | 'applied' | 'invalid'
  showCoupon?: boolean
  deliveryFee?: number
  action?: ReactNode
  sticky?: boolean
  title?: string
  children?: ReactNode
}) {
  const { priceFor } = useApp()
  const [coupon, setCoupon] = useState(couponInit)
  const [code, setCode] = useState(couponInit === 'invalid' ? 'FREEFRIES' : '')
  const discount = coupon === 'applied' ? 25 : 0
  const t = cartTotals(lines, priceFor, discount, deliveryFee)
  const count = lines.reduce((a, l) => a + l.qty, 0)
  const row = (label: ReactNode, value: ReactNode, strong = false, color?: string) => (
    <Stack direction="row" justifyContent="space-between" sx={{ py: 0.6, fontSize: strong ? 17 : 14, fontWeight: strong ? 700 : 400, color }}>
      <span>{label}</span>
      <span>{value}</span>
    </Stack>
  )
  const apply = () => {
    if (!code.trim()) return
    setCoupon(code.trim().toUpperCase() === 'KITCHEN25' ? 'applied' : 'invalid')
  }
  return (
    <Box
      component="aside"
      aria-label={title}
      sx={{
        bgcolor: '#fff', border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.lg}px`, p: { xs: 2, md: 3 },
        position: sticky ? { md: 'sticky' } : 'static', top: sticky ? 190 : undefined,
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: 1.5 }}>
        <Typography variant="h4" component="h2">{title}</Typography>
        <Typography variant="body2" color="text.secondary">{count} items</Typography>
      </Stack>
      {children}
      {showCoupon && (
        <Box sx={{ mb: 2 }}>
          {coupon === 'applied' ? (
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 1.25, borderRadius: `${tokens.radius.sm}px`, bgcolor: c.successTint, border: `1px dashed ${c.successText}` }}>
              <Chip icon={<LocalOfferOutlined />} label="KITCHEN25" onDelete={() => { setCoupon('none'); setCode('') }} sx={{ bgcolor: '#fff', color: c.successText, fontFamily: tokens.font.mono, '& .MuiChip-icon': { color: c.successText } }} />
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: c.successText }}>−{money(25)} applied</Typography>
            </Stack>
          ) : (
            <Stack direction="row" spacing={1} alignItems="flex-start">
              <TextField
                size="small"
                fullWidth
                placeholder="Coupon code"
                inputProps={{ 'aria-label': 'Coupon code', style: { textTransform: 'uppercase' } }}
                value={code}
                onChange={(e) => { setCode(e.target.value); if (coupon === 'invalid') setCoupon('none') }}
                onKeyDown={(e) => e.key === 'Enter' && apply()}
                error={coupon === 'invalid'}
                helperText={coupon === 'invalid' ? `“${code}” isn’t valid or has expired. Try KITCHEN25.` : undefined}
                InputProps={{ startAdornment: <InputAdornment position="start"><LocalOfferOutlined sx={{ fontSize: 18 }} /></InputAdornment>, sx: { minHeight: 44 } }}
              />
              <Button variant="outlined" color="secondary" onClick={apply} sx={{ flexShrink: 0, minHeight: 44 }}>Apply</Button>
            </Stack>
          )}
        </Box>
      )}
      {row('Subtotal', money(t.subtotal))}
      {discount > 0 && row('Discount (KITCHEN25)', `−${money(discount)}`, false, c.successText)}
      {row('Delivery', t.delivery ? money(t.delivery) : <Box component="span" sx={{ color: c.successText, fontWeight: 600 }}>Free</Box>)}
      {row('HST (13%)', money(t.tax))}
      <Divider sx={{ my: 1.25 }} />
      {row('Total', money(t.total), true)}
      <Typography sx={{ fontSize: 12, color: c.text3, mb: action ? 2 : 0 }}>All prices in CAD. Free delivery on orders over $250 in the GTA.</Typography>
      {action}
    </Box>
  )
}

/* ------------------------------------------------------------------ Stepper */

const steps = [
  { label: 'Cart', to: '/cart', icon: <ShoppingCartOutlined /> },
  { label: 'Shipping', to: '/checkout', icon: <LocalShippingOutlined /> },
  { label: 'Payment', to: '/checkout/payment', icon: <CreditCardOutlined /> },
]

export function CheckoutStepper({ active }: { active: 0 | 1 | 2 }) {
  const nav = useNavigate()
  return (
    <Box component="nav" aria-label="Checkout progress">
      <Box component="ol" sx={{ display: 'flex', alignItems: 'center', listStyle: 'none', p: 0, m: 0, gap: { xs: 0.5, md: 1 } }}>
        {steps.map((s, i) => {
          const done = i < active
          const current = i === active
          return (
            <Box component="li" key={s.label} sx={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : '0 0 auto', minWidth: 0 }}>
              <Box
                component={done ? 'button' : 'div'}
                onClick={done ? () => nav(s.to) : undefined}
                aria-current={current ? 'step' : undefined}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1, border: 0, bgcolor: 'transparent', font: 'inherit', p: 0.5, borderRadius: `${tokens.radius.sm}px`,
                  minHeight: 44, cursor: done ? 'pointer' : 'default', color: current ? c.ink : done ? c.navy : c.text3,
                  '&:hover': done ? { bgcolor: c.navyTint } : {},
                }}
              >
                <Box sx={{
                  width: 34, height: 34, borderRadius: '50%', display: 'grid', placeItems: 'center', flexShrink: 0,
                  bgcolor: done ? c.navy : current ? c.red : '#fff', color: done || current ? '#fff' : c.text3,
                  border: `2px solid ${done ? c.navy : current ? c.red : c.line2}`, '& svg': { fontSize: 18 },
                  boxShadow: current ? `0 0 0 4px ${c.redTint}` : 'none',
                }}>
                  {done ? <CheckRounded /> : s.icon}
                </Box>
                <Box sx={{ textAlign: 'left', lineHeight: 1.15 }}>
                  <Box sx={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: c.text3, display: { xs: 'none', sm: 'block' } }}>Step {i + 1}</Box>
                  <Box sx={{ fontSize: { xs: 13, md: 14.5 }, fontWeight: current ? 700 : 600, whiteSpace: 'nowrap' }}>{s.label}{done && <Box component="span" sx={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}> (completed)</Box>}</Box>
                </Box>
              </Box>
              {i < steps.length - 1 && <Box aria-hidden sx={{ flex: 1, height: 3, mx: { xs: 0.75, md: 2 }, borderRadius: 2, bgcolor: done ? c.navy : c.line, minWidth: 12 }} />}
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

/* ------------------------------------------------------------------ Address form */

const serviceCities = ['Mississauga', 'Brampton', 'Toronto', 'Etobicoke', 'North York', 'Scarborough', 'Vaughan', 'Markham', 'Oakville', 'Burlington', 'Milton', 'Hamilton', 'Stoney Creek', 'St. Catharines', 'Niagara Falls', 'Welland', 'Grimsby', 'Richmond Hill', 'Pickering', 'Ajax']

const suggestions = [
  { street: '2150 Burnhamthorpe Rd W', city: 'Mississauga', postal: 'L5L 5Z5' },
  { street: '215 Lakeshore Rd E', city: 'Oakville', postal: 'L6J 1H8' },
  { street: '21 Dundas St W', city: 'Toronto', postal: 'M5G 1C6' },
  { street: '2100 Bloor St W', city: 'Toronto', postal: 'M6S 1M8' },
  { street: '88 King St E', city: 'Hamilton', postal: 'L8N 1A7' },
  { street: '211 Queen St', city: 'Ottawa', postal: 'K1P 5C7' },
  { street: '4825 Clifton Hill', city: 'Niagara Falls', postal: 'L2G 3N4' },
  { street: '1 Kingston Rd', city: 'Kingston', postal: 'K7L 1A1' },
]

export const isInArea = (city: string) => serviceCities.some((s) => s.toLowerCase() === city.trim().toLowerCase())

export function AddressForm({ initial, onSubmit, onCancel, submitLabel = 'Save address', requireArea = true }: { initial?: Partial<Address>; onSubmit: (a: Address) => void; onCancel?: () => void; submitLabel?: string; requireArea?: boolean }) {
  const [f, setF] = useState({
    name: initial?.name ?? '', company: initial?.company ?? '', street: initial?.street ?? '', unit: '', city: initial?.city ?? '',
    province: initial?.province ?? 'ON', postal: initial?.postal ?? '', phone: initial?.phone ?? '',
  })
  const [open, setOpen] = useState(false)
  const [touched, setTouched] = useState(false)
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF((s) => ({ ...s, [k]: e.target.value }))
  const matches = useMemo(() => {
    const q = f.street.trim().toLowerCase()
    if (q.length < 2) return []
    return suggestions.filter((s) => `${s.street} ${s.city}`.toLowerCase().includes(q)).slice(0, 5)
  }, [f.street])
  const outOfArea = requireArea && f.city.trim().length > 2 && !isInArea(f.city)
  const required: (keyof typeof f)[] = ['name', 'street', 'city', 'postal', 'phone']
  const err = (k: keyof typeof f) => touched && !f[k].trim()
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)
    if (required.some((k) => !f[k].trim()) || outOfArea) return
    onSubmit({ id: 'new-' + Date.now(), name: f.name, company: f.company, street: f.unit ? `${f.street}, ${f.unit}` : f.street, city: f.city, province: f.province, postal: f.postal.toUpperCase(), phone: f.phone, inArea: true })
  }
  return (
    <Box component="form" onSubmit={submit} noValidate>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}><TextField fullWidth label="Contact name" required value={f.name} onChange={set('name')} error={err('name')} helperText={err('name') ? 'Enter a contact name' : ' '} autoComplete="name" /></Grid>
        <Grid item xs={12} sm={6}><TextField fullWidth label="Business name" value={f.company} onChange={set('company')} helperText=" " autoComplete="organization" /></Grid>
        <Grid item xs={12}>
          <ClickAwayListener onClickAway={() => setOpen(false)}>
            <Box sx={{ position: 'relative' }}>
              <TextField
                fullWidth
                required
                label="Street address"
                placeholder="Start typing — e.g. 21"
                value={f.street}
                onChange={(e) => { set('street')(e as React.ChangeEvent<HTMLInputElement>); setOpen(true) }}
                onFocus={() => setOpen(true)}
                error={err('street')}
                helperText={err('street') ? 'Enter a street address' : 'Powered by Google address autocomplete'}
                autoComplete="off"
                inputProps={{ 'aria-autocomplete': 'list', 'aria-expanded': open && matches.length > 0 }}
                InputProps={{ startAdornment: <InputAdornment position="start"><PlaceOutlined sx={{ color: c.navy }} /></InputAdornment> }}
              />
              {open && matches.length > 0 && (
                <Paper role="listbox" sx={{ position: 'absolute', top: 58, left: 0, right: 0, zIndex: 10, boxShadow: tokens.shadow.pop, border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.md}px`, py: 0.5 }}>
                  {matches.map((m) => (
                    <MenuItem
                      key={m.street}
                      role="option"
                      onClick={() => { setF((s) => ({ ...s, street: m.street, city: m.city, postal: m.postal, province: 'ON' })); setOpen(false) }}
                      sx={{ minHeight: 48, gap: 1.5 }}
                    >
                      <PlaceOutlined sx={{ color: c.text3, fontSize: 20 }} />
                      <Box>
                        <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{m.street}</Typography>
                        <Typography sx={{ fontSize: 12.5, color: c.text2 }}>{m.city}, ON {m.postal}{!isInArea(m.city) && <Box component="span" sx={{ color: c.warning, fontWeight: 600 }}> · outside delivery area</Box>}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                  <Typography sx={{ fontSize: 10.5, color: c.text3, textAlign: 'right', px: 1.5, pt: 0.5 }}>powered by Google</Typography>
                </Paper>
              )}
            </Box>
          </ClickAwayListener>
        </Grid>
        <Grid item xs={12} sm={4}><TextField fullWidth label="Unit / suite / dock" value={f.unit} onChange={set('unit')} helperText=" " /></Grid>
        <Grid item xs={12} sm={4}><TextField fullWidth required label="City" value={f.city} onChange={set('city')} error={err('city') || outOfArea} helperText={err('city') ? 'Enter a city' : ' '} autoComplete="address-level2" /></Grid>
        <Grid item xs={6} sm={2}>
          <TextField select fullWidth label="Province" value={f.province} onChange={set('province')} helperText=" ">
            {['ON', 'QC', 'MB', 'BC', 'AB'].map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={6} sm={2}><TextField fullWidth required label="Postal code" value={f.postal} onChange={set('postal')} error={err('postal')} helperText={err('postal') ? 'Required' : ' '} autoComplete="postal-code" inputProps={{ style: { textTransform: 'uppercase' } }} /></Grid>
        <Grid item xs={12} sm={6}><TextField fullWidth required label="Phone" type="tel" value={f.phone} onChange={set('phone')} error={err('phone')} helperText={err('phone') ? 'We call on arrival' : 'Driver calls this number on arrival'} autoComplete="tel" /></Grid>
      </Grid>
      {outOfArea && (
        <Alert severity="warning" sx={{ mt: 1, borderRadius: `${tokens.radius.sm}px` }}>
          <b>{f.city} is outside our delivery area.</b> We deliver across the GTA, Hamilton &amp; Niagara. You can still order for pickup at our Mississauga cash &amp; carry.
        </Alert>
      )}
      <Stack direction={{ xs: 'column-reverse', sm: 'row' }} spacing={1.5} justifyContent="flex-end" sx={{ mt: 3 }}>
        {onCancel && <Button variant="outlined" color="inherit" onClick={onCancel} sx={{ borderColor: c.line2 }}>Cancel</Button>}
        <Button type="submit" variant="contained" size="large">{submitLabel}</Button>
      </Stack>
    </Box>
  )
}
