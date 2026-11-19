/**
 * Business profile: the record a later recommendation feature reads.
 * Shared by the browser and the server (server/api.ts): option catalog, Google → option mapping, validation and merge.
 * Every stored field is { value, source, confirmed, updatedAt }; a field we don't know is absent.
 */
import catalog from './profileOptions.json' with { type: 'json' }

export type Source = 'google' | 'owner'
export type Field<T> = { value: T; source: Source; confirmed: boolean; updatedAt: string }
export type Option = { id: string; label: string; google?: string[]; keywords?: string[]; exclusive?: boolean }
type List = { options: Option[]; single?: boolean; keywordsIn?: string }

const lists: Record<string, List> = catalog.lists

export type Values = {
  identity: { name?: string; address?: string; phone?: string; website?: string; placeId?: string }
  businessKind: string[]
  cuisines: string[]
  sells: string[]
  buysFrom: string[]
  serviceModes: string[]
  foodRules: string[]
  size: string
  meals: string[]
  priceLevel: string
  openingHours: { weekdayDescriptions: string[] }
  topDishes: string[]
  menuUrl: string
  proteins: string[]
  equipment: string[]
  storage: string[]
  orderRhythm: { perWeek?: string; day?: string; method?: string }
  locations: string
  brandPrefs: { mustHave?: string; openToValue?: boolean }
  /** What the owner typed after picking "Other" in a list, in their own words, for the recommendation AI to read. */
  others: { cuisines?: string; sells?: string; buysFrom?: string }
}
export type FieldName = keyof Values
export type Profile = { [K in FieldName]?: Field<Values[K]> } & { suggestedByGoogle?: string[] }
/** A partial profile to save. null removes the field; source defaults to 'owner'. */
export type Patch = { [K in FieldName]?: { value: Values[K]; source?: Source } | null }
export type Draft = { isFoodPlace: boolean; fields: Partial<Values>; buysHint?: string }

const FIELDS: FieldName[] = [
  'identity', 'businessKind', 'cuisines', 'sells', 'buysFrom', 'serviceModes', 'foodRules', 'size', 'meals', 'priceLevel',
  'openingHours', 'topDishes', 'menuUrl', 'proteins', 'equipment', 'storage', 'orderRhythm', 'locations', 'brandPrefs', 'others',
]
/** What "N of 18 details added" counts: not opening hours (from Google, never asked) or others (part of the list it details). */
export const DETAIL_FIELDS = FIELDS.filter((k) => k !== 'openingHours' && k !== 'others')
export const countDetails = (p: Profile) => DETAIL_FIELDS.filter((k) => p[k]).length

export const optionsOf = (list: string) => lists[list].options
export const isSingle = (list: string) => !!lists[list].single
export const idOf = (list: string, label: string) => lists[list].options.find((o) => o.label === label)?.id
export const labelOf = (list: string, id: string) => lists[list].options.find((o) => o.id === id)?.label
/** Matches an option by id or label; ids and labels never collide. */
export const isExclusive = (list: string) => (v: string) => !!lists[list].options.find((o) => o.id === v || o.label === v)?.exclusive

/** Picking an exclusive choice (None, Reach-in only) clears the rest; picking anything else clears the exclusive ones. */
export function exclusive(next: string[], prev: string[], isExcl: (v: string) => boolean) {
  const added = next.find((v) => !prev.includes(v))
  if (added === undefined) return next
  return isExcl(added) ? [added] : next.filter((v) => !isExcl(v))
}

export const isEmpty = (v: unknown) =>
  v == null || v === '' || (Array.isArray(v) ? !v.length : typeof v === 'object' && !Object.values(v).some((x) => x !== undefined))
const prune = <T extends object>(o: T) => Object.fromEntries(Object.entries(o).filter(([, v]) => !isEmpty(v))) as T

/* ------------------------------------------------------------------ Google → options */

