import { useEffect } from 'react'
import { CartItem } from './CartItem'
import type { CartItem as CartItemType } from '../types'

export interface CartDrawerProps {
  isOpen: boolean
  items: CartItemType[]
  subtotalFormatted: string
  totalCount: number
  onClose: () => void
  onIncrement: (productId: number) => void
  onDecrement: (productId: number) => void
  onRemove: (productId: number) => void
  onClear: () => void
}

export function CartDrawer({
  isOpen,
  items,
  subtotalFormatted,
  totalCount,
  onClose,
  onIncrement,
  onDecrement,
  onRemove,
  onClear,
}: CartDrawerProps) {
  // Close drawer on Escape key press
  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  const hasItems = items.length > 0

  return (
    <div className="cart-backdrop" onClick={onClose} role="presentation">
      <aside
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart Drawer"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-header">
          <div className="drawer-title-group">
            <h2 className="drawer-title">Shopping Cart</h2>
            {totalCount > 0 && (
              <span className="drawer-count-badge">
                {totalCount} {totalCount === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Close shopping cart"
          >
            ✕
          </button>
        </div>

        <div className="drawer-body">
          {hasItems ? (
            <ul className="cart-items-list" aria-label="Cart items">
              {items.map((item) => (
                <CartItem
                  key={item.product.id}
                  item={item}
                  onIncrement={onIncrement}
                  onDecrement={onDecrement}
                  onRemove={onRemove}
                />
              ))}
            </ul>
          ) : (
            <div className="empty-cart-state">
              <span className="empty-cart-icon" aria-hidden="true">🛒</span>
              <p className="empty-cart-title">Your cart is empty</p>
              <p className="empty-cart-text">Explore our collection and add some items to your bag.</p>
              <button
                type="button"
                className="continue-shopping-btn"
                onClick={onClose}
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>

        {hasItems && (
          <div className="drawer-footer">
            <div className="subtotal-row">
              <span className="subtotal-label">Subtotal</span>
              <span className="subtotal-amount">{subtotalFormatted}</span>
            </div>
            <p className="subtotal-note">Taxes and shipping calculated at checkout.</p>
            <div className="drawer-actions">
              <button
                type="button"
                className="checkout-btn"
                onClick={() => alert('Proceeding to checkout with ' + totalCount + ' items totaling ' + subtotalFormatted)}
              >
                Checkout ({subtotalFormatted})
              </button>
              <button
                type="button"
                className="clear-cart-btn"
                onClick={onClear}
              >
                Empty Cart
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  )
}

