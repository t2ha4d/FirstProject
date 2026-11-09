import type { Product } from '../../shared/types'

/** A product in the bag together with how many the shopper wants. */
export interface CartEntry {
  product: Product
  quantity: number
}
