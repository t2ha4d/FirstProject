import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { ApiStatus, Product } from '../../shared/types'
import { fetchProducts } from './api'
import { CatalogContext } from './CatalogContext'
import type { CatalogActions, CatalogValue } from './CatalogContext'
import { INITIAL_FILTERS, applyFilters, getUniqueCategories } from './logic'
import type { FilterState } from './types'

export interface CatalogProviderProps {
  children: ReactNode
}

/** Owns the product list, its loading state and the active filters. */
export function CatalogProvider({ children }: CatalogProviderProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [status, setStatus] = useState<ApiStatus>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [reloadCount, setReloadCount] = useState(0)
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS)

  useEffect(() => {
    const controller = new AbortController()

    fetchProducts(controller.signal)
      .then((items) => {
        if (controller.signal.aborted) return
        setProducts(items)
        setStatus('success')
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load the collection')
        setStatus('error')
      })

    return () => controller.abort()
  }, [reloadCount])

  const actions = useMemo<CatalogActions>(
    () => ({
      reload() {
        setStatus('loading')
        setErrorMessage('')
        setReloadCount((count) => count + 1)
      },
      setSearchQuery: (searchQuery) => setFilters((prev) => ({ ...prev, searchQuery })),
      setCategory: (selectedCategory) => setFilters((prev) => ({ ...prev, selectedCategory })),
      setSortBy: (sortBy) => setFilters((prev) => ({ ...prev, sortBy })),
      resetFilters: () => setFilters(INITIAL_FILTERS),
      selectCollection: (collection) =>
        setFilters({ ...INITIAL_FILTERS, selectedCategory: collection }),
    }),
    [],
  )

  const categories = useMemo(() => getUniqueCategories(products), [products])
  const filteredProducts = useMemo(() => applyFilters(products, filters), [products, filters])

  const value = useMemo<CatalogValue>(
    () => ({
      ...actions,
      products,
      status,
      errorMessage,
      filters,
      categories,
      filteredProducts,
    }),
    [actions, products, status, errorMessage, filters, categories, filteredProducts],
  )

  return <CatalogContext value={value}>{children}</CatalogContext>
}
