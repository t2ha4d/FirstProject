import type { z } from 'zod'
import type { productSchema } from './api/schemas'

export type DialStyle = 'baton' | 'numeral' | 'minimal'
export type StrapStyle = 'leather' | 'steel'
export type CaseTone = 'steel' | 'gold'

/** Visual recipe used by WatchIllustration to draw a watch. */
export interface WatchDesign {
  dialColor: string
  markerColor: string
  accentColor: string
  strapColor: string
  strapStyle: StrapStyle
  caseTone: CaseTone
  dialStyle: DialStyle
  bezelColor?: string
  hasSubdials?: boolean
  hasDate?: boolean
}

export type Product = z.infer<typeof productSchema>

export type ApiStatus = 'idle' | 'loading' | 'error' | 'success'
