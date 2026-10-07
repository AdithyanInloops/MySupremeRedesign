/**
 * Form rules shared by checkout, sign-in and contact forms. Every message says what's wrong and how to fix it.
 * Production: the same rules as zod schemas (the live site uses react-hook-form + zod).
 */
import type { Address } from './session'

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
export const digits = (v: string) => v.replace(/\D/g, '')
export const POSTAL_RE = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/

export function emailError(v: string) {
  if (!v.trim()) return 'Enter your email address so we can send your order confirmation.'
  if (!isEmail(v)) return 'Enter an email address like name@restaurant.ca.'
  return ''
}

export function phoneError(v: string) {
  const d = digits(v)
  if (!d) return 'Enter a phone number so the driver can reach you.'
  if (d.length !== 10 && !(d.length === 11 && d.startsWith('1'))) return 'Enter a 10-digit phone number, e.g. 905-555-0142.'
  return ''
}

export function postalError(v: string) {
  if (!v.trim()) return 'Enter your postal code.'
  if (!POSTAL_RE.test(v.trim())) return 'Enter a postal code in the format L5L 0A2.'
  return ''
}

export const formatPostal = (v: string) => {
  const c = v.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)
  return c.length > 3 ? `${c.slice(0, 3)} ${c.slice(3)}` : c
}

export function addressErrors(a: Address, opts: { requireBusiness?: boolean } = {}): Partial<Record<keyof Address, string>> {
  const e: Partial<Record<keyof Address, string>> = {}
  if (opts.requireBusiness !== false && !a.business.trim()) e.business = 'Enter your business name as it should appear on the invoice.'
  if (!a.contact.trim()) e.contact = 'Enter the name of the person receiving the order.'
  const p = phoneError(a.phone)
  if (p) e.phone = p
  if (!a.street.trim()) e.street = 'Enter the street address, e.g. 2150 Dundas St W.'
  if (!a.city.trim()) e.city = 'Enter the city.'
  const pc = postalError(a.postal)
  if (pc) e.postal = pc
  return e
}

/** Luhn check for the prototype card form (production: Stripe Elements validates the card). */
export function luhn(num: string) {
  const d = digits(num)
  if (d.length < 13) return false
  let sum = 0
  for (let i = 0; i < d.length; i++) {
    let n = Number(d[d.length - 1 - i])
    if (i % 2) { n *= 2; if (n > 9) n -= 9 }
    sum += n
  }
  return sum % 10 === 0
}
