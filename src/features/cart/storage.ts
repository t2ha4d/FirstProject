import type { CartEntry } from './types'

export const CART_STORAGE_KEY = 'wtc_cart_items_v1'

/**
 * Loads cart from localStorage safely
 */
export function loadCartFromStorage(): CartEntry[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return []
  }
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item): item is CartEntry =>
      Boolean(
        item &&
        item.product &&
        typeof item.product.id === 'number' &&
        typeof item.quantity === 'number' &&
        item.quantity > 0,
      ),
    )
  } catch {
    return []
  }
}

/**
 * Persists cart to localStorage safely
 */
export function saveCartToStorage(items: CartEntry[]): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return
  }
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch {
    // Gracefully handle storage quota or privacy mode errors
  }
}
