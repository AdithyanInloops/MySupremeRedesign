import { useState } from 'react'
import { Box, Button, CircularProgress, Link, TextField, Typography } from '@mui/material'
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom'
import HowToRegOutlined from '@mui/icons-material/HowToRegOutlined'
import { tokens } from '../../theme'
import { Logo } from '../../components/Brand'
import { Backdrop, formCard, isEmail } from './Onboarding'

const c = tokens.color

/** Channel this page announces on, so a sign-up tab waiting on "Verify your email" moves on by itself. */
export const CONFIRM_CHANNEL = 'ms-account-confirm'
// shortcut: the prototype carries the sign-up email in `key`; the real key is an opaque token the server checks against the account.
const encode = (e: string) => btoa(String.fromCharCode(...new TextEncoder().encode(e.trim().toLowerCase())))
const decode = (k: string) => { try { return new TextDecoder().decode(Uint8Array.from(atob(k), (ch) => ch.charCodeAt(0))) } catch { return '' } }
/** The link in the verification email. */
export const confirmLink = (email: string) => `#/account/confirm?id=704&key=${encodeURIComponent(encode(email))}`

/**
 * Account confirmation: the page the verification email links to (/account/confirm?id&key). Not part of onboarding,
 * but dressed like it (same halftone backdrop and card, no site header) so the owner feels they're still in sign-up.
 */
export default function ConfirmAccount() {
  const [params] = useSearchParams()
  const nav = useNavigate()
  const sentTo = decode(params.get('key') ?? '') // the address the link was sent to
  const [email, setEmail] = useState('')
  const [tried, setTried] = useState(false)
  const [mismatch, setMismatch] = useState(false)
  const [busy, setBusy] = useState(false)
  const bad = tried && !isEmail(email)
  const error = bad ? (email ? 'Enter a valid email, like name@business.com' : 'Enter your email address')
    : mismatch ? 'This isn’t the email this link was sent to. Use the address you signed up with.' : undefined

  const submit = () => {
    setTried(true)
    if (!isEmail(email)) return
    if (sentTo && email.trim().toLowerCase() !== sentTo) { setMismatch(true); return }
    setBusy(true)
    window.setTimeout(() => {
      const ch = new BroadcastChannel(CONFIRM_CHANNEL); ch.postMessage(email.trim().toLowerCase()); ch.close()
      nav(sentTo ? '/review/onboarding?confirmed=1' : '/account/signin', { replace: true })
    }, 700)
  }

  return (
    <Box sx={{ minHeight: '100svh', isolation: 'isolate', display: 'grid', placeItems: 'center', px: 2, py: 6 }}>
      <Backdrop />
      <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); if (!busy) submit() }} sx={{ ...formCard, width: '100%', maxWidth: 464 }}>
        <Logo />
        <Box aria-hidden sx={{ mt: 3.5, width: 56, height: 56, borderRadius: '50%', display: 'grid', placeItems: 'center', bgcolor: c.navyTint, color: c.navy }}>
          <HowToRegOutlined sx={{ fontSize: 28 }} />
        </Box>
        <Typography component="h1" sx={{ mt: 2, fontSize: { xs: 26, md: 30 }, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 }}>Account confirmation</Typography>
        <Typography sx={{ mt: 1, color: c.text2 }}>Fill in your email to confirm your registration.</Typography>
        <TextField autoFocus fullWidth required label="Email address" type="email" autoComplete="email" sx={{ mt: 3 }}
          inputProps={{ maxLength: 254 }} value={email} disabled={busy} error={!!error} helperText={error}
          onChange={(e) => { setEmail(e.target.value.replace(/\s/g, '')); setMismatch(false) }} />
        <Button type="submit" fullWidth variant="contained" size="large" disabled={busy} sx={{ mt: 3 }}
          startIcon={busy ? <CircularProgress size={18} color="inherit" /> : undefined}>
          {busy ? 'Confirming…' : 'Confirm'}
        </Button>
        <Typography sx={{ mt: 2.5, pt: 2.5, borderTop: `1px solid ${c.line}`, fontSize: 14, color: c.text2 }}>
          Already confirmed? <Link component={RouterLink} to="/account/signin" sx={{ color: c.navy, fontWeight: 600 }}>Sign in</Link>
        </Typography>
      </Box>
    </Box>
  )
}
