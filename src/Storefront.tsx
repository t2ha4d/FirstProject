import { AnnouncementBar } from './components/AnnouncementBar'
import { CraftSection } from './components/CraftSection'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Lookbook } from './components/Lookbook'
import { Newsletter } from './components/Newsletter'
import { Testimonials } from './components/Testimonials'
import { ANNOUNCEMENTS, TESTIMONIALS } from './content'
import { CollectionGrid, ProductsSection, useShopNavigation } from './features/products'
import { CartPanel, useCart } from './features/cart'

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
