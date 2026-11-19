/**
 * Google Places (New) layer for the sign-up organization finder.
 * With VITE_GOOGLE_PLACES_API_KEY set (concept-a/.env) it calls the real API; without it, falls back to the fictional mock places below.
 */

const KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY as string | undefined
/** True when the real Places API is in use. */
export const live = !!KEY
const API = 'https://places.googleapis.com/v1'

async function google<T>(path: string, init: RequestInit & { fieldMask?: string }): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': KEY!, ...(init.fieldMask && { 'X-Goog-FieldMask': init.fieldMask }) },
  })
  if (!res.ok) throw new Error(`Places API ${res.status}: ${await res.text()}`)
  return res.json()
}

/** "pizza_restaurant" -> "Pizza restaurant" */
const label = (type?: string) => (type ? type[0].toUpperCase() + type.slice(1).replace(/_/g, ' ') : 'Place')

export type PlaceHit = { id: string; name: string; address: string; category: string; distanceMeters: number | null }
export type PlaceDetails = { id: string; name: string; address: string; phone?: string; lat: number; lng: number; types: string[] }

/** Prototype switches, flipped by the demo panel on the sign-up form. */
export const demo = { latency: 'normal' as 'fast' | 'normal' | 'slow', forceError: false, denyLocation: false }

/** Where we pretend the user is when location is allowed: the mock places are in Mississauga, a real position wouldn't fit. */
export const PRETEND_SPOT = { lat: 43.545, lng: -79.69 }

const places: (PlaceDetails & { category: string })[] = [
  { id: 'mock_01', name: "Domenico's Pizzeria", category: 'Restaurant', address: '1250 Dundas St E, Mississauga', types: ['restaurant', 'pizza_restaurant', 'food'], phone: '+1 905-555-0141', lat: 43.6075, lng: -79.5985 },
  { id: 'mock_02', name: 'Dominion Bakery & Café', category: 'Bakery', address: '88 Lakeshore Rd W, Mississauga', types: ['bakery', 'cafe', 'food'], phone: '+1 905-555-0177', lat: 43.5521, lng: -79.5862 },
  { id: 'mock_03', name: 'Domino Hall Banquets', category: 'Event venue', address: '4100 Eglinton Ave W, Mississauga', types: ['event_venue'], phone: '+1 905-555-0190', lat: 43.559, lng: -79.7135 },
  { id: 'mock_04', name: 'Dome Hardware Supply', category: 'Hardware store', address: '2900 Argentia Rd, Mississauga', types: ['hardware_store', 'store'], lat: 43.6038, lng: -79.7468 },
  { id: 'mock_05', name: 'Maple Leaf Shawarma', category: 'Restaurant', address: '3045 Hurontario St, Mississauga', types: ['middle_eastern_restaurant', 'restaurant', 'food'], phone: '+1 905-555-0123', lat: 43.5795, lng: -79.6395 },
  { id: 'mock_06', name: 'Spice Route Indian Kitchen', category: 'Restaurant', address: '6985 Financial Dr, Mississauga', types: ['indian_restaurant', 'restaurant'], phone: '+1 905-555-0164', lat: 43.6215, lng: -79.7312 },
  { id: 'mock_07', name: 'Laird Road Convenience', category: 'Convenience store', address: '3790 Laird Rd, Mississauga', types: ['convenience_store', 'store'], phone: '+1 905-555-0108', lat: 43.5402, lng: -79.6943 },
  { id: 'mock_08', name: 'Northside Butcher Co.', category: 'Butcher shop', address: '1500 Dundas St W, Mississauga', types: ['butcher_shop', 'store'], phone: '+1 905-555-0155', lat: 43.5615, lng: -79.657 },
  { id: 'mock_09', name: 'Golden Crust Bakery', category: 'Bakery', address: '210 Queen St S, Mississauga', types: ['bakery', 'food'], phone: '+1 905-555-0132', lat: 43.5795, lng: -79.7115 },
  { id: 'mock_10', name: 'Lakeshore Grand Hotel', category: 'Hotel', address: '1 Port St E, Mississauga', types: ['lodging', 'hotel'], phone: '+1 905-555-0100', lat: 43.5508, lng: -79.584 },
  { id: 'mock_11', name: 'The Extremely Long Named Family Restaurant & Banquet Centre of Greater Mississauga', category: 'Restaurant', address: '5100 Erin Mills Pkwy, Mississauga', types: ['restaurant'], phone: '+1 905-555-0186', lat: 43.558, lng: -79.7105 },
]

