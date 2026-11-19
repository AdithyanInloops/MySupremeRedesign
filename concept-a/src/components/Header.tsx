import { useState, type ReactNode } from 'react'
import {
  Badge, Box, Button, Divider, Drawer, GlobalStyles, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem,
  Stack, Typography, Avatar, Skeleton, useMediaQuery, useTheme,
} from '@mui/material'
import { Link as RouterLink, NavLink, useLocation, useNavigate } from 'react-router-dom'
import MenuRounded from '@mui/icons-material/MenuRounded'
import FavoriteBorderRounded from '@mui/icons-material/FavoriteBorderRounded'
import FavoriteRounded from '@mui/icons-material/FavoriteRounded'
import HomeRounded from '@mui/icons-material/HomeRounded'
import StorefrontRounded from '@mui/icons-material/StorefrontRounded'
import ShoppingCartRounded from '@mui/icons-material/ShoppingCartRounded'
import ShoppingCartOutlined from '@mui/icons-material/ShoppingCartOutlined'
import PersonOutlineRounded from '@mui/icons-material/PersonOutlineRounded'
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded'
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded'
import ChevronLeftRounded from '@mui/icons-material/ChevronLeftRounded'
import CloseRounded from '@mui/icons-material/CloseRounded'
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined'
import WhatsApp from '@mui/icons-material/WhatsApp'
import StorefrontOutlined from '@mui/icons-material/StorefrontOutlined'
import HandshakeOutlined from '@mui/icons-material/HandshakeOutlined'
import SupportAgentOutlined from '@mui/icons-material/SupportAgentOutlined'
import PhoneIphoneOutlined from '@mui/icons-material/PhoneIphoneOutlined'
import ReceiptLongOutlined from '@mui/icons-material/ReceiptLongOutlined'
import PlaceOutlined from '@mui/icons-material/PlaceOutlined'
import LogoutRounded from '@mui/icons-material/LogoutRounded'
import BadgeOutlined from '@mui/icons-material/BadgeOutlined'
import RestaurantMenuOutlined from '@mui/icons-material/RestaurantMenuOutlined'
import LocalOfferOutlined from '@mui/icons-material/LocalOfferOutlined'
import HomeOutlined from '@mui/icons-material/HomeOutlined'
import { tokens } from '../theme'
import { departments, photo, type Department } from '../data/catalog'
import { customer } from '../data/account'
import { useApp } from '../state/AppState'
import { Logo } from './Brand'
import SearchBar from './SearchBar'
import { Container } from './ui'

const c = tokens.color

const NewBadge = () => (
  <Box component="span" sx={{ ml: 0.75, px: 0.75, py: 0.1, bgcolor: c.saffron, color: c.navyDark, fontSize: 10, fontWeight: 800, borderRadius: 1, letterSpacing: '.04em' }}>
    NEW
  </Box>
)

/* ------------------------------------------------------------------ Utility strip */

function UtilityStrip() {
  return (
    // Brand blue bar; the 2 PM cut-off sits in a brand-red pill so the deadline is read first.
    <Box sx={{ bgcolor: c.navy, color: '#fff', fontSize: 12.5 }}>
      <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 40, gap: 2 }}>
        <Stack direction="row" alignItems="center" spacing={{ xs: 1, sm: 1.25 }} sx={{ minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexShrink: 0, bgcolor: c.red, color: '#fff', fontWeight: 700, px: { xs: 1, sm: 1.25 }, py: 0.5, borderRadius: `${tokens.radius.pill}px`, whiteSpace: 'nowrap' }}>
            {/* Icon drops on small phones so the area name fits on one line. */}
            <LocalShippingOutlined sx={{ fontSize: 16, display: { xs: 'none', sm: 'inline-block' } }} />
            Order by 2 PM for next-day
          </Box>
          <Box component="span" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'rgba(255,255,255,.9)' }}>
            <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>Delivering daily across the </Box>GTA, Hamilton &amp; Niagara
          </Box>
        </Stack>
        <Stack direction="row" spacing={2.5} alignItems="center" sx={{ display: { xs: 'none', lg: 'flex' }, flexShrink: 0 }}>
          <Box component="a" href="https://wa.me/13657770999" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#fff', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
            <WhatsApp sx={{ fontSize: 16 }} /> +1 365-777-0999
          </Box>
          <Box component="span" sx={{ opacity: 0.85 }}>Mon–Sat 9am–6pm</Box>
          <Box component={RouterLink} to="/about" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#fff', textDecoration: 'none' }}>
            <StorefrontOutlined sx={{ fontSize: 16 }} /> Cash &amp; Carry · Mississauga
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}

