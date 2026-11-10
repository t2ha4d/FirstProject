import { useSearchParams } from 'next/navigation'
import { startTransition, useOptimistic } from 'react'
import { INITIAL_FILTERS, readFilters, writeFilters } from './logic'
import type { FilterState } from './types'

/**
 * Writes the filters to the address bar. Next.js feeds History API calls into `useSearchParams`,
 * so the page updates without a request to the server.
 */
function writeUrl(filters: FilterState, mode: 'push' | 'replace') {
  const search = writeFilters(filters).toString()
  const url = search === '' ? window.location.pathname : `${window.location.pathname}?${search}`
  if (mode === 'push') window.history.pushState(null, '', url)
  else window.history.replaceState(null, '', url)
}

/** The shop filters, owned by the URL search params (`q`, `category`, `sort`). */
export function useShopFilters() {
  const urlFilters = readFilters(useSearchParams())
  // Next applies URL changes in a transition, so the URL is a moment behind the keyboard. While
  // that transition runs, the typed text is shown from here; it is not a second copy of the
  // filter, because it always reverts to the URL's value when the transition ends.
  const [searchQuery, showTypedQuery] = useOptimistic(urlFilters.searchQuery)
  const filters = { ...urlFilters, searchQuery }

  return {
    filters,
    updateFilters(change: Partial<FilterState>) {
      writeUrl({ ...filters, ...change }, 'push')
    },
    /** `replace` keeps typing from adding one history entry per key. */
    setSearchQuery(query: string) {
      startTransition(() => {
        showTypedQuery(query)
        writeUrl({ ...filters, searchQuery: query }, 'replace')
      })
    },
    resetFilters() {
      writeUrl(INITIAL_FILTERS, 'push')
    },
  }
}
