import { useId, useState, type ReactNode } from 'react'
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom'
import { Box, Button, CircularProgress, FormControlLabel, IconButton, InputAdornment, MenuItem, Switch, TextField, Typography, type TextFieldProps } from '@mui/material'
import { tokens, focusRing } from '../theme'
import { useApp } from '../state/app'
import { demoAccount } from '../data/app'
import { AlertCircleIcon, CheckCircleIcon, ChevronLeftIcon, EyeIcon, EyeOffIcon, LockIcon, MailIcon, ShieldIcon, TruckIcon } from '../components/icons'

const c = tokens.color
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
const base = import.meta.env.BASE_URL
/** Field surfaces from the current app's cards: light grey well, hairline border, 14px corners. */
const well = { body: '#F6F7F9', border: '#ECEDF0', radius: 14 }

/** Label above the input (as in the current app), the input in a grey well. */
function Field({ label, ...props }: { label: string } & TextFieldProps) {
  const id = useId()
  return (
    <Box>
      <Box component="label" htmlFor={id} sx={{ display: 'block', fontSize: 13.5, fontWeight: 600, color: c.ink, mb: 0.75 }}>{label}</Box>
      <TextField id={id} fullWidth {...props}
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: `${well.radius}px`, bgcolor: well.body, '& fieldset': { borderColor: well.border }, '&.Mui-focused': { bgcolor: '#fff' } }, '& .MuiFormHelperText-root': { mx: 0.25 } }} />
    </Box>
  )
}

const icon = (node: ReactNode) => ({ startAdornment: <InputAdornment position="start" sx={{ color: c.text3, mr: 0.25 }}>{node}</InputAdornment> })

function SignInForm() {
  const { signIn, notify, continueAsGuest } = useApp()
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
    <>
      <Box component="form" noValidate onSubmit={submit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Field label="Email address" type="email" autoComplete="email" placeholder="name@restaurant.ca" value={email} onChange={(e) => setEmail(e.target.value)} error={touched && !!errors.email} helperText={touched && errors.email} inputProps={{ inputMode: 'email' }} InputProps={icon(<MailIcon sx={{ fontSize: 20 }} />)} />
        <Field
          label="Password" type={show ? 'text' : 'password'} autoComplete="current-password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)}
          error={touched && !!errors.password} helperText={touched && errors.password}
          InputProps={{ ...icon(<LockIcon sx={{ fontSize: 20 }} />), endAdornment: <InputAdornment position="end"><IconButton aria-label={show ? 'Hide password' : 'Show password'} onClick={() => setShow((s) => !s)} edge="end" sx={{ color: c.text3 }}>{show ? <EyeOffIcon /> : <EyeIcon />}</IconButton></InputAdornment> }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: -0.75 }}>
          <FormControlLabel sx={{ ml: -1 }} control={<Switch size="small" checked={faceId} onChange={(e) => setFaceId(e.target.checked)} />} label={<Typography sx={{ fontSize: 14, color: c.text2 }}>Face ID next time</Typography>} />
          <Button size="small" onClick={() => notify({ message: 'Reset link sent', detail: `Check ${email || 'your inbox'}`, tone: 'info' })} sx={{ color: c.red, fontWeight: 600, mr: -1 }}>Forgot password?</Button>
        </Box>
        <Button type="submit" variant="contained" size="large" disabled={busy} startIcon={busy ? <CircularProgress size={18} sx={{ color: 'inherit' }} /> : undefined} sx={{ borderRadius: `${well.radius}px`, boxShadow: 'none' }}>{busy ? 'Logging in…' : 'Log in'}</Button>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, my: 2.5, color: c.text3, fontSize: 13, '&::before, &::after': { content: '""', flex: 1, height: '1px', bgcolor: c.line } }}>New to Supreme?</Box>
      <Button component={RouterLink} to="/signin?mode=register" replace size="large" fullWidth sx={{ borderRadius: `${well.radius}px`, border: `1.5px solid ${well.border}`, color: c.ink, fontWeight: 600, '&:hover': { bgcolor: well.body, borderColor: c.line2 } }}>Open a business account</Button>
      <Button fullWidth onClick={() => { continueAsGuest(); navigate('/', { replace: true }) }} sx={{ mt: 0.75, color: c.text2, fontWeight: 600 }}>Browse as a guest</Button>

      <Box sx={{ display: 'flex', gap: 1, mt: 2, p: 1.25, borderRadius: `${well.radius}px`, bgcolor: well.body, color: c.text2 }}>
        <ShieldIcon sx={{ fontSize: 18, flexShrink: 0, mt: 0.125 }} />
        <Typography sx={{ fontSize: 12.5, lineHeight: 1.45 }}>Prototype: the demo business account is filled in. Logging in shows business prices, credit and order history.</Typography>
      </Box>
    </>
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
        <Button component={RouterLink} to="/signin" replace size="large" fullWidth variant="contained" sx={{ mt: 3, borderRadius: `${well.radius}px`, boxShadow: 'none' }}>Back to log in</Button>
      </Box>
    )
  }
  return (
    <>
      <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); setTouched(true); if (!Object.values(err).some(Boolean)) { setDone(true); notify({ message: 'Application sent' }) } }} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Field label="Business name" placeholder="e.g. Spice Route Kitchen" value={f.business} onChange={set('business')} error={touched && err.business} helperText={touched && err.business && 'Enter your business name.'} />
        <Field select label="Type of business" value={f.type} onChange={set('type')} error={touched && err.type} helperText={touched && err.type && 'Choose one so we can show relevant products.'}
          SelectProps={{ displayEmpty: true, renderValue: (v) => (v ? String(v) : <Box component="span" sx={{ color: c.text3 }}>Choose one</Box>) }}>
          {['Restaurant', 'Café or bakery', 'Caterer', 'Food truck', 'Ghost kitchen', 'Grocery or retail'].map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
        </Field>
        <Field label="Your name" autoComplete="name" value={f.name} onChange={set('name')} error={touched && err.name} helperText={touched && err.name && 'Enter your name.'} />
        <Field label="Work email" type="email" autoComplete="email" placeholder="name@restaurant.ca" value={f.email} onChange={set('email')} error={touched && err.email} helperText={touched && err.email && 'Enter an email like name@restaurant.ca.'} inputProps={{ inputMode: 'email' }} />
        <Field label="Mobile number" type="tel" autoComplete="tel" value={f.phone} onChange={set('phone')} error={touched && err.phone} helperText={touched && err.phone ? 'Enter a 10-digit number.' : 'We’ll text delivery updates here.'} inputProps={{ inputMode: 'tel' }} />
        {touched && Object.values(err).some(Boolean) && <Typography role="alert" sx={{ display: 'flex', gap: 0.75, fontSize: 13.5, color: c.error }}><AlertCircleIcon sx={{ fontSize: 18 }} /> Fix the highlighted fields to continue.</Typography>}
        <Button type="submit" variant="contained" size="large" sx={{ borderRadius: `${well.radius}px`, boxShadow: 'none' }}>Apply for a business account</Button>
      </Box>
      <Typography sx={{ mt: 2.5, textAlign: 'center', fontSize: 14, color: c.text2 }}>
        Already have an account?{' '}
        <Box component={RouterLink} to="/signin" replace sx={{ color: c.red, fontWeight: 600, textDecoration: 'none', borderRadius: 0.5, ...focusRing }}>Log in</Box>
      </Typography>
    </>
  )
}

