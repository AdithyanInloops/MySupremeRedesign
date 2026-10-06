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
    if (!products.some((p) => p.sku === item.sku)) products.push({ ...item, department: dept.url_key })
  }
  console.log(dept.name, data.products.items.length)
}
save('products.json', products)
save('listings.json', listings)

const { brandImages } = await gql(`{ brandImages { brand_id brand_name image_url } }`)
save('brands.json', brandImages)
