/** Dummy signed-in business customer, mirrors Magento customer + credit module fields. */

export const customer = {
  firstName: 'Priya',
  lastName: 'Raman',
  email: 'priya@spiceroutekitchen.ca',
  phone: '+1 905-555-0182',
  businessName: 'Spice Route Kitchen',
  businessCategory: 'Restaurant — Full service',
  businessStructure: 'Corporation',
  hst: '78452 1190 RT0001',
  memberSince: '2023-04-12',
}

export const credit = {
  limit: 10000,
  available: 7450,
  outstanding: 2550,
  due: 1840.6,
  overdue: 709.4,
  terms: 'Net 30',
}

export type Address = {
  id: string
  name: string
  company: string
  street: string
  city: string
  province: string
  postal: string
  phone: string
  defaultShipping?: boolean
  defaultBilling?: boolean
  inArea?: boolean
}

export const addresses: Address[] = [
  { id: 'a1', name: 'Priya Raman', company: 'Spice Route Kitchen', street: '2150 Burnhamthorpe Rd W, Unit 4', city: 'Mississauga', province: 'ON', postal: 'L5L 5Z5', phone: '+1 905-555-0182', defaultShipping: true, defaultBilling: true, inArea: true },
  { id: 'a2', name: 'Arjun Mehta', company: 'Spice Route Kitchen — Commissary', street: '88 King St E', city: 'Hamilton', province: 'ON', postal: 'L8N 1A7', phone: '+1 905-555-0140', inArea: true },
  { id: 'a3', name: 'Priya Raman', company: 'Spice Route Pop-up', street: '211 Queen St', city: 'Ottawa', province: 'ON', postal: 'K1P 5C7', phone: '+1 613-555-0119', inArea: false },
]

export type OrderStatus = 'Pending' | 'Confirmed' | 'On the way' | 'Delivered' | 'Cancelled'
export type Order = {
  number: string
  date: string
  channel: 'Online' | 'Direct store'
  status: OrderStatus
  items: { sku: string; qty: number; price: number }[]
  subtotal: number
  tax: number
  delivery: number
  total: number
  eta?: string
}

const ord = (number: string, date: string, channel: Order['channel'], status: OrderStatus, items: Order['items'], delivery = 0, eta?: string): Order => {
  const subtotal = +items.reduce((a, i) => a + i.qty * i.price, 0).toFixed(2)
  const tax = +(subtotal * 0.13).toFixed(2)
  return { number, date, channel, status, items, subtotal, tax, delivery, total: +(subtotal + tax + delivery).toFixed(2), eta }
}

export const orders: Order[] = [
  ord('000131', '2026-10-05', 'Online', 'On the way', [{ sku: 'A905', qty: 4, price: 64.99 }, { sku: 'GR2210', qty: 2, price: 54.99 }, { sku: 'FZ0101', qty: 3, price: 52.99 }], 0, 'Today, 2–4 PM'),
  ord('000129', '2026-10-03', 'Online', 'Confirmed', [{ sku: 'MT0011', qty: 2, price: 96.0 }, { sku: 'DA0044', qty: 2, price: 49.99 }], 0, 'Tue Oct 7, 9–11 AM'),
  ord('000127', '2026-09-30', 'Direct store', 'Delivered', [{ sku: 'GR1001', qty: 3, price: 39.99 }, { sku: 'GR1022', qty: 2, price: 17.4 }, { sku: 'GR1047', qty: 4, price: 9.99 }]),
  ord('000123', '2026-09-26', 'Online', 'Delivered', [{ sku: '59620000008252936', qty: 6, price: 20.99 }, { sku: 'BW0028', qty: 10, price: 1.99 }, { sku: 'BM0089', qty: 4, price: 12.29 }, { sku: '59620000008478349', qty: 4, price: 8.5 }, { sku: 'PK1120', qty: 2, price: 58.49 }], 0),
  ord('000119', '2026-09-20', 'Online', 'Pending', [{ sku: 'JN0012', qty: 1, price: 88.0 }, { sku: 'JN0055', qty: 2, price: 46.99 }], 15),
  ord('000114', '2026-09-12', 'Direct store', 'Delivered', [{ sku: 'PR0301', qty: 2, price: 34.99 }, { sku: 'PR0333', qty: 1, price: 22.5 }]),
  ord('000108', '2026-09-03', 'Online', 'Cancelled', [{ sku: 'DA0090', qty: 2, price: 64.5 }]),
]

export type DocStatus = 'Paid' | 'Partial' | 'Overdue'
export const invoices = [
  { number: 'INV-2047', date: '2026-10-05', due: '2026-11-04', amount: 482.16, balance: 482.16, status: 'Partial' as DocStatus, order: '000131' },
  { number: 'INV-2044', date: '2026-10-03', due: '2026-11-02', amount: 329.94, balance: 329.94, status: 'Partial' as DocStatus, order: '000129' },
  { number: 'INV-2041', date: '2026-08-28', due: '2026-09-27', amount: 709.4, balance: 709.4, status: 'Overdue' as DocStatus, order: '000098' },
  { number: 'INV-2036', date: '2026-09-26', due: '2026-10-26', amount: 342.17, balance: 0, status: 'Paid' as DocStatus, order: '000123' },
  { number: 'INV-2030', date: '2026-09-20', due: '2026-10-20', amount: 221.9, balance: 120.0, status: 'Partial' as DocStatus, order: '000119' },
  { number: 'INV-2022', date: '2026-09-12', due: '2026-10-12', amount: 104.5, balance: 0, status: 'Paid' as DocStatus, order: '000114' },
]

export const payments = [
  { number: 'PAY-1188', date: '2026-10-01', method: 'Visa •••• 4242', amount: 342.17, applied: 'INV-2036' },
  { number: 'PAY-1179', date: '2026-09-24', method: 'EFT / Bank transfer', amount: 101.9, applied: 'INV-2030' },
  { number: 'PAY-1160', date: '2026-09-14', method: 'Cash — Mississauga store', amount: 104.5, applied: 'INV-2022' },
]

export const quotes = [
  { number: 'QT-0412', date: '2026-10-02', amount: 2140.0, status: 'Open', title: 'Thanksgiving catering — 300 covers', validTo: '2026-10-16' },
  { number: 'QT-0398', date: '2026-09-15', amount: 864.5, status: 'Accepted', title: 'Monthly packaging restock', validTo: '2026-09-29' },
]

export const creditNotes = [
  { number: 'CN-0077', date: '2026-09-28', amount: 64.5, reason: 'Damaged on delivery — eggs (2 cases)', status: 'Applied' },
]

export const statements = [
  { period: 'September 2026', opening: 1220.4, charges: 1876.21, payments: 548.57, closing: 2548.04 },
  { period: 'August 2026', opening: 640.0, charges: 1610.9, payments: 1030.5, closing: 1220.4 },
]
