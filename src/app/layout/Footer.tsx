import { NavLink } from 'react-router'
import { Icon } from '../../shared/ui/Icon'
import { BRAND_NAME } from '../../shared/config/brand'
import { COLLECTIONS } from '../../features/products'
import { ShopLink } from './ShopLink'

const CURRENT_YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <NavLink to="/" end className="brand" aria-label={`${BRAND_NAME} home`}>
            <span className="brand-mark">
              <Icon name="circle" size={26} />
            </span>
            <span className="brand-name">{BRAND_NAME}</span>
          </NavLink>
          <p className="footer-text">
            Thoughtfully crafted pieces that bring warmth, character, and meaning to your everyday.
          </p>
          <p className="footer-copy">
            © {CURRENT_YEAR} {BRAND_NAME}. All rights reserved.
          </p>
        </div>

        <nav className="footer-column" aria-label="Shop collections">
          <h3 className="footer-heading">Shop</h3>
          <ShopLink className="footer-link">All Products</ShopLink>
          {COLLECTIONS.map(({ name }) => (
            <ShopLink key={name} category={name} className="footer-link">
              {name}
            </ShopLink>
          ))}
        </nav>

        <nav className="footer-column" aria-label="Explore WTC">
          <h3 className="footer-heading">Explore</h3>
          <NavLink to="/" end className="footer-link">
            Home
          </NavLink>
          <NavLink to="/cart" className="footer-link">
            Your Bag
          </NavLink>
        </nav>
      </div>
    </footer>
  )
}
