import { z } from 'zod'

/** What the bag stores: a product id and a quantity. Prices are never stored. */
export const cartLineSchema = z.object({
  id: z.number(),
  qty: z.number().int().positive(),
})

/** The stored bag before its lines are checked one by one. */
export const storedCartSchema = z.array(z.unknown())
