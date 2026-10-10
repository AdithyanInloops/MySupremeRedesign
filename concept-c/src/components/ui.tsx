import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { Badge, Box, Button, Drawer, IconButton, InputBase, Typography, type SxProps, type Theme } from '@mui/material'
import { tokens, focusRing, pressable, srOnly } from '../theme'
import { useApp } from '../state/app'
import { useDragScroll } from './useDragScroll'
import { money, pctOff, type Product } from '../data/catalog'
import {
  AlertCircleIcon, BoxIcon, CartIcon, CheckCircleIcon, ChevronLeftIcon, ChevronRightIcon, ClockIcon, CloseIcon, MinusIcon, PlusIcon, TrashIcon, TruckIcon,
  type IconComponent,
} from './icons'

const c = tokens.color

/* ------------------------------------------------------------------ Brand (Concept A lock-up) */

/** The real Supreme crown (cut from the live site's header logo), as a mask so it takes any colour. */
export function Crown({ size = 32, color = c.brandRed, fluid = false }: { size?: number; color?: string; fluid?: boolean }) {
  const mask = `url(${import.meta.env.BASE_URL}logo-crown.png) center / contain no-repeat`
  return <Box aria-hidden sx={{ width: fluid ? '100%' : size, aspectRatio: '213 / 120', flexShrink: 0, display: 'block', bgcolor: color, mask, WebkitMask: mask }} />
}

/** The real Supreme Cash & Carry logo from the live site; `inverse` keeps the red crown and turns the wordmark white. */
export function Logo({ inverse = false, size = 'md' }: { inverse?: boolean; size?: 'sm' | 'md' | 'lg' }) {
  const h = { sm: 40, md: 56, lg: 80 }[size]
  return <Box component="img" src={`${import.meta.env.BASE_URL}${inverse ? 'logo-inverse.png' : 'logo.png'}`} alt="Supreme Cash & Carry" sx={{ display: 'block', height: h, width: 'auto' }} />
}

/* ------------------------------------------------------------------ Product imagery */

/** Concept A placeholder: soft tint, crown watermark, brand monogram — reads as intentional in a grid of them. */
export function ProductPlaceholder({ brand, label, caption = true }: { brand?: string; label?: string; caption?: boolean }) {
  const initials = (brand ?? 'MS').split(/[\s-]+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase()
  return (
    <Box
      role="img"
      aria-label={label ? `${label}, photo coming soon` : 'Photo coming soon'}
      sx={{
        position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', containerType: 'size', overflow: 'hidden',
        background: `radial-gradient(120% 90% at 50% 0%, #FFFFFF 0%, ${c.surface2} 72%)`,
        '@container (max-width: 110px)': { '& .ph-cap': { display: 'none' }, '& .ph-mono': { width: 32, height: 32, fontSize: 11 } },
      }}
    >
      <Box sx={{ position: 'absolute', right: '-14%', bottom: '-12%', width: '78%', opacity: 0.06 }}><Crown fluid color={c.navy} /></Box>
      <Box sx={{ textAlign: 'center' }}>
        <Box className="ph-mono" sx={{ width: 52, height: 52, mx: 'auto', borderRadius: '50%', display: 'grid', placeItems: 'center', bgcolor: '#fff', border: `1px solid ${c.line}`, color: c.navy, fontWeight: 700, fontSize: 17, letterSpacing: '.04em', boxShadow: tokens.shadow.card }}>
          {initials}
        </Box>
        {caption && <Box className="ph-cap" sx={{ mt: 0.75, fontSize: 9.5, fontWeight: 600, letterSpacing: '.14em', color: c.text3, textTransform: 'uppercase' }}>Photo coming soon</Box>}
      </Box>
    </Box>
  )
}

export function ProductImage({ product, ratio = '1 / 1', radius = tokens.radius.sm, caption = true, sx }: { product: Product; ratio?: string; radius?: number; caption?: boolean; sx?: SxProps<Theme> }) {
  const src = product.images[0]
  const [loaded, setLoaded] = useState(false)
  return (
    <Box sx={{ position: 'relative', aspectRatio: ratio, width: '100%', borderRadius: `${radius}px`, overflow: 'hidden', bgcolor: c.surface2, ...((sx as object) ?? {}) }}>
      {src ? (
        <Box component="img" src={src} alt="" loading="lazy" onLoad={() => setLoaded(true)} sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: loaded ? 1 : 0, transition: 'opacity .3s' }} />
      ) : (
        <ProductPlaceholder brand={product.brand} label={product.name} caption={caption} />
      )}
    </Box>
  )
}

