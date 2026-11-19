import { useEffect, useState } from 'react'
import { Box, Button, Dialog, IconButton, Typography } from '@mui/material'
import { keyframes } from '@mui/material/styles'
import { Link as RouterLink, useSearchParams } from 'react-router-dom'
import CloseRounded from '@mui/icons-material/CloseRounded'
import RestaurantMenuOutlined from '@mui/icons-material/RestaurantMenuOutlined'
import { tokens } from '../../../theme'
import { useApp } from '../../../state/AppState'
import { countDetails, DETAIL_FIELDS } from '../../../data/profile'
import { getProfile } from '../../../data/profileClient'

const c = tokens.color
const LAST_SHOWN = 'kitchenNudgeLastShown'
const FIRST_DELAY_MS = 8_000 // give the home page a moment before interrupting
// shortcut: the interval lives in this browser's localStorage; move it to the account (server) so it follows the owner across devices.
const EVERY_MS = 3 * 24 * 60 * 60 * 1000 // at most once every 3 days
const lastShown = () => { try { return Number(localStorage.getItem(LAST_SHOWN)) || 0 } catch { return 0 } }
const markShown = () => { try { localStorage.setItem(LAST_SHOWN, String(Date.now())) } catch { /* private mode: may show again next visit */ } }
const rise = keyframes`from { opacity: 0; transform: translateY(24px) scale(.98); } to { opacity: 1; transform: none; }`

/**
 * Kitchen-profile popup on the home page, for signed-in owners whose profile has fewer than 6 details (as before).
 * Shows once 8 s after landing, then again at most every 3 days until the profile is filled in.
 * Waits if another dialog is open, so it never stacks. Add `?kitchen-nudge` to the URL to show it now (design review).
 */
export default function ProfileNudge() {
  const { review } = useApp()
  const [params] = useSearchParams()
  const force = params.has('kitchen-nudge')
  const [added, setAdded] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!review.signedIn || (!force && Date.now() - lastShown() < EVERY_MS)) return
    let live = true
    let timer = 0
    const tryOpen = () => {
      if (!live) return
      if (document.querySelector('.MuiModal-root:not(.MuiPopover-root)')) { timer = window.setTimeout(tryOpen, 5_000); return } // another dialog is up
      markShown() // counted when seen, not when dismissed, so a reload doesn't bring it straight back
      setOpen(true)
    }
    getProfile().then((p) => {
      const n = countDetails(p)
      if (!live || (n >= 6 && !force)) return
      setAdded(n)
      timer = window.setTimeout(tryOpen, force ? 600 : FIRST_DELAY_MS)
    }, () => {}) // no popup if the profile can't be read
    return () => { live = false; window.clearTimeout(timer) }
  }, [review.signedIn, force])

  const total = DETAIL_FIELDS.length
  const close = () => setOpen(false)
  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="xs" aria-labelledby="kn-title" aria-describedby="kn-body"
      PaperProps={{
        sx: {
          overflow: 'hidden', borderRadius: `${tokens.radius.lg}px`, boxShadow: tokens.shadow.pop,
          animation: `${rise} .36s cubic-bezier(.2,.7,.2,1)`, '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
          // Phones: a bottom sheet, within thumb reach.
          '@media (max-width: 499.95px)': { m: 0, position: 'fixed', bottom: 0, width: '100%', maxWidth: '100%', borderRadius: `${tokens.radius.lg}px ${tokens.radius.lg}px 0 0`, pb: 'env(safe-area-inset-bottom)' },
        },
      }}>
      {/* Minimal: one icon, one line of title, one line of why, one action. */}
      <Box sx={{ position: 'relative', p: { xs: 3, sm: 4 }, pt: { xs: 3.5, sm: 4 } }}>
        <IconButton aria-label="Remind me later" onClick={close} sx={{ position: 'absolute', top: 8, right: 8, width: 40, height: 40, color: c.text3 }}>
          <CloseRounded fontSize="small" />
        </IconButton>
        <Box sx={{ width: 44, height: 44, borderRadius: '50%', bgcolor: c.navyTint, color: c.navy, display: 'grid', placeItems: 'center' }}>
          <RestaurantMenuOutlined fontSize="small" />
        </Box>
        <Typography id="kn-title" component="h2" sx={{ mt: 2, fontSize: 20, fontWeight: 700, lineHeight: 1.25, letterSpacing: '-.01em' }}>
          Finish your kitchen profile
        </Typography>
        <Typography id="kn-body" sx={{ mt: 0.75, fontSize: 15, color: c.text2 }}>
          A minute of questions gets you product picks made for your kitchen.
        </Typography>
        <Typography sx={{ mt: 1.5, fontSize: 13, fontWeight: 600, color: c.text3, fontVariantNumeric: 'tabular-nums' }}>
          {added} of {total} details added
        </Typography>
        <Button component={RouterLink} to="/account/business-profile" onClick={close} variant="contained" size="large" fullWidth sx={{ mt: 3, boxShadow: 'none' }}>
          Continue
        </Button>
        <Button onClick={close} color="inherit" fullWidth sx={{ mt: 1, color: c.text2, minHeight: 44 }}>Not now</Button>
      </Box>
    </Dialog>
  )
}
