import { Fragment, useEffect, useRef, useState, type ReactElement, type ReactNode } from 'react'
import { Alert, Box, Button, ButtonBase, CircularProgress, Link, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { alpha, keyframes } from '@mui/material/styles'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded'
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded'
import CheckRounded from '@mui/icons-material/CheckRounded'
import MoreHorizRounded from '@mui/icons-material/MoreHorizRounded'
import RestaurantOutlined from '@mui/icons-material/RestaurantOutlined'
import LocalCafeOutlined from '@mui/icons-material/LocalCafeOutlined'
import RoomServiceOutlined from '@mui/icons-material/RoomServiceOutlined'
import BakeryDiningOutlined from '@mui/icons-material/BakeryDiningOutlined'
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined'
import DeliveryDiningOutlined from '@mui/icons-material/DeliveryDiningOutlined'
import CelebrationOutlined from '@mui/icons-material/CelebrationOutlined'
import VolunteerActivismOutlined from '@mui/icons-material/VolunteerActivismOutlined'
import { tokens } from '../../theme'
import { departments } from '../../data/catalog'
import { deptIcons } from '../../components/DeptIcons'
import { useApp } from '../../state/AppState'
import type { PlaceHit } from '../../data/places'
import { exclusive, googleIds, idOf, isExclusive, labelOf, optionsOf, type Draft, type Values } from '../../data/profile'
import { getDraft, saveProfile } from '../../data/profileClient'
import AuthShell from './AuthShell'
import OrgFinder, { PrototypePanel } from './OrgFinder'
import { PasswordField, passwordScore } from './SignIn'

const c = tokens.color

// Business type → its icon and specialties (the sub-categories the account is filed under, saved as "Type - Specialty").
const businessTypes = [
  { name: 'Restaurant', Icon: RestaurantOutlined, subs: ['Quick service', 'Casual dining', 'Fine dining', 'Pizzeria', 'Buffet', 'Takeout & delivery'] },
  { name: 'Café', Icon: LocalCafeOutlined, subs: ['Coffee shop', 'Bubble tea', 'Juice bar', 'Dessert'] },
  { name: 'Caterer', Icon: RoomServiceOutlined, subs: ['Corporate', 'Weddings & events', 'Institutional'] },
  { name: 'Bakery', Icon: BakeryDiningOutlined, subs: ['Retail bakery', 'Wholesale bakery', 'Pastry shop'] },
  { name: 'Food truck', Icon: LocalShippingOutlined, subs: ['Street food', 'Desserts', 'Beverages'] },
  { name: 'Ghost kitchen', Icon: DeliveryDiningOutlined, subs: ['Single brand', 'Multi-brand'] },
  { name: 'Hotel & events', Icon: CelebrationOutlined, subs: ['Hotel', 'Banquet hall', 'Bar & pub'] },
  { name: 'Non-profit', Icon: VolunteerActivismOutlined, subs: ['Community kitchen', 'School', 'Shelter', 'Place of worship'] },
]
// Labels come from the profile catalog (src/data/profileOptions.json) so every answer maps to a stable option id; ChoiceGroup adds "Other" itself.
const labels = (list: string) => optionsOf(list).filter((o) => !o.id.endsWith('.other')).map((o) => o.label)
const cuisines = labels('cuisines')
const sellOptions = labels('sells')
const serveOptions = labels('serviceModes')
const ruleOptions = labels('foodRules')
const sizeOptions = labels('size')
const structures = ['Sole proprietorship', 'Partnership', 'Corporation', 'Franchise', 'Non-profit']
const titles = ['Mr', 'Mrs', 'Ms', 'Mx', 'Dr']

// Wizard group → profile list. Google pre-fills only lists that are still empty; specialties are never picked for the user.
const googleGroups = { types: 'businessKind', cuisine: 'cuisines', sells: 'sells', serve: 'serviceModes', rules: 'foodRules' } as const
type GoogleGroup = keyof typeof googleGroups

// Only the business name, its type, the tax ID and the login are required (as on the live form); the Menu step can be skipped.
const steps = [
  { name: 'Business', title: 'Tell us about your business', fields: ['business', 'types', 'types-other', 'subs-other'] },
  { name: 'Menu', title: 'What’s on your menu?', fields: ['cuisine-other', 'sells-other', 'buys-other'] },
  { name: 'Details', title: 'Business details', fields: ['hst', 'structure-other'] },
  { name: 'Login', title: 'Create your login', fields: ['first', 'last', 'email', 'pw', 'pw2'] },
]

type OtherKey = 'types' | 'subs' | 'cuisine' | 'sells' | 'buys' | 'structure'
const blank = {
  business: '', types: [] as string[], subs: [] as string[], cuisine: [] as string[], sells: [] as string[], buys: [] as string[],
  serve: [] as string[], rules: [] as string[], size: '',
  structure: '', phone: '', hst: '', mFirst: '', mLast: '', title: '', first: '', last: '', mobile: '',
  other: { types: '', subs: '', cuisine: '', sells: '', buys: '', structure: '' } as Record<OtherKey, string>,
}
type Option = { value: string; label: string; group?: string; icon?: ReactElement }
const opts = (xs: string[]): Option[] => xs.map((x) => ({ value: x, label: x }))

const enter = keyframes`from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; }`
const pop = keyframes`from { transform: scale(.4); } to { transform: scale(1); }`
const roll = keyframes`from { opacity: 0; transform: translateY(var(--from)); } to { opacity: 1; transform: none; }`
const srOnly = { position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' } as const
const focusRing = { '&.Mui-focusVisible': { outline: `3px solid ${alpha(c.navy, 0.45)}`, outlineOffset: 2 } }
const two = { display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }

/** Checkbox (multi) or radio (single) mark, so every list says up front how many you can pick. */
function Mark({ on, round }: { on: boolean; round?: boolean }) {
  return (
    <Box component="span" aria-hidden sx={{
      width: 18, height: 18, flexShrink: 0, display: 'grid', placeItems: 'center', borderRadius: round ? '50%' : '5px',
      border: `1.5px solid ${on ? c.navy : c.line2}`, bgcolor: on && !round ? c.navy : '#fff', transition: 'background-color .15s, border-color .15s',
    }}>
      {on && (round
        ? <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: c.navy, animation: `${pop} .18s ease-out` }} />
        : <CheckRounded sx={{ fontSize: 14, color: '#fff', animation: `${pop} .18s ease-out` }} />)}
    </Box>
  )
}

