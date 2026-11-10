import { useNavigate } from 'react-router'
import { useCart } from './CartContext'
import { calculateSubtotalCents } from './logic'
import type { PlacedOrder } from './types'
import { usePricedCart } from './usePricedCart'

interface Customer {
  name: string
  email: string
}

/**
 * Places the order. There is no order endpoint, so "placing" means: take a snapshot of
 * the priced bag, open the confirmation page with it, and empty the bag through the
 * provider. Call it inside the bag's data region (it needs prices).
 */
export function usePlaceOrder(): (customer: Customer) => void {
  const { clear } = useCart()
  const { items } = usePricedCart()
  const navigate = useNavigate()

  return (customer) => {
    const order: PlacedOrder = {
      customerName: customer.name,
      email: customer.email,
      items: items.map(({ product, quantity }) => ({
        id: product.id,
        title: product.title,
        quantity,
        lineTotalCents: product.price_cents * quantity,
      })),
      subtotalCents: calculateSubtotalCents(items),
    }
    // Leave checkout first (flushSync), so it never renders the emptied bag. `replace`
    // keeps Back from returning to a checkout that has nothing left to order.
    navigate('/order-confirmation', { state: order, replace: true, flushSync: true })
    clear()
  }
}
