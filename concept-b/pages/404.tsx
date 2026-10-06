import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Box, Container, InputBase, Link as MuiLink, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

// Mirrors the live pages/404.tsx: icon, "Whoops our bad...", search field, Store home | Account links.
export default function NotFound() {
  const router = useRouter()
  const [q, setQ] = useState('')
  return (
    <Container maxWidth="sm">
      <Head><title>Page not found | MySupreme</title></Head>
      <Box textAlign="center" mt={{ xs: 8, md: 16 }} mb={{ xs: 8, md: 16 }}>
        <svg width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="#0C0C0C" strokeWidth="0.9" aria-hidden>
          <circle cx="11" cy="11" r="7" /><path d="m20 20-4-4M8.5 8.5l5 5M13.5 8.5l-5 5" />
        </svg>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontSize: { xs: 22, md: 28 }, fontWeight: 500, mt: 2 }}>Whoops our bad...</Typography>
        <Typography variant="body1">We couldn&apos;t find the page you were looking for</Typography>
        <Box mt={4} mb={2}>
          <InputBase
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && q.trim() && router.push(`/search/${encodeURIComponent(q.trim())}`)}
            placeholder="Search..."
            inputProps={{ 'aria-label': 'Search' }}
            endAdornment={<SearchIcon sx={{ color: 'rgba(0,0,0,.5)' }} />}
            sx={{ width: '100%', py: 1.5, px: 2, border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: 16 }}
          />
        </Box>
        Or follow these links to get you back on track!
        <Box mb={8} sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }}>
          <MuiLink component={Link} href="/" color="primary" underline="hover">Store home</MuiLink>
          <span>|</span>
          <MuiLink component={Link} href="/account/signin" color="primary" underline="hover">Account</MuiLink>
        </Box>
      </Box>
    </Container>
  )
}
