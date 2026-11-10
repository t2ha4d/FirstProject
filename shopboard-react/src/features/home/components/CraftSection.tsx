import { Link } from 'react-router'
import { Icon } from '../../../shared/ui/Icon'
import { CRAFT_FEATURES, CRAFT_ICONS } from '../content'

export function CraftSection() {
  return (
    <section className="section craft" aria-labelledby="craft-title">
      <div className="craft-media" aria-hidden="true">
        {CRAFT_ICONS.map((icon) => (
          <Icon key={icon} name={icon} size={64} />
        ))}
      </div>

      <div className="craft-copy">
        <p className="eyebrow eyebrow-dark">Built by hand. Made to last.</p>
        <h2 id="craft-title" className="craft-title">
          Made with
          <br />
          intention
        </h2>
        <p className="craft-text">
          Every WTC piece is cut, stitched and finished in small batches by a dedicated team of
          makers. We choose materials that age well, then check each bag, shoe and accessory by hand
          before it leaves our bench.
        </p>
        <Link to="/shop" className="text-link">
          Explore the collection <Icon name="arrow" size={16} />
        </Link>
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
