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

## Rules applied to the changed sections

- Brand only: `#FF0000` / `#FF413D` accents, Poppins, the live product card. Text-bearing red buttons use
  `#D50000` (5.5:1 with white); untouched sections keep the live `#FF413D`.
- Every button, chip, tab and link has a visible 3 px focus ring; touch targets are ≥ 40–46 px.
- No animation was added, so no reduced-motion variant is needed.
- Tested at 390 / 800 / 1100 / 1440 px with no horizontal scroll.

## Prototype-only pieces (not for the real build)

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
