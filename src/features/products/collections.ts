import {
  chronoCream,
  classicIvory,
  diveSage,
  fieldOlive,
  miniSand,
  pilotCharcoal,
} from '../../shared/ui/watchDesigns'
import type { Collection } from './types'

/** The collections shown in navigation, tiles and the footer, in display order. */
export const COLLECTIONS: Collection[] = [
  { name: 'Classic', icon: 'crown', design: classicIvory },
  { name: 'Dive', icon: 'wave', design: diveSage },
  { name: 'Chronograph', icon: 'stopwatch', design: chronoCream },
  { name: 'Field', icon: 'compass', design: fieldOlive },
  { name: 'Pilot', icon: 'plane', design: pilotCharcoal },
  { name: 'Minimalist', icon: 'circle', design: miniSand },
]
