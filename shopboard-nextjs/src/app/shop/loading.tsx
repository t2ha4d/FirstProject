import { ShopSkeleton } from '../../features/products'

/** Shown while the browser reads the filters from the URL; the page body has the same shape. */
export default function ShopLoading() {
  return (
    <section className="section">
      <ShopSkeleton />
    </section>
  )
}
