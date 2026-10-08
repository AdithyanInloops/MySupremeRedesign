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
2. Suggested walk-through: Home (banner slider, quick actions, live delivery card, pick up where you left off, buy it
   again, credit) → Scan item → Quick order (paste the sample list) → Shop → a department → product → Cart tab (promo
   `SUPREME10`, top-up suggestions) → Checkout (delivery window, pay on account) → Order placed → Track order → Deals
   (switch warehouse, tap a flyer) → Account → Orders / Invoices → Pay.
3. **Account › Reset demo** clears everything and starts again from the welcome screen.

## Screens

| Tab / flow | Screens |
| --- | --- |
| Onboarding | Welcome slides, Sign in, Open a business account |
| Home | Deliver-to picker, notifications, search + scan (sticky once you scroll), hero banner slider (the client's own mobile banners, `public/banners/`), Reorder / Quick order / Scan / Orders, live order tracking, pick up where you left off (open cart → checkout, recently viewed), Buy it again, credit snapshot, weekly hot picks, departments, promos, recommended, new arrivals, rep contact |
| Shop | Departments, brands → department listing (sub-category pills, sort + filter sheets, grid / list) → product (gallery, business price, offer, options, delivery estimate, details / specs / reviews) |
| Search | Recent + trending, live product and category results |
| Cart & checkout | Cart tab with live count (steppers, undo, delivery-minimum meter with top-up suggestions, promo, add by SKU / scan; empty cart suggests usuals), one-page checkout (delivery or pickup, windows, on account / card / Apple Pay / pay at pickup, PO number), order placed |
| Orders (Account / Home) | Online + in-store orders, status filters, one-tap reorder → order detail (status timeline, driver, items, invoice PDF, reorder all) |
| Deals | Warehouse picker, countdown, flyer posters per deal type, deal grid, Monday deal alerts |
| Account | Business profile, Orders / Favorites / Addresses shortcuts, credit card (available / outstanding / overdue), invoices, payments, statements, quotes with pay flow, favorites, addresses, warehouse, settings, help |
| Tools | Barcode scanner (camera simulated), Quick order (type SKUs or paste a list), notifications |

## Prototype-only

- Sign in accepts the pre-filled demo account; Face ID, Apple Pay, push notifications and the camera are simulated.
- `SUPREME10` = 10% off. HST is estimated at 13%.
- Tabs: Home · Shop · Deals · Cart · Account. Orders sit under Account and on Home, so the cart is always one tap away.
- Data: `src/data/catalog.ts` and `src/data/account.ts` are Concept A's dummy data; `src/data/app.ts` adds delivery
  windows and notifications. State lives in `localStorage` (`ms-c-*`).
- New backend features, as in Concepts A/B: offers/flyers per warehouse, delivery zones and windows, per-unit prices.
