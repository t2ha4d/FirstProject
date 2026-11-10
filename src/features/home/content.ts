import type { IconName } from '../../shared/ui/Icon'
import type { Testimonial } from './types'

export const ANNOUNCEMENTS = [
  'Free shipping on every order',
  'Made in small batches',
  'Easy 30-day returns',
]

export const CRAFT_FEATURES: { icon: IconName; lines: [string, string] }[] = [
  { icon: 'hand', lines: ['Hand-finished', 'in small batches'] },
  { icon: 'gem', lines: ['Full-grain leather', 'and solid brass'] },
  { icon: 'box', lines: ['Packed with care,', 'shipped in days'] },
]

/** Category icons shown on the craft panel, one per thing the store sells. */
export const CRAFT_ICONS: IconName[] = ['bag', 'shoe', 'gem']

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'sarah',
    quote:
      'The leather tote is beautifully made. You can feel the care in every stitch, and it goes with me everywhere.',
    author: 'Sarah M.',
  },
  {
    id: 'jason',
    quote:
      'Comfortable from the first day and still looking new months later. Shipping was fast and the packaging was lovely.',
    author: 'Jason T.',
  },
  {
    id: 'lina',
    quote:
      'I love supporting a small-batch maker. WTC is now my go-to for thoughtful gifts and milestones.',
    author: 'Lina R.',
  },
]
