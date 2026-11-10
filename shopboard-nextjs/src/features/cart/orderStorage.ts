import { placedOrderSchema } from './schemas'
import type { PlacedOrder } from './types'

const ORDER_STORAGE_KEY = 'wtc_last_order_v1'

/** Keeps the placed order for this tab only, so the confirmation survives a reload. Never throws. */
export function saveOrder(order: PlacedOrder): void {
  try {
    window.sessionStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order))
  } catch {
    // Storage can be blocked; the confirmation then says there is no recent order.
  }
}

/** The saved order as text, or null when there is none. Never throws. */
export function readStoredOrder(): string | null {
  try {
    return window.sessionStorage.getItem(ORDER_STORAGE_KEY)
  } catch {
    return null
  }
}

/** The saved order cannot change while the confirmation is open, so there is nothing to subscribe to. */
export function subscribeToOrder(): () => void {
  return () => {}
}

/** Checks the saved text with the order schema; anything invalid counts as no order. */
export function parseStoredOrder(raw: string | null): PlacedOrder | null {
  if (raw === null) return null
  try {
    const order = placedOrderSchema.safeParse(JSON.parse(raw))
    return order.success ? order.data : null
  } catch {
    return null
  }
}
