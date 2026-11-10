'use client'

import { useRouter } from 'next/navigation'
import { startTransition } from 'react'
import { useCart } from './CartContext'
import { calculateSubtotalCents } from './logic'
import { saveOrder } from './orderStorage'
import type { PlacedOrder } from './types'
import { usePricedCart } from './usePricedCart'

interface Customer {
  name: string
  email: string
}

/**
 * Places the order. There is no order endpoint, so "placing" means: take a snapshot of the
 * priced bag, save it for the confirmation page, open that page and empty the bag through
 * the provider. Call it inside the bag's data region (it needs prices).
 */
export function usePlaceOrder(): (customer: Customer) => void {
  const { clear } = useCart()
  const { items } = usePricedCart()
  const router = useRouter()

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
    saveOrder(order)
    // The navigation is a transition, so the bag is emptied inside the same one: checkout
    // never shows the empty bag before the confirmation arrives. `replace` keeps Back from
    // returning to a checkout that has nothing left to order.
    startTransition(() => {
      router.replace('/order-confirmation')
      clear()
    })
  }
}
