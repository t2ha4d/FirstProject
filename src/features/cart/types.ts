import type { Product } from '../../shared/types'

/** What the bag stores: a product id and a quantity. Prices are never stored. */
export interface CartLine {
  id: number
  qty: number
}

/** A cart line joined with its current product data, for display and totals. */
export interface CartEntry {
  product: Product
  quantity: number
}
