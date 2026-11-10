'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import type { ReactNode } from 'react'
import { readFilters, shopUrl } from '../../features/products'

export interface ShopLinkProps {
  /** A collection name, or nothing for all products. */
  category?: string
  className: string
  children: ReactNode
}

/**
 * A link to the shop, marked as the current page when the shop shows exactly this collection.
 * Reading the search params makes the link wait for the browser, so the server renders it
 * as a plain link (the Suspense fallback) and the browser adds `aria-current`.
 */
export function ShopLink({ category = 'all', className, children }: ShopLinkProps) {
  const href = shopUrl(category)

  return (
    <Suspense
      fallback={
        <Link href={href} className={className}>
          {children}
        </Link>
      }
    >
      <CurrentShopLink href={href} category={category} className={className}>
        {children}
      </CurrentShopLink>
    </Suspense>
  )
}

interface CurrentShopLinkProps extends ShopLinkProps {
  href: string
  category: string
}

function CurrentShopLink({ href, category, className, children }: CurrentShopLinkProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isCurrent = pathname === '/shop' && readFilters(searchParams).selectedCategory === category

  return (
    <Link href={href} className={className} aria-current={isCurrent ? 'page' : undefined}>
      {children}
    </Link>
  )
}
