# Concept B — UI/UX redesign

As of 2026-10-07 Concept B is a full UI/UX transformation of mysupreme.ca, no longer "the live site plus listed
changes". Every live page, route, data file and capability is kept; the interface, information architecture, states and
interactions are redesigned on one design system. Everything runs on the same dummy data (`data/*.json`).

## 1. Design system (`lib/theme.ts`, `components/ui/*`)

| Token | Value | Why |
| --- | --- | --- |
| Brand red | `#E00000` (hover `#BE0000`), red text `#BE0000` | White on `#E00000` is 5.0:1 (AA). The old `#FF0000` / `#FF413D` were 4.0:1 / 3.5:1. Seven reds became one. |
| Navy | `#2D297D`, dark `#17153F` | Logo wordmark colour: secondary actions, focus rings, footer, account surfaces. |
| Neutrals | ink `#111827` → `#9CA3AF`, lines `#E5E7EB` / `#D1D5DB`, surfaces `#F7F8FA` / `#F3F4F6` | Text ≥ 4.5:1 on every surface used. |
| Status | success `#047857`, warning `#B45309`, error `#C00000`, info `#1D4ED8` + tints | Always paired with an icon and text, never colour alone. |
| Type | Poppins 400/500/600/700 (real weights, no synthetic bold); h1 32/26, h2 26/21, h3 18, body 15, caption 12.5, overline 12; SKUs in system mono | One scale everywhere. |
| Radii | 6 / 8 / 10 (controls) / 14 (cards) / 20 (panels) / pill | One scale. |
| Shadows | xs, sm, md (hover/popover), lg (menus/dialogs) | Elevation means "floating", not decoration. |
| Motion | 150 ms hover/press, 200–250 ms panels; all off under `prefers-reduced-motion` (global rule) | Short and functional. |
| Focus | 2 px navy ring, offset 2 (white on red/navy surfaces) | Visible on every control. |
| Layout | 1440 px container, gutters 16 / 24 / 32, 8 px spacing unit | Same rhythm on every page. |

Shared components: `Section` + `SectionHeading` + `PageContainer`, `PageHeader` + `Breadcrumbs` (mobile shows "‹ Parent"),
`QuantityStepper` (the only stepper; typeable; "−" becomes delete at 1 in cart contexts), `Price`, `PackChip`, `Sku`
(copyable on the product page), `ProductImage` + calm crown placeholder, `EmptyState`, `Field` (label above, hint,
error with icon), skeletons, `StickyBottomBar` (publishes `--sticky-bottom` so the floating buttons and toasts move up),
`RouteProgress`, `SkipLink`, toast system (`lib/toast.tsx`: message + detail + action such as Undo / View cart).

