import type { z } from 'zod'
import type { Product } from '../../shared/types'
import type { cartLineSchema } from './schemas'

export type CartLine = z.infer<typeof cartLineSchema>

/** A cart line joined with its current product data, for display and totals. */
export interface CartEntry {
  product: Product
  quantity: number
}
