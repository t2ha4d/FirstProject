'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

export interface NavLinkProps {
  href: string
  className: string
  'aria-label'?: string
  children: ReactNode
}

/** A link that is marked as the current page when its path is the open one. */
export function NavLink({ href, className, 'aria-label': ariaLabel, children }: NavLinkProps) {
  const isCurrent = usePathname() === href

  return (
    <Link
      href={href}
      className={className}
      aria-label={ariaLabel}
      aria-current={isCurrent ? 'page' : undefined}
    >
      {children}
    </Link>
  )
}
