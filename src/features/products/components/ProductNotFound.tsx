import { Link } from 'react-router'
import { Icon } from '../../../shared/ui/Icon'
import { StatePanel } from '../../../shared/ui/StatePanel'

export function ProductNotFound() {
  return (
    <StatePanel
      art={<Icon name="search" size={36} />}
      title="Product not found"
      description="We could not find this product. It may have been removed, or the link is wrong."
      heading="h1"
    >
      <Link to="/shop" className="retry-btn">
        Browse the shop
      </Link>
    </StatePanel>
  )
}
