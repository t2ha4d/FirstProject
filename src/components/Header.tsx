export interface HeaderProps {
  cartCount: number
  onOpenCart: () => void
}

export function Header({ cartCount, onOpenCart }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-brand">
        <div className="header-logo" aria-hidden="true">🛍️</div>
        <div>
          <h1 className="header-title">ShopBoard</h1>
          <p className="header-tagline">Curated goods & everyday essentials</p>
        </div>
      </div>
      <nav className="header-nav">
        <button
          type="button"
          className="cart-button"
          onClick={onOpenCart}
          aria-label={`Open shopping cart containing ${cartCount} items`}
        >
          <span className="cart-icon" aria-hidden="true">🛒</span>
          <span className="cart-label">Cart</span>
          {cartCount > 0 && (
            <span className="cart-badge" aria-hidden="true">
              {cartCount}
            </span>
          )}
        </button>
      </nav>
    </header>
  )
}

