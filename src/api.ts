import type { Product } from './shared/types'

const PRODUCTS_URL = '/api/products.json'

interface ProductsResponse {
  items: Product[]
}

function isProductsResponse(data: unknown): data is ProductsResponse {
  return typeof data === 'object' && data !== null && 'items' in data && Array.isArray(data.items)
}

/**
 * Loads the WTC catalog. The file is served from public/api/products.json.
 */
export async function fetchProducts(signal?: AbortSignal): Promise<Product[]> {
  const response = await fetch(PRODUCTS_URL, { signal, headers: { Accept: 'application/json' } })
  if (!response.ok) {
    throw new Error(`Failed to load products: ${response.status} ${response.statusText}`)
  }
  const data: unknown = await response.json()
  if (!isProductsResponse(data)) {
    throw new Error('Invalid response structure received from the products API')
  }
  return data.items
}
