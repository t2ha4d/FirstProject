import type { Product } from '../../shared/types'
import { productIdSchema, sortOptionSchema } from './schemas'
import type { FilterState, SortOption } from './types'

export const INITIAL_FILTERS: FilterState = {
  searchQuery: '',
  selectedCategory: 'all',
  sortBy: 'default',
}

/** Sort choices in display order, for the sort select. */
export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'default', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Alphabetical (A - Z)' },
]

/** Reads a sort value from the URL or a select; anything unknown falls back to 'default'. */
export function toSortOption(value: string | null): SortOption {
  const result = sortOptionSchema.safeParse(value)
  return result.success ? result.data : 'default'
}

/** Reads the shop filters from the URL search params (`q`, `category`, `sort`). */
export function readFilters(params: URLSearchParams): FilterState {
  return {
    searchQuery: params.get('q') ?? '',
    selectedCategory: params.get('category') ?? INITIAL_FILTERS.selectedCategory,
    sortBy: toSortOption(params.get('sort')),
  }
}

/** Writes filters back to search params, leaving out values that equal the defaults. */
export function writeFilters(filters: FilterState): URLSearchParams {
  const params = new URLSearchParams()
  if (filters.searchQuery) params.set('q', filters.searchQuery)
  if (filters.selectedCategory !== INITIAL_FILTERS.selectedCategory) {
    params.set('category', filters.selectedCategory)
  }
  if (filters.sortBy !== INITIAL_FILTERS.sortBy) params.set('sort', filters.sortBy)
  return params
}

/** The shop URL, optionally filtered to one collection. */
export function shopUrl(category?: string): string {
  const search = writeFilters({ ...INITIAL_FILTERS, selectedCategory: category ?? 'all' })
  return search.size > 0 ? `/shop?${search}` : '/shop'
}

/** Finds the product a raw `:id` route param points to, or undefined for an invalid or unknown id. */
export function findProduct(products: Product[], id: string | undefined): Product | undefined {
  const parsed = productIdSchema.safeParse(id)
  if (!parsed.success) return undefined
  return products.find((product) => product.id === parsed.data)
}

/**
 * Pure search filter: matches product title or category name (case-insensitive)
 */
export function filterBySearch(products: Product[], query: string): Product[] {
  const trimmed = query.trim().toLowerCase()
  if (!trimmed) {
    return products
  }
  return products.filter(
    (product) =>
      product.title.toLowerCase().includes(trimmed) ||
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
