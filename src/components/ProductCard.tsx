import { useState } from 'react'
import { formatPrice } from '../logic'
import type { Product } from '../types'

export interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isSaved, setIsSaved] = useState(false)
  const isAvailable = product.in_stock

  return (
    <article className={`product-card ${!isAvailable ? 'sold-out' : ''}`}>
      <div className="card-top">
        <span className="category-pill">{product.category_name}</span>
        <button
          type="button"
          className={`favorite-btn ${isSaved ? 'favorited' : ''}`}
          onClick={() => setIsSaved(!isSaved)}
          aria-pressed={isSaved}
          aria-label={isSaved ? `Remove ${product.title} from favorites` : `Save ${product.title} to favorites`}
        >
          {isSaved ? '♥' : '♡'}
        </button>
      </div>

      <div className="card-body">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-price">{formatPrice(product.price_cents)}</p>

        <div className="stock-status">
          {isAvailable ? (
            <span className="stock-badge in-stock">● In stock</span>
          ) : (
            <span className="stock-badge out-of-stock">○ Sold out</span>
          )}
        </div>
      </div>

      <div className="card-actions">
        <button
          type="button"
          className="add-to-cart-btn"
          disabled={!isAvailable}
          onClick={() => onAddToCart(product)}
          aria-label={isAvailable ? `Add ${product.title} to cart` : `${product.title} is sold out`}
        >
          {isAvailable ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </article>
  )
}

