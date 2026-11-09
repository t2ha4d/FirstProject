import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { formatPrice } from '../../shared/lib/format'
import { CartContext } from './CartContext'
import type { CartActions, CartValue } from './CartContext'
import {
  addItemToCart,
  calculateSubtotalCents,
  calculateTotalCount,
  changeItemQuantity,
  removeItemFromCart,
} from './logic'
import { loadCartFromStorage, saveCartToStorage } from './storage'
import type { CartEntry } from './types'

export interface CartProviderProps {
  children: ReactNode
}

/** Owns the bag contents and drawer visibility, persisting the bag to localStorage. */
export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartEntry[]>(loadCartFromStorage)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    saveCartToStorage(items)
  }, [items])

  const actions = useMemo<CartActions>(
    () => ({
      addItem: (product) => setItems((prev) => addItemToCart(prev, product)),
      increment: (productId) => setItems((prev) => changeItemQuantity(prev, productId, 1)),
      decrement: (productId) => setItems((prev) => changeItemQuantity(prev, productId, -1)),
      removeItem: (productId) => setItems((prev) => removeItemFromCart(prev, productId)),
      clear: () => setItems([]),
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }),
    [],
  )

  const value = useMemo<CartValue>(() => {
    const subtotalCents = calculateSubtotalCents(items)
    return {
      ...actions,
      items,
      isOpen,
      totalCount: calculateTotalCount(items),
      subtotalCents,
      subtotalFormatted: formatPrice(subtotalCents),
    }
  }, [actions, items, isOpen])

  return <CartContext value={value}>{children}</CartContext>
}
