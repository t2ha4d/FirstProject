import { apiGet } from '../../shared/api/client'
import { ENDPOINTS } from '../../shared/api/endpoints'
import { isBoolean, isFiniteNumber, isOneOf, isRecord, isString } from '../../shared/lib/guards'
import type { CaseTone, DialStyle, Product, StrapStyle, WatchDesign } from '../../shared/types'

const STRAP_STYLES: StrapStyle[] = ['leather', 'steel', 'mesh']
const CASE_TONES: CaseTone[] = ['steel', 'gold', 'black']
const DIAL_STYLES: DialStyle[] = ['baton', 'numeral', 'minimal']

function parseDesign(value: unknown): WatchDesign | null {
  if (!isRecord(value)) return null
  const { dialColor, markerColor, accentColor, strapColor, strapStyle, caseTone, dialStyle } = value
  if (
    !isString(dialColor) ||
    !isString(markerColor) ||
    !isString(accentColor) ||
    !isString(strapColor) ||
    !isOneOf(strapStyle, STRAP_STYLES) ||
    !isOneOf(caseTone, CASE_TONES) ||
    !isOneOf(dialStyle, DIAL_STYLES)
  ) {
    return null
  }
  const design: WatchDesign = {
    dialColor,
    markerColor,
    accentColor,
    strapColor,
    strapStyle,
    caseTone,
    dialStyle,
  }
  if (isString(value.bezelColor)) design.bezelColor = value.bezelColor
  if (isBoolean(value.hasSubdials)) design.hasSubdials = value.hasSubdials
  if (isBoolean(value.hasDate)) design.hasDate = value.hasDate
  return design
}

function parseProduct(value: unknown): Product | null {
  if (!isRecord(value)) return null
  const { id, title, subtitle, category_name, price_cents, in_stock } = value
  const design = parseDesign(value.design)
  if (
    !isFiniteNumber(id) ||
    !isString(title) ||
    !isString(subtitle) ||
    !isString(category_name) ||
    !isFiniteNumber(price_cents) ||
    !isBoolean(in_stock) ||
    design === null
  ) {
    return null
  }
  return { id, title, subtitle, category_name, price_cents, in_stock, design }
}

/** Validates the `{ items, total }` payload and returns only well-formed products. */
export function parseProductsResponse(data: unknown): Product[] {
  if (!isRecord(data) || !Array.isArray(data.items)) {
    throw new Error('Invalid response structure received from the products API')
  }
  return data.items.map(parseProduct).filter((product) => product !== null)
}

export function fetchProducts(signal?: AbortSignal): Promise<Product[]> {
  return apiGet(ENDPOINTS.products, parseProductsResponse, { signal })
}
