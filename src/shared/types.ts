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

export interface Product {
  id: number
  title: string
  category_name: string
  price_cents: number
  in_stock: boolean
}

export type ApiStatus = 'idle' | 'loading' | 'error' | 'success'
