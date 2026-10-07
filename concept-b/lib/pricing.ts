import { finalPrice, productBySku } from './data'

/**
 * Order maths shared by the cart, checkout and success pages. In production every number here comes from the
 * Magento cart (prices, coupon rules, tax rules, shipping methods); the prototype estimates them the same way.
 */

/** Live rule: "Delivery available for orders above $350 CAD". Production: Magento store config / shipping rule. */
export const DELIVERY_MINIMUM = 350
/** Next-day order cut-off shown across the site (to be confirmed by operations). */
export const CUTOFF = '2 PM'
export const HST_RATE = 0.13
/** Basic groceries are zero-rated in Ontario; these departments carry HST. Production: Magento tax classes. */
const TAXABLE_DEPARTMENTS = new Set(['packaging', 'janitorial', 'ware-equipment'])

/** Prototype coupon. Production: Magento cart price rules (applyCouponToCart). */
export const DEMO_COUPONS: Record<string, { percent: number; label: string }> = {
  SUPREME10: { percent: 10, label: '10% off your order' },
}

export type Coupon = { code: string; percent: number; label: string }
export type Method = 'delivery' | 'pickup'
export type Line = { sku: string; qty: number }

export function totals(lines: Line[], opts: { coupon?: Coupon | null; method?: Method } = {}) {
  let subtotal = 0
  let taxable = 0
  for (const l of lines) {
    const p = productBySku(l.sku)
    if (!p) continue
    const row = finalPrice(p) * l.qty
    subtotal += row
    if (TAXABLE_DEPARTMENTS.has(p.department)) taxable += row
  }
  const pct = opts.coupon?.percent ?? 0
  const discount = round(subtotal * (pct / 100))
  const tax = round(taxable * (1 - pct / 100) * HST_RATE)
  const deliveryEligible = subtotal >= DELIVERY_MINIMUM
  const total = round(subtotal - discount + tax)
  return { subtotal: round(subtotal), discount, tax, total, deliveryEligible, remaining: round(Math.max(0, DELIVERY_MINIMUM - subtotal)) }
}

const round = (n: number) => Math.round(n * 100) / 100

export function checkCoupon(input: string): { ok: true; coupon: Coupon } | { ok: false; error: string } {
  const code = input.trim().toUpperCase()
  if (!code) return { ok: false, error: 'Enter a coupon code.' }
  const c = DEMO_COUPONS[code]
  if (!c) return { ok: false, error: `“${code}” isn’t a valid code. Check the spelling, or try SUPREME10 in this prototype.` }
  return { ok: true, coupon: { code, ...c } }
}
