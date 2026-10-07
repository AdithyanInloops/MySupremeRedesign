import type { Product } from '../../lib/data'
import ProductCarousel from '../Product/ProductCarousel'

/** Recommended Products rail (real: RecommentedProducts.tsx, Magento "recommended" flag). */
const RecommentedProducts = ({ products }: { products: Product[] }) =>
  products.length ? (
    <ProductCarousel heading="section" id="recommended-title" eyebrow="Picked for you" title="Recommended Products" subtitle="Best-sellers our team recommends this week" products={products} href="/search/all" />
  ) : null

export default RecommentedProducts
