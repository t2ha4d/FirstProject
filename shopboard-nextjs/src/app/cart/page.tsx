import { CartView } from '../../features/cart'

export default function CartPage() {
  return (
    <div className="section">
      <h1 className="section-title section-title-left">Your Bag</h1>
      <div className="cart-page">
        <CartView />
      </div>
    </div>
  )
}
