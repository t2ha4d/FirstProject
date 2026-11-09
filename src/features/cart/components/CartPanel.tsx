import { useCart } from '../CartContext'
import { CartDrawer } from './CartDrawer'

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
      isResolving={cart.isResolving}
      items={cart.items}
      subtotalFormatted={cart.subtotalFormatted}
      totalCount={cart.totalCount}
      onClose={cart.close}
      onIncrement={cart.increment}
      onDecrement={cart.decrement}
      onRemove={cart.removeItem}
      onClear={cart.clear}
    />
  )
}
