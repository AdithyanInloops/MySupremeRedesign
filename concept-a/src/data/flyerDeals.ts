/**
 * Flyer deals for the flyer prototypes (brochure + menu-card pages). The live offers plus extra dummy deals
 * so each flyer fills its pages. Same Offer shape as `offers` — NEW FEATURE data, prices are dummy.
 */
import { img, offers, photo, productBySku, type Offer } from './catalog'

// Extra deals so each flyer fills its pages. Same Offer shape as the live data; prices are dummy.
export const extras: Offer[] = [
  { id: 'x1', deal: 'Monthly Flyer', sku: 'MT0080', offerPrice: 64.99, regular: 74.5, from: '2026-10-01', to: '2026-10-31', warehouses: ['mis', 'ham', 'nia'] },
  { id: 'x2', deal: 'Monthly Flyer', sku: 'FZ0311', offerPrice: 104.0, regular: 119.0, from: '2026-10-01', to: '2026-10-31', warehouses: ['mis', 'ham'] },
  { id: 'x3', deal: 'Monthly Flyer', sku: 'MT0045', offerPrice: 114.99, regular: 129.99, from: '2026-10-01', to: '2026-10-31', warehouses: ['mis', 'nia'] },
  { id: 'x4', deal: 'Weekly Hot Picks', sku: 'PR0222', offerPrice: 9.49, regular: 13.99, from: '2026-10-05', to: '2026-10-11', warehouses: ['mis', 'ham', 'nia'] },
  { id: 'x5', deal: 'Weekly Hot Picks', sku: 'PR0177', offerPrice: 23.99, regular: 27.99, from: '2026-10-05', to: '2026-10-11', warehouses: ['mis', 'ham', 'nia'] },
  { id: 'x6', deal: 'Weekly Hot Picks', sku: 'PR0140', offerPrice: 6.99, regular: 8.99, from: '2026-10-05', to: '2026-10-11', warehouses: ['mis', 'nia'] },
  { id: 'x7', deal: 'Monthly Flyer', sku: 'GR1001', offerPrice: 34.99, regular: 39.99, from: '2026-10-01', to: '2026-10-31', warehouses: ['mis', 'ham', 'nia'] },
  { id: 'x8', deal: 'Monthly Flyer', sku: 'DA0010', offerPrice: 17.49, regular: 19.99, from: '2026-10-01', to: '2026-10-31', warehouses: ['mis', 'ham', 'nia'] },
  { id: 'x9', deal: 'Weekly Hot Picks', sku: '59620000008478349', offerPrice: 6.99, regular: 8.5, from: '2026-10-05', to: '2026-10-11', warehouses: ['mis', 'ham'] },
  { id: 'x10', deal: 'Bulk Saver', sku: 'PK0912', offerPrice: 69.99, regular: 79.99, from: '2026-10-01', to: '2026-10-31', warehouses: ['mis', 'ham', 'nia'], note: '5+ cases' },
  { id: 'x11', deal: 'Bulk Saver', sku: 'JN0055', offerPrice: 39.99, regular: 46.99, from: '2026-10-01', to: '2026-10-31', warehouses: ['mis', 'ham', 'nia'], note: '5+ cases' },
  { id: 'x12', deal: 'Bulk Saver', sku: 'JN0090', offerPrice: 22.99, regular: 27.99, from: '2026-10-01', to: '2026-10-31', warehouses: ['mis', 'ham'], note: '5+ cases' },
  { id: 'x13', deal: 'Restaurant Bundles', sku: 'FZ0230', offerPrice: 15.99, regular: 18.99, from: '2026-10-01', to: '2026-10-31', warehouses: ['mis', 'ham', 'nia'], note: 'Biryani Station kit' },
  { id: 'x14', deal: 'Restaurant Bundles', sku: 'GR1022', offerPrice: 14.49, regular: 17.4, from: '2026-10-01', to: '2026-10-31', warehouses: ['mis', 'ham', 'nia'], note: 'Biryani Station kit' },
  { id: 'x15', deal: 'Restaurant Bundles', sku: 'PK5150', offerPrice: 27.99, regular: 32.5, from: '2026-10-01', to: '2026-10-31', warehouses: ['mis', 'nia'], note: 'Pizza Night kit' },
  { id: 'x16', deal: 'Restaurant Bundles', sku: 'GR3008', offerPrice: 15.99, regular: 18.5, from: '2026-10-01', to: '2026-10-31', warehouses: ['mis', 'ham', 'nia'], note: 'Burger Bar kit' },
  { id: 'x17', deal: 'Restaurant Bundles', sku: 'MT0080', offerPrice: 66.99, regular: 74.5, from: '2026-10-01', to: '2026-10-31', warehouses: ['mis', 'ham', 'nia'], note: 'Burger Bar kit' },
]
export const allDeals = [...offers, ...extras]
export const dealById = (id: string) => allDeals.find((o) => o.id === id)!

// Stand-in mood photos for products that have no photo yet, so the printed look holds up in the prototype.
export const standIn: Record<string, keyof typeof img> = {
  FZ0101: 'freezer', '59620000008252936': 'coke', GR2210: 'spread', A905: 'flatlay', DA0044: 'spread', PK1120: 'cafe',
  PK0912: 'chef', JN0055: 'cleaning', JN0090: 'cleaning', FZ0230: 'bowl', GR1022: 'rice', PK5150: 'restaurant', GR3008: 'burger',
}
export const dealPhoto = (o: Offer, w = 600) => productBySku(o.sku)?.images[0] ?? photo(standIn[o.sku] ?? 'aisle', w, w)
export const pctOff = (o: Offer) => Math.round((1 - o.offerPrice / o.regular) * 100)