/* ------------------------------------------------------------------ Small data bits */

export function PackChip({ pack, size = 'sm' }: { pack: string; size?: 'sm' | 'md' }) {
  return (
    <Box component="span" title={`Pack size: ${pack}`} sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, maxWidth: '100%', px: size === 'sm' ? 0.75 : 1, py: 0.125, borderRadius: `${tokens.radius.xs}px`, bgcolor: c.navyTint, color: c.navy, fontSize: size === 'sm' ? 11 : 12.5, fontWeight: 600, lineHeight: 1.6 }}>
      <BoxIcon sx={{ fontSize: size === 'sm' ? 12 : 14, flexShrink: 0 }} />
      <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pack}</Box>
    </Box>
  )
}

export function Sku({ sku, sx }: { sku: string; sx?: SxProps<Theme> }) {
  return (
    <Typography component="span" title={`SKU ${sku}`} sx={{ fontFamily: tokens.font.mono, fontSize: 11, color: c.text3, letterSpacing: '.02em', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', ...((sx as object) ?? {}) }}>
      SKU {sku}
    </Typography>
  )
}

export type StatusKind = 'Pending' | 'Confirmed' | 'On the way' | 'Delivered' | 'Cancelled' | 'Paid' | 'Partial' | 'Overdue' | 'Open' | 'Accepted' | 'Applied'
const statusMap: Record<StatusKind, { fg: string; bg: string; icon: IconComponent }> = {
  Pending: { fg: c.warning, bg: c.warningTint, icon: ClockIcon },
  Confirmed: { fg: c.info, bg: c.infoTint, icon: CheckCircleIcon },
  'On the way': { fg: c.navy, bg: c.navyTint, icon: TruckIcon },
  Delivered: { fg: c.successText, bg: c.successTint, icon: CheckCircleIcon },
  Cancelled: { fg: c.text2, bg: c.surface2, icon: CloseIcon },
  Paid: { fg: c.successText, bg: c.successTint, icon: CheckCircleIcon },
  Partial: { fg: c.warning, bg: c.warningTint, icon: ClockIcon },
  Overdue: { fg: c.error, bg: c.errorTint, icon: AlertCircleIcon },
  Open: { fg: c.info, bg: c.infoTint, icon: ClockIcon },
  Accepted: { fg: c.successText, bg: c.successTint, icon: CheckCircleIcon },
  Applied: { fg: c.successText, bg: c.successTint, icon: CheckCircleIcon },
}

/** Status — colour + icon + text, never colour alone. */
export function StatusChip({ status }: { status: StatusKind }) {
  const s = statusMap[status]
  const Icon = s.icon
  return (
    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, height: 24, px: 1, borderRadius: `${tokens.radius.pill}px`, bgcolor: s.bg, color: s.fg, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
      <Icon sx={{ fontSize: 14 }} /> {status}
    </Box>
  )
}

/**
 * Price with business price, sale strike-through and "from" for configurable products. On cards (xs / sm) the guest
 * price a business price replaces is struck through inline, so every card keeps a single price row.
 */
export function Price({ product, size = 'md', offerPrice }: { product: Product; size?: 'xs' | 'sm' | 'md' | 'lg'; offerPrice?: number }) {
  const { signedIn, priceFor } = useApp()
  const final = offerPrice ?? priceFor(product)
  const isGroup = !offerPrice && signedIn && !!product.groupPrice
  const compact = size === 'xs' || size === 'sm'
  const was = offerPrice ? product.regular ?? product.price : product.regular ?? (isGroup && compact ? product.price : undefined)
  const off = offerPrice ? Math.round((1 - offerPrice / (was ?? offerPrice)) * 100) : pctOff(product)
  const fs = { xs: 13.5, sm: 15.5, md: 18, lg: 26 }[size]
  return (
    // relative: keeps the visually-hidden labels inside horizontal rails (an escaped abspos span widens the screen)
    <Box sx={{ minWidth: 0, position: 'relative' }}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, flexWrap: 'wrap' }}>
        {product.type === 'configurable' && <Typography component="span" sx={{ fontSize: fs * 0.62, color: c.text2, fontWeight: 500 }}>From</Typography>}
        <Typography component="span" sx={{ fontSize: fs, fontWeight: 700, color: isGroup ? c.successText : was ? c.red : c.ink, letterSpacing: '-.01em', lineHeight: 1.2, fontVariantNumeric: 'tabular-nums' }}>{isGroup && <Box component="span" sx={srOnly}>Your business price </Box>}{money(final)}</Typography>
        {was && <Typography component="span" sx={{ fontSize: Math.max(11, fs * 0.72), color: c.text3, textDecoration: 'line-through' }}><Box component="span" sx={srOnly}>{isGroup && !product.regular ? 'Guest' : 'Regular'} price </Box>{money(was)}</Typography>}
        {off > 0 && size === 'lg' && <Box component="span" sx={{ fontSize: 12, fontWeight: 700, color: c.red, bgcolor: c.redTint, px: 0.75, borderRadius: 1 }}>−{off}%</Box>}
      </Box>
      {isGroup && !compact && <Typography sx={{ fontSize: 12, color: c.successText, fontWeight: 600, mt: 0.25 }}>Your business price · guest price {money(product.price)}</Typography>}
      {product.unit && !compact && <Typography sx={{ fontSize: 11.5, color: c.text3, mt: 0.25 }}>{product.unit}</Typography>}
    </Box>
  )
}

