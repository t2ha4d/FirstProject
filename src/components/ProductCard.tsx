import { useState } from 'react'
import { Icon } from '../shared/ui/Icon'
import { WatchIllustration } from '../shared/ui/WatchIllustration'
import { formatPrice } from '../shared/lib/format'
import type { Product } from '../shared/types'

export interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isSaved, setIsSaved] = useState(false)
  const isAvailable = product.in_stock

  return (
    <article className={`product-card ${!isAvailable ? 'sold-out' : ''}`}>
      <div className="card-media">
        <WatchIllustration
          design={product.design}
          label={`${product.title}, ${product.subtitle}`}
          className="card-watch"
        />
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
        <h3 className="product-title">{product.title}</h3>
        <p className="product-subtitle">{product.subtitle}</p>
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
