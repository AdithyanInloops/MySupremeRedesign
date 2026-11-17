import { useEffect, useState, type ReactNode } from 'react'
import {
  Alert, Box, Button, CircularProgress, IconButton, InputAdornment, LinearProgress, Link, MenuItem,
  Stack, TextField, Typography,
} from '@mui/material'
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom'
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlined from '@mui/icons-material/VisibilityOffOutlined'
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded'
import MailOutlineRounded from '@mui/icons-material/MailOutlineRounded'
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded'
import LockOutlined from '@mui/icons-material/LockOutlined'
import { tokens } from '../../theme'
import { customer } from '../../data/account'
import { useApp } from '../../state/AppState'
import AuthShell from './AuthShell'

const c = tokens.color

type Step = 'login' | 'create'

// Business category → its sub-categories
const businessTypes: Record<string, string[]> = {
  Restaurant: ['Indian', 'Chinese', 'Italian', 'Middle Eastern', 'Caribbean', 'Fast food', 'Fine dining'],
  Café: ['Coffee shop', 'Bubble tea', 'Juice bar', 'Dessert'],
  Caterer: ['Corporate', 'Weddings & events', 'Institutional'],
  Bakery: ['Retail bakery', 'Wholesale bakery', 'Pastry shop'],
  'Food truck': ['Street food', 'Desserts', 'Beverages'],
  'Ghost kitchen': ['Single brand', 'Multi-brand'],
  'Hospitality / Event venue': ['Hotel', 'Banquet hall', 'Bar & pub'],
  'Non Profit Organization': ['Community kitchen', 'School', 'Shelter', 'Place of worship'],
}
const structures = ['Sole proprietorship', 'Partnership', 'Corporation', 'Franchise', 'Non-profit']
const titles = ['Mr', 'Mrs', 'Ms', 'Mx', 'Dr']

export function passwordScore(pw: string) {
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++
  if (/\d/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw) || pw.length >= 14) s++
  return s
}

// Login fields (stage site spec): 48px tall, 8px radius, the label sits inside as a placeholder next to the icon.
export const loginField = {
  '& .MuiOutlinedInput-root': { borderRadius: '8px' },
  '& .MuiOutlinedInput-input': { py: '12.5px' },
  '& .MuiOutlinedInput-input::placeholder': { color: c.text3, opacity: 1, fontSize: 15 },
  '& .Mui-focused .MuiOutlinedInput-input::placeholder': { color: c.navy },
  '& .Mui-error .MuiOutlinedInput-input::placeholder': { color: c.error },
  '& .MuiInputAdornment-positionStart svg': { fontSize: 20, color: c.text3 },
  '& .MuiInputAdornment-positionEnd .MuiIconButton-root': { width: 38, height: 38, mr: 0, '& svg': { fontSize: 22 } },
  '& .MuiFormHelperText-root': { mx: 0, mt: '6px', fontSize: 13 },
}

