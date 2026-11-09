// Public API of the products feature. Code outside this folder imports from here only.
export { CatalogProvider } from './CatalogProvider'
export { useCatalog } from './CatalogContext'
export { useShopNavigation } from './useShopNavigation'
export { COLLECTIONS } from './collections'
export { CollectionGrid } from './components/CollectionGrid'
export { ProductsSection } from './components/ProductsSection'
export type { Collection, FilterState, SortOption } from './types'
