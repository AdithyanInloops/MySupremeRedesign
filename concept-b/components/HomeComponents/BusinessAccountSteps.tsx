import Link from 'next/link'
import { Box, Button, Typography } from '@mui/material'
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'
import SellOutlinedIcon from '@mui/icons-material/SellOutlined'
import ShoppingCartCheckoutOutlinedIcon from '@mui/icons-material/ShoppingCartCheckoutOutlined'
import type { SvgIconComponent } from '@mui/icons-material'

/*
 * CONCEPT B — NEW SECTION #9 "Open a business account in 3 steps".
 * CMS content; both CTAs point at existing routes (sign-in / business sign-up and contact).
 */

const RED_AA = '#D50000'

export type Step = { title: string; body: string; icon: SvgIconComponent }

export const defaultSteps: Step[] = [
  { title: 'Register your business', body: 'Add your business name, category and HST number — it takes about two minutes.', icon: StorefrontOutlinedIcon },
  { title: 'Get business pricing & credit terms', body: 'See your customer-group prices and apply for credit terms with your rep.', icon: SellOutlinedIcon },
  { title: 'Order online, in-app or at the warehouse', body: 'Schedule delivery across the GTA, Hamilton & Niagara or pick up at Laird Road.', icon: ShoppingCartCheckoutOutlinedIcon },
]

export default function BusinessAccountSteps({ steps = defaultSteps }: { steps?: Step[] }) {
  return (
    <Box component="section" aria-labelledby="account-steps" sx={{ mx: '12px', my: { xs: 2, md: 3 }, borderRadius: '12px', bgcolor: '#F9FAFB', border: '1px solid #E5E7EB', p: { xs: 2.5, md: 4 } }}>
      <Box sx={{ display: 'grid', gap: { xs: 2.5, lg: 4 }, gridTemplateColumns: { xs: '1fr', lg: '400px minmax(0,1fr)' }, alignItems: 'center' }}>
        <Box>
          <Typography sx={{ fontSize: 12, fontWeight: 600, letterSpacing: '.12em', color: '#FF0000', textTransform: 'uppercase' }}>For businesses</Typography>
          <Typography id="account-steps" component="h2" sx={{ fontSize: { xs: 20, md: 26 }, fontWeight: 500, color: '#0C0C0C', lineHeight: 1.25 }}>
            Open a business account in 3 steps
          </Typography>
          <Typography sx={{ fontSize: 14, color: '#4B5563', mt: 1 }}>Free to join. Restaurants, cafés, caterers, food trucks and retailers welcome.</Typography>
          <Box sx={{ display: 'flex', gap: 1.25, flexWrap: 'wrap', mt: 2.5 }}>
            <Button
              component={Link}
              href="/account/signin"
              variant="contained"
              disableElevation
              sx={{ bgcolor: RED_AA, borderRadius: '40px', textTransform: 'none', fontWeight: 600, fontSize: 14, px: 2.5, height: 44, '&:hover': { bgcolor: '#B00000' }, '&.Mui-focusVisible': { outline: `3px solid ${RED_AA}`, outlineOffset: 2 } }}
            >
              Open a business account
            </Button>
            <Button
              component={Link}
              href="/service/contact-us"
              variant="outlined"
              sx={{ borderColor: '#FF0000', color: RED_AA, borderRadius: '40px', textTransform: 'none', fontWeight: 500, fontSize: 14, px: 2.5, height: 44, '&:hover': { borderColor: '#FF0000', bgcolor: 'rgba(255,0,0,.04)' }, '&.Mui-focusVisible': { outline: `3px solid ${RED_AA}`, outlineOffset: 2 } }}
            >
              Talk to sales
            </Button>
          </Box>
        </Box>

        <Box component="ol" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: { xs: 1.5, md: 2 }, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0,1fr))' }, counterReset: 'step' }}>
          {steps.map((s, i) => {
            const Icon = s.icon
            return (
              <Box component="li" key={s.title} sx={{ position: 'relative', bgcolor: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', p: { xs: 2, md: 2.5 }, display: 'flex', flexDirection: { xs: 'row', md: 'column' }, gap: 1.5 }}>
                <Box sx={{ position: 'relative', flexShrink: 0, width: 48, height: 48, borderRadius: '50%', bgcolor: '#FFF0EE', color: '#FF0000', display: 'grid', placeItems: 'center' }}>
                  <Icon />
                  <Box component="span" aria-hidden sx={{ position: 'absolute', top: -4, right: -6, width: 22, height: 22, borderRadius: '50%', bgcolor: '#2d297d', color: '#fff', fontSize: 11.5, fontWeight: 700, display: 'grid', placeItems: 'center', border: '2px solid #fff' }}>
                    {i + 1}
                  </Box>
                </Box>
                <Box>
                  <Typography component="h3" sx={{ fontSize: 15, fontWeight: 600, color: '#0C0C0C' }}>
                    <Box component="span" sx={{ position: 'absolute', left: 0, top: 0, width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}>Step {i + 1}: </Box>
                    {s.title}
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: '#4B5563', mt: 0.5, lineHeight: 1.5 }}>{s.body}</Typography>
                </Box>
              </Box>
            )
          })}
        </Box>
      </Box>
    </Box>
  )
}
