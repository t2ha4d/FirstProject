import { createContext, useContext } from 'react'
import type { Product } from '../../shared/types'
import type { CartEntry } from './types'

export interface CartActions {
  addItem: (product: Product) => void
  increment: (productId: number) => void
  decrement: (productId: number) => void
  removeItem: (productId: number) => void
  clear: () => void
  open: () => void
  close: () => void
}

export interface CartValue extends CartActions {
  items: CartEntry[]
  isOpen: boolean
  /** Stored lines exist but the catalog has not loaded yet, so they cannot be priced. */
  isResolving: boolean
  totalCount: number
  subtotalCents: number
  subtotalFormatted: string
}

export const CartContext = createContext<CartValue | null>(null)

/** Reads the cart state owned by <CartProvider>. */
export function useCart(): CartValue {
  const value = useContext(CartContext)
  if (value === null) {
    throw new Error('useCart must be used inside <CartProvider>')
  }
  return value
}
