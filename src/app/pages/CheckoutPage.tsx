import { OrderSummary } from '../../features/cart'

export function CheckoutPage() {
  return (
    <div className="section">
      <h1 className="section-title section-title-left">Checkout</h1>
      <OrderSummary />
    </div>
  )
}
