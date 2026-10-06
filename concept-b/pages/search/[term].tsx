import Head from 'next/head'
import { useRouter } from 'next/router'
import ProductListLayout, { type FilterGroup } from '../../components/ProductListLayout/ProductListLayout'
import { packSize, products, searchProducts, type Product } from '../../lib/data'


function brandFilter(products: Product[]): FilterGroup {
  const counts = new Map<string, number>()
  // Magento brand labels; products without a brand aren't counted, like the live Brand facet.
  products.forEach((p) => p.brand_label && counts.set(p.brand_label, (counts.get(p.brand_label) ?? 0) + 1))
  return {
    code: 'brand',
    label: 'Brand',
    options: [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([label, count]) => ({ label, value: label, count })),
  }
}

/**
 * The snapshot only holds ~130 products, so an all-words match is often thin. Top it up with products that match
 * any word (ranked by how many words match) — closer to how Algolia behaves on the live site.
 */
function withLooseMatches(term: string, exact: Product[]) {
  const words = term.toLowerCase().split(/\s+/).filter((w) => w.length > 2)
  const score = (p: Product) => words.filter((w) => `${p.name} ${p.sku} ${packSize(p)}`.toLowerCase().includes(w)).length
  const loose = products
    .filter((p) => !exact.includes(p) && score(p) > 0)
    .sort((a, b) => score(b) - score(a))
  return [...exact, ...loose]
}

export default function SearchPage() {
  const { query, isReady } = useRouter()
  const term = typeof query.term === 'string' ? query.term : ''
  if (!isReady) return null
  const results = withLooseMatches(term, searchProducts(term))
  return (
    <>
      <Head><title>{`Results for ‘${term}’ | MySupreme`}</title></Head>
      <ProductListLayout
        key={term}
        title={`Results for ‘${term}’`}
        totalCount={results.length}
        products={results}
        priceLast
        filters={results.length ? [brandFilter(results)] : []}
      />
    </>
  )
}
