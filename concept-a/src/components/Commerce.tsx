import { useEffect, useRef, useState } from 'react'
import {
  Box, Button, ButtonBase, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, InputBase, MenuItem,
  Stack, TextField, Typography, Link, Skeleton, type SxProps, type Theme,
} from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import AddRounded from '@mui/icons-material/AddRounded'
import RemoveRounded from '@mui/icons-material/RemoveRounded'
import AddShoppingCartRounded from '@mui/icons-material/AddShoppingCartRounded'
import CheckRounded from '@mui/icons-material/CheckRounded'
import StarRounded from '@mui/icons-material/StarRounded'
import StarBorderRounded from '@mui/icons-material/StarBorderRounded'
import FavoriteRounded from '@mui/icons-material/FavoriteRounded'
import FavoriteBorderRounded from '@mui/icons-material/FavoriteBorderRounded'
import TuneRounded from '@mui/icons-material/TuneRounded'
import LockOutlined from '@mui/icons-material/LockOutlined'
import ChevronLeftRounded from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded'
import { tokens } from '../theme'
import { money, pctOff, type Product } from '../data/catalog'
import { useApp } from '../state/AppState'
import { ProductImage } from './Brand'
import { NameDialog, PackChip, Sheet, Sku } from './ui'

const c = tokens.color

/* ------------------------------------------------------------------ Price */

export function Price({ product, size = 'md', showUnit = true }: { product: Product; size?: 'sm' | 'md' | 'lg'; showUnit?: boolean }) {
  const { review, priceFor } = useApp()
  const final = priceFor(product)
  const isGroup = review.signedIn && !!product.groupPrice
  const off = pctOff(product)
  const fs = { sm: 16, md: 19, lg: 30 }[size]
  return (
    <Box>
      <Stack direction="row" alignItems="baseline" spacing={0.75} flexWrap="wrap" useFlexGap>
        {product.type === 'configurable' && (
          <Typography component="span" sx={{ fontSize: fs * 0.62, color: c.text2, fontWeight: 500 }}>From</Typography>
        )}
        <Typography component="span" sx={{ fontSize: fs, fontWeight: 700, color: product.regular ? c.red : c.ink, letterSpacing: '-.01em', lineHeight: 1.2 }}>
          {money(final)}
        </Typography>
        {product.regular && (
          <Typography component="span" sx={{ fontSize: fs * 0.66, color: c.text3, textDecoration: 'line-through' }} aria-label={`Regular price ${money(product.regular)}`}>
            {money(product.regular)}
          </Typography>
        )}
        {off > 0 && size !== 'sm' && (
          <Box component="span" sx={{ fontSize: 11, fontWeight: 700, color: c.red, bgcolor: c.redTint, px: 0.75, borderRadius: 1 }}>
            −{off}%
          </Box>
        )}
      </Stack>
      {isGroup && (
        <Typography sx={{ fontSize: 11.5, color: c.successText, fontWeight: 600, mt: 0.25 }}>
          Your business price · was {money(product.price)}
        </Typography>
      )}
      {!review.signedIn && product.groupPrice && (
        <Link component={RouterLink} to="/account/signin" sx={{ fontSize: 11.5, color: c.navy, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 0.25, mt: 0.25 }}>
          <LockOutlined sx={{ fontSize: 13 }} /> Sign in for business price
        </Link>
      )}
      {showUnit && product.unit && (
        <Typography sx={{ fontSize: 11.5, color: c.text3, mt: 0.25 }} title="Per-unit price — new feature (needs unit-count attribute)">
          {product.unit}
          <Box component="span" sx={{ ml: 0.5, color: '#7E22CE', fontWeight: 700 }}>✦</Box>
        </Typography>
      )}
    </Box>
  )
}

/* ------------------------------------------------------------------ Rating */

export function Rating({ value, count, size = 15 }: { value: number; count: number; size?: number }) {
  if (!count) return <Typography sx={{ fontSize: 12, color: c.text3 }}>No reviews yet</Typography>
  return (
    <Stack direction="row" alignItems="center" spacing={0.5} aria-label={`${value} out of 5 stars, ${count} reviews`}>
      <Stack direction="row" sx={{ color: '#E89B00' }}>
        {[1, 2, 3, 4, 5].map((i) => (i <= Math.round(value) ? <StarRounded key={i} sx={{ fontSize: size }} /> : <StarBorderRounded key={i} sx={{ fontSize: size }} />))}
      </Stack>
      <Typography sx={{ fontSize: 12, color: c.text2 }}>
        {value.toFixed(1)} ({count})
      </Typography>
    </Stack>
  )
}

