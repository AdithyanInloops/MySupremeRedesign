import type { ReactNode } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import LocalOfferOutlined from '@mui/icons-material/LocalOfferOutlined'
import ReceiptLongOutlined from '@mui/icons-material/ReceiptLongOutlined'
import ReplayRounded from '@mui/icons-material/ReplayRounded'
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined'
import { tokens } from '../../theme'
import { photo } from '../../data/catalog'
import { Container } from '../../components/ui'
import { Crown } from '../../components/Brand'

const c = tokens.color

const benefits = [
  { icon: <LocalOfferOutlined />, title: 'Business pricing', body: 'Customer-group prices on 4,300+ products once you sign in.' },
  { icon: <ReceiptLongOutlined />, title: 'Credit terms', body: 'Apply for Net 30 and pay on account — invoices & statements online.' },
  { icon: <ReplayRounded />, title: 'One-tap reorder', body: 'Online and in-store (POS) orders in one history.' },
  { icon: <LocalShippingOutlined />, title: 'Same / next-day delivery', body: 'Cold-chain routes across the GTA, Hamilton & Niagara.' },
]

/** Split auth layout: form left, brand panel right (stacks to form-only on mobile with a slim benefits strip). */
export default function AuthShell({ children, panelTitle = 'Your kitchen’s single supplier.' }: { children: ReactNode; panelTitle?: string }) {
  return (
    <Container sx={{ py: { xs: 3, md: 5 } }}>
      <Box sx={{
        display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0,1fr) minmax(0,1fr)' }, bgcolor: '#fff', border: `1px solid ${c.line}`,
        borderRadius: `${tokens.radius.xl}px`, overflow: 'hidden', minHeight: { lg: 640 }, maxWidth: 1280, mx: 'auto',
      }}>
        <Box sx={{ p: { xs: 2.5, sm: 4, md: 6 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Box sx={{ width: '100%', maxWidth: 480, mx: 'auto' }}>{children}</Box>
        </Box>
        <Box sx={{ position: 'relative', bgcolor: c.navy, color: '#fff', display: { xs: 'none', lg: 'block' } }}>
          <Box component="img" src={photo('chef', 1000, 1100)} alt="" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.45 }} />
          <Box sx={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg, rgba(27,25,80,.55) 0%, ${c.navyDark} 78%)` }} />
          <Box sx={{ position: 'relative', p: 6, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <Crown size={48} />
            <Typography variant="h2" sx={{ color: '#fff', mt: 2, mb: 3, maxWidth: 420 }}>{panelTitle}</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>
              {benefits.map((b) => (
                <Box key={b.title}>
                  <Box sx={{ width: 40, height: 40, borderRadius: `${tokens.radius.sm}px`, bgcolor: 'rgba(255,255,255,.12)', color: c.saffron, display: 'grid', placeItems: 'center', mb: 1 }}>{b.icon}</Box>
                  <Typography sx={{ fontWeight: 700, fontSize: 14.5 }}>{b.title}</Typography>
                  <Typography sx={{ fontSize: 13, opacity: 0.8 }}>{b.body}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
      <Stack direction="row" spacing={1} className="no-scrollbar" sx={{ display: { lg: 'none' }, mt: 2, overflowX: 'auto', mx: -2, px: 2 }}>
        {benefits.map((b) => (
          <Stack key={b.title} direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 0, bgcolor: c.navyTint, color: c.navy, px: 1.5, py: 1, borderRadius: 999, fontSize: 13, fontWeight: 600, '& svg': { fontSize: 18 } }}>
            {b.icon}<span>{b.title}</span>
          </Stack>
        ))}
      </Stack>
    </Container>
  )
}
