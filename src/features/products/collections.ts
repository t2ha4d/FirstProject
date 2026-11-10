import type { IconName } from '../../shared/ui/Icon'
import type { Collection } from './types'

/** The collections shown in navigation, tiles and the footer, in display order. */
export const COLLECTIONS: Collection[] = [
  { name: 'Bags', icon: 'bag' },
  { name: 'Shoes', icon: 'shoe' },
  { name: 'Accessories', icon: 'gem' },
]

/** The icon drawn for a product of this category; a box for a category we do not know. */
export function iconForCategory(category: string): IconName {
  return COLLECTIONS.find((collection) => collection.name === category)?.icon ?? 'box'
}
