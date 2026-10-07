import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Avatar, Badge, Box, Button, Divider, Drawer, IconButton, ListItemIcon, Menu, MenuItem, Tooltip, Typography } from '@mui/material'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded'
import BoltRoundedIcon from '@mui/icons-material/BoltRounded'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { departments, money, productByUrlKey, type Category } from '../../lib/data'
import { useCart } from '../../lib/cart'
import { useSession } from '../../lib/session'
import { CUTOFF } from '../../lib/pricing'
import { colors, focusRing, focusRingInverse, layout, motion, radius, srOnly, z } from '../../lib/theme'
import CategoryMenu, { CategoryCircle, POPULAR, deptIcons, preloadCategoryImages, tilesFor } from './CategoryMenu'
import SearchBox from './SearchBox'
import { useQuickOrder } from '../QuickOrder/QuickOrder'

export const PHONE = '+1 365-777-0999'
export const PHONE_HREF = 'tel:+13657770999'
export const WHATSAPP_HREF = 'https://wa.me/13657770999'

const Logo = ({ height = 48 }: { height?: number | Record<string, number> }) => (
  <Box component={Link} href="/" aria-label="MySupreme home" sx={{ display: 'inline-flex', flexShrink: 0, borderRadius: radius.sm, ...focusRing }}>
    <Box component="img" src="/assets/header_logo.svg" alt="MySupreme Cash & Carry" sx={{ height, width: 'auto', display: 'block' }} />
  </Box>
)

/** Department the current page belongs to (category page or product page), for "you are here" in the bar. */
function useActiveDepartment() {
  const { pathname, query } = useRouter()
  if (pathname === '/[category]' && typeof query.category === 'string') return query.category
  if (pathname === '/p/[url]' && typeof query.url === 'string') return productByUrlKey(query.url)?.department
  return undefined
}

/* ------------------------------------------------------------------ Utility bar (desktop) */

function UtilityBar() {
  const link = { color: colors.ink600, textDecoration: 'none', borderRadius: '4px', '&:hover': { color: colors.ink, textDecoration: 'underline' }, ...focusRing } as const
  return (
    <Box sx={{ display: { xs: 'none', lg: 'block' }, bgcolor: colors.subtle, borderBottom: `1px solid ${colors.line}` }}>
      <Box sx={{ maxWidth: layout.maxWidth, mx: 'auto', px: layout.gutter, height: 36, display: 'flex', alignItems: 'center', gap: 3, fontSize: 13 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: colors.ink700, minWidth: 0 }}>
          <LocalShippingOutlinedIcon sx={{ fontSize: 18, color: colors.redText }} />
          <Box component="span" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <b>Same-day &amp; next-day delivery</b>
            <Box component="span" sx={{ display: 'none', '@media (min-width:1300px)': { display: 'inline' } }}> across the GTA, Hamilton &amp; Niagara</Box>
            {' '}· Order by {CUTOFF} for next-day
          </Box>
        </Box>
        <Box component="nav" aria-label="Help and services" sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 2.5, flexShrink: 0, whiteSpace: 'nowrap' }}>
          <Box component={Link} href="/become-a-supplier" sx={link}>Become a supplier</Box>
          <Box component={Link} href="/download-app" sx={link}>Get the app</Box>
          <Box component={Link} href="/service/contact-us" sx={link}>Help &amp; contact</Box>
          <Box component="a" href={PHONE_HREF} sx={{ ...link, display: 'inline-flex', alignItems: 'center', gap: 0.5, color: colors.ink, fontWeight: 600 }}>
            <PhoneOutlinedIcon sx={{ fontSize: 16 }} /> {PHONE}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

/* ------------------------------------------------------------------ Actions */

