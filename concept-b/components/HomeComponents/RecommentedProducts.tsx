import type { Product } from '../../lib/data'
import ProductCarousel from '../Product/ProductCarousel'

/** Recommended Products rail (real: RecommentedProducts.tsx, Magento "recommended" flag). */
const RecommentedProducts = ({ products }: { products: Product[] }) =>
  products.length ? <ProductCarousel title="Recommended Products" products={products} href="/search/all" /> : null

export default RecommentedProducts
