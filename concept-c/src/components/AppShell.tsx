import { useEffect, useLayoutEffect, useRef } from 'react'
import { Link as RouterLink, Navigate, Outlet, matchPath, useLocation, useNavigationType } from 'react-router-dom'
import { Badge, Box, Button, IconButton, Typography } from '@mui/material'
import { tokens, focusRing } from '../theme'
import { useApp } from '../state/app'
import {
  CartFilledIcon, CartIcon, CategoryFilledIcon, CategoryIcon, CheckCircleIcon, CloseIcon, HomeFilledIcon, HomeIcon, InfoIcon, MoreCircleFilledIcon, MoreCircleIcon,
  StarIcon, StarOutlineIcon, type IconComponent,
} from './icons'

const c = tokens.color

type Tab = { to: string; label: string; icon: IconComponent; active: IconComponent; match: string[] }
/** The current MySupreme app's tabs. Orders, flyers, invoices and settings live under More. */
const TABS: Tab[] = [
  { to: '/', label: 'Home', icon: HomeIcon, active: HomeFilledIcon, match: ['/', '/notifications'] },
  { to: '/shop', label: 'Category', icon: CategoryIcon, active: CategoryFilledIcon, match: ['/shop', '/shop/:dept', '/search'] },
  { to: '/cart', label: 'Cart', icon: CartIcon, active: CartFilledIcon, match: ['/cart'] },
  { to: '/favorites', label: 'Favourites', icon: StarOutlineIcon, active: StarIcon, match: ['/favorites'] },
  { to: '/account', label: 'More', icon: MoreCircleIcon, active: MoreCircleFilledIcon, match: ['/account', '/account/*', '/help', '/orders', '/deals', '/cms'] },
]
/** Full-screen flows hide the tab bar; these screens carry their own bottom action bar. */
const NO_TABS = ['/p/:slug', '/orders/:number', '/checkout', '/order-placed/:number', '/scan', '/quick-order', '/welcome', '/signin']
const OWN_BAR = ['/p/:slug', '/orders/:number', '/cart', '/checkout']
const PUBLIC = ['/welcome', '/signin']
const matches = (patterns: string[], path: string) => patterns.some((p) => matchPath({ path: p, end: true }, path))

function TabBar({ path }: { path: string }) {
  const { count } = useApp()
  return (
    <Box component="nav" aria-label="Main" sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 40, bgcolor: 'rgba(255,255,255,.97)', backdropFilter: 'blur(14px)', boxShadow: tokens.shadow.bar, pb: 'env(safe-area-inset-bottom)' }}>
      <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0,1fr))', height: tokens.tabBarHeight }}>
        {TABS.map((t) => {
          const on = matches(t.match, path)
          const Icon = on ? t.active : t.icon
          const cart = t.to === '/cart'
          return (
            <li key={t.to}>
              <Box component={RouterLink} to={t.to} aria-current={on ? 'page' : undefined} aria-label={cart && count ? `Cart, ${count} items` : undefined}
                sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0.375, textDecoration: 'none', color: on ? c.red : c.text3, fontSize: 12, fontWeight: on ? 600 : 500, position: 'relative', ...focusRing, '&:active svg': { transform: 'scale(.88)' } }}>
                {/* keyed on the count so the badge pops each time something is added */}
                <Badge key={cart ? count : undefined} badgeContent={cart ? count : 0} max={99}
                  sx={{ '& .MuiBadge-badge': { bgcolor: c.red, color: '#fff', fontWeight: 800, fontSize: 10.5, minWidth: 18, height: 18, px: 0.5, border: '2px solid #fff', animation: cart && count ? 'bump .35s ease-out' : 'none', '@keyframes bump': { '0%': { transform: 'scale(1) translate(50%,-50%)' }, '40%': { transform: 'scale(1.35) translate(40%,-40%)' }, '100%': { transform: 'scale(1) translate(50%,-50%)' } }, '@media (prefers-reduced-motion: reduce)': { animation: 'none' } } }}>
                  <Icon sx={{ fontSize: 25, transition: `transform ${tokens.motion.fast}` }} />
                </Badge>
                {t.label}
              </Box>
            </li>
          )
        })}
      </Box>
    </Box>
  )
}

