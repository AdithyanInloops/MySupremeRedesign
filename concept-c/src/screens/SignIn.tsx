import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Box, Button, CircularProgress, FormControlLabel, IconButton, InputAdornment, MenuItem, Switch, TextField, Typography } from '@mui/material'
import { tokens } from '../theme'
import { useApp } from '../state/app'
import { demoAccount } from '../data/app'
import { Logo, TopBar } from '../components/ui'
import { AlertCircleIcon, CheckCircleIcon, EyeIcon, EyeOffIcon, ShieldIcon } from '../components/icons'

const c = tokens.color
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())

function SignInForm() {
  const { signIn, notify } = useApp()
  const navigate = useNavigate()
  const [email, setEmail] = useState(demoAccount.email)
  const [password, setPassword] = useState(demoAccount.password)
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)
  const [touched, setTouched] = useState(false)
  const [faceId, setFaceId] = useState(true)
  const errors = { email: !email.trim() ? 'Enter your email.' : !isEmail(email) ? 'Enter an email like name@restaurant.ca.' : '', password: password.length < 6 ? 'Passwords are at least 6 characters.' : '' }
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)
    if (errors.email || errors.password) return
    setBusy(true)
    await new Promise((r) => setTimeout(r, 700))
    signIn()
    notify({ message: 'Welcome back, Priya', detail: 'Spice Route Kitchen · business pricing on' })
    navigate('/', { replace: true })
  }
  return (
    <Box component="form" noValidate onSubmit={submit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField label="Work email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={touched && !!errors.email} helperText={touched && errors.email} inputProps={{ inputMode: 'email' }} fullWidth />
      <TextField
        label="Password" type={show ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)}
        error={touched && !!errors.password} helperText={touched && errors.password} fullWidth
        InputProps={{ endAdornment: <InputAdornment position="end"><IconButton aria-label={show ? 'Hide password' : 'Show password'} onClick={() => setShow((s) => !s)} edge="end">{show ? <EyeOffIcon /> : <EyeIcon />}</IconButton></InputAdornment> }}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <FormControlLabel control={<Switch checked={faceId} onChange={(e) => setFaceId(e.target.checked)} />} label={<Typography sx={{ fontSize: 14 }}>Use Face ID next time</Typography>} />
        <Button size="small" onClick={() => notify({ message: 'Reset link sent', detail: `Check ${email || 'your inbox'}`, tone: 'info' })} sx={{ color: c.navy }}>Forgot?</Button>
      </Box>
      <Button type="submit" variant="contained" size="large" disabled={busy} startIcon={busy ? <CircularProgress size={18} sx={{ color: 'inherit' }} /> : undefined}>{busy ? 'Signing in…' : 'Sign in'}</Button>
      <Box sx={{ display: 'flex', gap: 1, p: 1.5, borderRadius: `${tokens.radius.sm}px`, bgcolor: c.navyTint, color: c.navy }}>
        <ShieldIcon sx={{ fontSize: 20, flexShrink: 0 }} />
        <Typography sx={{ fontSize: 12.5, lineHeight: 1.45 }}>Prototype: the demo business account is filled in. Signing in shows business prices, credit and order history.</Typography>
      </Box>
    </Box>
  )
}

function RegisterForm() {
  const { notify } = useApp()
  const [f, setF] = useState({ business: '', type: '', name: '', email: '', phone: '' })
  const [touched, setTouched] = useState(false)
  const [done, setDone] = useState(false)
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value })
  const err = { business: !f.business.trim(), type: !f.type, name: !f.name.trim(), email: !isEmail(f.email), phone: f.phone.replace(/\D/g, '').length < 10 }
  if (done) {
    return (
      <Box role="status" sx={{ textAlign: 'center', py: 4 }}>
        <CheckCircleIcon sx={{ fontSize: 56, color: c.successText }} />
        <Typography component="h2" sx={{ fontSize: 20, fontWeight: 700, mt: 1 }}>Application received</Typography>
        <Typography sx={{ color: c.text2, mt: 1 }}>We’ll verify {f.business} within one business day and text {f.phone} when business pricing is on.</Typography>
      </Box>
    )
  }
  return (
    <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); setTouched(true); if (!Object.values(err).some(Boolean)) { setDone(true); notify({ message: 'Application sent' }) } }} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField label="Business name" value={f.business} onChange={set('business')} error={touched && err.business} helperText={touched && err.business && 'Enter your business name.'} fullWidth />
      <TextField select label="Type of business" value={f.type} onChange={set('type')} error={touched && err.type} helperText={touched && err.type && 'Choose one so we can show relevant products.'} fullWidth>
        {['Restaurant', 'Café or bakery', 'Caterer', 'Food truck', 'Ghost kitchen', 'Grocery or retail'].map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
      </TextField>
      <TextField label="Your name" value={f.name} onChange={set('name')} error={touched && err.name} helperText={touched && err.name && 'Enter your name.'} fullWidth />
      <TextField label="Work email" type="email" value={f.email} onChange={set('email')} error={touched && err.email} helperText={touched && err.email && 'Enter an email like name@restaurant.ca.'} inputProps={{ inputMode: 'email' }} fullWidth />
      <TextField label="Mobile number" type="tel" value={f.phone} onChange={set('phone')} error={touched && err.phone} helperText={touched && err.phone ? 'Enter a 10-digit number.' : 'We’ll text delivery updates here.'} inputProps={{ inputMode: 'tel' }} fullWidth />
      {touched && Object.values(err).some(Boolean) && <Typography role="alert" sx={{ display: 'flex', gap: 0.75, fontSize: 13.5, color: c.error }}><AlertCircleIcon sx={{ fontSize: 18 }} /> Fix the highlighted fields to continue.</Typography>}
      <Button type="submit" variant="contained" size="large">Apply for a business account</Button>
    </Box>
  )
}

export default function SignIn() {
  const [params] = useSearchParams()
  const register = params.get('mode') === 'register'
  return (
    <Box sx={{ minHeight: '100%', bgcolor: '#fff' }}>
      <TopBar back="/welcome" />
      <Box sx={{ px: 3, pt: 1, pb: 4 }}>
        <Logo />
        <Typography component="h1" sx={{ fontSize: 26, fontWeight: 800, letterSpacing: '-.02em', mt: 3 }}>{register ? 'Open a business account' : 'Welcome back'}</Typography>
        <Typography sx={{ color: c.text2, mt: 0.5, mb: 3 }}>{register ? 'Free to join. Takes about two minutes.' : 'Sign in for your business prices and order history.'}</Typography>
        {register ? <RegisterForm /> : <SignInForm />}
      </Box>
    </Box>
  )
}
