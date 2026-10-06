import { useState, type ReactNode } from 'react'
import { Avatar, Box, Button, Drawer, IconButton, Skeleton, Stack, Typography } from '@mui/material'
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom'
import BadgeOutlined from '@mui/icons-material/BadgeOutlined'
import ApartmentOutlined from '@mui/icons-material/ApartmentOutlined'
import PlaceOutlined from '@mui/icons-material/PlaceOutlined'
import ShoppingBagOutlined from '@mui/icons-material/ShoppingBagOutlined'
import StorefrontOutlined from '@mui/icons-material/StorefrontOutlined'
import RequestQuoteOutlined from '@mui/icons-material/RequestQuoteOutlined'
import ReceiptLongOutlined from '@mui/icons-material/ReceiptLongOutlined'
import PaymentsOutlined from '@mui/icons-material/PaymentsOutlined'
import AssignmentReturnOutlined from '@mui/icons-material/AssignmentReturnOutlined'
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined'
import FavoriteBorderRounded from '@mui/icons-material/FavoriteBorderRounded'
import LogoutRounded from '@mui/icons-material/LogoutRounded'
import SpaceDashboardOutlined from '@mui/icons-material/SpaceDashboardOutlined'
import MenuOpenRounded from '@mui/icons-material/MenuOpenRounded'
import CloseRounded from '@mui/icons-material/CloseRounded'
import WorkspacePremiumRounded from '@mui/icons-material/WorkspacePremiumRounded'
import MailOutlineRounded from '@mui/icons-material/MailOutlineRounded'
import PhoneOutlined from '@mui/icons-material/PhoneOutlined'
import LockOutlined from '@mui/icons-material/LockOutlined'
import { tokens } from '../../theme'
import { customer } from '../../data/account'
import { useApp } from '../../state/AppState'
import { Container, EmptyState } from '../../components/ui'
import { Breadcrumbs } from '../../components/Shared'

const c = tokens.color

type Item = { label: string; to: string; icon: ReactNode }
type Group = { title: string; items: Item[] }

export const accountMenu: Group[] = [
  { title: 'Overview', items: [{ label: 'Dashboard', to: '/account', icon: <SpaceDashboardOutlined /> }] },
  {
    title: 'Profile & Overview',
    items: [
      { label: 'Personal info', to: '/account/profile', icon: <BadgeOutlined /> },
      { label: 'Company information', to: '/account/company', icon: <ApartmentOutlined /> },
      { label: 'Address book', to: '/account/addresses', icon: <PlaceOutlined /> },
    ],
  },
  {
    title: 'Orders & Quotes',
    items: [
      { label: 'Online orders', to: '/account/orders?channel=online', icon: <ShoppingBagOutlined /> },
      { label: 'Direct-store / POS orders', to: '/account/orders?channel=store', icon: <StorefrontOutlined /> },
      { label: 'Quotes & estimates', to: '/account/customerdashbord/quotes', icon: <RequestQuoteOutlined /> },
    ],
  },
  {
    title: 'Billing & Statements',
    items: [
      { label: 'Invoices & bills', to: '/account/customerdashbord/invoices', icon: <ReceiptLongOutlined /> },
      { label: 'Payments history', to: '/account/customerdashbord/payments', icon: <PaymentsOutlined /> },
      { label: 'Credit notes', to: '/account/customerdashbord/credit-notes', icon: <AssignmentReturnOutlined /> },
      { label: 'Account statement', to: '/account/customerdashbord/statement', icon: <DescriptionOutlined /> },
    ],
  },
  { title: 'Wishlist & Favorites', items: [{ label: 'Wishlist & Favorites', to: '/wishlist', icon: <FavoriteBorderRounded /> }] },
]

function useIsActive() {
  const { pathname, search } = useLocation()
  return (to: string) => {
    const [p, q] = to.split('?')
    if (p === '/account') return pathname === '/account'
    if (p === '/account/orders') {
      if (!pathname.startsWith('/account/orders')) return false
      const ch = new URLSearchParams(search).get('channel')
      return q ? q === `channel=${ch}` : !ch
    }
    if (p === '/account/customerdashbord/invoices') return pathname === '/account/customerdashbord' || pathname === p
    return pathname === p
  }
}

