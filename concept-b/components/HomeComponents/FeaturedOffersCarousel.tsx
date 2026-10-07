import Link from 'next/link'
import { Box, Typography } from '@mui/material'
import { colors, focusRing, motion, radius, shadow } from '../../lib/theme'
import { Rail } from '../Product/ProductRail'
import { ArrowRightIcon } from '../ui/icons'

/**
 * Promotions row: uniform promo cards (media + tag, title, subtitle, CTA) in the shared rail (swipe / arrows,
 * no autoplay). Slides are a prop so marketing can swap them like a CMS block.
 * - `poster`: a finished promo image with its own text — shown uncropped (contain).
 * - `photo`: a plain photo (e.g. a Magento category image) — cover-cropped with an overlay title.
 */
export type PromoSlide = {
  id: string
  tag: string
  title: string
  subtitle: string
  href: string
  cta?: string
  media: { kind: 'poster'; src: string; alt: string } | { kind: 'photo'; src: string; alt: string; overlayTitle: string }
}

function Media({ media }: { media: PromoSlide['media'] }) {
  if (media.kind === 'poster') {
    return (
      <Box sx={{ position: 'absolute', inset: 0, bgcolor: colors.sunken }}>
        <Box component="img" src={media.src} alt={media.alt} loading="lazy" sx={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
      </Box>
    )
  }
  return (
    <Box sx={{ position: 'absolute', inset: 0, bgcolor: colors.navyDark }}>
      <Box component="img" src={media.src} alt={media.alt} loading="lazy" className="promo-photo" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: `transform ${motion.slow}` }} />
      <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(17,24,39,.78) 0%, rgba(17,24,39,.35) 55%, rgba(17,24,39,0) 80%)' }} />
      <Typography aria-hidden sx={{ position: 'absolute', left: 20, bottom: 18, color: '#fff', fontSize: { xs: 22, md: 26 }, fontWeight: 700, lineHeight: 1.1, maxWidth: '60%' }}>{media.overlayTitle}</Typography>
    </Box>
  )
}

function PromoCard({ slide }: { slide: PromoSlide }) {
  return (
    <Box
      component={Link}
      href={slide.href}
      sx={{
        display: 'flex', flexDirection: 'column', height: '100%', textDecoration: 'none', color: 'inherit', bgcolor: '#fff', borderRadius: radius.lg, border: `1px solid ${colors.line}`, overflow: 'hidden',
        transition: `box-shadow ${motion.base}, transform ${motion.base}`, '&:hover': { boxShadow: shadow.md, transform: 'translateY(-2px)' }, '&:hover .promo-photo': { transform: 'scale(1.04)' }, '&:hover .promo-cta': { gap: 1 }, ...focusRing,
      }}
    >
      <Box sx={{ position: 'relative', aspectRatio: '16 / 8', overflow: 'hidden' }}><Media media={slide.media} /></Box>
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 0.5, flex: 1 }}>
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: colors.redText, letterSpacing: '.08em', textTransform: 'uppercase' }}>{slide.tag}</Typography>
        <Typography component="h3" sx={{ fontSize: 17, fontWeight: 600, lineHeight: 1.3 }}>{slide.title}</Typography>
        <Typography sx={{ fontSize: 14, color: colors.ink600, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{slide.subtitle}</Typography>
        <Box className="promo-cta" component="span" sx={{ mt: 'auto', pt: 1, display: 'inline-flex', alignItems: 'center', gap: 0.5, color: colors.redText, fontWeight: 600, fontSize: 14.5, transition: `gap ${motion.fast}` }}>
          {slide.cta ?? 'Shop now'} <ArrowRightIcon sx={{ fontSize: 18 }} />
        </Box>
      </Box>
    </Box>
  )
}

export default function FeaturedOffersCarousel({ slides }: { slides: PromoSlide[] }) {
  if (!slides.length) return null
  return (
    <Rail label="Promotions" itemWidth={{ xs: '86%', sm: '62%', md: '45%', lg: '32%', xl: '32%' }}>
      {slides.map((s) => <Box role="listitem" key={s.id}><PromoCard slide={s} /></Box>)}
    </Rail>
  )
}
