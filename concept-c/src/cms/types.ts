/**
 * CMS contract for the Offers & Flyers section.
 *
 * Every block is one CMS entry of an existing app block type (`banner`, `rail` or `grid`). Its `variant` names the
 * offers design to draw, and the rest of the JSON (stored in that entry's variant field) is the content. Content
 * managers only enter text, image `src`s, links, dates and product sources. Prices, discounts and stock always come
 * from Magento products (special price + dates), never from this JSON.
 */

/** Where a tap goes. 'category/<url_key>' · 'product/<sku>' · 'search/<term>' · 'page/flyers' · 'https://…' */
export type CmsLink = string

/** Muted pastel greens only (the offers palette); text on them is always deep green, so contrast stays readable. */
export type Accent = 'sage' | 'mint' | 'seafoam' | 'pistachio'

/** Small icon beside a flyer name. */
export type CmsIcon = 'tag' | 'flame' | 'calendar' | 'box' | 'utensils'

/** Optional on any item: shown only between these times and only at these warehouses (ids: mis, ham, nia). */
export type Schedule = {
  starts_at?: string // ISO 8601, e.g. "2026-10-05T00:00:00-04:00"
  ends_at?: string
  warehouses?: string[]
}

/** Which products to show. Magento returns their prices: regular_price, final_price, discount.percent_off. */
export type ProductSource = {
  category?: string // category url_key, e.g. "weekly-hot-picks" (a hidden category per flyer)
  skus?: string[] // or a hand-picked list, in this order
  limit?: number // default 10
}

type Heading = {
  title?: string // section heading; omit when the block continues the previous one
  show_all_link?: CmsLink // adds "Show all ›" next to the title
}

/** banner · offer-hero — flyer artwork carousel; the app adds the countdown chip and the % sticker. */
export type OfferHeroBlock = Heading & Schedule & {
  type: 'banner'
  variant: 'offer-hero'
  items: (Schedule & {
    src: string // 16:9 artwork, 1600×900; keep the top-right and bottom-left corners free of text
    title: string // alt text — what the artwork says
    link?: CmsLink
    sticker?: string // up to 14 characters, e.g. "UP TO 58% OFF"
    countdown?: boolean // "Ends in 3d 16h" from ends_at (default true when ends_at is set)
  })[]
}

/** grid · flyer-tiles — one tile per flyer; uploaded cover art (src) or a tile the app draws from text + accent. */
export type FlyerTilesBlock = Heading & Schedule & {
  type: 'grid'
  variant: 'flyer-tiles'
  columns?: 2 | 3 // default 2
  items: (Schedule & {
    title: string // "Weekly Hot Picks"
    subtitle?: string // "Fresh deep-cuts every Monday"
    src?: string // 4:5 cover, 800×1000; keep the bottom-left corner free (countdown). Without it the app draws the tile
    accent?: Accent // default sage
    icon?: CmsIcon // default tag
    link: CmsLink
    sticker?: string // drawn tiles only, e.g. "UP TO 28%"
  })[]
}

/** rail · deal-products — swipe row of deal cards (−%, offer vs regular price, saving, Add to cart). */
export type DealProductsBlock = Heading & Schedule & {
  type: 'rail'
  variant: 'deal-products'
  source: ProductSource
}

/** rail · flyer-tabs — one tab per flyer; the selected flyer opens as a poster holding its deals. */
export type FlyerTabsBlock = Heading & Schedule & {
  type: 'rail'
  variant: 'flyer-tabs'
  all_tab?: string | false // label of a first tab that merges every flyer (default "All offers"); false hides it
  all_accent?: Accent // colour of that merged poster (default sage)
  show_tabs?: boolean // default true. false = no tab row: one poster merging every tab's deals, titled all_tab
  tabs: (Schedule & {
    label: string // "Bulk Saver"
    accent?: Accent
    icon?: CmsIcon
    headline?: string // default "Save up to {max_off}%" — {max_off} is the biggest discount in the source
    body?: string // one line under the headline
    source: ProductSource
    link?: CmsLink // "View the full flyer" target (default: the source category)
  })[]
}

export type CmsBlock = OfferHeroBlock | FlyerTilesBlock | DealProductsBlock | FlyerTabsBlock