/* ------------------------------------------------------------------ Quantity stepper */

/** Tap-to-type quantity: a small dialog with a numeric field, so "20" is typed once instead of tapped 16 times. */
function QtyDialog({ value, label, onClose, onConfirm }: { value: number; label: string; onClose: () => void; onConfirm: (v: number) => void }) {
  const [v, setV] = useState(String(value))
  const n = parseInt(v, 10)
  const ok = n >= 1 && n <= 99
  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); if (ok) { onConfirm(n); onClose() } }}>
        <DialogTitle sx={{ fontWeight: 700, pb: 0.5 }}>Enter quantity</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: 13.5, color: c.text2, mb: 2 }}>{label}</Typography>
          <TextField autoFocus fullWidth value={v} onChange={(e) => setV(e.target.value.replace(/\D/g, '').slice(0, 3))} onFocus={(e) => e.target.select()}
            error={v !== '' && !ok} helperText={v !== '' && !ok ? 'Enter 1–99. For more, call us for a quote.' : ' '}
            inputProps={{ inputMode: 'numeric', 'aria-label': label, style: { fontSize: 22, fontWeight: 700, textAlign: 'center' } }} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, pt: 0, gap: 1 }}>
          <Button onClick={onClose} sx={{ color: c.text2 }}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={!ok}>Confirm</Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

/** `typeIn`: the number is a button that opens a numeric dialog. `min={0}` lets − reach 0 (caller removes the line). */
export function QtyStepper({ value, onChange, size = 'md', disabled, label = 'Quantity', typeIn = false, min = 1 }: { value: number; onChange: (v: number) => void; size?: 'sm' | 'md'; disabled?: boolean; label?: string; typeIn?: boolean; min?: number }) {
  const h = size === 'sm' ? 40 : 48
  const [typing, setTyping] = useState(false)
  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{ border: `1.5px solid ${c.line2}`, borderRadius: `${tokens.radius.sm}px`, height: h, bgcolor: disabled ? c.surface2 : '#fff', flexShrink: 0, '&:focus-within': { borderColor: c.navy } }}
    >
      <IconButton aria-label="Decrease quantity" disabled={disabled || value <= min} onClick={() => onChange(value - 1)} sx={{ width: 44, height: h - 3, borderRadius: `${tokens.radius.sm}px 0 0 ${tokens.radius.sm}px` }}>
        <RemoveRounded fontSize="small" />
      </IconButton>
      {typeIn ? (
        <ButtonBase disabled={disabled} onClick={() => setTyping(true)} aria-label={`${label}: ${value}. Tap to type a quantity`}
          sx={{ minWidth: size === 'sm' ? 30 : 40, height: h - 3, fontFamily: 'inherit', fontWeight: 600, fontSize: 15, color: c.ink, '&:hover': { color: c.navy, textDecoration: 'underline' } }}>
          {value}
        </ButtonBase>
      ) : <InputBase
        value={value}
        disabled={disabled}
        onChange={(e) => {
          const v = parseInt(e.target.value.replace(/\D/g, '') || '1', 10)
          onChange(v)
        }}
        inputProps={{ 'aria-label': label, inputMode: 'numeric', style: { textAlign: 'center', fontWeight: 600, padding: 0 } }}
        sx={{ width: size === 'sm' ? 30 : 40, fontSize: 15 }}
      />}
      <IconButton aria-label="Increase quantity" disabled={disabled} onClick={() => onChange(value + 1)} sx={{ width: 44, height: h - 3, borderRadius: `0 ${tokens.radius.sm}px ${tokens.radius.sm}px 0` }}>
        <AddRounded fontSize="small" />
      </IconButton>
      {typing && <QtyDialog value={value} label={label} onClose={() => setTyping(false)} onConfirm={onChange} />}
    </Stack>
  )
}

/* ------------------------------------------------------------------ Qty + Add to cart */

type AddState = 'idle' | 'adding' | 'added'

