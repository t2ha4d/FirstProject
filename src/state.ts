import { useEffect, useState } from 'react'
import { fetchProducts } from './api'
import { calculateSubtotalCents, calculateTotalCount, formatPrice } from './logic'
import type { ApiStatus, CartItem, Product } from './types'

export const CART_STORAGE_KEY = 'wtc_cart_items_v1'

/**
 * Loads cart from localStorage safely
 */
export function loadCartFromStorage(): CartItem[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return []
  }
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item): item is CartItem =>
        Boolean(item && item.product && typeof item.product.id === 'number' && typeof item.quantity === 'number' && item.quantity > 0)
    )
  } catch {
    return []
  }
}

/**
 * Persists cart to localStorage safely
 */
export function saveCartToStorage(items: CartItem[]): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return
  }
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch {
    // Gracefully handle storage quota or privacy mode errors
  }
}

/**
 * Pure state reducer: adds a product to cart or increments quantity
 */
export function addItemToCart(cart: CartItem[], product: Product): CartItem[] {
  const existing = cart.find((item) => item.product.id === product.id)
  if (existing) {
    return cart.map((item) =>
      item.product.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    )
  }
  return [...cart, { product, quantity: 1 }]
}

/**
 * Pure state reducer: updates item quantity or removes if quantity <= 0
 */
export function updateItemQuantity(cart: CartItem[], productId: number, quantity: number): CartItem[] {
  if (quantity <= 0) {
    return removeItemFromCart(cart, productId)
  }
  return cart.map((item) =>
    item.product.id === productId ? { ...item, quantity } : item
  )
}

/**
 * Pure state reducer: removes item by product id
 */
export function removeItemFromCart(cart: CartItem[], productId: number): CartItem[] {
  return cart.filter((item) => item.product.id !== productId)
}

/**
 * React hook for managing cart state with automatic localStorage persistence
 */
export function useCartState() {
  const [items, setItems] = useState<CartItem[]>(() => loadCartFromStorage())
  const [isOpen, setIsOpen] = useState(false)

  // Persist cart items whenever they change
  useEffect(() => {
    saveCartToStorage(items)
  }, [items])

  function handleAddToCart(product: Product) {
    setItems((prev) => addItemToCart(prev, product))
  }

  function handleUpdateQuantity(productId: number, quantity: number) {
    setItems((prev) => updateItemQuantity(prev, productId, quantity))
  }

  function handleRemoveItem(productId: number) {
    setItems((prev) => removeItemFromCart(prev, productId))
  }

  function handleClearCart() {
    setItems([])
  }

  const totalCount = calculateTotalCount(items)
  const subtotalCents = calculateSubtotalCents(items)
  const subtotalFormatted = formatPrice(subtotalCents)

  return {
    items,
    isOpen,
    setIsOpen,
    totalCount,
    subtotalCents,
    subtotalFormatted,
    handleAddToCart,
    handleUpdateQuantity,
    handleRemoveItem,
    handleClearCart,
  }
}


/**
 * React hook for loading the catalog, with Loading / Error / Success states and retry
 */
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [status, setStatus] = useState<ApiStatus>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [reloadCount, setReloadCount] = useState(0)

  useEffect(() => {
    let ignore = false

    fetchProducts()
      .then((items) => {
        if (ignore) return
        setProducts(items)
        setStatus('success')
      })
      .catch((error) => {
        if (ignore) return
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load the collection')
        setStatus('error')
      })

    return () => {
      ignore = true
    }
  }, [reloadCount])

  function reload() {
    setStatus('loading')
    setErrorMessage('')
    setReloadCount((count) => count + 1)
  }

  return { products, status, errorMessage, reload }
}
