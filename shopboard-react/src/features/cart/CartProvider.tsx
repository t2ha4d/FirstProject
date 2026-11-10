import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { CartContext } from './CartContext'
import type { CartActions, CartValue } from './CartContext'
import { addLine, calculateTotalCount, changeLineQuantity, removeLine } from './logic'
import { loadCartLines, saveCartLines } from './storage'
import type { CartLine } from './types'

export interface CartProviderProps {
  children: ReactNode
}

/** The single owner of the bag (`{ id, qty }` lines) and the drawer, saving lines to localStorage. */
export function CartProvider({ children }: CartProviderProps) {
  const [lines, setLines] = useState<CartLine[]>(loadCartLines)
  const [isOpen, setIsOpen] = useState(false)

  // Mirrors the lines to localStorage, an outside system. Every line is saved, including
  // lines whose product is missing from the catalog, so a failed or empty list never empties the bag.
  useEffect(() => {
    saveCartLines(lines)
  }, [lines])

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

  const value = useMemo<CartValue>(
    () => ({ ...actions, lines, isOpen, totalCount: calculateTotalCount(lines) }),
    [actions, lines, isOpen],
  )

  return <CartContext value={value}>{children}</CartContext>
}