function ToastHost({ bottom }: { bottom: string }) {
  const { toast, dismiss } = useApp()
  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(dismiss, toast.action ? 5000 : 2600)
    return () => window.clearTimeout(t)
  }, [toast, dismiss])
  if (!toast) return null
  const Icon = toast.tone === 'info' ? InfoIcon : CheckCircleIcon
  return (
    <Box key={toast.id} role="status" aria-live="polite" sx={{ position: 'absolute', left: 12, right: 12, bottom, zIndex: 60, display: 'flex', alignItems: 'center', gap: 1.25, pl: 1.75, pr: 0.75, py: 1, borderRadius: `${tokens.radius.md}px`, bgcolor: c.ink, color: '#fff', boxShadow: '0 16px 40px -12px rgba(17,24,39,.55)', animation: 'toastIn .22s ease-out', '@keyframes toastIn': { from: { transform: 'translateY(12px)', opacity: 0 }, to: { transform: 'none', opacity: 1 } } }}>
      <Icon sx={{ fontSize: 21, color: toast.tone === 'info' ? '#93C5FD' : '#34D399', flexShrink: 0 }} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>{toast.message}</Typography>
        {toast.detail && <Typography sx={{ fontSize: 12, opacity: 0.72, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{toast.detail}</Typography>}
      </Box>
      {toast.action && <Button size="small" onClick={() => { toast.action!.onClick(); dismiss() }} sx={{ color: c.saffron, fontWeight: 700, minHeight: 36 }}>{toast.action.label}</Button>}
      <IconButton aria-label="Dismiss" onClick={dismiss} sx={{ color: 'rgba(255,255,255,.7)', width: 36, height: 36 }}><CloseIcon sx={{ fontSize: 18 }} /></IconButton>
    </Box>
  )
}

/**
 * The phone. On a laptop it's a 430px column centred in the window (plain mobile layout); on a phone it fills the
 * screen. `transform` makes it the containing block for fixed children, so sheets, bars and toasts stay inside it.
 * The column scrolls internally; scroll position is restored on Back and reset on new screens.
 */
export default function AppShell() {
  const { ready, onboarded } = useApp()
  const { pathname, key } = useLocation()
  const navType = useNavigationType()
  const scroller = useRef<HTMLDivElement>(null)
  const positions = useRef(new Map<string, number>())
  const lastKey = useRef(key)

  useLayoutEffect(() => {
    const el = scroller.current
    if (!el) return
    positions.current.set(lastKey.current, el.scrollTop)
    el.scrollTop = navType === 'POP' ? positions.current.get(key) ?? 0 : 0
    lastKey.current = key
  }, [key, navType])

  if (ready && !onboarded && !matches(PUBLIC, pathname)) return <Navigate to="/welcome" replace />

  const tabs = !matches(NO_TABS, pathname)
  const ownBar = matches(OWN_BAR, pathname)
  const pad = tabs ? tokens.tabBarHeight : 0
  const toastBottom = `calc(${pad + (ownBar ? (tabs ? 84 : 96) : 0) + 12}px + env(safe-area-inset-bottom))`

  return (
    <Box id="app-shell" sx={{ position: 'relative', mx: 'auto', width: '100%', maxWidth: tokens.appWidth, height: '100dvh', overflow: 'hidden', bgcolor: c.bg, transform: 'translateZ(0)', boxShadow: { sm: '0 0 0 1px rgba(17,24,39,.06), 0 30px 80px -30px rgba(27,25,80,.35)' } }}>
      <Box ref={scroller} id="app-scroll" component="main" sx={{ position: 'absolute', inset: 0, overflowY: 'auto', overflowX: 'hidden', overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch', pb: `calc(${pad}px + env(safe-area-inset-bottom))` }}>
        <Box key={pathname} sx={{ minHeight: '100%', display: 'flex', flexDirection: 'column', '& > *': { flex: '1 0 auto' }, animation: navType === 'POP' ? 'none' : 'screenIn .22s ease-out', '@keyframes screenIn': { from: { opacity: 0, transform: 'translateX(14px)' }, to: { opacity: 1, transform: 'none' } } }}>
          {ready ? <Outlet /> : null}
        </Box>
      </Box>
      {tabs && <TabBar path={pathname} />}
      <ToastHost bottom={toastBottom} />
    </Box>
  )
}
