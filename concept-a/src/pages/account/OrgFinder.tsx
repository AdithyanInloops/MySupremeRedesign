import { useEffect, useRef, useState } from 'react'
import {
  Autocomplete, Box, Button, CircularProgress, Collapse, Link, Paper, Skeleton, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography,
} from '@mui/material'
import { tokens } from '../../theme'
import { demo, live as usingGoogle, matchAt, PRETEND_SPOT, searchPlaces, type PlaceHit } from '../../data/places'

const c = tokens.color
const srOnly = { position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' } as const
// crypto.randomUUID only exists on https/localhost; the getRandomValues v4 fallback keeps plain-http LAN previews working.
const uuid = () => crypto.randomUUID?.() ?? '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (d) => (+d ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+d / 4)))).toString(16))
const distance = (m: number) => (m < 1000 ? `${Math.round(m / 10) * 10} m` : `${(m / 1000).toFixed(1)} km`)

function Marked({ text, q }: { text: string; q: string }) {
  const i = matchAt(text, q)
  const n = q.trim().length
  return i < 0 ? <>{text}</> : <>{text.slice(0, i)}<strong>{text.slice(i, i + n)}</strong>{text.slice(i + n)}</>
}

/** Dropdown surface: same white / border / radius as the inputs, plus the attribution the real Places API requires. */
function FinderPaper({ children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <Paper {...props} onMouseDown={(e) => e.preventDefault() /* keep focus in the input when clicking Retry / footer */}
      sx={{
        mt: 0.5, border: `1px solid ${c.line2}`, borderRadius: `${tokens.radius.sm}px`, boxShadow: tokens.shadow.hover,
        // Grow out of the input: from the top edge when the list opens below it, from the bottom when Popper flips it above.
        transformOrigin: 'top center', '--dy': '-4px',
        '[data-popper-placement^="top"] &': { transformOrigin: 'bottom center', '--dy': '4px' },
        animation: 'finderIn .18s cubic-bezier(.2, 0, 0, 1)',
        '@keyframes finderIn': { from: { opacity: 0, transform: 'translateY(var(--dy)) scaleY(.94)' }, to: { opacity: 1, transform: 'none' } },
        // Fresh results slide in from the same side, staggered; rows that stay between searches keep their key and don't replay.
        '& .MuiAutocomplete-option': { animation: 'finderRow .2s cubic-bezier(.2, 0, 0, 1) backwards' },
        '@keyframes finderRow': { from: { opacity: 0, transform: 'translateY(var(--dy))' }, to: { opacity: 1, transform: 'none' } },
        '@media (prefers-reduced-motion: reduce)': { animation: 'none', '& .MuiAutocomplete-option': { animation: 'none' } },
      }}>
      {children}
      <Typography sx={{ px: 2, py: 0.75, fontSize: 11, color: 'text.secondary', textAlign: 'right', borderTop: `1px solid ${c.line}` }}>Google Maps</Typography>
    </Paper>
  )
}

type Status = 'idle' | 'loading' | 'done' | 'error'

/** "Business name" with organization search (Google Places, or the mock without an API key). Typing a name that isn't listed is always fine. */
export default function OrgFinder({ value, onChange, place, onPick, errorText }: {
  value: string
  onChange: (name: string) => void
  place: PlaceHit | null
  onPick: (p: PlaceHit | null, sessionToken?: string) => void
  errorText?: string
}) {
  const [term, setTerm] = useState('') // what the user typed; a pick changes the field but not the search
  const [open, setOpen] = useState(false)
  const [loc, setLoc] = useState<typeof PRETEND_SPOT | null>(null)
  const [results, setResults] = useState<PlaceHit[]>([])
  const [status, setStatus] = useState<Status>('idle')
  const [retry, setRetry] = useState(0)
  const cache = useRef(new Map<string, PlaceHit[]>())
  const session = useRef<string | null>(null)
  const askedLocation = useRef(false)

  const q = term.trim()
  const at = demo.denyLocation ? null : loc

  useEffect(() => {
    if (q.length < 2) { setStatus('idle'); return }
    const key = `${q.toLowerCase()}|${at ? `${at.lat},${at.lng}` : ''}`
    const hit = cache.current.get(key)
    if (hit) { setResults(hit); setStatus('done'); return }
    setStatus('loading') // previous results stay, dimmed
    const ac = new AbortController()
    const t = window.setTimeout(() => {
      searchPlaces({ q, lat: at?.lat, lng: at?.lng, session: (session.current ??= uuid()), signal: ac.signal }).then(
        ({ results: r }) => {
          cache.current.set(key, r)
          if (cache.current.size > 60) cache.current.delete(cache.current.keys().next().value!)
          setResults(r)
          setStatus('done')
        },
        () => { if (!ac.signal.aborted) { setResults([]); setStatus('error') } },
      )
    }, 250)
    // A newer keystroke cancels both the pending debounce and the in-flight request, so a stale response can't land.
    return () => { window.clearTimeout(t); ac.abort() }
  }, [q, at, retry])

  const pick = (p: PlaceHit | null) => {
    // The parent's details lookup (server-side) gets the session token: search + details close the billing session.
    onPick(p, p ? (session.current ??= uuid()) : undefined)
    if (!p) return
    onChange(p.name)
    session.current = null // the next keystroke starts a new session
  }

  const askLocation = () => {
    if (askedLocation.current || demo.denyLocation) return
    askedLocation.current = true
    navigator.geolocation?.getCurrentPosition((p) => setLoc(usingGoogle ? { lat: p.coords.latitude, lng: p.coords.longitude } : PRETEND_SPOT), () => setLoc(null))
  }

  const live = status === 'error' ? 'Search failed'
    : status === 'done' ? (results.length ? `${results.length} organization${results.length === 1 ? '' : 's'} found` : 'No organizations found') : ''

  // freeSolo hides MUI's "no options" slot, so skeleton / empty / error all render through loadingText.
  const panel = status === 'loading'
    ? <Stack spacing={1.25} aria-hidden>{[0, 1, 2].map((i) => <Box key={i}><Skeleton width="55%" /><Skeleton width="85%" height={14} /></Box>)}</Stack>
    : status === 'error'
      ? <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between"><span>Couldn’t search right now.</span><Button size="small" color="secondary" onClick={() => setRetry((n) => n + 1)}>Retry</Button></Stack>
      : 'No organizations found. Check the spelling, or try a shorter part of the name.'

  return (
    <>
      <Autocomplete<PlaceHit, false, false, true>
        freeSolo autoHighlight clearOnEscape blurOnSelect="touch" clearText="Clear business name"
        open={open && q.length >= 2} onOpen={() => setOpen(true)} onClose={() => setOpen(false)}
        options={results} filterOptions={(o) => o}
        getOptionLabel={(o) => (typeof o === 'string' ? o : o.name)} getOptionKey={(o) => (typeof o === 'string' ? o : o.id)} isOptionEqualToValue={(a, b) => a.id === b.id}
        value={place} inputValue={value}
        onInputChange={(_, v, reason) => {
          if (reason === 'reset') return // pick() sets the name itself
          if (reason === 'input') session.current ??= uuid()
          if (place) pick(null) // editing the name drops the pick
          onChange(v)
          setTerm(v)
        }}
        onChange={(_, v) => pick(typeof v === 'string' ? null : v)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && status === 'error') { e.preventDefault(); (e as { defaultMuiPrevented?: boolean }).defaultMuiPrevented = true; setRetry((n) => n + 1) }
        }}
        loading={status === 'loading' || (status !== 'idle' && !results.length)} loadingText={panel}
        PaperComponent={FinderPaper}
        ListboxProps={{ sx: { opacity: status === 'loading' ? 0.5 : 1, transition: 'opacity .15s' } }}
        sx={{ '& .MuiAutocomplete-clearIndicator': { visibility: 'visible' } }}
        renderOption={({ key, ...props }, o, { index }) => (
          <li key={key} {...props} style={{ animationDelay: `${Math.min(index, 6) * 30}ms` }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography noWrap sx={{ fontSize: 14 }}><Marked text={o.name} q={q} /></Typography>
              <Typography noWrap sx={{ fontSize: 12.5, color: 'text.secondary' }}>{o.category} · {o.address}</Typography>
            </Box>
            {o.distanceMeters != null && <Typography sx={{ flexShrink: 0, ml: 1.5, fontSize: 12.5, color: 'text.secondary' }}>{distance(o.distanceMeters)}</Typography>}
          </li>
        )}
        renderInput={(params) => (
          <TextField {...params} size="small" required label="Business name" onFocus={askLocation} error={!!errorText}
            InputProps={{ ...params.InputProps, endAdornment: <>{status === 'loading' && <CircularProgress size={16} sx={{ color: c.text3, mr: 0.5 }} />}{params.InputProps.endAdornment}</> }}
            helperText={errorText ?? (place ? (
              <>
                Is this your place? <strong>{place.name}</strong> · {place.address}{' '}
                <Link component="button" type="button" onClick={() => pick(null)} sx={{ fontSize: 'inherit', verticalAlign: 'baseline', color: c.navy, fontWeight: 600 }}>Not this one</Link>              </>
            ) : 'Pick your place from the list, or just type the name if it isn’t there.')}
          />
        )}
      />
      <Box role="status" sx={srOnly}>{live}</Box>
    </>
  )
}

