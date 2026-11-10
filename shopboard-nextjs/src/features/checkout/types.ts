import type { z } from 'zod'
import type { checkoutSchema } from './schema'

export type CheckoutValues = z.infer<typeof checkoutSchema>
