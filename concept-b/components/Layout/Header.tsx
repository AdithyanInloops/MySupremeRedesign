import { useState } from 'react'
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
  const [hover, setHover] = useState<string | null>(null)
  const item = {
    minHeight: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', px: 0.5,
    '&:hover': { bgcolor: 'black' },
  } as const
  const btn = {
    color: '#fff', textTransform: 'none', fontWeight: 'bold', lineHeight: 1.2, whiteSpace: 'nowrap', minWidth: 'auto',
    fontSize: { xs: '11px', xl: '14px' }, px: { xs: 0.5, lg: 0.8, xl: 1.5 }, '@media (min-width:1300px)': { fontSize: '13px' },
    '&:hover': { color: '#fff', bgcolor: 'transparent' }, '&.Mui-focusVisible': { outline: '2px solid #fff', outlineOffset: -2 },
  } as const
  return (
    <Box component="nav" aria-label="Departments" sx={{ display: { xs: 'none', lg: 'flex' }, position: 'relative', justifyContent: 'center', alignItems: 'center', height: 48, bgcolor: 'primary.main', color: 'white', px: 4 }}>
      {pathname !== '/' && (
        <Box sx={item}><Button component={Link} href="/" sx={btn}>Home</Button></Box>
      )}
      {departments.map((d) => (
        <Box key={d.uid} sx={item} onMouseEnter={() => setHover(d.uid)} onMouseLeave={() => setHover(null)}>
          <Button component={Link} href={`/${d.url_key}`} sx={btn}>{d.name}</Button>
          {d.children.length > 0 && <KeyboardArrowDownIcon />}
          {hover === d.uid && d.children.length > 0 && <MegaMenu dept={d} />}
        </Box>
      ))}
      <Box sx={item}>
        <Button component={Link} href="/flyers-offers" sx={{ ...btn, gap: 0.75 }}>
          Flyers &amp; Offers
          <Box component="span" sx={{ bgcolor: '#fff', color: 'primary.main', borderRadius: '40px', px: 0.75, fontSize: '10px', fontWeight: 800, lineHeight: '16px' }}>NEW</Box>
        </Button>
      </Box>
    </Box>
  )
}

function MegaMenu({ dept }: { dept: Category }) {
  return (
    <Box
      sx={{
        position: 'absolute', top: 'calc(100% + 2px)', left: 0, width: '100%', maxHeight: '70vh', overflowY: 'auto', bgcolor: '#fff',
        boxShadow: '0px 12px 30px rgba(0,0,0,0.15)', zIndex: 1200, borderRadius: '0 0 12px 12px',
      }}
    >
      <Box sx={{ columnWidth: '150px', columnGap: '5px', p: '12px 15px 25px' }}>
        {dept.children.map((sub) => (
          <Box key={sub.url_key} sx={{ mb: 1, breakInside: 'avoid' }}>
            <Box component={Link} href={`/${dept.url_key}?sub=${sub.url_key}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
              <Typography sx={{ fontSize: '14px', fontWeight: 700, p: '4px 6px', borderRadius: '6px', color: '#0C0C0C', wordBreak: 'break-word', '&:hover': { bgcolor: '#F3F4F6' } }}>
                {sub.name}
              </Typography>
            </Box>
            {!!sub.children?.length && (
              <Box sx={{ pl: 1, mt: 0.5 }}>
                {sub.children.map((child) => (
                  <Box key={child.url_key} component={Link} href={`/${dept.url_key}?sub=${sub.url_key}`} sx={{ textDecoration: 'none', display: 'block' }}>
                    <Typography sx={{ color: '#4F4F4F', fontSize: '11.5px', p: '0.5px 4px', borderRadius: '4px', '&:hover': { bgcolor: '#F3F4F6', color: '#0C0C0C' } }}>
                      {child.name}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        ))}
      </Box>
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
              <ListItemButton key={d.uid} onClick={() => (d.children.length ? setDept(d) : go(`/${d.url_key}`))} sx={{ minHeight: 48 }}>
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
            {dept.children.map((s) => (
              <ListItemButton key={s.url_key} onClick={() => go(`/${dept.url_key}?sub=${s.url_key}`)} sx={{ minHeight: 48 }}>
                <ListItemText primary={s.name} primaryTypographyProps={{ fontSize: 15 }} />
                <ChevronRightIcon sx={{ color: '#9CA3AF' }} />
              </ListItemButton>
            ))}
          </>
        )}
      </List>
    </Drawer>
  )
}

/* ------------------------------------------------------------------ Header */

export default function Header() {
  const [drawer, setDrawer] = useState(false)
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

      <CategoryBar />
      <MobileDrawer open={drawer} onClose={() => setDrawer(false)} />
    </Box>
  )
}