/** Touch stepper. `removeAtMin` turns "−" into a bin at 1 (cart contexts). */
export function QtyStepper({ value, onChange, size = 'md', removeAtMin = false, label = 'Quantity', tone = 'light' }: { value: number; onChange: (v: number) => void; size?: 'sm' | 'md' | 'lg'; removeAtMin?: boolean; label?: string; tone?: 'light' | 'red' }) {
  const h = { sm: 36, md: 44, lg: 52 }[size]
  const red = tone === 'red'
  const btn = { width: h, height: h, borderRadius: 0, color: red ? '#fff' : c.ink, '&:hover': { bgcolor: red ? 'rgba(255,255,255,.12)' : c.surface2 }, '&.Mui-disabled': { color: red ? 'rgba(255,255,255,.4)' : c.line2 } } as const
  const [text, setText] = useState(String(value))
  useEffect(() => setText(String(value)), [value])
  const commit = () => { const n = parseInt(text, 10); if (Number.isNaN(n)) setText(String(value)); else if (n !== value) onChange(Math.max(removeAtMin ? 0 : 1, Math.min(999, n))) }
  const atMin = value <= 1
  return (
    <Box role="group" aria-label={label} sx={{ display: 'inline-flex', alignItems: 'center', height: h, borderRadius: `${tokens.radius.sm}px`, overflow: 'hidden', flexShrink: 0, bgcolor: red ? c.red : '#fff', border: red ? 'none' : `1.5px solid ${c.line2}` }}>
      {removeAtMin && atMin ? (
        <IconButton aria-label="Remove" onClick={() => onChange(0)} sx={btn}><TrashIcon sx={{ fontSize: 19 }} /></IconButton>
      ) : (
        <IconButton aria-label="Decrease quantity" disabled={atMin} onClick={() => onChange(value - 1)} sx={btn}><MinusIcon sx={{ fontSize: 19 }} /></IconButton>
      )}
      <InputBase
        value={text}
        onChange={(e) => setText(e.target.value.replace(/\D/g, '').slice(0, 3))}
        onBlur={commit}
        onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
        inputProps={{ 'aria-label': 'Quantity', inputMode: 'numeric', style: { textAlign: 'center', fontWeight: 700, padding: 0, color: red ? '#fff' : c.ink, fontVariantNumeric: 'tabular-nums' } }}
        sx={{ width: size === 'sm' ? 28 : 36, fontSize: size === 'sm' ? 14 : 16 }}
      />
      <IconButton aria-label="Increase quantity" onClick={() => onChange(value + 1)} disabled={value >= 999} sx={btn}><PlusIcon sx={{ fontSize: 19 }} /></IconButton>
    </Box>
  )
}

/* ------------------------------------------------------------------ Screen chrome */

