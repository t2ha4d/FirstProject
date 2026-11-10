import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { ApiStatus, Product } from '../../shared/types'
import { fetchProducts } from './api'
import { CatalogContext } from './CatalogContext'
import type { CatalogValue } from './CatalogContext'

export interface CatalogProviderProps {
  children: ReactNode
}

/** Owns the product list and its loading state. */
export function CatalogProvider({ children }: CatalogProviderProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [status, setStatus] = useState<ApiStatus>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [reloadCount, setReloadCount] = useState(0)

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

  const value = useMemo<CatalogValue>(
    () => ({
      products,
      status,
      errorMessage,
      reload() {
        setStatus('loading')
        setErrorMessage('')
        setReloadCount((count) => count + 1)
      },
    }),
    [products, status, errorMessage],
  )

  return <CatalogContext value={value}>{children}</CatalogContext>
}