/** The Place Details (New) fields we read; serves*, dineIn, takeout… arrive as top-level booleans. */
export type GooglePlace = {
  id: string
  displayName?: { text?: string }
  formattedAddress?: string
  nationalPhoneNumber?: string
  websiteUri?: string
  types?: string[]
  primaryType?: string
  priceLevel?: string
  regularOpeningHours?: { weekdayDescriptions?: string[] }
  editorialSummary?: { text?: string }
  reviewSummary?: { text?: { text?: string } }
  [attribute: string]: unknown
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export function draftFromPlace(p: GooglePlace): Draft {
  const types = [...(p.types ?? []), ...(p.primaryType ? [p.primaryType] : [])]
  const isType = (token: string) => (token.startsWith('*') ? types.some((t) => t.endsWith(token.slice(1))) : types.includes(token))
  // A token is a place type, a true boolean attribute (dineIn, servesDessert…) or a price level.
  const has = (token: string) => isType(token) || p[token] === true || p.priceLevel === token
  const name = p.displayName?.text ?? ''
  const text = [name, p.editorialSummary?.text, p.reviewSummary?.text?.text].filter(Boolean).join('\n')
  const said = (kw: string, inText: string) => new RegExp(`\\b${escape(kw)}\\b`, 'i').test(inText)
  const match = (list: string) => lists[list].options
    .filter((o) => o.google?.some(has) || o.keywords?.some((kw) => said(kw, lists[list].keywordsIn === 'name' ? name : text)))
    .map((o) => o.id)

  // Food business = a food type, not an attribute or keyword (a gas station can serve coffee; a hardware store can sell shrink wrap).
  const isFoodPlace = ['businessKind', 'cuisines', 'sells'].some((l) => lists[l].options.some((o) => o.google?.some(isType))) || catalog.foodTypes.some(isType)
  if (!isFoodPlace) return { isFoodPlace, fields: {} }

  const kind = match('businessKind')
  const fields = prune<Partial<Values>>({
    identity: prune({ name, address: p.formattedAddress, phone: p.nationalPhoneNumber, website: p.websiteUri, placeId: p.id }),
    businessKind: kind.length ? kind : ['kind.restaurant'],
    cuisines: match('cuisines'),
    sells: match('sells'),
    serviceModes: match('serviceModes'),
    // Nothing from Google about food rules → None, which the owner can change.
    foodRules: match('foodRules').length ? match('foodRules') : ['rules.none'],
    meals: match('meals'),
    priceLevel: match('priceLevel')[0],
    openingHours: p.regularOpeningHours?.weekdayDescriptions?.length ? { weekdayDescriptions: p.regularOpeningHours.weekdayDescriptions } : undefined,
    menuUrl: p.websiteUri,
  })
  return { isFoodPlace, fields, ...(catalog.buysHint.google.some(has) && { buysHint: catalog.buysHint.text }) }
}

/** Every option id Google suggested, kept as `suggestedByGoogle` so later features can tell Google's guesses from the owner's picks. */
export const googleIds = ({ fields: f }: Draft) =>
  [f.businessKind, f.cuisines, f.sells, f.serviceModes, f.foodRules, f.meals, f.priceLevel].flat().filter((x): x is string => !!x)

/* ------------------------------------------------------------------ validation (the browser is untrusted) */

class BadInput extends Error {}
const fail = (msg: string): never => { throw new BadInput(msg) }
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)

const text = (v: unknown, max: number, at: string) => {
  if (typeof v !== 'string') return fail(`${at} must be text`)
  const t = v.trim()
  return t.length > max ? fail(`${at} must be ${max} characters or fewer`) : t
}
const link = (v: unknown, max: number, at: string) => {
  const t = text(v, max, at)
  if (t && !/^https?:$/.test(URL.parse(t)?.protocol ?? '')) fail(`${at} must be a link starting with http:// or https://`)
  return t
}
const array = (v: unknown, max: number, at: string) => (!Array.isArray(v) ? fail(`${at} must be a list`) : v.length > max ? fail(`${at} can have at most ${max} items`) : v)
const option = (list: string, v: unknown, at: string) =>
  typeof v === 'string' && lists[list].options.some((o) => o.id === v) ? v : fail(`${at}: unknown option ${JSON.stringify(v)}`)
const optionList = (list: string, v: unknown, at: string) => {
  const ids = [...new Set(array(v, lists[list].options.length, at).map((x) => option(list, x, at)))]
  if (ids.length > 1 && ids.some(isExclusive(list))) fail(`${at}: ${ids.filter(isExclusive(list)).map((id) => labelOf(list, id)).join(', ')} can't be combined with other choices`)
  return ids
}
const shape = <K extends string>(v: unknown, keys: Record<K, (x: unknown, at: string) => unknown>, at: string) => {
  if (!isObj(v)) return fail(`${at} must be an object`)
  for (const k of Object.keys(v)) if (!(k in keys)) fail(`${at}: unknown key "${k}"`)
  return prune(Object.fromEntries(Object.entries(keys).map(([k, check]) => [k, v[k] === undefined ? undefined : (check as (x: unknown, at: string) => unknown)(v[k], `${at}.${k}`)])))
}