/** iOS-style top bar: back, centred title, actions. `transparent` floats over a hero image. */
export function TopBar({ title, back = true, actions, transparent = false, onBack, subtitle }: { title?: ReactNode; back?: boolean | string; actions?: ReactNode; transparent?: boolean; onBack?: () => void; subtitle?: ReactNode }) {
  const navigate = useNavigate()
  const goBack = () => (onBack ? onBack() : typeof back === 'string' ? navigate(back) : window.history.length > 1 ? navigate(-1) : navigate('/'))
  const roundBtn = transparent ? { bgcolor: 'rgba(255,255,255,.92)', boxShadow: tokens.shadow.card, '&:hover': { bgcolor: '#fff' } } : {}
  return (
    <Box component="header" sx={{ position: 'sticky', top: 0, zIndex: 20, display: 'grid', gridTemplateColumns: '56px minmax(0,1fr) auto', alignItems: 'center', minHeight: 56, px: 0.5, pt: 'env(safe-area-inset-top)', bgcolor: transparent ? 'transparent' : 'rgba(255,255,255,.94)', backdropFilter: transparent ? 'none' : 'saturate(180%) blur(12px)', borderBottom: transparent ? 'none' : `1px solid ${c.line}` }}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        {back && <IconButton aria-label="Back" onClick={goBack} sx={{ width: 44, height: 44, color: c.ink, ...roundBtn }}><ChevronLeftIcon /></IconButton>}
      </Box>
      <Box sx={{ textAlign: 'center', minWidth: 0 }}>
        {title && <Typography component="h1" sx={{ fontSize: 16.5, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</Typography>}
        {subtitle && <Typography sx={{ fontSize: 12, color: c.text3, lineHeight: 1.2 }}>{subtitle}</Typography>}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', minWidth: 56, pr: 0.5, '& .MuiIconButton-root': roundBtn }}>{actions}</Box>
    </Box>
  )
}

/** Cart shortcut with live count, for full-screen flows that hide the tab bar (product page). */
export function CartButton({ sx }: { sx?: SxProps<Theme> }) {
  const { count } = useApp()
  return (
    <IconButton component={RouterLink} to="/cart" aria-label={count ? `Cart, ${count} items` : 'Cart'} sx={{ width: 40, height: 40, ...((sx as object) ?? {}) }}>
      <Badge badgeContent={count} max={99} sx={{ '& .MuiBadge-badge': { bgcolor: c.red, color: '#fff', fontWeight: 800, fontSize: 10.5, minWidth: 18, height: 18, px: 0.5, border: '2px solid #fff' } }}>
        <CartIcon sx={{ fontSize: 20 }} />
      </Badge>
    </IconButton>
  )
}

export function SectionHeader({ title, eyebrow, action, actionLabel, to, onAction }: { title: ReactNode; eyebrow?: string; action?: string; actionLabel?: string; to?: string; onAction?: () => void }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 1, px: 2, mb: 1.25 }}>
      <Box sx={{ minWidth: 0 }}>
        {eyebrow && <Typography variant="overline" component="p" sx={{ color: c.red, lineHeight: 1.4 }}>{eyebrow}</Typography>}
        <Typography component="h2" sx={{ fontSize: 18, fontWeight: 700, letterSpacing: '-.01em', lineHeight: 1.25 }}>{title}</Typography>
      </Box>
      {action && (to ? (
        <Button component={RouterLink} to={to} size="small" endIcon={<ChevronRightIcon sx={{ fontSize: '18px !important' }} />} sx={{ color: c.navy, flexShrink: 0, mr: -1 }}>{action}</Button>
      ) : (
        <Button onClick={onAction} aria-label={actionLabel} size="small" sx={{ color: c.navy, flexShrink: 0, mr: -1 }}>{action}</Button>
      ))}
    </Box>
  )
}

/** Horizontal swipe row with snap and edge padding. */
export function HScroll({ children, gap = 1.25, px = 2 }: { children: ReactNode; gap?: number; px?: number }) {
  const drag = useDragScroll<HTMLDivElement>()
  return (
    <Box className="no-scrollbar" {...drag} sx={{ display: 'flex', alignItems: 'stretch', gap, overflowX: 'auto', px, pb: 0.5, scrollSnapType: 'x mandatory', scrollPaddingInline: `${px * 8}px`, '& > *': { scrollSnapAlign: 'start', flexShrink: 0 } }}>
      {children}
    </Box>
  )
}

export function Card({ children, sx, onClick, to }: { children: ReactNode; sx?: SxProps<Theme>; onClick?: () => void; to?: string }) {
  const base = { display: 'block', bgcolor: '#fff', borderRadius: `${tokens.radius.md}px`, border: `1px solid ${c.line}`, textDecoration: 'none', color: 'inherit', ...((sx as object) ?? {}) }
  if (to) return <Box component={RouterLink} to={to} sx={{ ...base, ...pressable, ...focusRing }}>{children}</Box>
  if (onClick) return <Box component="button" onClick={onClick} sx={{ all: 'unset', boxSizing: 'border-box', cursor: 'pointer', width: '100%', ...base, ...pressable, ...focusRing }}>{children}</Box>
  return <Box sx={base}>{children}</Box>
}

