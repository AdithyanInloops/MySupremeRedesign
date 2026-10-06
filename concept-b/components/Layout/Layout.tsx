import type { ReactNode } from 'react'
import { useRouter } from 'next/router'
import { Box, Fab } from '@mui/material'
import MicIcon from '@mui/icons-material/Mic'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble'
import Header from './Header'
import Footer from './Footer'
import DeliveryMinimumBar from './DeliveryMinimumBar'

/** Voice assistant (bottom-left) and chat (bottom-right) — static circles in the prototype. */
function FloatingButtons() {
  const fab = { position: 'fixed', bottom: 20, zIndex: 1050, bgcolor: '#FF0000', color: '#fff', width: 60, height: 60, boxShadow: '0 6px 20px rgba(255,0,0,.35)', '&:hover': { bgcolor: '#e60000' } } as const
  return (
    <>
      <Fab aria-label="Voice assistant" sx={{ ...fab, left: 20 }}><MicIcon /></Fab>
      <Fab aria-label="Chat with us" sx={{ ...fab, right: 20 }}><ChatBubbleIcon /></Fab>
    </>
  )
}

// Live pages rendered without the red category bar (they don't pass menuItems to the header).
const noCategoryBar = ['/cart', '/brands', '/about-us', '/service/contact-us', '/wishlist']
const minimalPages = ['/account/signin']

export default function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useRouter()
  const minimal = minimalPages.includes(pathname)
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header minimal={minimal} categoryBar={!noCategoryBar.includes(pathname)} />
      {!minimal && <DeliveryMinimumBar />}
      <Box component="main" sx={{ flex: 1 }}>{children}</Box>
      {!minimal && <Footer />}
      <FloatingButtons />
    </Box>
  )
}
