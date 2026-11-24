/**
 * Google Places (New) layer for the sign-up organization finder. Google only, no mock data:
 * needs VITE_GOOGLE_PLACES_API_KEY in concept-a/.env (and in the host's env before `vite build`, since Vite bakes it in).
 */

const KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY as string | undefined
// The finder only shows "Couldn't search right now", so say the real reason where developers look.
if (!KEY) console.error('VITE_GOOGLE_PLACES_API_KEY is not set: the organization finder cannot search Google Places.')
const API = 'https://places.googleapis.com/v1'

async function google<T>(path: string, init: RequestInit & { fieldMask?: string }): Promise<T> {
  if (!KEY) throw new Error('VITE_GOOGLE_PLACES_API_KEY is not set')
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': KEY, ...(init.fieldMask && { 'X-Goog-FieldMask': init.fieldMask }) },
  })
  if (!res.ok) throw new Error(`Places API ${res.status}: ${await res.text()}`)
  return res.json()
}

/** "pizza_restaurant" -> "Pizza restaurant" */
const label = (type?: string) => (type ? type[0].toUpperCase() + type.slice(1).replace(/_/g, ' ') : 'Place')

export type PlaceHit = { id: string; name: string; address: string; category: string; distanceMeters: number | null }

/** Prototype switches, flipped by the demo panel on the sign-up form. */
export const demo = { forceError: false, denyLocation: false }

const wordStart = (s: string, i: number) => i === 0 || /\W/.test(s[i - 1])

/** Where `q` appears in `name` (case-insensitive), preferring the start of a word; -1 when it doesn't. */
export function matchAt(name: string, q: string) {
  const n = name.toLowerCase()
  const s = q.trim().toLowerCase()
  if (!s) return -1
  for (let i = n.indexOf(s); i >= 0; i = n.indexOf(s, i + 1)) if (wordStart(n, i)) return i
  return n.indexOf(s)
}

/** Canadian organizations matching `q` from Google Places Autocomplete; an empty list when Google has none. */
export async function searchPlaces({ q, lat, lng, session, signal }: { q: string; lat?: number; lng?: number; session: string; signal?: AbortSignal }) {
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

// Place details are read server-side (POST /api/profile/draft, server/api.ts) so the key and field mask stay off the browser.

type GooglePrediction = {
  placeId: string
  text: { text: string }
  structuredFormat?: { mainText: { text: string }; secondaryText?: { text: string } }
  types?: string[]
  distanceMeters?: number
}