/** Floating "Prototype" controls for testing the finder; not part of the design. */
export function PrototypePanel({ onReset }: { onReset: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const [s, setS] = useState({ ...demo })
  const put = (patch: Partial<typeof demo>) => setS({ ...Object.assign(demo, patch) })
  const row = (label: string, value: string, choices: [string, string][], set: (v: string) => void) => (
    <Box>
      <Typography variant="overline" component="div" sx={{ color: c.text3 }}>{label}</Typography>
      <ToggleButtonGroup exclusive fullWidth size="small" color="secondary" value={value} onChange={(_, v) => v && set(v)} aria-label={label}>
        {choices.map(([v, t]) => <ToggleButton key={v} value={v} sx={{ textTransform: 'none', py: 0.5 }}>{t}</ToggleButton>)}
      </ToggleButtonGroup>
    </Box>
  )
  return (
    <Paper sx={{
      // In the flow under the form on phones (a floating pill covered the buttons); floating bottom-right from md up.
      position: { xs: 'static', md: 'fixed' }, mt: { xs: 3, md: 0 }, right: 16, bottom: 'calc(var(--nav-h, 0px) + 88px)', zIndex: 1150,
      width: { xs: 'auto', md: expanded ? 300 : 'auto' },
      border: `1.5px dashed ${c.warning}`, borderRadius: `${tokens.radius.sm}px`, boxShadow: tokens.shadow.pop,
    }}>
      <Button fullWidth size="small" onClick={() => setExpanded(!expanded)} aria-expanded={expanded} sx={{ justifyContent: 'space-between', gap: 1.5, color: c.warning, fontWeight: 700 }}>
        Prototype <span aria-hidden>{expanded ? '−' : '+'}</span>
      </Button>
      <Collapse in={expanded} unmountOnExit>
        <Stack spacing={1} sx={{ p: 1.5, pt: 0 }}>
          {row('Latency', s.latency, [['fast', 'Fast'], ['normal', 'Normal'], ['slow', 'Slow']], (v) => put({ latency: v as typeof demo.latency }))}
          {row('Force error', s.forceError ? 'on' : 'off', [['off', 'Off'], ['on', 'On']], (v) => put({ forceError: v === 'on' }))}
          {row('Location', s.denyLocation ? 'denied' : 'browser', [['browser', 'Browser permission'], ['denied', 'Force denied']], (v) => put({ denyLocation: v === 'denied' }))}
          <Button variant="outlined" color="secondary" size="small" onClick={onReset}>Reset form</Button>
        </Stack>
      </Collapse>
    </Paper>
  )
}
