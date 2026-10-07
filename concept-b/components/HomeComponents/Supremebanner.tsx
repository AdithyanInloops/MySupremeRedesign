import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Box, IconButton, Tooltip } from '@mui/material'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import PauseRoundedIcon from '@mui/icons-material/PauseRounded'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import { Swiper, SwiperSlide } from 'swiper/react'
import { A11y, Autoplay, Keyboard } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { colors, focusRing, radius, shadow } from '../../lib/theme'

/**
 * Hero banner slider (Magento Page Builder banners: desktop image, mobile image, link).
 * Each slide links somewhere and has its own alt text (the banner art carries baked-in copy). Autoplay pauses on
 * hover/focus, has a visible pause button (WCAG 2.2.2) and is off entirely under prefers-reduced-motion.
 */
export type HeroSlide = { desktop: string; mobile?: string; alt: string; href: string }

export default function Supremebanner({ slides, interval = 6000 }: { slides: HeroSlide[]; interval?: number }) {
  const swiper = useRef<SwiperType | null>(null)
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setPlaying(false)
  }, [])
  useEffect(() => {
    const a = swiper.current?.autoplay
    if (!a) return
    if (playing) a.start()
    else a.stop()
  }, [playing])
  if (!slides.length) return null

  const nav = (side: 'left' | 'right') => ({
    position: 'absolute', top: '50%', [side]: 12, transform: 'translateY(-50%)', zIndex: 2, width: 44, height: 44, borderRadius: '50%',
    bgcolor: 'rgba(255,255,255,.92)', color: colors.ink, boxShadow: shadow.md, opacity: { xs: 0, md: 0 }, transition: 'opacity .2s',
    '&:hover': { bgcolor: '#fff' }, '&.Mui-focusVisible': { opacity: 1, outline: `2px solid ${colors.navy}`, outlineOffset: 2 },
  }) as const

  return (
    <Box
      component="section"
      aria-roledescription="carousel"
      aria-label="Promotions"
      onMouseEnter={() => swiper.current?.autoplay?.pause()}
      onMouseLeave={() => playing && swiper.current?.autoplay?.resume()}
      onFocusCapture={() => swiper.current?.autoplay?.pause()}
      onBlurCapture={() => playing && swiper.current?.autoplay?.resume()}
      sx={{ position: 'relative', width: '100%', aspectRatio: { xs: '16 / 9', md: '1920 / 750' }, overflow: 'hidden', borderRadius: { xs: radius.lg, md: radius.xl }, bgcolor: colors.sunken, '&:hover .hero-nav': { opacity: { md: 1 } } }}
    >
      <Swiper
        modules={[Autoplay, A11y, Keyboard]}
        autoplay={{ delay: interval, disableOnInteraction: false, pauseOnMouseEnter: false }}
        keyboard={{ enabled: true, onlyInViewport: true }}
        a11y={{ enabled: true, slideRole: 'group', slideLabelMessage: 'Slide {{index}} of {{slidesLength}}' }}
        loop
        onSwiper={(s) => { swiper.current = s; if (!playing) s.autoplay?.stop() }}
        onRealIndexChange={(s) => setIndex(s.realIndex)}
        style={{ width: '100%', height: '100%' }}
      >
        {slides.map((s, i) => (
          <SwiperSlide key={s.desktop}>
            <Box component={Link} href={s.href} tabIndex={i === index ? 0 : -1} sx={{ display: 'block', width: '100%', height: '100%', ...focusRing, '&:focus-visible': { outline: `3px solid ${colors.navy}`, outlineOffset: -3 } }}>
              <picture>
                {s.mobile && <source media="(max-width: 799px)" srcSet={s.mobile} />}
                <img src={s.desktop} alt={s.alt} loading={i === 0 ? 'eager' : 'lazy'} width={1920} height={750} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </picture>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>

      <IconButton className="hero-nav" aria-label="Previous slide" onClick={() => swiper.current?.slidePrev()} sx={nav('left')}><ChevronLeftRoundedIcon /></IconButton>
      <IconButton className="hero-nav" aria-label="Next slide" onClick={() => swiper.current?.slideNext()} sx={nav('right')}><ChevronRightRoundedIcon /></IconButton>

      {/* Dots + pause on a soft pill so they read on light and dark banners */}
      <Box sx={{ position: 'absolute', zIndex: 2, bottom: { xs: 8, md: 14 }, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 0.25, bgcolor: 'rgba(17,24,39,.55)', backdropFilter: 'blur(4px)', borderRadius: radius.pill, px: 0.5, py: 0.25 }}>
        {slides.map((s, i) => (
          <Box
            key={s.desktop}
            component="button"
            onClick={() => swiper.current?.slideToLoop(i)}
            aria-label={`Show slide ${i + 1} of ${slides.length}`}
            aria-current={i === index ? 'true' : undefined}
            sx={{ all: 'unset', cursor: 'pointer', width: 24, height: 24, display: 'grid', placeItems: 'center', borderRadius: '50%', '&:focus-visible': { outline: '2px solid #fff' } }}
          >
            <Box sx={{ width: i === index ? 18 : 7, height: 7, borderRadius: 4, bgcolor: i === index ? '#fff' : 'rgba(255,255,255,.55)', transition: 'width .25s ease, background-color .25s' }} />
          </Box>
        ))}
        <Tooltip title={playing ? 'Pause slideshow' : 'Play slideshow'}>
          <IconButton size="small" aria-label={playing ? 'Pause slideshow' : 'Play slideshow'} onClick={() => setPlaying((p) => !p)} sx={{ width: 28, height: 28, color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,.15)' }, '&.Mui-focusVisible': { outline: '2px solid #fff' } }}>
            {playing ? <PauseRoundedIcon sx={{ fontSize: 16 }} /> : <PlayArrowRoundedIcon sx={{ fontSize: 16 }} />}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  )
}
