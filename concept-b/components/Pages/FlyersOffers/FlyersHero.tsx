import { Box, Button, Typography } from '@mui/material'
import SouthIcon from '@mui/icons-material/South'
import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { useRef } from 'react'

type Bubble = {
  image: string
  label: string
  size: { xs: number; md: number }
  position: Record<string, unknown>
  /** How far the bubble travels while the hero scrolls away (parallax depth). */
  depth: number
  hideOnMobile?: boolean
}

const bubbles: Bubble[] = [
  { image: '/assets/beverages.png', label: 'Beverage', size: { xs: 78, md: 150 }, position: { top: { xs: 16, md: '10%' }, left: { xs: 12, md: '6%' } }, depth: -160 },
  { image: '/assets/frozen.png', label: 'Frozen', size: { xs: 64, md: 120 }, position: { bottom: { xs: 70, md: '14%' }, left: { xs: 18, md: '12%' } }, depth: -60 },
  { image: '/assets/grocery.png', label: 'Grocery', size: { xs: 84, md: 170 }, position: { top: { xs: 20, md: '8%' }, right: { xs: 12, md: '7%' } }, depth: -220 },
  { image: '/assets/cleaning.png', label: 'Janitorial', size: { xs: 60, md: 110 }, position: { top: { md: '46%' }, right: { md: '3%' } }, depth: -100, hideOnMobile: true },
  { image: '/assets/dairyandeggs.png', label: 'Dairy', size: { xs: 70, md: 130 }, position: { bottom: { xs: 64, md: '10%' }, right: { xs: 16, md: '16%' } }, depth: -40 },
  { image: '/assets/bakery.png', label: 'Bakery', size: { xs: 56, md: 96 }, position: { top: { md: '52%' }, left: { md: '1.5%' } }, depth: -130, hideOnMobile: true },
]

function FloatingBubble(props: { bubble: Bubble; index: number; progress: MotionValue<number> }) {
  const { bubble, index, progress } = props
  const reduceMotion = useReducedMotion()
  const y = useTransform(progress, [0, 1], [0, reduceMotion ? 0 : bubble.depth])

  return (
    <Box
      component={m.div}
      style={{ y }}
      sx={{
        position: 'absolute',
        ...bubble.position,
        display: bubble.hideOnMobile ? { xs: 'none', md: 'block' } : 'block',
        zIndex: 0,
      }}
    >
      <m.div
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <Box
          sx={{
            position: 'relative',
            width: bubble.size,
            height: bubble.size,
            animation: `flyersBob ${4 + (index % 3)}s ease-in-out ${index * 0.4}s infinite`,
            '@keyframes flyersBob': {
              '0%, 100%': { transform: 'translateY(0) rotate(-3deg)' },
              '50%': { transform: 'translateY(-12px) rotate(3deg)' },
            },
            '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
          }}
        >
          <Box
            component='img'
            src={bubble.image}
            alt={bubble.label}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '50%',
              border: { xs: '3px solid #fff', md: '6px solid #fff' },
              boxShadow: '0 16px 40px rgba(12,12,12,0.18)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: { xs: -6, md: 2 },
              left: '50%',
              transform: 'translateX(-50%)',
              bgcolor: '#0C0C0C',
              color: '#fff',
              borderRadius: '40px',
              px: { xs: 0.75, md: 1.25 },
              py: 0.25,
              fontSize: { xs: '9px', md: '11px' },
              fontWeight: 700,
              whiteSpace: 'nowrap',
            }}
          >
            {bubble.label}
          </Box>
        </Box>
      </m.div>
    </Box>
  )
}

