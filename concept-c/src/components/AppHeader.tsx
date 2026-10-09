import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, IconButton } from '@mui/material'
import { tokens, focusRing } from '../theme'
import { useApp } from '../state/app'
import { SearchIcon } from './icons'

const c = tokens.color

/**
 * The current MySupreme app header: the crown mark left (no wordmark), round search button, pink "Log in" pill (an initials avatar once signed
 * in). Sticky, white, with a hairline shadow — as in the client's screenshots.
 */
export default function AppHeader() {
  const { signedIn } = useApp()
  return (
    <Box component="header" sx={{ position: 'sticky', top: 0, zIndex: 20, display: 'flex', alignItems: 'center', gap: 1.25, px: 2, pt: 'calc(10px + env(safe-area-inset-top))', pb: 1.25, bgcolor: '#fff', boxShadow: '0 1px 0 #EEF0F3, 0 8px 14px -12px rgba(17,24,39,.22)' }}>
      <Box component={RouterLink} to="/" aria-label="Supreme home" sx={{ mr: 'auto', display: 'block', borderRadius: 1, ...focusRing }}>
        <Box component="img" src={`${import.meta.env.BASE_URL}logo-crown.png`} alt="" sx={{ display: 'block', height: 30, width: 'auto' }} />
      </Box>
      <IconButton component={RouterLink} to="/search" aria-label="Search products" sx={{ width: 44, height: 44, bgcolor: '#F3F4F6', color: c.ink, '&:hover': { bgcolor: '#E9EAEE' } }}>
        <SearchIcon sx={{ fontSize: 22 }} />
      </IconButton>
      {signedIn ? (
        <IconButton component={RouterLink} to="/account" aria-label="Your account, Spice Route Kitchen" sx={{ width: 44, height: 44, bgcolor: '#FFE8E8', color: c.red, fontSize: 14, fontWeight: 700, '&:hover': { bgcolor: '#FFDADA' } }}>SR</IconButton>
      ) : (
        <Button component={RouterLink} to="/signin" sx={{ height: 44, minHeight: 44, px: 2.25, borderRadius: '14px', bgcolor: '#FFE8E8', color: c.red, fontWeight: 600, fontSize: 16, '&:hover': { bgcolor: '#FFDADA' } }}>Log in</Button>
      )}
    </Box>
  )
}
