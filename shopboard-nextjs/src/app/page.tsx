import { CraftSection, Hero, Newsletter, TESTIMONIALS, Testimonials } from '../features/home'
import { CollectionGrid } from '../features/products'

export default function HomePage() {
  return (
    <>
      <Hero />
      <CollectionGrid />
      <CraftSection />
      <Testimonials testimonials={TESTIMONIALS} />
      <Newsletter />
    </>
  )
}
