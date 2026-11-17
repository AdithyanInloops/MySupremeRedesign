import type { ReactNode } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import LocalOfferOutlined from '@mui/icons-material/LocalOfferOutlined'
import ShoppingCartOutlined from '@mui/icons-material/ShoppingCartOutlined'
import HeadsetMicOutlined from '@mui/icons-material/HeadsetMicOutlined'
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined'
import DevicesOutlined from '@mui/icons-material/DevicesOutlined'
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined'
import { tokens } from '../../theme'
import { photo } from '../../data/catalog'
import { Container } from '../../components/ui'

const c = tokens.color

const benefits = [
  { icon: <ShoppingCartOutlined />, title: 'All your essentials', body: 'Fresh, frozen, dry goods and kitchen supplies.' },
  { icon: <LocalOfferOutlined />, title: 'Wholesale prices', body: 'Competitive pricing across thousands of products.' },
  { icon: <LocalShippingOutlined />, title: 'Fast, reliable delivery', body: 'Same-day or next-day delivery across our service areas.' },
  { icon: <HeadsetMicOutlined />, title: 'Support that understands', body: 'Dedicated sales support for your business needs.' },
]

const signupBenefits = [
  { icon: <LocalOfferOutlined />, title: 'Competitive wholesale pricing', body: 'Bulk pricing on thousands of foodservice products.' },
  { icon: <DevicesOutlined />, title: 'Order anytime, 24/7', body: 'Shop online or through our app with real-time pricing.' },
  { icon: <LocalShippingOutlined />, title: 'Reliable delivery', body: 'Same-day or next-day delivery across our service areas.' },
  { icon: <Inventory2Outlined />, title: 'Everything in one place', body: 'Food, packaging, kitchen tools and cleaning supplies.' },
]

// Soft navy glow behind the frameless mobile login (same as the stage site).
export const glow = 'radial-gradient(140% 40% at 100% 0%, rgba(45,41,125,.32), transparent), radial-gradient(140% 40% at 100% 100%, rgba(45,41,125,.32), transparent)'

/**
 * Split auth layout: brand panel left, form right. Login / forgot password follow the stage site
 * (panel from md, frameless form on a glow below md); sign-up keeps the panel from lg because its forms need the wider column.
 */
export default function AuthShell({ children, panelTitle = 'Your kitchen’s single supplier.', signup }: { children: ReactNode; panelTitle?: string; signup?: boolean }) {
  const list = signup ? signupBenefits : benefits
  const at = signup ? 'lg' : 'md'
  return (
    <Box sx={{ bgcolor: '#fff', backgroundImage: signup ? undefined : { xs: glow, md: 'none' }, minHeight: signup ? undefined : { xs: 'calc(100svh - 120px)', md: 0 } }}>
      <Container sx={{ py: { xs: 1, md: 6 }, px: { xs: 2, sm: 3 } }}>
        <Box sx={{
          display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', [at]: 'minmax(0,10fr) minmax(0,11fr)' },
          bgcolor: signup ? '#fff' : { xs: 'transparent', md: '#fff' }, border: '1px solid', borderColor: signup ? c.line : { xs: 'transparent', md: '#E6E6EE' },
          borderRadius: '16px', overflow: 'hidden', minHeight: { [at]: 520 }, maxWidth: signup ? 1280 : { sm: 560, md: 1052 }, mx: 'auto',
        }}>
          <Box sx={{ position: 'relative', bgcolor: c.navy, color: '#fff', display: { xs: 'none', [at]: 'block' } }}>
            <Box component="img" src={signup ? photo('aisle', 1000, 1100) : '/assets/cooking-chefs.png'} alt="" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '80% 50%', opacity: 0.45 }} />
            <Box sx={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg, rgba(27,25,80,.6) 0%, ${c.navyDark} 85%)` }} />
            <Box sx={{ position: 'relative', p: { xs: 4, lg: 6 }, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Box component="img" src="/assets/crown.png" alt="" sx={{ width: 48, height: 48, ml: '-5px' }} />
              <Typography sx={{ color: '#fff', fontSize: { xs: 26, lg: 32 }, lineHeight: 1.15, fontWeight: 600, letterSpacing: '-0.02em', mt: 2, mb: 5, maxWidth: 360 }}>{panelTitle}</Typography>
              <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: 3 }}>
                {list.map((b) => (
                  <Box component="li" key={b.title} sx={{ display: 'grid', gridTemplateColumns: '44px minmax(0,1fr)', gap: 2, alignItems: 'center' }}>
                    <Box sx={{ width: 44, height: 44, borderRadius: '10px', bgcolor: 'rgba(255,255,255,.1)', color: c.saffron, display: 'grid', placeItems: 'center', '& svg': { fontSize: 22 } }}>{b.icon}</Box>
                    <Box>
                      <Typography sx={{ fontWeight: 600, fontSize: 15, lineHeight: '22px' }}>{b.title}</Typography>
                      <Typography sx={{ fontSize: 13, lineHeight: '19px', color: 'rgba(255,255,255,.78)', maxWidth: 300 }}>{b.body}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
          <Box sx={{ p: signup ? { xs: 2.5, sm: 4, md: 6 } : { xs: 0.5, sm: 4, lg: 6 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box sx={{ width: '100%', maxWidth: signup ? 480 : 400, mx: 'auto' }}>{children}</Box>
          </Box>
        </Box>
        {signup && (
          <Stack direction="row" spacing={1} className="no-scrollbar" sx={{ display: { lg: 'none' }, mt: 2, overflowX: 'auto', mx: -2, px: 2 }}>
            {list.map((b) => (
              <Stack key={b.title} direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 0, bgcolor: c.navyTint, color: c.navy, px: 1.5, py: 1, borderRadius: 999, fontSize: 13, fontWeight: 600, '& svg': { fontSize: 18 } }}>
                {b.icon}<span>{b.title}</span>
              </Stack>
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  )
}
