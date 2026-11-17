import { useState } from 'react'
import { Alert, Box, Button, CircularProgress, Divider, InputAdornment, Link, Stack, TextField, Typography } from '@mui/material'
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom'
import MailOutlineRounded from '@mui/icons-material/MailOutlineRounded'
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded'
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded'
import MarkEmailReadOutlined from '@mui/icons-material/MarkEmailReadOutlined'
import LockResetRounded from '@mui/icons-material/LockResetRounded'
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded'
import { tokens } from '../../theme'
import { useApp } from '../../state/AppState'
import { Container } from '../../components/ui'
import { glow } from './AuthShell'
import { PasswordField, loginField, passwordScore } from './SignIn'

const c = tokens.color

// Stage site spec for the forgot-password card.
const title = { fontSize: { xs: 26, md: 32 }, lineHeight: 1.15, fontWeight: 600, letterSpacing: '-0.02em', color: c.ink }
const sub = { fontSize: 15, lineHeight: '22px', color: c.text2, mt: 1, mb: 3 }
const btn = { minHeight: 48, borderRadius: '8px', fontWeight: 600 }

function IconDisc({ children, tone = 'red' }: { children: React.ReactNode; tone?: 'red' | 'green' | 'navy' }) {
  const map = { red: [c.redTint, c.red], green: [c.successTint, c.successText], navy: [c.navyTint, c.navy] }[tone]
  return <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: map[0], color: map[1], display: 'grid', placeItems: 'center', mb: 2.5, '& svg': { fontSize: 32 } }}>{children}</Box>
}

/** Envelope-with-lock illustration from the stage site. */
function EnvelopeArt() {
  return (
    <Box component="svg" viewBox="0 0 240 200" aria-hidden sx={{ width: '100%', height: 'auto', display: 'block' }}>
      <path d="M30 92 120 30l90 62v80a10 10 0 0 1-10 10H40a10 10 0 0 1-10-10z" fill="#4B47A8" />
      <rect x="58" y="40" width="124" height="104" rx="8" fill="#fff" transform="rotate(-6 120 92)" />
      <g transform="rotate(-6 120 92)">
        <rect x="104" y="80" width="32" height="26" rx="5" fill={c.navy} />
        <path d="M110 80v-7a10 10 0 0 1 20 0v7" fill="none" stroke={c.navy} strokeWidth="5" strokeLinecap="round" />
        <circle cx="120" cy="92" r="3.5" fill="#fff" />
      </g>
      <path d="M30 100 112 150a14 14 0 0 0 16 0l82-50v72a10 10 0 0 1-10 10H40a10 10 0 0 1-10-10z" fill={c.navy} />
      <path d="M30 182 98 128M210 182l-68-54" stroke="#8E8BD6" strokeWidth="2" opacity=".5" />
      <path d="M196 30l10-14M206 44l16-6" stroke={c.red} strokeWidth="5" strokeLinecap="round" />
    </Box>
  )
}

/**
 * One single-form layout for: forgot password (default), sent confirmation,
 * reset / create password (?step=reset or ?step=create) and email confirmation (?step=confirm).
 * Illustration card from md; below md the form sits frameless on the soft glow (stage site).
 */
