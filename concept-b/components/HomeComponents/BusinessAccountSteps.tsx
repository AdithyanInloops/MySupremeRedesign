import Link from 'next/link'
import { Box, Button, Typography } from '@mui/material'
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'
import SellOutlinedIcon from '@mui/icons-material/SellOutlined'
import ShoppingCartCheckoutOutlinedIcon from '@mui/icons-material/ShoppingCartCheckoutOutlined'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import type { SvgIconComponent } from '@mui/icons-material'
import { colors, radius, srOnly } from '../../lib/theme'

/*
 * Business account + social proof in one block: three steps and the CTA on the left, customer quotes on the right.
 * CMS content. The quotes are dummy copy — replace with real testimonials before go-live.
 */

export type Step = { title: string; body: string; icon: SvgIconComponent }
export type Testimonial = { quote: string; name: string; business: string; city: string }

export const defaultSteps: Step[] = [
  { title: 'Register your business', body: 'Business name, category and HST number — about two minutes.', icon: StorefrontOutlinedIcon },
  { title: 'Get business pricing & terms', body: 'Customer-group prices, and credit terms through your rep.', icon: SellOutlinedIcon },
  { title: 'Order your way', body: 'Online, in the app, by phone or at the warehouse.', icon: ShoppingCartCheckoutOutlinedIcon },
]

export const defaultTestimonials: Testimonial[] = [
  { quote: 'We reorder our packaging by SKU every Monday and it’s on the dock Tuesday morning. One supplier, one invoice.', name: 'Priya R.', business: 'Spice Route Kitchen', city: 'Mississauga' },
  { quote: 'Fryer oil, cheese and boxes in one order — and the warehouse is ten minutes away when we run short.', name: 'Marco D.', business: 'Lakeshore Pizza Co.', city: 'Hamilton' },
  { quote: 'Our two cafés share one account. The chai sticks and syrups are always in stock and priced right.', name: 'Aisha K.', business: 'Daybreak Café', city: 'St. Catharines' },
]

export default function BusinessAccountSteps({ steps = defaultSteps, testimonials = defaultTestimonials }: { steps?: Step[]; testimonials?: Testimonial[] }) {
  return (
    <Box sx={{ display: 'grid', gap: { xs: 3, lg: 5 }, gridTemplateColumns: { xs: 'minmax(0,1fr)', lg: 'minmax(0,1fr) minmax(0,1fr)' }, alignItems: 'start' }}>
      <Box sx={{ bgcolor: '#fff', border: `1px solid ${colors.line}`, borderRadius: radius.xl, p: { xs: 2.5, md: 4 } }}>
        <Typography variant="overline" component="p" sx={{ color: colors.redText }}>For businesses</Typography>
        <Typography id="business-account-title" component="h2" variant="h2" sx={{ mt: 0.5 }}>Open a business account in 3 steps</Typography>
        <Typography sx={{ mt: 1, color: colors.ink600 }}>Free to join. Restaurants, cafés, caterers, food trucks and retailers welcome.</Typography>
        <Box component="ol" sx={{ listStyle: 'none', m: 0, p: 0, mt: 3, display: 'flex', flexDirection: 'column', gap: 2.25 }}>
          {steps.map((s, i) => {
            const Icon = s.icon
            return (
              <Box component="li" key={s.title} sx={{ display: 'flex', gap: 1.75, alignItems: 'flex-start' }}>
                <Box sx={{ position: 'relative', width: 44, height: 44, borderRadius: '50%', bgcolor: colors.redTint, color: colors.redText, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <Icon sx={{ fontSize: 22 }} />
                  <Box component="span" aria-hidden sx={{ position: 'absolute', top: -4, right: -4, width: 20, height: 20, borderRadius: '50%', bgcolor: colors.navy, color: '#fff', fontSize: 11, fontWeight: 700, display: 'grid', placeItems: 'center', border: '2px solid #fff' }}>{i + 1}</Box>
                </Box>
                <Box>
                  <Typography component="h3" sx={{ fontSize: 15.5, fontWeight: 600 }}><Box component="span" sx={srOnly}>Step {i + 1}: </Box>{s.title}</Typography>
                  <Typography sx={{ fontSize: 14, color: colors.ink600 }}>{s.body}</Typography>
                </Box>
              </Box>
            )
          })}
        </Box>
        <Box sx={{ display: 'flex', gap: 1.25, flexWrap: 'wrap', mt: 3.5 }}>
          <Button component={Link} href="/account/signin?mode=register" variant="contained" size="large">Open a business account</Button>
          <Button component={Link} href="/service/contact-us" variant="outlined" size="large">Talk to sales</Button>
        </Box>
      </Box>

      <Box>
        <Typography variant="overline" component="p" sx={{ color: colors.redText }}>Trusted by Ontario kitchens</Typography>
        <Typography component="h2" variant="h3" sx={{ mt: 0.5, mb: 2 }}>What our customers say</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {testimonials.map((t) => (
            <Box component="figure" key={t.business} sx={{ m: 0, bgcolor: '#fff', border: `1px solid ${colors.line}`, borderRadius: radius.lg, p: 2.25 }}>
              <Box sx={{ display: 'flex', color: '#B45309', mb: 1 }} role="img" aria-label="Rated 5 out of 5">
                {[0, 1, 2, 3, 4].map((i) => <StarRoundedIcon key={i} sx={{ fontSize: 18 }} />)}
              </Box>
              <Box component="blockquote" sx={{ m: 0, fontSize: 14.5, lineHeight: 1.6, color: colors.ink }}>“{t.quote}”</Box>
              <Box component="figcaption" sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 1.25 }}>
                <Box aria-hidden sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: colors.navyTint, color: colors.navy, display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 700 }}>
                  {t.business.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{t.business}</Typography>
                  <Typography sx={{ fontSize: 12.5, color: colors.ink500 }}>{t.name} · {t.city}</Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
