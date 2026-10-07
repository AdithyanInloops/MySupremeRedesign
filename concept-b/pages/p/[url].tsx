import type { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import { Box } from '@mui/material'
import ProductDetailView, { ProductDescription } from '../../components/ProductDetailView/ProductDetailView'
import FrequentlyBoughtTogether from '../../components/ProductDetailView/FrequentlyBoughtTogether'
import ProductRail from '../../components/Product/ProductRail'
import { Breadcrumbs, type Crumb } from '../../components/ui/PageHeader'
import { PageContainer, SectionHeading } from '../../components/ui/Section'
import { departmentOf, hasImage, productByUrlKey, products } from '../../lib/data'

type Props = { url: string }

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: products.map((p) => ({ params: { url: p.url_key } })),
  fallback: false,
})

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => ({ props: { url: String(params?.url) } })

export default function ProductPage({ url }: Props) {
  const product = productByUrlKey(url)!
  const dept = departmentOf(product)
  // Deepest category the product sits in that belongs to its department (for the breadcrumb).
  const sub = dept?.children.find((c) => product.categories.some((pc) => pc.url_key === c.url_key))
  const crumbs: Crumb[] = [
    { label: 'Home', href: '/' },
    ...(dept ? [{ label: dept.name, href: `/${dept.url_key}` }] : []),
    ...(dept && sub ? [{ label: sub.name, href: `/${dept.url_key}?sub=${sub.url_key}` }] : []),
    { label: product.name },
  ]
  // Similar = same department; "You may also like" = a cross-department mix (production: Algolia recommendations).
  const similar = products.filter((p) => p.department === product.department && p.sku !== product.sku).slice(0, 12)
  const companions = [...similar].sort((a, b) => Number(hasImage(b)) - Number(hasImage(a))).slice(0, 2)
  const alsoLike = products.filter((p) => p.department !== product.department).filter((_, i) => i % 5 === 0).slice(0, 12)

  return (
    <>
      <Head>
        <title>{`${product.name} | MySupreme`}</title>
        <meta name="description" content={`${product.name} — SKU ${product.sku}. Wholesale pricing with next-day delivery across the GTA, Hamilton and Niagara.`} />
      </Head>
      <PageContainer sx={{ pt: { xs: 1.5, md: 3 }, pb: { xs: 4, md: 6 } }}>
        <Box sx={{ mb: { xs: 1.5, md: 3 } }}><Breadcrumbs items={crumbs} /></Box>
        <ProductDetailView product={product} />
        <FrequentlyBoughtTogether key={product.sku} product={product} companions={companions} />
        <ProductDescription product={product} />
        {similar.length > 0 && (
          <Box component="section" aria-labelledby="similar-title" sx={{ mt: { xs: 5, md: 7 } }}>
            <SectionHeading id="similar-title" title="Similar products" action={dept ? { label: `Shop all ${dept.name}`, href: `/${dept.url_key}` } : undefined} />
            <ProductRail products={similar} label="Similar products" />
          </Box>
        )}
        <Box component="section" aria-labelledby="also-title" sx={{ mt: { xs: 5, md: 7 } }}>
          <SectionHeading id="also-title" title="You may also like" />
          <ProductRail products={alsoLike} label="You may also like" />
        </Box>
      </PageContainer>
    </>
  )
}
