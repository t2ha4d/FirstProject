import { useSearchParams } from 'react-router'
import { INITIAL_FILTERS, readFilters, writeFilters } from './logic'
import type { FilterState } from './types'

/** The shop filters, owned by the URL search params (`q`, `category`, `sort`). */
export function useShopFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = readFilters(searchParams)

  return {
    filters,
    updateFilters(change: Partial<FilterState>) {
      setSearchParams(writeFilters({ ...filters, ...change }))
    },
    /**
     * The search box reads its value from the URL, so each keystroke must update the URL
     * synchronously (flushSync) or fast typing loses letters. `replace` keeps typing from
     * adding one history entry per key.
     */
    setSearchQuery(searchQuery: string) {
      setSearchParams(writeFilters({ ...filters, searchQuery }), { replace: true, flushSync: true })
    },
    resetFilters() {
      setSearchParams(writeFilters(INITIAL_FILTERS))
    },
  }
}
