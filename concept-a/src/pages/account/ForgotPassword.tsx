import { useState } from 'react'
import { Alert, Box, Button, CircularProgress, InputAdornment, Link, Stack, TextField, Typography } from '@mui/material'
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom'
import MailOutlineRounded from '@mui/icons-material/MailOutlineRounded'
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded'
import MarkEmailReadOutlined from '@mui/icons-material/MarkEmailReadOutlined'
import LockResetRounded from '@mui/icons-material/LockResetRounded'
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded'
import { tokens } from '../../theme'
import { useApp } from '../../state/AppState'
import AuthShell from './AuthShell'
import { PasswordField, passwordScore } from './SignIn'

const c = tokens.color

function IconDisc({ children, tone = 'red' }: { children: React.ReactNode; tone?: 'red' | 'green' | 'navy' }) {
  const map = { red: [c.redTint, c.red], green: [c.successTint, c.successText], navy: [c.navyTint, c.navy] }[tone]
  return <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: map[0], color: map[1], display: 'grid', placeItems: 'center', mb: 2.5, '& svg': { fontSize: 32 } }}>{children}</Box>
}

/**
 * One single-form layout for: forgot password (default), sent confirmation,
 * reset / create password (?step=reset or ?step=create) and email confirmation (?step=confirm).
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
    <Button type="submit" fullWidth variant="contained" size="large" disabled={busy} sx={{ mt: 3, '&.Mui-disabled': { bgcolor: c.red, color: '#fff', opacity: 0.85 } }}
      startIcon={busy ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : undefined}>
      {busy ? busyLabel : label}
    </Button>
  )

  return (
    <AuthShell panelTitle="Back to ordering in under a minute.">
      <Button component={RouterLink} to="/account/signin" startIcon={<ArrowBackRounded />} sx={{ ml: -1, mb: 2, color: c.text2 }}>Back to sign in</Button>

      {step === 'request' && (
        <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); setTried(true); if (emailOk) wait(() => setStep('sent')) }}>
          <IconDisc><LockResetRounded /></IconDisc>
          <Typography variant="h1" sx={{ fontSize: { xs: 28, md: 34 } }}>Forgot your password?</Typography>
          <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>Enter the email on your business account and we’ll send a reset link. It’s valid for 1 hour.</Typography>
          <TextField fullWidth autoFocus type="email" label="Business email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email"
            error={tried && !emailOk} helperText={tried && !emailOk ? 'Enter a valid email address' : ' '}
            InputProps={{ startAdornment: <InputAdornment position="start"><MailOutlineRounded sx={{ color: c.text3 }} /></InputAdornment> }} />
          {submitBtn('Send reset link', 'Sending…')}
          <Typography sx={{ fontSize: 13, color: c.text3, mt: 2, textAlign: 'center' }}>No access to that inbox? WhatsApp us on +1 365-777-0999.</Typography>
        </Box>
      )}

      {step === 'sent' && (
        <Box aria-live="polite">
          <IconDisc tone="green"><MarkEmailReadOutlined /></IconDisc>
          <Typography variant="h1" sx={{ fontSize: { xs: 28, md: 34 } }}>Check your inbox</Typography>
          <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
            If <b style={{ color: c.ink }}>{email}</b> has an account, a reset link is on its way. Check spam if it doesn’t arrive in 2 minutes.
          </Typography>
          <Stack spacing={1.25}>
            <Button fullWidth variant="contained" size="large" onClick={() => setStep('reset')}>Open reset link (prototype)</Button>
            <Button fullWidth variant="outlined" color="secondary" onClick={() => { toast('Reset link re-sent', 'info') }}>Resend email</Button>
            <Link component="button" type="button" onClick={() => setStep('request')} sx={{ fontSize: 14, color: c.navy, fontWeight: 600 }}>Use a different email</Link>
          </Stack>
        </Box>
      )}

      {step === 'reset' && (
        <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); setTried(true); if (passwordScore(pw) >= 2 && pw === pw2) wait(() => setStep('done')) }}>
          <IconDisc tone="navy"><LockResetRounded /></IconDisc>
          <Typography variant="h1" sx={{ fontSize: { xs: 28, md: 34 } }}>{creating ? 'Create your password' : 'Set a new password'}</Typography>
          <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>{creating ? 'Your sales rep set up your account. Choose a password to start ordering online.' : 'For priya@spiceroutekitchen.ca'}</Typography>
          <Stack spacing={2.5}>
            <PasswordField label="New password" value={pw} onChange={setPw} strength autoComplete="new-password"
              error={tried && passwordScore(pw) < 2} helperText={tried && passwordScore(pw) < 2 ? 'Use 8+ characters with a number and a capital letter' : undefined} />
            <PasswordField label="Confirm new password" value={pw2} onChange={setPw2} autoComplete="new-password"
              error={tried && pw !== pw2} helperText={tried && pw !== pw2 ? 'Passwords don’t match' : ' '} />
          </Stack>
          {submitBtn(creating ? 'Create password' : 'Update password', 'Saving…')}
        </Box>
      )}

      {step === 'done' && (
        <Box aria-live="polite">
          <IconDisc tone="green"><CheckCircleRounded /></IconDisc>
          <Typography variant="h1" sx={{ fontSize: { xs: 28, md: 34 } }}>Password updated</Typography>
          <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>You can now sign in with your new password.</Typography>
          <Button fullWidth variant="contained" size="large" onClick={() => nav('/account/signin')}>Sign in</Button>
        </Box>
      )}

      {step === 'confirm' && (
        <Box>
          <IconDisc tone="green"><MarkEmailReadOutlined /></IconDisc>
          <Typography variant="h1" sx={{ fontSize: { xs: 28, md: 34 } }}>Email confirmed</Typography>
          <Alert severity="success" sx={{ my: 2.5, borderRadius: `${tokens.radius.sm}px` }}>Your business account is active. Business pricing is now on.</Alert>
          <Button fullWidth variant="contained" size="large" onClick={() => nav('/account/signin')}>Continue to sign in</Button>
        </Box>
      )}
    </AuthShell>
  )
}
