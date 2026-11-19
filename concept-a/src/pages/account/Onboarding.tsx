import { useEffect, useRef, useState } from 'react'
import { Box, Button, ButtonBase, CircularProgress, LinearProgress, Link, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { keyframes } from '@mui/material/styles'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import GoogleIcon from '@mui/icons-material/Google'
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded'
import CheckRounded from '@mui/icons-material/CheckRounded'
import EditOutlined from '@mui/icons-material/EditOutlined'
import PlaceOutlined from '@mui/icons-material/PlaceOutlined'
import StorefrontOutlined from '@mui/icons-material/StorefrontOutlined'
import { tokens } from '../../theme'
import { Logo } from '../../components/Brand'
import { googleIds } from '../../data/profile'
import { getDraft } from '../../data/profileClient'
import type { PlaceHit } from '../../data/places'
import { useApp } from '../../state/AppState'
import { PasswordField, passwordScore } from './SignIn'
import { GoogleTag } from './SignUpWizard'
import OrgFinder from './OrgFinder'

const c = tokens.color

/**
 * Dummy sign-up + onboarding at /review/onboarding.
 * Sign-up asks only what the live mysupreme.ca form makes mandatory for the person (title, name, email, password ×2);
 * onboarding then asks the business (name + tax ID mandatory, the live form's optional fields skippable), then the kitchen.
 * One question per screen, every optional one skippable. Nothing is sent anywhere; the answers are shown at the end.
 */
type Q = { title: (biz: string) => string; hint?: string; options: string[]; single?: boolean; exclusive?: string[]; label: string }

// Pick-one questions mirror the live form's dropdowns; the kitchen ones are the "What's in your kitchen?" sections.
const questions = {
  category: { label: 'Category', title: () => 'Which category fits your business best?', single: true, options: ['Food Service', 'Retail', 'Wholesale', 'Janitorial', 'Hospitality', 'Industrial', 'Non Profit Organization', 'General'] },
  structure: { label: 'Structure', title: (b) => `How is ${b} set up?`, single: true, options: ['Sole Proprietor', 'Corporation', 'Partnership'] },
  what: { label: 'What you are', title: (b) => `What kind of place is ${b}?`, options: ['Restaurant', 'Cafe or coffee shop', 'Bakery or sweets shop', 'Pizza shop', 'Burger or fried chicken', 'Ice cream and desserts', 'Bar and grill', 'Caterer', 'Cloud kitchen (delivery only)', 'Butcher'] },
  rules: { label: 'Food rules', title: () => 'Any food rules we should follow?', hint: 'We never suggest products that break these.', options: ['Vegetarian only', 'Veg and non-veg', 'Halal', 'Eggless'], exclusive: ['Vegetarian only', 'Veg and non-veg'] },
  cuisines: { label: 'Cuisines', title: () => 'Which cuisines do you cook?', options: ['South Asian / Indian', 'Middle Eastern', 'Chinese / Asian', 'Italian', 'Canadian / American', 'Caribbean'] },
  dishes: { label: 'Dishes you cook', title: () => 'Which dishes are on your menu?', options: ['Curries', 'Biryani', 'Tandoori', 'Shawarma', 'Pizza', 'Burgers', 'Fried chicken and wings', 'Fries', 'Sandwiches and wraps', 'Salads', 'Cakes and pastries', 'Indian sweets', 'Ice cream', 'Coffee and tea'] },
  ingredients: { label: 'Ingredients you buy most', title: () => 'Which ingredients do you buy most?', options: ['Chicken', 'Beef or lamb', 'Fish and seafood', 'Paneer', 'Eggs', 'Cheese', 'Milk and cream', 'Rice', 'Flour', 'Cooking oil', 'Frozen vegetables', 'Fresh vegetables'] },
  serve: { label: 'How you serve', title: () => 'How do you serve your customers?', options: ['Dine-in', 'Takeout', 'Delivery', 'Catering'] },
  meals: { label: 'Meals', title: () => 'Which meals do you serve?', options: ['Breakfast', 'Lunch', 'Dinner', 'Late night'] },
  customers: { label: 'Customers a day', title: () => 'How many customers do you serve a day?', single: true, options: ['Under 100 a day', '100 to 300 a day', 'More than 300 a day'] },
} satisfies Record<string, Q>
type QKey = keyof typeof questions
type Answers = Record<QKey, string[]>
const qKeys = Object.keys(questions) as QKey[]
const kitchen: QKey[] = ['what', 'rules', 'cuisines', 'dishes', 'ingredients', 'serve', 'meals', 'customers']
const business = ['business', 'contact', 'category', 'structure'] as const
const nonFood = ['Janitorial', 'Industrial'] // their onboarding ends after the business questions

// Google pre-fill: option ids from the server's Place Details draft → the answers they tick here.
const fromGoogle: Record<string, Partial<Answers>> = {
  'kind.restaurant': { what: ['Restaurant'] }, 'kind.cafe': { what: ['Cafe or coffee shop'] }, 'kind.bakery': { what: ['Bakery or sweets shop'] },
  'kind.caterer': { what: ['Caterer'] }, 'kind.ghost-kitchen': { what: ['Cloud kitchen (delivery only)'] }, 'kind.hotel-events': { category: ['Hospitality'] },
  'sells.pizza': { what: ['Pizza shop'], dishes: ['Pizza'] },
  'sells.burgers-sandwiches': { what: ['Burger or fried chicken'], dishes: ['Burgers', 'Sandwiches and wraps'] },
  'sells.fried-chicken': { what: ['Burger or fried chicken'], dishes: ['Fried chicken and wings'], ingredients: ['Chicken'] },
  'sells.shawarma-wraps': { dishes: ['Shawarma', 'Sandwiches and wraps'] }, 'sells.curries-rice': { dishes: ['Curries', 'Biryani'], ingredients: ['Rice'] },
  'sells.grill-bbq': { what: ['Bar and grill'] }, 'sells.seafood-sushi': { ingredients: ['Fish and seafood'] }, 'sells.salads-bowls': { dishes: ['Salads'] },
  'sells.baked-goods': { dishes: ['Cakes and pastries'], ingredients: ['Flour'] }, 'sells.desserts-sweets': { what: ['Ice cream and desserts'] },
  'sells.coffee-tea': { dishes: ['Coffee and tea'] },
  'cuisine.indian': { cuisines: ['South Asian / Indian'] }, 'cuisine.pakistani': { cuisines: ['South Asian / Indian'] }, 'cuisine.middle-eastern': { cuisines: ['Middle Eastern'] },
  'cuisine.chinese': { cuisines: ['Chinese / Asian'] }, 'cuisine.thai': { cuisines: ['Chinese / Asian'] }, 'cuisine.japanese': { cuisines: ['Chinese / Asian'] },
  'cuisine.korean': { cuisines: ['Chinese / Asian'] }, 'cuisine.filipino': { cuisines: ['Chinese / Asian'] }, 'cuisine.italian': { cuisines: ['Italian'] },
  'cuisine.canadian': { cuisines: ['Canadian / American'] }, 'cuisine.caribbean': { cuisines: ['Caribbean'] },
  'rules.halal': { rules: ['Halal'] }, 'rules.pure-veg': { rules: ['Vegetarian only'] }, 'rules.eggless': { rules: ['Eggless'] }, 'rules.none': { rules: ['Veg and non-veg'] },
  'service.dine-in': { serve: ['Dine-in'] }, 'service.takeout': { serve: ['Takeout'] }, 'service.delivery-apps': { serve: ['Delivery'] }, 'service.catering': { serve: ['Catering'] },
  'meals.breakfast': { meals: ['Breakfast'] }, 'meals.brunch': { meals: ['Breakfast'] }, 'meals.lunch': { meals: ['Lunch'] }, 'meals.dinner': { meals: ['Dinner'] }, 'meals.late-night': { meals: ['Late night'] },
}

type Step = 'signup' | 'verify' | (typeof business)[number] | 'intro' | QKey | 'setup' | 'done'
const titles = ['Mr', 'Mrs', 'Ms', 'Mx', 'Dr']
const noAnswers = Object.fromEntries(qKeys.map((k) => [k, []])) as unknown as Answers
const noContact = { mobile: '', phone: '', mFirst: '', mLast: '' }
// Format only: one @, no spaces, a dotted domain ending in a 2+ letter TLD. The verification code proves the inbox is real.
const isEmail = (s: string) => /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[a-z]{2,}$/i.test(s.trim())
// Canadian (NANP) numbers: 10 digits, optional leading 1, area code and exchange never start with 0 or 1; only phone punctuation allowed.
const phoneChars = /[^\d\s()+.-]/g
const isPhone = (s: string) => /^[\d\s()+.-]*$/.test(s) && /^1?[2-9]\d{2}[2-9]\d{6}$/.test(s.replace(/\D/g, ''))
// Letters (any language), spaces, hyphens, apostrophes and dots, starting with a letter: Jean-Luc, O'Brien, Zoë.
const isName = (s: string) => /^\p{L}[\p{L}\p{M}' .-]*$/u.test(s.trim())
// shortcut: format only (9-digit business number, optionally + RT and a 4-digit account); add the CRA check-digit test if the live form has one.
const isTaxId = (s: string) => /^\d{9}(RT\d{4})?$/i.test(s.replace(/[\s-]/g, ''))
const mandatory: string[] = ['business', 'contact', 'category', 'structure'] // all four business steps: no Skip
// Origin-aware: a screen slides in from the side you're travelling towards (--dir 1 = Continue, -1 = Back).
const enter = keyframes`from { opacity: 0; transform: translateX(calc(var(--dir, 1) * 32px)); } to { opacity: 1; transform: none; }`
const easeOut = 'cubic-bezier(.2,.7,.2,1)'
// Pointer presses move a pill's fill origin to the press point; keyboard presses grow it from the centre.
const pressOrigin = (e: React.PointerEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`)
}
const motion = '@media (prefers-reduced-motion: reduce)'
const two = { display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }
// Resting elevation, tinted navy to sit on the halftone: a tight contact shadow for the edge plus a soft, low ambient one.
const cardShadow = '0 1px 2px rgb(27 25 80 / .06), 0 2px 6px -2px rgb(27 25 80 / .06), 0 12px 32px -12px rgb(27 25 80 / .16)'

/**
 * One halftone field: dots that grow from nothing to full size towards `from`, in one brand colour.
 * Soft dot cells screened with a falloff gradient, then a contrast filter snaps each cell to a crisp dot whose size
 * follows the falloff. That gives black dots on white; screening over the colour turns them into colour on white,
 * and multiplying onto the page drops the white.
 */
const halftone = (color: string, from: string, reach: string, strength: number, cell: number) => (
  <Box sx={{ position: 'absolute', inset: 0, isolation: 'isolate', bgcolor: color, mixBlendMode: 'multiply', opacity: strength }}>
    <Box sx={{
      position: 'absolute', inset: '-2px', mixBlendMode: 'screen', filter: 'contrast(24)',
      // Phones: the content column is full width, so the dots stay tighter to their corner.
      background: Object.fromEntries(Object.entries({ xs: '38%', md: reach }).map(([bp, r]) => [bp,
        `radial-gradient(closest-side, #000, #fff) 0 0 / ${cell}px ${cell}px, radial-gradient(circle farthest-corner at ${from}, #000 0%, #fff ${r})`])),
      backgroundBlendMode: 'screen',
    }} />
  </Box>
)

/**
 * Page backdrop: brand halftone. Red dots sweep in from the bottom-left, navy from the top-right (keeping the logo corner clean),
 * both shrinking to nothing before the content column so text never sits on texture. Static, so nothing to animate or reduce.
 */
function Backdrop() {
  return (
    <Box aria-hidden sx={{ position: 'fixed', inset: 0, zIndex: -1, overflow: 'hidden', pointerEvents: 'none', bgcolor: '#FBFAFD' }}>
      {halftone(c.red, '0% 100%', '60%', 0.24, 18)}
      {halftone(c.navy, '100% 0%', '60%', 0.26, 18)}
    </Box>
  )
}

/**
 * Minimal pills: outline when off; navy outline + tint + tick when on, so the state never rests on colour alone.
 * Origin-aware: the pills enter in a wave from the travel direction, and the selected tint grows out of the press point.
 */
function Choices({ q, value, tagged, onToggle }: { q: Q; value: string[]; tagged: string[]; onToggle: (v: string) => void }) {
  return (
    <Box role={q.single ? 'radiogroup' : 'group'} aria-labelledby="ob-title" sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {q.options.map((o, n) => {
        const on = value.includes(o)
        return (
          <ButtonBase key={o} onClick={() => onToggle(o)} onPointerDown={pressOrigin} {...(q.single ? { role: 'radio', 'aria-checked': on } : { 'aria-pressed': on })} sx={{
            position: 'relative', isolation: 'isolate', overflow: 'hidden', '--x': '50%', '--y': '50%',
            gap: 0.75, minHeight: 44, px: 2, borderRadius: 999, fontFamily: tokens.font.sans, fontSize: 15, fontWeight: on ? 600 : 500,
            color: on ? c.navy : c.ink, bgcolor: '#fff', transition: 'color .15s',
            '&.Mui-focusVisible': { outline: `2px solid ${c.navy}`, outlineOffset: 2 },
            // Outline on ::after so it paints above the tint (an element's own border/shadow would sit under its ::before).
            '&::after': {
              content: '""', position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none', transition: 'box-shadow .15s',
              boxShadow: `inset 0 0 0 ${on ? 1.5 : 1}px ${on ? c.navy : c.line2}`,
            },
            '&:hover::after': { boxShadow: `inset 0 0 0 ${on ? 1.5 : 1}px ${on ? c.navy : c.text3}` },
            // The tint: a circle centred on the press point that scales out to fill the pill (and back into it on unselect).
            '&::before': {
              content: '""', position: 'absolute', left: 'var(--x)', top: 'var(--y)', width: 480, height: 480, ml: '-240px', mt: '-240px', borderRadius: '50%',
              zIndex: -1, bgcolor: c.navyTint, transform: `scale(${on ? 1 : 0})`, transition: on ? `transform .38s ${easeOut}` : 'transform .22s ease-in',
            },
            animation: `${enter} .32s ${easeOut} backwards`, animationDelay: `${60 + Math.min(n, 12) * 22}ms`,
            [motion]: { animation: 'none', '&::before': { transition: 'none' } },
          }}>
            {on && <CheckRounded aria-hidden sx={{ fontSize: 18, ml: -0.5 }} />}
            {o}
            {on && tagged.includes(o) && <GoogleTag />}
          </ButtonBase>
        )
      })}
    </Box>
  )
}

const srOnly = { position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' } as const

/** A saved answer on the summary: small label, value, and the whole tile reopens its question. Empty ones are dashed. */
function Tile({ label, onEdit, empty, children }: { label: string; onEdit: () => void; empty?: boolean; children: React.ReactNode }) {
  return (
    <ButtonBase onClick={onEdit} sx={{
      // A <button> centres its content vertically; flex-start keeps every tile's label on the same line across a row.
      position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start', alignSelf: 'stretch',
      width: '100%', minWidth: 0, textAlign: 'left', p: 1.5, borderRadius: `${tokens.radius.sm}px`,
      fontFamily: tokens.font.sans, border: `1px ${empty ? 'dashed' : 'solid'} ${empty ? c.line2 : 'transparent'}`, transition: 'background-color .15s, border-color .15s',
      '&:hover': { bgcolor: c.bg, borderColor: c.line2 }, '&.Mui-focusVisible': { outline: `2px solid ${c.navy}`, outlineOffset: 2 },
      '&:hover .ob-edit, &.Mui-focusVisible .ob-edit': { opacity: 1 },
    }}>
      <Box component="span" sx={srOnly}>Edit </Box>
      <Box component="span" sx={{ display: 'block', pr: 2.5, fontSize: 12, fontWeight: 600, color: c.text3 }}>{label}</Box>
      <Box component="span" sx={{ display: 'block', mt: 0.5, fontSize: 14, fontWeight: 500, color: c.ink, overflowWrap: 'anywhere' }}>{children}</Box>
      <EditOutlined className="ob-edit" aria-hidden sx={{ position: 'absolute', top: 12, right: 10, fontSize: 16, color: c.text3, opacity: 0, transition: 'opacity .15s', '@media (hover: none)': { opacity: 0.6 } }} />
    </ButtonBase>
  )
}

/**
 * The sign-up path: the account, then the four business steps, ending at a finish ring that fills green only once they're done.
 * `at` is the current part (0 = account); past the last part means signed up.
 * Optimistic: the current part fills the moment its answers are valid (`ready`), before Continue, and drains back if they stop being valid.
 * On the last part the finish ring lights its outline too, then fills on Continue.
 */
const trackParts = ['Account', 'Business', 'Contact', 'Category', 'Structure']
function SignupTrack({ at, ready = false }: { at: number; ready?: boolean }) {
  const done = at >= trackParts.length
  const almost = ready && at === trackParts.length - 1
  return (
    <Stack direction="row" alignItems="center" spacing={0.75} role="img"
      aria-label={done ? 'Sign-up complete' : `Sign-up step ${at + 1} of ${trackParts.length}: ${trackParts[at]}. You're signed up after step ${trackParts.length}.`}>
      {trackParts.map((p, i) => (
        <Box key={p} sx={{ flex: 1, height: 6, borderRadius: 3, overflow: 'hidden', bgcolor: c.line2 }}>
          {/* Done parts are navy and full; the current one is red, a third full until its answers are valid. */}
          <Box sx={{
            height: '100%', borderRadius: 3, bgcolor: i < at ? c.navy : c.red, width: i < at ? '100%' : i === at ? (ready ? '100%' : '33%') : 0,
            transition: 'width .35s cubic-bezier(.2,.7,.2,1), background-color .4s', [motion]: { transition: 'none' },
          }} />
        </Box>
      ))}
      <Box sx={{
        width: 24, height: 24, flexShrink: 0, borderRadius: '50%', display: 'grid', placeItems: 'center',
        border: `2px solid ${done || almost ? c.success : c.line2}`, bgcolor: done ? c.success : 'transparent', color: done ? '#fff' : almost ? c.success : c.line2,
        transform: done ? 'scale(1.1)' : 'none', transition: 'all .4s cubic-bezier(.2,.7,.2,1)', [motion]: { transition: 'none' },
      }}>
        <CheckRounded sx={{ fontSize: 16 }} />
      </Box>
    </Stack>
  )
}

export default function Onboarding() {
  const nav = useNavigate()
  const { setReview, toast } = useApp()
  const [step, setStep] = useState<Step>('signup')
  const [me, setMe] = useState({ title: '', first: '', last: '', email: '' })
  const [left, setLeft] = useState<Record<string, boolean>>({}) // a field's error waits until it is left, not on every keystroke
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [code, setCode] = useState('')
  const [biz, setBiz] = useState('')
  const [tax, setTax] = useState('')
  const [place, setPlace] = useState<PlaceHit | null>(null)
  const [contact, setContact] = useState(noContact)
  const [ans, setAns] = useState<Answers>(noAnswers)
  const [tags, setTags] = useState<Partial<Answers>>({}) // Google's picks the owner hasn't touched yet
  const [phoneFromGoogle, setPhoneFromGoogle] = useState(false)
  const [dir, setDir] = useState<1 | -1>(1) // which way the last move went, for the slide direction
  const latest = useRef({ ans, contact })
  const draftReq = useRef<AbortController>()
  const heading = useRef<HTMLHeadingElement>(null)
  const name = biz.trim()

  useEffect(() => { latest.current = { ans, contact } })
  // After the four mandatory business steps, food businesses get an optional kitchen section, opened by an intro they can skip.
  const flow: Step[] = [...business, ...(nonFood.includes(ans.category[0]) ? [] : ['intro' as const, ...kitchen])]
  const i = flow.indexOf(step)
  const scroller = useRef<HTMLDivElement>(null)
  const go = (s: Step, d: 1 | -1 = 1) => {
    setDir(d); setStep(s); window.scrollTo(0, 0); scroller.current?.scrollTo(0, 0)
    requestAnimationFrame(() => heading.current?.focus({ preventScroll: true }))
  }
  const kitchenAnswered = kitchen.some((k) => ans[k].length > 0)
  // Editing from the summary: the question opens on its own and Save / Back return straight to the summary.
  const [editing, setEditing] = useState(false)
  const edit = (s: Step) => { setEditing(true); go(s, -1) }
  const backToSummary = () => { setEditing(false); go('done') }
  const next = () => (editing ? backToSummary() : go(i < flow.length - 1 ? flow[i + 1] : 'setup'))

  useEffect(() => {
    if (step !== 'setup') return
    const t = window.setTimeout(() => go('done'), 1600)
    return () => window.clearTimeout(t)
  }, [step])

  // Same Place Details lookup as /review/signup. Google only fills what's still empty; a failed or non-food lookup changes nothing.
  const pickPlace = (p: PlaceHit | null, sessionToken?: string) => {
    setPlace(p)
    draftReq.current?.abort()
    // A different place drops the last one's untouched guesses.
    setAns((s) => Object.fromEntries(qKeys.map((k) => [k, s[k].filter((v) => !tags[k]?.includes(v))])) as unknown as Answers)
    if (phoneFromGoogle) setContact((s) => ({ ...s, phone: '' }))
    setTags({}); setPhoneFromGoogle(false)
    if (!p) return
    const ac = (draftReq.current = new AbortController())
    getDraft(p.id, sessionToken, ac.signal).then((d) => {
      const { ans: s, contact: cur } = latest.current
      const phone = d.fields.identity?.phone
      if (phone && !cur.phone) { setContact({ ...cur, phone }); setPhoneFromGoogle(true) }
      if (!d.isFoodPlace) return
      const found: Partial<Answers> = {}
      for (const id of googleIds(d)) {
        for (const [k, vs] of Object.entries(fromGoogle[id] ?? {}) as [QKey, string[]][]) found[k] = [...new Set([...(found[k] ?? []), ...vs])]
      }
      found.category ??= ['Food Service']
      const fill = Object.fromEntries((Object.keys(found) as QKey[]).filter((k) => !s[k].length).map((k) => [k, found[k]!])) as Partial<Answers>
      setAns({ ...s, ...fill })
      setTags(fill)
    }, () => {})
  }

  const toggle = (k: QKey) => (v: string) => {
    const q: Q = questions[k]
    const cur = ans[k]
    let picked = q.single ? [v] : cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]
    if (q.exclusive?.includes(v) && !cur.includes(v)) picked = picked.filter((x) => x === v || !q.exclusive!.includes(x)) // Vegetarian only ↔ Veg and non-veg
    setAns({ ...ans, [k]: picked })
    setTags((t) => ({ ...t, [k]: t[k]?.filter((x) => x !== v && picked.includes(x)) })) // touching a choice makes it the owner's
  }
  const skip = () => { const k = step as QKey; setAns((s) => ({ ...s, [k]: [] })); setTags((t) => ({ ...t, [k]: [] })); next() }
  const restart = () => {
    setMe({ title: '', first: '', last: '', email: '' }); setLeft({}); setPw(''); setPw2(''); setCode(''); setBiz(''); setTax(''); setPlace(null)
    setContact(noContact); setAns(noAnswers); setTags({}); setPhoneFromGoogle(false); setEditing(false); go('signup')
  }
  /** Field props for a format check: the error shows once the field has been left with something wrong in it. */
  const check = (f: string, v: string, valid: (s: string) => boolean, msg: string) => {
    const bad = !!left[f] && !!v.trim() && !valid(v)
    return { onBlur: () => setLeft((s) => ({ ...s, [f]: true })), error: bad, helperText: bad ? msg : undefined }
  }
  const nameCheck = (f: string, v: string) => check(f, v, isName, 'Use letters only (hyphens, apostrophes and spaces are fine)')
  const finish = (to: string) => { setReview({ signedIn: true }); toast(`Welcome to MySupreme, ${name}!`); nav(to) }

  const page = (children: React.ReactNode, width: number | Record<string, number> = 400) => (
    <Box sx={{ minHeight: '100svh', isolation: 'isolate', display: 'grid', placeItems: 'center', px: 2, py: 6 }}>
      <Backdrop />
      <Box key={step} sx={{ width: '100%', maxWidth: width, '--dir': dir, animation: `${enter} .32s ${easeOut}`, [motion]: { animation: 'none' } }}>{children}</Box>
    </Box>
  )
  const h1 = (text: string) => <Typography ref={heading} tabIndex={-1} component="h1" sx={{ fontSize: { xs: 26, md: 30 }, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2, outline: 'none' }}>{text}</Typography>

  /* -------------------------------------------------- sign up: the live form's mandatory personal fields */
  if (step === 'signup') {
    const pwOk = passwordScore(pw) >= 2
    const ok = !!me.title && isName(me.first) && isName(me.last) && isEmail(me.email) && pwOk && pw === pw2
    const put = (k: keyof typeof me) => ({ value: me[k], onChange: (e: React.ChangeEvent<HTMLInputElement>) => setMe({ ...me, [k]: e.target.value }) })
    return page(
      <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); if (ok) go('verify') }}
        sx={{ bgcolor: '#fff', border: '1px solid rgb(27 25 80 / .07)', borderRadius: `${tokens.radius.md}px`, p: { xs: 2.5, sm: 4 }, boxShadow: cardShadow }}>
        <Logo />
        <Box sx={{ mt: 3 }}><SignupTrack at={0} ready={ok} /></Box>
        <Box sx={{ mt: 3 }}>{h1('Create your account')}</Box>
        <Typography sx={{ mt: 0.75, color: c.text2 }}>
          Already have one? <Link component={RouterLink} to="/account/signin" sx={{ color: c.navy, fontWeight: 600 }}>Sign in</Link>
        </Typography>
        <Stack spacing={2} sx={{ mt: 3 }}>
          <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '88px 1fr', sm: '88px 1fr 1fr' }, '& > :last-child': { gridColumn: { xs: '1 / -1', sm: 'auto' } } }}>
            <TextField select required label="Title" autoComplete="honorific-prefix" {...put('title')}>
              {titles.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </TextField>
            <TextField required label="First name" autoComplete="given-name" inputProps={{ maxLength: 50 }} {...put('first')} {...nameCheck('first', me.first)} />
            <TextField required label="Last name" autoComplete="family-name" inputProps={{ maxLength: 50 }} {...put('last')} {...nameCheck('last', me.last)} />
          </Box>
          <TextField required label="Email" type="email" autoComplete="email" inputProps={{ maxLength: 254 }} value={me.email}
            onChange={(e) => setMe({ ...me, email: e.target.value.replace(/\s/g, '') })} // emails never contain spaces
            {...check('email', me.email, isEmail, 'Enter a valid email, like name@business.com')} />
          <PasswordField required strength label="Password" value={pw} onChange={setPw} autoComplete="new-password" />
          <PasswordField required label="Confirm password" value={pw2} onChange={setPw2} autoComplete="new-password"
            error={!!pw2 && pw !== pw2} helperText={pw2 && pw !== pw2 ? 'Passwords don’t match' : undefined} />
        </Stack>
        <Button type="submit" fullWidth variant="contained" size="large" disabled={!ok} sx={{ mt: 3 }}>Continue</Button>
        <Typography sx={{ mt: 2.5, fontSize: 13, color: c.text2 }}>
          By continuing, you agree to our <Link component={RouterLink} to="/page/terms" sx={{ color: c.ink }}>Terms of Use</Link> and <Link component={RouterLink} to="/page/privacy-policy" sx={{ color: c.ink }}>Privacy Policy</Link>.
        </Typography>
      </Box>,
      464, // 400 of fields plus the card's padding
    )
  }

  if (step === 'verify') {
    return page(
      <Box>
        <Box sx={{ mb: 3 }}><SignupTrack at={0} ready={code.length === 6} /></Box>
        {h1('Check your email')}
        <Typography sx={{ mt: 1, color: c.text2 }}>Enter the 6-digit code we sent to <b>{me.email}</b>.</Typography>
        {/* Prototype: any 6 digits work; the flow moves on as soon as the code is complete. */}
        <TextField autoFocus fullWidth label="Verification code" value={code} sx={{ mt: 3 }}
          inputProps={{ inputMode: 'numeric', autoComplete: 'one-time-code', maxLength: 6, style: { letterSpacing: '0.5em', fontSize: 22, fontFamily: tokens.font.mono } }}
          onChange={(e) => { const v = e.target.value.replace(/\D/g, '').slice(0, 6); setCode(v); if (v.length === 6) window.setTimeout(() => go(flow[0]), 300) }} />
        <Typography sx={{ mt: 2, fontSize: 14, color: c.text2 }}>
          Didn’t get it? <Link component="button" type="button" onClick={() => toast(`New code sent to ${me.email}`)} sx={{ color: c.navy, fontWeight: 600, verticalAlign: 'baseline' }}>Resend code</Link>
          {' · '}<Link component="button" type="button" onClick={() => { setCode(''); go('signup', -1) }} sx={{ color: c.navy, fontWeight: 600, verticalAlign: 'baseline' }}>Change email</Link>
        </Typography>
      </Box>,
    )
  }

  /* -------------------------------------------------- building + done */
  if (step === 'setup') {
    return page(
      <Stack alignItems="center" spacing={2} role="status">
        <CircularProgress size={32} sx={{ color: c.red }} />
        <Typography sx={{ fontSize: 17, fontWeight: 600 }}>{kitchenAnswered ? 'Building your starter kit…' : 'Setting up your account…'}</Typography>
      </Stack>,
    )
  }

  if (step === 'done') {
    const hasKitchen = flow.length > business.length
    const answered = kitchen.filter((k) => ans[k].length).length
    // The hairline border is translucent so the shadow, not the line, does most of the lifting.
    const card = { bgcolor: '#fff', border: '1px solid rgb(27 25 80 / .07)', borderRadius: `${tokens.radius.md}px`, p: { xs: 0.75, sm: 1.5 }, boxShadow: cardShadow }
    // Tiles size themselves to the card, not the device: as many columns as fit at `min` wide, never more than `max`.
    const tiles = (min: number, max: number) => ({
      display: 'grid', gap: 0.5, gridTemplateColumns: `repeat(auto-fit, minmax(max(${min}px, calc((100% - ${max - 1} * 4px) / ${max})), 1fr))`,
    })
    // Narrow-card tweaks keyed to the summary's own width (container query), so they hold on any device or split view.
    const narrow = '@container summary (max-width: 380px)'
    const cardHead = (title: string, extra?: React.ReactNode) => (
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} sx={{ px: 1.5, pt: 1, pb: 1.5 }}>
        <Typography component="h2" sx={{ fontSize: 15, fontWeight: 700 }}>{title}</Typography>{extra}
      </Stack>
    )
    return page(
      <Box sx={{ containerType: 'inline-size', containerName: 'summary' }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ [narrow]: { flexDirection: 'column', alignItems: 'flex-start', '& > :not(style) ~ :not(style)': { ml: 0, mt: 1.5 } } }}>
          <Box sx={{ width: 48, height: 48, flexShrink: 0, borderRadius: '50%', bgcolor: c.successTint, color: c.successText, display: 'grid', placeItems: 'center' }}><CheckRounded /></Box>
          <Box sx={{ minWidth: 0 }}>
            {h1(`You’re all set, ${me.first}!`)}
            <Typography sx={{ fontSize: 13, color: c.text3, overflowWrap: 'anywhere' }}>Signed in as {`${me.title} ${me.first} ${me.last}`.trim()} · {me.email}</Typography>
          </Box>
        </Stack>
        <Typography sx={{ mt: 2, color: c.text2 }}>
          {kitchenAnswered || !hasKitchen
            ? `We’ll show ${name} the products that fit first. Tap anything below to change it.`
            : `Your account is ready. Add your kitchen details and we’ll tailor what you see.`}
        </Typography>

        {/* Business: who you are up top, then every saved detail as a tappable tile that reopens its question. */}
        <Box sx={{ ...card, mt: 3 }}>
          <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ p: 1.5 }}>
            <Box sx={{ width: 44, height: 44, flexShrink: 0, borderRadius: `${tokens.radius.sm}px`, bgcolor: c.navyTint, color: c.navy, display: 'grid', placeItems: 'center' }}><StorefrontOutlined /></Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography component="h2" sx={{ fontSize: 18, fontWeight: 700, lineHeight: 1.3, overflowWrap: 'anywhere' }}>{name}</Typography>
              {place?.address && <Typography sx={{ mt: 0.25, fontSize: 13, color: c.text2 }}><PlaceOutlined aria-hidden sx={{ fontSize: 15, mr: 0.5, verticalAlign: '-3px' }} />{place.address}</Typography>}
            </Box>
            {/* Narrow cards: icon-only (still named) so the business name keeps the room. */}
            <Button size="small" color="secondary" aria-label="Edit business" startIcon={<EditOutlined />} onClick={() => edit('business')}
              sx={{ flexShrink: 0, minWidth: 40, minHeight: 40, [narrow]: { '& .MuiButton-startIcon': { m: 0 }, '& .lbl': { display: 'none' } } }}>
              <span className="lbl">Edit</span>
            </Button>
          </Stack>
          <Box sx={tiles(150, 3)}>
            <Tile label="Category" onEdit={() => edit('category')}>{ans.category[0]}</Tile>
            <Tile label="Structure" onEdit={() => edit('structure')}>{ans.structure[0]}</Tile>
            <Tile label="Tax ID" onEdit={() => edit('business')}><Box component="span" sx={{ fontFamily: tokens.font.mono, fontSize: 13, letterSpacing: '-.02em' }}>{tax.trim()}</Box></Tile>
            <Tile label="Your mobile" onEdit={() => edit('contact')}>{contact.mobile.trim()}</Tile>
            <Tile label="Business phone" onEdit={() => edit('contact')}>{contact.phone.trim()}</Tile>
            <Tile label="Manager" onEdit={() => edit('contact')}>{`${contact.mFirst.trim()} ${contact.mLast.trim()}`}</Tile>
          </Box>
        </Box>

        {/* Kitchen: answers as chips, unanswered sections as dashed "Add" tiles instead of a wall of "Skipped". */}
        {hasKitchen && (
          <Box sx={{ ...card, mt: 2 }}>
            {cardHead('Kitchen profile', kitchenAnswered && (
              <Stack direction="row" alignItems="center" spacing={1} sx={{ width: 140, [narrow]: { width: 'auto' } }}>
                <LinearProgress variant="determinate" value={(answered / kitchen.length) * 100} aria-hidden
                  sx={{ flex: 1, height: 6, borderRadius: 3, bgcolor: c.surface2, '& .MuiLinearProgress-bar': { bgcolor: c.navy, borderRadius: 3 }, [narrow]: { display: 'none' } }} />
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: c.text2, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>{answered} of {kitchen.length}</Typography>
              </Stack>
            ))}
            {kitchenAnswered ? (
              <Box sx={tiles(240, 2)}>
                {kitchen.map((k) => (
                  <Tile key={k} label={questions[k].label} onEdit={() => edit(k)} empty={!ans[k].length}>
                    {ans[k].length ? (
                      <Box component="span" sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.25 }}>
                        {ans[k].map((v) => <Box key={v} component="span" sx={{ px: 1, py: 0.25, borderRadius: 999, bgcolor: c.navyTint, color: c.navy, fontSize: 13, fontWeight: 500 }}>{v}</Box>)}
                      </Box>
                    ) : <Box component="span" sx={{ color: c.text3 }}>Not answered · <Box component="span" sx={{ color: c.navy, fontWeight: 600 }}>Add</Box></Box>}
                  </Tile>
                ))}
              </Box>
            ) : (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }} sx={{ px: 1.5, pb: 1.5 }}>
                <Typography sx={{ flex: 1, fontSize: 14, color: c.text2 }}>Skipped for now. 8 quick taps and we’ll build a starter kit of what you’ll actually order.</Typography>
                <Button variant="outlined" color="secondary" onClick={() => go('intro')} sx={{ flexShrink: 0 }}>Set up my kitchen</Button>
              </Stack>
            )}
          </Box>
        )}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 4 }}>
          <Button fullWidth variant="contained" size="large" onClick={() => finish('/')}>Start shopping</Button>
          <Button fullWidth variant="outlined" color="secondary" size="large" onClick={() => finish('/account')}>Go to my account</Button>
        </Stack>
        <Link component="button" type="button" onClick={restart} sx={{ mt: 2, fontSize: 13, color: c.text2 }}>Restart the demo</Link>
      </Box>,
      { xs: 640, lg: 720 },
    )
  }

  /* -------------------------------------------------- onboarding: one question per screen */
  const k = step in questions ? (step as QKey) : null
  const q: Q | null = k && questions[k]
  const inKitchen = k ? kitchen.includes(k) : false
  const intro = step === 'intro'
  const part = inKitchen ? kitchen : business
  const pos = part.indexOf(step as never) + 1
  const eyebrow = intro ? 'Business details complete' : `${inKitchen ? 'Your kitchen' : 'Your business'} · ${pos} of ${part.length}`
  const last = i === flow.length - 1
  const contactOk = isPhone(contact.mobile) && isPhone(contact.phone) && isName(contact.mFirst) && isName(contact.mLast)
  const canNext = step === 'business' ? !!name && isTaxId(tax) : step === 'contact' ? contactOk : k ? ans[k].length > 0 || (editing && inKitchen) : true
  const phoneCheck = (f: 'mobile' | 'phone') => check(f, contact[f], isPhone, 'Enter a 10-digit Canadian number, e.g. 905-555-0123')
  const businessPhone = phoneCheck('phone')
  const fromGoogleHere = k ? !!tags[k]?.length : step === 'contact' && phoneFromGoogle
  const putC = (f: keyof typeof noContact) => ({
    value: contact[f],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      // Phone fields only take digits and phone punctuation, so letters never get in.
      const v = f === 'mobile' || f === 'phone' ? e.target.value.replace(phoneChars, '') : e.target.value
      setContact({ ...contact, [f]: v }); if (f === 'phone') setPhoneFromGoogle(false)
    },
  })
  const title = step === 'business' ? `Welcome, ${me.first}! Tell us about your business.`
    : step === 'contact' ? 'Who should we contact about orders?'
    : intro ? `${name} is all set up. Want a starter kit?` : q!.title(name)
  const hint = step === 'business' ? 'Find your place on Google Maps and we’ll fill in what we can. Not listed? Just type the name.'
    : step === 'contact' ? 'We use these for delivery updates and order questions.'
    : intro ? 'Tell us what’s in your kitchen and we’ll put the products you’ll actually order up front. It’s optional: skip it now and add it any time from your business profile.'
    : q!.hint ?? (q!.single ? 'Choose one.' : 'Select all that apply.')
  const skipKitchen = () => go('setup') // keeps whatever kitchen answers were already given

  return (
    // App-shell layout: header, a scrolling question area, and the actions — all on the one halftone backdrop.
    // The question area fades out at its edges, so nothing needs a solid bar to hide content scrolling under the actions.
    <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); if (canNext) next() }}
      sx={{ height: '100dvh', '@supports not (height: 100dvh)': { height: '100vh' }, display: 'flex', flexDirection: 'column', isolation: 'isolate' }}>
      <Backdrop />
      {inKitchen && !editing && <LinearProgress variant="determinate" value={(pos / kitchen.length) * 100} aria-label={`Kitchen question ${pos} of ${kitchen.length}`}
        sx={{ flexShrink: 0, height: 3, bgcolor: c.line, '& .MuiLinearProgress-bar': { bgcolor: c.red, transition: 'transform .4s cubic-bezier(.2,.7,.2,1)' } }} />}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ flexShrink: 0, px: { xs: 2, sm: 3, md: 4 }, py: { xs: 1.5, md: 2 } }}>
        <Logo compact />
        {inKitchen && !editing && <Button color="inherit" onClick={skipKitchen} sx={{ color: c.text2, fontWeight: 600, minHeight: 44 }}>Finish later</Button>}
      </Stack>
      {/* Outside the per-step animation, so the track stays put and only its segments fill. */}
      {!editing && (business.includes(step as never) || intro) && (
        <Box sx={{ flexShrink: 0, width: '100%', maxWidth: { xs: 640, md: 680 }, mx: 'auto', px: { xs: 2, sm: 4 }, pt: 1 }}>
          <SignupTrack at={intro ? trackParts.length : pos} ready={canNext} />
        </Box>
      )}

      <Box ref={scroller} sx={{
        flex: 1, minHeight: 0, overflowY: 'auto', overscrollBehavior: 'contain',
        maskImage: 'linear-gradient(to bottom, transparent 0, #000 20px, #000 calc(100% - 40px), transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0, #000 20px, #000 calc(100% - 40px), transparent 100%)',
      }}>
      {/* Top-aligned on every step so the question never jumps, and the business search has room to open below its field. */}
      <Box key={step} sx={{ maxWidth: { xs: 640, md: 680 }, mx: 'auto', px: { xs: 2, sm: 4 }, pt: { xs: 3, sm: 5, md: '7vh' }, pb: 6, '--dir': dir, animation: `${enter} .32s ${easeOut}`, [motion]: { animation: 'none' } }}>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: intro ? c.successText : c.text3, fontVariantNumeric: 'tabular-nums' }}>
          {intro && <CheckRounded aria-hidden sx={{ fontSize: 16, mr: 0.5, verticalAlign: '-3px' }} />}{eyebrow}
        </Typography>
        <Typography id="ob-title" ref={heading} tabIndex={-1} component="h1"
          sx={{ mt: 1, fontSize: { xs: 26, md: 32 }, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2, textWrap: 'balance', outline: 'none' }}>{title}</Typography>
        <Typography sx={{ mt: 1, color: c.text2 }}>
          {hint}
          {k && !q!.single && ans[k].length > 0 && <Box component="span" sx={{ color: c.navy, fontWeight: 600 }}> {ans[k].length} selected.</Box>}
        </Typography>
        {fromGoogleHere && (
          <Typography role="status" sx={{ mt: 1, fontSize: 14, color: c.text2 }}>
            <GoogleIcon aria-hidden sx={{ fontSize: 14, mr: 0.75, verticalAlign: '-2px', color: c.navy }} />
            We pre-filled this from Google Maps for {place?.name ?? name}. Fix anything that’s wrong.
          </Typography>
        )}

        <Box sx={{ mt: 4 }}>
          {step === 'business' && (
            <Stack spacing={2.5}>
              <OrgFinder value={biz} onChange={setBiz} place={place} onPick={pickPlace} />
              {(() => {
                const t = check('tax', tax, isTaxId, 'Enter your 9-digit business number, e.g. 123456789 RT0001')
                return (
                  <TextField required label="Tax ID (HST / GST number)" value={tax} onChange={(e) => setTax(e.target.value.toUpperCase())}
                    {...t} helperText={t.helperText ?? 'Printed on your invoices, e.g. 123456789 RT0001.'} inputProps={{ maxLength: 30, style: { fontFamily: tokens.font.mono } }} />
                )
              })()}
            </Stack>
          )}
          {step === 'contact' && (
            <Stack spacing={2.5}>
              <Box sx={two}>
                <TextField required label="Your mobile" type="tel" autoComplete="tel" inputProps={{ maxLength: 20 }} {...putC('mobile')} {...phoneCheck('mobile')} />
                <TextField required label="Business phone" type="tel" inputProps={{ maxLength: 20 }} {...putC('phone')}
                  {...businessPhone} helperText={businessPhone.helperText ?? (phoneFromGoogle ? <GoogleTag /> : undefined)} />
              </Box>
              <Box sx={two}>
                <TextField required label="Manager first name" inputProps={{ maxLength: 50 }} {...putC('mFirst')} {...nameCheck('mFirst', contact.mFirst)} />
                <TextField required label="Manager last name" inputProps={{ maxLength: 50 }} {...putC('mLast')} {...nameCheck('mLast', contact.mLast)} />
              </Box>
            </Stack>
          )}
          {k && <Choices key={k} q={q!} value={ans[k]} tagged={tags[k] ?? []} onToggle={toggle(k)} />}
          {intro && (
            <Typography component="p" sx={{ fontSize: 14, color: c.text2 }}>
              <b>{kitchen.length} quick questions</b>, about a minute: {kitchen.map((x) => questions[x].label.toLowerCase()).join(', ')}.
            </Typography>
          )}
        </Box>
      </Box>
      </Box>

      {/* Actions: Back on the left; Skip (quiet) beside the one primary action. The four business steps are mandatory, so they have no Skip.
          No fill, border or shadow, so the halftone runs straight through; it lines up with the question column above. */}
      <Box sx={{ flexShrink: 0, pb: 'max(env(safe-area-inset-bottom), 0px)' }}>
        <Stack direction="row" alignItems="center" sx={{ maxWidth: { xs: 640, md: 680 }, mx: 'auto', px: { xs: 2, sm: 4 }, py: { xs: 1.5, md: 2.5 }, gap: { xs: 0.5, sm: 1 } }}>
          {/* Phones: Back shrinks to its arrow (still named "Back") so the two right-hand buttons keep their labels. */}
          {(i > 0 || editing) && (
            <Button color="inherit" aria-label="Back" onClick={() => (editing ? backToSummary() : go(flow[i - 1], -1))} startIcon={<ArrowBackRounded />}
              sx={{ color: c.text2, minHeight: 44, minWidth: 44, px: { xs: 1, sm: 1.5 }, '& .MuiButton-startIcon': { mr: { xs: 0, sm: 1 }, ml: { xs: 0, sm: -0.5 } } }}>
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Back</Box>
            </Button>
          )}
          <Box sx={{ flex: 1 }} />
          {editing ? null : intro ? <Button color="inherit" onClick={skipKitchen} sx={{ color: c.text2, minHeight: 44, fontWeight: 600, whiteSpace: 'nowrap' }}>Skip<Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>&nbsp;for now</Box></Button>
            : !mandatory.includes(step) && <Button color="inherit" onClick={skip} sx={{ color: c.text2, minHeight: 44, fontWeight: 600 }}>Skip</Button>}
          <Button type="submit" variant="contained" size="large" disabled={!canNext}
            sx={{ minWidth: { xs: 0, sm: 140 }, px: { xs: 2.5, sm: 3 }, whiteSpace: 'nowrap', boxShadow: 'none', '&.Mui-disabled': { bgcolor: 'rgb(17 24 39 / .08)' } }}>
            {editing ? 'Save' : intro ? 'Set up my kitchen' : !last ? 'Continue' : flow.length > business.length ? 'Build my starter kit' : 'Finish'}
          </Button>
        </Stack>
      </Box>
    </Box>
  )
}
