import type { Product } from '../../shared/types'
import type { CartEntry } from './types'

/**
 * Pure state reducer: adds a product to cart or increments quantity
 */
export function addItemToCart(cart: CartEntry[], product: Product): CartEntry[] {
  const existing = cart.find((item) => item.product.id === product.id)
  if (existing) {
    return cart.map((item) =>
      item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
    )
  }
  return [...cart, { product, quantity: 1 }]
}

/**
 * Pure state reducer: updates item quantity or removes if quantity <= 0
 */
export function updateItemQuantity(
  cart: CartEntry[],
  productId: number,
  quantity: number,
): CartEntry[] {
  if (quantity <= 0) {
    return removeItemFromCart(cart, productId)
  }
  return cart.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
}

/**
 * Pure state reducer: changes an item's quantity by `delta`, removing it at zero
 */
export function changeItemQuantity(cart: CartEntry[], productId: number, delta: number) {
  const item = cart.find((entry) => entry.product.id === productId)
  return item ? updateItemQuantity(cart, productId, item.quantity + delta) : cart
}

/**
 * Pure state reducer: removes item by product id
 */
export function removeItemFromCart(cart: CartEntry[], productId: number): CartEntry[] {
  return cart.filter((item) => item.product.id !== productId)
}

/**
 * Computes subtotal in cents for cart items
 */
export function calculateSubtotalCents(items: CartEntry[]): number {
  return items.reduce((total, item) => total + item.product.price_cents * item.quantity, 0)
}

/**
 * Computes total item count in cart
 */
export function calculateTotalCount(items: CartEntry[]): number {
  return items.reduce((count, item) => count + item.quantity, 0)
}
