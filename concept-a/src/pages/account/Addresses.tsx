import { useState } from 'react'
import {
  Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, IconButton, InputAdornment, MenuItem, Stack, TextField, Typography,
} from '@mui/material'
import AddRounded from '@mui/icons-material/AddRounded'
import CloseRounded from '@mui/icons-material/CloseRounded'
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded'
import PlaceOutlined from '@mui/icons-material/PlaceOutlined'
import SearchRounded from '@mui/icons-material/SearchRounded'
import StarOutlineRounded from '@mui/icons-material/StarOutlineRounded'
import { tokens } from '../../theme'
import { addresses as seed, type Address } from '../../data/account'
import { useApp } from '../../state/AppState'
import { EmptyState, Panel } from '../../components/ui'
import { AddressCard } from '../../components/Shared'
import { PanelSkeleton } from './parts/AccountParts'

const c = tokens.color
const blank: Address = { id: '', name: '', company: '', street: '', city: '', province: 'ON', postal: '', phone: '' }
const inArea = (city: string) => ['mississauga', 'toronto', 'brampton', 'oakville', 'hamilton', 'burlington', 'st. catharines', 'niagara falls', 'welland', 'vaughan', 'markham'].includes(city.trim().toLowerCase())

export default function Addresses() {
  const { review, toast } = useApp()
  const [list, setList] = useState<Address[]>(seed)
  const [edit, setEdit] = useState<Address | null>(null)
  const [del, setDel] = useState<Address | null>(null)
  const [touched, setTouched] = useState(false)
  const rows = review.empty ? [] : list

  const setDefault = (id: string, kind: 'defaultShipping' | 'defaultBilling') => {
    setList((l) => l.map((a) => ({ ...a, [kind]: a.id === id })))
    toast(kind === 'defaultShipping' ? 'Default delivery address updated' : 'Default billing address updated')
  }
  const save = () => {
    setTouched(true)
    if (!edit || !edit.name || !edit.street || !edit.city || !/^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/.test(edit.postal)) return
    const a = { ...edit, inArea: inArea(edit.city) }
    setList((l) => (a.id ? l.map((x) => (x.id === a.id ? a : x)) : [...l, { ...a, id: 'n' + Date.now() }]))
    toast(a.id ? 'Address saved' : 'Address added')
    if (!a.inArea) toast('This address is outside our delivery area — pickup only', 'warning')
    setEdit(null)
  }
  const f = (k: keyof Address) => ({
    value: (edit?.[k] as string) ?? '',
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEdit((x) => (x ? { ...x, [k]: e.target.value } : x)),
    fullWidth: true,
  })
  const postalErr = touched && !!edit && !/^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/.test(edit.postal)

  return (
    <Stack spacing={{ xs: 2, md: 3 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'flex-end' }} spacing={1.5}>
        <Box>
          <Typography variant="h2" component="h2">Address book</Typography>
          <Typography color="text.secondary">We deliver across the GTA, Hamilton &amp; Niagara. Other addresses can be used for pickup and billing.</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddRounded />} onClick={() => { setTouched(false); setEdit({ ...blank }) }} sx={{ flexShrink: 0 }}>Add address</Button>
      </Stack>

      {review.loading ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', xl: '1fr 1fr 1fr' }, gap: 2 }}>{[0, 1, 2].map((i) => <PanelSkeleton key={i} h={110} />)}</Box>
      ) : rows.length === 0 ? (
        <Panel><EmptyState icon={<PlaceOutlined />} title="No saved addresses" body="Save your kitchen, commissary or event venues once and pick them in one tap at checkout." action="Add your first address" onAction={() => setEdit({ ...blank })} /></Panel>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', xl: '1fr 1fr 1fr' }, gap: 2 }}>
          {rows.map((a) => (
            <Box key={a.id} sx={{ display: 'flex', flexDirection: 'column', border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.md}px`, overflow: 'hidden', bgcolor: '#fff' }}>
              <AddressCard address={a} onEdit={() => { setTouched(false); setEdit(a) }} sx={{ flex: 1, border: 0, borderRadius: 0 }} />
              <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap
                sx={{ borderTop: `1px solid ${c.line}`, px: 1, py: 0.5, bgcolor: c.bg }}>
                {!a.defaultShipping && a.inArea !== false && (
                  <Button size="small" startIcon={<StarOutlineRounded />} onClick={() => setDefault(a.id, 'defaultShipping')} sx={{ color: c.navy, minHeight: 40 }}>Default shipping</Button>
                )}
                {!a.defaultBilling && <Button size="small" onClick={() => setDefault(a.id, 'defaultBilling')} sx={{ color: c.navy, minHeight: 40 }}>Default billing</Button>}
                <Button size="small" startIcon={<DeleteOutlineRounded />} onClick={() => setDel(a)} disabled={a.defaultShipping || a.defaultBilling}
                  sx={{ color: c.red, ml: 'auto !important', minHeight: 40 }}>Delete</Button>
              </Stack>
            </Box>
          ))}
        </Box>
      )}

      <Dialog open={!!edit} onClose={() => setEdit(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700 }}>
          {edit?.id ? 'Edit address' : 'Add address'}
          <IconButton aria-label="Close" onClick={() => setEdit(null)}><CloseRounded /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField label="Find address" placeholder="Start typing a street address" helperText="Powered by Google Places autocomplete"
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchRounded /></InputAdornment> }} fullWidth />
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField label="Contact name" required error={touched && !edit?.name} helperText={touched && !edit?.name ? 'Enter a contact name' : ' '} {...f('name')} />
              <TextField label="Company" {...f('company')} helperText=" " />
            </Box>
            <TextField label="Street address" required error={touched && !edit?.street} helperText={touched && !edit?.street ? 'Enter a street address' : ' '} {...f('street')} />
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1.3fr 1fr 1fr' }, gap: 2 }}>
              <TextField label="City" required error={touched && !edit?.city} {...f('city')}
                helperText={edit?.city && !inArea(edit.city) ? 'Outside delivery area — pickup only' : ' '}
                FormHelperTextProps={{ sx: { color: edit?.city && !inArea(edit.city) ? c.warning : undefined, fontWeight: 600 } }} />
              <TextField select label="Province" {...f('province')} helperText=" ">
                {['ON', 'QC', 'BC', 'AB', 'MB'].map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
              </TextField>
              <TextField label="Postal code" required error={postalErr} helperText={postalErr ? 'Use format A1A 1A1' : ' '} {...f('postal')} />
            </Box>
            <TextField label="Phone" type="tel" {...f('phone')} />
            <Stack direction={{ xs: 'column', sm: 'row' }}>
              <FormControlLabel control={<Checkbox checked={!!edit?.defaultShipping} onChange={(e) => setEdit((x) => (x ? { ...x, defaultShipping: e.target.checked } : x))} />} label="Default shipping" />
              <FormControlLabel control={<Checkbox checked={!!edit?.defaultBilling} onChange={(e) => setEdit((x) => (x ? { ...x, defaultBilling: e.target.checked } : x))} />} label="Default billing" />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEdit(null)} sx={{ color: c.text2 }}>Cancel</Button>
          <Button variant="contained" onClick={save}>Save address</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!del} onClose={() => setDel(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete this address?</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">{del?.company} — {del?.street}, {del?.city}. This can’t be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDel(null)} sx={{ color: c.text2 }}>Keep it</Button>
          <Button variant="contained" onClick={() => { setList((l) => l.filter((x) => x.id !== del?.id)); setDel(null); toast('Address deleted', 'info') }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}
