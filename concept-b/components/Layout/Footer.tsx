import Link from 'next/link'
import { Box, Divider, Grid, Typography } from '@mui/material'
import FacebookSharpIcon from '@mui/icons-material/FacebookSharp'
import InstagramIcon from '@mui/icons-material/Instagram'
import LinkedInIcon from '@mui/icons-material/LinkedIn'

// Mirrors the real components/Layout/Footer.tsx (links, copy, sizes).
const footerLinks = [
  { title: 'Categories', hideOnMobile: true, links: [['Packaging', '/packaging'], ['Grocery', '/grocery'], ['Frozen', '/frozen'], ['Produce', '/produce'], ['Beverage', '/beverage'], ['Dairy', '/dairy-eggs'], ['Janitorial', '/janitorial']] },
  { title: 'About', links: [['About us', '/about-us'], ['Terms & Uses', '/terms-uses'], ['Safety & Security', '/safety-security'], ['Privacy Policy', '/privacy-policy']] },
  { title: 'Help', links: [['Contact', '/service/contact-us'], ['Online Help', '/service/contact-us'], ['Become a supplier', '/service/become-a-supplier'], ['Blog', '/blog']] },
]

const heading = { color: '#fff', fontWeight: 600, fontSize: { xs: '1rem', md: '1.05rem' }, mb: 1 }

export default function Footer() {
  return (
    <Box component="footer" sx={{ backgroundColor: 'primary.main', color: 'white', px: { xs: 2, md: 6 }, pt: { xs: 4, md: 6 }, pb: { xs: 3, md: 3 } }}>
      <Grid container spacing={{ xs: 4, md: 6 }}>
        <Grid item xs={12} md={5} display="flex" flexDirection="column" alignItems="flex-start">
          <Box component="img" src="/assets/footerLogo.png" alt="MySupreme logo" sx={{ width: 120, height: 'auto', maxWidth: '100%' }} />
          <Typography variant="body2" sx={{ mt: 2, maxWidth: 520, fontSize: { xs: 13, md: 12 }, lineHeight: '150%', fontWeight: 300, opacity: 0.9 }}>
            MySupreme is Ontario’s trusted wholesale partner for food and restaurant supplies.
            <br /><br />
            We serve restaurants, retailers, and food service businesses with everything from food packaging and fresh ingredients to kitchen
            equipment, janitorial supplies, and bulk groceries.
            <br /><br />
            With competitive pricing, reliable inventory, and fast delivery, MySupreme makes wholesale ordering simple, efficient, and dependable
            across Ontario.
          </Typography>
        </Grid>
        {footerLinks.map((section) => (
          <Grid item xs={6} sm={4} md={2} key={section.title} sx={{ display: section.hideOnMobile ? { xs: 'none', md: 'block' } : 'block' }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: { xs: 1.5, md: 2 }, fontSize: { xs: '1rem', md: '1.1rem' } }}>
              {section.title}
            </Typography>
            {section.links.map(([label, url]) => (
              <Typography key={label} variant="body2" sx={{ mt: { xs: 1, md: 1.5 }, opacity: 0.9, fontSize: { xs: '0.85rem', md: '0.875rem' }, '&:hover': { opacity: 0.7 } }}>
                <Link href={url} style={{ textDecoration: 'none', color: 'inherit' }}>{label}</Link>
              </Typography>
            ))}
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: { xs: 3, md: 4 }, borderColor: 'white', opacity: 0.4 }} />

      <Grid container spacing={3} alignItems="center" justifyContent="space-between" sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
        <Grid item xs={12} md="auto" display="flex" flexDirection="column" alignItems={{ xs: 'center', md: 'flex-start' }}>
          <Typography sx={{ ...heading, textAlign: { xs: 'center', md: 'left' }, width: '100%' }}>Secure Payment Methods (Online):</Typography>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>
            {[['/assets/mastercard.png', 'Mastercard'], ['/assets/paypal.png', 'PayPal'], ['/assets/shoppay.png', 'Shop Pay'], ['/assets/visa.png', 'Visa']].map(([img, alt]) => (
              <Box key={img} sx={{ backgroundColor: '#fff', borderRadius: '8px', px: 2, py: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '58px', height: '42px' }}>
                <img src={img} alt={alt} style={{ maxWidth: '50px', maxHeight: '24px', objectFit: 'contain' }} />
              </Box>
            ))}
          </Box>
        </Grid>
        <Grid item xs={12} md="auto" display="flex" flexDirection="column" alignItems="center">
          <Typography sx={{ ...heading, textAlign: 'center' }}>Follow Us:</Typography>
          <Box display="flex" gap={2} justifyContent="center">
            <a href="https://www.facebook.com/profile.php?id=61586940912561" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FacebookSharpIcon sx={{ fontSize: 28, color: 'white' }} /></a>
            <a href="https://www.instagram.com/supremecashandcarry" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><InstagramIcon sx={{ fontSize: 28, color: 'white' }} /></a>
            <a href="https://www.linkedin.com/company/111794954/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><LinkedInIcon sx={{ fontSize: 28, color: 'white' }} /></a>
          </Box>
        </Grid>
        <Grid item xs={12} md="auto" display="flex" flexDirection="column" alignItems="center">
          <Typography sx={{ ...heading, textAlign: 'center' }}>Download Our App:</Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <a href="https://apps.apple.com/in/app/mysupreme/id6749691637" target="_blank" rel="noopener noreferrer"><img src="/assets/appstore1.svg" alt="Download on the App Store" style={{ height: 40 }} /></a>
            <a href="https://play.google.com/store/apps/details?id=com.mysupreme.app" target="_blank" rel="noopener noreferrer"><img src="/assets/playstore1.svg" alt="Get it on Google Play" style={{ height: 40 }} /></a>
          </Box>
        </Grid>
      </Grid>

      <Typography sx={{ mt: 3, opacity: 0.9, fontSize: { xs: '0.8rem', md: '0.875rem' }, textAlign: { xs: 'center', md: 'left' } }}>
        © 2026 MySupreme. All rights reserved.
      </Typography>
    </Box>
  )
}
