import { Link } from 'react-router'
import { Icon } from '../../shared/ui/Icon'
import { StatePanel } from '../../shared/ui/StatePanel'

export function NotFoundPage() {
  return (
    <div className="section">
      <StatePanel
        art={<Icon name="search" size={36} />}
        title="Page not found"
        description="The page you are looking for does not exist or has moved."
        heading="h1"
      >
        <div className="state-actions">
          <Link to="/" className="retry-btn">
            Go home
          </Link>
          <Link to="/shop" className="retry-btn">
            Browse the shop
          </Link>
        </div>
      </StatePanel>
    </div>
  )
}
