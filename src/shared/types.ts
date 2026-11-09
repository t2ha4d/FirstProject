export type DialStyle = 'baton' | 'numeral' | 'minimal'
export type StrapStyle = 'leather' | 'steel' | 'mesh'
export type CaseTone = 'steel' | 'gold' | 'black'

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
  subtitle: string
  category_name: string
  price_cents: number
  in_stock: boolean
  design: WatchDesign
}

export type ApiStatus = 'idle' | 'loading' | 'error' | 'success'

export interface Testimonial {
  id: string
  quote: string
  author: string
}

export interface LookbookTile {
  id: string
  caption: string
  surface: string
  design: WatchDesign
}
