import { useMemo, useState, useEffect } from 'react'
import { fetchProducts } from './api'
import { CartDrawer } from './components/CartDrawer'
import { Header } from './components/Header'
import { ProductList } from './components/ProductList'
import { SearchAndFilter } from './components/SearchAndFilter'
import { applyFilters, getUniqueCategories } from './logic'
import { useCartState } from './state'
import type { ApiStatus, FilterState, Product, SortOption } from './types'
import './App.css'

const INITIAL_FILTERS: FilterState = {
  searchQuery: '',
  selectedCategory: 'all',
  sortBy: 'default',
}

export default function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [status, setStatus] = useState<ApiStatus>('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS)

  const {
    items: cartItems,
    isOpen: isCartOpen,
    setIsOpen: setIsCartOpen,
    totalCount: cartTotalCount,
    subtotalFormatted,
    handleAddToCart,
    handleUpdateQuantity,
    handleRemoveItem,
    handleClearCart,
  } = useCartState()

  // Initial load on mount
  useEffect(() => {
    let ignore = false

    fetchProducts()
      .then((items) => {
        if (!ignore) {
          setProducts(items)
          setStatus('success')
        }
      })
      .catch((error) => {
        if (!ignore) {
          const message = error instanceof Error ? error.message : 'Failed to fetch catalog'
          setErrorMessage(message)
          setStatus('error')
        }
      })

    return () => {
      ignore = true
    }
  }, [])

  // Retry handler for Error / Empty state
  function handleRetry() {
    setStatus('loading')
    setErrorMessage('')
    fetchProducts()
      .then((items) => {
        setProducts(items)
        setStatus('success')
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : 'Failed to fetch catalog'
        setErrorMessage(message)
        setStatus('error')
      })
  }

  // Derive categories and filtered products purely
  const categories = useMemo(() => getUniqueCategories(products), [products])

  const filteredProducts = useMemo(
    () => applyFilters(products, filters),
    [products, filters]
  )

  // Filter actions
  function handleSearchChange(query: string) {
    setFilters((prev) => ({ ...prev, searchQuery: query }))
  }

  function handleCategoryChange(category: string) {
    setFilters((prev) => ({ ...prev, selectedCategory: category }))
  }

  function handleSortChange(sortBy: SortOption) {
    setFilters((prev) => ({ ...prev, sortBy }))
  }

  function handleResetFilters() {
    setFilters(INITIAL_FILTERS)
  }

  return (
    <div className="app-layout">
      <Header
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="main-content">
        <SearchAndFilter
          categories={categories}
          filters={filters}
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
          onSortChange={handleSortChange}
          onResetFilters={handleResetFilters}
          totalResults={filteredProducts.length}
        />

        <ProductList
          products={filteredProducts}
          status={status}
          errorMessage={errorMessage}
          totalCatalogCount={products.length}
          onRetry={handleRetry}
          onAddToCart={handleAddToCart}
          onResetFilters={handleResetFilters}
        />
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        items={cartItems}
        subtotalFormatted={subtotalFormatted}
        totalCount={cartTotalCount}
        onClose={() => setIsCartOpen(false)}
        onIncrement={(id) => {
          const item = cartItems.find((i) => i.product.id === id)
          if (item) handleUpdateQuantity(id, item.quantity + 1)
        }}
        onDecrement={(id) => {
          const item = cartItems.find((i) => i.product.id === id)
          if (item) handleUpdateQuantity(id, item.quantity - 1)
        }}
        onRemove={handleRemoveItem}
        onClear={handleClearCart}
      />
    </div>
  )
}
