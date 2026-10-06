import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  Badge, Box, Button, Divider, Drawer, IconButton, InputAdornment, InputBase, List, ListItemButton, ListItemText, Menu, MenuItem, Typography,
} from '@mui/material'
import MicIcon from '@mui/icons-material/Mic'
import SearchIcon from '@mui/icons-material/Search'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { departments, type Category } from '../../lib/data'
import CategoryMenu, { CategoryCircle, POPULAR, deptIcons, preloadCategoryImages, tilesFor } from './CategoryMenu'
import { useCart } from '../../lib/cart'

/* ------------------------------------------------------------------ Search box (desktop + mobile) */

function SearchBox({ mobile }: { mobile?: boolean }) {
  const router = useRouter()
  const [q, setQ] = useState('')
  const submit = () => q.trim() && router.push(`/search/${encodeURIComponent(q.trim())}`)
  return (
    <InputBase
      value={q}
      onChange={(e) => setQ(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && submit()}
      placeholder={mobile ? 'Search...' : 'Search by product or SKU'}
      inputProps={{ 'aria-label': 'Search by product or SKU' }}
      endAdornment={
        <InputAdornment position="end" sx={{ gap: 0.25 }}>
          <IconButton size="small" aria-label="Search with voice" sx={{ color: 'rgba(0,0,0,.38)' }}>
            <MicIcon sx={{ fontSize: 20 }} />
          </IconButton>
          <IconButton size="small" aria-label="Search with an image" sx={{ color: 'primary.main' }}>
            <PhotoCameraIcon sx={{ fontSize: 22 }} />
          </IconButton>
          <SearchIcon onClick={submit} aria-label="Search" role="button" sx={{ color: 'primary.main', cursor: 'pointer', fontSize: 22 }} />
        </InputAdornment>
      }
      sx={{
        px: 2, border: '1px solid #E5E7EB', width: '100%', borderRadius: mobile ? '8px' : '10px', height: mobile ? '40px' : '46px',
        backgroundColor: '#F9FAFB', color: '#374151', fontSize: '14px', transition: 'all 0.2s ease',
        '&:focus-within': { borderColor: 'primary.main', backgroundColor: '#FFFFFF', boxShadow: '0 0 0 3px rgba(255, 0, 0, 0.08)' },
      }}
    />
  )
}

/* ------------------------------------------------------------------ Right-side actions */

const iconLink = {
  display: 'flex', alignItems: 'center', gap: 0.75, px: 1, py: 0.75, borderRadius: '8px', color: '#0C0C0C', textDecoration: 'none',
  fontSize: '14px', fontWeight: 500, transition: 'color 0.2s ease', '&:hover': { color: 'primary.main' },
} as const

function MoreMenu() {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  return (
    <>
      <Box component="button" onClick={(e: React.MouseEvent<HTMLElement>) => setAnchor(e.currentTarget)} sx={{ ...iconLink, border: 0, bgcolor: 'transparent', cursor: 'pointer', font: 'inherit' }}>
        More <KeyboardArrowDownIcon sx={{ fontSize: 18 }} />
      </Box>
      <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)} slotProps={{ paper: { sx: { borderRadius: '10px', mt: 1, minWidth: 220 } } }}>
        {[['Become a Supplier', '/become-a-supplier'], ['24x7 Customer Care', '/service/contact-us'], ['Download App', '/download-app']].map(([t, href]) => (
          <MenuItem key={t} component={Link} href={href} onClick={() => setAnchor(null)} sx={{ fontSize: 14 }}>{t}</MenuItem>
        ))}
      </Menu>
    </>
  )
}

function CartLink({ mobile }: { mobile?: boolean }) {
  const { count } = useCart()
  return (
    <Box component={Link} href="/cart" sx={iconLink} aria-label={`Cart, ${count} items`}>
      <Badge badgeContent={count} color="primary" sx={{ '& .MuiBadge-badge': { fontSize: '10px', height: '16px', minWidth: '16px', px: 0.5 } }}>
        <ShoppingCartOutlinedIcon sx={{ fontSize: mobile ? 24 : 22 }} />
      </Badge>
      {!mobile && 'Cart'}
    </Box>
  )
}

/* ------------------------------------------------------------------ Red category bar + mega menu */

