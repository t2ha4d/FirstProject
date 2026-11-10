'use client'

import { createContext, useContext } from 'react'
import type { Product } from '../../shared/types'

/**
 * The products feature cannot import the cart, so the app provides the
 * "add to bag" action here and product cards read it where they use it.
 */
export const AddToCartContext = createContext<((product: Product) => void) | null>(null)

export function useAddToCart(): (product: Product) => void {
  const addToCart = useContext(AddToCartContext)
  if (addToCart === null) {
    throw new Error('useAddToCart must be used inside <AddToCartContext>')
  }
  return addToCart
}
