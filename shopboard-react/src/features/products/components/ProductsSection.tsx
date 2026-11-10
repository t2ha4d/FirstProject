'use client'

import { retryProducts } from '../../../shared/api/products'
import { AsyncBoundary } from '../../../shared/ui/AsyncBoundary'
import { INITIAL_FILTERS } from '../logic'
import { useShopFilters } from '../useShopFilters'
import { ShopCatalog } from './ShopCatalog'
import { ShopSkeleton } from './Skeletons'

/** The shop page body: a title from the URL and the catalog as its own data region. */
export function ProductsSection() {
  const { filters } = useShopFilters()
  const title =
    filters.selectedCategory === INITIAL_FILTERS.selectedCategory
      ? 'All Products'
      : filters.selectedCategory

  return (
    <section className="section" aria-labelledby="shop-title">
      <h1 id="shop-title" className="section-title section-title-left">
        {title}
      </h1>
      <AsyncBoundary
        fallback={<ShopSkeleton />}
        errorTitle="Unable to load the collection"
        onRetry={retryProducts}
      >
        <ShopCatalog />
      </AsyncBoundary>
    </section>
  )
}
