import { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Box, Button, Checkbox, CircularProgress, FormControlLabel, IconButton, InputAdornment, MenuItem, Tab, Tabs, Typography } from '@mui/material'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import SellOutlinedIcon from '@mui/icons-material/SellOutlined'
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined'
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined'
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined'
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'
import { useSession } from '../../lib/session'
import { useToast } from '../../lib/toast'
import { emailError, phoneError } from '../../lib/validate'
import { colors, focusRing, layout, radius } from '../../lib/theme'
import Field from '../../components/ui/Field'

type Mode = 'signin' | 'register' | 'reset'

const benefits = [
  { icon: SellOutlinedIcon, title: 'Business pricing', text: 'Customer-group prices on 4,300+ products' },
  { icon: AccountBalanceOutlinedIcon, title: 'Credit terms', text: 'Pay on account — Net 30 for approved businesses' },
  { icon: ReplayRoundedIcon, title: 'Reorder in one tap', text: 'Favorites, history and quick order by SKU' },
  { icon: PlaceOutlinedIcon, title: 'Faster checkout', text: 'Saved delivery addresses and contacts' },
]

const BUSINESS_TYPES = ['Restaurant', 'Café or bakery', 'Caterer or events', 'Food truck', 'Ghost kitchen', 'Grocery or retail', 'Other']

function PasswordField({ id, label, value, onChange, error, hint, autoComplete }: { id: string; label: string; value: string; onChange: (v: string) => void; error?: string; hint?: string; autoComplete: string }) {
  const [show, setShow] = useState(false)
  return (
    <Field
      id={id} label={label} type={show ? 'text' : 'password'} value={value} onChange={(e) => onChange(e.target.value)} error={error} hint={hint} autoComplete={autoComplete}
      InputProps={{ endAdornment: <InputAdornment position="end"><IconButton aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show} onClick={() => setShow((s) => !s)} edge="end">{show ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}</IconButton></InputAdornment> }}
    />
  )
}

function SignInForm({ onReset, next }: { onReset: (email: string) => void; next: string }) {
  const router = useRouter()
  const { signIn } = useSession()
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [touched, setTouched] = useState(false)
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)
  const errors = { email: emailError(email), password: password ? '' : 'Enter your password.' }
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)
    setFailed(false)
    if (errors.email || errors.password) return document.getElementById(errors.email ? 'si-email' : 'si-password')?.focus()
    setBusy(true)
    await new Promise((r) => setTimeout(r, 700))
    setBusy(false)
    // Prototype rule so the error state can be reviewed: passwords under 6 characters "don't match".
    if (password.length < 6) { setFailed(true); return }
    const u = signIn(email)
    toast({ message: `Welcome back, ${u.name.split(' ')[0]}`, description: `Signed in to ${u.business} — business pricing is on.` })
    router.push(next)
  }
  return (
    <Box component="form" noValidate onSubmit={submit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {failed && (
        <Box role="alert" sx={{ display: 'flex', gap: 1, p: 1.5, borderRadius: radius.md, bgcolor: colors.errorTint, border: `1px solid ${colors.errorLine}`, color: '#7F1D1D', fontSize: 14 }}>
          <ErrorOutlineRoundedIcon sx={{ color: colors.error, fontSize: 20 }} />
          <span>That email and password don’t match. Check for typos, or <Box component="button" type="button" onClick={() => onReset(email)} sx={{ all: 'unset', cursor: 'pointer', color: colors.error, fontWeight: 600, textDecoration: 'underline', ...focusRing }}>reset your password</Box>.</span>
        </Box>
      )}
      <Field id="si-email" label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={touched ? errors.email : undefined} inputProps={{ inputMode: 'email' }} />
      <Box>
        <PasswordField id="si-password" label="Password" value={password} onChange={setPassword} error={touched ? errors.password : undefined} autoComplete="current-password" />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
          <Button size="small" onClick={() => onReset(email)} sx={{ color: colors.redText, mr: -1 }}>Forgot password?</Button>
        </Box>
      </Box>
      <Button type="submit" variant="contained" size="large" disabled={busy} startIcon={busy ? <CircularProgress size={18} sx={{ color: 'inherit' }} /> : undefined}>{busy ? 'Signing in…' : 'Sign in'}</Button>
      <Typography sx={{ fontSize: 12.5, color: colors.ink500, textAlign: 'center' }}>Prototype: any email with a 6+ character password signs you in as “Spice Route Kitchen”.</Typography>
    </Box>
  )
}