function CartButton({ compact = false }: { compact?: boolean }) {
  const { count, subtotal, ready } = useCart()
  const n = ready ? count : 0
  // Brief pulse on the badge when the count changes, so adding from anywhere visibly lands in the cart.
  const [pulse, setPulse] = useState(false)
  const prev = useRef(n)
  useEffect(() => {
    if (n > prev.current) {
      setPulse(true)
      const t = window.setTimeout(() => setPulse(false), 450)
      prev.current = n
      return () => window.clearTimeout(t)
    }
    prev.current = n
  }, [n])
  return (
    <Box
      component={Link}
      href="/cart"
      aria-label={n ? `Cart, ${n} items, ${money(subtotal)}` : 'Cart, empty'}
      sx={{
        display: 'flex', alignItems: 'center', gap: 1.75, px: compact ? 1 : 1.5, height: 44, borderRadius: radius.md, color: colors.ink, textDecoration: 'none',
        transition: `background-color ${motion.fast}`, '&:hover': { bgcolor: colors.sunken }, ...focusRing,
      }}
    >
      <Badge
        badgeContent={n}
        color="primary"
        max={999}
        sx={{ '& .MuiBadge-badge': { transition: `transform ${motion.base}`, transform: pulse ? 'scale(1.25) translate(50%, -50%)' : undefined, border: '2px solid #fff' } }}
      >
        <ShoppingCartOutlinedIcon sx={{ fontSize: 24 }} />
      </Badge>
      {!compact && (
        <Box sx={{ display: { xs: 'none', lg: 'block' }, lineHeight: 1.15 }}>
          <Typography sx={{ fontSize: 12, color: colors.ink500 }}>Cart</Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{n ? money(subtotal) : '$0.00'}</Typography>
        </Box>
      )}
    </Box>
  )
}

const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase()

function AccountButton({ compact = false }: { compact?: boolean | 'responsive' }) {
  const { user, signOut, ready } = useSession()
  const { notify } = useCart()
  const quick = useQuickOrder()
  const router = useRouter()
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  if (!ready || !user) {
    if (compact === 'responsive') {
      return (
        <>
          <Box sx={{ display: { xs: 'block', lg: 'none' } }}><AccountButton compact /></Box>
          <Box sx={{ display: { xs: 'none', lg: 'block' } }}><AccountButton /></Box>
        </>
      )
    }
    return compact ? (
      <Tooltip title="Sign in">
        <IconButton component={Link} href="/account/signin" aria-label="Sign in"><PersonOutlineRoundedIcon /></IconButton>
      </Tooltip>
    ) : (
      <Button component={Link} href="/account/signin" variant="outlined" startIcon={<PersonOutlineRoundedIcon />} sx={{ ml: 0.5 }}>
        Sign in
      </Button>
    )
  }
  return (
    <>
      <Box
        component="button"
        onClick={(e: React.MouseEvent<HTMLElement>) => setAnchor(e.currentTarget)}
        aria-haspopup="menu"
        aria-expanded={!!anchor}
        aria-label={`Account: ${user.business}`}
        sx={{
          all: 'unset', boxSizing: 'border-box', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 1, height: 44, px: compact ? 0.5 : 1, borderRadius: radius.md,
          '&:hover': { bgcolor: colors.sunken }, ...focusRing,
        }}
      >
        <Avatar sx={{ width: 32, height: 32, bgcolor: colors.navy, fontSize: 13, fontWeight: 600 }}>{initials(user.business)}</Avatar>
        {!compact && (
          <Box sx={{ display: { xs: 'none', lg: 'block' }, lineHeight: 1.15, textAlign: 'left', maxWidth: 140 }}>
            <Typography sx={{ fontSize: 12, color: colors.ink500 }}>Hello, {user.name.split(' ')[0]}</Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.business}</Typography>
          </Box>
        )}
        {!compact && <KeyboardArrowDownRoundedIcon sx={{ fontSize: 20, color: colors.ink500, display: { xs: 'none', lg: 'block' } }} />}
      </Box>
      <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }} slotProps={{ paper: { sx: { minWidth: 260 } } }}>
        <Box sx={{ px: 1.5, py: 1.25 }}>
          <Typography sx={{ fontWeight: 600 }}>{user.business}</Typography>
          <Typography sx={{ fontSize: 13, color: colors.ink500 }}>{user.email}</Typography>
          <Box sx={{ display: 'inline-flex', mt: 1, fontSize: 12, fontWeight: 600, color: colors.navy, bgcolor: colors.navyTint, px: 1, py: 0.25, borderRadius: radius.pill }}>Business account · {user.terms}</Box>
        </Box>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={() => { setAnchor(null); quick.open() }}><ListItemIcon><BoltRoundedIcon fontSize="small" /></ListItemIcon>Quick order</MenuItem>
        <MenuItem component={Link} href="/wishlist" onClick={() => setAnchor(null)}><ListItemIcon><FavoriteBorderRoundedIcon fontSize="small" /></ListItemIcon>Favorites</MenuItem>
        <MenuItem component={Link} href="/cart" onClick={() => setAnchor(null)}><ListItemIcon><ShoppingCartOutlinedIcon fontSize="small" /></ListItemIcon>Cart</MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={() => { setAnchor(null); signOut(); notify('You’re signed out', 'info'); if (router.pathname.startsWith('/checkout')) router.push('/cart') }}>
          <ListItemIcon><LogoutRoundedIcon fontSize="small" /></ListItemIcon>Sign out
        </MenuItem>
      </Menu>
    </>
  )
}

