import { useState } from 'react'
import {
  Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, IconButton, InputAdornment, MenuItem, Stack, Switch, TextField, Typography,
} from '@mui/material'
import { useLocation } from 'react-router-dom'
import VisibilityRounded from '@mui/icons-material/VisibilityRounded'
import VisibilityOffRounded from '@mui/icons-material/VisibilityOffRounded'
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded'
import { tokens } from '../../theme'
import { customer } from '../../data/account'
import { useApp } from '../../state/AppState'
import { NewFeatureTag, Panel } from '../../components/ui'
import { PanelHead, PanelSkeleton } from './parts/AccountParts'

const c = tokens.color

function PasswordField({ label, value, onChange, error, helper }: { label: string; value: string; onChange: (v: string) => void; error?: boolean; helper?: string }) {
  const [show, setShow] = useState(false)
  return (
    <TextField
      label={label}
      type={show ? 'text' : 'password'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={error}
      helperText={helper ?? ' '}
      fullWidth
      autoComplete="new-password"
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton aria-label={show ? 'Hide password' : 'Show password'} onClick={() => setShow((s) => !s)} edge="end" sx={{ width: 44, height: 44 }}>
              {show ? <VisibilityOffRounded /> : <VisibilityRounded />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  )
}

function Personal() {
  const { toast } = useApp()
  const [form, setForm] = useState({ first: customer.firstName, last: customer.lastName, email: customer.email, phone: customer.phone })
  const [tried, setTried] = useState(false)
  const [pw, setPw] = useState({ cur: '', next: '', confirm: '' })
  const [pwTried, setPwTried] = useState(false)
  const [prefs, setPrefs] = useState({ news: true, flyers: true, sms: false, whatsapp: true })
  const emailErr = tried && !/^\S+@\S+\.\S+$/.test(form.email)
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const pwShort = pwTried && pw.next.length < 8
  const pwMismatch = pwTried && pw.next !== pw.confirm

  return (
    <>
      <Panel>
        <PanelHead title="Personal info" />
        <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); setTried(true); if (/^\S+@\S+\.\S+$/.test(form.email)) toast('Personal info saved') }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <TextField label="First name" value={form.first} onChange={set('first')} helperText=" " />
            <TextField label="Last name" value={form.last} onChange={set('last')} helperText=" " />
            <TextField label="Email" type="email" value={form.email} onChange={set('email')} error={emailErr} helperText={emailErr ? 'Enter a valid email, e.g. name@restaurant.ca' : 'Order confirmations and invoices go here'} />
            <TextField label="Phone" type="tel" value={form.phone} onChange={set('phone')} helperText="Used by drivers on delivery day" />
          </Box>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Button type="submit" variant="contained">Save changes</Button>
            <Button onClick={() => { setForm((f) => ({ ...f, email: 'priya@spiceroute' })); setTried(true) }} sx={{ color: c.text2 }}>Show error example</Button>
          </Stack>
        </Box>
      </Panel>

      <Panel>
        <PanelHead title="Change password" />
        <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); setPwTried(true); if (pw.next.length >= 8 && pw.next === pw.confirm && pw.cur) { toast('Password updated'); setPw({ cur: '', next: '', confirm: '' }); setPwTried(false) } }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
            <PasswordField label="Current password" value={pw.cur} onChange={(v) => setPw((p) => ({ ...p, cur: v }))} error={pwTried && !pw.cur} helper={pwTried && !pw.cur ? 'Enter your current password' : undefined} />
            <PasswordField label="New password" value={pw.next} onChange={(v) => setPw((p) => ({ ...p, next: v }))} error={pwShort} helper={pwShort ? 'At least 8 characters' : 'At least 8 characters'} />
            <PasswordField label="Confirm new password" value={pw.confirm} onChange={(v) => setPw((p) => ({ ...p, confirm: v }))} error={pwMismatch} helper={pwMismatch ? 'Passwords don’t match' : undefined} />
          </Box>
          <Button type="submit" variant="outlined" color="secondary" sx={{ mt: 1 }}>Update password</Button>
        </Box>
      </Panel>

      <Panel>
        <PanelHead title="Newsletter & notifications" />
        <Stack divider={<Divider />}>
          {([
            ['news', 'MySupreme newsletter', 'New products and kitchen tips, twice a month'],
            ['flyers', 'Flyers & weekly deals', 'Monthly flyer and Weekly Hot Picks by email'],
            ['sms', 'SMS delivery updates', 'Text when your truck is 30 minutes away'],
            ['whatsapp', 'WhatsApp order updates', 'Confirmations and invoices on WhatsApp'],
          ] as const).map(([k, t, s]) => (
            <FormControlLabel
              key={k}
              labelPlacement="start"
              control={<Switch checked={prefs[k]} onChange={(e) => { setPrefs((p) => ({ ...p, [k]: e.target.checked })); toast(`${t} ${e.target.checked ? 'on' : 'off'}`, 'info') }} />}
              label={<Box><Typography sx={{ fontWeight: 600, fontSize: 14 }}>{t}{(k === 'sms' || k === 'whatsapp') && <NewFeatureTag sx={{ ml: 1 }} note="SMS / WhatsApp notification opt-in + messaging integration" />}</Typography><Typography sx={{ fontSize: 12.5, color: c.text2 }}>{s}</Typography></Box>}
              sx={{ mx: 0, py: 1.25, justifyContent: 'space-between', minHeight: 56 }}
            />
          ))}
        </Stack>
      </Panel>
    </>
  )
}

