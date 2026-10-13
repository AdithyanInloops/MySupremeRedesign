/**
 * Magento catalogue snapshot shared with Concept B (concept-b/data/products.json + listings.json, trimmed).
 * Feeds the department listing opened from All categories. Field names match Magento GraphQL 1:1.
 */
import type { Product } from './catalog'
import productsJson from './products-magento.json'
import listingsJson from './listings-magento.json'

export type MagentoProduct = {
  sku: string
  name: string
  url_key: string
  uom: string | null
  small_image: { url: string; label?: string } | null
  price_range: {
    minimum_price: {
      regular_price: { value: number }
      final_price: { value: number }
      discount: { percent_off: number; amount_off: number } | null
    }
  }
  short_description: { html: string } | null
  categories: { name: string; url_key: string }[]
  department: string
  brand_label: string | null
  manufacturer_label: string | null
  stock_status?: 'IN_STOCK' | 'OUT_OF_STOCK'
}

export type Aggregation = { label: string; attribute_code: string; count: number; options: { label: string; value: string; count: number }[] }

export const magentoProducts = productsJson as MagentoProduct[]
export const listings = listingsJson as Record<string, { total_count: number; aggregations: Aggregation[] }>

/** Pack size shown on cards = short_description.html with tags stripped (real site behaviour). */
export const packSize = (p: MagentoProduct) => (p.short_description?.html ?? '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim()
export const inStock = (p: MagentoProduct) => p.stock_status !== 'OUT_OF_STOCK'
export const hasImage = (p: MagentoProduct) => !!p.small_image?.url && !p.small_image.url.includes('/placeholder/')
export const finalPrice = (p: MagentoProduct) => p.price_range.minimum_price.final_price.value
export const regularPrice = (p: MagentoProduct) => p.price_range.minimum_price.regular_price.value
export const percentOff = (p: MagentoProduct) => Math.round(p.price_range.minimum_price.discount?.percent_off ?? 0)

/**
 * The same products in Concept A's shape, so cart, favorites and the product page work for them unchanged.
 * Concept A's own catalogue wins on SKU/slug clashes (see productBySku / productBySlug in catalog.ts).
 */
export const magentoAsShopProducts: Product[] = magentoProducts.map((p) => ({
  sku: p.sku,
  slug: p.url_key,
  name: p.name,
  brand: p.brand_label ?? p.manufacturer_label ?? '',
  pack: packSize(p),
  price: finalPrice(p),
  regular: percentOff(p) > 0 ? regularPrice(p) : undefined,
  dept: p.department,
  sub: p.categories.find((c) => c.url_key !== p.department)?.name ?? '',
  images: hasImage(p) ? [p.small_image!.url] : [],
  stock: inStock(p) ? 'IN_STOCK' : 'OUT_OF_STOCK',
  type: 'simple',
  rating: 0,
  reviews: 0,
}))
