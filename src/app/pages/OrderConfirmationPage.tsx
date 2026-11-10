import { Link } from 'react-router'
import { Icon } from '../../shared/ui/Icon'
import { StatePanel } from '../../shared/ui/StatePanel'

/**
 * Opened directly (not right after placing an order) there is no order to show,
 * so the page says so instead of redirecting or inventing a confirmation.
 */
export function OrderConfirmationPage() {
  return (
    <div className="section">
      <StatePanel
        art={<Icon name="box" size={36} />}
        title="No recent order"
        description="When you place an order, its confirmation will show here."
        heading="h1"
      >
        <Link to="/shop" className="retry-btn">
          Browse the shop
        </Link>
      </StatePanel>
    </div>
  )
}
