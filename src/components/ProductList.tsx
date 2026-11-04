import { ProductCard } from './ProductCard'
import type { ApiStatus, Product } from '../types'

export interface ProductListProps {
  products: Product[]
  status: ApiStatus
  errorMessage?: string
  totalCatalogCount: number
  onRetry: () => void
  onAddToCart: (product: Product) => void
  onResetFilters: () => void
}

export function ProductList({
  products,
  status,
  errorMessage,
  totalCatalogCount,
  onRetry,
  onAddToCart,
  onResetFilters,
}: ProductListProps) {
  // 1. Loading UI
  if (status === 'loading') {
    return (
      <div className="product-list-state loading-state" role="status" aria-live="polite">
        <div className="spinner" aria-hidden="true"></div>
        <p className="state-title">Loading catalog...</p>
        <p className="state-description">Fetching current stock from ShopBoard API</p>
      </div>
    )
  }

  // 2. Error UI with "Try again" button
  if (status === 'error') {
    return (
      <div className="product-list-state error-state" role="alert">
        <div className="state-icon" aria-hidden="true">⚠️</div>
        <h3 className="state-title">Unable to load products</h3>
        <p className="state-description">
          {errorMessage || 'There was a problem reaching the product service.'}
        </p>
        <button type="button" className="retry-btn" onClick={onRetry}>
          Try again
        </button>
      </div>
    )
  }

  // 3. Empty state: Catalog itself has no products
  if (status === 'success' && totalCatalogCount === 0) {
    return (
      <div className="product-list-state empty-state">
        <div className="state-icon" aria-hidden="true">📦</div>
        <h3 className="state-title">No products available</h3>
        <p className="state-description">The store catalog is currently empty. Please check back later.</p>
        <button type="button" className="retry-btn" onClick={onRetry}>
          Refresh Catalog
        </button>
      </div>
    )
  }

  // 4. No Match message: Filter/Search returned 0 results
  if (status === 'success' && products.length === 0) {
    return (
      <div className="product-list-state no-match-state">
        <div className="state-icon" aria-hidden="true">🔍</div>
        <h3 className="state-title">No matching products found</h3>
        <p className="state-description">Try adjusting your search query, selecting another category, or resetting filters.</p>
        <button type="button" className="retry-btn" onClick={onResetFilters}>
          Clear all filters
        </button>
      </div>
    )
  }

  // 5. Success state: Grid of products using real unique product.id as key
  return (
    <div className="products-grid" role="region" aria-label="Products catalog">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  )
}

