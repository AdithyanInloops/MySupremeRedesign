/**
 * Typed access to the seeded JSON snapshot (scripts/seed.mjs). Field names match Magento GraphQL 1:1.
 */
import categoriesJson from '../data/categories.json'
import productsJson from '../data/products.json'
import listingsJson from '../data/listings.json'
import brandsJson from '../data/brands.json'

export type Category = {
  uid: string
  name: string
  url_key: string
  image: string | null
  product_count: number
  position?: number
  children: { uid?: string; name: string; url_key: string; product_count?: number; image?: string | null; children?: { name: string; url_key: string; product_count?: number }[] }[]
}

export type Product = {
  __typename: string
  sku: string
  name: string
  url_key: string
  uom: string | null
  small_image: { url: string; label?: string } | null
  media_gallery?: { url: string; label?: string }[]
  price_range: {
    minimum_price: {
      regular_price: { value: number; currency?: string }
      final_price: { value: number; currency?: string }
      discount: { percent_off: number; amount_off: number } | null
    }
  }
  short_description: { html: string } | null
  description?: { html: string } | null
  categories: { name: string; url_key: string }[]
  department: string
  /** Magento `brand` / `manufacturer` option labels (custom_attributesV2), null when the product has none. */
  brand_label: string | null
  manufacturer_label: string | null
}

export type Aggregation = { label: string; attribute_code: string; count: number; options: { label: string; value: string; count: number }[] }
export type Brand = { brand_id: number; brand_name: string; image_url: string }

export const categories = (categoriesJson as Category[]).map((c) => ({ ...c, name: c.name.trim() }))
export const products = productsJson as Product[]
export const listings = listingsJson as Record<string, { total_count: number; aggregations: Aggregation[] }>
export const brands = brandsJson as Brand[]

/** Order used by the live category bar. */
export const departmentOrder = ['packaging', 'grocery', 'frozen', 'produce', 'beverage', 'dairy-eggs', 'meat-poultry', 'janitorial', 'ware-equipment']
export const departments = departmentOrder
  .map((k) => categories.find((c) => c.url_key === k))
  .filter(Boolean) as Category[]
// Any department the live order list doesn't know about goes at the end.
departments.push(...categories.filter((c) => !departmentOrder.includes(c.url_key)))

export const categoryByKey = (key: string) => categories.find((c) => c.url_key === key)
export const productByUrlKey = (key: string) => products.find((p) => p.url_key === key)
export const productBySku = (sku: string) => products.find((p) => p.sku.toLowerCase() === sku.toLowerCase())

/** Pack size shown on cards = short_description.html with tags stripped (real site behaviour). */
export const packSize = (p: Product) => (p.short_description?.html ?? '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim()
export const hasImage = (p: Product) => !!p.small_image?.url && !p.small_image.url.includes('/placeholder/')
export const finalPrice = (p: Product) => p.price_range.minimum_price.final_price.value
export const regularPrice = (p: Product) => p.price_range.minimum_price.regular_price.value
export const percentOff = (p: Product) => Math.round(p.price_range.minimum_price.discount?.percent_off ?? 0)
export const money = (v: number) => `$${v.toFixed(2)}`

export const productsIn = (deptKey: string) => products.filter((p) => p.department === deptKey)

export const searchProducts = (term: string) => {
  const t = term.trim().toLowerCase()
  if (!t) return []
  const words = t.split(/\s+/)
  return products.filter((p) => {
    const hay = `${p.name} ${p.sku} ${packSize(p)}`.toLowerCase()
    return words.every((w) => hay.includes(w))
  })
}

/** Home rails — the live site uses Magento "recommended" / "new" flags; the snapshot picks stable slices. */
// Mostly photographed items with a couple of placeholders mixed in, like the live rails.
const withPhotoFirst = (list: Product[], n: number) => {
  const photo = list.filter(hasImage)
  const none = list.filter((p) => !hasImage(p))
  const out = [...photo.slice(0, n - 2), ...none.slice(0, 2)]
  out.splice(5, 0, ...out.splice(out.length - 1, 1))
  return out.slice(0, n)
}
export const recommendedProducts = withPhotoFirst(products.filter((_, i) => i % 3 === 0), 12)
export const newArrivals = withPhotoFirst(products.filter((p) => ['packaging', 'janitorial', 'ware-equipment'].includes(p.department)), 12)
