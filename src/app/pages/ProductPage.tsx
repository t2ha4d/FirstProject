import { Link, useParams } from 'react-router'
import { ProductDetails } from '../../features/products'

export function ProductPage() {
  const { id } = useParams()

  return (
    <div className="section">
      <Link to="/shop" className="text-link back-link">
        ← Back to the shop
      </Link>
      <ProductDetails id={id} />
    </div>
  )
}
