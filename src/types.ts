export interface Product {
  id: number
  title: string
  category_name: string
  price_cents: number
  in_stock: boolean
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface CartState {
  items: CartItem[]
  isOpen: boolean
}

export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc'

export interface FilterState {
  searchQuery: string
  selectedCategory: string
  sortBy: SortOption
}

export type ApiStatus = 'idle' | 'loading' | 'error' | 'success'

export interface ProductsApiResponse {
  items: Product[]
  total: number
}

