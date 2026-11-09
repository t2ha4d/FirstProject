import { AnnouncementBar } from './layout/AnnouncementBar'
import { Footer } from './layout/Footer'
import { Header } from './layout/Header'
import {
  ANNOUNCEMENTS,
  CraftSection,
  Hero,
  Lookbook,
  Newsletter,
  TESTIMONIALS,
  Testimonials,
} from '../features/home'
import { CollectionGrid, ProductsSection, useShopNavigation } from '../features/products'
import { CartPanel, useCart } from '../features/cart'

/** Page layout. Composes the features; holds no state of its own. */
export function Storefront() {
  const navigation = useShopNavigation()
  const cart = useCart()

  return (
    <div id="top" className="app-layout">
      <AnnouncementBar messages={ANNOUNCEMENTS} />
      <Header
        cartCount={cart.totalCount}
        onOpenCart={cart.open}
        onOpenSearch={navigation.openSearch}
        onShopAll={navigation.showAll}
        onSelectCollection={navigation.showCollection}
      />

      <main>
        <Hero onShopAll={navigation.showAll} />
        <CollectionGrid onSelectCollection={navigation.showCollection} />
        <ProductsSection onAddToCart={cart.addItem} />
        <CraftSection onShopAll={navigation.showAll} />
        <Lookbook onShopAll={navigation.showAll} />
        <Testimonials testimonials={TESTIMONIALS} />
        <Newsletter />
      </main>

      <Footer onShopAll={navigation.showAll} onSelectCollection={navigation.showCollection} />

      <CartPanel />
    </div>
  )
}
