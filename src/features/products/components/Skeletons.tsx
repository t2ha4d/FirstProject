/** Loading placeholders shaped like the shop and product page, so nothing jumps when data arrives. */

const CARD_COUNT = 12
const CARD_KEYS = Array.from({ length: CARD_COUNT }, (_, i) => `card-${i}`)

export function ShopSkeleton() {
  return (
    <div role="status" aria-label="Loading the collection">
      <div className="search-filter-section">
        <div className="search-filter-grid">
          {['search', 'category', 'sort'].map((key) => (
            <div key={key} className="filter-group">
              <span className="skeleton skeleton-label" />
              <span className="skeleton skeleton-field" />
            </div>
          ))}
        </div>
        <div className="filter-status-bar">
          <span className="skeleton skeleton-line skeleton-short" />
        </div>
      </div>
      <div className="products-grid">
        {CARD_KEYS.map((key) => (
          <div key={key} className="product-card">
            <div className="card-media skeleton" />
            <div className="card-body">
              <span className="skeleton skeleton-line" />
              <span className="skeleton skeleton-line skeleton-short" />
              <span className="skeleton skeleton-line skeleton-short" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ProductDetailsSkeleton() {
  return (
    <div className="product-detail" role="status" aria-label="Loading the product">
      <div className="card-media product-detail-media skeleton" />
      <div className="product-detail-info">
        <span className="skeleton skeleton-line skeleton-short" />
        <span className="skeleton skeleton-title" />
        <span className="skeleton skeleton-line skeleton-short" />
        <span className="skeleton skeleton-line" />
        <span className="skeleton skeleton-button" />
      </div>
    </div>
  )
}
