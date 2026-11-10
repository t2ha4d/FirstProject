import Link from 'next/link'
import { Icon } from '../../../shared/ui/Icon'
import { useCart } from '../CartContext'

/** Shown when nothing is saved in the bag. Needs no product data. */
export function EmptyCart() {
  const cart = useCart()

  return (
    <div className="empty-cart-state">
      <span className="empty-cart-icon">
        <Icon name="bag" size={44} />
      </span>
      <p className="empty-cart-title">Your bag is empty</p>
      <p className="empty-cart-text">Explore the collection and find a piece worth keeping.</p>
      <Link href="/shop" className="continue-shopping-btn" onClick={cart.close}>
        Explore Products
      </Link>
    </div>
  )
}