function RegisterForm({ initialEmail }: { initialEmail: string }) {
  const [f, setF] = useState({ business: '', type: '', contact: '', email: initialEmail, phone: '', hst: '', password: '' })
  const [agree, setAgree] = useState(false)
  const [touched, setTouched] = useState(false)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const doneRef = useRef<HTMLDivElement>(null)
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value })
  const errors: Record<string, string> = {
    business: f.business.trim() ? '' : 'Enter your business name.',
    type: f.type ? '' : 'Choose the type of business so we can show relevant products.',
    contact: f.contact.trim() ? '' : 'Enter your name.',
    email: emailError(f.email),
    phone: phoneError(f.phone),
    password: f.password.length >= 8 ? '' : 'Use at least 8 characters for your password.',
    agree: agree ? '' : 'Tick the box to accept the terms.',
  }
  const firstError = Object.entries(errors).find(([, v]) => v)?.[0]
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)
    if (firstError) return document.getElementById(`rg-${firstError}`)?.focus()
    setBusy(true)
    await new Promise((r) => setTimeout(r, 900))
    setBusy(false)
    setDone(true)
    window.requestAnimationFrame(() => doneRef.current?.focus())
  }
  const err = (k: string) => (touched ? errors[k] || undefined : undefined)
  if (done) {
    return (
      <Box ref={doneRef} tabIndex={-1} role="status" sx={{ textAlign: 'center', py: 2, outline: 'none' }}>
        <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: colors.successTint, color: colors.success, display: 'grid', placeItems: 'center', mx: 'auto', mb: 2 }}><HowToRegOutlinedIcon sx={{ fontSize: 32 }} /></Box>
        <Typography variant="h2" component="h2">Application received</Typography>
        <Typography sx={{ color: colors.ink600, mt: 1 }}>Thanks, {f.contact.split(' ')[0]}. We’ll verify <b>{f.business}</b> within one business day and email {f.email} when business pricing is on. You can shop with guest prices in the meantime.</Typography>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', mt: 3 }}>
          <Button component={Link} href="/" variant="contained">Start shopping</Button>
          <Button component={Link} href="/service/contact-us" variant="outlined">Talk to sales</Button>
        </Box>
      </Box>
    )
  }
  return (
    <Box component="form" noValidate onSubmit={submit} sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: 'minmax(0,1fr)', sm: 'minmax(0,1fr) minmax(0,1fr)' } }}>
      <Box sx={{ gridColumn: '1 / -1' }}><Field id="rg-business" label="Business name" autoComplete="organization" value={f.business} onChange={set('business')} error={err('business')} /></Box>
      <Box sx={{ gridColumn: '1 / -1' }}>
        <Field id="rg-type" label="Type of business" select value={f.type} onChange={set('type')} error={err('type')} SelectProps={{ displayEmpty: true }}>
          <MenuItem value="" disabled>Choose one</MenuItem>
          {BUSINESS_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
        </Field>
      </Box>
      <Field id="rg-contact" label="Your name" autoComplete="name" value={f.contact} onChange={set('contact')} error={err('contact')} />
      <Field id="rg-phone" label="Phone" type="tel" autoComplete="tel" value={f.phone} onChange={set('phone')} error={err('phone')} inputProps={{ inputMode: 'tel' }} />
      <Box sx={{ gridColumn: '1 / -1' }}><Field id="rg-email" label="Work email" type="email" autoComplete="email" value={f.email} onChange={set('email')} error={err('email')} inputProps={{ inputMode: 'email' }} /></Box>
      <Field id="rg-hst" label="HST number" optional value={f.hst} onChange={set('hst')} hint="Speeds up verification" />
      <PasswordField id="rg-password" label="Password" value={f.password} onChange={(v) => setF({ ...f, password: v })} error={err('password')} hint="At least 8 characters" autoComplete="new-password" />
      <Box sx={{ gridColumn: '1 / -1' }}>
        <FormControlLabel control={<Checkbox id="rg-agree" checked={agree} onChange={(e) => setAgree(e.target.checked)} />} label={<Typography sx={{ fontSize: 14 }}>I agree to the <Box component={Link} href="/terms-uses" sx={{ color: colors.redText, fontWeight: 500 }}>Terms &amp; Uses</Box> and <Box component={Link} href="/privacy-policy" sx={{ color: colors.redText, fontWeight: 500 }}>Privacy Policy</Box>.</Typography>} />
        {err('agree') && <Typography sx={{ display: 'flex', gap: 0.5, fontSize: 13, color: colors.error, ml: 4 }}><ErrorOutlineRoundedIcon sx={{ fontSize: 16, mt: '1px' }} /> {err('agree')}</Typography>}
      </Box>
      <Button type="submit" variant="contained" size="large" disabled={busy} startIcon={busy ? <CircularProgress size={18} sx={{ color: 'inherit' }} /> : undefined} sx={{ gridColumn: '1 / -1' }}>
        {busy ? 'Creating your account…' : 'Create business account'}
      </Button>
    </Box>
  )
}

