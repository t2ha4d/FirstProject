import { z } from 'zod'
import { apiGet } from '../../shared/api/client'
import { ENDPOINTS } from '../../shared/api/endpoints'
import { productSchema } from '../../shared/api/schemas'
import type { Product } from '../../shared/types'

const productListSchema = z.object({ items: z.array(productSchema) })

export async function fetchProducts(signal?: AbortSignal): Promise<Product[]> {
  const { items } = await apiGet(ENDPOINTS.products, productListSchema, { signal })
  return items
}

/** Loads one product. A missing id rejects with an ApiError whose status is 404. */
export function fetchProduct(id: number, signal?: AbortSignal): Promise<Product> {
  return apiGet(ENDPOINTS.product(id), productSchema, { signal })
}
