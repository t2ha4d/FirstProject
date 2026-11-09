import { createContext, useContext } from 'react'
import type { ApiStatus, Product } from '../../shared/types'
import type { FilterState, SortOption } from './types'

export interface CatalogActions {
  reload: () => void
  setSearchQuery: (searchQuery: string) => void
  setCategory: (category: string) => void
  setSortBy: (sortBy: SortOption) => void
  resetFilters: () => void
  selectCollection: (collection: string) => void
}

export interface CatalogValue extends CatalogActions {
  products: Product[]
  status: ApiStatus
  errorMessage: string
  filters: FilterState
  categories: string[]
  filteredProducts: Product[]
}

export const CatalogContext = createContext<CatalogValue | null>(null)

/** Reads the catalog state owned by <CatalogProvider>. */
export function useCatalog(): CatalogValue {
  const value = useContext(CatalogContext)
  if (value === null) {
    throw new Error('useCatalog must be used inside <CatalogProvider>')
  }
  return value
}
