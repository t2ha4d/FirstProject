import { use } from 'react'
import { loadProducts } from '../../../shared/api/products'
import { applyFilters, getUniqueCategories } from '../logic'
import { useShopFilters } from '../useShopFilters'
import { ProductList } from './ProductList'
import { SearchAndFilter } from './SearchAndFilter'

/** Filters and the filtered grid. Suspends until the catalog has loaded. */
export function ShopCatalog() {
  const products = use(loadProducts())
  const { filters, updateFilters, setSearchQuery, resetFilters } = useShopFilters()
  const filteredProducts = applyFilters(products, filters)

  return (
    <>
      <SearchAndFilter
        categories={getUniqueCategories(products)}
        filters={filters}
        onSearchChange={setSearchQuery}
        onCategoryChange={(selectedCategory) => updateFilters({ selectedCategory })}
        onSortChange={(sortBy) => updateFilters({ sortBy })}
        onResetFilters={resetFilters}
        totalResults={filteredProducts.length}
      />
      <ProductList
        products={filteredProducts}
        totalCatalogCount={products.length}
        onResetFilters={resetFilters}
      />
    </>
  )
}
