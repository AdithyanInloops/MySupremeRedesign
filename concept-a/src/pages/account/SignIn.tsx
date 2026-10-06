import { useEffect, useState } from 'react'
import {
  Alert, Box, Button, Checkbox, CircularProgress, Divider, FormControlLabel, FormHelperText, Grid, IconButton, InputAdornment, LinearProgress, Link, MenuItem,
  Stack, TextField, Typography,
} from '@mui/material'
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom'
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlined from '@mui/icons-material/VisibilityOffOutlined'
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded'
import MailOutlineRounded from '@mui/icons-material/MailOutlineRounded'
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded'
import StorefrontOutlined from '@mui/icons-material/StorefrontOutlined'
import { tokens } from '../../theme'
import { customer } from '../../data/account'
import { useApp } from '../../state/AppState'
import AuthShell from './AuthShell'

const c = tokens.color

type Step = 'email' | 'password' | 'create'
const knownEmail = (e: string) => /@spiceroutekitchen\.ca$/i.test(e.trim()) || e.trim().toLowerCase() === 'demo@mysupreme.ca'

export const categories = ['Restaurant', 'Café', 'Caterer', 'Bakery', 'Food truck', 'Ghost kitchen', 'Hospitality / Event venue']
const structures = ['Sole proprietorship', 'Partnership', 'Corporation', 'Franchise', 'Non-profit']

export function passwordScore(pw: string) {
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++
  if (/\d/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw) || pw.length >= 14) s++
  return s
}

export function PasswordField({ value, onChange, label = 'Password', error, helperText, strength, autoComplete = 'current-password' }: {
  value: string; onChange: (v: string) => void; label?: string; error?: boolean; helperText?: string; strength?: boolean; autoComplete?: string
}) {
  const [show, setShow] = useState(false)
  const score = passwordScore(value)
  const meta = [
    { t: 'Too short', col: c.error },
    { t: 'Weak', col: c.error },
    { t: 'Fair', col: c.warning },
    { t: 'Good', col: c.successText },
    { t: 'Strong', col: c.successText },
  ][value ? score : 0]
  return (
    <Box>
      <TextField
        fullWidth label={label} type={show ? 'text' : 'password'} value={value} onChange={(e) => onChange(e.target.value)} error={error}
        helperText={strength ? undefined : helperText} autoComplete={autoComplete}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton aria-label={show ? 'Hide password' : 'Show password'} onClick={() => setShow(!show)} edge="end" sx={{ width: 44, height: 44 }}>
                {show ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {strength && (
        <Box sx={{ mt: 1 }} aria-live="polite">
          <LinearProgress variant="determinate" value={value ? (score / 4) * 100 : 0}
            sx={{ height: 6, borderRadius: 3, bgcolor: c.surface2, '& .MuiLinearProgress-bar': { bgcolor: meta.col, borderRadius: 3 } }} />
          <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
            <Typography sx={{ fontSize: 12, color: error ? c.error : c.text3 }}>{helperText ?? '8+ characters with a number and a capital letter'}</Typography>
            {value && <Typography sx={{ fontSize: 12, fontWeight: 700, color: meta.col }}>{meta.t}</Typography>}
          </Stack>
        </Box>
      )}
    </Box>
  )
}

function StepHeader({ eyebrow, title, body }: { eyebrow: string; title: string; body?: React.ReactNode }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="overline" sx={{ color: c.red }}>{eyebrow}</Typography>
      <Typography variant="h1" sx={{ fontSize: { xs: 28, md: 36 }, mt: 0.5 }}>{title}</Typography>
      {body && <Typography color="text.secondary" sx={{ mt: 1 }}>{body}</Typography>}
    </Box>
  )
}

