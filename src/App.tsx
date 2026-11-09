import { useMemo, useState } from 'react'
import { AnnouncementBar } from './components/AnnouncementBar'
import { CartDrawer } from './components/CartDrawer'
import { CollectionGrid } from './components/CollectionGrid'
import { CraftSection } from './components/CraftSection'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Lookbook } from './components/Lookbook'
import { Newsletter } from './components/Newsletter'
import { ProductList } from './components/ProductList'
import { SearchAndFilter } from './components/SearchAndFilter'
import { Testimonials } from './components/Testimonials'
import { ANNOUNCEMENTS, TESTIMONIALS } from './content'
import { applyFilters, getUniqueCategories } from './logic'
import { useCartState, useProducts } from './state'
import type { FilterState, SortOption } from './types'
import './App.css'

const INITIAL_FILTERS: FilterState = {
  searchQuery: '',
  selectedCategory: 'all',
  sortBy: 'default',
}

function scrollToShop() {
  document.getElementById('shop')?.scrollIntoView()
}

export default function App() {
  const { products, status, errorMessage, reload } = useProducts()
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS)
  const cart = useCartState()

  const categories = useMemo(() => getUniqueCategories(products), [products])
  const filteredProducts = useMemo(() => applyFilters(products, filters), [products, filters])

  function handleResetFilters() {
    setFilters(INITIAL_FILTERS)
  }

  function handleShopAll() {
    handleResetFilters()
    scrollToShop()
  }

  function handleSelectCollection(collection: string) {
    setFilters({ ...INITIAL_FILTERS, selectedCategory: collection })
    scrollToShop()
  }

  function handleOpenSearch() {
    scrollToShop()
    document.getElementById('search-input')?.focus({ preventScroll: true })
  }

  function handleQuantityStep(productId: number, step: number) {
    const item = cart.items.find((entry) => entry.product.id === productId)
    if (item) cart.handleUpdateQuantity(productId, item.quantity + step)
  }

  const collectionActions = { onShopAll: handleShopAll, onSelectCollection: handleSelectCollection }

  return (
    <div id="top" className="app-layout">
      <AnnouncementBar messages={ANNOUNCEMENTS} />
      <Header
        cartCount={cart.totalCount}
        onOpenCart={() => cart.setIsOpen(true)}
        onOpenSearch={handleOpenSearch}
        {...collectionActions}
      />

      <main>
        <Hero onShopAll={handleShopAll} />
        <CollectionGrid onSelectCollection={handleSelectCollection} />

        <section id="shop" className="section" aria-labelledby="shop-title">
          <h2 id="shop-title" className="section-title section-title-left">Featured Pieces</h2>
          <SearchAndFilter
            categories={categories}
            filters={filters}
            onSearchChange={(searchQuery) => setFilters((prev) => ({ ...prev, searchQuery }))}
            onCategoryChange={(selectedCategory) => setFilters((prev) => ({ ...prev, selectedCategory }))}
            onSortChange={(sortBy: SortOption) => setFilters((prev) => ({ ...prev, sortBy }))}
            onResetFilters={handleResetFilters}
            totalResults={filteredProducts.length}
          />
          <ProductList
            products={filteredProducts}
            status={status}
            errorMessage={errorMessage}
            totalCatalogCount={products.length}
            onRetry={reload}
            onAddToCart={cart.handleAddToCart}
            onResetFilters={handleResetFilters}
          />
        </section>

        <CraftSection onShopAll={handleShopAll} />
        <Lookbook onShopAll={handleShopAll} />
        <Testimonials testimonials={TESTIMONIALS} />
        <Newsletter />
      </main>

      <Footer {...collectionActions} />

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
