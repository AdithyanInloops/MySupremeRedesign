import type { ReactNode } from 'react'
import Link from 'next/link'
import { Box, Button, Container, Typography } from '@mui/material'

/** Line icons matching GraphCommerce iconShoppingBag / iconHeart (xxl ≈ 96px). */
export const BagIcon = () => (
  <svg width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="#0C0C0C" strokeWidth="0.9" aria-hidden>
    <path d="M5 8h14v13H5z" />
    <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
  </svg>
)
export const HeartIcon = () => (
  <svg width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="#0C0C0C" strokeWidth="0.9" aria-hidden>
    <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z" />
  </svg>
)

/** Mirrors GraphCommerce FullPageMessage + EmptyCart (icon, h3 title, body, pill button). */
export default function FullPageMessage({
  icon, title, children, button = 'Continue shopping', href = '/', color = 'secondary',
}: { icon: ReactNode; title: ReactNode; children?: ReactNode; button?: string; href?: string; color?: 'primary' | 'secondary' }) {
  return (
    <Box sx={{ my: { xs: '40px', md: '72px' } }}>
      <Container maxWidth="md" sx={{ display: 'grid', justifyItems: 'center', textAlign: 'center' }}>
        <Box>{icon}</Box>
        <Box sx={{ mt: { xs: 3, md: 6 } }}>
          <Typography variant="h3" sx={{ fontSize: { xs: 21, md: 28 }, fontWeight: 500, mb: 1.5, color: '#0C0C0C' }}>{title}</Typography>
          {children && <Typography sx={{ fontSize: { xs: 14, md: 16 }, color: '#0C0C0C' }}>{children}</Typography>}
        </Box>
        <Box sx={{ mt: 2.5 }}>
          <Button
            component={Link}
            href={href}
            variant="contained"
            color={color}
            disableElevation={false}
            sx={{ borderRadius: '99em', px: { xs: 3.5, md: 5.5 }, height: { xs: 48, md: 56 }, textTransform: 'none', fontWeight: 600, fontSize: { xs: 16, md: 18 }, boxShadow: '0 4px 10px rgba(0,0,0,.18)' }}
          >
            {button}
          </Button>
        </Box>
      </Container>
    </Box>
  )
}
