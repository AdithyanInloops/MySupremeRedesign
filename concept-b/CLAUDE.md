# MySupreme UI Variant — Build Guide for Claude Code

> **Status (2026-10-07): Concept B is now a full UI/UX redesign.** The "match the live site" golden rule below no
> longer applies — every page was redesigned on one design system (`lib/theme.ts`, `components/ui/*`), the home page
> was regrouped, and a clickable checkout was added. Read `CHANGES.md` first: it records the design system, where every
> live section went, the new-feature data, and prototype-only behaviour. Keep using this guide for the stack, data,
> assets and the rules below that still hold: routes and data files stay, brand stays (red crown, Poppins, red-led
> palette), AA contrast, visible focus, reduced motion, and "new feature" labelling for anything that needs new data.
>
> When changing UI: reuse the shared components (one `ProductCard`, one `QuantityStepper`, `Section`, `PageHeader`,
> `EmptyState`, `Field`, toasts via `useToast` / `useCart().notify`) and tokens (`colors`, `radius`, `shadow`, `motion`,
> `focusRing`) instead of hard-coded values. Icons come only from `components/ui/icons.tsx` (the site's own SVGs —
> don't add an icon library). Fonts now load Poppins 400–700; framer-motion is no longer used.

The original brief follows.

You are building a **UI prototype of mysupreme.ca that looks the same as the current live website**, except for
the sections listed in [Section 9: Changes to make](#9-changes-to-make). It runs on **dummy data only** and is
shown to the client for review. If the client approves it, the changed sections will be ported back into the
real codebase, so build them the way the real site is built.

**Golden rule (superseded — see Status above):** anything not listed in Section 9 must look like the current site:
same layout, spacing, colours, fonts, copy and order.

**Where to work:** this guide lives in `MySupremeRedesign/concept-b/`. Build the whole prototype inside
`concept-b/` (its own `package.json`). Do not modify `concept-a/` (a separate, finished concept) or `docs/`.

---

## 1. Reference material

| What | Where |
| --- | --- |
| Screenshots of the live site (desktop 1440 px and mobile 390 px, full page) | `./screenshots/` — see the list below |
| Full-site design brief (every page, component, edge case, brand rule) | `../docs/MySupreme-Redesign-Design-Brief.md` — background context; this guide wins where they differ |
| The real source code (read-only reference for exact styles) | `/home/orca/orca/projects/mysupreme` |
| The live site | https://www.mysupreme.ca |
| Public product/category API (for the seed script only) | `https://m2.mysupreme.ca/graphql` (Magento GraphQL, no auth needed for catalog data) |

Screenshots (each has a `-desktop.png` and a `-mobile.png`):

| File | Page | Live URL |
| --- | --- | --- |
| `01-home` | Home | `/` |
| `02-category` | Category listing | `/grocery` |
| `03-search` | Search results | `/search/basmati%20rice` |
| `04-product` | Product detail | `/p/adnoor-golden-basmati-rice-10-lb` |
| `05-cart-empty` | Cart (empty) | `/cart` |
| `06-signin` | Sign in | `/account/signin` |
| `07-all-categories` | All categories | `/all-categories` |
| `08-brands` | Brands | `/brands` |
| `09-about` | About us | `/about-us` |
| `10-contact` | Contact us | `/service/contact-us` |

**Look at the matching screenshot before building any page, and compare your result against it** (take your own
screenshot with Playwright at the same width and check side by side).

Never write to `/home/orca/orca/projects/mysupreme`. Read files there for exact values only.

---

## 2. Tech stack (use these exact versions)

Use the same libraries as the real site, so the changed sections can be copied back with little rework.

| Package | Version | Notes |
| --- | --- | --- |
| next | 15.1.x, **pages router** (`/pages`, not `/app`) | TypeScript |
| react / react-dom | 18.3.x | |
| @mui/material, @mui/icons-material | 5.16.8 | All layout and components via MUI `Box`, `Typography`, `Button`, `Grid`, etc. Style with the `sx` prop. |
| @emotion/react, @emotion/styled | 11.11.x | |
| @fontsource/poppins | 5.x | Import weights 400, 500, 600, 700, 800, 900 |
| swiper | 11.x | Hero banner slider and carousels (the real site uses Swiper for the hero) |
| framer-motion | 11.15.x | Only if a change needs animation. The real app runs it inside `LazyMotion` strict mode, so **use `m.div`, never `motion.div`** |

Do **not** add Tailwind, another component library, or another font. Node 18–21, yarn or npm.

Suggested structure (mirrors the real repo so components port back 1:1):

```
pages/                 index.tsx, [category].tsx, p/[url].tsx, search/[term].tsx, cart.tsx, account/signin.tsx, ...
components/Layout/     Header.tsx, Footer.tsx, Layout.tsx
components/HomeComponents/   one file per home section (names in Section 5)
components/Product/    ProductCard.tsx, ProductGrid.tsx, ProductCarousel.tsx
data/                  *.json created by the seed script (Section 7)
lib/theme.ts           MUI theme (Section 3)
public/assets/         images copied from the real repo (Section 7)
scripts/seed.mjs       one-off script that snapshots real catalog data into data/
```

---

## 3. Theme (copy exactly)

Source: `/home/orca/orca/projects/mysupreme/components/theme.ts`

```ts
// lib/theme.ts
import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#FF0000', dark: '#FF0000', contrastText: '#ffffff' },
    secondary: { main: '#2d297d', light: '#d1e4ff', contrastText: '#ffffff' },
    success: { main: '#01d26a' },
    background: { default: '#ffffff', paper: '#ffffff' },
    text: { primary: '#0F0F10', secondary: '#03031755', disabled: '#03031735' },
  },
  breakpoints: { values: { xs: 0, sm: 500, md: 800, lg: 1100, xl: 1500 } },
  shape: { borderRadius: 3 },
  typography: {
    fontFamily: 'Poppins,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif',
  },
})
```

Colours used across components (from the real code, most-used first):

| Use | Value |
| --- | --- |
| Header bar, footer, primary buttons | `#FF0000` |
| "Add to cart" buttons, accents, hover borders | `#FF413D` (hover `#e63939`) |
| Headings / body text | `#0C0C0C`, `#111827`, `#1C1C1C` |
| Secondary text | `#4B5563`, `#6B7280`, `#9CA3AF` |
| Light surfaces | `#F9FAFB`, `#F3F4F6`, `#FAFAFA`, light-blue card bg `#EBF2FE` |
| Borders | `#E5E7EB`, `#D1D5DB`, `#EAEAEA` |
| Logo navy | `#2d297d` |

Breakpoint behaviour that matters: the **red category bar only shows at ≥1100 px (lg)**; below that the header
switches to the mobile layout with a hamburger menu.

---

## 4. Global layout (every page)

Match `screenshots/*-desktop.png` top and bottom, and the real files `components/Header.tsx`,
`components/Layout/Footer.tsx`, `components/MoreDropdownMenu.tsx`, `components/AccountDropdownMenu.tsx`.

**Desktop header (≥1100 px)** — white bar, about 88 px tall:
- Left: logo (`/assets/header_logo.svg`), links to `/`.
- Centre: rounded grey search box "Search by product or SKU" with a mic icon, a red camera icon and a red search icon.
- Right: "More ⌄" dropdown (Become a Supplier, 24x7 Customer Care, Download App), "♡ Favorites", "🛒 Cart",
  red pill "Login" button.

Below it, the **red category bar** (48 px, `#FF0000`, white bold 13–14 px text, centred): `Home` (only off the home
page), then the departments each with a ⌄ chevron, hover = black background, hover opens a white mega menu of
sub-categories in columns. Departments in order: Packaging, Grocery, Frozen, Produce, Beverage, Dairy & Eggs,
Meat & Poultry, Janitorial, Ware & Equipment. (The `flyers-and-offers` branch also adds "Flyers & Offers" with a
white NEW pill at the end — include it.)

**Mobile header (<1100 px):** row with ☰ (red), logo, ♡, cart, account icon; full-width search bar below.
☰ opens a left drawer titled "Menu" listing departments with › chevrons.

**Footer** — full-width `#FF0000`, white text: white logo + 3 short paragraphs on the left; columns
Categories / About / Help; divider; "Secure Payment Methods (Online):" with Mastercard, PayPal, Shop Pay, Visa
white tiles; "Follow Us:" Facebook, Instagram, LinkedIn icons; "Download Our App:" App Store and Google Play
badges; "© 2026 MySupreme. All rights reserved."

**Floating buttons on every page:** red circular mic button bottom-left (voice assistant), red chat bubble
bottom-right (chat). Render them as static circles; they do nothing in the prototype.

---

## 5. Pages and sections

### Home (`/`) — `screenshots/01-home-*.png`, real file `pages/index.tsx`

Sections in this exact order (real component file in brackets):

1. **Hero banner slider** (`components/HomeComponents/Supremebanner.tsx`) — Swiper, autoplay, dots, separate
   desktop and mobile images. Desktop images: `https://m2.mysupreme.ca/media/wysiwyg/Banner-1.png`, `1920_1.jpg`,
   `Banner2.jpg`, `banner3.jpg`, `20260902-111751_1.png`, `2_3.png`. Mobile images: `Banner1-mobile_3.jpg`,
   `1280_1.jpg`, `Banner2-mobile_2.jpg`, `BANEER-3.jpg`, `20260902-111744.png`, `1280_-720_5.jpg`
   (all under `https://m2.mysupreme.ca/media/wysiwyg/`; download them into `public/assets/banners/`).
2. **Recommended Products** (`RecommentedProducts.tsx`) — title left, outlined red "View all" pill right,
   horizontal row of product cards with scroll.
3. **Two large promo images** side by side (`/assets/sum-offer-1.jpeg`, `/assets/sum-offer-2.jpeg`), rounded,
   `#EBF2FE` card background.
4. **PromoTwoCards** (`PromoTwoCards.tsx`) — two red cards with an image on the left and title, subtitle and white
   "Shop Now" pill: Packaging (`/assets/package-offer.jpeg`), Produce (`/assets/produce-offer-1.jpeg`).
5. **Recommended Categories** (`RecommendedCategories.tsx`) — "View all Categories" pill, row of square
   department tiles with the name under each.
6. **Delivery banner** (`DeliveryBanner.tsx`) — `/assets/stickydelivery.png`, ratio 1920:500, rounded.
7. **Our Brands** (`homebanner.tsx`) — "SHOP BY" eyebrow, "Our Brands" title, red "View All Brands →" pill, row of
   white brand-logo tiles.
8. **PromoTwoCards2** (`PromoTwoCards2.tsx`) — Dairy & Eggs (`/assets/dairyandeggs.png`) and Grocery
   (`/assets/grocery.png`), same style as 4 but image on the right.
9. **New Arrivals** (`NewArrival.tsx`) — same as 2, "New Arrivals" title.
10. **"Click & Collect" app banner** (`Banner.tsx`, desktop only).
11. **Offer cards** (`OfferCards.tsx`) — three `#EBF2FE` cards with red headline text and a "Shop Now" outline pill.
12. **Feature cards** (`FeatureCards.tsx`) — four columns with a red line icon, bold title and short text
    (Order in 10 Minutes or Less, Best Price Unmatched Value, Wide Assortment, Easy Returns).

### Category listing (`/grocery`, `/packaging`, …) — `02-category-*`

Left sidebar (light grey panels): Categories list, Sort (Position, Product Name, Price), Per page (20/36/40),
Price range slider, Manufacturer, Brand, Restaurant Category filters with counts and "More options ⌄".
Right: big bold category title, "1690 products" count, 4-column product grid, "‹ Page 1 of 43 ›" pagination.
Mobile: filters move into a drawer; grid is 2 columns.

### Search results (`/search/<term>`) — `03-search-*`

Same layout as the category listing, with the search term as the title.

### Product detail (`/p/<url_key>`) — `04-product-*`, real files `pages/p/[url].tsx`,
`components/ProductDetailView/*`

Left: image in a bordered box (gallery arrows when more than one image). Right: red brand name + grey SKU + a thin
line + wishlist star; product name; small unit text ("10 lb"); large price; quantity stepper (− 1 PCS +) in a red
outline box; red "ADD TO CART" button; grey "Explore more from <Brand> →" box. Below: "Product description"
paragraph; "Product Details" tab with a two-column table (Uom, Brand); "Similar Products" and "You may also like"
carousels.

### Other pages

Cart (`05-cart-empty`), Sign in (`06-signin`), All categories (`07`), Brands (`08`), About (`09`), Contact (`10`):
match the screenshots. Pages without a screenshot (checkout, account) are out of scope unless listed in Section 9.

### Product card (used everywhere) — real file `components/ProductListItems/productListRenderer.tsx`

White card with a light border/shadow, max width about 250 px. Square image (or the "SUPREME" text placeholder
when there is no image), red outline ☆ wishlist icon top-right, then: grey SKU (12 px), product name (bold,
2-line clamp, 14–16 px), a small grey pack-size chip (`#F5F5F5` bg, `#EAEAEA` border, 11 px), price (bold), and a
row with a quantity box (white, 1) joined to a red `#FF413D` "Add to Cart" button, 40 px tall.
Sale state (not used live today, but must exist): red `-15%` badge top-left and the old price crossed out.

---

## 6. Behaviour in the prototype

- Everything is static, but clickable: header links, category tiles, product cards and "View all" go to the
  matching prototype pages.
- Add to cart updates a cart count kept in React state (or `localStorage`) and shows a snackbar. No checkout.
- Search box submits to `/search/<term>` and filters `data/products.json` by name/SKU.
- Login, voice, camera and chat buttons are visual only.

---

## 7. Dummy data and assets

**Assets:** copy `/home/orca/orca/projects/mysupreme/public/assets` into `public/assets` (logo, banners, promo
images, icons, payment and app-store badges are all there). Do not use `package-offer.jpeg` or
`produce-offer-1.jpeg` anywhere new; they are finished posters with their own text and old dates.

**Data:** write `scripts/seed.mjs` that calls the public GraphQL endpoint **once** and saves JSON into `data/`.
The app then reads only the JSON files (no network calls at runtime). Fetch:

- `categories.json` — the category tree (`categoryList(filters:{parent_id:{eq:"2"}})` with `name url_key image
  product_count children { name url_key }`).
- `products.json` — about 120 products spread over the departments (`products(filter:{category_uid:{eq:$uid}},
  pageSize: 15)` per department) with `sku name url_key uom small_image{url} price_range{ minimum_price{
  regular_price{value} final_price{value} discount{percent_off} } } short_description{html} categories{name}`.
- `brands.json` — `brandImages { brand_id brand_name image_url }`.

Field notes: the **pack size** shown on cards ("1 kg", "24x1L in a case") is `short_description.html` with tags
stripped; `uom` is the selling unit ("pcs") shown in the product stepper and details table. Products without a
photo return a placeholder URL containing `/placeholder/` — render the "SUPREME" placeholder for those.

Then **edit the JSON by hand** to add a few test cases: 3 products on sale (set a lower final price and a
percent_off), one very long product name, and a few products with no image. Keep the real messiness: most products
have no photo, SKUs range from `BM0089` to 17-digit numbers, pack sizes are free text ("24x1L in a case").

---

## 8. Definition of done

- [ ] Home, category, search and product pages match their screenshots at 1440 px and 390 px, except the changed
      sections.
- [ ] Header, red category bar, mobile drawer and footer match on every page.
- [ ] Every changed section from Section 9 is built, works at 390 / 800 / 1100 / 1440 px, and is easy to find
      (one component file per changed section, named in Section 9).
- [ ] No console errors; `npm run build` passes; TypeScript has no errors.
- [ ] A short `CHANGES.md` lists every changed section, its component file, and anything that would need new
      backend data in the real site (marked **new feature**).

---

## 9. Changes to make

> **Fill this in before starting.** One row per section to change. Anything not listed here stays exactly as it is
> on the live site.

| # | Page | Section (from Section 5) | Current | Change to | New component file |
| --- | --- | --- | --- | --- | --- |
| 1 | Home | NEW — between 1. Hero banner slider and 2. Recommended Products | (nothing) | **Quick Order bar**: full-width light card. Left: bolt icon, "Quick Order" title, "Know the SKU? Add it straight to cart." Middle: SKU input (mono) with live match preview (thumbnail, name, pack chip, price) + qty stepper + red "Add to Cart". Below the input: "Popular SKUs" chips that fill the input in one tap. Right: "Paste a list" outline pill opening a dialog (one SKU per line + qty → preview ✓ / "SKU not found" → "Add N to cart"). Front-end only (product lookup + add to cart). | `components/HomeComponents/QuickOrderBar.tsx` |
| 2 | Home | NEW — after 5. Recommended Categories | (nothing) | **Trending by Department**: "TRENDING NOW" eyebrow + "Popular in your kitchen's departments" title, pill tabs for each department (Packaging, Grocery, Frozen …), product row of the current card underneath (same scroll row as Recommended Products), "Shop all <Dept> →" link. Fed from products.json per department (production: Algolia trending, already integrated). | `components/HomeComponents/TrendingByDepartment.tsx` |
| 3 | Home | 6. Delivery banner | Static truck image (stickydelivery.png) | **Delivery Check banner**: same rounded 1920:500 footprint. Left: truck image (stickydelivery.png cropped). Right: "We deliver daily across the GTA, Hamilton & Niagara", postal-code input + "Check" → in-area result ("Next delivery: Tomorrow, 9 AM – 1 PM · Order by 2 PM") or out-of-area result ("Outside our routes — pick up at 3750A Laird Road"). Region chips GTA / Hamilton / Niagara. **New feature** data: delivery zones by postal prefix + next route (`data/delivery-zones.json`). | `components/HomeComponents/DeliveryCheckBanner.tsx` |
| 4 | Home | 11. Offer cards | Three `#EBF2FE` text-only cards with red headline + Shop Now | **This Week's Deals**: same three-column `#EBF2FE` cards, now each a real deal: deal-type tag (Weekly Hot Pick / Bulk Saver / Monthly Flyer), product image (or SUPREME placeholder), name, pack chip, offer price in red + crossed-out regular price + "Save $X", "Ends Sun, Oct 12" validity line, qty + Add to Cart. Header row: "This Week's Deals" + "See all Flyers & Offers" pill. **New feature** data: offers (deal type, sku, offer price, valid from/to) in `data/offers.json`. | `components/HomeComponents/WeeklyDeals.tsx` |
| 5 | Home | NEW — after 4. PromoTwoCards | — | **Shop by your kitchen**: six business-type tiles (Restaurant, Café & Bakery, Caterer & Events, Food Truck, Ghost Kitchen, Grocery & Retail), each with an icon, one-line description and three department shortcuts. | `components/HomeComponents/ShopByBusiness.tsx` |
| 6 | Home | NEW — after 9. New Arrivals | — | **Ready-to-order kits**: four curated bundles (Takeout Starter, Café Counter, Pizza Night, Cleaning Day) with product thumbnails, item list with qty and pack size, kit total and "Add kit to cart (N items)". | `components/HomeComponents/StarterKits.tsx` |
| 7 | Home | NEW — after This Week's Deals | — | **Pick up where you left off**: recently viewed products (live card) with Clear; first visit shows "Popular with kitchens like yours". | `components/HomeComponents/RecentlyViewed.tsx` |
| 8 | Home | NEW — after #7 | — | **Trusted by Ontario kitchens**: stats strip (4,300+ products, 9 departments, same/next-day, delivery regions) + three customer quotes. | `components/HomeComponents/TrustStrip.tsx` |
| 9 | Home | NEW — after #8 | — | **Open a business account in 3 steps**: Register → Business pricing & credit terms → Order online / in-app / at the warehouse, with "Open a business account" and "Talk to sales". | `components/HomeComponents/BusinessAccountSteps.tsx` |
| 10 | Home | NEW — after 12. Feature cards | — | **Quick answers** FAQ: delivery areas, next-day cut-off, delivery minimum, business account, returns, pickup — with phone/WhatsApp and contact links. | `components/HomeComponents/HomeFAQ.tsx` |
| 11 | Every page | NEW — under the header (not on sign-in) | — | **Delivery minimum bar**: shown when the cart has items — "Add $X more to unlock delivery" with progress toward $350, switching to "Your order qualifies for delivery · Order by 2 PM for next-day". | `components/Layout/DeliveryMinimumBar.tsx` |
| 12 | Product detail | NEW — between the product block and Product description | — | **Frequently bought together**: this item + two companions with checkboxes, running total and "Add N to cart". | `components/ProductDetailView/FrequentlyBoughtTogether.tsx` |

Notes for the changes: the Quick Order pad is carried over from Concept A (client feedback asked for a stronger SKU entry). Changed sections use `#D50000` for text-bearing red buttons (AA contrast); untouched sections keep the live `#FF413D`.

### Rules for changed sections

1. Stay inside the brand: red `#FF0000` / `#FF413D`, navy `#2d297d`, Poppins, the current product card.
2. Keep each changed section a single self-contained component with props, fed from `data/*.json`, so it can be
   dropped into the real `pages/index.tsx` in place of the old one.
3. Use only data the real site has (Section 7 fields). If a change needs new data (for example, per-warehouse
   prices or a flyer validity date), keep it in a separate JSON file and list it in `CHANGES.md` as a
   **new feature**.
4. Make text on red buttons at least 4.5:1 contrast (use `#D50000` or bold ≥18.7 px white text), and give every
   button and link a visible focus style.
5. Provide a reduced-motion version for any animation (`useReducedMotion` from framer-motion or the
   `prefers-reduced-motion` media query).
