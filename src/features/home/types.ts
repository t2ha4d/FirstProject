import type { WatchDesign } from '../../shared/types'

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
