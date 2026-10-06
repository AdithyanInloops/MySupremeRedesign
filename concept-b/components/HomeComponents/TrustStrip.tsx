import { Box, Typography } from '@mui/material'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import FormatQuoteRoundedIcon from '@mui/icons-material/FormatQuoteRounded'
import type { SvgIconComponent } from '@mui/icons-material'

/*
 * CONCEPT B — NEW SECTION #8 "Trusted by Ontario kitchens".
 * CMS content only (no backend). Testimonials below are dummy copy for the prototype.
 */

export type Stat = { value: string; label: string; icon: SvgIconComponent }
export type Testimonial = { quote: string; name: string; business: string; city: string }

export const defaultStats: Stat[] = [
  { value: '4,300+', label: 'Products online', icon: Inventory2OutlinedIcon },
  { value: '9', label: 'Departments', icon: CategoryOutlinedIcon },
  { value: 'Same / next-day', label: 'Delivery', icon: LocalShippingOutlinedIcon },
  { value: 'GTA · Hamilton · Niagara', label: 'Delivery regions', icon: PlaceOutlinedIcon },
]

export const defaultTestimonials: Testimonial[] = [
  { quote: 'We reorder our packaging by SKU every Monday and it’s on the dock Tuesday morning. One supplier, one invoice.', name: 'Priya R.', business: 'Spice Route Kitchen', city: 'Mississauga' },
  { quote: 'Fryer oil, cheese and boxes in one order — and the warehouse is ten minutes away when we run short.', name: 'Marco D.', business: 'Lakeshore Pizza Co.', city: 'Hamilton' },
  { quote: 'Our two cafés share one account. The chai sticks and syrups are always in stock and priced right.', name: 'Aisha K.', business: 'Daybreak Café', city: 'St. Catharines' },
]

export default function TrustStrip({ stats = defaultStats, testimonials = defaultTestimonials }: { stats?: Stat[]; testimonials?: Testimonial[] }) {
  return (
    <Box component="section" aria-labelledby="trust-strip" sx={{ px: '12px', py: { xs: 3, md: 4 } }}>
      <Typography id="trust-strip" component="h2" sx={{ fontSize: { xs: 18, md: 26 }, fontWeight: 500, color: '#0C0C0C', mb: 2 }}>
        Trusted by Ontario kitchens
      </Typography>

      <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: { xs: 1, md: 2 }, gridTemplateColumns: { xs: 'repeat(2, minmax(0,1fr))', lg: 'repeat(4, minmax(0,1fr))' }, mb: { xs: 2, md: 3 } }}>
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <Box component="li" key={s.label} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: '#EBF2FE', borderRadius: '10px', p: { xs: 1.5, md: 2 }, minWidth: 0 }}>
              <Box sx={{ width: 40, height: 40, flexShrink: 0, borderRadius: '50%', bgcolor: '#fff', color: '#2d297d', display: 'grid', placeItems: 'center' }}><Icon fontSize="small" /></Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: { xs: 14, md: 18 }, fontWeight: 700, color: '#2d297d', lineHeight: 1.2 }}>{s.value}</Typography>
                <Typography sx={{ fontSize: { xs: 11.5, md: 13 }, color: '#4B5563' }}>{s.label}</Typography>
              </Box>
            </Box>
          )
        })}
      </Box>

      <Box sx={{ display: 'grid', gap: { xs: 1.5, md: 2 }, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0,1fr))' } }}>
        {testimonials.map((t) => (
          <Box component="figure" key={t.business} sx={{ m: 0, bgcolor: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', p: { xs: 2, md: 2.5 }, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', color: '#F5A623' }} role="img" aria-label="Rated 5 out of 5">
                {[0, 1, 2, 3, 4].map((i) => <StarRoundedIcon key={i} sx={{ fontSize: 20 }} />)}
              </Box>
              <FormatQuoteRoundedIcon sx={{ color: '#FFD6D3', fontSize: 32 }} aria-hidden />
            </Box>
            <Box component="blockquote" sx={{ m: 0, fontSize: 14, lineHeight: 1.6, color: '#1C1C1C' }}>“{t.quote}”</Box>
            <Box component="figcaption" sx={{ mt: 'auto', display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <Box sx={{ width: 38, height: 38, borderRadius: '50%', bgcolor: '#FF0000', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 14, fontWeight: 700 }} aria-hidden>
                {t.business.split(' ').map((w) => w[0]).slice(0, 2).join('')}
              </Box>
              <Box>
                <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: '#0C0C0C' }}>{t.business}</Typography>
                <Typography sx={{ fontSize: 12, color: '#6B7280' }}>{t.name} · {t.city}</Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
