import { WATCH_CATALOG } from './catalog'
import type { Product } from './shared/types'

/**
 * Data-layer boundary for the catalog. It serves the local WTC catalog today;
 * swap the body for a real request once a watches API exists.
 */
export async function fetchProducts(): Promise<Product[]> {
  return WATCH_CATALOG
}