/** `stackXs` puts the stepper above the button below 500px so 2-up mobile grids never clip. */
export function AddToCart({ product, size = 'md', fullWidth = true, compact = false, stackXs = false }: { product: Product; size?: 'sm' | 'md' | 'lg'; fullWidth?: boolean; compact?: boolean; stackXs?: boolean }) {
  const { addToCart } = useApp()
  const navigate = useNavigate()
  const [qty, setQty] = useState(1)
  const [state, setState] = useState<AddState>('idle')
  const t = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(t.current), [])
  const oos = product.stock === 'OUT_OF_STOCK'
  const needsChoice = product.type !== 'simple'

  if (needsChoice) {
    return (
      <Button
        variant="outlined"
        color="secondary"
        fullWidth={fullWidth}
        size={size === 'lg' ? 'large' : size === 'sm' ? 'small' : 'medium'}
        startIcon={<TuneRounded />}
        onClick={() => navigate(`/p/${product.slug}`)}
        sx={{ minHeight: size === 'sm' ? 40 : 44 }}
      >
        {compact ? 'Options' : 'View options'}
      </Button>
    )
  }

  const click = () => {
    setState('adding')
    t.current = window.setTimeout(() => {
      addToCart(product.sku, qty)
      setState('added')
      t.current = window.setTimeout(() => {
        setState('idle')
        setQty(1)
      }, 1400)
    }, 650)
  }

  return (
    <Stack
      direction={stackXs ? { xs: 'column', sm: 'row' } : 'row'}
      spacing={1}
      sx={{ width: fullWidth ? '100%' : 'auto', ...(stackXs ? { '& > div:first-of-type': { width: { xs: '100%', sm: 'auto' }, justifyContent: 'space-between' } } : {}) }}
    >
      <QtyStepper value={qty} onChange={setQty} size={size === 'lg' ? 'md' : 'sm'} disabled={oos} label={`Quantity for ${product.name}`} />
      <Button
        variant="contained"
        color={state === 'added' ? 'success' : 'primary'}
        disabled={oos || state === 'adding'}
        onClick={click}
        aria-live="polite"
        sx={{
          flex: 1, minWidth: 0, minHeight: size === 'lg' ? 48 : 40, px: compact ? 1 : 2, whiteSpace: 'nowrap',
          '&.Mui-disabled': oos ? { bgcolor: c.surface2, color: c.text3 } : { bgcolor: c.red, color: '#fff', opacity: 0.85 },
        }}
        startIcon={
          state === 'adding' ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : state === 'added' ? <CheckRounded /> : <AddShoppingCartRounded />
        }
        aria-label={oos ? `${product.name} out of stock` : `Add ${qty} ${product.name} to cart`}
      >
        {/* Compact keeps "Add" while adding so the narrow button doesn't change width. */}
        {oos ? (compact ? 'Sold out' : 'Out of stock') : state === 'adding' && !compact ? 'Adding…' : state === 'added' ? 'Added' : 'Add'}
      </Button>
    </Stack>
  )
}

/* ------------------------------------------------------------------ Save to list (heart) */

const inList = (items: { sku: string }[], sku: string) => items.some((i) => i.sku === sku)

/** "Save to:" checklist of the customer's lists, used in the heart's sheet / popover. */
export function SaveToPanel({ sku, onNew }: { sku: string; onNew: () => void }) {
  const { lists, updateList } = useApp()
  return (
    <Box role="group" aria-label="Save to list">
      {lists.map((l) => {
        const on = inList(l.items, sku)
        return (
          <MenuItem key={l.id} onClick={() => updateList(l.id, (items) => (on ? items.filter((i) => i.sku !== sku) : [...items, { sku, qty: 1 }]))}
            role="menuitemcheckbox" aria-checked={on} sx={{ minHeight: 48, px: 1.5, gap: 0.5 }}>
            <Checkbox checked={on} tabIndex={-1} disableRipple sx={{ p: 0.75, color: c.line2 }} inputProps={{ 'aria-hidden': true }} />
            <Box component="span" sx={{ fontSize: 14.5, fontWeight: on ? 600 : 500 }}>{l.name}</Box>
          </MenuItem>
        )
      })}
      <Divider sx={{ my: 0.5 }} />
      <MenuItem onClick={onNew} sx={{ minHeight: 48, px: 2.25, gap: 1.25, color: c.red, fontWeight: 600, fontSize: 14.5 }}>
        <AddRounded sx={{ fontSize: 20 }} /> New list
      </MenuItem>
    </Box>
  )
}