/** One headline line that rises out of a mask on load and drifts sideways on scroll. */
function HeadlineLine(props: { children: React.ReactNode; x: MotionValue<string>; delay: number }) {
  const { children, x, delay } = props
  return (
    <Box component={m.div} style={{ x }} sx={{ overflow: 'hidden', lineHeight: 0.95 }}>
      <m.div
        initial={{ y: '110%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </m.div>
    </Box>
  )
}

const headlineSx = {
  fontWeight: 900,
  fontSize: { xs: '52px', sm: '84px', md: '120px', lg: '140px' },
  letterSpacing: { xs: '-2px', md: '-5px' },
  lineHeight: 0.95,
  textTransform: 'uppercase',
}

export function FlyersHero() {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const leftX = useTransform(scrollYProgress, [0, 1], ['0%', reduceMotion ? '0%' : '-30%'])
  const rightX = useTransform(scrollYProgress, [0, 1], ['0%', reduceMotion ? '0%' : '30%'])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <Box
      ref={ref}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: { xs: '12px', md: '24px' },
        bgcolor: '#FFF6F5',
        backgroundImage: 'radial-gradient(rgba(255,0,0,0.12) 1.5px, transparent 1.5px)',
        backgroundSize: '22px 22px',
        minHeight: { xs: 560, md: 'min(720px, calc(100vh - 150px))' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: { xs: 14, md: 8 },
      }}
    >
      {bubbles.map((bubble, index) => (
        <FloatingBubble key={bubble.label} bubble={bubble} index={index} progress={scrollYProgress} />
      ))}

      <Box component={m.div} style={{ opacity: fade }} sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <m.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: '#0C0C0C',
              color: '#fff',
              borderRadius: '40px',
              px: 1.75,
              py: 0.6,
              mb: { xs: 2, md: 3 },
              fontSize: { xs: '11px', md: '13px' },
              fontWeight: 800,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: '#FFD600',
                animation: 'flyersPulse 1.6s ease-in-out infinite',
                '@keyframes flyersPulse': {
                  '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                  '50%': { opacity: 0.35, transform: 'scale(0.7)' },
                },
              }}
            />
            Coming soon
          </Box>
        </m.div>

        <Typography component='h1' sx={{ m: 0 }}>
          <HeadlineLine x={leftX} delay={0.1}>
            <Box component='span' sx={{ ...headlineSx, display: 'block', color: '#0C0C0C' }}>
              Flyers
            </Box>
          </HeadlineLine>
          <HeadlineLine x={rightX} delay={0.25}>
            <Box component='span' sx={{ ...headlineSx, display: 'block', color: 'primary.main' }}>
              <Box
                component='span'
                sx={{ color: 'transparent', WebkitTextStroke: { xs: '2px #FF0000', md: '3px #FF0000' } }}
              >
                &amp;
              </Box>{' '}
              Offers
            </Box>
          </HeadlineLine>
        </Typography>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <Typography
            sx={{
              mt: { xs: 2.5, md: 3 },
              mx: 'auto',
              maxWidth: 520,
              color: '#4B5563',
              fontSize: { xs: '14px', md: '17px' },
            }}
          >
            Warehouse deals built for your kitchen. A monthly flyer, weekly hot picks, bulk savings and
            ready-made bundles are on their way.
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              href='#deal-showcase'
              variant='contained'
              endIcon={<SouthIcon />}
              sx={{
                bgcolor: 'primary.main',
                color: '#fff',
                fontWeight: 700,
                borderRadius: '80px',
                height: 46,
                px: 3,
                textTransform: 'none',
                boxShadow: '0 10px 24px rgba(255,0,0,0.25)',
                '&:hover': { bgcolor: '#e63939' },
              }}
            >
              See what&apos;s coming
            </Button>
            <Button
              href='#warehouses'
              sx={{
                color: '#0C0C0C',
                fontWeight: 700,
                border: '2px solid #0C0C0C',
                borderRadius: '80px',
                height: 46,
                px: 3,
                textTransform: 'none',
                '&:hover': { bgcolor: '#0C0C0C', color: '#fff' },
              }}
            >
              Choose your warehouse
            </Button>
          </Box>
        </m.div>
      </Box>
    </Box>
  )
}
