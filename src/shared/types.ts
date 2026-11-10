import type { z } from 'zod'
import type { productSchema } from './api/schemas'

export type Product = z.infer<typeof productSchema>

export type ApiStatus = 'idle' | 'loading' | 'error' | 'success'
