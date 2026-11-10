import type { Product } from '../../shared/types'
import type { CartEntry, CartLine } from './types'

/**
 * Pure reducer: adds one of a product, or increments its quantity
 */
export function addLine(lines: CartLine[], productId: number): CartLine[] {
  if (lines.some((line) => line.id === productId)) {
    return lines.map((line) => (line.id === productId ? { ...line, qty: line.qty + 1 } : line))
  }
  return [...lines, { id: productId, qty: 1 }]
}

/**
 * Pure reducer: changes a line's quantity by `delta`, removing it at zero
 */
export function changeLineQuantity(lines: CartLine[], productId: number, delta: number) {
  return lines
    .map((line) => (line.id === productId ? { ...line, qty: line.qty + delta } : line))
    .filter((line) => line.qty > 0)
}

/**
 * Pure reducer: removes a line by product id
 */
export function removeLine(lines: CartLine[], productId: number): CartLine[] {
  return lines.filter((line) => line.id !== productId)
}

/**
 * Joins stored lines with current product data. Lines whose product is not in
 * the catalog are left out (they are kept in storage until the catalog has loaded).
 */
export function resolveCart(lines: CartLine[], products: Product[]): CartEntry[] {
  const byId = new Map(products.map((product) => [product.id, product]))
  return lines.flatMap((line) => {
    const product = byId.get(line.id)
    return product ? [{ product, quantity: line.qty }] : []
  })
}

/**
 * Removes lines whose product no longer exists. Only call with a loaded catalog.
 */
export function pruneLines(lines: CartLine[], products: Product[]): CartLine[] {
  const ids = new Set(products.map((product) => product.id))
  return lines.filter((line) => ids.has(line.id))
}

/**
 * Subtotal in cents, priced from the product data
 */
export function calculateSubtotalCents(entries: CartEntry[]): number {
  return entries.reduce((total, entry) => total + entry.product.price_cents * entry.quantity, 0)
}

/**
 * Total number of items across lines
 */
export function calculateTotalCount(lines: CartLine[]): number {
  return lines.reduce((count, line) => count + line.qty, 0)
}