export default function SignIn() {
  const [params] = useSearchParams()
  const nav = useNavigate()
  const { setReview, toast } = useApp()
  const [step, setStep] = useState<Step>(params.get('mode') === 'create' ? 'create' : 'email')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [tried, setTried] = useState(false)
  const [f, setF] = useState({ first: '', last: '', business: '', category: '', structure: '', hst: '', phone: '', terms: false, news: true })

  useEffect(() => { if (params.get('mode') === 'create') setStep('create') }, [params])

  const wait = (fn: () => void) => { setBusy(true); window.setTimeout(() => { setBusy(false); fn() }, 700) }
  const emailOk = /^\S+@\S+\.\S+$/.test(email)

  const submitEmail = (e: React.FormEvent) => {
    e.preventDefault()
    setTried(true)
    if (!emailOk) return
    setTried(false)
    wait(() => setStep(knownEmail(email) ? 'password' : 'create'))
  }

  const submitPassword = (e: React.FormEvent) => {
    e.preventDefault()
    setErr(null)
    if (!pw) { setErr('Enter your password'); return }
    wait(() => {
      if (pw.length < 6 || pw.toLowerCase() === 'wrong') {
        setErr('That password doesn’t match this account. Try again or reset it.')
        return
      }
      setReview({ signedIn: true })
      toast(`Welcome back, ${customer.firstName}`)
      nav('/account')
    })
  }

  const submitCreate = (e: React.FormEvent) => {
    e.preventDefault()
    setTried(true)
    const missing = !f.first || !f.last || !f.business || !f.category || !f.phone || !emailOk || passwordScore(pw) < 2 || !f.terms
    if (missing) return
    wait(() => {
      setReview({ signedIn: true })
      toast(`Welcome to MySupreme, ${f.business}!`)
      nav('/account')
    })
  }

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF((s) => ({ ...s, [k]: e.target.value }))
  const req = (v: string) => tried && !v

  return (
    <AuthShell panelTitle={step === 'create' ? 'Open a business account in 2 minutes.' : 'Your kitchen’s single supplier.'}>
      {step === 'email' && (
        <Box component="form" onSubmit={submitEmail} noValidate>
          <StepHeader eyebrow="Sign in or create an account" title="Let’s get your kitchen stocked" body="Enter your business email — we’ll check whether you already have an account." />
          <TextField
            fullWidth autoFocus type="email" label="Business email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email"
            error={tried && !emailOk} helperText={tried && !emailOk ? 'Enter a valid email address' : 'Demo: anything @spiceroutekitchen.ca signs in; any other email creates an account.'}
            InputProps={{ startAdornment: <InputAdornment position="start"><MailOutlineRounded sx={{ color: c.text3 }} /></InputAdornment> }}
          />
          <Button type="submit" fullWidth variant="contained" size="large" disabled={busy} endIcon={busy ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : <ArrowForwardRounded />}
            sx={{ mt: 3, '&.Mui-disabled': { bgcolor: c.red, color: '#fff', opacity: 0.85 } }}>
            {busy ? 'Checking…' : 'Continue'}
          </Button>
          <Divider sx={{ my: 3, fontSize: 13, color: c.text3 }}>or</Divider>
          <Stack spacing={1.25}>
            <Button fullWidth variant="outlined" color="secondary" size="large" onClick={() => setStep('create')} startIcon={<StorefrontOutlined />}>Open a business account</Button>
            <Button fullWidth component={RouterLink} to="/guest/orderstatus" sx={{ color: c.navy }}>Check an order without signing in</Button>
          </Stack>
        </Box>
      )}

      {step === 'password' && (
        <Box component="form" onSubmit={submitPassword} noValidate>
          <Button startIcon={<ArrowBackRounded />} onClick={() => { setStep('email'); setErr(null); setPw('') }} sx={{ ml: -1, mb: 2, color: c.text2 }}>Back</Button>
          <StepHeader eyebrow="Welcome back" title={`Hi, ${customer.businessName}`} />
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ p: 1.5, mb: 2.5, borderRadius: `${tokens.radius.md}px`, bgcolor: c.bg, border: `1px solid ${c.line}` }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: c.navy, color: '#fff', fontWeight: 700, display: 'grid', placeItems: 'center', fontSize: 14 }}>SR</Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis' }}>{email}</Typography>
              <Typography variant="caption" color="text.secondary">MySupreme Member since 2023</Typography>
            </Box>
            <Link component="button" type="button" onClick={() => setStep('email')} sx={{ fontSize: 13, color: c.navy, fontWeight: 600 }}>Change</Link>
          </Stack>
          {err && <Alert severity="error" sx={{ mb: 2, borderRadius: `${tokens.radius.sm}px` }}>{err}</Alert>}
          <PasswordField value={pw} onChange={(v) => { setPw(v); setErr(null) }} error={!!err} helperText="Demo: any 6+ characters signs in; “wrong” shows the error." />
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
            <FormControlLabel control={<Checkbox defaultChecked />} label="Keep me signed in" sx={{ '& .MuiFormControlLabel-label': { fontSize: 14 } }} />
            <Link component={RouterLink} to={`/account/forgot-password?email=${encodeURIComponent(email)}`} sx={{ fontSize: 14, color: c.navy, fontWeight: 600 }}>Forgot password?</Link>
          </Stack>
          <Button type="submit" fullWidth variant="contained" size="large" disabled={busy} sx={{ mt: 2.5, '&.Mui-disabled': { bgcolor: c.red, color: '#fff', opacity: 0.85 } }}
            startIcon={busy ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : undefined}>
            {busy ? 'Signing in…' : 'Sign in'}
          </Button>
        </Box>
      )}

      {step === 'create' && (
        <Box component="form" onSubmit={submitCreate} noValidate>
          <Button startIcon={<ArrowBackRounded />} onClick={() => setStep('email')} sx={{ ml: -1, mb: 1, color: c.text2 }}>Back</Button>
          <StepHeader eyebrow="New to MySupreme" title="Open a business account" body={<>Already have one? <Link component="button" type="button" onClick={() => setStep('email')} sx={{ color: c.navy, fontWeight: 600, verticalAlign: 'baseline' }}>Sign in</Link></>} />
          {tried && (!f.terms || !f.first || !f.business) && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: `${tokens.radius.sm}px` }}>Please complete the highlighted fields.</Alert>
          )}
          <Typography variant="overline" sx={{ color: c.text3 }}>Your business</Typography>
          <Grid container spacing={2} sx={{ mt: 0, mb: 2 }}>
            <Grid item xs={12}><TextField fullWidth required label="Business name" value={f.business} onChange={set('business')} error={req(f.business)} helperText={req(f.business) ? 'Required — as it appears on invoices' : undefined} autoComplete="organization" placeholder="e.g. Spice Route Kitchen" /></Grid>
            <Grid item xs={12} sm={6}>
              <TextField select fullWidth required label="Business category" value={f.category} onChange={set('category')} error={req(f.category)} helperText={req(f.category) ? 'Choose one' : undefined}>
                {categories.map((x) => <MenuItem key={x} value={x}>{x}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField select fullWidth label="Business structure" value={f.structure} onChange={set('structure')}>
                {structures.map((x) => <MenuItem key={x} value={x}>{x}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12}><TextField fullWidth label="HST number" value={f.hst} onChange={set('hst')} placeholder="12345 6789 RT0001" helperText="Optional — needed for credit terms and tax-exempt items" inputProps={{ style: { fontFamily: tokens.font.mono } }} /></Grid>
          </Grid>
          <Typography variant="overline" sx={{ color: c.text3 }}>Your details</Typography>
          <Grid container spacing={2} sx={{ mt: 0, mb: 2 }}>
            <Grid item xs={12} sm={6}><TextField fullWidth required label="First name" value={f.first} onChange={set('first')} error={req(f.first)} helperText={req(f.first) ? 'Required' : undefined} autoComplete="given-name" /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth required label="Last name" value={f.last} onChange={set('last')} error={req(f.last)} helperText={req(f.last) ? 'Required' : undefined} autoComplete="family-name" /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth required type="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} error={tried && !emailOk} helperText={tried && !emailOk ? 'Enter a valid email' : undefined} autoComplete="email" /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth required type="tel" label="Phone" value={f.phone} onChange={set('phone')} error={req(f.phone)} helperText={req(f.phone) ? 'Required' : undefined} autoComplete="tel" placeholder="+1 905-555-0182" /></Grid>
            <Grid item xs={12}>
              <PasswordField label="Create password" value={pw} onChange={setPw} strength autoComplete="new-password"
                error={tried && passwordScore(pw) < 2} helperText={tried && passwordScore(pw) < 2 ? 'Use 8+ characters with a number and a capital letter' : undefined} />
            </Grid>
          </Grid>
          <FormControlLabel control={<Checkbox checked={f.terms} onChange={(e) => setF((s) => ({ ...s, terms: e.target.checked }))} sx={{ color: tried && !f.terms ? c.error : undefined }} />}
            label={<Typography sx={{ fontSize: 14 }}>I agree to the <Link component={RouterLink} to="/page/terms" sx={{ color: c.navy, fontWeight: 600 }}>Terms &amp; Uses</Link> and <Link component={RouterLink} to="/page/privacy-policy" sx={{ color: c.navy, fontWeight: 600 }}>Privacy Policy</Link></Typography>} />
          {tried && !f.terms && <FormHelperText error sx={{ ml: 4, mt: -0.5 }}>Please accept the terms</FormHelperText>}
          <FormControlLabel control={<Checkbox checked={f.news} onChange={(e) => setF((s) => ({ ...s, news: e.target.checked }))} />} label={<Typography sx={{ fontSize: 14 }}>Send me the monthly flyer and weekly hot picks</Typography>} />
          <Button type="submit" fullWidth variant="contained" size="large" disabled={busy} sx={{ mt: 2, '&.Mui-disabled': { bgcolor: c.red, color: '#fff', opacity: 0.85 } }}
            startIcon={busy ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : undefined}>
            {busy ? 'Creating account…' : 'Create business account'}
          </Button>
          <Typography sx={{ fontSize: 12.5, color: c.text3, mt: 1.5, textAlign: 'center' }}>Credit terms are reviewed by our team within 1 business day.</Typography>
        </Box>
      )}
    </AuthShell>
  )
}
