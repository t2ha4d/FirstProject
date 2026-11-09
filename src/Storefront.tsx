import { AnnouncementBar } from './components/AnnouncementBar'
import { CartDrawer } from './components/CartDrawer'
import { CraftSection } from './components/CraftSection'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Lookbook } from './components/Lookbook'
import { Newsletter } from './components/Newsletter'
import { Testimonials } from './components/Testimonials'
import { ANNOUNCEMENTS, TESTIMONIALS } from './content'
import { CollectionGrid, ProductsSection, useShopNavigation } from './features/products'
import { useCartState } from './state'

/** Page layout. Composes the features; holds no catalog state of its own. */
export function Storefront() {
  const navigation = useShopNavigation()
  const cart = useCartState()

  function handleQuantityStep(productId: number, step: number) {
    const item = cart.items.find((entry) => entry.product.id === productId)
    if (item) cart.handleUpdateQuantity(productId, item.quantity + step)
  }

  return (
    <div id="top" className="app-layout">
      <AnnouncementBar messages={ANNOUNCEMENTS} />
      <Header
        cartCount={cart.totalCount}
        onOpenCart={() => cart.setIsOpen(true)}
        onOpenSearch={navigation.openSearch}
        onShopAll={navigation.showAll}
        onSelectCollection={navigation.showCollection}
      />

      <main>
        <Hero onShopAll={navigation.showAll} />
        <CollectionGrid onSelectCollection={navigation.showCollection} />
        <ProductsSection onAddToCart={cart.handleAddToCart} />
        <CraftSection onShopAll={navigation.showAll} />
        <Lookbook onShopAll={navigation.showAll} />
        <Testimonials testimonials={TESTIMONIALS} />
        <Newsletter />
      </main>

      <Footer onShopAll={navigation.showAll} onSelectCollection={navigation.showCollection} />

      <CartDrawer
        isOpen={cart.isOpen}
        items={cart.items}
        subtotalFormatted={cart.subtotalFormatted}
        totalCount={cart.totalCount}
        onClose={() => cart.setIsOpen(false)}
        onIncrement={(id) => handleQuantityStep(id, 1)}
        onDecrement={(id) => handleQuantityStep(id, -1)}
        onRemove={cart.handleRemoveItem}
        onClear={cart.handleClearCart}
      />
    </div>
  )
}
