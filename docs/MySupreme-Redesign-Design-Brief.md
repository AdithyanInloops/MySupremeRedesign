# MySupreme Website Redesign — Design Brief

Oct 5, 2026

## How to use this brief

Use this brief to build two redesign concepts of mysupreme.ca with dummy data, as separate projects, for client review. Whichever concept the client picks will be rebuilt inside the current codebase, so every screen must be buildable with the stack in the Tech stack section.

The sections below list every page, shared component, state and data shape the redesign has to cover. Paste the prompt below into your design tool or AI assistant, then attach the rest of this document as context.

```text
You are designing a full website redesign for MySupreme (mysupreme.ca), an Ontario B2B wholesale food and restaurant supply store with a cash & carry warehouse and delivery across the GTA, Hamilton and Niagara.

Create a complete, clickable design concept using realistic dummy data. Cover every page, component and state listed in the attached brief. Design mobile (390 px) and desktop (1440 px) for each page.

Constraints:
- It will be rebuilt in Next.js + GraphCommerce (Magento 2 backend) + MUI v5, so use components that map to MUI patterns (grids, cards, tabs, drawers, dialogs, selects).
- Product, price, cart, checkout and account data come from Magento; only fields listed in the brief exist. Do not invent features that need new backend data unless you mark them as "new feature".
- Buyers are restaurant owners and kitchen staff ordering in bulk: prioritise fast search, reorder, case/pack sizes and clear prices.
- Keep the brand recognisable: MySupreme red, the crown logo, Poppins type.
- Meet WCAG 2.1 AA contrast and 44 px touch targets.

Deliver: a page inventory, a component library (with states), all page designs for both breakpoints, and notes on any new feature that needs backend work.
```

## About MySupreme

MySupreme Food Service ("Supreme Cash & Carry") is a B2B wholesale food distributor that aims to be a restaurant's single supplier. It sells about 4,300 products online, plus walk-in sales at its cash & carry warehouse in Mississauga (3750A Laird Road, Unit 9).

