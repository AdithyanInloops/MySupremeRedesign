import type { ReactNode } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Box, Button, Container, Typography } from '@mui/material'

/**
 * Shared simple template for live pages that are out of scope for this prototype
 * (no screenshot / not in the change list). Keeps footer and More-menu links from dead-ending.
 */
export default function InfoPage({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 5, md: 10 } }}>
      <Head><title>{`${title} | MySupreme`}</title></Head>
      <Typography sx={{ fontSize: { xs: '11px', md: '12px' }, fontWeight: 800, color: '#FF413D', letterSpacing: '2.5px', textTransform: 'uppercase' }}>{eyebrow}</Typography>
      <Typography component="h1" sx={{ fontWeight: 900, color: '#0C0C0C', fontSize: { xs: '28px', md: '40px' }, letterSpacing: '-1px', lineHeight: 1.1, mt: 0.5, mb: 3 }}>{title}</Typography>
      <Box sx={{ color: '#4B5563', fontSize: { xs: 14, md: 16 }, lineHeight: 1.7, '& p': { mt: 0, mb: 2 } }}>{children}</Box>
      <Box sx={{ mt: 4, p: 2.5, borderRadius: '12px', bgcolor: '#F9FAFB', border: '1px solid #E5E7EB' }}>
        <Typography sx={{ fontSize: 14, color: '#4B5563' }}>
          This page is unchanged from the live site and is not reproduced in full in this prototype.
        </Typography>
        <Button component={Link} href="/" variant="contained" disableElevation sx={{ mt: 2, borderRadius: '50px', textTransform: 'none', fontWeight: 600 }}>Back to home</Button>
      </Box>
    </Container>
  )
}
