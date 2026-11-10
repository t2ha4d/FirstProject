import { z } from 'zod'

/** What the bag stores: a product id and a quantity. Prices are never stored. */
export const cartLineSchema = z.object({
  id: z.number(),
  qty: z.number().int().positive(),
})

/** The stored bag before its lines are checked one by one. */
export const storedCartSchema = z.array(z.unknown())

/** What the confirmation page receives in router state after an order is placed. */
export const placedOrderSchema = z.object({
  customerName: z.string(),
  email: z.string(),
  items: z.array(
    z.object({
      id: z.number(),
      title: z.string(),
      quantity: z.number(),
      lineTotalCents: z.number(),
    }),
  ),
  subtotalCents: z.number(),
})
