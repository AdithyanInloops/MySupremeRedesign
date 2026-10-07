import Link from 'next/link'
import { Box, Typography } from '@mui/material'
import type { Brand } from '../../lib/data'
import { colors, focusRing, motion, radius, shadow } from '../../lib/theme'
import Section from '../ui/Section'
import { Rail } from '../Product/ProductRail'

/**
 * Brand logos in the shared rail (replaces the auto-scrolling marquee, which never stopped moving and couldn't be
 * paused or reached by keyboard). Each tile opens a brand-filtered search.
 */
export function BrandTile({ brand }: { brand: Brand }) {
  return (
    <Box
      component={Link}
      href={`/search/${encodeURIComponent(brand.brand_name)}`}
      aria-label={`Shop ${brand.brand_name}`}
      sx={{
        display: 'grid', placeItems: 'center', height: { xs: 84, md: 96 }, p: 1.5, bgcolor: '#fff', border: `1px solid ${colors.line}`, borderRadius: radius.lg, textDecoration: 'none',
        transition: `box-shadow ${motion.base}, border-color ${motion.base}`, '&:hover': { borderColor: colors.line2, boxShadow: shadow.md }, ...focusRing,
      }}
    >
      {brand.image_url ? (
        <Box component="img" src={brand.image_url} alt="" loading="lazy" sx={{ maxWidth: '88%', maxHeight: '80%', objectFit: 'contain' }} />
      ) : (
        <Typography sx={{ fontWeight: 700, fontSize: 14, color: colors.navy, textAlign: 'center', letterSpacing: '.02em', overflowWrap: 'anywhere' }}>{brand.brand_name}</Typography>
      )}
    </Box>
  )
}

export default function BrandStrip({ brands }: { brands: Brand[] }) {
  const list = brands.filter((b) => b.image_url).slice(0, 24)
  if (!list.length) return null
  return (
    <Section id="brands" band="subtle" eyebrow="Shop by brand" title="Brands kitchens trust" subtitle={`${brands.length.toLocaleString()} brands stocked in our Mississauga warehouse`} action={{ label: 'All brands', href: '/brands' }}>
      <Rail label="Brands" itemWidth={{ xs: '40%', sm: '28%', md: '18%', lg: '14%', xl: '12%' }}>
        {list.map((b) => <Box role="listitem" key={b.brand_id}><BrandTile brand={b} /></Box>)}
      </Rail>
    </Section>
  )
}
