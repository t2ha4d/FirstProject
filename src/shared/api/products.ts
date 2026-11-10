import { z } from 'zod'
import type { Product } from '../types'
import { ApiError, apiGet } from './client'
import { createPromiseCache } from './cache'
import { ENDPOINTS } from './endpoints'
import { productSchema } from './schemas'

const productListSchema = z.object({ items: z.array(productSchema) })

export async function fetchProducts(): Promise<Product[]> {
  const { items } = await apiGet(ENDPOINTS.products, productListSchema)
  return items
}

/** Loads one product. A missing id rejects with an ApiError whose status is 404. */
export function fetchProduct(id: number): Promise<Product> {
  return apiGet(ENDPOINTS.product(id), productSchema)
}

const productListCache = createPromiseCache(fetchProducts)
const productCache = createPromiseCache(async (id: number): Promise<Product | null> => {
  try {
    return await fetchProduct(id)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null
    throw error
  }
})

/** The whole catalog, shared by every component that reads it with `use()`. */
export function loadProducts(): Promise<Product[]> {
  return productListCache.get(undefined)
}

export function retryProducts(): void {
  productListCache.clear(undefined)
}

/** One product, or null when the API has no product with this id. */
export function loadProduct(id: number): Promise<Product | null> {
  return productCache.get(id)
}

export function retryProduct(id: number): void {
  productCache.clear(id)
}
