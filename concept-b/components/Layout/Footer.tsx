import Link from 'next/link'
import { Box, Typography } from '@mui/material'
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded'
import InstagramIcon from '@mui/icons-material/Instagram'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded'
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import { colors, focusRingInverse, layout, radius } from '../../lib/theme'
import { PHONE, PHONE_HREF, WHATSAPP_HREF } from './Header'

const columns = [
  { title: 'Shop', links: [['Packaging', '/packaging'], ['Grocery', '/grocery'], ['Frozen', '/frozen'], ['Produce', '/produce'], ['Beverage', '/beverage'], ['Dairy & Eggs', '/dairy-eggs'], ['Janitorial', '/janitorial'], ['All categories', '/all-categories'], ['Brands', '/brands'], ['Flyers & Offers', '/flyers-offers']] },
  { title: 'Company', links: [['About us', '/about-us'], ['Become a supplier', '/become-a-supplier'], ['Blog', '/blog'], ['Get the app', '/download-app']] },
  { title: 'Help', links: [['Contact us', '/service/contact-us'], ['Online help', '/service/contact-us'], ['Terms & Uses', '/terms-uses'], ['Safety & Security', '/safety-security'], ['Privacy Policy', '/privacy-policy']] },
]

const linkSx = { color: 'rgba(255,255,255,.78)', textDecoration: 'none', fontSize: 14, borderRadius: '4px', '&:hover': { color: '#fff', textDecoration: 'underline' }, ...focusRingInverse } as const
const heading = { color: '#fff', fontWeight: 600, fontSize: 14.5, mb: 1.5 } as const

