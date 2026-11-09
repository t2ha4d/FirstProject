import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { formatPrice } from '../../shared/lib/format'
import type { Product } from '../../shared/types'
import { CartContext } from './CartContext'
import type { CartActions, CartValue } from './CartContext'
import {
  addLine,
  calculateSubtotalCents,
  calculateTotalCount,
  changeLineQuantity,
  pruneLines,
  removeLine,
  resolveCart,
} from './logic'
import { loadCartLines, saveCartLines } from './storage'
import type { CartLine } from './types'

export interface CartProviderProps {
  /** Current product data; the only source of prices. */
  products: Product[]
  /** True once `products` is the loaded catalog. Until then no line is ever dropped. */
  isCatalogReady: boolean
  children: ReactNode
}

/** Owns the bag (`{ id, qty }` lines) and drawer visibility, persisting lines to localStorage. */
export function CartProvider({ products, isCatalogReady, children }: CartProviderProps) {
  const [lines, setLines] = useState<CartLine[]>(loadCartLines)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    saveCartLines(isCatalogReady ? pruneLines(lines, products) : lines)
  }, [lines, products, isCatalogReady])

  const actions = useMemo<CartActions>(
    () => ({
      addItem: (product) => setLines((prev) => addLine(prev, product.id)),
      increment: (productId) => setLines((prev) => changeLineQuantity(prev, productId, 1)),
      decrement: (productId) => setLines((prev) => changeLineQuantity(prev, productId, -1)),
      removeItem: (productId) => setLines((prev) => removeLine(prev, productId)),
      clear: () => setLines([]),
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }),
    [],
  )

  const value = useMemo<CartValue>(() => {
    const items = resolveCart(lines, products)
    const subtotalCents = calculateSubtotalCents(items)
    const countedLines = isCatalogReady ? pruneLines(lines, products) : lines
    return {
      ...actions,
      items,
      isOpen,
      isResolving: !isCatalogReady && lines.length > 0,
      totalCount: calculateTotalCount(countedLines),
      subtotalCents,
      subtotalFormatted: formatPrice(subtotalCents),
    }
  }, [actions, lines, products, isCatalogReady, isOpen])

  return <CartContext value={value}>{children}</CartContext>
}
