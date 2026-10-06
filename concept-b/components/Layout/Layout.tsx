import type { ReactNode } from 'react'
import { Box, Fab } from '@mui/material'
import MicIcon from '@mui/icons-material/Mic'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble'
import Header from './Header'
import Footer from './Footer'

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

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Box component="main" sx={{ flex: 1 }}>{children}</Box>
      <Footer />
      <FloatingButtons />
    </Box>
  )
}
