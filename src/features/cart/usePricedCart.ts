import { use } from 'react'
import { loadProducts } from '../../shared/api/products'
import { formatPrice } from '../../shared/lib/format'
import { useCart } from './CartContext'
import { calculateSubtotalCents, resolveCart } from './logic'

/**
 * The bag joined with the catalog, for anything that shows prices. Suspends until
 * the catalog has loaded, so call it inside a CartBoundary.
 */
export function usePricedCart() {
  const { lines } = useCart()
  const items = resolveCart(lines, use(loadProducts()))
  const subtotalCents = calculateSubtotalCents(items)

  return {
    items,
    /** Saved lines whose product is not in the catalog right now; they stay saved. */
    unavailableCount: lines.length - items.length,
    subtotalFormatted: formatPrice(subtotalCents),
  }
}
