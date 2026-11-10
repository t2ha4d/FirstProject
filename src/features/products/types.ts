import type { IconName } from '../../shared/ui/Icon'

export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc'

export interface FilterState {
  searchQuery: string
  selectedCategory: string
  sortBy: SortOption
}

export interface Collection {
  name: string
  icon: IconName
}
