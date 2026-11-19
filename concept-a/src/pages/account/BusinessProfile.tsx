import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import CheckRounded from '@mui/icons-material/CheckRounded'
import { tokens } from '../../theme'
import { Panel } from '../../components/ui'
import { PanelSkeleton } from './parts/AccountParts'
import { ChoiceGroup, GoogleTag } from './SignUpWizard'
import { countDetails, DETAIL_FIELDS, exclusive, isEmpty, isExclusive, isSingle, optionsOf, type FieldName, type Patch, type Profile, type Values } from '../../data/profile'
import { getProfile, saveProfile } from '../../data/profileClient'

const c = tokens.color
const isLink = (s: string) => { try { return /^https?:$/.test(new URL(s).protocol) } catch { return false } }
const choices = (list: string) => optionsOf(list).map((o) => ({ value: o.id, label: o.label }))

type Status = 'idle' | 'saving' | 'saved' | 'error'
type Others = Values['others']

/** Lists whose "Other" choice opens a text box, with the box's wording. */
const OTHER: Record<keyof Others, { id: string; label: string; placeholder: string }> = {
  cuisines: { id: 'cuisine.other', label: 'Your cuisine', placeholder: 'e.g. Ethiopian, Sri Lankan' },
  sells: { id: 'sells.other', label: 'What else do you sell?', placeholder: 'e.g. Momos, Poutine' },
  buysFrom: { id: 'buys.other', label: 'What else do you buy?', placeholder: 'e.g. Disposable gloves' },
}
const hasOther = (k: string): k is keyof Others => k in OTHER

/** "Personalize your picks": every detail optional, each saved on its own as the owner goes. */
export default function BusinessProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [failed, setFailed] = useState(false)
  const load = useCallback(() => getProfile().then(setProfile, () => setFailed(true)), [])
  useEffect(() => { load() }, [load])
  return (
    <Stack spacing={{ xs: 2, md: 3 }}>
      <Box>
        <Typography variant="h2" component="h2">Your business profile</Typography>
        <Typography color="text.secondary">Personalize your picks. Everything here is optional and saves as you go.</Typography>
      </Box>
      {failed ? (
        <Panel>
          <Typography sx={{ mb: 1.5 }}>We couldn’t load your business profile.</Typography>
          <Button variant="outlined" color="secondary" onClick={() => { setFailed(false); load() }}>Try again</Button>
        </Panel>
      ) : profile ? <Form initial={profile} /> : <><PanelSkeleton h={220} /><PanelSkeleton h={180} /></>}
    </Stack>
  )
}

