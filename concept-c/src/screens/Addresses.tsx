import { useState } from 'react'
import { Box, Button, TextField, Typography } from '@mui/material'
import { tokens } from '../theme'
import { useApp } from '../state/app'
import { addresses as seed, type Address } from '../data/account'
import { Sheet, TopBar } from '../components/ui'
import { AlertCircleIcon, MapPinIcon, PlusIcon } from '../components/icons'

const c = tokens.color
const POSTAL = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/

export default function Addresses() {
  const { notify } = useApp()
  const [list, setList] = useState<Address[]>(seed)
  const [open, setOpen] = useState(false)
  const [f, setF] = useState({ company: '', name: '', street: '', city: '', postal: '', phone: '' })
  const [touched, setTouched] = useState(false)
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: k === 'postal' ? e.target.value.toUpperCase() : e.target.value })
  const err = { company: !f.company.trim(), name: !f.name.trim(), street: !f.street.trim(), city: !f.city.trim(), postal: !POSTAL.test(f.postal.trim()), phone: f.phone.replace(/\D/g, '').length < 10 }
  const save = () => {
    setTouched(true)
    if (Object.values(err).some(Boolean)) return
    setList((l) => [...l, { id: `a${l.length + 1}`, ...f, province: 'ON', inArea: /^[LMN]/.test(f.postal.toUpperCase()) }])
    notify({ message: 'Address saved', detail: f.company })
    setOpen(false); setTouched(false); setF({ company: '', name: '', street: '', city: '', postal: '', phone: '' })
  }
  return (
    <Box>
      <TopBar title="Saved addresses" />
      <Box sx={{ px: 2, pt: 2, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        {list.map((a) => (
          <Box key={a.id} sx={{ display: 'flex', gap: 1.5, p: 1.75, bgcolor: '#fff', borderRadius: `${tokens.radius.md}px`, border: `1px solid ${c.line}` }}>
            <MapPinIcon sx={{ color: c.navy, mt: 0.25 }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
                <Typography sx={{ fontWeight: 700, fontSize: 14.5 }}>{a.company}</Typography>
                {a.defaultShipping && <Box sx={{ fontSize: 11, fontWeight: 700, color: c.navy, bgcolor: c.navyTint, px: 0.75, borderRadius: 1 }}>Default delivery</Box>}
                {a.defaultBilling && <Box sx={{ fontSize: 11, fontWeight: 700, color: c.text2, bgcolor: c.surface2, px: 0.75, borderRadius: 1 }}>Billing</Box>}
              </Box>
              <Typography sx={{ fontSize: 13.5, color: c.text2, mt: 0.25 }}>{a.street}, {a.city}, {a.province} {a.postal}</Typography>
              <Typography sx={{ fontSize: 12.5, color: c.text3 }}>{a.name} · {a.phone}</Typography>
              {a.inArea === false && <Typography sx={{ display: 'flex', gap: 0.5, mt: 0.75, fontSize: 12.5, fontWeight: 600, color: c.warning }}><AlertCircleIcon sx={{ fontSize: 16 }} /> Outside delivery routes · pickup only</Typography>}
            </Box>
          </Box>
        ))}
        <Button variant="outlined" color="secondary" size="large" startIcon={<PlusIcon />} onClick={() => setOpen(true)} sx={{ bgcolor: '#fff' }}>Add an address</Button>
      </Box>
      <Sheet open={open} onClose={() => setOpen(false)} title="New address" footer={<Button fullWidth variant="contained" size="large" onClick={save}>Save address</Button>}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pt: 0.5 }}>
          <TextField label="Business or location name" value={f.company} onChange={set('company')} error={touched && err.company} helperText={touched && err.company && 'Enter a name for this address.'} />
          <TextField label="Contact name" value={f.name} onChange={set('name')} error={touched && err.name} helperText={touched && err.name && 'Who receives deliveries here?'} />
          <TextField label="Street address" value={f.street} onChange={set('street')} error={touched && err.street} helperText={touched && err.street ? 'Enter the street address.' : 'Autocomplete suggests addresses on the live app'} />
          <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 1.5 }}>
            <TextField label="City" value={f.city} onChange={set('city')} error={touched && err.city} helperText={touched && err.city && 'Enter the city.'} />
            <TextField label="Postal code" value={f.postal} onChange={set('postal')} error={touched && err.postal} helperText={touched && err.postal && 'Format L5L 0A2'} inputProps={{ maxLength: 7 }} />
          </Box>
          <TextField label="Phone" type="tel" value={f.phone} onChange={set('phone')} error={touched && err.phone} helperText={touched && err.phone && 'Enter a 10-digit number.'} inputProps={{ inputMode: 'tel' }} />
        </Box>
      </Sheet>
    </Box>
  )
}
