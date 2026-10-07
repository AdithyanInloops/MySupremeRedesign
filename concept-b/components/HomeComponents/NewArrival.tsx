import type { Product } from '../../lib/data'
import ProductCarousel from '../Product/ProductCarousel'

/** New Arrivals rail (real: NewArrival.tsx — only rendered with 4+ products). */
const NewArrival = ({ products }: { products: Product[] }) =>
  products.length >= 4 ? (
    <ProductCarousel heading="section" id="new-arrivals-title" eyebrow="Just in" title="New Arrivals" subtitle="The latest products added to the warehouse" products={products} href="/search/all" />
  ) : null

export default NewArrival
