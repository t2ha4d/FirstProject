import type { CartItem, FilterState, Product, SortOption } from './types'

/**
 * Pure search filter: matches product title, subtitle or category name (case-insensitive)
 */
export function filterBySearch(products: Product[], query: string): Product[] {
  const trimmed = query.trim().toLowerCase()
  if (!trimmed) {
    return products
  }
  return products.filter((product) =>
    product.title.toLowerCase().includes(trimmed) ||
    product.subtitle.toLowerCase().includes(trimmed) ||
    product.category_name.toLowerCase().includes(trimmed)
  )
}

/**
 * Pure category filter: matches exact category or returns all if 'all' or empty
 */
export function filterByCategory(products: Product[], category: string): Product[] {
  if (!category || category === 'all') {
    return products
  }
  return products.filter((product) => product.category_name === category)
}

/**
 * Pure sort function: returns a NEW sorted array without mutating input
 */
export function sortProducts(products: Product[], sortBy: SortOption): Product[] {
  const copy = [...products]
  switch (sortBy) {
    case 'price-asc':
      return copy.sort((a, b) => a.price_cents - b.price_cents)
    case 'price-desc':
      return copy.sort((a, b) => b.price_cents - a.price_cents)
    case 'name-asc':
      return copy.sort((a, b) => a.title.localeCompare(b.title))
    case 'default':
    default:
      return copy
  }
}

/**
 * Applies search, category filter, and sorting sequentially
 */
export function applyFilters(products: Product[], filters: FilterState): Product[] {
  const searched = filterBySearch(products, filters.searchQuery)
  const categorized = filterByCategory(searched, filters.selectedCategory)
  return sortProducts(categorized, filters.sortBy)
}

/**
 * Extracts a unique, sorted list of categories from products
 */
export function getUniqueCategories(products: Product[]): string[] {
  const set = new Set<string>()
  for (const product of products) {
    if (product.category_name) {
      set.add(product.category_name)
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b))
}

/**
 * Formats price in cents to a standard USD currency string ($XX.XX)
 */
export function formatPrice(priceCents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(priceCents / 100)
}

/**
 * Computes subtotal in cents for cart items
 */
export function calculateSubtotalCents(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.product.price_cents * item.quantity, 0)
}

/**
 * Computes total item count in cart
 */
export function calculateTotalCount(items: CartItem[]): number {
  return items.reduce((count, item) => count + item.quantity, 0)
}