/** Deep navy (the logo wordmark colour) so the red stays reserved for actions; AA contrast throughout. */
export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: colors.navyDark, color: 'rgba(255,255,255,.78)', mt: 'auto' }}>
      <Box sx={{ maxWidth: layout.maxWidth, mx: 'auto', px: layout.gutter, pt: { xs: 5, md: 7 }, pb: 3 }}>
        <Box sx={{ display: 'grid', gap: { xs: 4, md: 5 }, gridTemplateColumns: { xs: 'minmax(0,1fr) minmax(0,1fr)', md: '1.4fr minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)', lg: '1.6fr minmax(0,1fr) minmax(0,1fr) minmax(0,1fr) 1.3fr' } }}>
          <Box sx={{ gridColumn: { xs: '1 / -1', md: 'auto' } }}>
            <Box component="img" src="/assets/footerLogo.png" alt="MySupreme" sx={{ width: 128, height: 'auto', display: 'block' }} />
            <Typography sx={{ mt: 2, fontSize: 13.5, lineHeight: 1.65, maxWidth: 380 }}>MySupreme is Ontario’s trusted wholesale partner for food and restaurant supplies.</Typography>
            <Typography sx={{ mt: 1.25, fontSize: 13.5, lineHeight: 1.65, maxWidth: 380 }}>We serve restaurants, retailers and food service businesses with everything from packaging and fresh ingredients to kitchen equipment, janitorial supplies and bulk groceries.</Typography>
            <Typography sx={{ mt: 1.25, fontSize: 13.5, lineHeight: 1.65, maxWidth: 380 }}>Competitive pricing, reliable inventory and fast delivery make wholesale ordering simple across Ontario.</Typography>
          </Box>
          {columns.map((c) => (
            <Box key={c.title} component="nav" aria-label={c.title}>
              <Typography component="h2" sx={heading}>{c.title}</Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'flex', flexDirection: 'column', gap: 1.1 }}>
                {c.links.map(([label, href]) => <li key={label}><Box component={Link} href={href} sx={linkSx}>{label}</Box></li>)}
              </Box>
            </Box>
          ))}
          <Box sx={{ gridColumn: { xs: '1 / -1', md: '1 / -1', lg: 'auto' } }}>
            <Typography component="h2" sx={heading}>Talk to us</Typography>
            <Box component="address" sx={{ fontStyle: 'normal', display: 'grid', gap: 1.25, gridTemplateColumns: { xs: 'minmax(0,1fr)', sm: 'minmax(0,1fr) minmax(0,1fr)', lg: 'minmax(0,1fr)' }, fontSize: 14 }}>
              <Box component="a" href={PHONE_HREF} sx={{ ...linkSx, display: 'flex', gap: 1, alignItems: 'center', color: '#fff', fontWeight: 600 }}><PhoneOutlinedIcon sx={{ fontSize: 19 }} /> {PHONE}</Box>
              <Box component="a" href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" sx={{ ...linkSx, display: 'flex', gap: 1, alignItems: 'center' }}><WhatsAppIcon sx={{ fontSize: 19 }} /> WhatsApp us</Box>
              <Box component="a" href="mailto:sales@mysupreme.ca" sx={{ ...linkSx, display: 'flex', gap: 1, alignItems: 'center' }}><MailOutlineRoundedIcon sx={{ fontSize: 19 }} /> sales@mysupreme.ca</Box>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}><ScheduleRoundedIcon sx={{ fontSize: 19 }} /> Mon–Sat, 9am–6pm</Box>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', gridColumn: { sm: '1 / -1', lg: 'auto' } }}><PlaceOutlinedIcon sx={{ fontSize: 19, mt: '2px' }} /> Cash &amp; carry: 3750A Laird Road, Unit 9, Mississauga</Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{ mt: { xs: 4, md: 6 }, pt: 3, borderTop: '1px solid rgba(255,255,255,.14)', display: 'flex', flexWrap: 'wrap', gap: { xs: 3, md: 4 }, alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ fontSize: 12.5, mb: 1 }}>Secure payment methods (online)</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {[['/assets/mastercard.png', 'Mastercard'], ['/assets/paypal.png', 'PayPal'], ['/assets/shoppay.png', 'Shop Pay'], ['/assets/visa.png', 'Visa']].map(([img, alt]) => (
                <Box key={img} sx={{ bgcolor: '#fff', borderRadius: radius.sm, width: 56, height: 36, display: 'grid', placeItems: 'center' }}>
                  <img src={img} alt={alt} style={{ maxWidth: 40, maxHeight: 20, objectFit: 'contain' }} />
                </Box>
              ))}
            </Box>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 12.5, mb: 1 }}>Follow us</Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {[
                ['https://www.facebook.com/profile.php?id=61586940912561', 'MySupreme on Facebook', <FacebookRoundedIcon key="f" />],
                ['https://www.instagram.com/supremecashandcarry', 'MySupreme on Instagram', <InstagramIcon key="i" />],
                ['https://www.linkedin.com/company/111794954/', 'MySupreme on LinkedIn', <LinkedInIcon key="l" />],
              ].map(([href, label, icon]) => (
                <Box key={href as string} component="a" href={href as string} target="_blank" rel="noopener noreferrer" aria-label={label as string}
                  sx={{ width: 40, height: 40, display: 'grid', placeItems: 'center', borderRadius: radius.md, color: '#fff', bgcolor: 'rgba(255,255,255,.08)', '&:hover': { bgcolor: 'rgba(255,255,255,.16)' }, ...focusRingInverse }}>
                  {icon}
                </Box>
              ))}
            </Box>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 12.5, mb: 1 }}>Order on the go</Typography>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Box component="a" href="https://apps.apple.com/in/app/mysupreme/id6749691637" target="_blank" rel="noopener noreferrer" sx={{ display: 'inline-flex', borderRadius: radius.sm, ...focusRingInverse }}><img src="/assets/appstore1.svg" alt="Download on the App Store" style={{ height: 40 }} /></Box>
              <Box component="a" href="https://play.google.com/store/apps/details?id=com.mysupreme.app" target="_blank" rel="noopener noreferrer" sx={{ display: 'inline-flex', borderRadius: radius.sm, ...focusRingInverse }}><img src="/assets/playstore1.svg" alt="Get it on Google Play" style={{ height: 40 }} /></Box>
            </Box>
          </Box>
        </Box>
        <Typography sx={{ mt: 3, fontSize: 12.5, color: 'rgba(255,255,255,.6)' }}>© 2026 MySupreme Food Service. All rights reserved. Prices in CAD.</Typography>
      </Box>
    </Box>
  )
}