export function PasswordField({ value, onChange, label = 'Password', placeholder, sx, error, helperText, strength, autoComplete = 'current-password', size, required, icon }: {
  value: string; onChange: (v: string) => void; label?: string; placeholder?: string; sx?: object; error?: boolean; helperText?: string; strength?: boolean; autoComplete?: string; size?: 'small'; required?: boolean; icon?: ReactNode
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
        fullWidth size={size} required={required} type={show ? 'text' : 'password'} value={value} onChange={(e) => onChange(e.target.value)} error={error}
        label={placeholder ? undefined : label} placeholder={placeholder} inputProps={placeholder ? { 'aria-label': label } : undefined} sx={sx}
        helperText={strength ? undefined : helperText} autoComplete={autoComplete}
        InputProps={{
          startAdornment: icon && <InputAdornment position="start">{icon}</InputAdornment>,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton aria-label={show ? 'Hide password' : 'Show password'} onClick={() => setShow(!show)} edge="end" sx={{ width: 44, height: 44 }}>
                {show ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
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

function StepHeader({ eyebrow, title, body, compact }: { eyebrow: string; title: string; body?: React.ReactNode; compact?: boolean }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="overline" sx={{ color: c.red }}>{eyebrow}</Typography>
      <Typography variant="h1" sx={{ fontSize: compact ? { xs: 24, md: 28 } : { xs: 28, md: 36 }, mt: 0.5 }}>{title}</Typography>
      {body && <Typography color="text.secondary" sx={{ mt: 1 }}>{body}</Typography>}
    </Box>
  )
}

export default function SignIn() {
  const [params] = useSearchParams()
  const nav = useNavigate()
  const { setReview, toast } = useApp()
  const [step, setStep] = useState<Step>(params.get('mode') === 'create' ? 'create' : 'login')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [tried, setTried] = useState(false)
  const [pw2, setPw2] = useState('')
  const [f, setF] = useState({ business: '', category: '', structure: '', sub: '', phone: '', hst: '', mFirst: '', mLast: '', title: '', first: '', last: '', mobile: '' })

  useEffect(() => { if (params.get('mode') === 'create') setStep('create') }, [params])

  const wait = (fn: () => void) => { setBusy(true); window.setTimeout(() => { setBusy(false); fn() }, 700) }
  const emailOk = /^\S+@\S+\.\S+$/.test(email)

  const go = (next: Step) => { setStep(next); setTried(false); setErr(null) }

  const submitLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setTried(true)
    setErr(null)
    if (!emailOk || !pw) return
    wait(() => {
      // Prototype rule so the error state can be reviewed: under 6 characters or "wrong" fails.
      if (pw.length < 6 || pw.toLowerCase() === 'wrong') {
        setErr('That email and password don’t match. Try again or reset your password.')
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
    if (missing) return
    wait(() => {
      setReview({ signedIn: true })
      toast(`Welcome to MySupreme, ${f.business}!`)
      nav('/account')
    })
  }

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF((s) => ({ ...s, [k]: e.target.value }))
  const req = (v: string) => tried && !v
  const missing = !f.business || !f.category || !f.hst || !f.first || !f.last || !emailOk || passwordScore(pw) < 2 || pw !== pw2
  const two = { display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }
  const full = { gridColumn: '1 / -1' }

  return (
    <AuthShell signup={step === 'create'} panelTitle={step === 'create' ? 'Everything your kitchen needs, in one place.' : 'Your kitchen’s single supplier.'}>
      {step === 'login' && (
        <Box component="form" onSubmit={submitLogin} noValidate>
          <Typography sx={{ color: c.red, fontSize: 12, lineHeight: 1.7, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', mb: 1 }}>Log in to your account</Typography>
          <Typography variant="h1" sx={{ fontSize: { xs: 28, md: 32 }, lineHeight: 1.15, fontWeight: 600, letterSpacing: '-0.02em', color: c.ink }}>Welcome back!</Typography>
          <Typography sx={{ fontSize: 15, lineHeight: '22px', color: c.text2, mt: 1, mb: 3.5 }}>Enter your details</Typography>
          {err && <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>{err}</Alert>}
          <Stack spacing={2}>
            <TextField
              fullWidth required type="email" placeholder="Email address *" inputProps={{ 'aria-label': 'Email address' }} sx={loginField}
              value={email} onChange={(e) => { setEmail(e.target.value); setErr(null) }} autoComplete="email"
              error={tried && !emailOk} helperText={tried && !emailOk ? (email ? 'Enter a valid email address' : 'This field is required') : undefined}
              InputProps={{ startAdornment: <InputAdornment position="start"><MailOutlineRounded /></InputAdornment> }}
            />
            <PasswordField required placeholder="Password *" sx={loginField} value={pw} onChange={(v) => { setPw(v); setErr(null) }} icon={<LockOutlined />}
              error={(tried && !pw) || !!err} helperText={tried && !pw ? 'This field is required' : undefined} />
          </Stack>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <Link component={RouterLink} to={`/account/forgot-password?email=${encodeURIComponent(email)}`} underline="none" sx={{ fontSize: 14, lineHeight: '24px', color: c.navy, fontWeight: 600 }}>Forgot password?</Link>
          </Box>
          <Button type="submit" fullWidth variant="contained" size="large" disabled={busy} endIcon={busy ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : <ArrowForwardRounded />}
            sx={{ mt: 2.5, minHeight: 48, borderRadius: '8px', fontWeight: 600, '& .MuiButton-endIcon svg': { fontSize: 20 }, '&.Mui-disabled': { bgcolor: c.red, color: '#fff', opacity: 0.85 } }}>
            {busy ? 'Logging in…' : 'Log in'}
          </Button>
          <Typography sx={{ mt: 3, textAlign: 'center', fontSize: 14, lineHeight: '20px', color: c.text2 }}>
            Don’t have an account? <Link component="button" type="button" underline="none" onClick={() => go('create')} sx={{ color: c.navy, fontWeight: 600, fontSize: 'inherit', verticalAlign: 'baseline' }}>Sign up</Link>
          </Typography>
        </Box>
      )}

      {step === 'create' && (
        <Box component="form" onSubmit={submitCreate} noValidate>
          <Button startIcon={<ArrowBackRounded />} onClick={() => go('login')} sx={{ ml: -1, mb: 1, color: c.text2 }}>Back</Button>
          <StepHeader compact eyebrow="New to MySupreme" title="Get Started with MySupreme" body={<>Already have one? <Link component="button" type="button" onClick={() => go('login')} sx={{ color: c.navy, fontWeight: 600, verticalAlign: 'baseline' }}>Sign in</Link></>} />
          {tried && missing && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: `${tokens.radius.sm}px` }}>Please complete the highlighted fields.</Alert>
          )}
          <Typography variant="overline" component="h2" sx={{ color: c.text3, display: 'block', mb: 1.5 }}>Your business</Typography>
          <Box sx={{ ...two, mb: 3 }}>
            <TextField size="small" sx={full} required label="Business name" value={f.business} onChange={set('business')} error={req(f.business)} helperText={req(f.business) ? 'Required — as it appears on invoices' : undefined} autoComplete="organization" />
            <TextField size="small" select required label="Business category" value={f.category} onChange={(e) => setF((s) => ({ ...s, category: e.target.value, sub: '' }))} error={req(f.category)} helperText={req(f.category) ? 'Choose one' : undefined}>
              {Object.keys(businessTypes).map((x) => <MenuItem key={x} value={x}>{x}</MenuItem>)}
            </TextField>
            <TextField size="small" select label="Business structure" value={f.structure} onChange={set('structure')}>
              {structures.map((x) => <MenuItem key={x} value={x}>{x}</MenuItem>)}
            </TextField>
            <TextField size="small" sx={full} select label="Business sub-category" value={f.sub} onChange={set('sub')} disabled={!f.category} helperText={f.category ? undefined : 'Choose a category first'}>
              {(businessTypes[f.category] ?? []).map((x) => <MenuItem key={x} value={x}>{x}</MenuItem>)}
            </TextField>
            <TextField size="small" type="tel" label="Business phone" value={f.phone} onChange={set('phone')} autoComplete="tel" />
            <TextField size="small" required label="HST / Tax ID" value={f.hst} onChange={set('hst')} error={req(f.hst)} helperText={req(f.hst) ? 'Required' : undefined} inputProps={{ style: { fontFamily: tokens.font.mono } }} />
            <TextField size="small" label="Manager first name" value={f.mFirst} onChange={set('mFirst')} />
            <TextField size="small" label="Manager last name" value={f.mLast} onChange={set('mLast')} />
          </Box>
          <Typography variant="overline" component="h2" sx={{ color: c.text3, display: 'block', mb: 1.5 }}>Your details</Typography>
          <Box sx={two}>
            <Box sx={{ ...full, display: 'grid', gap: 2, gridTemplateColumns: { xs: '92px 1fr', sm: '92px 1fr 1fr' } }}>
              <TextField size="small" select label="Title" value={f.title} onChange={set('title')} autoComplete="honorific-prefix">
                {titles.map((x) => <MenuItem key={x} value={x}>{x}</MenuItem>)}
              </TextField>
              <TextField size="small" required label="First name" value={f.first} onChange={set('first')} error={req(f.first)} helperText={req(f.first) ? 'Required' : undefined} autoComplete="given-name" />
              <TextField size="small" sx={{ gridColumn: { xs: '1 / -1', sm: 'auto' } }} required label="Last name" value={f.last} onChange={set('last')} error={req(f.last)} helperText={req(f.last) ? 'Required' : undefined} autoComplete="family-name" />
            </Box>
            <TextField size="small" required type="email" label="Email address" value={email} onChange={(e) => setEmail(e.target.value)} error={tried && !emailOk} helperText={tried && !emailOk ? 'Enter a valid email' : undefined} autoComplete="email" />
            <TextField size="small" type="tel" label="Mobile number" value={f.mobile} onChange={set('mobile')} autoComplete="tel" />
            <PasswordField size="small" required label="Create password" value={pw} onChange={setPw} autoComplete="new-password"
              error={tried && passwordScore(pw) < 2} helperText={tried && passwordScore(pw) < 2 ? '8+ characters with a number and a capital letter' : undefined} />
            <PasswordField size="small" required label="Confirm password" value={pw2} onChange={setPw2} autoComplete="new-password"
              error={tried && pw !== pw2} helperText={tried && pw !== pw2 ? 'Passwords don’t match' : undefined} />
          </Box>
          <Typography sx={{ fontSize: 13, color: c.text2, mt: 3 }}>
            By creating an account you agree to the <Link component={RouterLink} to="/page/terms" sx={{ color: c.navy, fontWeight: 600 }}>Terms &amp; Uses</Link> and <Link component={RouterLink} to="/page/privacy-policy" sx={{ color: c.navy, fontWeight: 600 }}>Privacy Policy</Link>.
          </Typography>
          <Button type="submit" fullWidth variant="contained" size="large" disabled={busy} sx={{ mt: 2, '&.Mui-disabled': { bgcolor: c.red, color: '#fff', opacity: 0.85 } }}
            startIcon={busy ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : undefined}>
            {busy ? 'Creating account…' : 'Sign up'}
          </Button>
        </Box>
      )}
    </AuthShell>
  )
}
