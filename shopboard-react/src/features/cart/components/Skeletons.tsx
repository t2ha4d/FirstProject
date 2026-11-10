/** Loading placeholders shaped like the bag lines and the order summary. */

const ROW_KEYS = ['first', 'second']

export function CartLinesSkeleton() {
  return (
    <ul className="cart-items-list" role="status" aria-label="Loading your bag">
      {ROW_KEYS.map((key) => (
        <li key={key} className="cart-item">
          <span className="skeleton skeleton-line skeleton-short" />
          <span className="skeleton skeleton-line" />
          <span className="skeleton skeleton-field" />
        </li>
      ))}
    </ul>
  )
}

export function OrderSummarySkeleton() {
  return (
    <div className="order-summary" role="status" aria-label="Loading your order">
      <span className="skeleton skeleton-title" />
      {ROW_KEYS.map((key) => (
        <span key={key} className="skeleton skeleton-line" />
      ))}
    </div>
  )
}
