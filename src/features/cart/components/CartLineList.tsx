import { Link } from 'react-router'
import { Icon } from '../../../shared/ui/Icon'
import { useCart } from '../CartContext'
import { CartItem } from './CartItem'

/** The bag's lines with quantity controls, or a loading or empty message. Used by the drawer and the cart page. */
export function CartLineList() {
  const cart = useCart()

  if (cart.isResolving) {
    return (
      <p className="cart-resolving" role="status">
        Loading your bag…
      </p>
    )
  }

  if (cart.items.length === 0) {
    return (
      <div className="empty-cart-state">
        <span className="empty-cart-icon">
          <Icon name="bag" size={44} />
        </span>
        <p className="empty-cart-title">Your bag is empty</p>
        <p className="empty-cart-text">Explore the collection and find a piece worth keeping.</p>
        <Link to="/shop" className="continue-shopping-btn" onClick={cart.close}>
          Explore Products
        </Link>
      </div>
    )
  }

  return (
    <ul className="cart-items-list" aria-label="Bag items">
      {cart.items.map((item) => (
        <CartItem
          key={item.product.id}
          item={item}
          onIncrement={cart.increment}
          onDecrement={cart.decrement}
          onRemove={cart.removeItem}
        />
      ))}
    </ul>
  )
}
