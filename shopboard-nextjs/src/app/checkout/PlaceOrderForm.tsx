'use client'

import { usePlaceOrder } from '../../features/cart'
import { CheckoutForm } from '../../features/checkout'

/** Connects the checkout form to the cart. Rendered inside the priced bag, so the order uses the prices shown. */
export function PlaceOrderForm() {
  const placeOrder = usePlaceOrder()
  return (
    <CheckoutForm
      onSubmit={(values) => placeOrder({ name: values.fullName, email: values.email })}
    />
  )
}
