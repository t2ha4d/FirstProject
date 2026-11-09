import { isFiniteNumber, isRecord } from '../../shared/lib/guards'
import type { CartLine } from './types'

export const CART_STORAGE_KEY = 'wtc_cart_items_v1'

function isPositiveCount(value: unknown): value is number {
  return isFiniteNumber(value) && Number.isInteger(value) && value > 0
}

/**
 * Reads one stored line. Accepts the current `{ id, qty }` shape and migrates
 * the legacy `{ product: { id, ... }, quantity }` shape, dropping its stored price.
 */
export function parseStoredLine(value: unknown): CartLine | null {
  if (!isRecord(value)) return null
  if (isFiniteNumber(value.id) && isPositiveCount(value.qty)) {
    return { id: value.id, qty: value.qty }
  }
  const { product, quantity } = value
  if (isRecord(product) && isFiniteNumber(product.id) && isPositiveCount(quantity)) {
    return { id: product.id, qty: quantity }
  }
  return null
}

/** Loads the bag from localStorage, migrating legacy entries. Never throws. */
export function loadCartLines(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map(parseStoredLine).filter((line) => line !== null)
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
