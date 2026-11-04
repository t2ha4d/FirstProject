import type { Product, ProductsApiResponse } from './types'

export const PRODUCTS_API_URL = 'https://shopboard-api.vercel.app/api/products'

export async function fetchProducts(signal?: AbortSignal): Promise<Product[]> {
  try {
    const response = await fetch(PRODUCTS_API_URL, {
      signal,
      headers: {
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to load products: ${response.status} ${response.statusText}`)
    }

    const data: ProductsApiResponse = await response.json()

    if (!data || !Array.isArray(data.items)) {
      throw new Error('Invalid response structure received from API')
    }

    return data.items
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error
    }
    const message = error instanceof Error ? error.message : 'An unexpected error occurred while fetching products'
    throw new Error(message)
  }
}

