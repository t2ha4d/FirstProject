import { Icon } from './Icon'
import { WatchIllustration } from './WatchIllustration'
import { COLLECTION_DESIGNS } from '../catalog'
import { COLLECTIONS } from '../content'

export interface CollectionGridProps {
  onSelectCollection: (collection: string) => void
}

export function CollectionGrid({ onSelectCollection }: CollectionGridProps) {
  return (
    <section className="section" aria-labelledby="collections-title">
      <h2 id="collections-title" className="section-title">Shop by Collection</h2>
      <div className="collection-grid">
        {COLLECTIONS.map(({ name, icon }) => (
          <button
            key={name}
            type="button"
            className="collection-tile"
            onClick={() => onSelectCollection(name)}
            aria-label={`Shop the ${name} collection`}
          >
            <WatchIllustration design={COLLECTION_DESIGNS[name]} className="collection-watch" />
            <span className="collection-label">
              <Icon name={icon} size={30} />
              {name}
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
