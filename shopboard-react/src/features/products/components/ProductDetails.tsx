'use client'

import { retryProduct } from '../../../shared/api/products'
import { AsyncBoundary } from '../../../shared/ui/AsyncBoundary'
import { parseProductId } from '../logic'
import { ProductInfo } from './ProductInfo'
import { ProductNotFound } from './ProductNotFound'
import { ProductDetailsSkeleton } from './Skeletons'

export interface ProductDetailsProps {
  /** The raw `[id]` route param. */
  id: string
}

/** The product page body. An id that is not a valid number never reaches the API. */
export function ProductDetails({ id }: ProductDetailsProps) {
  const productId = parseProductId(id)

  if (productId === null) {
    return <ProductNotFound />
  }

  // Keyed by id: opening another product starts with a fresh boundary and skeleton.
  return (
    <AsyncBoundary
      key={productId}
      fallback={<ProductDetailsSkeleton />}
      errorTitle="Unable to load the product"
      onRetry={() => retryProduct(productId)}
    >
      <ProductInfo id={productId} />
    </AsyncBoundary>
  )
}
