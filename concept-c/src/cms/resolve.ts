import { deptBySlug, offers, productBySku, productsInDept, type Product } from '../data/catalog'
import { productPath } from '../components/ProductCard'
import type { Accent, CmsBlock, CmsIcon, CmsLink, ProductSource, Schedule } from './types'

/*
 * What the app does with a CMS block before drawing it: validate the JSON (drop what's unusable, never crash), apply
 * the schedule and warehouse, turn links into screens, and load the products behind a source. In production the
 * product part is a Magento GraphQL `products` query; here it reads the prototype catalogue.
 */

export const ACCENTS: Accent[] = ['sage', 'mint', 'seafoam', 'pistachio']
export const ICONS: CmsIcon[] = ['tag', 'flame', 'calendar', 'box', 'utensils']

const str = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : undefined)
const date = (v: unknown) => { const s = str(v); return s && !Number.isNaN(Date.parse(s)) ? s : undefined }
const schedule = (o: Record<string, unknown>): Schedule => ({
  starts_at: date(o.starts_at), ends_at: date(o.ends_at),
  warehouses: Array.isArray(o.warehouses) ? o.warehouses.filter((w): w is string => typeof w === 'string') : undefined,
})
const accent = (v: unknown): Accent => (ACCENTS.includes(v as Accent) ? (v as Accent) : 'sage')
const icon = (v: unknown): CmsIcon => (ICONS.includes(v as CmsIcon) ? (v as CmsIcon) : 'tag')
const source = (v: unknown): ProductSource | undefined => {
  if (!v || typeof v !== 'object') return undefined
  const o = v as Record<string, unknown>
  const skus = Array.isArray(o.skus) ? o.skus.filter((s): s is string => typeof s === 'string' && !!s.trim()) : undefined
  const category = str(o.category)
  if (!category && !skus?.length) return undefined
  return { category, skus, limit: typeof o.limit === 'number' && o.limit > 0 ? Math.min(30, Math.floor(o.limit)) : undefined }
}

/** Validate one block. Unusable items are dropped (and reported in `issues`); returns null if nothing is left. */
export function parseBlock(raw: unknown, issues: string[] = []): CmsBlock | null {
  if (!raw || typeof raw !== 'object') { issues.push('Block is not an object'); return null }
  const o = raw as Record<string, unknown>
  const head = { title: str(o.title), show_all_link: str(o.show_all_link), ...schedule(o) }
  const items = (key: string) => (Array.isArray(o[key]) ? (o[key] as unknown[]) : []).filter((x): x is Record<string, unknown> => !!x && typeof x === 'object')
  const kind = `${o.type} · ${o.variant}`
  switch (kind) {
    case 'banner · offer-hero': {
      const list = items('items').flatMap((it, i) => {
        const src = str(it.src), title = str(it.title)
        if (!src || !title) { issues.push(`items[${i}]: needs src and title`); return [] }
        return [{ src, title, link: str(it.link), sticker: str(it.sticker)?.slice(0, 14), countdown: it.countdown !== false, ...schedule(it) }]
      })
      return list.length ? { type: 'banner', variant: 'offer-hero', ...head, items: list } : null
    }
    case 'grid · flyer-tiles': {
      const list = items('items').flatMap((it, i) => {
        const title = str(it.title), link = str(it.link)
        if (!title || !link) { issues.push(`items[${i}]: needs title and link`); return [] }
        return [{ title, link, subtitle: str(it.subtitle), src: str(it.src), accent: accent(it.accent), icon: icon(it.icon), sticker: str(it.sticker)?.slice(0, 14), ...schedule(it) }]
      })
      return list.length ? { type: 'grid', variant: 'flyer-tiles', ...head, columns: o.columns === 3 ? 3 : 2, items: list } : null
    }
    case 'rail · deal-products': {
      const src = source(o.source)
      if (!src) { issues.push('source: needs a category or skus'); return null }
      return { type: 'rail', variant: 'deal-products', ...head, source: src }
    }
    case 'rail · flyer-tabs': {
      const tabs = items('tabs').flatMap((it, i) => {
        const label = str(it.label), src = source(it.source)
        if (!label || !src) { issues.push(`tabs[${i}]: needs label and source`); return [] }
        return [{ label, source: src, accent: accent(it.accent), icon: icon(it.icon), headline: str(it.headline), body: str(it.body), link: str(it.link), ...schedule(it) }]
      })
      return tabs.length ? { type: 'rail', variant: 'flyer-tabs', ...head, all_tab: o.all_tab === false ? false : str(o.all_tab) ?? 'All offers', all_accent: o.all_accent === undefined ? undefined : accent(o.all_accent), show_tabs: o.show_tabs !== false, tabs } : null
    }
    default:
      issues.push(`Unknown type/variant "${kind}" — skipped`)
      return null
  }
}

