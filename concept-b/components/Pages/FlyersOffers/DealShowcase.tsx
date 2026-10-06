import { Box, Typography } from '@mui/material'
import { m, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Reveal } from './Reveal'
import type { DealType } from './flyersOffersData'
import { dealTypes } from './flyersOffersData'

const HEADER_HEIGHT = 144

const pad = (n: number) => String(n).padStart(2, '0')

function DealPanel(props: { deal: DealType; index: number }) {
  const { deal, index } = props
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        bgcolor: deal.background,
        color: deal.color,
        borderRadius: { xs: '16px', md: '28px' },
        p: { xs: 3, md: 5 },
        height: '100%',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { md: 'center' },
        gap: { xs: 3, md: 4 },
      }}
    >
      <Box sx={{ flex: 1, position: 'relative', zIndex: 1 }}>
        <Typography
          sx={{
            fontWeight: 900,
            fontSize: { xs: '56px', md: '110px' },
            lineHeight: 0.9,
            color: 'transparent',
            WebkitTextStroke: `2px ${deal.color}`,
            opacity: 0.6,
          }}
        >
          {pad(index + 1)}
        </Typography>
        <Typography
          sx={{
            mt: { xs: 1.5, md: 2 },
            fontSize: { xs: '12px', md: '14px' },
            fontWeight: 800,
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}
        >
          {deal.label}
        </Typography>
        <Typography
          sx={{
            mt: 1,
            fontWeight: 900,
            fontSize: { xs: '28px', md: '48px' },
            lineHeight: 1.05,
            letterSpacing: '-1px',
            maxWidth: 520,
          }}
        >
          {deal.headline}
        </Typography>
        <Typography sx={{ mt: 1.5, fontSize: { xs: '14px', md: '16px' }, opacity: 0.85, maxWidth: 420 }}>
          {deal.description}
        </Typography>
      </Box>

      <Box sx={{ position: 'relative', flexShrink: 0, width: { xs: '100%', md: '40%' } }}>
        <Box
          component='img'
          src={deal.image}
          alt={deal.label}
          sx={{
            width: '100%',
            aspectRatio: { xs: '16 / 10', md: '1 / 1' },
            objectFit: 'cover',
            borderRadius: { xs: '16px', md: '50%' },
            border: `6px solid ${deal.color === '#fff' ? 'rgba(255,255,255,0.9)' : '#0C0C0C'}`,
            boxShadow: '0 24px 50px rgba(0,0,0,0.3)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            right: { xs: 12, md: 12 },
            top: { xs: 12, md: 16 },
            transform: 'rotate(12deg)',
            border: '3px solid',
            borderColor: deal.color,
            color: deal.color,
            bgcolor: deal.background,
            borderRadius: '10px',
            px: 1.5,
            py: 0.5,
            fontWeight: 900,
            fontSize: { xs: '13px', md: '16px' },
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}
        >
          Coming soon
        </Box>
      </Box>
    </Box>
  )
}

/** Desktop: the section pins and the deal panels slide sideways as the page scrolls. */
function PinnedShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState(0)
  const [current, setCurrent] = useState(1)

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current || !viewportRef.current) return
      setDistance(trackRef.current.scrollWidth - viewportRef.current.clientWidth)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })
  const x = useTransform(smooth, [0, 1], [0, -distance])

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    setCurrent(Math.min(dealTypes.length, Math.floor(value * dealTypes.length) + 1))
  })

  return (
    <Box ref={sectionRef} sx={{ position: 'relative', height: `${dealTypes.length * 85}vh` }}>
      <Box
        sx={{
          position: 'sticky',
          // Sit below the site's fixed desktop header.
          top: HEADER_HEIGHT,
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography
              sx={{ fontSize: { md: '12px' }, fontWeight: 800, color: '#FF413D', letterSpacing: '2.5px', textTransform: 'uppercase' }}
            >
              Keep scrolling
            </Typography>
            <Typography sx={{ fontWeight: 900, fontSize: { md: '40px' }, letterSpacing: '-1px', lineHeight: 1.1, color: '#0C0C0C' }}>
              What&apos;s coming
            </Typography>
          </Box>
          <Typography sx={{ fontWeight: 900, fontSize: { md: '28px' }, color: '#0C0C0C' }}>
            {pad(current)}
            <Box component='span' sx={{ color: '#9CA3AF' }}>
              {' '}
              / {pad(dealTypes.length)}
            </Box>
          </Typography>
        </Box>

        <Box ref={viewportRef} sx={{ overflow: 'visible' }}>
          <Box component={m.div} ref={trackRef} style={{ x }} sx={{ display: 'flex', gap: 3, width: 'max-content' }}>
            {dealTypes.map((deal, index) => (
              <Box key={deal.id} sx={{ width: { md: '72vw', lg: '64vw' }, maxWidth: 980, height: { md: `calc(100vh - ${HEADER_HEIGHT + 190}px)` }, minHeight: 360 }}>
                <DealPanel deal={deal} index={index} />
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ mt: 3, height: 4, bgcolor: '#F3F4F6', borderRadius: 2, overflow: 'hidden' }}>
          <Box
            component={m.div}
            style={{ scaleX: smooth }}
            sx={{ height: '100%', bgcolor: 'primary.main', transformOrigin: 'left' }}
          />
        </Box>
      </Box>
    </Box>
  )
}

export function DealShowcase() {
  return (
    <Box id='deal-showcase' sx={{ scrollMarginTop: { xs: '130px', md: `${HEADER_HEIGHT}px` } }}>
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <PinnedShowcase />
      </Box>

      {/* Mobile: panels stack and slide in from alternating sides */}
      <Box sx={{ display: { xs: 'block', md: 'none' }, mt: 4 }}>
        <Typography
          sx={{ fontSize: { xs: '11px' }, fontWeight: 800, color: '#FF413D', letterSpacing: '2.5px', textTransform: 'uppercase' }}
        >
          Keep scrolling
        </Typography>
        <Typography sx={{ fontWeight: 900, fontSize: { xs: '28px' }, letterSpacing: '-1px', color: '#0C0C0C', mb: 2 }}>
          What&apos;s coming
        </Typography>
        <Box sx={{ display: 'grid', gap: 2 }}>
          {dealTypes.map((deal, index) => (
            <Reveal key={deal.id} from={index % 2 ? 'right' : 'left'}>
              <DealPanel deal={deal} index={index} />
            </Reveal>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
