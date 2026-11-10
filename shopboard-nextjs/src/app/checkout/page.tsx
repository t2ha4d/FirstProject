import { OrderSummary } from '../../features/cart'
import { PlaceOrderForm } from './PlaceOrderForm'

export default function CheckoutPage() {
  return (
    <div className="section">
      <h1 className="section-title section-title-left">Checkout</h1>
      <OrderSummary>
        <PlaceOrderForm />
      </OrderSummary>
    </div>
  )
}
