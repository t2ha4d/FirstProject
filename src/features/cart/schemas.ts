import { z } from 'zod'

const quantitySchema = z.number().int().positive()

/** What the bag stores: a product id and a quantity. Prices are never stored. */
export const cartLineSchema = z.object({
  id: z.number(),
  qty: quantitySchema,
})

/** The older `{ product: { id, ... }, quantity }` shape, read as a line without its stored price. */
const legacyLineSchema = z
  .object({ product: z.object({ id: z.number() }), quantity: quantitySchema })
  .transform(({ product, quantity }) => ({ id: product.id, qty: quantity }))

export const storedLineSchema = z.union([cartLineSchema, legacyLineSchema])

/** The stored bag before its lines are checked one by one. */
export const storedCartSchema = z.array(z.unknown())