/** Save heart. Saves to Favourites with the snackbar "Saved to Favourites"; with several lists the snackbar has "Change",
 *  which (like tapping a filled heart) opens the "Save to:" checklist. */
export function WishlistButton({ sku, sx, size = 'md' }: { sku: string; sx?: SxProps<Theme>; size?: 'sm' | 'md' }) {
  const { lists, updateList, createList, review, toast } = useApp()
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const [naming, setNaming] = useState(false)
  const btn = useRef<HTMLButtonElement>(null)
  const on = lists.some((l) => inList(l.items, sku))
  const many = lists.length > 1
  const click = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!review.signedIn) return toast('Sign in to save products to your lists', 'info', { label: 'Sign in', href: '/account/signin' })
    const fav = lists[0]
    if (many) {
      if (on) return setAnchor(e.currentTarget)
      updateList(fav.id, (items) => [...items, { sku, qty: 1 }])
      return toast(`Saved to ${fav.name}`, 'success', { label: 'Change', onClick: () => setAnchor(btn.current) }, { sku })
    }
    updateList(fav.id, (items) => (on ? items.filter((i) => i.sku !== sku) : [...items, { sku, qty: 1 }]))
    toast(on ? `Removed from ${fav.name}` : `Saved to ${fav.name}`, on ? 'info' : 'success', undefined, { sku })
  }
  const fs = size === 'sm' ? 22 : 24
  return (
    <>
      <IconButton
        ref={btn}
        aria-label={many && on ? 'Change lists' : on ? 'Remove from Favourites' : 'Save to Favourites'}
        aria-pressed={many ? undefined : on}
        aria-haspopup={many ? 'dialog' : undefined}
        onClick={click}
        sx={{
          width: 44, height: 44, bgcolor: 'rgba(255,255,255,.92)', backdropFilter: 'blur(4px)', color: on ? c.red : c.text2,
          border: `1px solid ${c.line}`, '&:hover': { bgcolor: '#fff', color: c.red }, ...((sx as object) ?? {}),
        }}
      >
        {on ? <FavoriteRounded sx={{ fontSize: fs }} /> : <FavoriteBorderRounded sx={{ fontSize: fs }} />}
      </IconButton>
      {many && (
        <Sheet anchor={anchor} open={!!anchor} onClose={() => setAnchor(null)} title="Save to:">
          <SaveToPanel sku={sku} onNew={() => { setAnchor(null); setNaming(true) }} />
        </Sheet>
      )}
      <NameDialog open={naming} onClose={() => setNaming(false)} title="Create new list" placeholder="e.g. Weekly Order" taken={lists.map((l) => l.name)}
        onSave={(name) => { createList(name, [{ sku, qty: 1 }]); toast(`Saved to ${name}`, 'success', undefined, { sku }) }} />
    </>
  )
}

/* ------------------------------------------------------------------ Stock label */

export function StockLabel({ stock }: { stock: Product['stock'] }) {
  const map = {
    IN_STOCK: { t: 'In stock', col: c.successText, dot: c.success },
    LOW_STOCK: { t: 'Low stock', col: c.warning, dot: '#F59E0B' },
    OUT_OF_STOCK: { t: 'Out of stock', col: c.error, dot: c.error },
  }[stock]
  return (
    <Stack direction="row" alignItems="center" spacing={0.75} sx={{ fontSize: 12, fontWeight: 600, color: map.col }}>
      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: map.dot }} />
      <span>{map.t}</span>
    </Stack>
  )
}

/* ------------------------------------------------------------------ Product card */

export type CardVariant = 'grid' | 'carousel' | 'list'

function Badges({ product }: { product: Product }) {
  const off = pctOff(product)
  return (
    <Stack spacing={0.5} sx={{ position: 'absolute', top: 10, left: 10, zIndex: 1, alignItems: 'flex-start' }}>
      {off > 0 && <Box sx={{ bgcolor: c.red, color: '#fff', fontSize: 11.5, fontWeight: 700, px: 1, py: 0.25, borderRadius: 1 }}>−{off}%</Box>}
      {product.isNew && <Box sx={{ bgcolor: c.navy, color: '#fff', fontSize: 11, fontWeight: 700, px: 1, py: 0.25, borderRadius: 1, letterSpacing: '.04em' }}>NEW</Box>}
    </Stack>
  )
}