function CategoryBar() {
  const { pathname } = useRouter()
  // Which rail row the dropdown shows; null = closed. Hovering a department opens it on that department.
  const [active, setActive] = useState<string | null>(null)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])
  useEffect(() => setActive(null), [pathname])
  // Small open delay so sweeping the mouse across the bar doesn't flash the panel.
  const openOn = (key: string) => {
    window.clearTimeout(timer.current)
    if (active) setActive(key)
    else timer.current = window.setTimeout(() => setActive(key), 120)
  }
  const close = () => {
    window.clearTimeout(timer.current)
    setActive(null)
  }
  const item = (on = false) => ({
    minHeight: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', px: { lg: 0.25, xl: 0.5 }, flexShrink: 1, minWidth: 0,
    bgcolor: on ? 'black' : 'transparent', '&:hover': { bgcolor: 'black' },
  }) as const
  const btn = {
    color: '#fff', textTransform: 'none', fontWeight: 'bold', lineHeight: 1.2, whiteSpace: 'nowrap', minWidth: 'auto',
    fontSize: { xs: '11px', xl: '14px' }, px: { xs: 0.5, lg: 0.8, xl: 1.5 }, '@media (min-width:1300px)': { fontSize: '13px' },
    '&:hover': { color: '#fff', bgcolor: 'transparent' }, '&.Mui-focusVisible': { outline: '2px solid #fff', outlineOffset: -2 },
  } as const
  return (
    <Box onMouseLeave={close} onMouseEnter={preloadCategoryImages} onFocus={preloadCategoryImages} sx={{ display: { xs: 'none', lg: 'block' }, position: 'relative' }}>
      <Box component="nav" aria-label="Departments" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 48, bgcolor: 'primary.main', color: 'white', px: { lg: 1, xl: 4 } }}>
        {/* NEW (Concept B) — opens the full category panel on "Popular categories" */}
        <Box sx={item(active === POPULAR)} onMouseEnter={() => openOn(POPULAR)}>
          <Button onClick={() => (active ? close() : setActive(POPULAR))} aria-expanded={!!active} aria-haspopup="true" startIcon={<MenuIcon />} sx={{ ...btn, '& .MuiButton-startIcon': { mr: 0.5 } }}>
            All Categories
          </Button>
        </Box>
        {pathname !== '/' && (
          <Box sx={item()} onMouseEnter={close}><Button component={Link} href="/" sx={btn}>Home</Button></Box>
        )}
        {departments.map((d) => (
          <Box key={d.uid} sx={item(active === d.url_key)} onMouseEnter={() => openOn(d.url_key)}>
            <Button component={Link} href={`/${d.url_key}`} onFocus={() => setActive(d.url_key)} sx={btn}>{d.name}</Button>
            {d.children.length > 0 && <KeyboardArrowDownIcon sx={{ transition: 'transform .15s', transform: active === d.url_key ? 'rotate(180deg)' : 'none' }} />}
          </Box>
        ))}
        <Box sx={item()} onMouseEnter={close}>
          <Button component={Link} href="/flyers-offers" sx={{ ...btn, gap: 0.75 }}>
            Flyers &amp; Offers
            <Box component="span" sx={{ bgcolor: '#fff', color: 'primary.main', borderRadius: '40px', px: 0.75, fontSize: '10px', fontWeight: 800, lineHeight: '16px' }}>NEW</Box>
          </Button>
        </Box>
      </Box>
      {active && <CategoryMenu active={active} onActive={setActive} onClose={close} />}
    </Box>
  )
}

/* ------------------------------------------------------------------ Mobile drawer */

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [dept, setDept] = useState<Category | null>(null)
  const router = useRouter()
  const go = (href: string) => {
    onClose()
    setDept(null)
    router.push(href)
  }
  return (
    <Drawer open={open} onClose={onClose} PaperProps={{ sx: { width: 'min(85vw, 340px)' } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, height: 60 }}>
        {dept ? (
          <Button startIcon={<ChevronLeftIcon />} onClick={() => setDept(null)} sx={{ color: '#0C0C0C', textTransform: 'none', fontWeight: 600, ml: -1 }}>{dept.name}</Button>
        ) : (
          <Typography sx={{ fontWeight: 700, fontSize: 18 }}>Menu</Typography>
        )}
        <IconButton aria-label="Close menu" onClick={onClose}><CloseIcon /></IconButton>
      </Box>
      <Divider />
      <List disablePadding>
        {!dept ? (
          <>
            {departments.map((d) => (
              <ListItemButton key={d.uid} onClick={() => (d.children.length ? setDept(d) : go(`/${d.url_key}`))} sx={{ minHeight: 52, gap: 1.75 }}>
                {(() => { const Icon = deptIcons[d.url_key]; return Icon ? <Icon sx={{ fontSize: 22, color: '#4B5563' }} /> : null })()}
                <ListItemText primary={d.name} primaryTypographyProps={{ fontSize: 15, fontWeight: 500 }} />
                <ChevronRightIcon sx={{ color: '#9CA3AF' }} />
              </ListItemButton>
            ))}
            <ListItemButton onClick={() => go('/flyers-offers')} sx={{ minHeight: 48 }}>
              <ListItemText primary="Flyers & Offers" primaryTypographyProps={{ fontSize: 15, fontWeight: 600, color: 'primary.main' }} />
              <ChevronRightIcon sx={{ color: '#9CA3AF' }} />
            </ListItemButton>
          </>
        ) : (
          <>
            <ListItemButton onClick={() => go(`/${dept.url_key}`)} sx={{ minHeight: 48 }}>
              <ListItemText primary={`All ${dept.name}`} primaryTypographyProps={{ fontSize: 15, fontWeight: 700, color: 'primary.main' }} />
            </ListItemButton>
            {/* Concept B — same round picture tiles as the desktop dropdown */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 0.5, px: 1, py: 1.5 }}>
              {tilesFor(dept).map((t) => <CategoryCircle key={t.href} tile={t} size={76} onNavigate={() => { onClose(); setDept(null) }} />)}
            </Box>
          </>
        )}
      </List>
    </Drawer>
  )
}