function ResetForm({ initialEmail, onBack }: { initialEmail: string; onBack: () => void }) {
  const [email, setEmail] = useState(initialEmail)
  const [touched, setTouched] = useState(false)
  const [sent, setSent] = useState(false)
  const error = emailError(email)
  if (sent) {
    return (
      <Box role="status" sx={{ textAlign: 'center', py: 2 }}>
        <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: colors.infoTint, color: colors.info, display: 'grid', placeItems: 'center', mx: 'auto', mb: 2 }}><MarkEmailReadOutlinedIcon sx={{ fontSize: 30 }} /></Box>
        <Typography variant="h2" component="h2">Check your inbox</Typography>
        <Typography sx={{ color: colors.ink600, mt: 1 }}>If there’s an account for <b>{email}</b>, we’ve sent a link to reset your password. It expires in 1 hour.</Typography>
        <Button onClick={onBack} variant="outlined" sx={{ mt: 3 }}>Back to sign in</Button>
      </Box>
    )
  }
  return (
    <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); setTouched(true); if (!error) setSent(true); else document.getElementById('rs-email')?.focus() }} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography sx={{ color: colors.ink600 }}>Enter the email you use for MySupreme and we’ll send you a reset link.</Typography>
      <Field id="rs-email" label="Email" type="email" autoComplete="email" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} error={touched ? error : undefined} />
      <Button type="submit" variant="contained" size="large">Send reset link</Button>
      <Button onClick={onBack}>Back to sign in</Button>
    </Box>
  )
}