function Company() {
  const { toast, setReview } = useApp()
  const [form, setForm] = useState({ name: customer.businessName, category: customer.businessCategory, structure: customer.businessStructure, hst: customer.hst })
  const [confirm, setConfirm] = useState(false)
  const [typed, setTyped] = useState('')
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }))
  return (
    <>
      <Panel>
        <PanelHead title="Company information" />
        <Alert severity="info" sx={{ mb: 2.5, borderRadius: `${tokens.radius.sm}px` }}>Changes to business name or HST number are reviewed by our accounts team before invoices update.</Alert>
        <Box component="form" onSubmit={(e) => { e.preventDefault(); toast('Company information submitted for review') }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <TextField label="Business name" value={form.name} onChange={set('name')} helperText=" " />
            <TextField label="HST number" value={form.hst} onChange={set('hst')} helperText="Format: 123456789 RT0001" />
            <TextField select label="Business category" value={form.category} onChange={set('category')} helperText=" ">
              {['Restaurant — Full service', 'Restaurant — Quick service', 'Café / Bakery', 'Caterer', 'Food truck', 'Ghost kitchen', 'Hospitality & events'].map((x) => <MenuItem key={x} value={x}>{x}</MenuItem>)}
            </TextField>
            <TextField select label="Business structure" value={form.structure} onChange={set('structure')} helperText=" ">
              {['Sole proprietorship', 'Partnership', 'Corporation', 'Non-profit'].map((x) => <MenuItem key={x} value={x}>{x}</MenuItem>)}
            </TextField>
          </Box>
          <Button type="submit" variant="contained" sx={{ mt: 1 }}>Save company info</Button>
        </Box>
      </Panel>

      <Panel sx={{ borderColor: '#F5C2C2' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }} justifyContent="space-between">
          <Stack direction="row" spacing={1.5}>
            <WarningAmberRounded sx={{ color: c.error, mt: 0.25 }} />
            <Box>
              <Typography variant="h5" component="h2" sx={{ color: c.error }}>Delete account</Typography>
              <Typography variant="body2" color="text.secondary">Permanently remove your online account. Open invoices must be paid first; order history is kept for tax records.</Typography>
            </Box>
          </Stack>
          <Button variant="outlined" color="error" onClick={() => setConfirm(true)} sx={{ flexShrink: 0 }}>Delete account</Button>
        </Stack>
      </Panel>

      <Dialog open={confirm} onClose={() => setConfirm(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete your MySupreme account?</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary" sx={{ mb: 2 }}>You have <b>3 open invoices</b>. We’ll close the account once they’re paid. Type <b>DELETE</b> to confirm.</Typography>
          <TextField fullWidth value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="DELETE" inputProps={{ 'aria-label': 'Type DELETE to confirm' }} />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setConfirm(false)} sx={{ color: c.text2 }}>Cancel</Button>
          <Button variant="contained" color="error" disabled={typed !== 'DELETE'} onClick={() => { setConfirm(false); toast('Deletion request received — we’ll email you', 'info'); setReview({ signedIn: false }) }}>Delete account</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default function Profile() {
  const { pathname } = useLocation()
  const { review } = useApp()
  const company = pathname.endsWith('/company')
  return (
    <Stack spacing={{ xs: 2, md: 3 }}>
      <Box>
        <Typography variant="h2" component="h2">{company ? 'Company information' : 'Personal info'}</Typography>
        <Typography color="text.secondary">{company ? 'How your business appears on invoices and statements.' : 'Your contact details, password and notification settings.'}</Typography>
      </Box>
      {review.loading ? <><PanelSkeleton h={160} /><PanelSkeleton h={100} /></> : company ? <Company /> : <Personal />}
    </Stack>
  )
}