function clean(k: FieldName, v: unknown): unknown {
  switch (k) {
    case 'identity':
      return shape(v, {
        name: (x, at) => text(x, 120, at), address: (x, at) => text(x, 300, at), phone: (x, at) => text(x, 40, at),
        website: (x, at) => link(x, 500, at), placeId: (x, at) => (typeof x === 'string' && /^[\w-]{1,300}$/.test(x) ? x : fail(`${at} is malformed`)),
      }, k)
    case 'openingHours':
      return shape(v, { weekdayDescriptions: (x, at) => array(x, 7, at).map((d) => text(d, 160, at)) }, k)
    case 'topDishes':
      return array(v, 5, k).map((d, i) => text(d, 40, `topDishes[${i + 1}]`)).filter(Boolean)
    case 'menuUrl':
      return link(v, 500, k)
    case 'orderRhythm':
      return shape(v, {
        perWeek: (x, at) => option('orderRhythm.perWeek', x, at), day: (x, at) => option('orderRhythm.day', x, at), method: (x, at) => option('orderRhythm.method', x, at),
      }, k)
    case 'brandPrefs':
      return shape(v, { mustHave: (x, at) => text(x, 200, at), openToValue: (x, at) => (typeof x === 'boolean' ? x : fail(`${at} must be true or false`)) }, k)
    case 'others':
      return shape(v, { cuisines: (x, at) => text(x, 100, at), sells: (x, at) => text(x, 100, at), buysFrom: (x, at) => text(x, 100, at) }, k)
    default:
      return lists[k].single ? option(k, v, k) : optionList(k, v, k)
  }
}

/** Checks a PUT body: only known fields and option ids, capped lists, trimmed and capped text, http(s) links. */
export function validatePatch(body: unknown): { patch: Patch; suggestedByGoogle?: string[] } | { error: string } {
  try {
    if (!isObj(body)) fail('Expected a JSON object')
    const patch: Record<string, unknown> = {}
    let suggestedByGoogle: string[] | undefined
    for (const [k, entry] of Object.entries(body as object)) {
      if (k === 'suggestedByGoogle') {
        suggestedByGoogle = [...new Set(array(entry, 60, k).map((id) => (Object.values(lists).some((l) => l.options.some((o) => o.id === id)) ? (id as string) : fail(`${k}: unknown option ${JSON.stringify(id)}`))))]
        continue
      }
      if (!FIELDS.includes(k as FieldName)) fail(`Unknown field "${k}"`)
      if (entry === null) { patch[k] = null; continue }
      if (!isObj(entry) || !('value' in entry)) fail(`${k} must be { "value": … }`)
      const { value, source = 'owner' } = entry as { value: unknown; source?: unknown }
      if (source !== 'owner' && source !== 'google') fail(`${k}.source must be "owner" or "google"`)
      const v = clean(k as FieldName, value)
      // An empty owner answer clears the field; Google having nothing to say changes nothing.
      if (!isEmpty(v)) patch[k] = { value: v, source }
      else if (source === 'owner') patch[k] = null
    }
    return { patch: patch as Patch, suggestedByGoogle }
  } catch (e) {
    if (e instanceof BadInput) return { error: e.message }
    throw e
  }
}

/** Applies a validated patch. Owner input always beats Google: a Google value never replaces an owner's. */
export function mergeProfile(cur: Profile, patch: Patch, now: string, suggestedByGoogle?: string[]): Profile {
  const next: Record<string, unknown> = { ...cur }
  for (const k of Object.keys(patch) as FieldName[]) {
    const e = patch[k]
    if (e === undefined) continue
    if (e === null) { delete next[k]; continue }
    const source = e.source ?? 'owner'
    if (source === 'google' && cur[k]?.source === 'owner') continue
    next[k] = { value: e.value, source, confirmed: source === 'owner', updatedAt: now }
  }
  if (suggestedByGoogle) next.suggestedByGoogle = suggestedByGoogle
  return next as Profile
}
