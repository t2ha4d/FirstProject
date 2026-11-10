import type { z } from 'zod'
import type { IconName } from '../../shared/ui/Icon'
import type { sortOptionSchema } from './schemas'

export type SortOption = z.infer<typeof sortOptionSchema>

export interface FilterState {
  searchQuery: string
  selectedCategory: string
  sortBy: SortOption
}

export interface Collection {
  name: string
  icon: IconName
}
