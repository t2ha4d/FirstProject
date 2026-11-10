import { cartLineSchema, storedCartSchema } from './schemas'
import type { CartLine } from './types'

const CART_STORAGE_KEY = 'wtc_cart_items_v1'

/** Loads the bag from localStorage, skipping lines that are not valid. Never throws. */
export function loadCartLines(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const stored = storedCartSchema.safeParse(JSON.parse(raw))
    if (!stored.success) return []
    return stored.data.flatMap((value) => {
      const line = cartLineSchema.safeParse(value)
      return line.success ? [line.data] : []
    })
  } catch {
    return []
  }
}

/** Saves only `{ id, qty }` for each line. Never throws. */
export function saveCartLines(lines: CartLine[]): void {
  try {
    const stored: CartLine[] = lines.map(({ id, qty }) => ({ id, qty }))
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(stored))
  } catch {
    // Storage can be full or blocked (private mode); the in-memory bag still works.
  }
}
