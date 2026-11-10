import { z } from 'zod'

/** One product exactly as the API sends it. */
export const productSchema = z.object({
  id: z.number(),
  title: z.string(),
  category_name: z.string(),
  price_cents: z.number(),
  in_stock: z.boolean(),
})
