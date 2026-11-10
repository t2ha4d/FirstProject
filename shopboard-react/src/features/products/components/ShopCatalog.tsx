import { use, useState } from 'react'
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
  // The search box keeps its own text while typing (so fast typing never loses a letter) and
  // starts again from the URL when a new key remounts it, i.e. after the filters are cleared.
  const [searchBoxKey, setSearchBoxKey] = useState(0)

  function clearSearch() {
    setSearchQuery('')
    setSearchBoxKey((key) => key + 1)
  }

  function resetAllFilters() {
    resetFilters()
    setSearchBoxKey((key) => key + 1)
  }

  return (
    <>
      <SearchAndFilter
        key={searchBoxKey}
        categories={getUniqueCategories(products)}
        filters={filters}
        onSearchChange={setSearchQuery}
        onClearSearch={clearSearch}
        onCategoryChange={(selectedCategory) => updateFilters({ selectedCategory })}
        onSortChange={(sortBy) => updateFilters({ sortBy })}
        onResetFilters={resetAllFilters}
        totalResults={filteredProducts.length}
      />
      <ProductList
        products={filteredProducts}
        totalCatalogCount={products.length}
        onResetFilters={resetAllFilters}
      />
    </>
  )
}
