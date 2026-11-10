import { z } from 'zod'

/** The sort choices the shop accepts in its `sort` search param. */
export const sortOptionSchema = z.enum(['default', 'price-asc', 'price-desc', 'name-asc'])