/**
 * Log in / open an account. The top is the real Supreme photo — the branded delivery truck at the dock — under a
 * white sheet with the form, in the current app's card style (grey wells, 14px corners, red action).
 */
export default function SignIn() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const register = params.get('mode') === 'register'
  const back = () => (window.history.length > 1 ? navigate(-1) : navigate('/'))
  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: '#fff' }}>
      <Box sx={{ position: 'relative', height: register ? 'clamp(170px, 26dvh, 220px)' : 'clamp(230px, 38dvh, 320px)', overflow: 'hidden', bgcolor: '#E9E9E7', transition: `height ${tokens.motion.base}` }}>
        <Box component="img" src={`${base}login/supreme-truck.jpg`} alt="Supreme Restaurant Supply delivery truck at the warehouse dock"
          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 68%' }} />
        <Box aria-hidden sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(17,24,39,.26) 0%, rgba(17,24,39,0) 34%, rgba(17,24,39,0) 62%, rgba(17,24,39,.34) 100%)' }} />
        <IconButton aria-label="Back" onClick={back}
          sx={{ position: 'absolute', top: 'calc(10px + env(safe-area-inset-top))', left: 12, width: 44, height: 44, color: c.ink, bgcolor: 'rgba(255,255,255,.94)', boxShadow: tokens.shadow.card, '&:hover': { bgcolor: '#fff' } }}>
          <ChevronLeftIcon />
        </IconButton>
        <Box sx={{ position: 'absolute', left: 16, bottom: 38, display: 'inline-flex', alignItems: 'center', gap: 0.75, px: 1.25, py: 0.625, borderRadius: 999, bgcolor: 'rgba(17,24,39,.5)', backdropFilter: 'blur(8px)', color: '#fff', fontSize: 12.5, fontWeight: 600 }}>
          <TruckIcon sx={{ fontSize: 16 }} /> Our own fleet · Same & next-day delivery
        </Box>
      </Box>

      <Box sx={{ position: 'relative', mt: '-24px', borderRadius: '24px 24px 0 0', bgcolor: '#fff', px: 2.5, pt: 3, pb: 'calc(28px + env(safe-area-inset-bottom))' }}>
        <Box component="img" src={`${base}logo-crown.png`} alt="" sx={{ display: 'block', height: 26, width: 'auto' }} />
        <Typography component="h1" sx={{ fontSize: 24, fontWeight: 700, letterSpacing: '-.015em', mt: 1.5 }}>{register ? 'Open a business account' : 'Welcome back'}</Typography>
        <Typography sx={{ color: c.text2, fontSize: 14.5, mt: 0.5, mb: 2.5, lineHeight: 1.5 }}>{register ? 'Free to join. Takes about two minutes.' : 'Log in for your business prices and order history.'}</Typography>
        {register ? <RegisterForm /> : <SignInForm />}
      </Box>
    </Box>
  )
}