/* ------------------------------------------------------------------ Header actions */

function HeaderIcon({ to, label, icon, badge, onClick, showLabel }: { to?: string; label: string; icon: ReactNode; badge?: number; onClick?: (e: React.MouseEvent<HTMLElement>) => void; showLabel?: boolean }) {
  const inner = (
    <>
      <Badge badgeContent={badge} color="primary" max={99} sx={{ '& .MuiBadge-badge': { fontWeight: 700, border: '2px solid #fff', minWidth: 22, height: 22, borderRadius: 11 } }}>
        {icon}
      </Badge>
      {showLabel && <Box component="span" sx={{ fontSize: 11.5, fontWeight: 600, mt: 0.25, lineHeight: 1 }}>{label}</Box>}
    </>
  )
  const sx = {
    display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', minWidth: 44, minHeight: 44,
    px: showLabel ? 1.25 : 0, color: c.ink, textDecoration: 'none', borderRadius: `${tokens.radius.sm}px`, '&:hover': { bgcolor: c.bg, color: c.red },
  }
  return to ? (
    <Box component={RouterLink} to={to} aria-label={badge ? `${label}, ${badge} items` : label} sx={sx}>{inner}</Box>
  ) : (
    <Box component="button" onClick={onClick} aria-label={label} sx={{ ...sx, border: 0, bgcolor: 'transparent', cursor: 'pointer', font: 'inherit' }}>{inner}</Box>
  )
}