export default function ForgotPassword() {
  const [params] = useSearchParams()
  const nav = useNavigate()
  const { toast } = useApp()
  const initial = params.get('step')
  const [step, setStep] = useState<'request' | 'sent' | 'reset' | 'done' | 'confirm'>(
    initial === 'reset' || initial === 'create' ? 'reset' : initial === 'confirm' ? 'confirm' : 'request',
  )
  const creating = initial === 'create'
  const [email, setEmail] = useState(params.get('email') ?? '')
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [tried, setTried] = useState(false)
  const [busy, setBusy] = useState(false)
  const emailOk = /^\S+@\S+\.\S+$/.test(email)
  const wait = (fn: () => void) => { setBusy(true); window.setTimeout(() => { setBusy(false); fn() }, 700) }
  const submitBtn = (label: string, busyLabel: string) => (
    <Button type="submit" fullWidth variant="contained" size="large" disabled={busy} endIcon={busy ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : <ArrowForwardRounded />}
      sx={{ ...btn, mt: 4, fontSize: '1.1rem', '& .MuiButton-endIcon svg': { fontSize: 22 }, '&.Mui-disabled': { bgcolor: c.red, color: '#fff', opacity: 0.85 } }}>
      {busy ? busyLabel : label}
    </Button>
  )

  return (
    <Box sx={{ bgcolor: '#fff', backgroundImage: { xs: glow, md: 'none' }, minHeight: { xs: 'calc(100svh - 260px)', md: 0 }, display: 'flex', alignItems: 'center' }}>
      <Container sx={{ width: '100%', py: { xs: 3, md: 8 }, px: 2 }}>
        <Box sx={{
          position: 'relative', overflow: 'hidden', display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'minmax(0,10fr) minmax(0,11fr)' }, columnGap: 4, alignItems: 'center',
          p: { xs: '28px 4px', sm: 5, md: '40px 48px' }, maxWidth: { sm: 480, md: 1000 }, mx: 'auto', borderRadius: '16px',
          border: '1px solid', borderColor: { xs: 'transparent', md: '#E6E6EE' }, bgcolor: { xs: 'transparent', md: '#fff' },
        }}>
          <Box aria-hidden sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', top: -60, left: -60, width: 180, height: 180, borderRadius: '50%', bgcolor: c.navyTint }} />
          <Box aria-hidden sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', bottom: -110, left: -40, width: 260, height: 260, borderRadius: '50%', bgcolor: '#E2E0F6' }} />
          <Box sx={{ display: { xs: 'none', md: 'grid' }, placeItems: 'center', position: 'relative' }}>
            <Box sx={{ width: { md: 280, lg: 320 }, height: { md: 280, lg: 320 }, borderRadius: '50%', bgcolor: '#F3F3F8', p: 5, display: 'grid', placeItems: 'center' }}>
              <EnvelopeArt />
            </Box>
          </Box>

          <Box sx={{ position: 'relative', maxWidth: 420 }}>
            {step === 'request' && (
              <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); setTried(true); if (emailOk) wait(() => setStep('sent')) }}>
                <Box component="img" src="/assets/crown.png" alt="" sx={{ width: 40, height: 40, display: 'block' }} />
                <Typography variant="h1" sx={{ ...title, mt: 1.5 }}>Forgot password?</Typography>
                <Typography sx={sub}>Enter your email address and we’ll send you a link to reset your password.</Typography>
                <TextField
                  fullWidth required type="email" placeholder="Email *" inputProps={{ 'aria-label': 'Email' }} sx={{ ...loginField, mt: '13px' }}
                  value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email"
                  error={tried && !emailOk} helperText={tried && !emailOk ? (email ? 'Enter a valid email address' : 'This field is required') : undefined}
                  InputProps={{ startAdornment: <InputAdornment position="start"><MailOutlineRounded /></InputAdornment> }}
                />
                {submitBtn('Send email', 'Sending…')}
              </Box>
            )}

            {step === 'sent' && (
              <Box aria-live="polite">
                <IconDisc tone="green"><MarkEmailReadOutlined /></IconDisc>
                <Typography variant="h1" sx={title}>Check your inbox</Typography>
                <Typography sx={sub}>
                  If <b style={{ color: c.ink }}>{email}</b> has an account, a reset link is on its way. Check spam if it doesn’t arrive in 2 minutes.
                </Typography>
                <Stack spacing={1.25}>
                  <Button fullWidth variant="contained" size="large" onClick={() => setStep('reset')} sx={btn}>Open reset link (prototype)</Button>
                  <Button fullWidth variant="outlined" color="secondary" onClick={() => { toast('Reset link re-sent', 'info') }} sx={btn}>Resend email</Button>
                  <Link component="button" type="button" underline="none" onClick={() => setStep('request')} sx={{ fontSize: 14, color: c.navy, fontWeight: 600 }}>Use a different email</Link>
                </Stack>
              </Box>
            )}

            {step === 'reset' && (
              <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); setTried(true); if (passwordScore(pw) >= 2 && pw === pw2) wait(() => setStep('done')) }}>
                <IconDisc tone="navy"><LockResetRounded /></IconDisc>
                <Typography variant="h1" sx={title}>{creating ? 'Create your password' : 'Set a new password'}</Typography>
                <Typography sx={sub}>{creating ? 'Your sales rep set up your account. Choose a password to start ordering online.' : 'For priya@spiceroutekitchen.ca'}</Typography>
                <Stack spacing={2.5}>
                  <PasswordField label="New password" value={pw} onChange={setPw} strength autoComplete="new-password"
                    error={tried && passwordScore(pw) < 2} helperText={tried && passwordScore(pw) < 2 ? 'Use 8+ characters with a number and a capital letter' : undefined} />
                  <PasswordField label="Confirm new password" value={pw2} onChange={setPw2} autoComplete="new-password"
                    error={tried && pw !== pw2} helperText={tried && pw !== pw2 ? 'Passwords don’t match' : undefined} />
                </Stack>
                {submitBtn(creating ? 'Create password' : 'Update password', 'Saving…')}
              </Box>
            )}

            {step === 'done' && (
              <Box aria-live="polite">
                <IconDisc tone="green"><CheckCircleRounded /></IconDisc>
                <Typography variant="h1" sx={title}>Password updated</Typography>
                <Typography sx={sub}>You can now sign in with your new password.</Typography>
                <Button fullWidth variant="contained" size="large" onClick={() => nav('/account/signin')} sx={btn}>Sign in</Button>
              </Box>
            )}

            {step === 'confirm' && (
              <Box>
                <IconDisc tone="green"><MarkEmailReadOutlined /></IconDisc>
                <Typography variant="h1" sx={title}>Email confirmed</Typography>
                <Alert severity="success" sx={{ my: 2.5, borderRadius: '8px' }}>Your business account is active. Business pricing is now on.</Alert>
                <Button fullWidth variant="contained" size="large" onClick={() => nav('/account/signin')} sx={btn}>Continue to sign in</Button>
              </Box>
            )}

            {step !== 'done' && step !== 'confirm' && (
              <>
                <Divider sx={{ my: 2.5, fontSize: 13, color: c.text3, '&::before, &::after': { borderColor: '#E6E6EE' } }}>or</Divider>
                <Box sx={{ textAlign: 'center' }}>
                  <Link component={RouterLink} to="/account/signin" underline="none" sx={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: 15, lineHeight: 1.7, fontWeight: 600, color: c.navy }}>
                    <ArrowBackRounded sx={{ fontSize: 18 }} />Back to log in
                  </Link>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
