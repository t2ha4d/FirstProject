/** Endpoint paths, relative to API_BASE_URL. Features import paths from here, never URLs. */
export const ENDPOINTS = {
  products: '/products',
  product: (id: number) => `/products/${id}`,
}
