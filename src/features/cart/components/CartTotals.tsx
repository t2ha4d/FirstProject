import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { useCart } from '../CartContext'

export interface CartTotalsProps {
  /** Extra links shown under the checkout link, e.g. "View bag" in the drawer. */
  children?: ReactNode
}

/** Subtotal, the checkout link and "Empty Bag". Renders nothing when the bag is empty. */
export function CartTotals({ children }: CartTotalsProps) {
  const cart = useCart()

  if (cart.items.length === 0) {
    return null
  }

  return (
    <div className="drawer-footer">
      <div className="subtotal-row">
        <span className="subtotal-label">Subtotal</span>
        <span className="subtotal-amount">{cart.subtotalFormatted}</span>
      </div>
      <p className="subtotal-note">Taxes and shipping calculated at checkout.</p>
      <div className="drawer-actions">
        <Link to="/checkout" className="checkout-btn" onClick={cart.close}>
          Checkout ({cart.subtotalFormatted})
        </Link>
        {children}
        <button type="button" className="clear-cart-btn" onClick={cart.clear}>
          Empty Bag
        </button>
      </div>
    </div>
  )
}
