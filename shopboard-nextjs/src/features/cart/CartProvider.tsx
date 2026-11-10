'use client'

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

const NO_LINES: CartLine[] = []

/**
 * The single owner of the bag (`{ id, qty }` lines) and the drawer, saving lines to localStorage.
 * The server and the first browser render both see "not read yet" (`null`), so they match;
 * the saved bag is read once right after hydration.
 */
export function CartProvider({ children }: CartProviderProps) {
  const [storedLines, setStoredLines] = useState<CartLine[] | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  // Reads localStorage, an outside system that only exists in the browser. It cannot happen
  // during render: the server has no localStorage, and reading it there would not match the server's HTML.
  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    setStoredLines(loadCartLines())
  }, [])

  // Mirrors the lines to localStorage. It waits for the first read, so the empty first render
  // can never overwrite the saved bag. Every line is saved, including lines whose product is
  // missing from the catalog, so a failed or empty list never empties the bag.
  useEffect(() => {
    if (storedLines !== null) saveCartLines(storedLines)
  }, [storedLines])

  const actions = useMemo<CartActions>(() => {
    // Changes made before the saved bag was read are ignored instead of replacing it.
    const update = (change: (lines: CartLine[]) => CartLine[]) =>
      setStoredLines((prev) => (prev === null ? prev : change(prev)))

    return {
      addItem: (product) => update((prev) => addLine(prev, product.id)),
      increment: (productId) => update((prev) => changeLineQuantity(prev, productId, 1)),
      decrement: (productId) => update((prev) => changeLineQuantity(prev, productId, -1)),
      removeItem: (productId) => update((prev) => removeLine(prev, productId)),
      clear: () => update(() => NO_LINES),
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }
  }, [])

  const value = useMemo<CartValue>(() => {
    const lines = storedLines ?? NO_LINES
    return {
      ...actions,
      lines,
      isReady: storedLines !== null,
      isOpen,
      totalCount: calculateTotalCount(lines),
    }
  }, [actions, storedLines, isOpen])

  return <CartContext value={value}>{children}</CartContext>
}
