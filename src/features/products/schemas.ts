import { z } from 'zod'

/** The sort choices the shop accepts in its `sort` search param. */
export const sortOptionSchema = z.enum(['default', 'price-asc', 'price-desc', 'name-asc'])

/** A product id as it appears in a URL: a positive whole number with no extra characters. */
export const productIdSchema = z
  .string()
  .regex(/^[1-9]\d*$/)
  .transform(Number)
