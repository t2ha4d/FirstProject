import { apiGet } from '../../shared/api/client'
import { ENDPOINTS } from '../../shared/api/endpoints'
import { isBoolean, isFiniteNumber, isRecord, isString } from '../../shared/lib/guards'
import type { Product } from '../../shared/types'

function parseProduct(value: unknown): Product | null {
  if (!isRecord(value)) return null
  const { id, title, category_name, price_cents, in_stock } = value
  if (
    !isFiniteNumber(id) ||
    !isString(title) ||
    !isString(category_name) ||
    !isFiniteNumber(price_cents) ||
    !isBoolean(in_stock)
  ) {
    return null
  }
  return { id, title, category_name, price_cents, in_stock }
}

/** Validates the `{ items, total }` payload and returns only well-formed products. */
export function parseProductsResponse(data: unknown): Product[] {
  if (!isRecord(data) || !Array.isArray(data.items)) {
    throw new Error('Invalid response structure received from the products API')
  }
  return data.items.map(parseProduct).filter((product) => product !== null)
}

export function fetchProducts(signal?: AbortSignal): Promise<Product[]> {
  return apiGet(ENDPOINTS.products, parseProductsResponse, { signal })
}