| Topic | What the design needs to reflect |
| --- | --- |
| Customers | Restaurants, cafés, caterers, bakeries, food trucks, ghost kitchens, hospitality and event venues. A business account is normally required. |
| How they buy | Cash & carry walk-in, website, iOS/Android app, field sales rep. |
| Delivery | Same-day or next-day across the GTA, GTHA and Niagara Region; scheduled routes, cold-chain. |
| Catalog | 9 departments: Packaging (≈1,670 products), Grocery (≈1,690), Beverage (≈310), Janitorial (≈260), Produce, Dairy & Eggs, Frozen, Meat & Poultry, Ware & Equipment. |
| Contact | +1 365-777-0999 (phone and WhatsApp), sales@mysupreme.ca, Mon–Sat 9am–6pm. |
| Brand today | Red crown logo with "SUPREME Cash & Carry" wordmark in navy; bright red (#FF0000) as the main colour; Poppins type. |

What buyers care about most: finding an exact item fast (often by SKU), seeing case and pack sizes, reordering what they bought last time, and knowing when it will arrive.

## Tech stack and constraints

The chosen design will be rebuilt in this stack, so design with its building blocks rather than against them.

| Layer | Technology | What it means for the design |
| --- | --- | --- |
| Framework | Next.js 15 (pages router), React 18, hosted on Vercel | Pages are pre-rendered and refreshed every \~20 min; anything user-specific (prices for a logged-in business, cart, account) loads after the page. Design a skeleton/loading state for those parts. |
| Commerce | GraphCommerce 9 on Magento 2.4.7 (GraphQL) | Products, categories, prices, cart, checkout, customers, orders, wishlist, reviews and CMS blocks all come from Magento. Only use data fields listed in this brief. |
| UI kit | MUI v5 (Material UI) + Emotion, Poppins via @fontsource | Cards, grids, tabs, drawers, dialogs, selects, chips, steppers, snackbars map 1:1. Custom shapes are fine; exotic interactions cost extra build time. |
| Motion | framer-motion 11 (lazy-loaded), Swiper, react-slick | Scroll reveals, sliders and carousels are cheap. Heavy 3D or video backgrounds are not. |
| Visual editing | Plasmic (promo popup, region landing pages), Magento Page Builder CMS blocks (home banner slider) | Marketing banners should be self-contained blocks a non-developer can swap. |
| Search | Algolia (search, trending products, recommendations), plus image search (Google Vision) and voice search | Search bar must keep text, microphone and camera entry points. |
| Payments | Stripe (cards, saved methods), Magento payment methods | Checkout payment step has to host Stripe's card element. |
| Support | Botpress web chat bubble, OpenAI voice assistant button | Two floating buttons sit bottom-left and bottom-right on every page; leave room for them. |
| Other | Google Maps Places (address autocomplete), react-hook-form + zod (forms), jsPDF (invoice/quote PDFs), PWA (installable app), Lingui (copy is en-CA only today) | Address fields autocomplete; invoices and quotes download as PDF. |

Three rules for both concepts:

1. Mark anything that needs new backend data as "new feature" so it can be costed separately.
2. Keep one component library across all pages; the build reuses components, not page-specific one-offs.
3. Design every screen at 390 px and 1440 px; the site breakpoints are 500, 800, 1100 and 1500 px.

## Global layout

Every page shares one header, one footer and two floating support buttons; design them once with their desktop and mobile versions.

**Header — desktop (≥1100 px)**

- Logo (links home).
- Search bar, "Search by product or SKU", with a microphone (voice search), a camera (image search: upload a photo to find products) and a search button. Typing shows a live dropdown of matching products (image, name) and a loading state.
- "More" dropdown: Become a Supplier, 24x7 Customer Care, Download App.
- Favorites (wishlist), Cart with item-count badge, and Login. Once signed in, Login becomes an account menu: My Profile, Orders, Saved Addresses, Favorites, Sign out.
- Category bar: Home, the 9 departments from Magento (each opens a mega menu of sub-categories in columns, up to 3 levels deep), and Flyers & Offers with a NEW badge. Category names and order come from Magento, so allow 8–12 items of varying length.

**Header — mobile (<1100 px)**

- Hamburger, logo, wishlist, cart, account icons; full-width search bar underneath with the same mic and camera buttons.
- Hamburger opens a slide-in menu: departments with drill-down to sub-categories, then Flyers & Offers.

**Footer**

- Logo and a three-paragraph company description.
- Link columns: Categories (Packaging, Grocery, Frozen, Produce, Beverage, Dairy, Janitorial), About (About us, Terms & Uses, Safety & Security, Privacy Policy), Help (Contact, Online Help, Become a supplier, Blog).
- Secure payment logos (Mastercard, PayPal, Shop Pay, Visa), social links (Facebook, Instagram, LinkedIn), App Store and Google Play badges, copyright line.
- Cart and checkout hide the footer on mobile so the order summary and pay button stay in view.

**On every page**

- Voice assistant button (red mic, bottom-left) and chat bubble (Botpress, bottom-right). Content and sticky bars must not sit under them.
- Promo popup (Plasmic) on the home page, switchable from Magento admin.
- Toasts/snackbars for add-to-cart, wishlist and form results.

## Page inventory

The site has 42 designable pages in 7 areas. Priority 1 pages must be in both concepts; priority 2 can reuse priority 1 layouts; priority 3 can be a single generic template.

| Area | Page (route) | Purpose | Priority |
| --- | --- | --- | --- |
| Shopping | Home (`/`) | Banners, featured products, categories, brands, promos | 1 |
| Shopping | Category listing (`/packaging`, `/grocery/...`) | Products in a category with filters and sort | 1 |
| Shopping | Search results (`/search/<term>`) | Same as category listing, plus search term and suggestions | 1 |
| Shopping | Product detail (`/p/<product>`) | Images, price, pack size, add to cart, details, related products | 1 |
| Shopping | All categories (`/all-categories`) | Every department and sub-category | 2 |
| Shopping | Brands (`/brands`) | Grid of brand logos, each opens a brand-filtered search | 2 |
| Shopping | Flyers & Offers (`/flyers-offers`) | Warehouse deals; currently a "coming soon" page | 2 |
| Shopping | Compare (`/compare`) | Side-by-side products (feature switched off today) | 3 |
| Shopping | Wishlist / Favorites (`/wishlist`) | Saved products with add to cart | 2 |
| Cart & checkout | Cart (`/cart`) | Line items, quantities, totals, coupon, go to checkout | 1 |
| Cart & checkout | Checkout: shipping (`/checkout`) | Email, delivery address, delivery method | 1 |
| Cart & checkout | Checkout: payment (`/checkout/payment`) | Billing address, payment method (Stripe card), terms, place order | 1 |
| Cart & checkout | Order success (`/checkout/success`, `/thank-you`) | Confirmation, order number, next steps | 1 |
| Cart & checkout | Edit billing / edit address | Small forms reached from checkout | 2 |
| Account | Sign in / create account (`/account/signin`) | Email-first sign in, business sign-up | 1 |
| Account | Forgot / reset / create password, email confirm | Short single-form pages | 2 |
| Account | Account dashboard (`/account`) | Profile overview, credit summary, side menu of all account sections | 1 |
| Account | Orders list and order detail (`/account/orders`) | Online and direct-store (POS) orders, status, reorder, invoice PDF | 1 |
| Account | Credit dashboard (`/account/customerdashbord`) | Credit limit, available credit, outstanding, overdue, payment terms; invoices, quotes, payments, credit notes, statements | 1 |
| Account | Addresses (list, add, edit) | Address book with default billing/shipping | 2 |
| Account | Business / company info, name, contact, settings, password | Profile forms | 2 |
| Account | Reviews (list, add), downloads, delete account | Low-traffic utilities | 3 |
| Account | Guest order status (`/guest/orderstatus`) | Look up an order without an account | 3 |
| Company | About us, Contact us, Become a supplier, Download app, Online help (`/service`), Newsletter | Company story, forms, app links | 2 |
| Content | Blog, region landing pages (`/region/<city>`) | Built in Plasmic; design a template, not each page | 3 |
| Content | CMS pages (`/page/<slug>`), Privacy policy, Terms, Safety & security | Long-form text | 3 |
| System | 404 page, store switcher | Not found and error states | 3 |

Sitemaps, robots.txt and download links are technical routes with no design.

## Page-by-page requirements

These are the sections each priority 1 page must contain today. The order and look are open; dropping a section needs the client's sign-off.

### Home

- Hero banner slider: 1–5 images (separate desktop and mobile images) managed in Magento.
- Recommended products carousel (products flagged "recommended" in Magento, about 12).
- Promo tiles: two to four image cards linking to departments or campaigns.
- Department grid: the 9 departments with images (from Magento category images).
- Delivery banner ("We deliver daily across the GTA, Hamilton & Niagara").
- Brand strip: brand logos linking to brand search.
- New arrivals carousel (latest products).
- Offer cards with a call to action, and "Why MySupreme" feature cards.
- Promo popup (on/off from admin).

### Category listing and search results

- Breadcrumbs, category title, optional category description/banner, product count.
- Filter panel: left sidebar on desktop, full-screen drawer on mobile. Filters come from Magento (price, brand, sub-category, other attributes) and show counts; applied filters appear as removable chips with "Clear all".
- Sort: relevance, name, price low–high, price high–low.
- Product grid: 2 columns on mobile up to 4–5 on desktop; pagination or "load more".
- Search adds: the search term, "no results" with suggestions, and results from image search.

### Product detail

- Image gallery with thumbnails and arrows (many products have one image or a placeholder).
- Brand, product name, SKU, pack size/unit (e.g. "24x1L in a case", "500 ct"), price (and old price + % off when on sale).
- Quantity stepper + Add to cart; wishlist (favourite) toggle.
- Description (HTML from Magento) and reviews (star rating, list, write a review).
- "Looking similar", "Related products" (from Algolia) and "Recently viewed" carousels.

### Cart

- Line items: image, name, pack size, unit price, quantity stepper, row total, remove.
- Price summary: subtotal, discount, tax, delivery, grand total; coupon code field.
- Delivery area notice; "Proceed to checkout" (sticky on mobile); empty cart state.

### Checkout (2 steps)

1. Shipping: email (guests), saved address cards or a new address form with Google address autocomplete, delivery method options, order summary.
2. Payment: billing address (same as shipping toggle), payment methods including Stripe card entry and saved cards, terms checkbox, Place order.

Then the success page: order number, summary, "continue shopping", create-account prompt for guests.

### Account dashboard

- Profile header: business name, "MySupreme Member" badge, contact details.
- Credit summary: credit limit, available credit, outstanding balance, due amount, overdue amount, payment terms.
- Side menu grouped as: Profile & Overview (personal info, company information, address book), Orders & Quotes (online orders, direct-store/POS orders, quotes & estimates), Billing & Statements (invoices & bills, payments history, credit notes, account statement), Wishlist & Favorites, Logout.
- Orders list with status filters (Pending, Confirmed, On the way, Delivered, Cancelled); order detail with items, totals, reorder, and invoice download (PDF).
- Invoice list with statuses (Paid, Partial, Overdue).

### Flyers & Offers

Currently a "coming soon" page: departure-board hero, deal-type showcase (Monthly Flyer, Weekly Hot Picks, Bulk Saver, Restaurant Bundles), warehouse picker, sneak-peek offer cards. In the redesign, also design the "live" version with real prices, validity dates and add to cart.

## Component library

Design these 20 components once, with every variant and state, before laying out pages; the build team implements them as shared MUI components.

| Component | Used on | Content and variants | States to show |
| --- | --- | --- | --- |
| Product card | Home, listings, PDP carousels, wishlist, flyers | Image (square), SKU, name (2-line clamp), pack-size chip, price, old price + % off badge, wishlist star, quantity box + Add to cart. Variants: grid, carousel (narrow), list row. | Default, hover, on sale, out of stock, no image, adding, added, logged-out price |
| Price | Everywhere | Final price, crossed-out regular price, % off, per-unit price (new feature), "from" price for configurable products | Regular, sale, customer-group price |
| Quantity + Add to cart | Cards, PDP, cart | Number field with −/+ and an Add to cart button; on configurable/grouped products a "View product" button instead | Disabled, loading, success toast, error |
| Buttons | All | Primary (filled), secondary (outline), text, icon, pill | Hover, focus, disabled, loading |
| Search bar + dropdown | Header | Input, mic, camera, submit; live results list | Typing, loading, results, no results, voice listening, image upload dialog |
| Mega menu / mobile drawer | Header | 3 levels of categories in columns; drill-down on mobile | Open, hover, active page |
| Breadcrumbs | Listings, PDP | Home > Department > Sub-category > Product | Long trail truncation on mobile |
| Filter panel + chips | Listings | Checkbox lists with counts, price range, "show more", applied chips | Collapsed, expanded, applied, mobile drawer |
| Sort select, pagination | Listings | Dropdown; page numbers or load more | — |
| Carousel / slider | Home, PDP | Hero banner (dots, arrows, autoplay) and product rows (scroll, arrows) | First, middle, last slide |
| Banner / promo tile | Home, flyers | Image + headline + button; must work as a pure image from Magento too | — |
| Category tile, brand tile | Home, all-categories, brands | Image or logo + name | Missing image fallback |
| Cart line item | Cart, mini summaries | Image, name, pack size, price, stepper, remove | Updating, error |
| Order summary | Cart, checkout | Subtotal, discount, tax, delivery, total, coupon field | Coupon applied/invalid |
| Address card | Checkout, account | Name, company, street, city, postal code, phone; default badges | Selected, editing |
| Form fields | Sign in, checkout, account, contact, supplier forms | Text, email, phone, password (show/hide), select, checkbox, radio, textarea, file upload, address autocomplete | Focus, error message, disabled, success |
| Stepper | Checkout | Shipping > Payment | Current, done |
| Status chip | Orders, invoices | Pending, Confirmed, On the way, Delivered, Cancelled; Paid, Partial, Overdue | Colour per status |
| Data table / list | Account (orders, invoices, payments, quotes) | Sortable columns on desktop, stacked cards on mobile, download PDF action | Empty, loading, paginated |
| Feedback | All | Toast/snackbar, dialog/modal, skeleton loaders, empty-state block, inline alert | Success, info, warning, error |

## States and edge cases

The real catalog is messy, so each concept must show how its design handles these cases, not only the ideal one.

| Case | What happens in the real data | What to design |
| --- | --- | --- |
| Missing product images | Many products show the grey "SUPREME" placeholder | A placeholder that still looks good in a full grid of them |
| Long names and SKUs | Names like "Eco-Craze – MFPP Clamshell Vented Cont. – 9"x5.5"x2.6" – A905"; SKUs from "BM0089" to 17-digit barcodes like "59620000008478349" | 2-line clamp with full name on hover/PDP; SKU in small mono text that never breaks the layout |
| Pack sizes | Free text: "1ltr", "24x1L in a case", "10x20g", "500 ct" | A consistent pack-size chip |
| Prices | No products are on sale today; business customers may see customer-group prices after login | Normal price, sale price, and a "price after login" variant |
| Product types | Simple products add straight to cart; configurable and grouped ones need a choice first | Card with Add to cart vs "View product" |
| Guest vs signed in | Header, prices, wishlist, checkout email and account all change | Both versions of the header and checkout |
| Loading | Pages are cached, but cart, account and personalised blocks load after | Skeletons for product grids, cart, account panels |
| Empty | Empty cart, wishlist, search, orders, invoices, flyers | A helpful empty state with a next step for each |
| Errors | Out of stock, quantity limits, invalid coupon, payment declined, address outside delivery area (GTA, Hamilton, Niagara only) | Inline and toast error patterns |
| Long lists | Mega menu with 10+ sub-categories, filters with 30+ brands, 4,300 products | Scroll, "show more" and search-within-filter patterns |
| Floating buttons | Voice and chat buttons sit on every page | Keep bottom-left and bottom-right corners free; sticky mobile bars must clear them |

## Brand tokens and responsive rules

Both concepts can evolve the look, but they must keep the red crown, Poppins and a red-led palette so the client recognises the brand. These are the values in the code today.

| Token | Current value | Note |
| --- | --- | --- |
| Primary | #FF0000 (red), plus #FF413D used widely for buttons and accents | White text on #FF0000 is 4.0:1 and on #FF413D 3.5:1, below the 4.5:1 AA minimum for normal text. Use a deeper red such as #D50000 (5.5:1) for text-bearing buttons, or white text ≥18.7 px bold. |
| Secondary | #2D297D (navy, the logo wordmark) | Good for headings, badges and dark sections |
| Text | #0C0C0C / #111827 primary, #4B5563 and #6B7280 secondary |  |
| Surfaces and lines | #FFFFFF, #F9FAFB, #F3F4F6; borders #E5E7EB, #D1D5DB |  |
| Success | #01D26A | Status chips, confirmations |
| Font | Poppins, falls back to the system sans-serif | Already self-hosted; other fonts add load time, so name any extra font in the hand-off. |
| Radius | Theme base 3 px; cards and pills use 8–16 px and 40–80 px in practice | Pick one scale and use it consistently |
| Mode | Light only (a dark palette exists in code but is unused) |  |

**Breakpoints** (MUI theme): xs 0, sm 500, md 800, lg 1100, xl 1500 px. The full desktop header with the category bar starts at 1100 px; below that the hamburger menu is used. Content sits in a centred container up to about 1500 px.

**Accessibility (WCAG 2.1 AA)**

- Text contrast at least 4.5:1 (3:1 for large text and icons).
- Touch targets at least 44 × 44 px; visible focus rings on every interactive element.
- Never use colour alone for status (pair chips with text or icons).
- Motion must have a reduced-motion version (the flyers page already does this).
- Every image needs alt text; product cards read as "name, pack size, price" to screen readers.

## Dummy data guide

Use dummy data with the same fields and messiness as the real catalog, so the client judges a design against what will actually ship. These sample products are real items and prices seen on the site on 2026-10-01 (guest prices, CAD).

```csv
sku,name,brand,pack_size,price_cad,category,has_image
59620000008478349,Monin - Lime Syrup 1 Lt,Monin,1ltr,8.50,Beverage,yes
59620000008478332,Finest Call - Margarita 6X1 Lt,Finest Call,6X1 Lt in a case,48.99,Beverage,no
59620000008252936,Coca Cola - Coke - Original - Cans-32-355ml,Coca Cola,32x355ml,20.99,Beverage,no
BM0089,Monin - Salted Caramel syrup,Monin,1ltr,12.29,Beverage,no
HD0031,Nestle - Coffee/Tea Whitener - Everyday 1.8 kg,Nestle,1.8 kg,35.50,Beverage,no
HD0030,Nestle - everyday Kashmiri Tea (10 sticks),Nestle,10x20g,6.50,Beverage,no
BW0028,Element O Water - 1Lt,Element O,24x1L in a case,1.99,Beverage,no
CD0219,Aroy-D - Coconut Milk,Aroy-D,400 ml,2.50,Grocery,no
```

7 of the 8 sample products above have no photo, so mix placeholders into every grid.

| Data object | Fields available from Magento | Example |
| --- | --- | --- |
| Category | Name, URL, image, description, product count, up to 3 levels of children | Grocery (1,686) > Plant based > Bulk Rice |
| Product | SKU, name, brand, pack size/unit, price, regular price, % off, images, description (HTML), stock status, rating and reviews, related and similar products | See CSV above |
| Banner | Desktop image, mobile image, link | 1920 × 500 px delivery banner |
| Customer | Name, email, phone, business name, business category and structure, HST number, addresses | "Spice Route Kitchen", Mississauga |
| Credit | Credit limit, available credit, outstanding, due, overdue, payment terms | $10,000 limit, $7,450 available, Net 30 |
| Order | Number, date, channel (online or direct store), status, items, totals, invoice PDF | #000123, Delivered, $482.16 |
| Invoice / payment / quote | Number, date, amount, status (Paid, Partial, Overdue) | INV-2041, Overdue |
| Warehouse (flyers, new) | Name, service area | Mississauga — Peel & West GTA |
| Offer (flyers, new) | Deal type, product, regular and offer price, valid from/to, warehouses | Bulk Saver, 5+ cases $22.49 |

Placeholder text should be food-service specific (restaurant names, kitchen products), never lorem ipsum, so the client reviews real-feeling content.

## Checklist and hand-off

Each concept is ready for client review when every box below is ticked; the hand-off items are what the build needs if the client picks it.

**Before the client review (per concept)**

- [ ] All priority 1 pages designed at 390 px and 1440 px
- [ ] Header (guest and signed in), mega menu, mobile drawer and footer
- [ ] Component library page with every component's variants and states
- [ ] Product card shown with: photo, placeholder, sale price, long name, configurable product
- [ ] Empty, loading and error states for cart, search, account lists
- [ ] Checkout flow clickable end to end with dummy data
- [ ] Contrast checked on every red button and red text
- [ ] Voice and chat floating buttons placed on every screen
- [ ] Every "new feature" (needs backend work) labelled
- [ ] A one-page summary of the concept's idea for the client

**Hand-off to development (chosen concept only)**

- [ ] Design tokens: colours, type scale, spacing scale, radii, shadows, breakpoints
- [ ] Components named to match the list above, with specs (sizes, spacing, states)
- [ ] Exported icons (SVG) and image assets with crop rules (product images are square; banners 1920 × 500 desktop plus a mobile crop)
- [ ] Interaction notes: hover, transitions, sliders, sticky elements, scroll behaviour
- [ ] List of new features with the data each one needs
- [ ] Any extra fonts or third-party libraries the design depends on

The rebuild reuses the existing data, routes and integrations, so it is mostly a front-end change; new features are scoped separately.
