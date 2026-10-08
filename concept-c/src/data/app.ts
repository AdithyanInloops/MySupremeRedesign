/**
 * App-only dummy data (notifications, delivery windows, rules). Catalog and account data are Concept A's
 * (`catalog.ts`, `account.ts`), copied unchanged so the app and the approved website tell the same story.
 */

export const DELIVERY_MINIMUM = 350
export const HST = 0.13
export const CUTOFF = '12 PM'

export type Slot = { id: string; day: string; date: string; window: string; note?: string }
/** NEW FEATURE — delivery windows per route (same data the website's delivery checker needs). */
export const deliverySlots: Slot[] = [
  { id: 's1', day: 'Today', date: 'Thu, Oct 8', window: '4–6 PM', note: 'Order by 12 PM' },
  { id: 's2', day: 'Tomorrow', date: 'Fri, Oct 9', window: '9–11 AM' },
  { id: 's3', day: 'Tomorrow', date: 'Fri, Oct 9', window: '2–4 PM' },
  { id: 's4', day: 'Saturday', date: 'Sat, Oct 10', window: '10 AM–12 PM' },
]

export type Notice = { id: string; kind: 'order' | 'deal' | 'account' | 'info'; title: string; body: string; time: string; href?: string; unread?: boolean }
export const notifications: Notice[] = [
  { id: 'n1', kind: 'order', title: 'Order #000131 is on the way', body: 'Driver Sam is 3 stops away. Arriving today 2–4 PM.', time: '12 min ago', href: '/orders/000131', unread: true },
  { id: 'n2', kind: 'deal', title: 'Weekly Hot Picks are live', body: 'Coke 32-pack $17.99 and Hass avocados $54 — ends Sunday.', time: '2 h ago', href: '/deals', unread: true },
  { id: 'n3', kind: 'account', title: 'Invoice INV-2041 is overdue', body: '$709.40 was due Sep 27. Pay now to keep your Net 30 terms.', time: 'Yesterday', href: '/account/credit', unread: true },
  { id: 'n4', kind: 'order', title: 'Order #000129 confirmed', body: 'Scheduled for Tue Oct 7, 9–11 AM.', time: 'Oct 3' },
  { id: 'n5', kind: 'info', title: 'Thanksgiving hours', body: 'Our Mississauga warehouse closes at 2 PM on Mon, Oct 12.', time: 'Oct 2' },
]

/** Quick reorder "usuals" (production: the buyer's most-ordered SKUs). */
export const usualSkus = ['A905', 'GR2210', 'FZ0101', 'MT0011', 'DA0044', 'GR1001']

export const demoAccount = { email: 'priya@spiceroutekitchen.ca', password: 'supreme2026' }
