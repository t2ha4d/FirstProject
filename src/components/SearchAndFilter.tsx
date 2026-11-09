import { Icon } from './Icon'
import type { FilterState, SortOption } from '../types'

export interface SearchAndFilterProps {
  categories: string[]
  filters: FilterState
  onSearchChange: (query: string) => void
  onCategoryChange: (category: string) => void
  onSortChange: (sort: SortOption) => void
  onResetFilters: () => void
  totalResults: number
}

export function SearchAndFilter({
  categories,
  filters,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onResetFilters,
  totalResults,
}: SearchAndFilterProps) {
  const isFiltered = filters.searchQuery !== '' || filters.selectedCategory !== 'all' || filters.sortBy !== 'default'

  return (
    <section className="search-filter-section" aria-label="Search and filter watches">
      <div className="search-filter-grid">
        {/* Search input */}
        <div className="filter-group search-group">
          <label htmlFor="search-input" className="filter-label">Search Watches</label>
          <div className="search-input-wrapper">
            <span className="search-icon"><Icon name="search" size={18} /></span>
            <input
              id="search-input"
              type="search"
              className="search-input"
              placeholder="Search by name, dial or strap..."
              value={filters.searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {filters.searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => onSearchChange('')}
                aria-label="Clear search query"
              >
                <Icon name="close" size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Category select */}
        <div className="filter-group">
          <label htmlFor="category-select" className="filter-label">Collection</label>
          <select
            id="category-select"
            className="filter-select"
            value={filters.selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="all">All Collections</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Sort select */}
        <div className="filter-group">
          <label htmlFor="sort-select" className="filter-label">Sort By</label>
          <select
            id="sort-select"
            className="filter-select"
            value={filters.sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
          >
            <option value="default">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Alphabetical (A - Z)</option>
          </select>
        </div>
      </div>

      {/* Active filters & results counter */}
      <div className="filter-status-bar">
        <span className="results-count">
          Showing <strong>{totalResults}</strong> {totalResults === 1 ? 'watch' : 'watches'}
        </span>
        {isFiltered && (
          <button
            type="button"
            className="reset-filters-btn"
            aria-label="Reset all filters"
            onClick={onResetFilters}
          >
            Reset Filters
          </button>
        )}
      </div>
    </section>
  )
}

