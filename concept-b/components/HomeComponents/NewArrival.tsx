import type { Product } from '../../lib/data'
import ProductCarousel from '../Product/ProductCarousel'

/** New Arrivals rail (real: NewArrival.tsx — only rendered with 4+ products). */
const NewArrival = ({ products }: { products: Product[] }) =>
  products.length >= 4 ? <ProductCarousel title="New Arrivals" products={products} href="/search/all" /> : null

export default NewArrival
