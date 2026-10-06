/**
 * Placeholder data for the Flyers & Offers page.
 *
 * Everything in this file is dummy content until offers are managed in the CMS. The types describe
 * the fields the CMS will need to provide, so the page can switch to real data without UI changes.
 */

export type Warehouse = {
  id: string
  name: string
  area: string
}

export type DealTypeId = 'monthly' | 'weekly' | 'bulk' | 'bundle'

export type DealType = {
  id: DealTypeId
  label: string
  description: string
  /** Big statement shown in the deal showcase. */
  headline: string
  image: string
  /** Showcase panel colours. */
  background: string
  color: string
}

export type Offer = {
  id: string
  /** Warehouses where this offer applies. */
  warehouseIds: string[]
  dealType: DealTypeId
  category: string
  title: string
  /** Short teaser shown until prices are published, e.g. "Bigger packs, lower price per unit". */
  teaser: string
  image: string
}

// TODO: replace with the real warehouse list.
export const warehouses: Warehouse[] = [
  { id: 'mississauga', name: 'Mississauga', area: 'Peel & West GTA' },
  { id: 'hamilton', name: 'Hamilton', area: 'Hamilton & Burlington' },
  { id: 'niagara', name: 'Niagara', area: 'St. Catharines & Niagara' },
]

export const dealTypes: DealType[] = [
  {
    id: 'monthly',
    label: 'Monthly Flyer',
    description: 'Fresh savings every month across every department.',
    headline: 'A new flyer, every month.',
    image: '/assets/grocery.png',
    background: '#0C0C0C',
    color: '#fff',
  },
  {
    id: 'weekly',
    label: 'Weekly Hot Picks',
    description: 'A handful of short, sharp deals that change every week.',
    headline: 'Hot picks that change weekly.',
    image: '/assets/frozen.png',
    background: '#FF0000',
    color: '#fff',
  },
  {
    id: 'bulk',
    label: 'Bulk Saver',
    description: 'Buy more cases, pay less per case.',
    headline: 'Stock up. Save more.',
    image: '/assets/beverages.png',
    background: '#FFD600',
    color: '#0C0C0C',
  },
  {
    id: 'bundle',
    label: 'Restaurant Bundles',
    description: 'Everything a kitchen needs, packed together for one price.',
    headline: 'Your kitchen, bundled.',
    image: '/assets/packaging.png',
    background: '#2d297d',
    color: '#fff',
  },
]

const all = warehouses.map((w) => w.id)

export const offers: Offer[] = [
  {
    id: 'm1',
    warehouseIds: all,
    dealType: 'monthly',
    category: 'Packaging',
    title: 'Takeout containers & bags',
    teaser: 'Stock up on everyday takeout essentials',
    image: '/assets/packaging.png',
  },
  {
    id: 'm2',
    warehouseIds: all,
    dealType: 'monthly',
    category: 'Beverage',
    title: 'Soft drinks & juices',
    teaser: 'Case deals on your best sellers',
    image: '/assets/beverages.png',
  },
  {
    id: 'm3',
    warehouseIds: ['mississauga', 'hamilton'],
    dealType: 'monthly',
    category: 'Grocery',
    title: 'Rice, oil & pantry staples',
    teaser: 'Big-bag savings for busy kitchens',
    image: '/assets/grocery.png',
  },
  {
    id: 'm4',
    warehouseIds: ['mississauga', 'niagara'],
    dealType: 'monthly',
    category: 'Dairy & Eggs',
    title: 'Cheese, butter & eggs',
    teaser: 'Fresh dairy at warehouse prices',
    image: '/assets/dairyandeggs.png',
  },
  {
    id: 'w1',
    warehouseIds: all,
    dealType: 'weekly',
    category: 'Frozen',
    title: 'Fries & frozen appetizers',
    teaser: 'This week only',
    image: '/assets/frozen.png',
  },
  {
    id: 'w2',
    warehouseIds: ['mississauga', 'hamilton'],
    dealType: 'weekly',
    category: 'Meat & Poultry',
    title: 'Chicken & meat cuts',
    teaser: 'Limited quantities each week',
    image: '/assets/meat-slices.png',
  },
  {
    id: 'w3',
    warehouseIds: ['niagara'],
    dealType: 'weekly',
    category: 'Bakery',
    title: 'Breads & baked goods',
    teaser: 'Weekend baking specials',
    image: '/assets/bakery.png',
  },
  {
    id: 'b1',
    warehouseIds: all,
    dealType: 'bulk',
    category: 'Janitorial',
    title: 'Cleaning supplies',
    teaser: 'Save more on every extra case',
    image: '/assets/cleaning.png',
  },
  {
    id: 'b2',
    warehouseIds: ['mississauga', 'niagara'],
    dealType: 'bulk',
    category: 'Beverage',
    title: 'Bottled water by the pallet',
    teaser: 'Tiered pricing from 5 cases',
    image: '/assets/beverages.png',
  },
  {
    id: 'b3',
    warehouseIds: ['hamilton'],
    dealType: 'bulk',
    category: 'Packaging',
    title: 'Cups, lids & cutlery',
    teaser: 'Bigger packs, lower price per unit',
    image: '/assets/packaging.png',
  },
  {
    id: 'r1',
    warehouseIds: all,
    dealType: 'bundle',
    category: 'Bundle',
    title: 'Takeout starter kit',
    teaser: 'Containers, napkins, cutlery & bags',
    image: '/assets/packaging.png',
  },
  {
    id: 'r2',
    warehouseIds: ['mississauga', 'hamilton'],
    dealType: 'bundle',
    category: 'Bundle',
    title: 'Fresh produce box',
    teaser: 'A weekly mix for your prep line',
    image: '/assets/veg-produce.jpg',
  },
]