**One product card** (`components/Product/ProductCard.tsx`, variants `grid` / `compact`) replaces the five card designs
(live card + four section-specific home cards). Its cart control (`CartControl.tsx`) is "Add to cart" until the item
is in the cart, then a stepper bound to the cart line. States: photo, placeholder, sale, long name, badge (NEW / #1),
in cart, out of stock.

## 2. Information architecture

**Home** went from 19 stacked blocks (~10,000 px at 1440) to 12 grouped by intent. Nothing was dropped; near-duplicates
were merged:

| Live / previous section | Now |
| --- | --- |
| Hero slider | Hero slider with per-slide links and alt text, pause button, arrows/dots (`Supremebanner.tsx`) |
| Quick Order bar | Next to the hero on desktop (`HomeHero.tsx`), and in a header dialog on every page (`QuickOrder/QuickOrder.tsx`) |
| Feature cards + Trust stats | One compact value strip under the hero |
| Pick up where you left off | Kept; shown only when there is history (no filler for first visits) |
| Recommended Categories + Shop by your kitchen | One "Shop the catalogue" block with tabs: By department / By kitchen type (`BrowseCatalogue.tsx`) |
| This Week's Deals + promo posters + PromoTwoCards + PromoTwoCards2 | One "Deals" band: three deal cards, then one promotions rail (posters + department promos) |
| Trending by Department | Kept (department pills + ranked rail) |
| Recommended Products + New Arrivals | One "Featured products" block with tabs |
| Ready-to-order kits | Kept |
| Our Brands marquee | Static brand rail (the 180 s marquee couldn't be paused or reached by keyboard) |
| Delivery check + Click & Collect banner | One "Delivery & pickup" block: postal-code checker + app card |
| Trust quotes + Business account steps | One block: steps + CTA beside customer quotes |
| FAQ | Kept |

**Header**: utility bar (delivery promise, supplier / app / help links, phone) replaces the vague "More" menu; search
with live suggestions; Quick order; Favorites; Sign in / account menu; cart with item count and subtotal. The red
department bar shows "you are here", opens panels on hover or on its chevron buttons (keyboard), and is now shown on
every shopping page (the live site hid it on cart, brands, about, contact and favorites). Sign-in and checkout use a
focused header (logo, help phone, one way back).

**Footer**: navy, adds a contact block (phone, WhatsApp, email, hours, address) and Brands / All categories / Flyers.

## 3. Pages

| Page | What changed |
| --- | --- |
| Category & search (`ProductListLayout.tsx`) | Breadcrumbs; sticky checkbox filters with counts, search-within (256 brands), price inputs + slider; applied-filter chips with Clear all / Undo last; sort adds **price high → low**; real pagination (the live pager didn't change the grid); filters, sort, page and per-page live in the URL, so Back restores them; mobile: sub-category chips + filter drawer with a live "Show N products" count. Search adds an exact-SKU banner, brand facet and a helpful no-results state. |
| Product | Breadcrumbs to the sub-category; gallery with keyboard arrows; copyable SKU; price box with quantity (in the selling unit), "Added ✓" state and "N in your cart"; delivery / pickup / returns facts; Description + Specifications tabs; similar and also-like rails; sticky add-to-cart bar on phones; out-of-stock state. |
| Cart | Was read-only with a disabled checkout. Now: editable quantities, remove with Undo, save for later, clear cart (Undo), delivery-minimum progress, coupon with inline error, HST estimate, "Check out · $total", cross-sell rail, sticky total + checkout on phones, skeleton instead of a flash of "empty". |
| Checkout (new: `/checkout`, `/checkout/payment`, `/checkout/success`) | Completes the journey that used to dead-end. Step bar; contact (or signed-in account); delivery vs pickup (delivery disabled with the reason below $350); address form with postal-zone check and delivery windows; payment by card (Stripe Elements stand-in, declined-card path), on account (signed-in), or at pickup; terms; error summary with links to fields; "Placing your order…" state; confirmation with order number, timeline, print, and a create-account prompt for guests. |
| Sign in (`/account/signin`) | Sign in / Create account tabs, inline errors, wrong-password and reset-password flows, `?next=` return, benefits panel. Signing in (prototype) switches the header, hero and checkout to the business account. |
| Favorites | Same card grid, "Add all to cart", helpful empty state. Wording is "Favorites" everywhere (was Wishlist / Favorites, star / heart). |
| All categories | Every department and sub-category on one page with counts, a sticky jump list and "Find a category". |
| Brands | Find-a-brand search, A–Z filter, "Show more" paging (651 brands). |
| Flyers & Offers | The "live" version the design brief asked for: warehouse picker, deal-type filters with counts, real deal cards (price, saving, end date, add to cart), "Coming next" teasers, how-deals-work, Monday email signup. |
| About, Contact | Rebuilt on the design system; same copy, regrouped. Contact leads with the four ways to reach us; the pricing form keeps every live field, grouped, with inline validation and a success state. |
| Become a supplier | Was a stub; now a short application form. |
| Get the app, policies, blog | Consistent content template with a help card. |
| 404 | Explains, offers search and department shortcuts. |

## 4. New features that need backend data (cost separately)

| Feature | Data | Prototype file |
| --- | --- | --- |
| Deals / Flyers & Offers | Offer entity: deal type, sku, offer price, valid from/to, warehouses | `data/offers.json` |
| Delivery check + checkout windows | Delivery zones by postal prefix (FSA): next route, window, cut-off | `data/delivery-zones.json`, `lib/delivery.ts` |
| Ready-to-order kits | Bundle entity (name, blurb, items `{sku, qty}`) | `data/kits.json` |
| Pay on account | Customer credit terms + available credit (exists in the credit dashboard data) | `lib/session.tsx` (dummy) |

Existing integrations only: quick order / paste a list (SKU lookup + `addProductsToCart`), trending (Algolia trending),
frequently bought together (Algolia Recommend), recently viewed (GraphCommerce store), search suggestions (Algolia),
coupons (Magento cart price rules), checkout (Magento cart mutations + Stripe), sign-in (customer token).

## 5. Prototype-only behaviour

- Cart, favourites, history, coupon: `localStorage`; session and checkout draft: `localStorage` / `sessionStorage`.
- Sign in accepts any email with a 6+ character password and signs in as "Spice Route Kitchen" (shorter = error state).
- Coupon `SUPREME10` = 10% off; any other code shows the invalid-code error.
- Cards: `4242 4242 4242 4242` succeeds, `4000 0000 0000 0002` is declined. Nothing is charged or sent.
- HST is estimated (packaging, janitorial, equipment taxable; groceries zero-rated); Magento calculates the real tax.
- Two snapshot products are hand-marked out of stock (`SB002011`, `FV0040`) to show that state.
- The snapshot holds a few dozen products per department while counts are real Magento totals, so unfiltered listing
  pages beyond the snapshot cycle through it. Filtered results paginate exactly.
- Voice assistant, chat, voice search and photo search explain themselves in a toast/dialog instead of doing nothing.

## 6. Assets to replace placeholders

See the "Assets" section of the hand-off message; placeholders are marked `TODO(asset)` / `TODO(content)` /
`TODO(Stripe)` in the code (product placeholder, QR code, contact map, CMS page bodies, Stripe Elements).

## 7. QA done

`npm run build` and `tsc --noEmit` clean; no horizontal overflow at 390 / 800 / 1100 / 1280 / 1300 / 1440 / 1500 px on
any page; scripted journeys (search → add → cart edits → coupon → checkout with a declined then accepted card →
confirmation; sign in; URL-kept filters; quick-order dialog; keyboard mega-menu) pass at 1440 and 390 px with no console
errors; a11y sweep: one h1 per page, labelled inputs, named controls, no duplicate ids.
