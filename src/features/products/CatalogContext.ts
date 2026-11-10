import { createContext, useContext } from 'react'
import type { ApiStatus, Product } from '../../shared/types'

export interface CatalogValue {
  products: Product[]
  status: ApiStatus
  errorMessage: string
  reload: () => void
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