// Chip = a <label> around a real checkbox/radio, drawn with appearance:none so keyboard and screen readers get the native control.
const svg = (body: string) => `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 13 13'>${body}</svg>`)}")`
const ease = 'background-color 150ms ease-out, border-color 150ms ease-out'
const tick = svg(`<path d='M3.25 6.75 5.5 9 9.75 4.25' fill='none' stroke='#000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/>`)
// Selecting is slower than unselecting; the tick starts drawing once the box has begun to fill.
const grow = (on: boolean, ms = 280, delay = 0) => (on ? `clip-path ${ms}ms cubic-bezier(.2,.7,.2,1) ${delay}ms` : `clip-path ${Math.round(ms * 0.6)}ms ease-in`)
const chipSx = (on: boolean) => ({
  position: 'relative', isolation: 'isolate', overflow: 'hidden',
  '--x': '20px', '--y': '50%', // animation origin: the checkbox, unless the chip was pressed somewhere else (see pressOrigin)
  display: 'inline-flex', alignItems: 'center', gap: 1, minHeight: 40, py: '6px', pl: '12px', pr: '14px',
  borderRadius: `${tokens.radius.xs}px`, border: '1px solid', borderColor: on ? c.navy : c.line, bgcolor: c.surface,
  color: c.ink, fontSize: 14, lineHeight: '20px', fontWeight: 500, letterSpacing: '-0.005em', cursor: 'pointer', userSelect: 'none', transition: ease,
  '&:hover': on ? {} : { borderColor: c.text3, bgcolor: c.bg },
  // The selected tint is a circle centred on the origin that scales out from it and back into it.
  // Only transform animates, so moving the origin is instant. 640px covers any chip from any point.
  '&::before': {
    content: '""', position: 'absolute', left: 'var(--x)', top: 'var(--y)', width: 640, height: 640, ml: '-320px', mt: '-320px', borderRadius: '50%',
    zIndex: -1, bgcolor: alpha(c.navy, 0.06), transform: `scale(${on ? 1 : 0})`,
    transition: `${on ? 'transform 380ms cubic-bezier(.2,.7,.2,1)' : 'transform 220ms ease-in'}, background-color 150ms ease-out`,
  },
  '&:hover::before': on ? { bgcolor: alpha(c.navy, 0.1) } : {},
  '&:has(input:focus-visible)': { outline: `2px solid ${c.navy}`, outlineOffset: '2px' },
  '@supports selector(:has(*))': { '& input:focus-visible': { outline: 'none' } }, // the ring moves to the chip only where :has works
  '@media (pointer: coarse)': { minHeight: 44 },
  '& input': {
    appearance: 'none', m: 0, flexShrink: 0, width: 16, height: 16, cursor: 'inherit', transition: ease,
    display: 'grid', placeContent: 'center', border: `1.5px solid ${on ? c.navy : c.text3}`, borderRadius: '4px', bgcolor: c.surface,
  },
  '& input::before': { content: '""' },
  '& input[type=checkbox]:checked': { bgcolor: c.navy },
  // The tick draws left to right, short stroke first.
  '& input[type=checkbox]::before': {
    width: 13, height: 13, bgcolor: '#fff', WebkitMask: `${tick} center / contain no-repeat`, mask: `${tick} center / contain no-repeat`,
    clipPath: on ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)', transition: grow(on, 200, 60),
  },
  '& input[type=radio]': { borderRadius: '50%' },
  '& input[type=radio]::before': { width: 7, height: 7, borderRadius: '50%', bgcolor: c.navy, clipPath: `circle(${on ? '50%' : '0px'})`, transition: grow(on, 200) },
  '@media (prefers-reduced-motion: reduce)': { '&, &::before, & input, & input::before': { transitionDuration: '1ms', transitionDelay: '0ms' } },
})
// Pointer presses move the origin to the press point; leaving the chip puts it back on the checkbox for keyboard use.
const pressOrigin = (e: React.PointerEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`)
}
const resetOrigin = (e: React.FocusEvent<HTMLElement>) => { e.currentTarget.style.removeProperty('--x'); e.currentTarget.style.removeProperty('--y') }

type Other = { text: string; onText: (v: string) => void; label: string; placeholder: string; error?: string }

/** Marks a choice Google filled in, until the owner touches it. */
export function GoogleTag() {
  return (
    <Box component="span" sx={{ flexShrink: 0, px: 0.75, borderRadius: 999, bgcolor: c.surface2, color: c.text2, fontSize: 11, fontWeight: 600, lineHeight: '18px', whiteSpace: 'nowrap' }}>
      From Google
    </Box>
  )
}

/**
 * A set of toggles: icon tiles (`tiles`) or wrapping chips; `single` makes it pick-one.
 * `other` adds an "Other" choice that opens a short text field for anything the list doesn't cover.
 * `tagged` values show "From Google" while selected.
 */
export function ChoiceGroup({ id, label, hint, error, required, options, value, onChange, single, tiles, other, tagged }: {
  id: string; label: string; hint?: string; error?: string; required?: boolean
  options: Option[]; value: string[]; onChange: (v: string[]) => void; single?: boolean; tiles?: boolean; other?: Other; tagged?: string[]
}) {
  const all: Option[] = other ? [...options, { value: 'Other', label: 'Other', icon: tiles ? <MoreHorizRounded /> : undefined }] : options
  const toggle = (v: string) => onChange(single ? [v] : value.includes(v) ? value.filter((x) => x !== v) : [...value, v])
  const help = hint ?? (single ? 'Choose one.' : 'Select all that apply.')
  const describedBy = [`${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ')
  const ref = useRef<HTMLFieldSetElement>(null)
  const clear = () => { onChange([]); ref.current?.querySelector<HTMLElement>('input, [aria-pressed]')?.focus() }
  // Which way the count moved, so the new number rolls in from that side (up when you add, down when you remove).
  const n = value.length
  const [prevN, setPrevN] = useState(n)
  const [rollFrom, setRollFrom] = useState<1 | -1>(1)
  const [shown, setShown] = useState(n || 1) // keeps the last count on screen while the summary fades out after Clear
  if (n !== prevN) { setPrevN(n); setRollFrom(n > prevN ? 1 : -1); if (n) setShown(n) } // React's "adjust state on prop change" pattern
  return (
    <Box component="fieldset" ref={ref} id={id} aria-describedby={describedBy} sx={{ border: 0, m: 0, p: 0, minWidth: 0 }}>
      {/* Floated so the count shares its line; a floated legend still names the fieldset. */}
      <Box component="legend" sx={{ float: 'left', p: 0, mr: 1, fontWeight: 600, fontSize: 15, lineHeight: '22px', color: c.ink }}>
        {label}{required ? ' *' : <Box component="span" sx={{ fontWeight: 400, color: c.text2 }}> (optional)</Box>}
      </Box>
      {!single && (
        <Box sx={{ float: 'right', fontSize: 13, lineHeight: '22px', color: c.text2 }}>
          {/* Screen readers get the plain count; the animated copy below is visual only. */}
          <Box component="span" aria-live="polite" sx={srOnly}>{n ? `${n} selected` : ''}</Box>
          {/* Origin-aware: the summary grows out of its right edge (where the count sits) on the first pick and shrinks back
              into it on Clear; each later change rolls the digit in from the direction the count moved. */}
          <Box component="span" aria-hidden={!n} sx={{
            display: 'inline-flex', alignItems: 'baseline', gap: '4px', transformOrigin: 'right center',
            opacity: n ? 1 : 0, transform: n ? 'none' : 'translateX(6px) scale(.92)', visibility: n ? 'visible' : 'hidden',
            transition: n ? 'opacity .22s ease-out, transform .32s cubic-bezier(.2,.7,.2,1), visibility 0s'
              : 'opacity .16s ease-in, transform .16s ease-in, visibility 0s linear .16s',
            '@media (prefers-reduced-motion: reduce)': { transition: 'none', '& *': { animation: 'none !important' } },
          }}>
            <Box component="span" aria-hidden sx={{ display: 'inline-flex', alignItems: 'baseline', fontVariantNumeric: 'tabular-nums' }}>
              <Box component="span" sx={{ display: 'inline-block', overflow: 'hidden', height: '22px', verticalAlign: 'bottom' }}>
                <Box component="span" key={n} sx={{ display: 'inline-block', animation: n ? `${roll} .26s cubic-bezier(.2,.7,.2,1)` : 'none', '--from': `${rollFrom * 100}%` }}>{n || shown}</Box>
              </Box>
              &nbsp;selected
            </Box>
            <span aria-hidden>·</span>
            <Link component="button" type="button" onClick={clear} tabIndex={n ? 0 : -1} sx={{ fontSize: 13, fontWeight: 600, color: c.navy, verticalAlign: 'baseline' }}>Clear</Link>
          </Box>
        </Box>
      )}
      <Typography id={`${id}-hint`} sx={{ clear: 'both', pt: '4px', fontSize: 13, lineHeight: '20px', color: c.text2 }}>{help}</Typography>
      <Box sx={tiles ? { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 1, mt: 1.5 } : { display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
        {all.map((o, i) => {
          const on = value.includes(o.value)
          const a11y = single ? { role: 'radio', 'aria-checked': on } : { 'aria-pressed': on }
          return (
            <Fragment key={o.value}>
              {o.group && o.group !== all[i - 1]?.group && (
                <Typography sx={{ flexBasis: '100%', gridColumn: '1 / -1', fontSize: 13, fontWeight: 600, color: c.text2, mt: i ? 1 : 0 }}>{o.group}</Typography>
              )}
              {tiles ? (
                <ButtonBase {...a11y} onClick={() => toggle(o.value)} sx={{
                  position: 'relative', justifyContent: 'flex-start', gap: 1.25, minHeight: 60, px: 1.5, py: 1.25, pr: 5, textAlign: 'left',
                  gridColumn: i === all.length - 1 && all.length % 2 ? '1 / -1' : undefined, // odd count: last tile takes the full row
                  borderRadius: `${tokens.radius.md}px`, border: `1.5px solid ${on ? c.navy : c.line2}`, bgcolor: on ? c.navyTint : c.surface,
                  transition: 'background-color .15s, border-color .15s', '&:hover': { borderColor: on ? c.navy : c.text3 }, ...focusRing,
                }}>
                  <Box component="span" sx={{ display: 'flex', color: on ? c.navy : c.text2, '& svg': { fontSize: 22 } }}>{o.icon}</Box>
                  <Box component="span" sx={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3, color: on ? c.navy : c.ink }}>
                    {o.label}{on && tagged?.includes(o.value) && <Box component="span" sx={{ display: 'block', mt: 0.5 }}><GoogleTag /></Box>}
                  </Box>
                  <Box component="span" sx={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex' }}><Mark on={on} round={single} /></Box>
                </ButtonBase>
              ) : (
                <Box component="label" sx={chipSx(on)} onPointerDown={pressOrigin} onBlur={resetOrigin}>
                  <input type={single ? 'radio' : 'checkbox'} name={id} value={o.value} checked={on} onChange={() => toggle(o.value)} />
                  {o.icon && <Box component="span" aria-hidden sx={{ display: 'flex', color: c.text3, '& svg': { fontSize: 18 } }}>{o.icon}</Box>}
                  {o.label}
                  {on && tagged?.includes(o.value) && <GoogleTag />}
                </Box>
              )}
            </Fragment>
          )
        })}
      </Box>
      {other && value.includes('Other') && (
        <TextField id={`${id}-other`} size="small" fullWidth autoFocus label={other.label} placeholder={other.placeholder}
          value={other.text} onChange={(e) => other.onText(e.target.value)} error={!!other.error} helperText={other.error}
          inputProps={{ maxLength: 60 }} sx={{ mt: 1.5, animation: `${enter} .2s ease-out`, '@media (prefers-reduced-motion: reduce)': { animation: 'none' } }} />
      )}
      {error && <Typography id={`${id}-error`} sx={{ fontSize: 12, color: c.error, mt: 1 }}>{error}</Typography>}
    </Box>
  )
}

const shell = (children: ReactNode) => <AuthShell signup panelTitle="Everything your kitchen needs, in one place.">{children}</AuthShell>

/** New sign-up flow at /review/signup: four short steps instead of one long form. The original stays at /account/signin. */
export default function SignUpWizard() {
  const nav = useNavigate()
  const { setReview, toast } = useApp()
  const onExit = () => nav('/account/signin')
  const [email, setEmail] = useState('')
  const [step, setStep] = useState(0)
  const [f, setF] = useState(blank)
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [place, setPlace] = useState<PlaceHit | null>(null)
  const [draft, setDraft] = useState<Draft | null>(null) // Google's pre-fill for the picked place
  const [tags, setTags] = useState<Partial<Record<GoogleGroup, string[]>>>({}) // pre-ticked values still untouched
  const [filled, setFilled] = useState<GoogleGroup[]>([]) // groups Google filled, for the "We filled in…" line
  const latest = useRef(f)
  const draftReq = useRef<AbortController>()
  const [tried, setTried] = useState(false)
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState<Record<string, unknown> | null>(null)
  const [formKey, setFormKey] = useState(0)
  const heading = useRef<HTMLHeadingElement>(null)

  useEffect(() => { latest.current = f })
  const put = (patch: Partial<typeof blank>) => setF((s) => ({ ...s, ...patch }))
  // Touching a choice (either way) drops its "From Google" tag.
  const untag = (k: GoogleGroup, next: string[]) => setTags((t) => ({ ...t, [k]: t[k]?.filter((v) => next.includes(v) === f[k].includes(v)) }))
  const pick = (k: GoogleGroup | 'buys') => ({
    value: f[k], tagged: k === 'buys' ? undefined : tags[k],
    onChange: (v: string[]) => { if (k !== 'buys') untag(k, v); put({ [k]: v }) },
  })
  const field = (k: 'phone' | 'hst' | 'mFirst' | 'mLast' | 'title' | 'first' | 'last' | 'mobile') =>
    ({ value: f[k], onChange: (e: React.ChangeEvent<HTMLInputElement>) => put({ [k]: e.target.value }) })

  const picked = (k: OtherKey) => (k === 'structure' ? f.structure === 'Other' : f[k].includes('Other'))
  const otherMissing = (k: OtherKey) => picked(k) && !f.other[k].trim() && 'Tell us in a few words, or unselect Other'
  const otherOf = (k: OtherKey, label: string, placeholder: string): Other => ({
    text: f.other[k], label, placeholder, error: err(`${k}-other`),
    onText: (v) => setF((s) => ({ ...s, other: { ...s.other, [k]: v } })),
  })
  // Saved as "Other: <their words>" so the account team can file it.
  const withOther = (k: OtherKey, v: string) => (v === 'Other' && f.other[k].trim() ? `Other: ${f.other[k].trim()}` : v)
  const menuEmpty = !f.cuisine.length && !f.sells.length && !f.buys.length && !f.serve.length && !f.rules.length && !f.size

  const problems: Record<string, string | false> = {
    business: !f.business.trim() && 'Required — as it appears on invoices',
    types: !f.types.length && 'Choose at least one, or pick Other',
    'types-other': otherMissing('types'), 'subs-other': otherMissing('subs'),
    'cuisine-other': otherMissing('cuisine'), 'sells-other': otherMissing('sells'), 'buys-other': otherMissing('buys'),
    hst: !f.hst.trim() && 'Tax ID is required',
    'structure-other': otherMissing('structure'),
    first:!f.first.trim() && 'Required',
    last: !f.last.trim() && 'Required',
    email: !/^\S+@\S+\.\S+$/.test(email) && 'Enter a valid email',
    pw: passwordScore(pw) < 2 && '8+ characters with a number and a capital letter',
    pw2: pw !== pw2 && 'Passwords don’t match',
  }
  const err = (k: string) => (tried && problems[k]) || undefined

  const go = (i: number) => {
    setStep(i)
    setTried(false)
    requestAnimationFrame(() => heading.current?.focus()) // announce the new step and bring it into view
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const bad = steps[step].fields.find((k) => problems[k])
    if (bad) {
      setTried(true)
      const el = document.getElementById(`su-${bad}`)
      ;(el instanceof HTMLInputElement ? el : el?.querySelector<HTMLElement>('input, button'))?.focus()
      return
    }
    if (step < steps.length - 1) return go(step + 1)
    setBusy(true)
    window.setTimeout(() => {
      setBusy(false)
      toast(`Welcome to MySupreme, ${f.business}!`)
      setSent({
        email, password: '•'.repeat(pw.length), ...f, other: undefined,
        ...Object.fromEntries((['types', 'subs', 'cuisine', 'sells', 'buys'] as const).map((k) => [k, f[k].map((v) => withOther(k, v))])),
        structure: withOther('structure', f.structure),
        google_place_id: place?.id ?? '', place_address: place?.address ?? '',
      })
      saveProfile(profileFromAnswers()).catch(() =>
        toast('We couldn’t save your business details. You can add them any time in Your business profile.', 'warning'))
    }, 700)
  }

  /**
   * The Business and Menu answers as one profile PUT. What the owner saw and submitted is theirs ('owner');
   * Google values with no signup field (meals, price, hours, website) wait for the owner's OK in Personalize.
   */
  const profileFromAnswers = () => {
    const ids = (list: string, picked: string[]) => ({ value: picked.flatMap((l) => idOf(list, l) ?? []) })
    const google = <K extends keyof Values>(v?: Values[K]) => (v === undefined ? undefined : { value: v, source: 'google' as const })
    const g = draft?.fields ?? {}
    return {
      identity: { value: { name: f.business.trim(), address: place?.address, phone: f.phone.trim() || undefined, website: g.identity?.website, placeId: place?.id } },
      businessKind: ids('businessKind', f.types), cuisines: ids('cuisines', f.cuisine), sells: ids('sells', f.sells), buysFrom: ids('buysFrom', f.buys),
      serviceModes: ids('serviceModes', f.serve), foodRules: ids('foodRules', f.rules), size: { value: idOf('size', f.size) ?? '' },
      meals: google<'meals'>(g.meals), priceLevel: google<'priceLevel'>(g.priceLevel), openingHours: google<'openingHours'>(g.openingHours), menuUrl: google<'menuUrl'>(g.menuUrl),
      suggestedByGoogle: draft ? googleIds(draft) : undefined,
    }
  }

  // One server-side Place Details call per pick. It only fills what's still empty, and a failed or non-food lookup leaves the form as it is.
  const pickPlace = (p: PlaceHit | null, sessionToken?: string) => {
    setPlace(p)
    draftReq.current?.abort()
    setDraft(null); setFilled([]); setTags({})
    if (!p) return
    const ac = (draftReq.current = new AbortController())
    getDraft(p.id, sessionToken, ac.signal).then((d) => {
      if (!d.isFoodPlace) return
      const s = latest.current
      const fill = (Object.keys(googleGroups) as GoogleGroup[]).flatMap((k) => {
        const v = (d.fields[googleGroups[k]] ?? []).flatMap((id) => labelOf(googleGroups[k], id) ?? [])
        return !s[k].length && v.length ? [[k, v] as const] : []
      })
      const values = Object.fromEntries(fill)
      put({ ...values, phone: s.phone || d.fields.identity?.phone || '' })
      setDraft(d); setTags(values); setFilled(fill.map(([k]) => k))
    }, () => {})
  }

  const reset = () => {
    setF(blank); setEmail(''); setPw(''); setPw2(''); setPlace(null); setSent(null); setTried(false); setStep(0)
    setDraft(null); setTags({}); setFilled([])
    setFormKey((k) => k + 1)
  }

  const googleNote = (k: GoogleGroup) => {
    const first = filled.find((g) => (step === 0 ? g === 'types' : g !== 'types'))
    return first === k && (
      <Typography role="status" sx={{ mb: 1.5, fontSize: 14, color: c.text2 }}>
        We filled in what Google knows about {draft?.fields.identity?.name ?? place?.name}. Fix anything that’s wrong.
      </Typography>
    )
  }

  if (sent) {
    return shell(
      <Box sx={{ animation: `${enter} .32s ease-out` }}>
        <Typography variant="h1" sx={{ fontSize: { xs: 24, md: 28 }, mb: 2 }}>Account created</Typography>
        <Alert severity="success" sx={{ borderRadius: `${tokens.radius.sm}px` }}>A verification email has been sent to your registered email address ({email}).</Alert>
        <Box component="details" sx={{ mt: 2, border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.sm}px`, '& > summary': { cursor: 'pointer', fontWeight: 600, fontSize: 14, p: 1.5 } }}>
          <summary>Payload preview</summary>
          <Box component="pre" sx={{ m: 0, px: 1.5, pb: 1.5, fontFamily: tokens.font.mono, fontSize: 12, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{JSON.stringify(sent, null, 2)}</Box>
        </Box>
        <Button fullWidth variant="contained" size="large" sx={{ mt: 2 }} onClick={() => { setReview({ signedIn: true }); nav('/account') }}>Continue to my account</Button>
        <PrototypePanel onReset={reset} />
      </Box>
    )
  }

  const subOptions = businessTypes.filter((t) => f.types.includes(t.name)).flatMap((t) => t.subs.map((s) => ({ value: `${t.name} - ${s}`, label: s, group: t.name })))
  const bodies: ReactNode[] = [
    <>Find your place on Google Maps and we’ll fill in what we can. Already have an account? <Link component="button" type="button" onClick={onExit} sx={{ color: c.navy, fontWeight: 600, verticalAlign: 'baseline' }}>Sign in</Link></>,
    <>Optional. It helps us show you the right products first. <Link component="button" type="button" onClick={() => go(2)} sx={{ color: c.navy, fontWeight: 600, verticalAlign: 'baseline' }}>Skip this step</Link></>,
    'These appear on your invoices. Only the tax ID is required.',
    'You’ll sign in with this email and password.',
  ]

  return shell(
    <Box component="form" onSubmit={submit} noValidate>

      <Box component="ol" aria-label="Sign-up steps" sx={{ listStyle: 'none', m: 0, mb: 3, p: 0, display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 0.75 }}>
        {steps.map((s, i) => {
          const done = i < step
          const now = i === step
          const skipped = done && i === 1 && menuEmpty
          const inner = (
            <>
              <Box sx={{ height: 4, borderRadius: 2, bgcolor: now ? c.red : skipped ? c.line2 : done ? c.navy : c.line, transition: 'background-color .3s' }} />
              <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
                {done && !skipped && <CheckRounded sx={{ fontSize: 15, color: c.navy, display: { xs: 'none', sm: 'block' } }} />}
                <Box component="span" sx={{ fontSize: 13, fontWeight: now ? 700 : 500, color: now ? c.ink : done ? c.navy : c.text3 }}>{s.name}</Box>
              </Stack>
              {skipped && <Box component="span" sx={{ display: 'block', fontSize: 12, color: c.text2 }}>Skipped</Box>}
            </>
          )
          return (
            <li key={s.name} aria-current={now ? 'step' : undefined}>
              {done
                ? <ButtonBase onClick={() => go(i)} sx={{ display: 'block', width: '100%', textAlign: 'left', py: 0.5, borderRadius: 1, ...focusRing }}>{inner}</ButtonBase>
                : <Box sx={{ py: 0.5 }}>{inner}</Box>}
            </li>
          )
        })}
      </Box>

      <Box key={step} sx={{ animation: `${enter} .32s cubic-bezier(.2,.7,.2,1)`, '@media (prefers-reduced-motion: reduce)': { animation: 'none' } }}>
        <Box sx={{ mb: 3 }}>
          <Typography ref={heading} tabIndex={-1} variant="h1" sx={{ fontSize: { xs: 24, md: 28 }, outline: 'none' }}>{steps[step].title}</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>{bodies[step]}</Typography>
        </Box>

        {step === 0 && (
          <Stack spacing={3.5}>
            <Box id="su-business">
              <OrgFinder key={formKey} value={f.business} onChange={(v) => put({ business: v })} place={place} onPick={pickPlace} errorText={err('business')} />
            </Box>
            <Box>
              {googleNote('types')}
              <ChoiceGroup id="su-types" tiles required label="What kind of business is it?"
                options={businessTypes.map((t) => ({ value: t.name, label: t.name, icon: <t.Icon /> }))} value={f.types} error={err('types')} tagged={tags.types}
                other={otherOf('types', 'Your type of business', 'e.g. Butcher shop, grocery store')}
                // Specialties follow their type; their "Other" stays while any listed type is still picked.
                onChange={(types) => { untag('types', types); put({ types, subs: f.subs.filter((s) => (s === 'Other' ? types.some((t) => t !== 'Other') : types.some((t) => s.startsWith(`${t} - `)))) }) }} />
            </Box>
            {subOptions.length > 0 && (
              <ChoiceGroup id="su-subs" label="What best describes it?" options={subOptions} value={f.subs} onChange={(subs) => put({ subs })}
                other={otherOf('subs', 'Describe it', 'e.g. Food court stall')} />
            )}
          </Stack>
        )}

        {step === 1 && (
          <Stack spacing={3.5}>
            <Box>
              {googleNote('cuisine')}
              <ChoiceGroup id="su-cuisine" label="Cuisine" options={opts(cuisines)} {...pick('cuisine')}
                other={otherOf('cuisine', 'Your cuisine', 'e.g. Ethiopian')} />
            </Box>
            <Box>
              {googleNote('sells')}
              <ChoiceGroup id="su-sells" label="What do you sell?" options={opts(sellOptions)} {...pick('sells')}
                other={otherOf('sells', 'What else do you sell?', 'e.g. Poutine')} />
            </Box>
            <ChoiceGroup id="su-buys" label="What will you buy from us?" hint={draft?.buysHint && `${draft.buysHint} Select all that apply.`}
              options={departments.map((d) => { const Icon = deptIcons[d.id]; return { value: d.name, label: d.name, icon: Icon && <Icon /> } })}
              {...pick('buys')} other={otherOf('buys', 'What else will you buy?', 'e.g. Uniforms')} />
            <Box>
              {googleNote('serve')}
              <ChoiceGroup id="su-serve" label="How do you serve?" options={opts(serveOptions)} {...pick('serve')} />
            </Box>
            <ChoiceGroup id="su-rules" label="Food rules" options={opts(ruleOptions)} value={f.rules}
              tagged={tags.rules} onChange={(v) => { const rules = exclusive(v, f.rules, isExclusive('foodRules')); untag('rules', rules); put({ rules }) }} />
            <ChoiceGroup id="su-size" single label="Customers a day" options={opts(sizeOptions)}
              value={f.size ? [f.size] : []} onChange={([size]) => put({ size })} />
          </Stack>
        )}

        {step === 2 && (
          <Stack spacing={3.5}>
            <Box sx={two}>
              <TextField id="su-phone" size="small" type="tel" label="Business phone" autoComplete="tel" {...field('phone')} />
              <TextField id="su-hst" size="small" required label="HST / Tax ID" {...field('hst')} error={!!err('hst')} helperText={err('hst')} inputProps={{ style: { fontFamily: tokens.font.mono } }} />
            </Box>
            <ChoiceGroup id="su-structure" single label="Business structure" options={opts(structures)}
              value={f.structure ? [f.structure] : []} onChange={([structure]) => put({ structure })}
              other={otherOf('structure', 'Your business structure', 'e.g. Co-operative')} />
            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: 15, mb: 1.5 }}>Manager <Box component="span" sx={{ fontWeight: 400, color: c.text2 }}>(optional)</Box></Typography>
              <Box sx={two}>
                <TextField size="small" label="Manager first name" {...field('mFirst')} />
                <TextField size="small" label="Manager last name" {...field('mLast')} />
              </Box>
            </Box>
          </Stack>
        )}

        {step === 3 && (
          <Stack spacing={2}>
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '92px 1fr', sm: '92px 1fr 1fr' } }}>
              <TextField size="small" select label="Title" autoComplete="honorific-prefix" {...field('title')}>
                {titles.map((x) => <MenuItem key={x} value={x}>{x}</MenuItem>)}
              </TextField>
              <TextField id="su-first" size="small" required label="First name" autoComplete="given-name" {...field('first')} error={!!err('first')} helperText={err('first')} />
              <TextField id="su-last" size="small" required label="Last name" autoComplete="family-name" sx={{ gridColumn: { xs: '1 / -1', sm: 'auto' } }} {...field('last')} error={!!err('last')} helperText={err('last')} />
            </Box>
            <TextField id="su-email" size="small" required type="email" label="Email address" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={!!err('email')} helperText={err('email')} />
            <TextField size="small" type="tel" label="Mobile number" autoComplete="tel" {...field('mobile')} />
            <Box id="su-pw"><PasswordField size="small" required strength label="Create password" value={pw} onChange={setPw} autoComplete="new-password" error={!!err('pw')} helperText={err('pw')} /></Box>
            <Box id="su-pw2"><PasswordField size="small" required label="Confirm password" value={pw2} onChange={setPw2} autoComplete="new-password" error={!!err('pw2')} helperText={err('pw2')} /></Box>
            <Typography sx={{ fontSize: 13, color: c.text2 }}>
              By creating an account you agree to the <Link component={RouterLink} to="/page/terms" sx={{ color: c.navy, fontWeight: 600 }}>Terms &amp; Uses</Link> and <Link component={RouterLink} to="/page/privacy-policy" sx={{ color: c.navy, fontWeight: 600 }}>Privacy Policy</Link>.
            </Typography>
          </Stack>
        )}
      </Box>

      <Stack direction="row" spacing={1.5} sx={{ mt: 4 }}>
        <Button variant="outlined" color="secondary" size="large" onClick={() => (step ? go(step - 1) : onExit())} startIcon={<ArrowBackRounded />} sx={{ flexShrink: 0 }}>Back</Button>
        <Button type="submit" fullWidth variant="contained" size="large" disabled={busy}
          endIcon={busy ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : step < steps.length - 1 ? <ArrowForwardRounded /> : undefined}
          sx={{ '&.Mui-disabled': { bgcolor: c.red, color: '#fff', opacity: 0.85 } }}>
          {step === steps.length - 1 ? (busy ? 'Creating account…' : 'Sign up') : step === 1 && menuEmpty ? 'Skip for now' : 'Continue'}
        </Button>
      </Stack>
      <PrototypePanel onReset={reset} />
    </Box>
  )
}
