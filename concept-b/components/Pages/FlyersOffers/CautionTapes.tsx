import { Box } from '@mui/material'
import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'

const words = ['Coming soon', 'Flyers & Offers', 'Warehouse deals', 'Bulk savings', 'Weekly hot picks']

function Tape(props: { rotate: number; reverse?: boolean; dark?: boolean; shift: MotionValue<number> }) {
  const { rotate, reverse, dark, shift } = props
  const bg = dark ? '#0C0C0C' : '#FFD600'
  const fg = dark ? '#FFD600' : '#0C0C0C'

  return (
    <Box
      sx={{
        position: 'absolute',
        left: '-10%',
        width: '120%',
        top: '50%',
        transform: `translateY(-50%) rotate(${rotate}deg)`,
        bgcolor: bg,
        color: fg,
        py: { xs: 1, md: 1.5 },
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        overflow: 'hidden',
        // Hazard stripes along both edges
        '&::before, &::after': {
          content: '""',
          position: 'absolute',
          left: 0,
          right: 0,
          height: 6,
          backgroundImage: `repeating-linear-gradient(-45deg, ${fg} 0 10px, ${bg} 10px 20px)`,
        },
        '&::before': { top: 0 },
        '&::after': { bottom: 0 },
      }}
    >
      <Box component={m.div} style={{ x: shift }}>
        <Box
          sx={{
            display: 'flex',
            width: 'max-content',
            animation: `flyersTape 30s linear infinite ${reverse ? 'reverse' : ''}`,
            '@keyframes flyersTape': {
              from: { transform: 'translateX(0)' },
              to: { transform: 'translateX(-50%)' },
            },
            '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
          }}
        >
          {[0, 1].map((copy) => (
            <Box key={copy} aria-hidden={copy === 1} sx={{ display: 'flex' }}>
              {[...words, ...words].map((word, i) => (
                <Box
                  key={`${word}-${i}`}
                  component='span'
                  sx={{
                    px: { xs: 1.5, md: 2.5 },
                    whiteSpace: 'nowrap',
                    fontWeight: 900,
                    fontSize: { xs: '14px', md: '20px' },
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: { xs: 1.5, md: 2.5 },
                    '&::after': { content: '"✦"', color: dark ? '#fff' : '#FF0000' },
                  }}
                >
                  {word}
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

/** Two crossing "caution tape" tickers that also slide faster as the page scrolls. */
export function CautionTapes() {
  const reduceMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const forward = useTransform(scrollY, [0, 2000], [0, reduceMotion ? 0 : -600])
  const backward = useTransform(scrollY, [0, 2000], [-600, reduceMotion ? -600 : 0])

  return (
    <Box
      aria-label='Coming soon'
      sx={{ position: 'relative', height: { xs: 110, md: 160 }, overflow: 'hidden', my: { xs: -3, md: -5 }, zIndex: 2 }}
    >
      <Tape rotate={-4} dark shift={backward} />
      <Tape rotate={3} reverse shift={forward} />
    </Box>
  )
}
