const USD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

/**
 * Formats a price in cents as a USD currency string ($XX.XX)
 */
export function formatPrice(priceCents: number): string {
  return USD.format(priceCents / 100)
}
