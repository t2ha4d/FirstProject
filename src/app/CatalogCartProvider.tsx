import type { ReactNode } from 'react'
import { CartProvider } from '../features/cart'
import { useCatalog } from '../features/products'

export interface CatalogCartProviderProps {
  children: ReactNode
}

/**
 * Connects the two features at the app level: the cart prices its lines from
 * the catalog, without either feature importing the other.
 */
export function CatalogCartProvider({ children }: CatalogCartProviderProps) {
  const { products, status } = useCatalog()

  return (
    <CartProvider products={products} isCatalogReady={status === 'success'}>
      {children}
    </CartProvider>
  )
}
