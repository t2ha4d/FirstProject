'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Icon } from '../../../shared/ui/Icon'
import { useCart } from '../CartContext'
import { CartView } from './CartView'

/** The slide-in bag: closes on Escape, on the backdrop and when a link inside is followed. */
export function CartPanel() {
  const { isOpen, close, totalCount } = useCart()

  // Listens to the window, an outside system, only while the drawer is open.
  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        close()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, close])

  if (!isOpen) {
    return null
  }

  return (
    <div className="cart-backdrop" onClick={close} role="presentation">
      <aside
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-header">
          <div className="drawer-title-group">
            <h2 className="drawer-title">Your Bag</h2>
            {totalCount > 0 && (
              <span className="drawer-count-badge">
                {totalCount} {totalCount === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={close}
            aria-label="Close shopping bag"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <CartView>
          <Link href="/cart" className="view-bag-link" onClick={close}>
            View bag
          </Link>
        </CartView>
      </aside>
    </div>
  )
}
