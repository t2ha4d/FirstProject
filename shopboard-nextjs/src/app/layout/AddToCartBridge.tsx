'use client'

import type { ReactNode } from 'react'
import { useCart } from '../../features/cart'
import { AddToCartContext } from '../../features/products'

export interface AddToCartBridgeProps {
  children: ReactNode
}

/** Hands the cart's add action to the products feature, which cannot import the cart. */
export function AddToCartBridge({ children }: AddToCartBridgeProps) {
  const { addItem } = useCart()
  return <AddToCartContext value={addItem}>{children}</AddToCartContext>
}
