# Concept B — changes from the live site

Everything not listed here is a copy of the live mysupreme.ca (same layout, copy, colours and order).
Each changed section is one self-contained component that takes props, so it can replace the old one
in the real `pages/index.tsx` 1:1.

| # | Page | Section | Was (live) | Now (Concept B) | Component | Backend |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Home | New, between the hero slider and Recommended Products | — | **Quick Order bar**: SKU / barcode input with a live match preview (image, name, SKU, pack size, line total), quantity stepper, Add to Cart, one-tap "Popular SKUs" chips, and a **Paste a list** dialog (one SKU per line + qty → ✓ / "SKU not found" → "Add N to Cart"). | `components/HomeComponents/QuickOrderBar.tsx` | Existing data only (product lookup by SKU + `addProductsToCart`). |
| 2 | Home | New, after Recommended Categories | — | **Trending by Department**: "Trending now" header, pill tabs per department (keyboard arrows work), product row using the live product card, "Shop all ‹Dept› →" link. | `components/HomeComponents/TrendingByDepartment.tsx` | Existing data: feed each tab from the Algolia trending call the site already uses (`lib/algoliatrendingproducts`) filtered by category. The prototype uses the seeded products per department. |
| 3 | Home | 6. Delivery banner | Static truck image `stickydelivery.png` | **Delivery Check banner** in the same rounded footprint (1920:500 at ≥1500 px): truck artwork left, "We deliver daily across the GTA, Hamilton & Niagara", GTA / Hamilton / Niagara chips, postal-code checker → in-area (next delivery, window, cut-off), out-of-area (pickup at 3750A Laird Road) or invalid-format result. | `components/HomeComponents/DeliveryCheckBanner.tsx` (replaces `DeliveryBanner.tsx`, kept in the folder) | **New feature** — delivery zones by postal prefix (FSA) with next route date, delivery window and order cut-off. Prototype data: `data/delivery-zones.json`. Fallback without data: ship the copy + chips and hide the checker. |
| 4 | Home | 11. Offer cards | Three `#EBF2FE` text-only cards with a red headline and "Shop Now" | **This Week's Deals**: same three `#EBF2FE` cards and grid, now real deals — deal-type tag, "Ends ‹date›", product image or SUPREME placeholder, SKU, name, pack chip, offer price, crossed-out regular price, "Save $X", note (e.g. "Buy 5+ bags"), qty + Add to Cart; header with "See all Flyers & Offers". | `components/HomeComponents/WeeklyDeals.tsx` (replaces `OfferCards.tsx`, kept in the folder) | **New feature** — an offer entity: deal type, sku, offer price, valid from / to (and warehouses later for the Flyers page). Prototype data: `data/offers.json`. Name, image, pack size and regular price are existing product fields. |
| 5 | Home | NEW — after 4. PromoTwoCards | — | **Shop by your kitchen**: six business-type tiles (Restaurant, Café & Bakery, Caterer & Events, Food Truck, Ghost Kitchen, Grocery & Retail), each with an icon, one-line description and three department shortcuts. | `components/HomeComponents/ShopByBusiness.tsx` | Existing data only — CMS copy + existing department routes. |
| 6 | Home | NEW — after 9. New Arrivals | — | **Ready-to-order kits**: four curated bundles (Takeout Starter, Café Counter, Pizza Night, Cleaning Day) with product thumbnails, item list with qty and pack size, kit total and "Add kit to cart (N items)". | `components/HomeComponents/StarterKits.tsx` | **New feature** — curated bundle entity (kit id, name, blurb, items `{sku, qty}`). Prototype data: `data/kits.json`. Prices/images are existing product fields; "Add kit" = one `addProductsToCart` call. |
| 7 | Home | NEW — after This Week's Deals | — | **Pick up where you left off**: recently viewed products (live card) with Clear; first visit shows "Popular with kitchens like yours". | `components/HomeComponents/RecentlyViewed.tsx` | Existing data only — front-end browsing history (GraphCommerce already ships a recently-viewed store). |
| 8 | Home | NEW — after #7 | — | **Trusted by Ontario kitchens**: stats strip (4,300+ products, 9 departments, same/next-day, delivery regions) + three customer quotes. | `components/HomeComponents/TrustStrip.tsx` | CMS content. Quotes are dummy copy — replace with real testimonials before go-live. |
| 9 | Home | NEW — after #8 | — | **Open a business account in 3 steps**: Register → Business pricing & credit terms → Order online / in-app / at the warehouse, with "Open a business account" and "Talk to sales". | `components/HomeComponents/BusinessAccountSteps.tsx` | CMS content; links to existing routes. |
| 10 | Home | NEW — after 12. Feature cards | — | **Quick answers** FAQ: delivery areas, next-day cut-off, delivery minimum, business account, returns, pickup — with phone/WhatsApp and contact links. | `components/HomeComponents/HomeFAQ.tsx` | CMS content. Cut-off, $350 minimum and returns wording to be confirmed by operations. |
| 11 | Every page | NEW — under the header (not on sign-in) | — | **Delivery minimum bar**: shown when the cart has items — "Add $X more to unlock delivery" with progress toward $350, switching to "Your order qualifies for delivery · Order by 2 PM for next-day". | `components/Layout/DeliveryMinimumBar.tsx` | Threshold from Magento store config / shipping rule — no new data model. |
| 12 | Product detail | NEW — between the product block and Product description | — | **Frequently bought together**: this item + two companions with checkboxes, running total and "Add N to cart". | `components/ProductDetailView/FrequentlyBoughtTogether.tsx` | Existing integration — Algolia Recommend "frequently bought together" model (Algolia is already on the site). |
| 13 | Every page | Red category bar dropdown | Text mega menu of sub-category names in columns | **Category dropdown (Alibaba-style)**: new "All Categories" button at the start of the red bar; hovering it or any department opens one panel with a left rail (Popular categories + the 9 departments with icons) and a right grid of round picture tiles with product counts, plus "Shop all ‹Dept› →". Mobile menu uses the same round tiles. | `components/Layout/CategoryMenu.tsx` (used by `components/Layout/Header.tsx`) | Existing data (Magento category tree + product_count). Magento has no sub-category images, so tiles use one product photo per sub-category (`data/subcategory-images.json`, `node scripts/seed.mjs --subcategory-images`); upload category images in Magento to replace them. |
| 14 | Home | Section order | Live order (promos, rails and service blocks interleaved) | **Regrouped** into Order fast (banner, Quick Order, recently viewed) → Browse (departments, shop by kitchen) → Deals (this week's deals, promo images, promo cards) → Discover (recommended, trending, kits, new arrivals, Dairy/Grocery cards, brands) → Delivery & service (delivery checker, Click & Collect, feature cards) → Trust & help (testimonials, account steps, FAQ). Every live section is kept. | `pages/index.tsx` | None |

## Rules applied to the changed sections

- Brand only: `#FF0000` / `#FF413D` accents, Poppins, the live product card. Text-bearing red buttons use
  `#D50000` (5.5:1 with white); untouched sections keep the live `#FF413D`.
- Every button, chip, tab and link has a visible 3 px focus ring; touch targets are ≥ 40–46 px.
- The only motion added is the FAQ accordion expand; it is disabled under `prefers-reduced-motion`.
- Tested at 390 / 800 / 1100 / 1440 px with no horizontal scroll.

## Prototype-only pieces (not for the real build)

- `data/kits.json` is dummy curation; testimonials in TrustStrip are dummy quotes.
- Recently viewed and the cart live in `localStorage`; production uses the GraphCommerce stores.

- `data/*.json` is a one-off snapshot from `scripts/seed.mjs`; the real site queries Magento / Algolia.
- The cart is React state + `localStorage` with a snackbar; there is no checkout.
- "Popular SKUs" is a fixed list in `pages/index.tsx`; production would use the buyer's last order
  (signed in) or Algolia trending (guest).
- The paste-list dialog is pre-filled with a sample list (one unknown SKU on purpose).
- `offers.json` and `delivery-zones.json` prices, dates and routes are dummy values.

## Deviations from CLAUDE.md to keep the live look

- **Fonts:** `pages/_app.tsx` imports only Poppins 400, not 400–900 as §2 suggests. The live site loads only 400
  (`components/theme.ts`), so its bold text is browser-synthesised; loading the real 500–900 weights made every
  heading visibly heavier than the screenshots.
- **Category bar:** hidden on `/cart`, `/brands`, `/about-us`, `/service/contact-us` and `/wishlist`, and
  `/account/signin` uses the logo-only header with no footer — as the live screenshots show.
- **Snapshot size:** each department has ~15 products, so category grids are padded with other departments'
  products while the count and "Page 1 of N" use the real Magento totals.
- **Brands:** product brand and manufacturer come from Magento's `brand` / `manufacturer` attributes
  (`custom_attributesV2`, as the live PDP reads them), stored as `brand_label` / `manufacturer_label` by
  `node scripts/seed.mjs --enrich-brands`. Products without a brand hide the brand label, the "Explore more from"
  box and the Brand row, like the live site. Labels are shown as Magento stores them (e.g. "Nastle").
- **Node version:** `engines.node` is `24.x`, not the 18–21 range in CLAUDE.md §2 — Vercel has retired Node 20 and
  refuses to build it. Next 15.1 builds cleanly on Node 24.
