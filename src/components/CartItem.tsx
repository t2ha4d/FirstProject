import { formatPrice } from '../logic'
import type { CartItem as CartItemType } from '../types'

export interface CartItemProps {
  item: CartItemType
  onIncrement: (productId: number) => void
  onDecrement: (productId: number) => void
  onRemove: (productId: number) => void
}

export function CartItem({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}: CartItemProps) {
  const lineTotalCents = item.product.price_cents * item.quantity

  return (
    <li className="cart-item">
      <div className="cart-item-info">
        <span className="cart-item-category">{item.product.category_name}</span>
        <h4 className="cart-item-title">{item.product.title}</h4>
        <span className="cart-item-unit-price">{formatPrice(item.product.price_cents)} each</span>
      </div>

      <div className="cart-item-actions">
        <div className="quantity-controls" role="group" aria-label={`Quantity controls for ${item.product.title}`}>
          <button
            type="button"
            className="qty-btn"
            onClick={() => onDecrement(item.product.id)}
            aria-label={`Decrease quantity of ${item.product.title}`}
          >
            −
          </button>
          <span className="qty-display" aria-label={`Current quantity: ${item.quantity}`}>
            {item.quantity}
          </span>
          <button
            type="button"
            className="qty-btn"
            onClick={() => onIncrement(item.product.id)}
            aria-label={`Increase quantity of ${item.product.title}`}
          >
            +
          </button>
        </div>

        <div className="cart-item-subtotal">
          <span className="line-price">{formatPrice(lineTotalCents)}</span>
          <button
            type="button"
            className="remove-item-btn"
            onClick={() => onRemove(item.product.id)}
            aria-label={`Remove ${item.product.title} from cart`}
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  )
}

