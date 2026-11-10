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
