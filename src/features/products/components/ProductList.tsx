import { Icon } from '../../../shared/ui/Icon'
import { StatePanel } from '../../../shared/ui/StatePanel'
import type { Product } from '../../../shared/types'
import { ProductCard } from './ProductCard'

export interface ProductListProps {
  products: Product[]
  totalCatalogCount: number
  onResetFilters: () => void
}

export function ProductList({ products, totalCatalogCount, onResetFilters }: ProductListProps) {
  if (totalCatalogCount === 0) {
    return (
      <StatePanel
        art={<Icon name="box" size={36} />}
        title="No products available"
        description="The collection is currently empty. Please check back soon."
      />
    )
  }

  if (products.length === 0) {
    return (
      <StatePanel
        art={<Icon name="search" size={36} />}
        title="No matching products found"
        description="Try a different search, choose another collection, or clear your filters."
      >
        <button type="button" className="retry-btn" onClick={onResetFilters}>
          Clear all filters
        </button>
      </StatePanel>
    )
  }

  // Keyed by the real product id, so card state follows the product when the list is re-sorted.
  return (
    <div className="products-grid" role="region" aria-label="Product collection">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
