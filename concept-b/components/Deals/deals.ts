import offersJson from '../../data/offers.json'
import { products, regularPrice, type Product } from '../../lib/data'
import { colors } from '../../lib/theme'
import { CalendarIcon, FlameIcon, BoxIcon, UtensilsIcon, type IconComponent } from '../ui/icons'
import { dealTypes, type DealTypeId } from '../Pages/FlyersOffers/flyersOffersData'

/*
 * Shared deal helpers for the home "This week's deals" block and the Flyers & Offers page.
 * NEW FEATURE data: offer entity (deal type, sku, offer price, valid from/to, warehouses) — data/offers.json.
 */

export type Offer = { id: string; deal_type: string; sku: string; offer_price: number; valid_from: string; valid_to: string; note?: string; warehouses?: string[] }
export type Deal = { offer: Offer; product: Product; type: DealTypeId; save: number; pct: number }

export const allOffers = offersJson.offers as Offer[]

const TYPE_OF: Record<string, DealTypeId> = { 'Monthly Flyer': 'monthly', 'Weekly Hot Pick': 'weekly', 'Bulk Saver': 'bulk', 'Restaurant Bundle': 'bundle' }
export const typeOf = (o: Offer): DealTypeId => TYPE_OF[o.deal_type] ?? 'monthly'

/** Flyer colours per deal type — the printed-flyer look. Text colours are chosen for AA on each background. */
export const dealStyle: Record<DealTypeId, { bg: string; fg: string; icon: IconComponent }> = {
  weekly: { bg: colors.red, fg: '#fff', icon: FlameIcon },
  monthly: { bg: colors.ink, fg: '#fff', icon: CalendarIcon },
  bulk: { bg: colors.yellow, fg: colors.ink, icon: BoxIcon },
  bundle: { bg: colors.navy, fg: '#fff', icon: UtensilsIcon },
}

export const dealLabel = (t: DealTypeId) => dealTypes.find((d) => d.id === t)?.label ?? ''

export function toDeal(o: Offer): Deal | null {
  const product = products.find((p) => p.sku === o.sku)
  if (!product) return null
  const regular = regularPrice(product)
  const save = Math.max(0, regular - o.offer_price)
  return { offer: o, product, type: typeOf(o), save, pct: regular ? Math.round((save / regular) * 100) : 0 }
}

export const dealsAt = (warehouseId?: string) =>
  allOffers.filter((o) => !warehouseId || !o.warehouses || o.warehouses.includes(warehouseId)).map(toDeal).filter((d): d is Deal => !!d)

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const parts = (iso: string) => iso.split('-').map(Number) as [number, number, number]

/** "2026-10-12" → "Mon, Oct 12" without timezone drift between server and browser. */
export const shortDate = (iso: string) => {
  const [y, m, d] = parts(iso)
  return `${DAYS[new Date(y, m - 1, d).getDay()]}, ${MONTHS[m - 1]} ${d}`
}

/** "Oct 6 – 12" or "Oct 28 – Nov 3". */
export const dateRange = (from: string, to: string) => {
  const [, m1, d1] = parts(from)
  const [, m2, d2] = parts(to)
  return m1 === m2 ? `${MONTHS[m1 - 1]} ${d1} – ${d2}` : `${MONTHS[m1 - 1]} ${d1} – ${MONTHS[m2 - 1]} ${d2}`
}

/** End of the offer's last day, local time. */
export const endsAt = (iso: string) => {
  const [y, m, d] = parts(iso)
  return new Date(y, m - 1, d, 23, 59, 59).getTime()
}