const wordStart = (s: string, i: number) => i === 0 || /\W/.test(s[i - 1])

/** Where `q` appears in `name` (case-insensitive), preferring the start of a word; -1 when it doesn't. */
export function matchAt(name: string, q: string) {
  const n = name.toLowerCase()
  const s = q.trim().toLowerCase()
  if (!s) return -1
  for (let i = n.indexOf(s); i >= 0; i = n.indexOf(s, i + 1)) if (wordStart(n, i)) return i
  return n.indexOf(s)
}

/** Haversine distance in whole metres. */
function metres(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const rad = (d: number) => (d * Math.PI) / 180
  const h = Math.sin(rad(b.lat - a.lat) / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lng - a.lng) / 2) ** 2
  return Math.round(2 * 6371000 * Math.asin(Math.sqrt(h)))
}

const sleep = (ms: number, signal?: AbortSignal) => new Promise<void>((resolve, reject) => {
  signal?.throwIfAborted()
  const t = setTimeout(resolve, ms)
  signal?.addEventListener('abort', () => { clearTimeout(t); reject(signal.reason) }, { once: true })
})

const latency = () => {
  const [lo, hi] = { fast: [80, 200], normal: [300, 900], slow: [1500, 2500] }[demo.latency]
  return lo + Math.random() * (hi - lo)
}

/** Test triggers: q containing "error" fails, "slow" takes 3 s, "zzz" matches nothing. */
export async function searchPlaces({ q, lat, lng, session, signal }: { q: string; lat?: number; lng?: number; session: string; signal?: AbortSignal }) {
  if (live) {
    if (demo.forceError) throw new Error('Forced error')
    const here = lat != null && lng != null ? { latitude: lat, longitude: lng } : undefined
    const { suggestions = [] } = await google<{ suggestions?: { placePrediction?: GooglePrediction }[] }>('/places:autocomplete', {
      method: 'POST',
      signal,
      body: JSON.stringify({
        input: q,
        sessionToken: session,
        includedRegionCodes: ['ca'], // Canadian businesses only
        ...(here && { origin: here, locationBias: { circle: { center: here, radius: 50000 } } }),
      }),
    })
    return {
      results: suggestions.flatMap(({ placePrediction: p }): PlaceHit[] => p ? [{
        id: p.placeId,
        name: p.structuredFormat?.mainText.text ?? p.text.text,
        address: p.structuredFormat?.secondaryText?.text ?? '',
        category: label(p.types?.[0]),
        distanceMeters: p.distanceMeters ?? null,
      }] : []),
    }
  }
  const s = q.trim().toLowerCase()
  await sleep(s.includes('slow') ? 3000 : latency(), signal)
  if (demo.forceError || s.includes('error')) throw new Error('Mock search failed')
  const here = lat != null && lng != null ? { lat, lng } : null
  const hits = places.flatMap(({ id, name, address, category, lat: pLat, lng: pLng }) => {
    const at = matchAt(name, s)
    if (at < 0) return []
    return [{ id, name, address, category, distanceMeters: here ? metres(here, { lat: pLat, lng: pLng }) : null, rank: wordStart(name.toLowerCase(), at) ? 0 : 1 }]
  })
  hits.sort((a, b) => (here ? a.distanceMeters! - b.distanceMeters! : a.rank - b.rank))
  return { results: hits.map(({ rank: _rank, ...hit }): PlaceHit => hit) }
}

// Place details are read server-side (POST /api/profile/draft, server/api.ts) so the key and field mask stay off the browser.

type GooglePrediction = {
  placeId: string
  text: { text: string }
  structuredFormat?: { mainText: { text: string }; secondaryText?: { text: string } }
  types?: string[]
  distanceMeters?: number
}