function FavoritesLink({ compact = false }: { compact?: boolean }) {
  const { wishlist, ready } = useCart()
  const n = ready ? wishlist.length : 0
  return (
    <Tooltip title={compact ? 'Favorites' : ''}>
      <Box
        component={Link}
        href="/wishlist"
        aria-label={n ? `Favorites, ${n} saved` : 'Favorites'}
        sx={{ display: 'flex', alignItems: 'center', gap: 0.75, height: 44, px: compact ? 1.25 : 1.5, borderRadius: radius.md, color: colors.ink, textDecoration: 'none', fontSize: 14.5, fontWeight: 500, '&:hover': { bgcolor: colors.sunken }, ...focusRing }}
      >
        <Badge badgeContent={n} color="secondary" sx={{ '& .MuiBadge-badge': { border: '2px solid #fff' } }}><FavoriteBorderRoundedIcon sx={{ fontSize: 23 }} /></Badge>
        {!compact && <Box component="span" sx={{ display: { xs: 'none', xl: 'inline' } }}>Favorites</Box>}
      </Box>
    </Tooltip>
  )
}

/* ------------------------------------------------------------------ Red category bar */

function CategoryBar() {
  const { pathname, asPath } = useRouter()
  const current = useActiveDepartment()
  const [active, setActive] = useState<string | null>(null)
  const timer = useRef<number | undefined>(undefined)
  const bar = useRef<HTMLDivElement>(null)
  useEffect(() => () => window.clearTimeout(timer.current), [])
  useEffect(() => setActive(null), [asPath])
  // Small delay so sweeping the mouse across the bar doesn't flash the panel.
  const hoverOpen = (key: string) => {
    window.clearTimeout(timer.current)
    if (active) setActive(key)
    else timer.current = window.setTimeout(() => setActive(key), 140)
  }
  const close = (refocus?: boolean) => {
    window.clearTimeout(timer.current)
    const was = active
    setActive(null)
    if (refocus && was) bar.current?.querySelector<HTMLElement>(`[data-toggle="${was}"]`)?.focus()
  }
  const toggle = (key: string) => (active === key ? close() : setActive(key))

  // Items stay position: static so each panel (rendered right after its toggle, for a logical Tab order) spans the
  // whole bar. "You are here" = white underline drawn with an inset shadow.
  const item = (on: boolean) => ({
    display: 'flex', alignItems: 'center', height: 48, flexShrink: 1, minWidth: 0,
    bgcolor: on ? colors.redPressed : 'transparent', transition: `background-color ${motion.fast}`, '&:hover': { bgcolor: colors.redHover },
  }) as const
  const here = { boxShadow: 'inset 0 -3px 0 #fff' } as const
  const linkSx = {
    color: '#fff', textDecoration: 'none', fontWeight: 600, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 0.75, height: '100%',
    fontSize: { lg: 12.5, xl: 14.5 }, pl: { lg: '5px', xl: 1.5 }, pr: 0.25, '@media (min-width:1300px) and (max-width:1499.98px)': { fontSize: 13, pl: 1 }, borderRadius: radius.xs, ...focusRingInverse,
  } as const
  const chevron = (key: string, name: string) => (
    <Box
      component="button"
      data-toggle={key}
      onClick={() => toggle(key)}
      aria-expanded={active === key}
      aria-controls="category-panel"
      aria-label={`Show ${name} categories`}
      sx={{ all: 'unset', cursor: 'pointer', display: 'grid', placeItems: 'center', width: { lg: 22, xl: 26 }, height: 32, color: '#fff', borderRadius: radius.xs, mr: { lg: 0.25, xl: 1 }, '@media (min-width:1300px)': { width: 26, mr: 0.5 }, ...focusRingInverse }}
    >
      <KeyboardArrowDownRoundedIcon sx={{ fontSize: 20, transition: `transform ${motion.fast}`, transform: active === key ? 'rotate(180deg)' : 'none' }} />
    </Box>
  )

  return (
    <Box
      ref={bar}
      onMouseLeave={() => close()}
      onMouseEnter={preloadCategoryImages}
      onFocus={preloadCategoryImages}
      onKeyDown={(e) => { if (e.key === 'Escape' && active) { e.stopPropagation(); close(true) } }}
      onBlur={(e) => { if (active && !bar.current?.contains(e.relatedTarget as Node)) close() }}
      sx={{ display: { xs: 'none', lg: 'block' }, position: 'relative', bgcolor: colors.red }}
    >
      <Box component="nav" aria-label="Departments" sx={{ maxWidth: layout.maxWidth, mx: 'auto', px: { lg: 0.5, xl: 3 }, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ ...item(active === POPULAR), bgcolor: active === POPULAR ? colors.redPressed : 'rgba(0,0,0,.12)', mr: { lg: 0.25, xl: 0.5 } }} onMouseEnter={() => hoverOpen(POPULAR)}>
          <Box
            component="button"
            data-toggle={POPULAR}
            onClick={() => toggle(POPULAR)}
            aria-expanded={active === POPULAR}
            aria-controls="category-panel"
            sx={{ all: 'unset', boxSizing: 'border-box', cursor: 'pointer', ...linkSx, px: { lg: 1, xl: 1.75 } }}
          >
            <GridViewRoundedIcon sx={{ fontSize: 19 }} />
            <Box component="span" aria-hidden sx={{ '@media (min-width:1300px)': { display: 'none' } }}>All</Box>
            <Box component="span" sx={{ display: 'none', '@media (min-width:1300px)': { display: 'inline' } }}>All categories</Box>
            <Box component="span" sx={{ ...srOnly, '@media (min-width:1300px)': { display: 'none' } }}> categories</Box>
          </Box>
          {active === POPULAR && <CategoryMenu id="category-panel" active={POPULAR} onClose={close} />}
        </Box>
        {departments.map((d) => (
          <Box key={d.uid} sx={{ ...item(active === d.url_key), ...(current === d.url_key ? here : {}) }} onMouseEnter={() => hoverOpen(d.url_key)}>
            <Box component={Link} href={`/${d.url_key}`} aria-current={current === d.url_key ? 'page' : undefined} sx={linkSx}>{d.name}</Box>
            {d.children.length > 0 && chevron(d.url_key, d.name)}
            {active === d.url_key && <CategoryMenu id="category-panel" active={d.url_key} onClose={close} />}
          </Box>
        ))}
        <Box sx={{ ...item(false), ...(pathname === '/flyers-offers' ? here : {}) }} onMouseEnter={() => close()}>
          <Box component={Link} href="/flyers-offers" aria-current={pathname === '/flyers-offers' ? 'page' : undefined} sx={{ ...linkSx, pr: { lg: 0.75, xl: 1.5 } }}>
            Flyers &amp; Offers
            {/* The NEW pill only where the bar has room for it (≥1500px). */}
            <Box component="span" sx={{ display: { xs: 'none', xl: 'inline' }, bgcolor: '#fff', color: colors.redText, borderRadius: radius.pill, px: 0.75, fontSize: 10.5, fontWeight: 700, lineHeight: '17px', letterSpacing: '.04em' }}>NEW</Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

/* ------------------------------------------------------------------ Mobile menu */

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [dept, setDept] = useState<Category | null>(null)
  const { user } = useSession()
  const quick = useQuickOrder()
  const current = useActiveDepartment()
  useEffect(() => { if (!open) window.setTimeout(() => setDept(null), 250) }, [open])
  const row = { display: 'flex', alignItems: 'center', gap: 1.75, minHeight: 52, px: 2, color: colors.ink, textDecoration: 'none', fontSize: 15, fontWeight: 500, width: '100%', '&:hover': { bgcolor: colors.subtle }, ...focusRing } as const
  const btnReset = { all: 'unset', boxSizing: 'border-box', cursor: 'pointer' } as const
  return (
    <Drawer open={open} onClose={onClose} PaperProps={{ sx: { width: 'min(88vw, 360px)', display: 'flex', flexDirection: 'column' } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1.5, height: 60, borderBottom: `1px solid ${colors.line}`, flexShrink: 0 }}>
        {dept ? (
          <Button startIcon={<ChevronLeftRoundedIcon />} onClick={() => setDept(null)} sx={{ color: colors.ink }}>All departments</Button>
        ) : (
          <Box sx={{ pl: 0.5 }}><Logo height={38} /></Box>
        )}
        <IconButton aria-label="Close menu" onClick={onClose}><CloseRoundedIcon /></IconButton>
      </Box>
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {!dept ? (
          <>
            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1, borderBottom: `1px solid ${colors.line}` }}>
              {user ? (
                <Typography sx={{ fontSize: 14, color: colors.ink600 }}>Signed in as <b style={{ color: colors.ink }}>{user.business}</b></Typography>
              ) : (
                <Button component={Link} href="/account/signin" onClick={onClose} variant="contained" fullWidth startIcon={<PersonOutlineRoundedIcon />}>Sign in or create account</Button>
              )}
              <Button variant="outlined" fullWidth startIcon={<BoltRoundedIcon />} onClick={() => { onClose(); quick.open() }}>Quick order by SKU</Button>
            </Box>
            <Typography sx={{ px: 2, pt: 2, pb: 0.5, fontSize: 12, fontWeight: 600, color: colors.ink500, letterSpacing: '.08em', textTransform: 'uppercase' }}>Departments</Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {departments.map((d) => {
                const Icon = deptIcons[d.url_key]
                return (
                  <li key={d.uid}>
                    <Box component="button" onClick={() => setDept(d)} aria-current={current === d.url_key ? 'page' : undefined} sx={{ ...btnReset, ...row, fontWeight: current === d.url_key ? 600 : 500 }}>
                      {Icon && <Icon sx={{ fontSize: 22, color: current === d.url_key ? colors.redText : colors.ink500 }} />}
                      <Box sx={{ flex: 1 }}>{d.name}</Box>
                      <Typography component="span" sx={{ fontSize: 12.5, color: colors.ink500 }}>{d.product_count.toLocaleString()}</Typography>
                      <ChevronRightRoundedIcon sx={{ color: colors.ink400 }} />
                    </Box>
                  </li>
                )
              })}
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box component={Link} href="/flyers-offers" onClick={onClose} sx={{ ...row, color: colors.redText, fontWeight: 600 }}><LocalOfferOutlinedIcon sx={{ fontSize: 22 }} /> Flyers &amp; Offers</Box>
            <Box component={Link} href="/all-categories" onClick={onClose} sx={row}><GridViewRoundedIcon sx={{ fontSize: 22, color: colors.ink500 }} /> All categories</Box>
            <Box component={Link} href="/brands" onClick={onClose} sx={row}><StorefrontOutlinedIcon sx={{ fontSize: 22, color: colors.ink500 }} /> Brands</Box>
            <Box component={Link} href="/wishlist" onClick={onClose} sx={row}><FavoriteBorderRoundedIcon sx={{ fontSize: 22, color: colors.ink500 }} /> Favorites</Box>
            <Divider sx={{ my: 1 }} />
            {[['Become a supplier', '/become-a-supplier'], ['Get the app', '/download-app'], ['About us', '/about-us'], ['Help & contact', '/service/contact-us']].map(([t, href]) => (
              <Box key={href} component={Link} href={href} onClick={onClose} sx={{ ...row, minHeight: 46, fontSize: 14.5, color: colors.ink700 }}>{t}</Box>
            ))}
          </>
        ) : (
          <>
            <Box sx={{ px: 2, pt: 2 }}>
              <Typography variant="h3" component="p">{dept.name}</Typography>
              <Typography sx={{ fontSize: 13, color: colors.ink500 }}>{dept.product_count.toLocaleString()} products</Typography>
              <Button component={Link} href={`/${dept.url_key}`} onClick={onClose} variant="outlined" color="primary" fullWidth sx={{ mt: 1.5 }} endIcon={<ChevronRightRoundedIcon />}>Shop all {dept.name}</Button>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 0.5, px: 1, py: 1.5 }}>
              {tilesFor(dept).map((t) => <CategoryCircle key={t.href} tile={t} size={72} onNavigate={onClose} />)}
            </Box>
          </>
        )}
      </Box>
      <Box sx={{ borderTop: `1px solid ${colors.line}`, p: 2, bgcolor: colors.subtle, flexShrink: 0 }}>
        <Typography sx={{ fontSize: 13, color: colors.ink600, mb: 1 }}>Questions? Mon–Sat 9am–6pm</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button component="a" href={PHONE_HREF} variant="outlined" size="small" startIcon={<PhoneOutlinedIcon />} sx={{ flex: 1 }}>Call</Button>
          <Button component="a" href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" variant="outlined" size="small" startIcon={<WhatsAppIcon />} sx={{ flex: 1 }}>WhatsApp</Button>
        </Box>
      </Box>
    </Drawer>
  )
}

