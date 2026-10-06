import { Box } from '@mui/material'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'

type SupremeBannerProps = { imageUrls: string[]; mobileImageUrls: string[] }

/** Hero banner slider — copy of the real Supremebanner.tsx (Swiper, 4s autoplay, dots, loop). */
const Supremebanner = ({ imageUrls, mobileImageUrls }: SupremeBannerProps) => {
  if (!imageUrls?.length) return null
  return (
    <Box sx={{ width: '100%', aspectRatio: { xs: '16 / 9', md: '1920 / 750' }, overflow: 'hidden', borderRadius: '12px', position: 'relative' }}>
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        style={{ width: '100%', height: '100%', borderRadius: '12px' }}
      >
        {imageUrls.map((imageUrl, index) => (
          <SwiperSlide key={imageUrl}>
            <picture>
              {mobileImageUrls?.[index] && <source media="(max-width:900px)" srcSet={mobileImageUrls[index]} />}
              <img
                src={imageUrl}
                loading={index === 0 ? 'eager' : 'lazy'}
                alt="Ontario wholesale restaurant supplies including aluminum deep trays, eco-friendly clamshells, and food packaging – MySupreme"
                width={1920}
                height={750}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px', display: 'block' }}
              />
            </picture>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  )
}

export default Supremebanner
