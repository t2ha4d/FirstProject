import { Icon } from '../../shared/ui/Icon'
import { BRAND_NAME } from '../../shared/config/brand'
import { COLLECTIONS } from '../../features/products'

export interface HeaderProps {
  cartCount: number
  onOpenCart: () => void
  onOpenSearch: () => void
  onShopAll: () => void
  onSelectCollection: (collection: string) => void
}

export function Header({
  cartCount,
  onOpenCart,
  onOpenSearch,
  onShopAll,
  onSelectCollection,
}: HeaderProps) {
  return (
    <header className="header">
      <div className="header-inner">
        <a className="brand" href="#top" aria-label={`${BRAND_NAME} home`}>
          <span className="brand-mark">
            <Icon name="circle" size={26} />
          </span>
          <span className="brand-name">{BRAND_NAME}</span>
        </a>

        <nav className="header-nav" aria-label="Main navigation">
          <button
            type="button"
            className="nav-link"
            onClick={onShopAll}
            aria-label="Shop all products"
          >
            Shop All
          </button>
          {COLLECTIONS.map(({ name }) => (
            <button
              key={name}
              type="button"
              className="nav-link"
              onClick={() => onSelectCollection(name)}
              aria-label={`Shop ${name}`}
            >
              {name}
            </button>
          ))}
          <a className="nav-link" href="#story">
            Our Story
          </a>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="icon-btn"
            onClick={onOpenSearch}
            aria-label="Search products"
          >
            <Icon name="search" />
          </button>
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
