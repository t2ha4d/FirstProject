import { useCatalog } from './CatalogContext'

export const SHOP_SECTION_ID = 'shop'
export const SEARCH_INPUT_ID = 'search-input'

function scrollToShop() {
  document.getElementById(SHOP_SECTION_ID)?.scrollIntoView()
}

/** Filter-and-scroll actions for navigation links outside the shop section. */
export function useShopNavigation() {
  const { resetFilters, selectCollection } = useCatalog()

  return {
    showAll() {
      resetFilters()
      scrollToShop()
    },
    showCollection(collection: string) {
      selectCollection(collection)
      scrollToShop()
    },
    openSearch() {
      scrollToShop()
      document.getElementById(SEARCH_INPUT_ID)?.focus({ preventScroll: true })
    },
  }
}