/** Settings-style row (account menus): icon tile, title, subtitle, trailing value + chevron. */
export function ListRow({ icon: Icon, title, subtitle, trailing, to, onClick, tone = 'navy', danger = false }: { icon?: IconComponent; title: ReactNode; subtitle?: ReactNode; trailing?: ReactNode; to?: string; onClick?: () => void; tone?: 'navy' | 'red' | 'saffron' | 'green'; danger?: boolean }) {
  const tones = { navy: [c.navyTint, c.navy], red: [c.redTint, c.red], saffron: [c.saffronTint, '#8A5A00'], green: [c.successTint, c.successText] }[tone]
  const content = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minHeight: 60, px: 2, py: 1 }}>
      {Icon && <Box sx={{ width: 38, height: 38, borderRadius: `${tokens.radius.sm}px`, bgcolor: danger ? c.errorTint : tones[0], color: danger ? c.error : tones[1], display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon sx={{ fontSize: 20 }} /></Box>}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 15, fontWeight: 600, color: danger ? c.error : c.ink, lineHeight: 1.3 }}>{title}</Typography>
        {subtitle && <Typography sx={{ fontSize: 12.5, color: c.text3, lineHeight: 1.35 }}>{subtitle}</Typography>}
      </Box>
      {trailing}
      {(to || onClick) && !danger && <ChevronRightIcon sx={{ fontSize: 20, color: c.text4, flexShrink: 0 }} />}
    </Box>
  )
  const sx = { display: 'block', width: '100%', color: 'inherit', textDecoration: 'none', '&:active': { bgcolor: c.surface2 }, ...focusRing } as const
  if (to) return <Box component={RouterLink} to={to} sx={sx}>{content}</Box>
  if (onClick) return <Box component="button" onClick={onClick} sx={{ all: 'unset', boxSizing: 'border-box', cursor: 'pointer', ...sx }}>{content}</Box>
  return content
}

export function Group({ children, title, sx }: { children: ReactNode; title?: string; sx?: SxProps<Theme> }) {
  return (
    <Box sx={{ px: 2, ...((sx as object) ?? {}) }}>
      {title && <Typography variant="overline" component="h2" sx={{ display: 'block', color: c.text3, px: 0.5, mb: 0.75 }}>{title}</Typography>}
      <Box sx={{ bgcolor: '#fff', borderRadius: `${tokens.radius.md}px`, border: `1px solid ${c.line}`, overflow: 'hidden', '& > * + *': { borderTop: `1px solid ${c.line}` } }}>{children}</Box>
    </Box>
  )
}