/** Inside its dates and offered at this warehouse? */
export const isLive = (s: Schedule, warehouse: string, now = Date.now()) =>
  (!s.starts_at || Date.parse(s.starts_at) <= now) && (!s.ends_at || Date.parse(s.ends_at) > now) && (!s.warehouses?.length || s.warehouses.includes(warehouse))

/** Flyers are hidden Magento categories; in the prototype they map onto the offer data. */
const FLYER_CATEGORIES: Record<string, string> = { 'weekly-hot-picks': 'Weekly Hot Picks', 'monthly-flyer': 'Monthly Flyer', 'bulk-saver': 'Bulk Saver', 'restaurant-bundles': 'Restaurant Bundles' }

/** A CMS link → an in-app route (`to`) or an external page (`href`). */
export function resolveLink(link?: CmsLink): { to?: string; href?: string } {
  if (!link) return {}
  if (/^https?:\/\//.test(link)) return { href: link }
  const [kind, ...rest] = link.replace(/^\//, '').split('/')
  const value = decodeURIComponent(rest.join('/'))
  if (kind === 'category') return { to: FLYER_CATEGORIES[value] ? '/deals' : deptBySlug(value) ? `/shop/${value}` : `/search?q=${encodeURIComponent(value)}` }
  if (kind === 'product') { const p = productBySku(value); return { to: p ? productPath(p) : `/search?q=${encodeURIComponent(value)}` } }
  if (kind === 'search') return { to: `/search?q=${encodeURIComponent(value)}` }
  if (kind === 'page') return { to: ({ flyers: '/deals', 'quick-order': '/quick-order', help: '/help', cart: '/cart' } as Record<string, string>)[value] ?? '/' }
  return {}
}

/** One product as a deal card needs it — the fields Magento's price_range gives. */
export type DealItem = { product: Product; final: number; regular: number; pct: number; offerId?: string; note?: string }

/** The products behind a source, at this warehouse (prototype stand-in for the Magento products query). */
export function productsFor(src: ProductSource, warehouse: string): DealItem[] {
  const limit = src.limit ?? 10
  const fromOffer = (sku: string, deal?: string) => {
    const o = offers.find((x) => x.sku === sku && x.warehouses.includes(warehouse) && (!deal || x.deal === deal))
    const product = productBySku(sku)
    if (!product) return null
    if (o) return { product, final: o.offerPrice, regular: o.regular, pct: Math.round((1 - o.offerPrice / o.regular) * 100), offerId: o.id, note: o.note }
    return { product, final: product.price, regular: product.regular ?? product.price, pct: product.regular ? Math.round((1 - product.price / product.regular) * 100) : 0 }
  }
  let list: (DealItem | null)[] = []
  if (src.skus?.length) list = src.skus.map((s) => fromOffer(s))
  else if (src.category && FLYER_CATEGORIES[src.category]) list = offers.filter((o) => o.deal === FLYER_CATEGORIES[src.category!] && o.warehouses.includes(warehouse)).map((o) => fromOffer(o.sku, o.deal))
  else if (src.category) list = productsInDept(src.category).filter((p) => p.regular).map((p) => fromOffer(p.sku))
  const items = list.filter((x): x is DealItem => !!x)
  return (src.skus?.length ? items : items.sort((a, b) => b.pct - a.pct)).slice(0, limit)
}

/** "3d 16h" until a date (or '' when there's no date). */
export function timeLeft(to: string | undefined, now: number) {
  if (!to) return ''
  const ms = Math.max(0, Date.parse(to) - now)
  const d = Math.floor(ms / 864e5), h = Math.floor((ms % 864e5) / 36e5)
  return d ? `${d}d ${h}h` : `${h}h ${Math.floor((ms % 36e5) / 6e4)}m`
}
