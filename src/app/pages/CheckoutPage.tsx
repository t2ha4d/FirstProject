import { OrderSummary, usePlaceOrder } from '../../features/cart'
import { CheckoutForm } from '../../features/checkout'

export function CheckoutPage() {
  return (
    <div className="section">
      <h1 className="section-title section-title-left">Checkout</h1>
      <OrderSummary>
        <PlaceOrderForm />
      </OrderSummary>
    </div>
  )
}

/** Connects the checkout form to the cart. Rendered inside the priced bag, so the order uses the prices shown. */
function PlaceOrderForm() {
  const placeOrder = usePlaceOrder()
  return (
    <CheckoutForm
      onSubmit={(values) => placeOrder({ name: values.fullName, email: values.email })}
    />
  )
}
