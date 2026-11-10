import { Link, useParams } from 'react-router'
import { useCart } from '../../features/cart'
import { ProductDetails } from '../../features/products'

export function ProductPage() {
  const { id } = useParams()
  const cart = useCart()

  return (
    <div className="section">
      <Link to="/shop" className="text-link back-link">
        ← Back to the shop
      </Link>
      <ProductDetails id={id} onAddToCart={cart.addItem} />
    </div>
  )
}
