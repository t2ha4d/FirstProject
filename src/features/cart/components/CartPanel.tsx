import { Link } from 'react-router'
import { useCart } from '../CartContext'
import { CartDrawer } from './CartDrawer'
import { CartLineList } from './CartLineList'
import { CartTotals } from './CartTotals'

export interface CartPanelProps {
  ariaLabel?: string
}

/** The cart drawer wired to the cart state. */
export function CartPanel({ ariaLabel = 'Shopping bag' }: CartPanelProps) {
  const cart = useCart()

  return (
    <CartDrawer
      ariaLabel={ariaLabel}
      isOpen={cart.isOpen}
      totalCount={cart.totalCount}
      onClose={cart.close}
      footer={
        <CartTotals>
          <Link to="/cart" className="view-bag-link" onClick={cart.close}>
            View bag
          </Link>
        </CartTotals>
      }
    >
      <CartLineList />
    </CartDrawer>
  )
}
