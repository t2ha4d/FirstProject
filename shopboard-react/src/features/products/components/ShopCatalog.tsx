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
  // The search box keeps its own text while typing, so fast typing never loses a letter. A new
  // key remounts it with the text given here: the URL's at first, empty after the filters are
  // cleared (the URL itself updates a moment later, so it cannot be read for this).
  const [searchBox, setSearchBox] = useState({ key: 0, text: filters.searchQuery })

  function clearSearch() {
    setSearchQuery('')
    setSearchBox(({ key }) => ({ key: key + 1, text: '' }))
  }

  function resetAllFilters() {
    resetFilters()
    setSearchBox(({ key }) => ({ key: key + 1, text: '' }))
  }

  return (
    <>
      <SearchAndFilter
        key={searchBox.key}
        initialSearch={searchBox.text}
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
