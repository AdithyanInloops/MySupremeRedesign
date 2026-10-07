import Link from 'next/link'
import { Box, Button, Typography } from '@mui/material'
import { keyframes } from '@mui/system'
import type { Brand } from '../../lib/data'
import { SectionHeading } from './HomeSection'

const scrollAnimation = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`

/** "Shop by — Our Brands" marquee (real: homebanner.tsx). */
function Homebanner({ brandList }: { brandList: Brand[] }) {
  const brandsToDisplay = brandList.slice(0, 30)
  if (!brandsToDisplay.length) return null
  const marqueeItems = [...brandsToDisplay, ...brandsToDisplay]
  return (
    <Box>
      <SectionHeading id="brands-title" eyebrow="Shop by brand" title="Our Brands" subtitle="Trusted names stocked in our Mississauga warehouse" action={{ label: 'View all brands', href: '/brands' }} />
      <Box sx={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', py: { xs: 2, md: 3 }, background: 'linear-gradient(180deg, #FFF6F6 0%, #FFF0F0 50%, #FFEAEA 100%)', border: '1px solid #FFE5E5' }}>
      <Box sx={{ width: '100%', overflow: 'hidden', position: 'relative', py: 1, maskImage: 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)' }}>
        <Box sx={{ display: 'flex', width: 'max-content', gap: { xs: 2, sm: 3 }, animation: `${scrollAnimation} 180s linear infinite`, '&:hover': { animationPlayState: 'paused' } }}>
          {marqueeItems.map((brand, index) => (
            <Box key={`${brand.brand_id}-${index}`} sx={{ flex: '0 0 auto', width: { xs: '150px', sm: '180px', md: '200px' }, height: { xs: '75px', sm: '90px', md: '100px' }, display: 'flex' }}>
              <Link href={`/search/${encodeURIComponent(brand.brand_name)}`} style={{ textDecoration: 'none', width: '100%', height: '100%' }} aria-hidden={index >= brandsToDisplay.length} tabIndex={index >= brandsToDisplay.length ? -1 : undefined}>
                <Box sx={{ width: '100%', height: '100%', backgroundColor: '#ffffff', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', p: { xs: 1.5, sm: 2 }, border: '1px solid #FFE5E5', boxShadow: '0 4px 15px rgba(255, 65, 61, 0.02)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', '&:hover': { transform: 'translateY(-6px) scale(1.03)', borderColor: '#FF413D', boxShadow: '0 12px 24px rgba(255, 65, 61, 0.12)' } }}>
                  {brand.image_url ? (
                    <img src={brand.image_url} alt={brand.brand_name} loading="lazy" style={{ maxWidth: '85%', maxHeight: '85%', objectFit: 'contain' }} />
                  ) : (
                    <Typography sx={{ fontWeight: 700, fontSize: { xs: '11px', sm: '13px', md: '14px' }, color: '#FF413D', textAlign: 'center' }}>{brand.brand_name}</Typography>
                  )}
                </Box>
              </Link>
            </Box>
          ))}
        </Box>
      </Box>
      </Box>
    </Box>
  )
}

export default Homebanner
