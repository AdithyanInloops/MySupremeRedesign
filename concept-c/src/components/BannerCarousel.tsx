import { useEffect, useRef, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Box, IconButton } from '@mui/material'
import { tokens, focusRing } from '../theme'
import { useDragScroll } from './useDragScroll'
import { PauseIcon, PlayIcon } from './icons'

const c = tokens.color
const img = (f: string) => `${import.meta.env.BASE_URL}banners/${f}`

/** The client's own mobile hero banners (the live site's mobile slider), each linked to where it promises to go. */
export const heroSlides = [
  { src: img('fresh-produce.jpg'), to: '/shop/produce', alt: 'Fresh produce. Best price guaranteed. Shop produce — same day or next day delivery across the GTA, Hamilton and Niagara.' },
  { src: img('wholesale-simple.jpg'), to: '/shop', alt: 'Wholesale made simple. Business made better. Shop all departments.' },
  { src: img('fast-delivery.jpg'), to: '/help', alt: 'Fast and reliable B2B delivery for businesses that can’t wait.' },
  { src: img('cash-and-carry.jpg'), to: '/help', alt: 'Shop from our cash and carry store at 3750A Laird Road, Unit 9, Mississauga.' },
  { src: img('kitchen-team.jpg'), to: '/help', alt: 'Meet the people who help keep your kitchen moving.' },
]

const INTERVAL = 4500

/**
 * Hero slider: swipe (or mouse-drag) with snap, dots, autoplay that pauses while the buyer touches, hovers or focuses
 * it, when the tab is hidden, and never runs under reduced motion. A pause button covers WCAG 2.2.2.
 */
export default function BannerCarousel({ slides = heroSlides }: { slides?: typeof heroSlides }) {
  const drag = useDragScroll<HTMLDivElement>()
  const track = drag.ref
  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(() => !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
  const hold = useRef(false)

  const go = (n: number) => {
    const el = track.current
    if (!el) return
    const w = (el.firstElementChild as HTMLElement | null)?.offsetWidth ?? el.clientWidth
    el.scrollTo({ left: n * (w + 8), behavior: 'smooth' })
  }

  useEffect(() => {
    if (!playing) return
    const t = window.setInterval(() => {
      if (hold.current || document.hidden) return
      go((i + 1) % slides.length)
    }, INTERVAL)
    return () => window.clearInterval(t)
  }, [playing, i, slides.length])

  const pause = () => { hold.current = true }
  const resume = () => { hold.current = false }

  return (
    <Box component="section" aria-roledescription="carousel" aria-label="Featured" onPointerEnter={pause} onPointerLeave={resume} onFocus={pause} onBlur={resume} onTouchStart={pause} onTouchEnd={resume}>
      <Box {...drag} className="no-scrollbar"
        onScroll={(e) => { const el = e.currentTarget; const w = (el.firstElementChild as HTMLElement | null)?.offsetWidth ?? el.clientWidth; setI(Math.min(slides.length - 1, Math.round(el.scrollLeft / (w + 8)))) }}
        sx={{ display: 'flex', gap: 1, overflowX: 'auto', px: 2, scrollSnapType: 'x mandatory', scrollPaddingInline: '16px' }}>
        {slides.map((s, k) => (
          <Box key={s.src} role="group" aria-roledescription="slide" aria-label={`${k + 1} of ${slides.length}`} sx={{ flex: '0 0 100%', scrollSnapAlign: 'start' }}>
            <Box component={RouterLink} to={s.to} aria-label={s.alt} tabIndex={k === i ? 0 : -1} sx={{ display: 'block', position: 'relative', aspectRatio: '16 / 9', borderRadius: `${tokens.radius.lg}px`, overflow: 'hidden', bgcolor: c.navyDark, boxShadow: '0 14px 30px -16px rgba(27,25,80,.55)', ...focusRing }}>
              <Box component="img" src={s.src} alt="" loading={k === 0 ? 'eager' : 'lazy'} draggable={false} sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            </Box>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.25, mt: 0.5 }}>
        {slides.map((s, k) => (
          <Box key={s.src} component="button" onClick={() => go(k)} aria-label={`Show slide ${k + 1}`} aria-current={k === i ? 'true' : undefined}
            sx={{ all: 'unset', cursor: 'pointer', width: 24, height: 24, display: 'grid', placeItems: 'center', borderRadius: '50%', ...focusRing }}>
            <Box sx={{ width: k === i ? 18 : 6, height: 6, borderRadius: 3, bgcolor: k === i ? c.red : c.line2, transition: `width ${tokens.motion.base}, background-color ${tokens.motion.base}` }} />
          </Box>
        ))}
        <IconButton aria-label={playing ? 'Pause slideshow' : 'Play slideshow'} onClick={() => setPlaying((p) => !p)} sx={{ width: 28, height: 28, ml: 0.5, color: c.text3 }}>
          {playing ? <PauseIcon sx={{ fontSize: 15 }} /> : <PlayIcon sx={{ fontSize: 15 }} />}
        </IconButton>
      </Box>
    </Box>
  )
}