export default function AccountSignInPage() {
  const router = useRouter()
  const { user, ready } = useSession()
  const [mode, setMode] = useState<Mode>('signin')
  const [resetEmail, setResetEmail] = useState('')
  const next = typeof router.query.next === 'string' && router.query.next.startsWith('/') ? router.query.next : '/'
  const initialEmail = typeof router.query.email === 'string' ? router.query.email : ''
  useEffect(() => { if (router.query.mode === 'register') setMode('register') }, [router.query.mode])

  const titles: Record<Mode, [string, string]> = {
    signin: ['Sign in', 'Welcome back. Sign in for your business prices and saved details.'],
    register: ['Open a business account', 'Free to join. Takes about two minutes.'],
    reset: ['Reset your password', ''],
  }

  return (
    <>
      <Head><title>{`${titles[mode][0]} | MySupreme`}</title><meta name="robots" content="noindex" /></Head>
      <Box sx={{ maxWidth: layout.maxWidth, mx: 'auto', px: layout.gutter, py: { xs: 3, md: 6 } }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'minmax(0,1fr) minmax(0,1fr)' }, maxWidth: 1080, mx: 'auto', borderRadius: radius.xl, overflow: 'hidden', border: { md: `1px solid ${colors.line}` }, bgcolor: '#fff' }}>
          <Box sx={{ p: { xs: 0, md: 5 }, order: { xs: 1, md: 0 } }}>
            {ready && user && mode === 'signin' ? (
              <Box sx={{ py: 2 }}>
                <Typography variant="h1" sx={{ fontSize: { xs: 24, md: 28 } }}>You’re signed in</Typography>
                <Typography sx={{ color: colors.ink600, mt: 1 }}>as <b>{user.business}</b> ({user.email}).</Typography>
                <Button component={Link} href={next} variant="contained" size="large" sx={{ mt: 3 }}>Continue</Button>
              </Box>
            ) : (
              <>
                <Typography variant="h1" sx={{ fontSize: { xs: 24, md: 28 } }}>{titles[mode][0]}</Typography>
                {titles[mode][1] && <Typography sx={{ color: colors.ink600, mt: 0.75 }}>{titles[mode][1]}</Typography>}
                {mode !== 'reset' && (
                  <Tabs value={mode} onChange={(_, v) => setMode(v)} aria-label="Account" variant="fullWidth" sx={{ mt: 3, mb: 3, borderBottom: `1px solid ${colors.line}` }}>
                    <Tab value="signin" label="Sign in" id="acc-tab-signin" aria-controls="acc-panel" />
                    <Tab value="register" label="Create account" id="acc-tab-register" aria-controls="acc-panel" />
                  </Tabs>
                )}
                <Box id="acc-panel" role="tabpanel" aria-labelledby={`acc-tab-${mode}`} sx={{ mt: mode === 'reset' ? 3 : 0 }}>
                  {mode === 'signin' && <SignInForm next={next} onReset={(e) => { setResetEmail(e); setMode('reset') }} />}
                  {mode === 'register' && <RegisterForm initialEmail={initialEmail} />}
                  {mode === 'reset' && <ResetForm initialEmail={resetEmail} onBack={() => setMode('signin')} />}
                </Box>
                {mode === 'signin' && <Typography sx={{ mt: 3, fontSize: 14, color: colors.ink600, textAlign: 'center' }}>Just browsing? <Box component={Link} href="/" sx={{ color: colors.redText, fontWeight: 600 }}>Continue as a guest</Box></Typography>}
              </>
            )}
          </Box>
          <Box sx={{ bgcolor: colors.navy, color: '#fff', p: { xs: 3, md: 5 }, mt: { xs: 4, md: 0 }, borderRadius: { xs: radius.xl, md: 0 }, order: { xs: 2, md: 1 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="overline" component="p" sx={{ color: '#FCA5A5' }}>Why open an account</Typography>
            <Typography component="h2" variant="h2" sx={{ color: '#fff', mt: 0.5 }}>Built for kitchens that order every week</Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, mt: 3, display: 'flex', flexDirection: 'column', gap: 2.25 }}>
              {benefits.map((b) => {
                const Icon = b.icon
                return (
                  <Box component="li" key={b.title} sx={{ display: 'flex', gap: 1.5 }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: 'rgba(255,255,255,.12)', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon sx={{ fontSize: 21 }} /></Box>
                    <Box>
                      <Typography sx={{ fontWeight: 600 }}>{b.title}</Typography>
                      <Typography sx={{ fontSize: 14, color: 'rgba(255,255,255,.78)' }}>{b.text}</Typography>
                    </Box>
                  </Box>
                )
              })}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}
