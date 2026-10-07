import type { ReactNode } from 'react'
import { useRouter } from 'next/router'
import { Box, Fab, Tooltip } from '@mui/material'
import { useToast } from '../../lib/toast'
import { colors, z } from '../../lib/theme'
import { RouteProgress, SkipLink } from '../ui/Feedback'
import Header, { FocusedHeader } from './Header'
import Footer from './Footer'
import DeliveryMinimumBar from './DeliveryMinimumBar'
import { ChatIcon, MicIcon } from '../ui/icons'

/**
 * Voice assistant (bottom-left) and chat (bottom-right), on every page. They rise above sticky mobile bars via
 * `--sticky-bottom`. In the prototype they explain what they do instead of silently doing nothing.
 */
function FloatingButtons() {
  const { toast } = useToast()
  const fab = {
    position: 'fixed', bottom: { xs: 'calc(12px + var(--sticky-bottom))', md: 'calc(24px + var(--sticky-bottom))' }, zIndex: z.fab,
    width: { xs: 46, md: 56 }, height: { xs: 46, md: 56 }, minHeight: 0, bgcolor: colors.red, color: '#fff', boxShadow: '0 8px 20px -6px rgba(224,0,0,.55)',
    transition: 'bottom .2s ease, background-color .15s', '&:hover': { bgcolor: colors.redHover }, '&.Mui-focusVisible': { outline: `2px solid ${colors.navy}`, outlineOffset: 3 },
  } as const
  return (
    <>
      <Tooltip title="Voice assistant" placement="right">
        <Fab aria-label="Voice assistant" onClick={() => toast({ message: 'Voice assistant', description: 'Ask about products, orders or delivery by voice — runs on the live site.', severity: 'info' })} sx={{ ...fab, left: { xs: 12, md: 24 } }}>
          <MicIcon />
        </Fab>
      </Tooltip>
      <Tooltip title="Chat with us" placement="left">
        <Fab aria-label="Chat with us" onClick={() => toast({ message: 'Live chat', description: 'Our team replies Mon–Sat, 9am–6pm. The chat window opens here on the live site.', severity: 'info' })} sx={{ ...fab, right: { xs: 12, md: 24 } }}>
          <ChatIcon />
        </Fab>
      </Tooltip>
    </>
  )
}

const focused: Record<string, 'signin' | 'checkout'> = {
  '/account/signin': 'signin',
  '/checkout': 'checkout',
  '/checkout/payment': 'checkout',
}
/** Pages where the delivery bar would repeat what the page already shows. */
const noDeliveryBar = ['/cart', '/checkout/success']

export default function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useRouter()
  const mode = focused[pathname]
  // Cart and checkout hide the footer on phones so the summary and pay button stay in view (design brief).
  const hideFooterOnPhone = pathname === '/cart' || !!mode
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SkipLink />
      <RouteProgress />
      {mode ? <FocusedHeader variant={mode} /> : <Header />}
      {!mode && !noDeliveryBar.includes(pathname) && <DeliveryMinimumBar />}
      <Box component="main" id="main" tabIndex={-1} sx={{ flex: 1, outline: 'none', bgcolor: mode === 'checkout' ? colors.subtle : '#fff' }}>{children}</Box>
      {mode !== 'checkout' && (
        <Box sx={{ display: hideFooterOnPhone ? { xs: 'none', md: 'block' } : 'block' }}><Footer /></Box>
      )}
      <FloatingButtons />
    </Box>
  )
}
