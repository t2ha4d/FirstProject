import { Icon } from '../../../shared/ui/Icon'
import { WatchIllustration } from '../../../shared/ui/WatchIllustration'
import { COLLECTIONS } from '../collections'

export interface CollectionGridProps {
  onSelectCollection: (collection: string) => void
}

export function CollectionGrid({ onSelectCollection }: CollectionGridProps) {
  return (
    <section className="section" aria-labelledby="collections-title">
      <h2 id="collections-title" className="section-title">
        Shop by Collection
      </h2>
      <div className="collection-grid">
        {COLLECTIONS.map(({ name, icon, design }) => (
          <button
            key={name}
            type="button"
            className="collection-tile"
            onClick={() => onSelectCollection(name)}
            aria-label={`Shop the ${name} collection`}
          >
            <WatchIllustration design={design} className="collection-watch" />
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