/* ------------------------------------------------------------------ Header */

/** Logo-only header for focused flows (sign in, checkout): fewer exits, one clear way back. */
export function FocusedHeader({ variant }: { variant: 'signin' | 'checkout' }) {
  return (
    <Box component="header" sx={{ bgcolor: '#fff', borderBottom: `1px solid ${colors.line}` }}>
      <Box sx={{ maxWidth: layout.maxWidth, mx: 'auto', px: layout.gutter, height: { xs: 60, md: 72 }, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Logo height={{ xs: 38, md: 46 }} />
        {variant === 'checkout' && (
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 0.75, color: colors.ink600, fontSize: 14, pl: 2, borderLeft: `1px solid ${colors.line}` }}>
            <LockOutlinedIcon sx={{ fontSize: 18, color: colors.success }} /> Secure checkout
          </Box>
        )}
        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box component="a" href={PHONE_HREF} sx={{ display: { xs: 'none', md: 'inline-flex' }, alignItems: 'center', gap: 0.75, color: colors.ink700, fontSize: 14, textDecoration: 'none', mr: 1, borderRadius: '4px', ...focusRing }}>
            <PhoneOutlinedIcon sx={{ fontSize: 18 }} /> Need help? <b>{PHONE}</b>
          </Box>
          {variant === 'checkout' ? (
            <Button component={Link} href="/cart" startIcon={<ChevronLeftRoundedIcon />}>Back to cart</Button>
          ) : (
            <Button component={Link} href="/" startIcon={<ChevronLeftRoundedIcon />}>Continue shopping</Button>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default function Header() {
  const [drawer, setDrawer] = useState(false)
  const quick = useQuickOrder()
  return (
    <>
      <UtilityBar />
      <Box component="header" sx={{ position: 'sticky', top: 0, zIndex: z.header, bgcolor: '#fff', boxShadow: `0 1px 0 ${colors.line}` }}>
        {/* Tablet + desktop row */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: { md: 1.5, lg: 3 }, maxWidth: layout.maxWidth, mx: 'auto', px: layout.gutter, height: 76 }}>
          <IconButton aria-label="Open menu" onClick={() => setDrawer(true)} sx={{ display: { md: 'inline-flex', lg: 'none' }, ml: -1 }}><MenuRoundedIcon /></IconButton>
          <Logo height={50} />
          <Box sx={{ flex: 1, minWidth: 0, maxWidth: 760, mx: 'auto' }}><SearchBox /></Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { md: 0, lg: 0.5 } }}>
            <Tooltip title="Order by SKU or paste a list">
              <Button onClick={() => quick.open()} startIcon={<BoltRoundedIcon sx={{ color: colors.redText }} />} sx={{ display: { md: 'none', lg: 'inline-flex' }, color: colors.ink }}>
                Quick order
              </Button>
            </Tooltip>
            <Tooltip title="Quick order">
              <IconButton aria-label="Quick order" onClick={() => quick.open()} sx={{ display: { md: 'inline-flex', lg: 'none' } }}><BoltRoundedIcon sx={{ color: colors.redText }} /></IconButton>
            </Tooltip>
            <FavoritesLink />
            <AccountButton compact="responsive" />
            <CartButton />
          </Box>
        </Box>

        {/* Phone rows */}
        <Box sx={{ display: { xs: 'block', md: 'none' }, px: 1.5, pt: 0.75, pb: 1.25 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.75 }}>
            <IconButton aria-label="Open menu" onClick={() => setDrawer(true)} sx={{ ml: -0.5 }}><MenuRoundedIcon /></IconButton>
            <Logo height={38} />
            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
              <IconButton aria-label="Quick order" onClick={() => quick.open()}><BoltRoundedIcon sx={{ color: colors.redText }} /></IconButton>
              <AccountButton compact />
              <CartButton compact />
            </Box>
          </Box>
          <SearchBox />
        </Box>

        <CategoryBar />
      </Box>
      <MobileMenu open={drawer} onClose={() => setDrawer(false)} />
    </>
  )
}
