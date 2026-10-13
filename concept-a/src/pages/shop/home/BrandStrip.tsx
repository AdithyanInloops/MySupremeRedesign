import { Box } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { tokens } from '../../../theme'
import brandsJson from '../../../data/brands-magento.json'
import Rail from './Rail'
import { SectionHeader } from '../../../components/ui'

/**
 * Brand logos in a swipe / arrow rail (Concept B). Logos are the Magento brandImages (concept-b/data/brands.json);
 * each tile opens a brand-filtered search.
 */

type Brand = { brand_id: number; brand_name: string; image_url: string }

const c = tokens.color
const brands = brandsJson as Brand[]

function LogoTile({ brand }: { brand: Brand }) {
  return (
    <Box
      component={RouterLink}
      to={`/search/${encodeURIComponent(brand.brand_name)}`}
      aria-label={`Shop ${brand.brand_name}`}
      sx={{
        display: 'grid', placeItems: 'center', height: { xs: 84, md: 96 }, p: 1.5, bgcolor: '#fff', border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.md}px`, textDecoration: 'none',
        transition: 'box-shadow .2s, border-color .2s', '&:hover': { borderColor: c.line2, boxShadow: tokens.shadow.hover },
        '&:focus-visible': { outline: `3px solid ${c.navy}`, outlineOffset: 2 },
      }}
    >
      <Box component="img" src={brand.image_url} alt="" loading="lazy" sx={{ maxWidth: '88%', maxHeight: '80%', objectFit: 'contain' }} />
    </Box>
  )
}

export default function BrandStrip() {
  const list = brands.filter((b) => b.image_url).slice(0, 24)
  if (!list.length) return null
  return (
    <Box component="section" aria-labelledby="brands-title">
      <SectionHeader id="brands-title" eyebrow="Shop by brand" title="Brands kitchens trust" subtitle={`${brands.length.toLocaleString()} brands stocked in our Mississauga warehouse`} action="All brands" href="/brands" />
      <Rail label="Brands" itemWidth={{ xs: '40%', sm: '28%', md: '18%', lg: '14%', xl: '12%' }}>
        {list.map((b) => <Box role="listitem" key={b.brand_id}><LogoTile brand={b} /></Box>)}
      </Rail>
    </Box>
  )
}