function Form({ initial }: { initial: Profile }) {
  const [profile, setProfile] = useState(initial)
  const [status, setStatus] = useState<Status>('idle')
  const pending = useRef<Patch>({})
  const timer = useRef<number>()
  const busy = useRef(false)
  // Text inputs keep what's typed (spaces and all); the saved value is the trimmed version.
  const [dishes, setDishes] = useState(() => Array.from({ length: 5 }, (_, i) => initial.topDishes?.value[i] ?? ''))
  const [menuUrl, setMenuUrl] = useState(initial.menuUrl?.value ?? '')
  const [mustHave, setMustHave] = useState(initial.brandPrefs?.value.mustHave ?? '')
  const [others, setOthers] = useState<Others>(initial.others?.value ?? {})

  // Uses only refs and a state setter, so one instance serves every render and the unmount cleanup.
  const flush = useCallback(function flush() {
    if (busy.current) { timer.current = window.setTimeout(flush, 300); return } // one save at a time, so they land in order
    const patch = pending.current
    if (!Object.keys(patch).length) return
    pending.current = {}
    busy.current = true
    setStatus('saving')
    saveProfile(patch).then(
      () => setStatus(Object.keys(pending.current).length ? 'saving' : 'saved'),
      () => { pending.current = { ...patch, ...pending.current }; setStatus('error') }, // kept for Retry or the next change
    ).finally(() => { busy.current = false })
  }, [])
  useEffect(() => () => { window.clearTimeout(timer.current); flush() }, [flush]) // leaving the page saves what's waiting

  /** An owner edit or "Looks right": shown at once, saved after a short pause. An empty value removes the field. */
  const set = <K extends FieldName>(k: K, value: Values[K] | undefined) => {
    const empty = isEmpty(value)
    setProfile((p) => {
      const next = { ...p }
      if (empty) delete next[k]
      else next[k] = { value: value!, source: 'owner', confirmed: true, updatedAt: new Date().toISOString() } as Profile[K]
      return next
    })
    pending.current[k] = empty ? null : ({ value } as Patch[K])
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(flush, 600)
  }

  const fromGoogle = (k: FieldName) => profile[k]?.source === 'google'
  const looksRight = (k: FieldName, label: string) => fromGoogle(k) && (
    <Button size="small" variant="outlined" color="secondary" startIcon={<CheckRounded />} aria-label={`Looks right: ${label}`}
      onClick={() => set(k, profile[k]!.value)} sx={{ mt: 1.5 }}>Looks right</Button>
  )

  /** Typed text is kept as is on screen; the saved value is trimmed, and a blank box drops its key. */
  const setOther = (k: keyof Others, text: string) => {
    const next = { ...others, [k]: text }
    setOthers(next)
    set('others', Object.fromEntries(Object.entries(next).map(([key, t]) => [key, t?.trim() || undefined])))
  }

  /** An option field (pick-one when the catalog says so), with Google's values tagged until confirmed. */
  const options = (k: 'cuisines' | 'sells' | 'buysFrom' | 'serviceModes' | 'foodRules' | 'size' | 'meals' | 'priceLevel' | 'proteins' | 'equipment' | 'storage' | 'locations', label: string) => {
    const single = isSingle(k)
    const value = profile[k] ? [profile[k]!.value].flat() : []
    const ok = hasOther(k) ? k : undefined
    const other = ok && OTHER[ok]
    return (
      <Box>
        <ChoiceGroup id={`bp-${k}`} label={label} single={single} options={choices(k)} value={value} tagged={fromGoogle(k) ? value : undefined}
          onChange={(v) => {
            const next = single ? [v[0]] : exclusive(v, value, isExclusive(k))
            set(k, (single ? next[0] : next) as Values[typeof k])
            // Unticking "Other" drops what was typed for it.
            if (ok && other && !next.includes(other.id) && others[ok]) setOther(ok, '')
          }} />
        {ok && other && value.includes(other.id) && (
          <TextField id={`bp-${k}-other`} size="small" fullWidth label={other.label} placeholder={other.placeholder}
            value={others[ok] ?? ''} inputProps={{ maxLength: 100 }}
            helperText="Tell us in your own words, so we can suggest what you need."
            onChange={(e) => setOther(ok, e.target.value)} sx={{ mt: 1.5 }} />
        )}
        {looksRight(k, label)}
      </Box>
    )
  }

  const rhythm = profile.orderRhythm?.value ?? {}
  const rhythmGroup = (part: 'perWeek' | 'day' | 'method', label: string) => (
    <ChoiceGroup id={`bp-rhythm-${part}`} single label={label} options={choices(`orderRhythm.${part}`)} value={rhythm[part] ? [rhythm[part]!] : []}
      onChange={([v]) => set('orderRhythm', { ...rhythm, [part]: v })} />
  )
  const brands = profile.brandPrefs?.value ?? {}
  const urlBad = !!menuUrl.trim() && !isLink(menuUrl.trim())

  return (
    <>
      <Section title="Your menu">
        {options('cuisines', 'Cuisine')}
        {options('sells', 'What do you sell?')}
        <Box component="fieldset" sx={{ border: 0, m: 0, p: 0, minWidth: 0 }}>
          <Legend label="Top dishes" hint="Up to 5 best sellers, e.g. Butter chicken." />
          <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, mt: 1.5 }}>
            {dishes.map((d, i) => (
              <TextField key={i} size="small" label={`Dish ${i + 1}`} value={d} inputProps={{ maxLength: 40 }}
                onChange={(e) => {
                  const next = dishes.map((x, j) => (j === i ? e.target.value : x))
                  setDishes(next)
                  set('topDishes', next.map((x) => x.trim()).filter(Boolean))
                }} />
            ))}
          </Box>
        </Box>
        <Box>
          <TextField size="small" fullWidth type="url" label="Menu link (optional)" placeholder="https://" value={menuUrl} inputProps={{ maxLength: 500 }}
            error={urlBad}
            helperText={urlBad ? 'Enter a link starting with http:// or https://' : fromGoogle('menuUrl') ? <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}><GoogleTag /> Your website on Google</Box> : ' '}
            onChange={(e) => {
              setMenuUrl(e.target.value)
              const t = e.target.value.trim()
              if (!t || isLink(t)) set('menuUrl', t)
            }} />
          {looksRight('menuUrl', 'Menu link')}
        </Box>
      </Section>

      <Section title="How you run">
        {options('serviceModes', 'How do you serve?')}
        {options('meals', 'Meals')}
        {options('size', 'Customers a day')}
        {options('locations', 'Locations')}
        {options('priceLevel', 'Price level')}
      </Section>

      <Section title="Your kitchen">
        {options('proteins', 'Proteins you cook')}
        {options('equipment', 'Equipment')}
        {options('storage', 'Cold storage')}
      </Section>

      <Section title="How you order">
        {rhythmGroup('perWeek', 'Orders a week')}
        {rhythmGroup('day', 'Preferred order day')}
        {rhythmGroup('method', 'Delivery or pickup')}
        {options('buysFrom', 'What do you buy from us?')}
        <TextField size="small" fullWidth multiline minRows={2} label="Must-have brands (optional)" placeholder="e.g. Amul butter, Kohinoor rice"
          value={mustHave} inputProps={{ maxLength: 200 }} helperText={`${mustHave.length}/200`}
          onChange={(e) => { setMustHave(e.target.value); set('brandPrefs', { ...brands, mustHave: e.target.value.trim() || undefined }) }} />
        <ChoiceGroup id="bp-value-brands" single label="Open to value brands?" options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
          value={brands.openToValue === undefined ? [] : [brands.openToValue ? 'yes' : 'no']}
          onChange={([v]) => set('brandPrefs', { ...brands, openToValue: v === 'yes' })} />
      </Section>

      <Section title="Food rules">
        {options('foodRules', 'Food rules')}
      </Section>

      {/* Sticks to the bottom while scrolling, so the save status is visible next to whatever was just changed. */}
      <Box sx={{
        // On phones it sits above the two floating support buttons, like the toasts do.
        position: 'sticky', bottom: { xs: 'calc(var(--nav-h, 0px) + 88px)', md: 24 }, zIndex: 2, alignSelf: 'center', display: 'flex', flexWrap: 'wrap', alignItems: 'center',
        columnGap: 1.5, rowGap: 0.5, px: 2, py: 1, bgcolor: '#fff', border: `1px solid ${c.line}`, borderRadius: 999, boxShadow: tokens.shadow.pop, fontSize: 14,
      }}>
        <Box component="span" sx={{ fontWeight: 600 }}>{countDetails(profile)} of {DETAIL_FIELDS.length} details added</Box>
        <Box component="span" role="status" sx={{ color: status === 'error' ? c.error : c.text2 }}>
          {{ idle: '', saving: 'Saving…', saved: 'Saved', error: 'Couldn’t save' }[status]}
        </Box>
        {status === 'error' && <Button size="small" onClick={flush} sx={{ minHeight: 32 }}>Retry</Button>}
      </Box>
    </>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Panel>
      <Typography variant="h3" component="h3" sx={{ mb: 2.5 }}>{title}</Typography>
      <Stack spacing={3.5}>{children}</Stack>
    </Panel>
  )
}

/** Same legend style as ChoiceGroup, for the text-input groups. */
function Legend({ label, hint }: { label: string; hint: string }) {
  return (
    <>
      <Box component="legend" sx={{ p: 0, fontWeight: 600, fontSize: 15, lineHeight: '22px', color: c.ink }}>
        {label}<Box component="span" sx={{ fontWeight: 400, color: c.text2 }}> (optional)</Box>
      </Box>
      <Typography sx={{ pt: '4px', fontSize: 13, lineHeight: '20px', color: c.text2 }}>{hint}</Typography>
    </>
  )
}
