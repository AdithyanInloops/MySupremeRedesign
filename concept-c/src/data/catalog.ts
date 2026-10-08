/**
 * Dummy catalog. Field names mirror what Magento / GraphCommerce returns — nothing here is invented
 * except items explicitly flagged `newFeature` (warehouses, offers, per-unit price, delivery cut-off).
 */

const u = (id: string, w = 800, h?: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ''}&q=70`

export const img = {
  chef: 'photo-1600565193348-f74bd3c7ccdf',
  market: 'photo-1488459716781-31db52582fe9',
  produceWall: 'photo-1542838132-92c53300491e',
  produceStall: 'photo-1550989460-0adf9ea622e2',
  restaurant: 'photo-1517248135467-4c7edcad34c4',
  cafe: 'photo-1544148103-0773bf10d330',
  fineDining: 'photo-1414235077428-338989a2e8c0',
  meat: 'photo-1607623814075-e51df1bdc82f',
  milk: 'photo-1563636619-e9143da7973b',
  bowl: 'photo-1546069901-ba9599a7e63c',
  fruit: 'photo-1610832958506-aa56368176cf',
  fridge: 'photo-1584568694244-14fbdf83bd30',
  coke: 'photo-1622483767028-3f66f32aef97',
  steak: 'photo-1600891964092-4316c288032e',
  rice: 'photo-1586201375761-83865001e31c',
  cherry: 'photo-1559181567-c3190ca9959b',
  cleaning: 'photo-1581578731548-c64695cc6952',
  flatlay: 'photo-1606787366850-de6330128bfc',
  aisle: 'photo-1534723452862-4c874018d66d',
  burger: 'photo-1571091718767-18b5b1457add',
  watermelon: 'photo-1587049352846-4a222e784d38',
  freezer: 'photo-1601599561213-832382fd07ba',
  shake: 'photo-1553787499-6f9133860278',
  avocado: 'photo-1620706857370-e1b9770e8bb1',
  salmon: 'photo-1574484284002-952d92456975',
  spread: 'photo-1504674900247-0877df9cc836',
  banana: 'photo-1528825871115-3581a5387919',
}
export const photo = (key: keyof typeof img, w = 800, h?: number) => u(img[key], w, h)

/* ------------------------------------------------------------------ Categories */

export type SubCategory = { name: string; slug: string; count: number; children?: { name: string; slug: string; count: number }[] }
export type Department = {
  id: string
  name: string
  slug: string
  count: number
  image?: string
  tagline: string
  children: SubCategory[]
}

const s = (name: string, count: number, children?: [string, number][]): SubCategory => ({
  name,
  slug: name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  count,
  children: children?.map(([n, c]) => ({ name: n, slug: n.toLowerCase().replace(/[^a-z0-9]+/g, '-'), count: c })),
})

export const departments: Department[] = [
  {
    id: 'packaging', name: 'Packaging', slug: 'packaging', count: 1672, image: photo('bowl', 600, 600), tagline: 'Take-out, containers & disposables',
    children: [
      s('Take-out Containers', 412, [['Clamshells', 96], ['Microwavable', 74], ['Aluminium Trays', 61], ['Soup Containers', 48], ['Sushi Trays', 22]]),
      s('Cups & Lids', 236, [['Hot Cups', 88], ['Cold Cups', 71], ['Lids', 77]]),
      s('Cutlery & Straws', 148, [['Wrapped Cutlery', 52], ['Wooden', 31], ['Paper Straws', 19]]),
      s('Bags', 190, [['Paper Bags', 84], ['T-Shirt Bags', 43], ['Pizza Boxes', 63]]),
      s('Foil & Film', 77, [['Aluminium Foil', 26], ['Cling Film', 21], ['Parchment', 30]]),
      s('Napkins & Tissue', 98),
      s('Eco-friendly', 211, [['Compostable', 120], ['Bagasse', 54], ['Kraft', 37]]),
      s('Gloves & Aprons', 64),
      s('Labels & Tape', 39),
      s('Catering Platters', 52),
      s('Bakery Boxes', 81),
      s('Deli & Portion Cups', 64),
    ],
  },
  {
    id: 'grocery', name: 'Grocery', slug: 'grocery', count: 1686, image: photo('rice', 600, 600), tagline: 'Rice, spices, oils & dry goods',
    children: [
      s('Rice & Grains', 164, [['Basmati', 42], ['Bulk Rice', 37], ['Lentils & Dal', 58]]),
      s('Spices & Seasonings', 318, [['Whole Spices', 104], ['Ground Spices', 142], ['Masala Blends', 72]]),
      s('Oils & Ghee', 96, [['Canola', 21], ['Olive Oil', 28], ['Ghee', 17]]),
      s('Sauces & Condiments', 241, [['Hot Sauce', 61], ['Ketchup & Mustard', 38], ['Asian Sauces', 72]]),
      s('Canned & Jarred', 188),
      s('Flour & Baking', 132),
      s('Plant Based', 74, [['Bulk Rice', 12], ['Plant Milk', 19], ['Meat Alternatives', 14]]),
      s('Snacks & Confectionery', 205),
      s('Coconut Products', 38),
      s('Pasta & Noodles', 112),
      s('Sugar & Sweeteners', 49),
      s('Pickles & Chutneys', 69),
    ],
  },
  {
    id: 'beverage', name: 'Beverage', slug: 'beverage', count: 312, image: photo('coke', 600, 600), tagline: 'Soft drinks, syrups, coffee & tea',
    children: [
      s('Soft Drinks', 74, [['Cans', 41], ['Bottles', 33]]),
      s('Water', 26),
      s('Syrups & Mixers', 88, [['Monin Syrups', 46], ['Cocktail Mixers', 24], ['Purées', 18]]),
      s('Coffee & Tea', 71, [['Whiteners', 9], ['Instant Tea', 14], ['Coffee Beans', 22]]),
      s('Juices', 53),
    ],
  },
  {
    id: 'janitorial', name: 'Janitorial', slug: 'janitorial', count: 263, image: photo('cleaning', 600, 600), tagline: 'Cleaning, sanitation & paper',
    children: [s('Cleaning Chemicals', 88), s('Dish & Laundry', 41), s('Paper Towels & Tissue', 52), s('Garbage Bags', 37), s('Mops & Brooms', 45)],
  },
  {
    id: 'produce', name: 'Produce', slug: 'produce', count: 184, image: photo('produceStall', 600, 600), tagline: 'Fresh fruit, vegetables & herbs',
    children: [s('Vegetables', 92), s('Fruit', 54), s('Fresh Herbs', 22), s('Pre-cut & Prepared', 16)],
  },
  {
    id: 'dairy-eggs', name: 'Dairy & Eggs', slug: 'dairy-eggs', count: 143, image: photo('milk', 600, 600), tagline: 'Milk, cheese, butter & eggs',
    children: [s('Milk & Cream', 36), s('Cheese', 58), s('Butter & Margarine', 19), s('Eggs', 12), s('Yogurt & Paneer', 18)],
  },
  {
    id: 'frozen', name: 'Frozen', slug: 'frozen', count: 221, image: photo('freezer', 600, 600), tagline: 'Fries, breads, seafood & desserts',
    children: [s('Fries & Potatoes', 34), s('Frozen Breads', 41), s('Seafood', 46), s('Vegetables', 38), s('Desserts', 29), s('Appetizers', 33)],
  },
  {
    id: 'meat-poultry', name: 'Meat & Poultry', slug: 'meat-poultry', count: 118, image: photo('meat', 600, 600), tagline: 'Halal chicken, beef, lamb & goat',
    children: [s('Chicken', 44), s('Beef', 27), s('Lamb & Goat', 21), s('Deli Meats', 26)],
  },
  {
    id: 'ware-equipment', name: 'Ware & Equipment', slug: 'ware-equipment', count: 96, tagline: 'Smallwares, pans & storage',
    // No image on purpose — exercises the category tile fallback.
    children: [s('Smallwares', 38), s('Cookware', 24), s('Food Storage', 21), s('Bar Supplies', 13)],
  },
]

export const deptBySlug = (slug?: string) => departments.find((d) => d.slug === slug)

/* ------------------------------------------------------------------ Brands */

export const brands = [
  'Monin', 'Coca Cola', 'Nestle', 'Finest Call', 'Aroy-D', 'Element O', 'Eco-Craze', 'Dart', 'Tilda', 'Shan',
  'MDH', 'Heinz', 'McCain', 'Saputo', 'Lactantia', 'Maple Leaf', 'Kikkoman', 'Lee Kum Kee', 'Ecolab', 'Kruger',
  'Royal Chef', 'Cambro', 'Lipton', 'Pepsi', 'Rubbermaid', 'Huy Fong', 'Barilla', 'Gay Lea',
].map((name) => ({ name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') }))

/* ------------------------------------------------------------------ Products */

export type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'
export type ProductType = 'simple' | 'configurable' | 'grouped'

export type Product = {
  sku: string
  slug: string
  name: string
  brand: string
  pack: string // free-text pack size, exactly as Magento stores it
  price: number
  regular?: number // only when on sale
  groupPrice?: number // customer-group price shown after sign-in
  dept: string
  sub: string
  images: string[]
  stock: StockStatus
  type: ProductType
  rating: number
  reviews: number
  isNew?: boolean
  recommended?: boolean
  unit?: string // NEW FEATURE — per-unit price label e.g. "$0.66 / can"
}

let n = 0
const p = (
  sku: string, name: string, brand: string, pack: string, price: number, dept: string, sub: string,
  extra: Partial<Product> = {},
): Product => {
  n += 1
  return {
    sku, name, brand, pack, price, dept, sub,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 60) + '-' + sku.slice(-4).toLowerCase(),
    images: [],
    stock: 'IN_STOCK',
    type: 'simple',
    rating: [4.6, 4.2, 0, 4.8, 3.9, 4.4, 0, 5][n % 8],
    reviews: [18, 7, 0, 42, 3, 11, 0, 2][n % 8],
    ...extra,
  }
}

export const products: Product[] = [
  // The 8 real sample products from the brief (guest prices, CAD, 2026-10-01)
  p('59620000008478349', 'Monin - Lime Syrup 1 Lt', 'Monin', '1ltr', 8.5, 'beverage', 'Syrups & Mixers', { images: [photo('shake', 700, 700), photo('cafe', 700, 700)], recommended: true, groupPrice: 7.95 }),
  p('59620000008478332', 'Finest Call - Margarita 6X1 Lt', 'Finest Call', '6X1 Lt in a case', 48.99, 'beverage', 'Syrups & Mixers', { recommended: true, groupPrice: 45.5, unit: '$8.17 / Lt' }),
  p('59620000008252936', 'Coca Cola - Coke - Original - Cans-32-355ml', 'Coca Cola', '32x355ml', 20.99, 'beverage', 'Soft Drinks', { recommended: true, regular: 24.99, unit: '$0.66 / can' }),
  p('BM0089', 'Monin - Salted Caramel syrup', 'Monin', '1ltr', 12.29, 'beverage', 'Syrups & Mixers', { recommended: true, stock: 'LOW_STOCK' }),
  p('HD0031', 'Nestle - Coffee/Tea Whitener - Everyday 1.8 kg', 'Nestle', '1.8 kg', 35.5, 'beverage', 'Coffee & Tea', { recommended: true, groupPrice: 33.75 }),
  p('HD0030', 'Nestle - everyday Kashmiri Tea (10 sticks)', 'Nestle', '10x20g', 6.5, 'beverage', 'Coffee & Tea', { recommended: true }),
  p('BW0028', 'Element O Water - 1Lt', 'Element O', '24x1L in a case', 1.99, 'beverage', 'Water', { recommended: true, unit: '$0.08 / L' }),
  p('CD0219', 'Aroy-D - Coconut Milk', 'Aroy-D', '400 ml', 2.5, 'grocery', 'Coconut Products', { recommended: true, stock: 'OUT_OF_STOCK' }),

  // Packaging — long names, messy dimensions
  p('A905', 'Eco-Craze – MFPP Clamshell Vented Cont. – 9"x5.5"x2.6" – A905', 'Eco-Craze', '150 ct', 64.99, 'packaging', 'Take-out Containers', { isNew: true, recommended: true, regular: 72.5 }),
  p('PK1120', 'Dart - 16 oz Foam Hot Cup - White', 'Dart', '1000 ct', 58.49, 'packaging', 'Cups & Lids', { unit: '$0.06 / cup' }),
  p('PK2241', 'Kraft Paper Bag with Handles – Large 16"x6"x12"', 'Eco-Craze', '250 ct', 71.99, 'packaging', 'Bags', { isNew: true }),
  p('PK0778', 'Aluminium Container Oblong 2.25 lb with Board Lid', 'Royal Chef', '500 ct', 89.0, 'packaging', 'Take-out Containers', { type: 'configurable', isNew: true }),
  p('PK3310', 'Bagasse 3-Compartment Plate 10"', 'Eco-Craze', '500 ct', 54.25, 'packaging', 'Eco-friendly', {}),
  p('PK0912', 'Nitrile Gloves - Powder Free - Black', 'Royal Chef', '10x100 ct', 79.99, 'packaging', 'Gloves & Aprons', { type: 'configurable', recommended: true }),
  p('PK4402', 'Soup Container Combo 16 oz + Lid (Microwavable)', 'Dart', '240 sets', 38.75, 'packaging', 'Take-out Containers', {}),
  p('PK5150', 'Pizza Box Corrugated Kraft 14"', 'Royal Chef', '50 ct', 32.5, 'packaging', 'Bags', { stock: 'LOW_STOCK' }),

  // Grocery
  p('GR1001', 'Tilda - Pure Basmati Rice 20 lb', 'Tilda', '20 lb', 39.99, 'grocery', 'Rice & Grains', { images: [photo('rice', 700, 700)], recommended: true, groupPrice: 36.99 }),
  p('GR1022', 'Shan - Biryani Masala (Pack of 12)', 'Shan', '12x50g', 17.4, 'grocery', 'Spices & Seasonings', {}),
  p('GR1047', 'MDH - Deggi Mirch 500g', 'MDH', '500 g', 9.99, 'grocery', 'Spices & Seasonings', { isNew: true }),
  p('GR2210', 'Canola Oil - Jug 16 L', 'Royal Chef', '16 L', 54.99, 'grocery', 'Oils & Ghee', { regular: 61.99, recommended: true }),
  p('GR3008', 'Heinz - Ketchup Dispenser Pack 1.5 L', 'Heinz', '2x1.5 L', 18.5, 'grocery', 'Sauces & Condiments', {}),
  p('GR3091', 'Kikkoman - Naturally Brewed Soy Sauce 1.89 L', 'Kikkoman', '6x1.89 L in a case', 68.0, 'grocery', 'Sauces & Condiments', {}),
  p('GR3150', 'Huy Fong - Sriracha Hot Chili Sauce 28 oz', 'Huy Fong', '12x28 oz', 74.99, 'grocery', 'Sauces & Condiments', { stock: 'LOW_STOCK' }),
  p('GR4100', 'Barilla - Penne Rigate 5 kg Food Service', 'Barilla', '5 kg', 21.99, 'grocery', 'Pasta & Noodles', { isNew: true }),
  p('GR5012', 'All Purpose Flour - Bag 20 kg', 'Royal Chef', '20 kg', 29.5, 'grocery', 'Flour & Baking', { type: 'grouped' }),

  // Produce
  p('PR0101', 'Avocado Hass - Case', 'Royal Chef', '48 ct', 62.0, 'produce', 'Fruit', { images: [photo('avocado', 700, 700)], isNew: true, recommended: true }),
  p('PR0140', 'Watermelon Seedless', 'Royal Chef', '1 ea (≈ 7 kg)', 8.99, 'produce', 'Fruit', { images: [photo('watermelon', 700, 700)] }),
  p('PR0177', 'Bananas - Case 40 lb', 'Royal Chef', '40 lb', 27.99, 'produce', 'Fruit', { images: [photo('banana', 700, 700)] }),
  p('PR0222', 'Cherries Red - Clamshell 2 lb', 'Royal Chef', '2 lb', 11.49, 'produce', 'Fruit', { images: [photo('cherry', 700, 700)], regular: 13.99 }),
  p('PR0301', 'Onion Red - Jumbo 50 lb Sack', 'Royal Chef', '50 lb', 34.99, 'produce', 'Vegetables', {}),
  p('PR0333', 'Cilantro Fresh Bunch', 'Royal Chef', '30 bunches', 22.5, 'produce', 'Fresh Herbs', {}),

  // Dairy & eggs
  p('DA0010', 'Lactantia - Homogenized Milk 3.25% 4 L', 'Lactantia', '3x4 L', 19.99, 'dairy-eggs', 'Milk & Cream', { images: [photo('milk', 700, 700)], recommended: true }),
  p('DA0044', 'Saputo - Mozzarella Shredded 2 kg', 'Saputo', '2x2 kg', 49.99, 'dairy-eggs', 'Cheese', { isNew: true, groupPrice: 46.5 }),
  p('DA0061', 'Gay Lea - Salted Butter 454 g', 'Gay Lea', '36x454 g', 182.0, 'dairy-eggs', 'Butter & Margarine', {}),
  p('DA0090', 'Large White Eggs - Case 15 dozen', 'Royal Chef', '180 ct', 64.5, 'dairy-eggs', 'Eggs', { stock: 'OUT_OF_STOCK' }),

  // Frozen
  p('FZ0101', 'McCain - Superfries Straight Cut 3/8"', 'McCain', '6x2.27 kg', 52.99, 'frozen', 'Fries & Potatoes', { recommended: true, regular: 58.99 }),
  p('FZ0230', 'Naan Bread Tandoori Style', 'Royal Chef', '6x5 pcs', 18.99, 'frozen', 'Frozen Breads', { isNew: true }),
  p('FZ0311', 'Atlantic Salmon Fillet Skin-on IVP', 'Royal Chef', '10 lb', 119.0, 'frozen', 'Seafood', { images: [photo('salmon', 700, 700)], type: 'configurable' }),

  // Meat
  p('MT0011', 'Halal Chicken Breast Boneless Skinless', 'Maple Leaf', '4x2 kg', 96.0, 'meat-poultry', 'Chicken', { images: [photo('meat', 700, 700)], recommended: true }),
  p('MT0045', 'Halal Beef Striploin AAA', 'Royal Chef', '≈ 5 kg', 129.99, 'meat-poultry', 'Beef', { images: [photo('steak', 700, 700)], type: 'configurable', isNew: true }),
  p('MT0080', 'Halal Burger Patties 6 oz', 'Maple Leaf', '60 ct', 74.5, 'meat-poultry', 'Beef', { images: [photo('burger', 700, 700)] }),

  // Janitorial
  p('JN0012', 'Ecolab - Oasis 146 Multi-Quat Sanitizer 2 L', 'Ecolab', '2x2 L', 88.0, 'janitorial', 'Cleaning Chemicals', {}),
  p('JN0055', 'Kruger - Scott Pro Hard Roll Towel 800 ft', 'Kruger', '6 rolls', 46.99, 'janitorial', 'Paper Towels & Tissue', { recommended: true }),
  p('JN0090', 'Garbage Bags Black Strong 35"x50"', 'Royal Chef', '100 ct', 27.99, 'janitorial', 'Garbage Bags', {}),

  // Ware
  p('WE0101', 'Cambro - Camwear Food Pan 1/3 Size 4" Clear', 'Cambro', '6 ct', 81.5, 'ware-equipment', 'Food Storage', { isNew: true }),
  p('WE0144', 'Rubbermaid - Commercial Cutting Board 18x24', 'Rubbermaid', '1 ea', 42.0, 'ware-equipment', 'Smallwares', { type: 'configurable' }),
]

export const productBySlug = (slug?: string) => products.find((x) => x.slug === slug)
export const productBySku = (sku: string) => products.find((x) => x.sku === sku)
export const productsInDept = (slug: string) => products.filter((x) => x.dept === slug)
export const recommended = products.filter((x) => x.recommended)
export const newArrivals = products.filter((x) => x.isNew)
export const onSale = products.filter((x) => x.regular)

export const pctOff = (pr: Product) => (pr.regular ? Math.round((1 - pr.price / pr.regular) * 100) : 0)
export const money = (v: number) => v.toLocaleString('en-CA', { style: 'currency', currency: 'CAD', currencyDisplay: 'narrowSymbol' })

export const productDescriptionHtml = (pr: Product) => `
<p><strong>${pr.name}</strong> is a kitchen-staple from ${pr.brand}, packed for food-service volume (${pr.pack}).
Stocked at our Mississauga cash &amp; carry and delivered same-day or next-day across the GTA, Hamilton and Niagara.</p>
<ul>
  <li>Food-service pack size: ${pr.pack}</li>
  <li>Store in a cool, dry place. Refrigerate after opening where applicable.</li>
  <li>Ideal for restaurants, cafés, caterers and ghost kitchens.</li>
