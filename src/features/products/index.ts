// Public API of the products feature. Code outside this folder imports from here only.
export { CatalogProvider } from './CatalogProvider'
export { useCatalog } from './CatalogContext'
export { COLLECTIONS } from './collections'
export { readFilters, shopUrl } from './logic'
export { CollectionGrid } from './components/CollectionGrid'
export { ProductDetails } from './components/ProductDetails'
export { ProductsSection } from './components/ProductsSection'
export type { Collection, FilterState, SortOption } from './types'
