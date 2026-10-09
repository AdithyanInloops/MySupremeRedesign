# Offers & Flyers: CMS blocks (Magento)

The Home "Offers & Flyers" area is built from the app's existing CMS block types, **banner**, **rail** and **grid**.
Each block is one CMS entry: its `type`, a `variant` naming the offers design, and a JSON payload stored in the entry's
variant field. Content managers enter only text, image `src`s, links, dates and which products. Prices, % off and
stock always come from the Magento products. The section uses its own muted pastel greens, and deal cards are the Home
product card showing the price difference (offer price, regular price struck through, "You save $…"), with no % badge.

- Live preview of every block with its JSON: run Concept C and open **More › Offers: CMS blocks** (`#/cms`).
- Sample JSON: [`src/cms/json/`](../src/cms/json). TypeScript contract: [`src/cms/types.ts`](../src/cms/types.ts).
- JSON Schema for validating on save in admin: [`offers-blocks.schema.json`](offers-blocks.schema.json) (draft-07).
- Reference renderer (validate, schedule, links, products): [`src/cms/resolve.ts`](../src/cms/resolve.ts),
  [`src/cms/OfferBlocks.tsx`](../src/cms/OfferBlocks.tsx).

## The four blocks

| type · variant | What it draws | Content needed |
| --- | --- | --- |
| `rail · flyer-tabs` (on Home, `show_tabs: false`) | A pastel flyer poster (headline, time left, "UP TO % OFF" sticker) with its deals and Add to cart. Home shows one "All offers" poster merging every flyer; with tabs on, there's one tab per flyer | Per flyer: label, colour, product source; optional headline, body, end date |
| `banner · offer-hero` | Flyer artwork carousel. The app adds the countdown chip and % sticker | Per slide: 16:9 image, alt text, link; optional sticker text, dates |
| `grid · flyer-tiles` | 2- or 3-column flyer covers | Per tile: title, link; either a 4:5 cover image **or** colour + icon (the app draws the tile) |
| `rail · deal-products` | Swipe row of deal cards (the Home product card: offer price, regular price struck through, "You save $", Add to cart) | A category or a list of SKUs |

Blocks are rendered in the order the CMS returns them, so the area can be rearranged (e.g. a hero banner above the
tabs) without an app release.

## Magento setup

1. **Flyers are categories.** Create one category per flyer, hidden from the menu (`include_in_menu = 0`):
   `weekly-hot-picks`, `monthly-flyer`, `bulk-saver`, `restaurant-bundles`. Assign the deal products to it.
2. **Deal prices are product prices.** Set `special_price` with `special_from_date` / `special_to_date` (or a catalog
   price rule). The app reads `price_range.minimum_price` → `regular_price`, `final_price`, `discount.percent_off`.
   Nothing about prices is typed into the JSON, so the block never shows a stale price.
3. **One CMS entry per block**, of type banner / rail / grid, with the JSON in its variant field. Validate the JSON
   against `offers-blocks.schema.json` on save; it rejects unknown fields (e.g. `end_at`), wrong colours and bad links.
4. **Images** are uploaded to Magento media; put the full URL in `src`.

Products for a source, with standard Magento GraphQL:

```graphql
query FlyerCategory($urlKey: String!) {
  categoryList(filters: { url_key: { eq: $urlKey } }) { uid }
}

query FlyerProducts($uid: String!, $size: Int = 10) {
  products(filter: { category_uid: { eq: $uid } }, pageSize: $size) {
    items {
      sku name url_key stock_status small_image { url }
      price_range { minimum_price { regular_price { value } final_price { value } discount { percent_off amount_off } } }
    }
  }
}
# Hand-picked list: products(filter: { sku: { in: $skus } }) — the app keeps the JSON order.
```

## Fields

Every block also accepts `title` (section heading), `show_all_link`, `starts_at`, `ends_at` and `warehouses`. Every
item/tab accepts `starts_at`, `ends_at` and `warehouses`.

| Field | Format |
| --- | --- |
| link fields | `category/<url_key>`, `product/<sku>`, `search/<term>`, `page/flyers` (also `quick-order`, `help`, `cart`), or `https://…` |
| `accent` | `sage`, `mint`, `seafoam`, `pistachio` (the section's muted pastel greens; text on them is deep green, so contrast stays readable) |
| `icon` | `tag`, `flame`, `calendar`, `box`, `utensils` |
| dates | ISO 8601 with offset, e.g. `2026-10-11T23:59:59-04:00` |
| `warehouses` | `mis`, `ham`, `nia`; leave out for all |
| `source` | `{ "category": "<url_key>" }` or `{ "skus": [...] }`, optional `"limit"` (default 10, max 30) |

Per variant:

- **flyer-tabs**: `tabs[].label` and `tabs[].source` are required. Optional: `accent`, `icon`, `headline` (default
  `Save up to {max_off}%`; `{max_off}` is filled from the products), `body`, `link` (default: the source category),
  `ends_at` (shows "Ends in …"). `all_tab`: label of a first tab that merges every flyer (default "All offers"),
  `false` to hide it; `all_accent` its colour. `show_tabs: false` (used on Home) drops the tab row and shows only the
  merged poster.
- **offer-hero**: `items[].src` (16:9, 1600×900; keep the top-right and bottom-left corners free) and `items[].title`
  (alt text) are required. Optional: `link`, `sticker` (≤ 14 characters), `countdown: false`.
- **flyer-tiles**: `items[].title` and `items[].link` are required. Optional: `src` (4:5, 800×1000; keep the
  bottom-left corner free), or leave it out and set `accent`, `icon`, `sticker`; `subtitle`; `columns` (2 or 3).
- **deal-products**: `source` is required.

## How the app treats the JSON

- Unknown `type · variant` → the block is skipped (so a newer CMS never breaks an older app).
- Items missing required fields are dropped. If nothing is left, the block is hidden.
- Anything outside its dates, or not offered at the buyer's warehouse, is hidden. Flyers can be scheduled ahead, and
  they disappear when they end without anyone unpublishing them.
- A tab or rail whose source returns no products is hidden.
- Category sources are sorted by biggest discount; SKU lists keep their order.

## Open questions for the backend

- Map these keys onto the existing variant JSON if it already uses other names (e.g. `image` instead of `src`). The
  shapes stay the same.
- If flyer prices differ by warehouse, they need per-warehouse price data (store views / sources). `warehouses` here
  only decides which flyers and slides show.
