import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { Icon } from '../../../shared/ui/Icon'

export interface CartDrawerProps {
  isOpen: boolean
  ariaLabel: string
  totalCount: number
  onClose: () => void
  /** The scrolling body of the drawer. */
  children: ReactNode
  /** Shown pinned under the body. */
  footer: ReactNode
}

/** The slide-in dialog frame: title, close button, Escape and backdrop handling. */
export function CartDrawer({
  isOpen,
  ariaLabel,
  totalCount,
  onClose,
  children,
  footer,
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

  return (
    <div className="cart-backdrop" onClick={onClose} role="presentation">
      <aside
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
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
            onClick={onClose}
            aria-label="Close shopping bag"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <div className="drawer-body">{children}</div>
        {footer}
      </aside>
    </div>
  )
}
