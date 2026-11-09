import { Icon } from '../shared/ui/Icon'
import { WatchIllustration } from '../shared/ui/WatchIllustration'
import { FOOTER_DESIGN } from '../shared/ui/watchDesigns'
import { BRAND_NAME } from '../shared/config/brand'
import { COLLECTIONS } from '../features/products'

export interface FooterProps {
  onShopAll: () => void
  onSelectCollection: (collection: string) => void
}

const CURRENT_YEAR = new Date().getFullYear()

export function Footer({ onShopAll, onSelectCollection }: FooterProps) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <a className="brand" href="#top" aria-label={`${BRAND_NAME} home`}>
            <span className="brand-mark">
              <Icon name="circle" size={26} />
            </span>
            <span className="brand-name">{BRAND_NAME}</span>
          </a>
          <p className="footer-text">
            Thoughtfully crafted watches that bring warmth, character, and meaning to your time.
          </p>
          <p className="footer-copy">
            © {CURRENT_YEAR} {BRAND_NAME}. All rights reserved.
          </p>
        </div>

        <nav className="footer-column" aria-label="Shop collections">
          <h3 className="footer-heading">Shop</h3>
          <button
            type="button"
            className="footer-link"
            onClick={onShopAll}
            aria-label="Shop all watches"
          >
            All Watches
          </button>
          {COLLECTIONS.map(({ name }) => (
            <button
              key={name}
              type="button"
              className="footer-link"
              onClick={() => onSelectCollection(name)}
              aria-label={`Shop ${name} watches`}
            >
              {name}
            </button>
          ))}
        </nav>

        <nav className="footer-column" aria-label="About WTC">
          <h3 className="footer-heading">About</h3>
          <a className="footer-link" href="#story">
            Our Story
          </a>
          <a className="footer-link" href="#shop">
            Featured Pieces
          </a>
          <a className="footer-link" href="#top">
            Back to Top
          </a>
        </nav>

        <div className="footer-art" aria-hidden="true">
          <WatchIllustration design={FOOTER_DESIGN} className="footer-watch" />
        </div>
      </div>
    </footer>
  )
}
