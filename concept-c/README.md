# MySupreme — Concept C: mobile app (design prototype)

A clickable design of the MySupreme customer app for client review. It follows **Concept A “Pro Counter”** (the
client-approved website concept) — navy-led brand, deep red actions, saffron deal highlights, Poppins with mono SKUs,
Concept A's catalogue and account data — plus the parts of Concept B that suit a phone (quick order by SKU, paste a
list, the cart-linked stepper, flyer-style deals). Dummy data only; nothing is sent anywhere.

    npm install
    npm run dev        # http://localhost:5190  (also on your network IP, for opening on a phone)
    npm run build      # static site in dist/ (hash routing — host anywhere, e.g. its own Vercel project)
    npm run preview    # serve the build on :5190

On a laptop the app renders as a phone-width column centred in the window (no device frame); on a phone it fills the
screen and can be added to the home screen. Swipe rails, slides and galleries can be dragged with a mouse.

## Presenting

1. First visit opens the **welcome** slides → **Sign in** (the demo business account is pre-filled) → Home.
   “Browse as a guest” shows the guest version (no business prices, orders or credit).
2. Suggested walk-through: Home (the current app's home + the new Offers & Flyers section: add a deal)
   → Category → a department → product → Cart tab (promo `SUPREME10`, top-up suggestions) → Checkout (delivery window,
   pay on account) → Order placed → Track order → More → Offers (switch warehouse, tap a flyer) → Orders / Invoices →
   Pay. Quick order and Scan are in More and the cart.
3. **Account › Reset demo** clears everything and starts again from the welcome screen.

## Screens

| Tab / flow | Screens |
| --- | --- |
| Onboarding | Welcome slides, Sign in, Open a business account |
| Home | **Kept as the current MySupreme app** (client screenshots, 2026-10-08): logo header with search and Log in, banner slider (the client's mobile banners), Recommended Products (3-up), New Arrivals, Discover Products for you (Add to cart). **Redesigned:** the category row (our own two-tone SVG illustrations, `src/components/CategoryArt.tsx`) and Our Brands (a swipe row of round logo badges). **One addition: Offers & Flyers** under the banners — one pastel "All offers" flyer poster merging every flyer at your warehouse (headline saving, time left, deals with Add to cart; per-flyer tabs can be switched on from the CMS). It's drawn from CMS blocks (banner / rail / grid + JSON), so it's managed in Magento — see [docs/OFFERS-CMS.md](docs/OFFERS-CMS.md) and **More › Offers: CMS blocks**. Brand logos and the header crown are in `public/brands` and `public/logo-crown.png` |
| Category | Departments, brands → department listing (sub-category pills, sort + filter sheets, grid / list) → product (gallery, business price, offer, options, delivery estimate, details / specs / reviews) |
| Search | Recent + trending, live product and category results |
| Cart & checkout | Cart tab with live count (steppers, undo, delivery-minimum meter with top-up suggestions, promo, add by SKU / scan; empty cart suggests usuals), one-page checkout (delivery or pickup, windows, on account / card / Apple Pay / pay at pickup, PO number), order placed |
| Orders (More) | Online + in-store orders, status filters, one-tap reorder → order detail (status timeline, driver, items, invoice PDF, reorder all) |
| Offers (More / Home) | Warehouse picker, countdown, flyer posters per deal type, deal grid, Monday deal alerts |
| More | Business profile, Orders / Offers / Addresses shortcuts, credit card (available / outstanding / overdue), invoices, payments, statements, quotes with pay flow, favorites, addresses, warehouse, settings, help |
| Tools | Barcode scanner (camera simulated), Quick order (type SKUs or paste a list), notifications |

## Prototype-only

- Sign in accepts the pre-filled demo account; Face ID, Apple Pay, push notifications and the camera are simulated.
- `SUPREME10` = 10% off. HST is estimated at 13%.
- Tabs match the current app: Home · Category · Cart · Favourites · More. Orders, offers, invoices and settings are
  under More; favourites use the app's star.
- Data: `src/data/catalog.ts` and `src/data/account.ts` are Concept A's dummy data; `src/data/app.ts` adds delivery
  windows and notifications. State lives in `localStorage` (`ms-c-*`).
- New backend features, as in Concepts A/B: offers/flyers per warehouse, delivery zones and windows, per-unit prices.
