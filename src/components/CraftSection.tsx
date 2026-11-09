import { Icon } from './Icon'
import { MovementIllustration } from './MovementIllustration'
import { CRAFT_FEATURES } from '../content'

export interface CraftSectionProps {
  onShopAll: () => void
}

export function CraftSection({ onShopAll }: CraftSectionProps) {
  return (
    <section id="story" className="section craft" aria-labelledby="craft-title">
      <div className="craft-media">
        <MovementIllustration label="Exposed mechanical watch movement with turning brass wheels" />
      </div>

      <div className="craft-copy">
        <p className="eyebrow eyebrow-dark">Built by hand. Made to last.</p>
        <h2 id="craft-title" className="craft-title">
          The art of
          <br />
          watchmaking
        </h2>
        <p className="craft-text">
          Every WTC timepiece is assembled and regulated in small batches by a dedicated team of
          watchmakers. We pair proven movements with enduring materials, then check each watch by
          hand before it leaves our bench.
        </p>
        <button
          type="button"
          className="text-link"
          onClick={onShopAll}
          aria-label="Explore the collection"
        >
          Explore the collection <Icon name="arrow" size={16} />
        </button>
      </div>

      <ul className="craft-features">
        {CRAFT_FEATURES.map(({ icon, lines }) => (
          <li key={lines[0]} className="craft-feature">
            <Icon name={icon} size={36} />
            <span>
              {lines[0]}
              <br />
              {lines[1]}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
