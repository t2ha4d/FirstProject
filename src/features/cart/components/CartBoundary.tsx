import type { ReactNode } from 'react'
import { retryProducts } from '../../../shared/api/products'
import { AsyncBoundary } from '../../../shared/ui/AsyncBoundary'

export interface CartBoundaryProps {
  /** A skeleton shaped like the content it replaces. */
  fallback: ReactNode
  children: ReactNode
}

/** The data region for anything that prices the bag: loading, then content or "Try again". */
export function CartBoundary({ fallback, children }: CartBoundaryProps) {
  return (
    <AsyncBoundary fallback={fallback} errorTitle="Unable to load your bag" onRetry={retryProducts}>
      {children}
    </AsyncBoundary>
  )
}
