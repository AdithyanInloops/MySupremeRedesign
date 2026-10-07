import { useRef, useState } from 'react'
import Link from 'next/link'
import { Box, IconButton, Typography } from '@mui/material'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import EastIcon from '@mui/icons-material/East'
import { Swiper, SwiperSlide } from 'swiper/react'
import { A11y, Keyboard } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'

/**
 * Concept B — "Featured offers" promo carousel (replaces the two full-width posters + PromoTwoCards).
 * Uniform offer cards (media on top, caption below) with a peek of the next card, arrows and a progress bar —
 * the Amazon / Walmart Business / Instacart promo-row pattern. Slides come in as props so marketing can swap them
 * like a CMS block. No autoplay.
 *
 * Media kinds:
 * - `poster`: a finished promo image with its own text — shown with objectFit contain so nothing is cropped.
 * - `photo`: a plain photo (e.g. a Magento category image) — cover-cropped with a dark gradient and overlay text.
 */

export type PromoSlide = {
  id: string
  tag: string
  title: string
  subtitle: string
  href: string
  cta?: string
  media:
    | { kind: 'poster'; src: string; alt: string }
    | { kind: 'photo'; src: string; alt: string; overlayTitle: string; overlayText: string }
}

const RED_AA = '#D50000'

function SlideMedia({ media }: { media: PromoSlide['media'] }) {
  if (media.kind === 'poster') {
    return (
      <Box sx={{ position: 'absolute', inset: 0, bgcolor: '#EEF1F6', display: 'grid', placeItems: 'center' }}>
        <Box component="img" src={media.src} alt={media.alt} loading="lazy" sx={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
      </Box>
    )
  }
  return (
    <Box sx={{ position: 'absolute', inset: 0, bgcolor: '#C40000' }}>
      <Box
        component="img"
        src={media.src}
        alt={media.alt}
        loading="lazy"
        className="promo-photo"
        sx={{
          position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '70% 45%',
          transition: 'transform .5s ease', '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
        }}
      />
      <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(12,12,12,.82) 0%, rgba(12,12,12,.55) 42%, rgba(12,12,12,0) 75%)' }} />
      <Box sx={{ position: 'absolute', left: { xs: 18, md: 24 }, top: '50%', transform: 'translateY(-50%)', maxWidth: '58%', color: '#fff' }}>
        <Typography sx={{ fontSize: { xs: 22, md: 28 }, fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.01em' }}>{media.overlayTitle}</Typography>
        <Typography sx={{ fontSize: { xs: 12.5, md: 14 }, mt: 0.75, lineHeight: 1.45, opacity: 0.92 }}>{media.overlayText}</Typography>
      </Box>
    </Box>
  )
}

function PromoCard({ slide }: { slide: PromoSlide }) {
  return (
    <Box
      component={Link}
      href={slide.href}
      aria-label={`${slide.title} — ${slide.subtitle}`}
      sx={{
        display: 'flex', flexDirection: 'column', height: '100%', textDecoration: 'none', color: 'inherit', bgcolor: '#fff',
        borderRadius: '16px', border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: '0 1px 3px rgba(17,24,39,.06)',
        transition: 'transform .2s ease, box-shadow .2s ease',
        '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 14px 28px -12px rgba(17,24,39,.22)' },
        '&:hover .promo-photo': { transform: 'scale(1.04)' },
        '&:hover .promo-cta': { gap: 1 },
        '&:focus-visible': { outline: `3px solid ${RED_AA}`, outlineOffset: 2 },
        '@media (prefers-reduced-motion: reduce)': { transition: 'none', '&:hover': { transform: 'none' } },
      }}
    >
      <Box sx={{ position: 'relative', aspectRatio: '16 / 8', overflow: 'hidden', borderBottom: '1px solid #EEF0F3' }}>
        <SlideMedia media={slide.media} />
      </Box>
      <Box sx={{ p: { xs: 2, md: 2.5 }, display: 'flex', flexDirection: 'column', gap: 0.75, flex: 1 }}>
        <Box component="span" sx={{ alignSelf: 'flex-start', bgcolor: '#FFF0F0', color: RED_AA, fontSize: 11.5, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', px: 1, py: 0.25, borderRadius: '6px' }}>
          {slide.tag}
        </Box>
        <Typography component="h3" sx={{ fontSize: { xs: 17, md: 19 }, fontWeight: 600, color: '#0C0C0C', lineHeight: 1.3 }}>{slide.title}</Typography>
        <Typography sx={{ fontSize: 14, color: '#4B5563', lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {slide.subtitle}
        </Typography>
        <Box className="promo-cta" component="span" sx={{ mt: 'auto', pt: 1, display: 'inline-flex', alignItems: 'center', gap: 0.5, color: RED_AA, fontWeight: 600, fontSize: 14.5, transition: 'gap .2s' }}>
          {slide.cta ?? 'Shop now'} <EastIcon sx={{ fontSize: 18 }} />
        </Box>
      </Box>
    </Box>
  )
}

const navBtn = {
  width: 44, height: 44, bgcolor: '#fff', border: '1px solid #E5E7EB', color: '#0C0C0C', boxShadow: '0 1px 2px rgba(0,0,0,.05)',
  '&:hover': { bgcolor: '#fff', borderColor: '#FF0000', color: RED_AA },
  '&.Mui-focusVisible': { outline: `3px solid ${RED_AA}`, outlineOffset: 2 },
  '&.Mui-disabled': { bgcolor: '#F9FAFB', color: '#C4C8CF', borderColor: '#EEF0F3' },
} as const

export default function FeaturedOffersCarousel({ slides }: { slides: PromoSlide[] }) {
  const swiper = useRef<SwiperType | null>(null)
  const [state, setState] = useState({ begin: true, end: false, progress: 0 })
  const sync = (s: SwiperType) => setState({ begin: s.isBeginning, end: s.isEnd, progress: Math.min(1, Math.max(0, s.progress)) })
  if (!slides.length) return null

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Arrows sit top-right, level with the section heading's action area (desktop only). */}
      <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, justifyContent: 'flex-end', mt: { md: -9.5 }, mb: { md: 3 }, position: 'relative', zIndex: 1 }}>
        <IconButton aria-label="Previous offers" disabled={state.begin} onClick={() => swiper.current?.slidePrev()} sx={navBtn}>
          <ChevronLeftRoundedIcon />
        </IconButton>
        <IconButton aria-label="Next offers" disabled={state.end} onClick={() => swiper.current?.slideNext()} sx={navBtn}>
          <ChevronRightRoundedIcon />
        </IconButton>
      </Box>

      {/* overflow hidden keeps Swiper from widening the page; the slight right bleed shows the peek. */}
      <Box sx={{ overflow: 'hidden', mx: { xs: '-12px', md: 0 }, px: { xs: '12px', md: 0 }, '& .swiper': { overflow: 'visible' }, '& .swiper-slide': { height: 'auto' } }}>
        <Swiper
          modules={[A11y, Keyboard]}
          keyboard={{ enabled: true, onlyInViewport: true }}
          a11y={{ prevSlideMessage: 'Previous offer', nextSlideMessage: 'Next offer' }}
          slidesPerView={1.12}
          spaceBetween={14}
          breakpoints={{
            800: { slidesPerView: 1.6, spaceBetween: 18 },
            1100: { slidesPerView: 2.35, spaceBetween: 22 },
            1500: { slidesPerView: 2.6, spaceBetween: 24 },
          }}
          onSwiper={(s) => { swiper.current = s; sync(s) }}
          onSlideChange={sync}
          onProgress={sync}
          onResize={sync}
        >
          {slides.map((s) => (
            <SwiperSlide key={s.id}>
              <PromoCard slide={s} />
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      {/* Slim progress bar */}
      <Box role="presentation" sx={{ mt: { xs: 2.5, md: 3 }, mx: 'auto', width: { xs: 120, md: 180 }, height: 4, borderRadius: 4, bgcolor: '#E5E7EB', overflow: 'hidden' }}>
        <Box
          sx={{
            height: '100%', borderRadius: 4, bgcolor: '#FF0000',
            width: `${Math.max(100 / slides.length, state.progress * 100)}%`,
            transition: 'width .3s ease', '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
          }}
        />
      </Box>
    </Box>
  )
}
