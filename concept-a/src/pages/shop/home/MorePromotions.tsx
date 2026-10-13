import { Box, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded'
import { tokens } from '../../../theme'
import { categoryTree } from '../../../data/categoryTree'
import Rail from './Rail'
import { SectionHeader } from '../../../components/ui'

const c = tokens.color

/**
 * "More promotions" row from Concept B: uniform promo cards (media + tag, title, subtitle, CTA) in a swipe / arrow
 * rail, no autoplay. Slides are data so marketing can swap them like a CMS block.
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

const deptImage = (key: string) => categoryTree.find((d) => d.url_key === key)?.image ?? ''

const promotions: PromoSlide[] = [
  { id: 'canola', tag: 'In-store deal', title: '16L canola oil — now $42.99', subtitle: 'Limited-time offer at our Mississauga cash & carry', href: '/search/canola', media: { kind: 'poster', src: '/assets/sum-offer-2.jpeg', alt: 'Business owners: 16L canola oil deal, now $42.99, was $46.99' } },
  { id: 'wholesale', tag: 'Business pricing', title: 'Wholesale sourcing, made simple', subtitle: 'Quality brands across every department', href: '/account/signin?mode=create', cta: 'Register for business pricing', media: { kind: 'poster', src: '/assets/sum-offer-1.jpeg', alt: 'Elevate your business: wholesale sourcing made simple' } },
  { id: 'packaging', tag: 'Department', title: 'Packaging for every order', subtitle: 'Containers, cups, bags and cutlery for takeout and delivery', href: '/shop/packaging', media: { kind: 'photo', src: deptImage('packaging'), alt: '', overlayTitle: 'Packaging' } },
  { id: 'produce', tag: 'Department', title: 'Fresh produce, picked for kitchens', subtitle: 'Fruit, vegetables and herbs on cold-chain routes', href: '/shop/produce', media: { kind: 'photo', src: deptImage('produce'), alt: '', overlayTitle: 'Produce' } },
  { id: 'dairy', tag: 'Department', title: 'Dairy & eggs, stocked daily', subtitle: 'Milk, cheese, butter and eggs in foodservice sizes', href: '/shop/dairy-eggs', media: { kind: 'photo', src: '/assets/dairyandeggs.png', alt: '', overlayTitle: 'Dairy & Eggs' } },
  { id: 'grocery', tag: 'Department', title: 'Pantry staples, stock-ready', subtitle: 'Rice, oil, spices and sauces in bulk', href: '/shop/grocery', media: { kind: 'photo', src: '/assets/grocery.png', alt: '', overlayTitle: 'Grocery' } },
]

function Media({ media }: { media: PromoSlide['media'] }) {
  if (media.kind === 'poster') {
    return (
      <Box sx={{ position: 'absolute', inset: 0, bgcolor: c.surface2 }}>
        <Box component="img" src={media.src} alt={media.alt} loading="lazy" sx={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
      </Box>
    )
  }
  return (
    <Box sx={{ position: 'absolute', inset: 0, bgcolor: c.navyDark }}>
      <Box component="img" src={media.src} alt={media.alt} loading="lazy" className="promo-photo" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .45s ease' }} />
      <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(17,24,39,.78) 0%, rgba(17,24,39,.35) 55%, rgba(17,24,39,0) 80%)' }} />
      <Typography aria-hidden sx={{ position: 'absolute', left: 20, bottom: 18, color: '#fff', fontSize: { xs: 22, md: 26 }, fontWeight: 700, lineHeight: 1.1, maxWidth: '60%' }}>{media.overlayTitle}</Typography>
    </Box>
  )
}

function PromoCard({ slide }: { slide: PromoSlide }) {
  return (
    <Box
      component={RouterLink}
      to={slide.href}
      sx={{
        display: 'flex', flexDirection: 'column', height: '100%', textDecoration: 'none', color: 'inherit', bgcolor: '#fff', borderRadius: `${tokens.radius.md}px`, border: `1px solid ${c.line}`, overflow: 'hidden',
        transition: 'box-shadow .2s, transform .2s', '&:hover': { boxShadow: tokens.shadow.hover, transform: 'translateY(-2px)' }, '&:hover .promo-photo': { transform: 'scale(1.04)' }, '&:hover .promo-cta': { gap: 1 },
        '&:focus-visible': { outline: `3px solid ${c.navy}`, outlineOffset: 2 },
      }}
    >
      <Box sx={{ position: 'relative', aspectRatio: '16 / 8', overflow: 'hidden' }}><Media media={slide.media} /></Box>
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 0.5, flex: 1 }}>
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: c.red, letterSpacing: '.08em', textTransform: 'uppercase' }}>{slide.tag}</Typography>
        <Typography component="h3" sx={{ fontSize: 17, fontWeight: 600, lineHeight: 1.3, color: c.ink }}>{slide.title}</Typography>
        <Typography sx={{ fontSize: 14, color: c.text2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{slide.subtitle}</Typography>
        <Box className="promo-cta" component="span" sx={{ mt: 'auto', pt: 1, display: 'inline-flex', alignItems: 'center', gap: 0.5, color: c.red, fontWeight: 600, fontSize: 14.5, transition: 'gap .15s' }}>
          {slide.cta ?? 'Shop now'} <ArrowForwardRounded sx={{ fontSize: 18 }} />
        </Box>
      </Box>
    </Box>
  )
}

export default function MorePromotions({ slides = promotions }: { slides?: PromoSlide[] }) {
  if (!slides.length) return null
  return (
    <Box component="section" aria-labelledby="more-promotions-title">
      <SectionHeader id="more-promotions-title" eyebrow="Flyers & offers" title="More promotions" action="All flyers & offers" href="/flyers-offers" />
      <Rail label="Promotions" itemWidth={{ xs: '86%', sm: '62%', md: '45%', lg: '32%' }}>
        {slides.map((s) => <Box role="listitem" key={s.id}><PromoCard slide={s} /></Box>)}
      </Rail>
    </Box>
  )
}