</ul>
<p>Product photos are for reference only. Packaging may vary by shipment.</p>`

/* ------------------------------------------------------------------ Home / marketing */

export type Banner = { id: string; eyebrow: string; title: string; body: string; cta: string; href: string; image: string; tone: 'red' | 'navy' | 'light' }

export const heroBanners: Banner[] = [
  { id: 'b1', eyebrow: 'Restaurant supply, simplified', title: 'Everything your kitchen runs on. One supplier.', body: '4,300+ products · same-day & next-day delivery across the GTA, Hamilton & Niagara.', cta: 'Start an order', href: '/all-categories', image: photo('chef', 1600), tone: 'navy' },
  { id: 'b2', eyebrow: 'Fresh this week', title: 'Market-fresh produce, by the case.', body: 'Avocados, onions, herbs and fruit — cold-chain from our warehouse to your walk-in.', cta: 'Shop Produce', href: '/c/produce', image: photo('produceWall', 1600), tone: 'light' },
  { id: 'b3', eyebrow: 'Go green, save more', title: 'Eco packaging from $0.11 a piece.', body: 'Compostable, bagasse and kraft take-out — swap without raising menu prices.', cta: 'Shop Eco-friendly', href: '/c/packaging', image: photo('bowl', 1600), tone: 'red' },
]

export const promoTiles = [
  { id: 't1', title: 'Fryer Night Essentials', body: 'Fries, canola & dips', href: '/c/frozen', image: photo('steak', 900, 700), cta: 'Shop Frozen' },
  { id: 't2', title: 'Café & Bar Syrups', body: 'Monin, Finest Call & more', href: '/c/beverage', image: photo('shake', 900, 700), cta: 'Shop Beverage' },
  { id: 't3', title: 'Back-of-house Clean', body: 'Sanitizers & paper', href: '/c/janitorial', image: photo('cleaning', 900, 700), cta: 'Shop Janitorial' },
]

export const whyFeatures = [
  { icon: 'local_shipping', title: 'Same-day & next-day delivery', body: 'Scheduled routes across the GTA, GTHA & Niagara.' },
  { icon: 'ac_unit', title: 'Cold-chain all the way', body: 'Frozen, dairy & meat stay at temp from dock to door.' },
  { icon: 'storefront', title: 'Cash & carry warehouse', body: '3750A Laird Road, Unit 9, Mississauga — walk in Mon–Sat.' },
  { icon: 'support_agent', title: 'A real rep, on WhatsApp', body: '+1 365-777-0999 · Mon–Sat 9am–6pm.' },
]

export const contact = {
  phone: '+1 365-777-0999',
  email: 'sales@mysupreme.ca',
  hours: 'Mon–Sat 9am–6pm',
  address: '3750A Laird Road, Unit 9, Mississauga, ON',
}

/* ------------------------------------------------------------------ Flyers (NEW FEATURE data) */

export const warehouses = [
  { id: 'mis', name: 'Mississauga', area: 'Peel & West GTA' },
  { id: 'ham', name: 'Hamilton', area: 'Hamilton, Burlington & Halton' },
  { id: 'nia', name: 'Niagara', area: 'St. Catharines, Niagara Falls & Welland' },
]

export const dealTypes = [
  { id: 'monthly', name: 'Monthly Flyer', body: '30 days of locked-in pricing on 120+ staples.', icon: 'menu_book' },
  { id: 'weekly', name: 'Weekly Hot Picks', body: 'Fresh deep-cuts every Monday, while stock lasts.', icon: 'local_fire_department' },
  { id: 'bulk', name: 'Bulk Saver', body: 'Buy 5+ cases and the price drops automatically.', icon: 'inventory_2' },
  { id: 'bundle', name: 'Restaurant Bundles', body: 'Curated kits — e.g. Pizza Night, Biryani Station.', icon: 'restaurant' },
]

export type Offer = { id: string; deal: string; sku: string; offerPrice: number; regular: number; from: string; to: string; warehouses: string[]; note?: string }

export const offers: Offer[] = [
  { id: 'o1', deal: 'Bulk Saver', sku: 'FZ0101', offerPrice: 22.49, regular: 52.99, from: '2026-10-01', to: '2026-10-31', warehouses: ['mis', 'ham'], note: '5+ cases' },
  { id: 'o2', deal: 'Weekly Hot Picks', sku: '59620000008252936', offerPrice: 17.99, regular: 24.99, from: '2026-10-05', to: '2026-10-11', warehouses: ['mis', 'ham', 'nia'] },
  { id: 'o3', deal: 'Monthly Flyer', sku: 'GR2210', offerPrice: 49.99, regular: 61.99, from: '2026-10-01', to: '2026-10-31', warehouses: ['mis', 'ham', 'nia'] },
  { id: 'o4', deal: 'Monthly Flyer', sku: 'A905', offerPrice: 59.99, regular: 72.5, from: '2026-10-01', to: '2026-10-31', warehouses: ['mis'] },
  { id: 'o5', deal: 'Restaurant Bundles', sku: 'DA0044', offerPrice: 44.99, regular: 49.99, from: '2026-10-01', to: '2026-10-15', warehouses: ['mis', 'nia'], note: 'Pizza Night kit' },
  { id: 'o6', deal: 'Weekly Hot Picks', sku: 'PR0101', offerPrice: 54.0, regular: 62.0, from: '2026-10-05', to: '2026-10-11', warehouses: ['mis', 'ham'] },
  { id: 'o7', deal: 'Bulk Saver', sku: 'PK1120', offerPrice: 52.0, regular: 58.49, from: '2026-10-01', to: '2026-10-31', warehouses: ['mis', 'ham', 'nia'], note: '5+ cases' },
  { id: 'o8', deal: 'Monthly Flyer', sku: 'MT0011', offerPrice: 89.0, regular: 96.0, from: '2026-10-01', to: '2026-10-31', warehouses: ['mis', 'ham'] },
]

/* ------------------------------------------------------------------ Search */

export const trendingSearches = ['clamshell', 'monin syrup', 'basmati', 'nitrile gloves', 'fries', 'coke cans', 'mozzarella', 'pizza box']

export const searchProducts = (q: string) => {
  const t = q.trim().toLowerCase()
  if (!t) return []
  return products.filter((x) =>
    [x.name, x.sku, x.brand, x.sub, x.dept].some((f) => f.toLowerCase().includes(t)),
  )
}
