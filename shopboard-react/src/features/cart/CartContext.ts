'use client'

import { createContext, useContext } from 'react'
import type { Product } from '../../shared/types'
import type { CartLine } from './types'

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
  /** What is saved: product ids and quantities. Prices come from the catalog, see usePricedCart. */
  lines: CartLine[]
  /** False until the saved bag has been read in the browser; the bag views show a skeleton until then. */
  isReady: boolean
  isOpen: boolean
  /** Number of items saved in the bag. Needs no product data, so the header never waits for it. */
  totalCount: number
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
