import { useSearchParams } from 'react-router'
import type { Product } from '../../../shared/types'
import { useCatalog } from '../CatalogContext'
import {
  INITIAL_FILTERS,
  applyFilters,
  getUniqueCategories,
  readFilters,
  writeFilters,
} from '../logic'
import type { FilterState } from '../types'
import { ProductList } from './ProductList'
import { SearchAndFilter } from './SearchAndFilter'

export interface ProductsSectionProps {
  onAddToCart: (product: Product) => void
}

/** The shop: filters kept in the URL search params, plus the filtered product grid. */
export function ProductsSection({ onAddToCart }: ProductsSectionProps) {
  const catalog = useCatalog()
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = readFilters(searchParams)
  const filteredProducts = applyFilters(catalog.products, filters)

  function updateFilters(change: Partial<FilterState>, replace = false) {
    setSearchParams(writeFilters({ ...filters, ...change }), { replace })
  }

  function resetFilters() {
    setSearchParams(writeFilters(INITIAL_FILTERS))
  }

  const title =
    filters.selectedCategory === INITIAL_FILTERS.selectedCategory
      ? 'All Products'
      : filters.selectedCategory

  return (
    <section className="section" aria-labelledby="shop-title">
      <h1 id="shop-title" className="section-title section-title-left">
        {title}
      </h1>
      <SearchAndFilter
        categories={getUniqueCategories(catalog.products)}
        filters={filters}
        onSearchChange={(searchQuery) => updateFilters({ searchQuery }, true)}
        onCategoryChange={(selectedCategory) => updateFilters({ selectedCategory })}
        onSortChange={(sortBy) => updateFilters({ sortBy })}
        onResetFilters={resetFilters}
        totalResults={filteredProducts.length}
      />
      <ProductList
        products={filteredProducts}
        status={catalog.status}
        errorMessage={catalog.errorMessage}
        totalCatalogCount={catalog.products.length}
        onRetry={catalog.reload}
        onAddToCart={onAddToCart}
        onResetFilters={resetFilters}
      />
    </section>
  )
}
