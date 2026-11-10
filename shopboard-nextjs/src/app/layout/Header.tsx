'use client'

import Link from 'next/link'
import { Icon } from '../../shared/ui/Icon'
import { BRAND_NAME } from '../../shared/config/brand'
import { useCart } from '../../features/cart'
import { COLLECTIONS } from '../../features/products'
import { NavLink } from './NavLink'
import { ShopLink } from './ShopLink'

export function Header() {
  const { totalCount: cartCount, open: onOpenCart } = useCart()

  return (
    <header className="header">
      <div className="header-inner">
        <NavLink href="/" className="brand" aria-label={`${BRAND_NAME} home`}>
          <span className="brand-mark">
            <Icon name="circle" size={26} />
          </span>
          <span className="brand-name">{BRAND_NAME}</span>
        </NavLink>

        <nav className="header-nav" aria-label="Main navigation">
          <ShopLink className="nav-link">Shop All</ShopLink>
          {COLLECTIONS.map(({ name }) => (
            <ShopLink key={name} category={name} className="nav-link">
              {name}
            </ShopLink>
          ))}
        </nav>

        <div className="header-actions">
          <Link href="/shop" className="icon-btn" aria-label="Search products">
            <Icon name="search" />
          </Link>
          <button
            type="button"
            className="icon-btn"
            onClick={onOpenCart}
            aria-label={`Open shopping bag containing ${cartCount} items`}
          >
            <Icon name="bag" />
            {cartCount > 0 && (
              <span className="cart-badge" aria-hidden="true">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
