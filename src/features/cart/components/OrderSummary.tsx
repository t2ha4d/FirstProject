import { Link } from 'react-router'
import { formatPrice } from '../../../shared/lib/format'
import { Icon } from '../../../shared/ui/Icon'
import { StatePanel } from '../../../shared/ui/StatePanel'
import { useCart } from '../CartContext'
import { usePricedCart } from '../usePricedCart'
import { CartBoundary } from './CartBoundary'
import { OrderSummarySkeleton } from './Skeletons'

/** What is being ordered, for the checkout page. An empty bag needs no product data. */
export function OrderSummary() {
  const cart = useCart()

  if (cart.lines.length === 0) {
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
    <CartBoundary fallback={<OrderSummarySkeleton />}>
      <PricedSummary />
    </CartBoundary>
  )
}

/** Suspends until the catalog has loaded. */
function PricedSummary() {
  const { items, unavailableCount, subtotalFormatted } = usePricedCart()

  if (items.length === 0) {
    return (
      <StatePanel
        art={<Icon name="box" size={36} />}
        title="Nothing in your bag is available"
        description="Your saved items are not in the collection right now. They stay in your bag."
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
        {items.map(({ product, quantity }) => (
          <li key={product.id} className="order-summary-item">
            <span>
              {product.title} × {quantity}
            </span>
            <span>{formatPrice(product.price_cents * quantity)}</span>
          </li>
        ))}
      </ul>
      {unavailableCount > 0 && (
        <p className="cart-unavailable">
          {unavailableCount} saved {unavailableCount === 1 ? 'item is' : 'items are'} not available
          right now and will not be ordered.
        </p>
      )}
      <div className="subtotal-row">
        <span className="subtotal-label">Subtotal</span>
        <span className="subtotal-amount">{subtotalFormatted}</span>
      </div>
    </section>
  )
}
