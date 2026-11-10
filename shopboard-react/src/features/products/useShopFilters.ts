import { useSearchParams } from 'next/navigation'
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
  const filters = readFilters(useSearchParams())

  return {
    filters,
    updateFilters(change: Partial<FilterState>) {
      writeUrl({ ...filters, ...change }, 'push')
    },
    /** `replace` keeps typing from adding one history entry per key. */
    setSearchQuery(searchQuery: string) {
      writeUrl({ ...filters, searchQuery }, 'replace')
    },
    resetFilters() {
      writeUrl(INITIAL_FILTERS, 'push')
    },
  }
}
