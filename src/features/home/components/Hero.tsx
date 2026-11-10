import { Sprig } from './Sprig'
import { HeroWatch } from './HeroWatch'

export interface HeroProps {
  onShopAll: () => void
}

export function Hero({ onShopAll }: HeroProps) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">Crafted. Timeless. Yours.</p>
        <h1 id="hero-title" className="hero-title">
          Every moment
          <br />
          worth wearing.
        </h1>
        <p className="hero-text">
          Thoughtfully designed bags, shoes and accessories in honest materials, made for your
          everyday.
        </p>
        <button
          type="button"
          className="btn btn-clay"
          onClick={onShopAll}
          aria-label="Shop the collection"
        >
          Shop the Collection
        </button>
      </div>

      <div className="hero-scene" aria-hidden="true">
        <span className="hero-arch" />
        <Sprig className="hero-sprig" />
        <HeroWatch className="hero-watch" />
      </div>
    </section>
  )
}
