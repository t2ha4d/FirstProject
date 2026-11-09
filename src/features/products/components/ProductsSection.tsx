import type { Product } from '../../../shared/types'
import { useCatalog } from '../CatalogContext'
import { SHOP_SECTION_ID } from '../useShopNavigation'
import { ProductList } from './ProductList'
import { SearchAndFilter } from './SearchAndFilter'

export interface ProductsSectionProps {
  onAddToCart: (product: Product) => void
}

/** The shop section: filters plus the product grid, wired to the catalog state. */
export function ProductsSection({ onAddToCart }: ProductsSectionProps) {
  const catalog = useCatalog()

  return (
    <section id={SHOP_SECTION_ID} className="section" aria-labelledby="shop-title">
      <h2 id="shop-title" className="section-title section-title-left">
        Featured Pieces
      </h2>
      <SearchAndFilter
        categories={catalog.categories}
        filters={catalog.filters}
        onSearchChange={catalog.setSearchQuery}
        onCategoryChange={catalog.setCategory}
        onSortChange={catalog.setSortBy}
        onResetFilters={catalog.resetFilters}
        totalResults={catalog.filteredProducts.length}
      />
      <ProductList
        products={catalog.filteredProducts}
        status={catalog.status}
        errorMessage={catalog.errorMessage}
        totalCatalogCount={catalog.products.length}
        onRetry={catalog.reload}
        onAddToCart={onAddToCart}
        onResetFilters={catalog.resetFilters}
      />
    </section>
  )
}
