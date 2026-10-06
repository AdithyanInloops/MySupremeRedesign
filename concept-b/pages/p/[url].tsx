import type { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import { Box } from '@mui/material'
import ProductDetailView, { ProductDescription } from '../../components/ProductDetailView/ProductDetailView'
import ProductCarousel from '../../components/Product/ProductCarousel'
import FrequentlyBoughtTogether from '../../components/ProductDetailView/FrequentlyBoughtTogether'
import { hasImage, productByUrlKey, products } from '../../lib/data'

type Props = { url: string }

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: products.map((p) => ({ params: { url: p.url_key } })),
  fallback: false,
})

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => ({ props: { url: String(params?.url) } })

export default function ProductPage({ url }: Props) {
  const product = productByUrlKey(url)!
  // Similar = same department; "You may also like" = a cross-department mix (production: Algolia recommendations).
  const similar = products.filter((p) => p.department === product.department && p.sku !== product.sku).slice(0, 12)
  // Concept B #12 — prototype stand-in for Algolia "frequently bought together": same department, photos first.
  const companions = [...similar].sort((a, b) => Number(hasImage(b)) - Number(hasImage(a))).slice(0, 2)
  const alsoLike = products.filter((p) => p.department !== product.department).filter((_, i) => i % 5 === 0).slice(0, 12)
  return (
    <>
      <Head><title>{`${product.name} | MySupreme`}</title></Head>
      <Box sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 1, md: 3 }, pt: { xs: 1.5, md: 7.5 }, pb: 4 }}>
        <Box sx={{ maxWidth: 1070, mx: 'auto' }}>
          <ProductDetailView product={product} />
          <FrequentlyBoughtTogether key={product.sku} product={product} companions={companions} />
        </Box>
        <ProductDescription product={product} />
      </Box>
      <Box sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 0.5, md: 2 } }}>
        <ProductCarousel title="Similar Products" products={similar} hideViewAll titleWeight={600} />
        <ProductCarousel title="You may also like" products={alsoLike} hideViewAll titleWeight={600} />
      </Box>
    </>
  )
}
