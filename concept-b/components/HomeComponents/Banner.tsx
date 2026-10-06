import { Box } from '@mui/material'

/** "Click & Collect" app banner (real: Banner.tsx). Rendered desktop-only by the page. */
function Banner() {
  const open = () => {
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent)
    window.open(ios ? 'https://apps.apple.com/in/app/mysupreme/id6749691637' : 'https://play.google.com/store/apps/details?id=com.mysupreme.app', '_blank')
  }
  return (
    <Box sx={{ width: '100%', px: '12px', mb: 4 }}>
      <Box component="button" onClick={open} aria-label="Download the MySupreme app" sx={{ width: '100%', p: 0, border: 0, bgcolor: 'transparent', borderRadius: '12px', overflow: 'hidden', display: 'block', cursor: 'pointer', '&:focus-visible': { outline: '3px solid #FF0000', outlineOffset: 2 } }}>
        <Box component="img" src="/assets/stickybanner.png" alt="Click & Collect — download the MySupreme app" loading="lazy" sx={{ width: '100%', height: 'auto', display: 'block', borderRadius: '12px' }} />
      </Box>
    </Box>
  )
}

export default Banner
