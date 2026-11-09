import { LOOKBOOK_DESIGNS } from './catalog'
import type { IconName } from './components/Icon'
import type { LookbookTile, Testimonial } from './types'

export const BRAND_NAME = 'WTC'

export const ANNOUNCEMENTS = [
  'Free shipping on every watch',
  'Assembled in small batches',
  'Easy 30-day returns',
]

export const COLLECTIONS: { name: string; icon: IconName }[] = [
  { name: 'Classic', icon: 'crown' },
  { name: 'Dive', icon: 'wave' },
  { name: 'Chronograph', icon: 'stopwatch' },
  { name: 'Field', icon: 'compass' },
  { name: 'Pilot', icon: 'plane' },
  { name: 'Minimalist', icon: 'circle' },
]

export const CRAFT_FEATURES: { icon: IconName; lines: [string, string] }[] = [
  { icon: 'hand', lines: ['Hand-assembled', 'in small batches'] },
  { icon: 'gem', lines: ['Sapphire crystal', 'and 316L steel'] },
  { icon: 'wave', lines: ['Water-resistant', 'for daily wear'] },
]

export const LOOKBOOK: LookbookTile[] = [
  {
    id: 'desk',
    caption: 'At the desk',
    surface: 'linear-gradient(160deg, #d8c6ae, #a98d6f)',
    design: LOOKBOOK_DESIGNS.classicIvory,
  },
  {
    id: 'trail',
    caption: 'On the trail',
    surface: 'linear-gradient(160deg, #a9ac92, #6e7358)',
    design: LOOKBOOK_DESIGNS.fieldOlive,
  },
  {
    id: 'dark',
    caption: 'After dark',
    surface: 'linear-gradient(160deg, #6b5546, #3e3128)',
    design: LOOKBOOK_DESIGNS.diveInk,
  },
  {
    id: 'weekend',
    caption: 'Weekend away',
    surface: 'linear-gradient(160deg, #c9926f, #94573a)',
    design: LOOKBOOK_DESIGNS.classicSand,
  },
  {
    id: 'everyday',
    caption: 'Every day',
    surface: 'linear-gradient(160deg, #eadfce, #cdb99e)',
    design: LOOKBOOK_DESIGNS.miniClay,
  },
]

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'sarah',
    quote:
      'The quality blew me away. You can feel the care in every detail, and it has become part of my daily ritual.',
    author: 'Sarah M.',
  },
  {
    id: 'jason',
    quote:
      'Beautiful, understated and timeless. Shipping was fast and it arrived perfectly regulated. I will be back for more.',
    author: 'Jason T.',
  },
  {
    id: 'lina',
    quote:
      'I love supporting a small-batch watchmaker. WTC is now my go-to for thoughtful gifts and milestones.',
    author: 'Lina R.',
  },
]