function SideMenu({ onNavigate }: { onNavigate?: () => void }) {
  const isActive = useIsActive()
  const { setReview } = useApp()
  return (
    <Box component="nav" aria-label="Account">
      {accountMenu.map((g) => (
        <Box key={g.title} sx={{ mb: 1.5 }}>
          {g.items.length > 1 && (
            <Typography variant="overline" sx={{ display: 'block', px: 1.5, color: c.text3, fontSize: 11 }}>{g.title}</Typography>
          )}
          {g.items.map((it) => {
            const active = isActive(it.to)
            return (
              <Box
                key={it.to}
                component={RouterLink}
                to={it.to}
                onClick={onNavigate}
                aria-current={active ? 'page' : undefined}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1.5, minHeight: 44, px: 1.5, borderRadius: `${tokens.radius.sm}px`,
                  textDecoration: 'none', fontSize: 14, fontWeight: active ? 700 : 500, position: 'relative',
                  color: active ? c.red : c.ink, bgcolor: active ? c.redTint : 'transparent',
                  '& svg': { fontSize: 20, color: active ? c.red : c.text2 },
                  '&:hover': { bgcolor: active ? c.redTint : c.bg },
                  '&::before': active ? { content: '""', position: 'absolute', left: 0, top: 10, bottom: 10, width: 3, borderRadius: 3, bgcolor: c.red } : {},
                }}
              >
                {it.icon}
                {it.label}
              </Box>
            )
          })}
        </Box>
      ))}
      <Box
        component="button"
        onClick={() => { onNavigate?.(); setReview({ signedIn: false }) }}
        sx={{
          display: 'flex', alignItems: 'center', gap: 1.5, minHeight: 44, px: 1.5, width: '100%', border: 0, bgcolor: 'transparent', cursor: 'pointer',
          font: 'inherit', fontSize: 14, fontWeight: 600, color: c.text2, borderRadius: `${tokens.radius.sm}px`, borderTop: `1px solid ${c.line}`, mt: 1, pt: 1,
          '&:hover': { color: c.red, bgcolor: c.bg },
        }}
      >
        <LogoutRounded sx={{ fontSize: 20 }} /> Logout
      </Box>
    </Box>
  )
}

function ProfileStrip() {
  const { review } = useApp()
  if (review.loading) {
    return (
      <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 3 }}>
        <Skeleton variant="circular" width={64} height={64} />
        <Box sx={{ flex: 1 }}><Skeleton width={260} height={34} /><Skeleton width={340} /></Box>
      </Stack>
    )
  }
  return (
    <Box
      sx={{
        position: 'relative', overflow: 'hidden', borderRadius: `${tokens.radius.lg}px`, color: '#fff', p: { xs: 2, md: 3 },
        background: `linear-gradient(115deg, ${c.navyDark} 0%, ${c.navy} 60%, #4B47A8 100%)`,
      }}
    >
      <Box aria-hidden sx={{ position: 'absolute', right: -60, top: -80, width: 260, height: 260, borderRadius: '50%', bgcolor: 'rgba(255,255,255,.06)' }} />
      <Box aria-hidden sx={{ position: 'absolute', right: 120, bottom: -120, width: 220, height: 220, borderRadius: '50%', bgcolor: 'rgba(255,197,49,.10)' }} />
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1.5, md: 2.5 }} alignItems={{ md: 'center' }} sx={{ position: 'relative' }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
          <Avatar sx={{ width: { xs: 52, md: 64 }, height: { xs: 52, md: 64 }, bgcolor: '#fff', color: c.navy, fontWeight: 800, fontSize: { xs: 18, md: 22 } }}>SR</Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
              <Typography component="h1" sx={{ fontWeight: 800, fontSize: { xs: 20, md: 26 }, color: '#fff', lineHeight: 1.2 }}>{customer.businessName}</Typography>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, bgcolor: c.saffron, color: c.navyDark, fontSize: 11.5, fontWeight: 800, px: 1, py: 0.25, borderRadius: 999 }}>
                <WorkspacePremiumRounded sx={{ fontSize: 15 }} /> MySupreme Member
              </Box>
            </Stack>
            <Typography sx={{ fontSize: 13, opacity: 0.85, mt: 0.25 }}>
              {customer.firstName} {customer.lastName} · {customer.businessCategory} · Member since {new Date(customer.memberSince).toLocaleDateString('en-CA', { month: 'long', year: 'numeric' })}
            </Typography>
          </Box>
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 0.5, sm: 2.5 }} sx={{ fontSize: 13, opacity: 0.92, pl: { xs: 0, md: 0 } }}>
          <Stack direction="row" spacing={0.75} alignItems="center"><MailOutlineRounded sx={{ fontSize: 17 }} /><span>{customer.email}</span></Stack>
          <Stack direction="row" spacing={0.75} alignItems="center"><PhoneOutlined sx={{ fontSize: 17 }} /><span>{customer.phone}</span></Stack>
        </Stack>
      </Stack>
    </Box>
  )
}