function AccountMenu({ showLabel }: { showLabel: boolean }) {
  const { review, setReview } = useApp()
  const nav = useNavigate()
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  if (!review.signedIn) {
    return <HeaderIcon to="/account/signin" label="Sign in" icon={<PersonOutlineRounded />} showLabel={showLabel} />
  }
  const items = [
    { t: 'My Profile', i: <BadgeOutlined />, to: '/account' },
    { t: 'Your business profile', i: <RestaurantMenuOutlined />, to: '/account/business-profile' },
    { t: 'Orders', i: <ReceiptLongOutlined />, to: '/account/orders' },
    { t: 'Saved Addresses', i: <PlaceOutlined />, to: '/account/addresses' },
    { t: 'My Lists', i: <FavoriteBorderRounded />, to: '/my-lists' },
  ]
  return (
    <>
      <Box
        component="button"
        onClick={(e: React.MouseEvent<HTMLElement>) => setAnchor(e.currentTarget)}
        aria-haspopup="menu"
        aria-label="Account menu"
        sx={{ display: 'flex', alignItems: 'center', gap: 1, border: 0, bgcolor: 'transparent', cursor: 'pointer', font: 'inherit', minHeight: 44, px: showLabel ? 1 : 0.5, borderRadius: `${tokens.radius.sm}px`, '&:hover': { bgcolor: c.bg } }}
      >
        {review.loading ? (
          <Skeleton variant="circular" width={34} height={34} />
        ) : (
          <Avatar sx={{ width: 34, height: 34, bgcolor: c.navy, fontSize: 14, fontWeight: 700 }}>SR</Avatar>
        )}
        {showLabel && (
          <Box sx={{ textAlign: 'left', lineHeight: 1.2 }}>
            <Box sx={{ fontSize: 11, color: c.text3 }}>Hi, {customer.firstName}</Box>
            <Box sx={{ fontSize: 13, fontWeight: 600, color: c.ink, display: 'flex', alignItems: 'center' }}>
              Account <KeyboardArrowDownRounded sx={{ fontSize: 18 }} />
            </Box>
          </Box>
        )}
      </Box>
      <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { mt: 1, width: 260, borderRadius: `${tokens.radius.md}px`, boxShadow: tokens.shadow.pop, border: `1px solid ${c.line}` } } }}>
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography sx={{ fontWeight: 700 }}>{customer.businessName}</Typography>
          <Typography variant="caption" color="text.secondary">{customer.email}</Typography>
        </Box>
        <Divider />
        {items.map((it) => (
          <MenuItem key={it.t} onClick={() => { setAnchor(null); nav(it.to) }} sx={{ minHeight: 44 }}>
            <ListItemIcon>{it.i}</ListItemIcon>{it.t}
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={() => { setAnchor(null); setReview({ signedIn: false }) }} sx={{ minHeight: 44, color: c.red }}>
          <ListItemIcon sx={{ color: c.red }}><LogoutRounded /></ListItemIcon>Sign out
        </MenuItem>
      </Menu>
    </>
  )
}

function MoreMenu() {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const nav = useNavigate()
  const items = [
    { t: 'Become a Supplier', s: 'Sell to 3,000+ kitchens', i: <HandshakeOutlined />, to: '/become-a-supplier' },
    { t: '24x7 Customer Care', s: 'Call, WhatsApp or chat', i: <SupportAgentOutlined />, to: '/contact' },
    { t: 'Download App', s: 'Reorder in two taps', i: <PhoneIphoneOutlined />, to: '/download-app' },
  ]
  return (
    <>
      <Button onClick={(e) => setAnchor(e.currentTarget)} endIcon={<KeyboardArrowDownRounded />} sx={{ color: c.ink, fontWeight: 600 }} aria-haspopup="menu">
        More
      </Button>
      <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)}
        slotProps={{ paper: { sx: { mt: 1, width: 290, borderRadius: `${tokens.radius.md}px`, boxShadow: tokens.shadow.pop, border: `1px solid ${c.line}` } } }}>
        {items.map((it) => (
          <MenuItem key={it.t} onClick={() => { setAnchor(null); nav(it.to) }} sx={{ py: 1.25, gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: `${tokens.radius.sm}px`, bgcolor: c.redTint, color: c.red, display: 'grid', placeItems: 'center' }}>{it.i}</Box>
            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{it.t}</Typography>
              <Typography variant="caption" color="text.secondary">{it.s}</Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

/* ------------------------------------------------------------------ Mega menu */

function MegaPanel({ dept, onClose }: { dept: Department; onClose: () => void }) {
  const many = dept.children.length > 8
  return (
    <Box
      onMouseLeave={onClose}
      sx={{
        position: 'absolute', left: 0, right: 0, top: '100%', zIndex: 1300, bgcolor: '#fff', borderTop: `1px solid ${c.line}`,
        boxShadow: '0 30px 60px -30px rgba(27,25,80,.35)', animation: 'megaIn .16s ease-out',
        '@keyframes megaIn': { from: { opacity: 0, transform: 'translateY(-6px)' }, to: { opacity: 1, transform: 'none' } },
      }}
    >
      <Container sx={{ py: 3.5, display: 'grid', gridTemplateColumns: '1fr 300px', gap: 4 }}>
        <Box>
          <Stack direction="row" alignItems="baseline" spacing={1.5} sx={{ mb: 2 }}>
            <Typography variant="h4" sx={{ color: c.navy }}>{dept.name}</Typography>
            <Typography variant="body2" color="text.secondary">{dept.count.toLocaleString()} products</Typography>
            <Button component={RouterLink} to={`/c/${dept.slug}`} onClick={onClose} size="small" endIcon={<ChevronRightRounded />} sx={{ color: c.red, ml: 'auto !important' }}>
              Shop all {dept.name}
            </Button>
          </Stack>
          <Box sx={{ columnCount: many ? 4 : 3, columnGap: 4, maxHeight: 420, overflowY: 'auto', pr: 1 }}>
            {dept.children.map((s) => (
              <Box key={s.slug} sx={{ breakInside: 'avoid', mb: 2 }}>
                <Box component={RouterLink} to={`/c/${dept.slug}?sub=${encodeURIComponent(s.name)}`} onClick={onClose}
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 600, fontSize: 14, color: c.ink, textDecoration: 'none', py: 0.5, '&:hover': { color: c.red } }}>
                  {s.name}
                  <Box component="span" sx={{ fontSize: 11.5, color: c.text3, fontWeight: 500 }}>{s.count}</Box>
                </Box>
                {s.children?.map((l3) => (
                  <Box key={l3.slug} component={RouterLink} to={`/c/${dept.slug}?sub=${encodeURIComponent(s.name)}`} onClick={onClose}
                    sx={{ display: 'block', fontSize: 13, color: c.text2, textDecoration: 'none', py: 0.4, '&:hover': { color: c.red, textDecoration: 'underline' } }}>
                    {l3.name}
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </Box>
        <Box component={RouterLink} to={`/c/${dept.slug}`} onClick={onClose}
          sx={{ position: 'relative', borderRadius: `${tokens.radius.lg}px`, overflow: 'hidden', minHeight: 280, display: 'block', bgcolor: c.navy, color: '#fff', textDecoration: 'none' }}>
          {dept.image && <Box component="img" src={dept.image} alt="" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }} />}
          <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 30%, rgba(27,25,80,.92))' }} />
          <Box sx={{ position: 'absolute', left: 20, right: 20, bottom: 20 }}>
            <Typography variant="overline" sx={{ color: c.saffron }}>{dept.tagline}</Typography>
            <Typography variant="h4" sx={{ color: '#fff' }}>Restock {dept.name.toLowerCase()} in minutes</Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

function CategoryBar() {
  const [open, setOpen] = useState<string | null>(null)
  const loc = useLocation()
  const dept = departments.find((d) => d.id === open)
  const link = (active: boolean) => ({
    display: 'flex', alignItems: 'center', gap: 0.25, height: 48, px: 1.25, fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap' as const,
    color: active ? c.red : c.ink, textDecoration: 'none', position: 'relative' as const, borderRadius: 1,
    '&::after': { content: '""', position: 'absolute', left: 10, right: 10, bottom: 0, height: 3, borderRadius: 3, bgcolor: active ? c.red : 'transparent' },
    '&:hover': { color: c.red },
  })
  return (
    <Box sx={{ position: 'relative', borderTop: `1px solid ${c.line}` }} onMouseLeave={() => setOpen(null)}>
      <Container sx={{ display: 'flex', alignItems: 'center', gap: 0.25, overflowX: 'auto' }}>
        <Box component={NavLink} to="/" end sx={link(loc.pathname === '/')} onMouseEnter={() => setOpen(null)}>Home</Box>
        {departments.map((d) => {
          const active = loc.pathname === `/c/${d.slug}`
          return (
            <Box key={d.id} component={RouterLink} to={`/c/${d.slug}`} sx={link(active || open === d.id)} onMouseEnter={() => setOpen(d.id)} onFocus={() => setOpen(d.id)} aria-expanded={open === d.id} aria-haspopup="true">
              {d.name}
              <KeyboardArrowDownRounded sx={{ fontSize: 18, opacity: 0.6, transition: 'transform .15s', transform: open === d.id ? 'rotate(180deg)' : 'none' }} />
            </Box>
          )
        })}
        <Box component={RouterLink} to="/flyers-offers" sx={{ ...link(loc.pathname.startsWith('/flyers')), ml: 'auto', color: c.red }} onMouseEnter={() => setOpen(null)}>
          <LocalOfferOutlined sx={{ fontSize: 18, mr: 0.5 }} /> Flyers &amp; Offers <NewBadge />
        </Box>
      </Container>
      {dept && <MegaPanel dept={dept} onClose={() => setOpen(null)} />}
    </Box>
  )
}

/* ------------------------------------------------------------------ Mobile drawer */

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [dept, setDept] = useState<Department | null>(null)
  const { review } = useApp()
  const nav = useNavigate()
  const go = (to: string) => {
    onClose()
    setDept(null)
    nav(to)
  }
  return (
    <Drawer open={open} onClose={onClose} PaperProps={{ sx: { width: 'min(88vw, 380px)' } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, minHeight: 64, borderBottom: `1px solid ${c.line}` }}>
        {dept ? (
          <Button startIcon={<ChevronLeftRounded />} onClick={() => setDept(null)} sx={{ color: c.ink, ml: -1 }}>All departments</Button>
        ) : (
          <Logo compact />
        )}
        <IconButton aria-label="Close menu" onClick={onClose}><CloseRounded /></IconButton>
      </Stack>
      {!dept ? (
        <Box sx={{ overflowY: 'auto' }}>
          <Box sx={{ p: 2, bgcolor: c.navyTint }}>
            {review.signedIn ? (
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar sx={{ bgcolor: c.navy, fontWeight: 700 }}>SR</Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 700 }}>{customer.businessName}</Typography>
                  <Typography variant="caption" color="text.secondary">MySupreme Member</Typography>
                </Box>
                <Button size="small" onClick={() => go('/account')}>Account</Button>
              </Stack>
            ) : (
              <Stack direction="row" spacing={1}>
                <Button fullWidth variant="contained" onClick={() => go('/account/signin')}>Sign in</Button>
                <Button fullWidth variant="outlined" color="secondary" onClick={() => go('/account/signin?mode=create')}>Open account</Button>
              </Stack>
            )}
          </Box>
          <List sx={{ py: 1 }}>
            <ListItemButton onClick={() => go('/')} sx={{ minHeight: 52 }}>
              <ListItemIcon><HomeOutlined /></ListItemIcon><ListItemText primary="Home" primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItemButton>
            <Typography variant="overline" sx={{ px: 2, pt: 1, display: 'block', color: c.text3 }}>Departments</Typography>
            {departments.map((d) => (
              <ListItemButton key={d.id} onClick={() => setDept(d)} sx={{ minHeight: 56 }}>
                <Box sx={{ width: 40, height: 40, borderRadius: `${tokens.radius.sm}px`, overflow: 'hidden', mr: 1.5, bgcolor: c.surface2, flexShrink: 0, display: 'grid', placeItems: 'center' }}>
                  {d.image ? <Box component="img" src={d.image} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <StorefrontOutlined sx={{ color: c.navy }} />}
                </Box>
                <ListItemText primary={d.name} secondary={`${d.count.toLocaleString()} products`} primaryTypographyProps={{ fontWeight: 600 }} />
                <ChevronRightRounded sx={{ color: c.text3 }} />
              </ListItemButton>
            ))}
            <Divider sx={{ my: 1 }} />
            <ListItemButton onClick={() => go('/flyers-offers')} sx={{ minHeight: 52, color: c.red }}>
              <ListItemIcon sx={{ color: c.red }}><LocalOfferOutlined /></ListItemIcon>
              <ListItemText primary={<>Flyers &amp; Offers <NewBadge /></>} primaryTypographyProps={{ fontWeight: 700 }} />
            </ListItemButton>
            {[['Become a Supplier', '/become-a-supplier', <HandshakeOutlined />], ['24x7 Customer Care', '/contact', <SupportAgentOutlined />], ['Download App', '/download-app', <PhoneIphoneOutlined />]].map(([t, to, i]) => (
              <ListItemButton key={t as string} onClick={() => go(to as string)} sx={{ minHeight: 52 }}>
                <ListItemIcon>{i}</ListItemIcon><ListItemText primary={t as string} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      ) : (
        <Box sx={{ overflowY: 'auto' }}>
          <Box sx={{ position: 'relative', height: 120, bgcolor: c.navy, overflow: 'hidden' }}>
            {dept.image && <Box component="img" src={dept.image} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }} />}
            <Box sx={{ position: 'absolute', left: 16, bottom: 14, color: '#fff' }}>
              <Typography variant="h3" sx={{ color: '#fff' }}>{dept.name}</Typography>
              <Typography variant="caption">{dept.count.toLocaleString()} products</Typography>
            </Box>
          </Box>
          <List>
            <ListItemButton onClick={() => go(`/c/${dept.slug}`)} sx={{ minHeight: 52, color: c.red }}>
              <ListItemText primary={`Shop all ${dept.name}`} primaryTypographyProps={{ fontWeight: 700 }} />
              <ChevronRightRounded />
            </ListItemButton>
            {dept.children.map((s) => (
              <Box key={s.slug}>
                <ListItemButton onClick={() => go(`/c/${dept.slug}?sub=${encodeURIComponent(s.name)}`)} sx={{ minHeight: 52 }}>
                  <ListItemText primary={s.name} primaryTypographyProps={{ fontWeight: 600 }} />
                  <Typography variant="caption" color="text.secondary">{s.count}</Typography>
                </ListItemButton>
                {s.children && (
                  <Stack direction="row" flexWrap="wrap" gap={1} sx={{ px: 2, pb: 1.5 }}>
                    {s.children.map((l3) => (
                      <Button key={l3.slug} size="small" variant="outlined" color="inherit" onClick={() => go(`/c/${dept.slug}?sub=${encodeURIComponent(s.name)}`)} sx={{ borderColor: c.line, borderRadius: 999, fontWeight: 500, minHeight: 36 }}>
                        {l3.name}
                      </Button>
                    ))}
                  </Stack>
                )}
              </Box>
            ))}
          </List>
        </Box>
      )}
    </Drawer>
  )
}

/* ------------------------------------------------------------------ Mobile bottom nav */

const NAV_H = 64
const shopPaths = /^\/(all-categories|c\/|shop\/|p\/|search\/|brands|flyers-offers|compare)/

/** Below 800px: Home | Shop | Cart | My Lists | More. Publishes --nav-h so sticky bars, FABs and toasts sit above it. */
function BottomNav({ onMore }: { onMore: () => void }) {
  const { pathname } = useLocation()
  const { cartCount } = useApp()
  const tabs = [
    { label: 'Home', to: '/', on: pathname === '/', icon: [HomeOutlined, HomeRounded] },
    { label: 'Shop', to: '/all-categories', on: shopPaths.test(pathname), icon: [StorefrontOutlined, StorefrontRounded] },
    { label: 'Cart', to: '/cart', on: pathname === '/cart', icon: [ShoppingCartOutlined, ShoppingCartRounded], badge: cartCount },
    { label: 'My Lists', to: '/my-lists', on: pathname === '/my-lists', icon: [FavoriteBorderRounded, FavoriteRounded] },
  ]
  const tab = (on: boolean) => ({
    display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', gap: 0.25, minWidth: 0, height: NAV_H,
    color: on ? c.red : c.text2, textDecoration: 'none', fontSize: 11.5, fontWeight: on ? 700 : 500, border: 0, bgcolor: 'transparent', font: 'inherit', cursor: 'pointer',
    position: 'relative' as const, '&::before': { content: '""', position: 'absolute', top: 0, left: '28%', right: '28%', height: 3, borderRadius: '0 0 3px 3px', bgcolor: on ? c.red : 'transparent' },
    '& svg': { fontSize: 24 },
  })
  return (
    <>
      <GlobalStyles styles={(t) => ({ ':root': { '--nav-h': `${NAV_H}px` }, [t.breakpoints.up('md')]: { ':root': { '--nav-h': '0px' } } })} />
      <Box component="nav" aria-label="Main" sx={{
        display: { xs: 'grid', md: 'none' }, gridTemplateColumns: 'repeat(5, minmax(0,1fr))', position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 1145,
        bgcolor: '#fff', borderTop: `1px solid ${c.line}`, boxShadow: '0 -4px 16px -8px rgba(17,24,39,.12)', pb: 'env(safe-area-inset-bottom)',
      }}>
        {tabs.map((t) => {
          const Icon = t.icon[t.on ? 1 : 0]
          return (
            <Box key={t.label} component={RouterLink} to={t.to} aria-current={t.on ? 'page' : undefined} sx={tab(t.on)}>
              <Badge badgeContent={t.badge || undefined} color="primary" max={99} sx={{ '& .MuiBadge-badge': { fontWeight: 700, border: '2px solid #fff', fontSize: 10.5, minWidth: 20, height: 20 } }}>
                <Icon />
              </Badge>
              <span>{t.label}</span>
            </Box>
          )
        })}
        <Box component="button" onClick={onMore} aria-label="More: departments, account and help" sx={tab(false)}>
          <MenuRounded /><span>More</span>
        </Box>
      </Box>
    </>
  )
}

/* ------------------------------------------------------------------ Header */

export default function Header() {
  const theme = useTheme()
  const desktop = useMediaQuery(theme.breakpoints.up('lg'))
  const { cartCount, lists, review } = useApp()
  const [drawer, setDrawer] = useState(false)
  const { pathname } = useLocation()

  return (
    <Box component="header" sx={{ position: 'sticky', top: 0, zIndex: 1200, bgcolor: '#fff', boxShadow: '0 1px 0 rgba(17,24,39,.06)' }}>
      <UtilityStrip />
      <Container sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, lg: 3 }, minHeight: { xs: 60, lg: 80 } }}>
        {!desktop && (
          <IconButton aria-label="Open menu" onClick={() => setDrawer(true)} sx={{ ml: -1, width: 44, height: 44 }}>
            <MenuRounded />
          </IconButton>
        )}
        <Box component={RouterLink} to="/" sx={{ textDecoration: 'none', flexShrink: 0, display: 'flex' }}>
          <Logo compact={!desktop} />
        </Box>
        {desktop && <Box sx={{ flex: 1, maxWidth: 760 }}><SearchBar /></Box>}
        <Stack direction="row" alignItems="center" spacing={{ xs: 0, lg: 0.5 }} sx={{ ml: 'auto' }}>
          {desktop && <MoreMenu />}
          <HeaderIcon to="/my-lists" label="My Lists" icon={<FavoriteBorderRounded />} badge={lists[0]?.items.length || undefined} showLabel={desktop} />
          <HeaderIcon to="/cart" label="Cart" icon={review.loading ? <Skeleton variant="circular" width={24} height={24} /> : <ShoppingCartOutlined />} badge={cartCount || undefined} showLabel={desktop} />
          <AccountMenu showLabel={desktop} />
        </Stack>
      </Container>
      {!desktop && (
        <Container sx={{ pb: 1.25 }}>
          <SearchBar dense />
        </Container>
      )}
      {desktop && <CategoryBar />}
      <MobileDrawer open={drawer} onClose={() => setDrawer(false)} />
      {/* Checkout keeps its own sticky pay bar, so no bottom nav there. */}
      {!(pathname.startsWith('/checkout') && !pathname.includes('success')) && <BottomNav onMore={() => setDrawer(true)} />}
    </Box>
  )
}

export { photo }
