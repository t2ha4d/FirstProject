'use client'

import type { ReactNode } from 'react'
import { useCart } from '../CartContext'
import { CartBoundary } from './CartBoundary'
import { EmptyCart } from './EmptyCart'
import { PricedCart } from './PricedCart'
import { CartLinesSkeleton } from './Skeletons'

const CART_FALLBACK = (
  <div className="drawer-body">
    <CartLinesSkeleton />
  </div>
)

export interface CartViewProps {
  /** Extra links under the checkout link, e.g. "View bag" in the drawer. */
  children?: ReactNode
}

/**
 * The bag, used by the drawer and the cart page. An empty bag shows at once; a filled
 * bag waits for prices in its own data region, so a failing catalog shows "Try again".
 */
export function CartView({ children }: CartViewProps) {
  const cart = useCart()

  // Until the saved bag is read, an empty bag would be a wrong answer: show the skeleton.
  if (!cart.isReady) {
    return CART_FALLBACK
  }

  if (cart.lines.length === 0) {
    return <EmptyCart />
  }

  return (
    <CartBoundary fallback={CART_FALLBACK}>
      <PricedCart>{children}</PricedCart>
    </CartBoundary>
  )
}
