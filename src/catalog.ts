import type { Product, WatchDesign } from './shared/types'

const INK = '#2f2a26'
const CREAM = '#efe6d6'
const CLAY = '#b0603a'

const classicIvory: WatchDesign = {
  dialColor: '#f1e8d8',
  markerColor: INK,
  accentColor: CLAY,
  strapColor: '#a8693f',
  strapStyle: 'leather',
  caseTone: 'gold',
  dialStyle: 'baton',
}
const classicSand: WatchDesign = {
  dialColor: '#d9c3a3',
  markerColor: INK,
  accentColor: CLAY,
  strapColor: '#5d3c28',
  strapStyle: 'leather',
  caseTone: 'steel',
  dialStyle: 'baton',
  hasDate: true,
}
const diveSage: WatchDesign = {
  dialColor: '#59644f',
  markerColor: CREAM,
  accentColor: '#e0a26f',
  strapColor: '#a6a39c',
  strapStyle: 'steel',
  caseTone: 'steel',
  dialStyle: 'baton',
  bezelColor: '#3f4a3a',
  hasDate: true,
}
const diveInk: WatchDesign = {
  dialColor: '#26282a',
  markerColor: CREAM,
  accentColor: CLAY,
  strapColor: '#a6a39c',
  strapStyle: 'steel',
  caseTone: 'steel',
  dialStyle: 'baton',
  bezelColor: '#1b1c1e',
}
const chronoCream: WatchDesign = {
  dialColor: '#ece2d0',
  markerColor: INK,
  accentColor: CLAY,
  strapColor: '#3a2a20',
  strapStyle: 'leather',
  caseTone: 'steel',
  dialStyle: 'baton',
  hasSubdials: true,
}
const chronoClay: WatchDesign = {
  dialColor: '#a4532f',
  markerColor: CREAM,
  accentColor: CREAM,
  strapColor: '#46301f',
  strapStyle: 'leather',
  caseTone: 'gold',
  dialStyle: 'baton',
  hasSubdials: true,
}
const fieldOlive: WatchDesign = {
  dialColor: '#6e7358',
  markerColor: CREAM,
  accentColor: '#e0a26f',
  strapColor: '#8d8468',
  strapStyle: 'leather',
  caseTone: 'steel',
  dialStyle: 'numeral',
}
const fieldKhaki: WatchDesign = {
  dialColor: '#c8b692',
  markerColor: INK,
  accentColor: CLAY,
  strapColor: '#8f5a36',
  strapStyle: 'leather',
  caseTone: 'black',
  dialStyle: 'numeral',
  hasDate: true,
}
const pilotCharcoal: WatchDesign = {
  dialColor: '#37342f',
  markerColor: CREAM,
  accentColor: '#e0a26f',
  strapColor: '#6b4227',
  strapStyle: 'leather',
  caseTone: 'steel',
  dialStyle: 'numeral',
}
const pilotBlack: WatchDesign = {
  dialColor: '#1f1e1c',
  markerColor: CREAM,
  accentColor: CLAY,
  strapColor: '#2f2219',
  strapStyle: 'leather',
  caseTone: 'black',
  dialStyle: 'numeral',
  hasDate: true,
}
const miniSand: WatchDesign = {
  dialColor: '#f4eee3',
  markerColor: INK,
  accentColor: CLAY,
  strapColor: '#b3b0a9',
  strapStyle: 'mesh',
  caseTone: 'steel',
  dialStyle: 'minimal',
}
const miniClay: WatchDesign = {
  dialColor: '#c98f6b',
  markerColor: INK,
  accentColor: CREAM,
  strapColor: '#d6c2a6',
  strapStyle: 'leather',
  caseTone: 'gold',
  dialStyle: 'minimal',
}

export const WATCH_CATALOG: Product[] = [
  {
    id: 1,
    title: 'Meridian 38',
    subtitle: 'Ivory Dial · Tan Leather',
    category_name: 'Classic',
    price_cents: 32000,
    in_stock: true,
    design: classicIvory,
  },
  {
    id: 2,
    title: 'Tidewater 300',
    subtitle: 'Sage Bezel · Steel Bracelet',
    category_name: 'Dive',
    price_cents: 48000,
    in_stock: true,
    design: diveSage,
  },
  {
    id: 3,
    title: 'Apex Chrono',
    subtitle: 'Cream Dial · Espresso Leather',
    category_name: 'Chronograph',
    price_cents: 56000,
    in_stock: true,
    design: chronoCream,
  },
  {
    id: 4,
    title: 'Trailhead 40',
    subtitle: 'Olive Dial · Canvas Strap',
    category_name: 'Field',
    price_cents: 24000,
    in_stock: true,
    design: fieldOlive,
  },
  {
    id: 5,
    title: 'Altitude 41',
    subtitle: 'Charcoal Dial · Cognac Leather',
    category_name: 'Pilot',
    price_cents: 42000,
    in_stock: true,
    design: pilotCharcoal,
  },
  {
    id: 6,
    title: 'Mono 36',
    subtitle: 'White Sand Dial · Steel Mesh',
    category_name: 'Minimalist',
    price_cents: 21000,
    in_stock: true,
    design: miniSand,
  },
  {
    id: 7,
    title: 'Heritage Date',
    subtitle: 'Sand Dial · Walnut Leather',
    category_name: 'Classic',
    price_cents: 35500,
    in_stock: true,
    design: classicSand,
  },
  {
    id: 8,
    title: 'Deep Reef',
    subtitle: 'Ink Dial · Steel Bracelet',
    category_name: 'Dive',
    price_cents: 46000,
    in_stock: false,
    design: diveInk,
  },
  {
    id: 9,
    title: 'Circuit Chrono',
    subtitle: 'Terracotta Dial · Dark Leather',
    category_name: 'Chronograph',
    price_cents: 59000,
    in_stock: true,
    design: chronoClay,
  },
  {
    id: 10,
    title: 'Ridgeline',
    subtitle: 'Khaki Dial · Saddle Leather',
    category_name: 'Field',
    price_cents: 26000,
    in_stock: true,
    design: fieldKhaki,
  },
  {
    id: 11,
    title: 'Skyward 42',
    subtitle: 'Night Dial · Dark Leather',
    category_name: 'Pilot',
    price_cents: 38000,
    in_stock: false,
    design: pilotBlack,
  },
  {
    id: 12,
    title: 'Still 38',
    subtitle: 'Clay Dial · Sand Leather',
    category_name: 'Minimalist',
    price_cents: 19500,
    in_stock: true,
    design: miniClay,
  },
]

/** One representative design per collection, for tiles and imagery. */
export const COLLECTION_DESIGNS: Record<string, WatchDesign> = {
  Classic: classicIvory,
  Dive: diveSage,
  Chronograph: chronoCream,
  Field: fieldOlive,
  Pilot: pilotCharcoal,
  Minimalist: miniSand,
}

export const HERO_DESIGN = chronoClay
export const FOOTER_DESIGN = classicSand
export const LOOKBOOK_DESIGNS = { classicIvory, fieldOlive, diveInk, classicSand, miniClay }
