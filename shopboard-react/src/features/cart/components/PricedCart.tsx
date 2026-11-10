import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { useCart } from '../CartContext'
import { usePricedCart } from '../usePricedCart'
import { CartItem } from './CartItem'

export interface PricedCartProps {
  /** Extra links under the checkout link, e.g. "View bag" in the drawer. */
  children?: ReactNode
}

/** The bag lines with quantity controls and the totals. Suspends until the catalog has loaded. */
export function PricedCart({ children }: PricedCartProps) {
  const cart = useCart()
  const { items, unavailableCount, subtotalFormatted } = usePricedCart()

  return (
    <>
      <div className="drawer-body">
        {unavailableCount > 0 && (
          <p className="cart-unavailable" role="status">
            {unavailableCount === 1
              ? '1 saved item is not available right now. It stays in your bag.'
              : `${unavailableCount} saved items are not available right now. They stay in your bag.`}
          </p>
        )}
        {items.length > 0 && (
          <ul className="cart-items-list" aria-label="Bag items">
            {items.map((item) => (
              <CartItem
                key={item.product.id}
                item={item}
                onIncrement={cart.increment}
                onDecrement={cart.decrement}
                onRemove={cart.removeItem}
              />
            ))}
          </ul>
        )}
      </div>

      {items.length > 0 && (
        <div className="drawer-footer">
          <div className="subtotal-row">
            <span className="subtotal-label">Subtotal</span>
            <span className="subtotal-amount">{subtotalFormatted}</span>
          </div>
          <p className="subtotal-note">Taxes and shipping calculated at checkout.</p>
          <div className="drawer-actions">
            <Link to="/checkout" className="checkout-btn" onClick={cart.close}>
              Checkout ({subtotalFormatted})
            </Link>
            {children}
            <button type="button" className="clear-cart-btn" onClick={cart.clear}>
              Empty Bag
            </button>
          </div>
        </div>
      )}
    </>
  )
}
