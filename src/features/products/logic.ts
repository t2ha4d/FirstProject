import { isOneOf } from '../../shared/lib/guards'
import type { Product } from '../../shared/types'
import type { FilterState, SortOption } from './types'

export const INITIAL_FILTERS: FilterState = {
  searchQuery: '',
  selectedCategory: 'all',
  sortBy: 'default',
}

/** Sort choices in display order; the single source for the select and the guard. */
export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'default', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Alphabetical (A - Z)' },
]

const SORT_VALUES = SORT_OPTIONS.map((option) => option.value)

/** Narrows a raw <select> value to a SortOption without a type assertion. */
export function isSortOption(value: string): value is SortOption {
  return isOneOf(value, SORT_VALUES)
}

/**
 * Pure search filter: matches product title, subtitle or category name (case-insensitive)
 */
export function filterBySearch(products: Product[], query: string): Product[] {
  const trimmed = query.trim().toLowerCase()
  if (!trimmed) {
    return products
  }
  return products.filter(
    (product) =>
      product.title.toLowerCase().includes(trimmed) ||
      product.subtitle.toLowerCase().includes(trimmed) ||
      product.category_name.toLowerCase().includes(trimmed),
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
