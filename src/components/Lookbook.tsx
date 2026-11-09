import { WatchIllustration } from './WatchIllustration'
import { LOOKBOOK } from '../content'

export interface LookbookProps {
  onShopAll: () => void
}

export function Lookbook({ onShopAll }: LookbookProps) {
  return (
    <section className="section" aria-labelledby="lookbook-title">
      <h2 id="lookbook-title" className="section-title">
        Style Your Time
      </h2>
      <div className="lookbook-grid">
        {LOOKBOOK.map(({ id, caption, surface, design }) => (
          <figure key={id} className="lookbook-tile" style={{ background: surface }}>
            <WatchIllustration design={design} className="lookbook-watch" />
            <figcaption className="lookbook-caption">{caption}</figcaption>
          </figure>
        ))}
      </div>
      <div className="section-action">
        <button
          type="button"
          className="btn btn-olive"
          onClick={onShopAll}
          aria-label="Shop the look"
        >
          Shop the Look
        </button>
      </div>
    </section>
  )
}