/* ------------------------------------------------------------------ Header */

/**
 * `categoryBar` mirrors the live pages that pass `menuItems` (cart, brands, about, contact don't).
 * `minimal` is the logo-only header the live sign-in page uses.
 */
export default function Header({ categoryBar = true, minimal = false }: { categoryBar?: boolean; minimal?: boolean }) {
  const [drawer, setDrawer] = useState(false)
  if (minimal) {
    return (
      <Box component="header" sx={{ bgcolor: 'white', display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' }, height: { xs: 72, md: 88 }, px: { md: 3, lg: '40px' } }}>
        <Link href="/" aria-label="MySupreme home">
          <Box component="img" src="/assets/header_logo.svg" alt="MySupreme Cash & Carry" sx={{ height: { xs: '50px', md: '65px' }, width: 'auto', display: 'block' }} />
        </Link>
      </Box>
    )
  }
  return (
    <Box component="header" sx={{ position: 'sticky', top: 0, zIndex: 1100, bgcolor: 'white' }}>
      {/* Desktop row (≥800 like the real site; category bar only ≥1100) */}
      <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', height: 88, px: { md: 3, lg: '40px' }, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: { md: 2, lg: 4 } }}>
          <IconButton aria-label="Open menu" onClick={() => setDrawer(true)} sx={{ display: { md: 'inline-flex', lg: 'none' }, mr: 1, color: 'primary.main' }}>
            <MenuIcon sx={{ fontSize: 32 }} />
          </IconButton>
          <Link href="/" aria-label="MySupreme home">
            <Box component="img" src="/assets/header_logo.svg" alt="MySupreme Cash & Carry" sx={{ height: '65px', width: 'auto', display: 'block' }} />
          </Link>
        </Box>
        <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: { md: 'center', lg: 'flex-start' }, ml: { lg: 2 }, px: { lg: 1 } }}>
          <Box sx={{ width: '100%', maxWidth: { md: '450px', lg: '560px', xl: '680px' } }}>
            <SearchBox />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { md: 0.5, lg: 1.5 }, ml: 2 }}>
          <Box sx={{ display: { md: 'none', lg: 'flex' } }}><MoreMenu /></Box>
          <Box component={Link} href="/wishlist" sx={iconLink}>
            <FavoriteBorderOutlinedIcon sx={{ fontSize: 21 }} /> <Box component="span" sx={{ display: { md: 'none', lg: 'inline' } }}>Favorites</Box>
          </Box>
          <CartLink />
          <Button
            component={Link}
            href="/account/signin"
            variant="contained"
            disableElevation
            sx={{ height: '38px', borderRadius: '50px', px: 2.5, textTransform: 'none', fontSize: '14px', fontWeight: 600, ml: 1, bgcolor: 'primary.main', '&:hover': { bgcolor: '#e60000' } }}
          >
            Login
          </Button>
        </Box>
      </Box>

      {/* Mobile row (<800) */}
      <Box sx={{ display: { xs: 'block', md: 'none' }, pt: 1.5, pb: 1, px: '15px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton aria-label="Open menu" onClick={() => setDrawer(true)} sx={{ color: 'primary.main', ml: -1 }}>
              <MenuIcon sx={{ fontSize: 34 }} />
            </IconButton>
            <Link href="/" aria-label="MySupreme home">
              <Box component="img" src="/assets/header_logo.svg" alt="MySupreme Cash & Carry" sx={{ height: '42px', width: 'auto', display: 'block' }} />
            </Link>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box component={Link} href="/wishlist" sx={iconLink} aria-label="Favorites"><FavoriteBorderOutlinedIcon sx={{ fontSize: 24 }} /></Box>
            <CartLink mobile />
            <Box component={Link} href="/account/signin" sx={iconLink} aria-label="Account"><AccountCircleIcon sx={{ fontSize: 26 }} /></Box>
          </Box>
        </Box>
        <Box sx={{ mt: 1 }}><SearchBox mobile /></Box>
      </Box>

      {categoryBar && <CategoryBar />}
      <MobileDrawer open={drawer} onClose={() => setDrawer(false)} />
    </Box>
  )
}
