import { useState } from 'react'
import { Link } from 'react-router'
import { Icon } from '../../../shared/ui/Icon'
import { formatPrice } from '../../../shared/lib/format'
import type { Product } from '../../../shared/types'
import { useAddToCart } from '../AddToCartContext'
import { iconForCategory } from '../collections'

export interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const onAddToCart = useAddToCart()
  const [isSaved, setIsSaved] = useState(false)
  const isAvailable = product.in_stock

  return (
    <article className={`product-card ${!isAvailable ? 'sold-out' : ''}`}>
      <div className="card-media">
        <span className="card-art">
          <Icon name={iconForCategory(product.category_name)} size={84} />
        </span>
        {!isAvailable && <span className="sold-out-tag">Sold out</span>}
        <button
          type="button"
          className={`favorite-btn ${isSaved ? 'favorited' : ''}`}
          onClick={() => setIsSaved(!isSaved)}
          aria-pressed={isSaved}
          aria-label={
            isSaved
              ? `Remove ${product.title} from favorites`
              : `Save ${product.title} to favorites`
          }
        >
          <Icon name={isSaved ? 'heart-filled' : 'heart'} size={19} />
        </button>
      </div>

      <div className="card-body">
        <h3 className="product-title">
          <Link to={`/products/${product.id}`} className="product-link">
            {product.title}
          </Link>
        </h3>
        <p className="product-subtitle">{product.category_name}</p>
        <p className="product-price">{formatPrice(product.price_cents)}</p>
        <button
          type="button"
          className="add-to-cart-btn"
          disabled={!isAvailable}
          onClick={() => onAddToCart(product)}
          aria-label={isAvailable ? `Add ${product.title} to bag` : `${product.title} is sold out`}
        >
          {isAvailable ? 'Add to Bag' : 'Sold Out'}
        </button>
      </div>
    </article>
  )
}
