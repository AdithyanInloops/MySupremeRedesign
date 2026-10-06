/**
 * One-off snapshot of public catalog data from the live Magento GraphQL API into data/*.json.
 * Run once with `npm run seed`. The app only ever reads the JSON files — no network calls at runtime.
 */
import { writeFileSync } from 'node:fs'

const ENDPOINT = 'https://m2.mysupreme.ca/graphql'

async function gql(query, variables = {}) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  })
  const json = await res.json()
  if (json.errors) throw new Error(JSON.stringify(json.errors).slice(0, 500))
  return json.data
}

const save = (name, data) => {
  writeFileSync(new URL(`../data/${name}`, import.meta.url), JSON.stringify(data, null, 2) + '\n')
  console.log('wrote', name)
}

/** Brand / manufacturer labels, read the same way as the live PDP (custom_attributesV2 → selected_options[0].label). */
const optionLabel = (item, code) =>
  item.custom_attributesV2?.items?.find((a) => a.code === code)?.selected_options?.[0]?.label?.trim() || null
const flatten = ({ custom_attributesV2, ...item }) => ({
  ...item,
  brand_label: optionLabel({ custom_attributesV2 }, 'brand'),
  manufacturer_label: optionLabel({ custom_attributesV2 }, 'manufacturer'),
})

/**
 * `node scripts/seed.mjs --enrich-brands` only adds brand_label / manufacturer_label to the existing
 * data/products.json (keeps the hand-edited test cases) instead of re-snapshotting everything.
 */
if (process.argv.includes('--enrich-brands')) {
  const { readFileSync } = await import('node:fs')
  const file = new URL('../data/products.json', import.meta.url)
  const existing = JSON.parse(readFileSync(file, 'utf8'))
  const skus = existing.map((p) => p.sku)
  const labels = {}
  for (let i = 0; i < skus.length; i += 50) {
    const q = `query ($skus: [String]) { products(filter: { sku: { in: $skus } }, pageSize: 50) { items { sku custom_attributesV2(filters: { is_filterable: true }) { items { code ... on AttributeSelectedOptions { selected_options { label } } } } } } }`
    const batch = skus.slice(i, i + 50)
    try {
      const { products } = await gql(q, { skus: batch })
      for (const it of products.items) labels[it.sku] = flatten(it)
    } catch {
      // A few catalog items make Magento error on custom_attributesV2 — retry one by one and skip those.
      for (const sku of batch) {
        try {
          const { products } = await gql(q, { skus: [sku] })
          for (const it of products.items) labels[it.sku] = flatten(it)
        } catch { console.warn('no attributes for', sku) }
      }
    }
  }
  // Some Magento option labels are just the id of another option ("10" → "Value+"); resolve them through the
  // brand / manufacturer filter options already saved in listings.json, and drop any that stay numeric.
  const listings = JSON.parse(readFileSync(new URL('../data/listings.json', import.meta.url), 'utf8'))
  const optionNames = { brand: new Map(), manufacturer: new Map() }
  for (const dept of Object.values(listings))
    for (const agg of dept.aggregations)
      if (agg.attribute_code in optionNames) for (const o of agg.options) optionNames[agg.attribute_code].set(o.value, o.label.trim())
  const resolve = (label, code) => {
    if (!label || !/^\d+$/.test(label)) return label ?? null
    const name = optionNames[code].get(label)
    return name && !/^\d+$/.test(name) ? name : null
  }
  const out = existing.map((p) => ({
    ...p,
    brand_label: resolve(labels[p.sku]?.brand_label, 'brand'),
    manufacturer_label: resolve(labels[p.sku]?.manufacturer_label, 'manufacturer'),
  }))
  save('products.json', out)
  console.log('brands found for', out.filter((p) => p.brand_label).length, 'of', out.length)
  process.exit(0)
}

/**
 * `node scripts/seed.mjs --subcategory-images` saves one real product photo per sub-category to
 * data/subcategory-images.json (Magento has no sub-category images yet) for the mega-menu circle tiles.
 */
if (process.argv.includes('--subcategory-images')) {
  const { readFileSync } = await import('node:fs')
  const cats = JSON.parse(readFileSync(new URL('../data/categories.json', import.meta.url), 'utf8'))
  const out = {}
  for (const dept of cats) {
    for (const sub of dept.children) {
      if (!sub.uid) continue
      const { products } = await gql(
        `query ($uid: String!) { products(filter: { category_uid: { eq: $uid } }, pageSize: 20) { items { small_image { url } } } }`,
        { uid: sub.uid },
      )
      const photo = products.items.map((i) => i.small_image?.url).find((u) => u && !u.includes('/placeholder/'))
      if (photo) out[sub.url_key] = photo
    }
  }
  save('subcategory-images.json', out)
  console.log('photos for', Object.keys(out).length, 'sub-categories')
  process.exit(0)
}

const { categoryList } = await gql(`{
  categoryList(filters: { parent_id: { eq: "2" } }) {
    uid name url_key image product_count position
    children { uid name url_key product_count image children { name url_key product_count } }
  }
}`)
save('categories.json', categoryList)

const PRODUCT_FIELDS = `
  __typename sku name url_key uom
  small_image { url label }
  media_gallery { url label }
  price_range { minimum_price { regular_price { value currency } final_price { value currency } discount { percent_off amount_off } } }
  short_description { html }
  description { html }
  categories { name url_key }
  custom_attributesV2(filters: { is_filterable: true }) { items { code ... on AttributeSelectedOptions { selected_options { label } } } }
`



const products = []
const listings = {}
for (const dept of categoryList) {
  const data = await gql(
    `query ($uid: String!) {
      products(filter: { category_uid: { eq: $uid } }, pageSize: 15) {
        total_count
        aggregations { label attribute_code count options { label value count } }
        items { ${PRODUCT_FIELDS} }
      }
    }`,
    { uid: dept.uid },
  )
  listings[dept.url_key] = { total_count: data.products.total_count, aggregations: data.products.aggregations }
  for (const item of data.products.items) {
    if (!products.some((p) => p.sku === item.sku)) products.push({ ...flatten(item), department: dept.url_key })
  }
  console.log(dept.name, data.products.items.length)
}
save('products.json', products)
save('listings.json', listings)

const { brandImages } = await gql(`{ brandImages { brand_id brand_name image_url } }`)
save('brands.json', brandImages)
