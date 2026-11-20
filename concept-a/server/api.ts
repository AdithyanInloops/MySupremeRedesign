/**
 * Business profile API, one Web-standard handler for every route:
 *   POST /api/profile/draft { placeId, sessionToken? } → { isFoodPlace, fields }   Google pre-fill, nothing stored
 *   GET  /api/profile                                  → the profile               signed in
 *   PUT  /api/profile  <partial profile>               → the merged profile        signed in
 * Served by Vite in dev (vite.config.ts) and by the Vercel functions in api/.
 */
import { draftFromPlace, mergeProfile, validatePatch, type Draft, type GooglePlace, type Profile } from '../src/data/profile.ts'
import mockPlaces from './fixtures/places.json' with { type: 'json' }

// Only what the profile reads. editorialSummary, reviewSummary, serves*, dineIn, takeout, delivery and curbsidePickup
// put this call in the Place Details Enterprise + Atmosphere SKU.
const FIELD_MASK = [
  'id', 'displayName', 'formattedAddress', 'nationalPhoneNumber', 'websiteUri', 'types', 'primaryType', 'priceLevel', 'regularOpeningHours',
  'editorialSummary', 'reviewSummary', 'servesBreakfast', 'servesBrunch', 'servesLunch', 'servesDinner', 'servesCoffee', 'servesDessert',
  'servesVegetarianFood', 'dineIn', 'takeout', 'delivery', 'curbsidePickup',
].join(',')
const PLACE_ID = /^[\w-]{1,300}$/
const SESSION = /^[\w-]{1,100}$/

// shortcut: in memory, per server process (gone on restart and not shared between Vercel instances); move to the customer record before launch.
const profiles = new Map<string, Profile>()

// shortcut: the prototype has no auth, so the browser sets a demo account cookie; replace with the real customer session.
const accountOf = (req: Request) => /(?:^|;\s*)ms_account=([^;]+)/.exec(req.headers.get('cookie') ?? '')?.[1]

const json = (body: unknown, status = 200) => Response.json(body, { status })
const nothing: Draft = { isFoodPlace: false, fields: {} }

async function placeDetails(placeId: string, sessionToken?: string): Promise<GooglePlace | undefined> {
  // Falls back to the browser's search key: when the finder lists real Google places, details must come from Google too.
  // shortcut: that key is public in the bundle; give the server its own restricted GOOGLE_PLACES_API_KEY before launch.
  const key = process.env.GOOGLE_PLACES_API_KEY || process.env.VITE_GOOGLE_PLACES_API_KEY
  if (!key) return (mockPlaces as Record<string, GooglePlace>)[placeId] // keyless prototype: the finder's mock places
  // The finder's session token closes its autocomplete session, as the browser's own details call used to.
  const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}${sessionToken ? `?sessionToken=${sessionToken}` : ''}`, {
    headers: { 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': FIELD_MASK },
    signal: AbortSignal.timeout(5000),
  })
  if (!res.ok) { console.warn(`Places details ${res.status}: ${await res.text()}`); return undefined }
  return (await res.json()) as GooglePlace
}

export async function handle(req: Request): Promise<Response> {
  const path = new URL(req.url).pathname.replace(/\/+$/, '')
  const body = () => req.json().then((b: unknown) => b, () => undefined)

  if (path.endsWith('/profile/draft')) {
    if (req.method !== 'POST') return json({ error: 'Use POST' }, 405)
    const { placeId, sessionToken } = ((await body()) ?? {}) as Record<string, unknown>
    if (typeof placeId !== 'string' || !PLACE_ID.test(placeId)) return json({ error: 'placeId is missing or malformed' }, 400)
    if (sessionToken !== undefined && (typeof sessionToken !== 'string' || !SESSION.test(sessionToken))) return json({ error: 'sessionToken is malformed' }, 400)
    // A failed lookup is an empty draft: the form just stays empty.
    const place = await placeDetails(placeId, sessionToken).catch((e) => { console.warn('Places details failed', e); return undefined })
    return json(place ? draftFromPlace(place) : nothing)
  }

  if (path.endsWith('/profile')) {
    const account = accountOf(req)
    if (!account) return json({ error: 'Sign in to see your business profile' }, 401)
    if (req.method === 'GET') return json(profiles.get(account) ?? {})
    if (req.method !== 'PUT') return json({ error: 'Use GET or PUT' }, 405)
    const r = validatePatch(await body())
    if ('error' in r) return json({ error: r.error }, 400)
    const next = mergeProfile(profiles.get(account) ?? {}, r.patch, new Date().toISOString(), r.suggestedByGoogle)
    profiles.set(account, next)
    return json(next)
  }

  return json({ error: 'Not found' }, 404)
}
