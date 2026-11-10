import { Link } from 'react-router'
import { formatPrice } from '../../../shared/lib/format'
import { Icon } from '../../../shared/ui/Icon'
import { StatePanel } from '../../../shared/ui/StatePanel'
import { useCart } from '../CartContext'

/** A read-only list of what is in the bag, with the subtotal, for the checkout page. */
export function OrderSummary() {
  const cart = useCart()

  if (cart.isResolving) {
    return (
      <StatePanel
        art={<div className="spinner" aria-hidden="true" />}
        title="Loading your bag…"
        description="One moment while we price your items."
        heading="p"
        role="status"
      />
    )
  }

  if (cart.items.length === 0) {
    return (
      <StatePanel
        art={<Icon name="bag" size={36} />}
        title="Your bag is empty"
        description="Add something to your bag before checking out."
      >
        <Link to="/shop" className="retry-btn">
          Browse the shop
        </Link>
      </StatePanel>
    )
  }

  return (
    <section className="order-summary" aria-labelledby="order-summary-title">
      <h2 id="order-summary-title" className="order-summary-title">
        Order summary
      </h2>
      <ul className="order-summary-list">
        {cart.items.map(({ product, quantity }) => (
          <li key={product.id} className="order-summary-item">
            <span>
              {product.title} × {quantity}
            </span>
            <span>{formatPrice(product.price_cents * quantity)}</span>
          </li>
        ))}
      </ul>
      <div className="subtotal-row">
        <span className="subtotal-label">Subtotal</span>
        <span className="subtotal-amount">{cart.subtotalFormatted}</span>
      </div>
    </section>
  )
}
