import type { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import ProductListLayout, { aggregationsToFilters } from '../components/ProductListLayout/ProductListLayout'
import { categoryByKey, departments, listings, products as allProducts } from '../lib/data'

type Props = { url: string }

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: departments.map((d) => ({ params: { category: d.url_key } })),
  fallback: false,
})

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => ({ props: { url: String(params?.category) } })

export default function CategoryPage({ url }: Props) {
  const { query } = useRouter()
  const dept = categoryByKey(url)!
  const sub = typeof query.sub === 'string' ? query.sub : undefined
  const subCat = dept.children.find((c) => c.url_key === sub)
  const listing = listings[url]

  const deptProducts = allProducts.filter((p) => p.department === url)
  const inSub = sub ? deptProducts.filter((p) => p.categories.some((c) => c.url_key === sub)) : deptProducts
  // The snapshot holds ~15 products per department; pad with other departments so the grid reads like the live page.
  const products = sub ? inSub : [...deptProducts, ...allProducts.filter((p) => p.department !== url)].slice(0, 40)

  return (
    <>
      <Head><title>{`${subCat?.name ?? dept.name} | MySupreme`}</title></Head>
      <ProductListLayout
        key={sub ?? 'all'}
        title={subCat?.name ?? dept.name}
        breadcrumbs={[{ label: 'Home', href: '/' }, ...(subCat ? [{ label: dept.name, href: `/${url}` }] : []), { label: subCat?.name ?? dept.name }]}
        totalCount={subCat?.product_count ?? (sub ? inSub.length : listing?.total_count ?? dept.product_count)}
        products={products}
        subCategories={dept.children}
        activeSub={sub}
        baseHref={`/${url}`}
        allLabel={dept.name}
        filters={aggregationsToFilters(listing?.aggregations ?? [], ['brand', 'manufacturer', 'restaurants_category'])}
      />
    </>
  )
}
