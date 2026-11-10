import { Link } from 'react-router'
import { formatPrice } from '../../../shared/lib/format'
import type { Product } from '../../../shared/types'
import { Icon } from '../../../shared/ui/Icon'
import { StatePanel } from '../../../shared/ui/StatePanel'
import { useCatalog } from '../CatalogContext'
import { iconForCategory } from '../collections'
import { findProduct } from '../logic'

export interface ProductDetailsProps {
  /** The raw `:id` route param; anything that is not a known product id shows "not found". */
  id: string | undefined
  onAddToCart: (product: Product) => void
}

export function ProductDetails({ id, onAddToCart }: ProductDetailsProps) {
  const catalog = useCatalog()

  if (catalog.status === 'loading') {
    return (
      <StatePanel
        art={<div className="spinner" aria-hidden="true" />}
        title="Loading the product..."
        description="One moment while we find it."
        heading="p"
        role="status"
      />
    )
  }

  if (catalog.status === 'error') {
    return (
      <StatePanel
        art={<Icon name="alert" size={36} />}
        title="Unable to load the product"
        description={catalog.errorMessage}
        role="alert"
      >
        <button type="button" className="retry-btn" onClick={catalog.reload}>
          Try again
        </button>
      </StatePanel>
    )
  }

  const product = findProduct(catalog.products, id)

  if (product === undefined) {
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
