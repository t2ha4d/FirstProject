import type { WatchDesign } from './shared/types'

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
const pilotCharcoal: WatchDesign = {
  dialColor: '#37342f',
  markerColor: CREAM,
  accentColor: '#e0a26f',
  strapColor: '#6b4227',
  strapStyle: 'leather',
  caseTone: 'steel',
  dialStyle: 'numeral',
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