export function Segmented<T extends string>({ value, onChange, options, label }: { value: T; onChange: (v: T) => void; options: { value: T; label: ReactNode }[]; label: string }) {
  return (
    <Box role="radiogroup" aria-label={label} sx={{ display: 'grid', gridTemplateColumns: `repeat(${options.length}, minmax(0,1fr))`, p: 0.5, gap: 0.5, bgcolor: c.surface2, borderRadius: `${tokens.radius.sm + 2}px` }}>
      {options.map((o) => {
        const on = o.value === value
        return (
          <Box key={o.value} component="button" role="radio" aria-checked={on} onClick={() => onChange(o.value)}
            sx={{ all: 'unset', boxSizing: 'border-box', cursor: 'pointer', textAlign: 'center', minHeight: 40, px: 1, borderRadius: `${tokens.radius.sm}px`, fontSize: 14, fontWeight: 600, color: on ? c.ink : c.text2, bgcolor: on ? '#fff' : 'transparent', boxShadow: on ? tokens.shadow.card : 'none', transition: `background-color ${tokens.motion.fast}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.75, ...focusRing }}>
            {o.label}
          </Box>
        )
      })}
    </Box>
  )
}

/** Filter / sort chips. */
export function Pill({ active, onClick, children, icon: Icon, tone = 'navy' }: { active?: boolean; onClick: () => void; children: ReactNode; icon?: IconComponent; tone?: 'navy' | 'green' }) {
  const on = tone === 'green' ? '#3B7A57' : c.navy
  return (
    <Box component="button" onClick={onClick} aria-pressed={!!active}
      sx={{ all: 'unset', boxSizing: 'border-box', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 0.75, minHeight: 36, px: 1.75, borderRadius: `${tokens.radius.pill}px`, whiteSpace: 'nowrap', fontSize: 13.5, fontWeight: 600, border: `1.5px solid ${active ? on : c.line2}`, bgcolor: active ? on : '#fff', color: active ? '#fff' : c.ink, ...pressable, transition: `background-color ${tokens.motion.fast}, transform ${tokens.motion.fast}`, ...focusRing }}>
      {Icon && <Icon sx={{ fontSize: 17 }} />}{children}
    </Box>
  )
}

export function EmptyState({ icon: Icon, title, body, action, to, onAction }: { icon: IconComponent; title: string; body: string; action?: string; to?: string; onAction?: () => void }) {
  return (
    <Box sx={{ textAlign: 'center', px: 4, py: 6 }}>
      <Box sx={{ width: 76, height: 76, mx: 'auto', borderRadius: '50%', bgcolor: c.navyTint, color: c.navy, display: 'grid', placeItems: 'center', mb: 2 }}><Icon sx={{ fontSize: 34 }} /></Box>
      <Typography component="h2" sx={{ fontSize: 18, fontWeight: 700 }}>{title}</Typography>
      <Typography sx={{ color: c.text2, mt: 0.75, fontSize: 14.5 }}>{body}</Typography>
      {action && (to ? <Button component={RouterLink} to={to} variant="contained" size="large" sx={{ mt: 2.5 }}>{action}</Button> : <Button onClick={onAction} variant="contained" size="large" sx={{ mt: 2.5 }}>{action}</Button>)}
    </Box>
  )
}

/** Bottom sheet with grabber, title and optional sticky footer. Scoped to the phone column by the theme. */
export function Sheet({ open, onClose, title, children, footer }: { open: boolean; onClose: () => void; title?: ReactNode; children: ReactNode; footer?: ReactNode }) {
  return (
    <Drawer anchor="bottom" open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: `${tokens.radius.lg}px ${tokens.radius.lg}px 0 0`, maxHeight: '88%', display: 'flex', flexDirection: 'column', boxShadow: tokens.shadow.sheet } }}>
      <Box sx={{ pt: 1, pb: 0.5, display: 'grid', placeItems: 'center', flexShrink: 0 }}><Box sx={{ width: 40, height: 5, borderRadius: 3, bgcolor: c.line2 }} /></Box>
      {title && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, pb: 1, flexShrink: 0 }}>
          <Typography component="h2" sx={{ fontSize: 18, fontWeight: 700 }}>{title}</Typography>
          <IconButton aria-label="Close" onClick={onClose} sx={{ mr: -1 }}><CloseIcon /></IconButton>
        </Box>
      )}
      <Box sx={{ overflowY: 'auto', px: 2, pb: footer ? 1 : 'calc(16px + env(safe-area-inset-bottom))', flex: 1 }}>{children}</Box>
      {footer && <Box sx={{ px: 2, pt: 1.25, pb: 'calc(12px + env(safe-area-inset-bottom))', borderTop: `1px solid ${c.line}`, flexShrink: 0 }}>{footer}</Box>}
    </Drawer>
  )
}

/**
 * Sticky action bar pinned to the bottom of the phone column (product, cart, checkout). Portalled into #app-shell so
 * screen transitions never move it; renders its own spacer so content can scroll clear of it.
 */
export function BottomBar({ children, aboveTabs = false }: { children: ReactNode; aboveTabs?: boolean }) {
  const [host, setHost] = useState<HTMLElement | null>(null)
  useEffect(() => setHost(document.getElementById('app-shell')), [])
  const bar = (
    <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: aboveTabs ? `calc(${tokens.tabBarHeight}px + env(safe-area-inset-bottom))` : 0, zIndex: 30, bgcolor: 'rgba(255,255,255,.97)', backdropFilter: 'blur(12px)', boxShadow: aboveTabs ? `0 -1px 0 ${c.line}` : tokens.shadow.bar, px: 2, pt: 1.25, pb: aboveTabs ? 1.25 : 'calc(12px + env(safe-area-inset-bottom))' }}>
      {children}
    </Box>
  )
  return (
    <>
      <Box aria-hidden sx={{ height: aboveTabs ? 84 : 104 }} />
      {host ? createPortal(bar, host) : null}
    </>
  )
}
