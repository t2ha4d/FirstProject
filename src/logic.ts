import type { CartItem } from './shared/types'

/**
 * Computes subtotal in cents for cart items
 */
export function calculateSubtotalCents(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.product.price_cents * item.quantity, 0)
}

/**
 * Computes total item count in cart
 */
export function calculateTotalCount(items: CartItem[]): number {
  return items.reduce((count, item) => count + item.quantity, 0)
}
