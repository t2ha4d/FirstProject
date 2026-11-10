import { use } from 'react'
import { loadProduct } from '../../../shared/api/products'
import { formatPrice } from '../../../shared/lib/format'
import { Icon } from '../../../shared/ui/Icon'
import { useAddToCart } from '../AddToCartContext'
import { iconForCategory } from '../collections'
import { ProductNotFound } from './ProductNotFound'

export interface ProductInfoProps {
  id: number
}

/** One product, fetched by id. Suspends while it loads. */
export function ProductInfo({ id }: ProductInfoProps) {
  const product = use(loadProduct(id))
  const onAddToCart = useAddToCart()

  if (product === null) {
    return <ProductNotFound />
  }

  return (
    <article className={`product-detail ${!product.in_stock ? 'sold-out' : ''}`}>
      <div className="card-media product-detail-media">
        <span className="card-art">
          <Icon name={iconForCategory(product.category_name)} size={160} />
        </span>
        {!product.in_stock && <span className="sold-out-tag">Sold out</span>}
      </div>

      <div className="product-detail-info">
        <p className="eyebrow eyebrow-dark">{product.category_name}</p>
        <h1 className="product-detail-title">{product.title}</h1>
        <p className="product-detail-price">{formatPrice(product.price_cents)}</p>
        <p className="product-detail-stock">
          {product.in_stock ? 'In stock, ready to ship' : 'Currently sold out'}
        </p>
        <button
          type="button"
          className="btn btn-clay"
          disabled={!product.in_stock}
          onClick={() => onAddToCart(product)}
          aria-label={
            product.in_stock ? `Add ${product.title} to bag` : `${product.title} is sold out`
          }
        >
          {product.in_stock ? 'Add to Bag' : 'Sold Out'}
        </button>
      </div>
    </article>
  )
}
