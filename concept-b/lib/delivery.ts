import zonesJson from '../data/delivery-zones.json'

/*
 * Delivery zones by postal-code prefix (FSA) with next route, window and cut-off.
 * NEW FEATURE — prototype data in data/delivery-zones.json.
 */

export type DeliveryZone = { id: string; region: string; name: string; prefixes: string[]; next_delivery: string; window: string; cutoff: string }
export type DeliveryZones = { pickup: { name: string; address: string; hours: string }; zones: DeliveryZone[] }
export type PostalResult = { kind: 'in'; zone: DeliveryZone; postal: string } | { kind: 'out'; postal: string } | { kind: 'invalid' }

export const zones = zonesJson as DeliveryZones

const POSTAL = /^[A-Z]\d[A-Z](\s?\d[A-Z]\d)?$/

export function checkPostal(input: string, data: DeliveryZones = zones): PostalResult {
  const postal = input.trim().toUpperCase().replace(/\s+/g, ' ')
  if (!POSTAL.test(postal)) return { kind: 'invalid' }
  const compact = postal.replace(' ', '')
  let best: { zone: DeliveryZone; len: number } | undefined
  for (const zone of data.zones) {
    for (const pre of zone.prefixes) if (compact.startsWith(pre) && (!best || pre.length > best.len)) best = { zone, len: pre.length }
  }
  return best ? { kind: 'in', zone: best.zone, postal } : { kind: 'out', postal }
}

/** Delivery windows offered at checkout for a postal code (next route day + the one after). */
export function slotsFor(postal: string) {
  const r = checkPostal(postal)
  if (r.kind !== 'in') return []
  return [
    { id: 'next', label: `${r.zone.next_delivery}, ${r.zone.window}`, note: `Order by ${r.zone.cutoff}` },
    { id: 'following', label: `Following route day, ${r.zone.window}`, note: 'If your receiving dock is closed on the first date' },
  ]
}
