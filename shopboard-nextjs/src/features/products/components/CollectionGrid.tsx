import Link from 'next/link'
import { Icon } from '../../../shared/ui/Icon'
import { COLLECTIONS } from '../collections'
import { shopUrl } from '../logic'

export function CollectionGrid() {
  return (
    <section className="section" aria-labelledby="collections-title">
      <h2 id="collections-title" className="section-title">
        Shop by Collection
      </h2>
      <div className="collection-grid">
        {COLLECTIONS.map(({ name, icon }) => (
          <Link key={name} href={shopUrl(name)} className="collection-tile">
            <span className="collection-label">
              <Icon name={icon} size={30} />
              {name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