function crumbFor(pathname: string, search: string) {
  const ch = new URLSearchParams(search).get('channel')
  if (pathname.startsWith('/account/orders/')) return [{ label: 'Orders', to: '/account/orders' }, { label: `Order #${pathname.split('/').pop()}` }]
  if (pathname.startsWith('/account/orders')) return [{ label: ch === 'store' ? 'Direct-store orders' : ch === 'online' ? 'Online orders' : 'Orders' }]
  if (pathname.startsWith('/account/customerdashbord')) return [{ label: 'Credit & billing' }]
  if (pathname === '/account/addresses') return [{ label: 'Address book' }]
  if (pathname === '/account/profile') return [{ label: 'Personal info' }]
  if (pathname === '/account/company') return [{ label: 'Company information' }]
  return []
}

export default function AccountLayout() {
  const { review } = useApp()
  const { pathname, search } = useLocation()
  const [drawer, setDrawer] = useState(false)
  const isActive = useIsActive()

  if (!review.signedIn) {
    return (
      <Container>
        <EmptyState
          icon={<LockOutlined />}
          title="Sign in to your business account"
          body="See your orders, invoices, credit and saved addresses — and reorder your usual items in seconds."
          action="Sign in"
          href="/account/signin"
          secondary={<Button variant="outlined" color="secondary" size="large" component={RouterLink} to="/account/signin?mode=create">Open a business account</Button>}
        />
      </Container>
    )
  }

  const quick = accountMenu.flatMap((g) => g.items)
  const crumbs = [{ label: 'My account', to: '/account' }, ...crumbFor(pathname, search)]

  return (
    <Container sx={{ pb: 6 }}>
      <Breadcrumbs items={crumbs.length === 1 ? [{ label: 'My account' }] : crumbs} sx={{ pt: 2, pb: 1.5 }} />
      <ProfileStrip />

      {/* Mobile: menu button + quick chips */}
      <Box sx={{ display: { xs: 'block', md: 'none' }, mt: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Button variant="outlined" color="secondary" startIcon={<MenuOpenRounded />} onClick={() => setDrawer(true)} sx={{ flexShrink: 0, bgcolor: '#fff' }}>
            Menu
          </Button>
          <Box className="no-scrollbar" sx={{ display: 'flex', gap: 1, overflowX: 'auto', mr: -2, pr: 2 }}>
            {quick.map((it) => {
              const a = isActive(it.to)
              return (
                <Box key={it.to} component={RouterLink} to={it.to}
                  sx={{
                    flexShrink: 0, display: 'inline-flex', alignItems: 'center', minHeight: 44, px: 1.75, borderRadius: 999, fontSize: 13, fontWeight: 600,
                    textDecoration: 'none', whiteSpace: 'nowrap', border: `1.5px solid ${a ? c.red : c.line}`, color: a ? c.red : c.ink, bgcolor: a ? c.redTint : '#fff',
                  }}>
                  {it.label}
                </Box>
              )
            })}
          </Box>
        </Stack>
        <Drawer anchor="left" open={drawer} onClose={() => setDrawer(false)} PaperProps={{ sx: { width: 'min(86vw, 340px)' } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2, minHeight: 60, borderBottom: `1px solid ${c.line}` }}>
            <Typography variant="h5">My account</Typography>
            <IconButton aria-label="Close account menu" onClick={() => setDrawer(false)}><CloseRounded /></IconButton>
          </Stack>
          <Box sx={{ p: 1.5, overflowY: 'auto' }}><SideMenu onNavigate={() => setDrawer(false)} /></Box>
        </Drawer>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', md: '250px minmax(0,1fr)', lg: '270px minmax(0,1fr)' }, gap: { xs: 2, md: 3 }, mt: { xs: 2, md: 3 }, alignItems: 'start' }}>
        <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'sticky', top: 184, bgcolor: '#fff', border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.lg}px`, p: 1.5 }}>
          <SideMenu />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Outlet />
        </Box>
      </Box>
    </Container>
  )
}
