import { Box, Typography } from '@mui/material'
import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined'
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import { m, useScroll, useSpring } from 'framer-motion'
import { useRef } from 'react'
import { Reveal } from './Reveal'

const steps = [
  {
    icon: <WarehouseOutlinedIcon />,
    title: 'Choose your warehouse',
    text: 'See the offers available at the MySupreme warehouse nearest to you.',
  },
  {
    icon: <MenuBookOutlinedIcon />,
    title: 'Browse the flyer',
    text: 'Monthly flyer, weekly hot picks, bulk savers and ready-made bundles in one place.',
  },
  {
    icon: <LocalShippingOutlinedIcon />,
    title: 'Order your way',
    text: 'Add deals to your cart for delivery, or pick them up at the warehouse.',
  },
]

/** Vertical timeline whose line fills in as the section scrolls past. */
export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1.4fr' },
        gap: { xs: 3, md: 8 },
        alignItems: 'start',
      }}
    >
      <Box sx={{ position: { md: 'sticky' }, top: { md: 180 } }}>
        <Reveal>
          <Typography
            sx={{ fontSize: '12px', fontWeight: 800, color: '#FF413D', letterSpacing: '2.5px', textTransform: 'uppercase' }}
          >
            How it will work
          </Typography>
          <Typography
            sx={{
              fontWeight: 900,
              fontSize: { xs: '28px', md: '44px' },
              letterSpacing: '-1px',
              lineHeight: 1.05,
              color: '#0C0C0C',
              mt: 1,
            }}
          >
            Three steps to
            <Box component='span' sx={{ color: 'primary.main', display: 'block' }}>
              smarter stocking.
            </Box>
          </Typography>
        </Reveal>
      </Box>

      <Box ref={ref} sx={{ position: 'relative', pl: { xs: 7, md: 9 } }}>
        {/* Track and animated fill */}
        <Box sx={{ position: 'absolute', left: { xs: 22, md: 30 }, top: 8, bottom: 8, width: 4, bgcolor: '#F3F4F6', borderRadius: 2 }}>
          <Box
            component={m.div}
            style={{ scaleY: fill }}
            sx={{ height: '100%', bgcolor: 'primary.main', borderRadius: 2, transformOrigin: 'top' }}
          />
        </Box>

        {steps.map((step, index) => (
          <Reveal key={step.title} from='right' delay={0.05}>
            <Box sx={{ position: 'relative', pb: index === steps.length - 1 ? 0 : { xs: 4, md: 7 } }}>
              <Box
                sx={{
                  position: 'absolute',
                  left: { xs: -56, md: -72 },
                  top: 0,
                  width: { xs: 48, md: 64 },
                  height: { xs: 48, md: 64 },
                  borderRadius: '50%',
                  bgcolor: '#fff',
                  border: '4px solid',
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 20px rgba(255,0,0,0.15)',
                }}
              >
                {step.icon}
              </Box>
              <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#9CA3AF', letterSpacing: '2px' }}>
                STEP {index + 1}
              </Typography>
              <Typography sx={{ fontWeight: 800, fontSize: { xs: '20px', md: '26px' }, color: '#0C0C0C', mt: 0.5 }}>
                {step.title}
              </Typography>
              <Typography sx={{ color: '#4B5563', fontSize: { xs: '14px', md: '16px' }, mt: 1, maxWidth: 460 }}>
                {step.text}
              </Typography>
            </Box>
          </Reveal>
        ))}
      </Box>
    </Box>
  )
}