export function ProductCard({ product, variant = 'grid', sx }: { product: Product; variant?: CardVariant; sx?: SxProps<Theme> }) {
  const href = `/p/${product.slug}`
  const oos = product.stock === 'OUT_OF_STOCK'
  const aria = `${product.name}, ${product.pack}, ${money(product.price)}`

  if (variant === 'list') {
    return (
      <Box
        component="article"
        aria-label={aria}
        sx={{
          display: 'grid', alignItems: 'center', gap: { xs: 1.5, md: 2.5 }, p: { xs: 1.5, md: 2 },
          gridTemplateColumns: { xs: '84px 1fr', md: '96px minmax(0,1fr) 170px 250px' },
          bgcolor: '#fff', border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.md}px`,
          transition: 'box-shadow .2s, border-color .2s', '&:hover': { boxShadow: tokens.shadow.hover, borderColor: c.line2 }, ...((sx as object) ?? {}),
        }}
      >
        <Box component={RouterLink} to={href} sx={{ display: 'block', opacity: oos ? 0.6 : 1 }}>
          <ProductImage src={product.images[0]} alt={product.name} brand={product.brand} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5, minWidth: 0 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: c.navy, whiteSpace: 'nowrap' }}>{product.brand}</Typography>
            <Sku sku={product.sku} />
          </Stack>
          <Link component={RouterLink} to={href} underline="hover" title={product.name}
            sx={{ color: c.ink, fontWeight: 600, fontSize: 14.5, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.name}
          </Link>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.75 }}>
            <PackChip pack={product.pack} size="sm" />
            <StockLabel stock={product.stock} />
          </Stack>
          <Box sx={{ display: { md: 'none' }, mt: 1 }}>
            <Price product={product} size="sm" />
            <Box sx={{ mt: 1 }}><AddToCart product={product} size="sm" /></Box>
          </Box>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'block' } }}><Price product={product} /></Box>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
          <AddToCart product={product} size="sm" />
          <WishlistButton sku={product.sku} size="sm" />
        </Stack>
      </Box>
    )
  }

  const narrow = variant === 'carousel'
  return (
    <Box
      component="article"
      aria-label={aria}
      sx={{
        position: 'relative', display: 'flex', flexDirection: 'column', height: '100%',
        bgcolor: '#fff', border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.md}px`, p: { xs: 1.25, md: 1.5 },
        transition: 'box-shadow .22s, transform .22s, border-color .22s',
        '&:hover': { boxShadow: tokens.shadow.hover, borderColor: 'transparent', transform: 'translateY(-2px)' },
        '&:hover .pc-img img': { transform: 'scale(1.04)' },
        ...((sx as object) ?? {}),
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Badges product={product} />
        <WishlistButton sku={product.sku} size="sm" sx={{ position: 'absolute', top: 6, right: 6, zIndex: 1 }} />
        <Box component={RouterLink} to={href} className="pc-img" tabIndex={-1} aria-hidden
          sx={{ display: 'block', '& img': { transition: 'transform .35s ease' }, opacity: oos ? 0.55 : 1, filter: oos ? 'grayscale(.6)' : 'none' }}>
          <ProductImage src={product.images[0]} alt={product.name} brand={product.brand} />
        </Box>
        {oos && (
          <Box sx={{ position: 'absolute', left: 8, right: 8, bottom: 8, bgcolor: 'rgba(17,24,39,.82)', color: '#fff', textAlign: 'center', fontSize: 12, fontWeight: 600, py: 0.5, borderRadius: 1 }}>
            Out of stock · back soon
          </Box>
        )}
      </Box>
      <Box sx={{ pt: 1.25, display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        <Stack direction="row" justifyContent="space-between" spacing={1} sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: c.navy, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.brand}</Typography>
        </Stack>
        <Link
          component={RouterLink}
          to={href}
          underline="none"
          title={product.name}
          sx={{
            color: c.ink, fontWeight: 600, fontSize: narrow ? 13.5 : 14, lineHeight: 1.4, mt: 0.25,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.8em',
            '&:hover': { color: c.red },
          }}
        >
          {product.name}
        </Link>
        <Sku sku={product.sku} sx={{ mt: 0.5 }} />
        <Box sx={{ mt: 1 }}><PackChip pack={product.pack} size="sm" /></Box>
        <Box sx={{ mt: 'auto', pt: 1.25 }}>
          <Price product={product} size={narrow ? 'sm' : 'md'} />
          <Box sx={{ mt: 1.25 }}>
            <AddToCart product={product} size="sm" compact={narrow} stackXs />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export function ProductCardSkeleton({ variant = 'grid' }: { variant?: CardVariant }) {
  if (variant === 'list')
    return (
      <Stack direction="row" spacing={2} sx={{ p: 2, bgcolor: '#fff', border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.md}px` }}>
        <Skeleton variant="rounded" width={96} height={96} />
        <Box sx={{ flex: 1 }}><Skeleton width="30%" /><Skeleton width="80%" /><Skeleton width="20%" /></Box>
      </Stack>
    )
  return (
    <Box sx={{ p: 1.5, bgcolor: '#fff', border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.md}px` }} aria-busy>
      <Skeleton variant="rounded" sx={{ aspectRatio: '1/1', height: 'auto', width: '100%' }} />
      <Skeleton width="40%" sx={{ mt: 1.5 }} />
      <Skeleton width="95%" />
      <Skeleton width="70%" />
      <Skeleton width="35%" height={30} sx={{ mt: 1 }} />
      <Skeleton variant="rounded" height={40} sx={{ mt: 1 }} />
    </Box>
  )
}

/* ------------------------------------------------------------------ Product grid & rail */

export function ProductGrid({ items, loading, cols = { xs: 2, md: 3, lg: 4, xl: 5 } }: { items: Product[]; loading?: boolean; cols?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', number>> }) {
  const tpl = Object.fromEntries(Object.entries(cols).map(([k, v]) => [k, `repeat(${v}, minmax(0,1fr))`]))
  return (
    <Box sx={{ display: 'grid', gap: { xs: 1.25, md: 2 }, gridTemplateColumns: tpl }}>
      {loading ? Array.from({ length: 10 }).map((_, i) => <ProductCardSkeleton key={i} />) : items.map((p) => <ProductCard key={p.sku} product={p} />)}
    </Box>
  )
}

/** Horizontal product rail — CSS scroll-snap + arrow buttons (maps to Swiper in the build). */
export function ProductRail({ items, loading }: { items: Product[]; loading?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const [edge, setEdge] = useState({ start: true, end: false })
  const update = () => {
    const el = ref.current
    if (!el) return
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 })
  }
  useEffect(() => { update() }, [items.length])
  const go = (dir: number) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.85, behavior: 'smooth' })
  const arrow = (dir: number, disabled: boolean) => (
    <IconButton
      aria-label={dir < 0 ? 'Previous products' : 'Next products'}
      onClick={() => go(dir)}
      disabled={disabled}
      sx={{
        display: { xs: 'none', md: 'inline-flex' }, position: 'absolute', top: '32%', [dir < 0 ? 'left' : 'right']: -20, zIndex: 2,
        width: 44, height: 44, bgcolor: '#fff', boxShadow: tokens.shadow.hover, border: `1px solid ${c.line}`,
        '&:hover': { bgcolor: '#fff', color: c.red }, '&.Mui-disabled': { opacity: 0, pointerEvents: 'none' },
      }}
    >
      {dir < 0 ? <ChevronLeftRounded /> : <ChevronRightRounded />}
    </IconButton>
  )
  return (
    <Box sx={{ position: 'relative' }}>
      {arrow(-1, edge.start)}
      <Box
        ref={ref}
        onScroll={update}
        className="no-scrollbar"
        sx={{
          display: 'grid', gridAutoFlow: 'column', gap: { xs: 1.25, md: 2 }, overflowX: 'auto', scrollSnapType: 'x mandatory',
          gridAutoColumns: { xs: '46%', sm: '31%', md: '23.5%', lg: '18.8%', xl: '15.8%' },
          mx: { xs: -2, md: 0 }, px: { xs: 2, md: 0 }, scrollPaddingInline: { xs: 16, md: 0 }, pb: 0.5,
          '& > *': { scrollSnapAlign: 'start' },
        }}
      >
        {loading ? Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />) : items.map((p) => <ProductCard key={p.sku} product={p} variant="carousel" />)}
      </Box>
      {arrow(1, edge.end)}
    </Box>
  )
}
