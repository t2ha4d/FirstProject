import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router'
import { readFilters, shopUrl } from '../../features/products'

export interface ShopLinkProps {
  /** A collection name, or nothing for all products. */
  category?: string
  className: string
  children: ReactNode
}

/**
 * A link to the shop, marked as the current page when the shop shows exactly
 * this collection. NavLink cannot do this because it ignores the search params.
 */
export function ShopLink({ category = 'all', className, children }: ShopLinkProps) {
  const { pathname, search } = useLocation()
  const isCurrent =
    pathname === '/shop' && readFilters(new URLSearchParams(search)).selectedCategory === category

  return (
    <Link
      to={shopUrl(category)}
      className={className}
      aria-current={isCurrent ? 'page' : undefined}
    >
      {children}
    </Link>
  )
}
