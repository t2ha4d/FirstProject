# ShopBoard — Day 4 React + TypeScript Application

A modern, accessible, and robust e-commerce product catalog and shopping cart application built with **React 19**, **TypeScript**, and **Vite**.

---

## 🏗️ React DevTools Component Tree

Below is the complete component hierarchy matching what appears in the **React DevTools Components tab**, including component ownership, props, and state:

```text
<App>                              [src/App.tsx]
 │  State Owned:
 │    • products: Product[]
 │    • status: ApiStatus ('idle' | 'loading' | 'error' | 'success')
 │    • errorMessage: string
 │    • filters: FilterState ({ searchQuery, selectedCategory, sortBy })
 │    • cart.items: CartItem[] (via useCartState with localStorage persistence)
 │    • cart.isOpen: boolean
 │
 ├── <Header>                      [src/components/Header.tsx]
 │     Props:
 │       • cartCount: number (cartTotalCount)
 │       • onOpenCart: () => void
 │     State Owned: None (Pure presentational)
 │
 ├── <SearchAndFilter>             [src/components/SearchAndFilter.tsx]
 │     Props:
 │       • categories: string[]
 │       • filters: FilterState
 │       • totalResults: number
 │       • onSearchChange: (query: string) => void
 │       • onCategoryChange: (category: string) => void
 │       • onSortChange: (sort: SortOption) => void
 │       • onResetFilters: () => void
 │     State Owned: None (Pure presentational)
 │
 ├── <ProductList>                 [src/components/ProductList.tsx]
 │    │  Props:
 │    │    • products: Product[] (filtered & sorted list)
 │    │    • status: ApiStatus
 │    │    • errorMessage?: string
 │    │    • totalCatalogCount: number
 │    │    • onRetry: () => void
 │    │    • onAddToCart: (product: Product) => void
 │    │    • onResetFilters: () => void
 │    │  State Owned: None (Coordinates grid & async UI states)
 │    │
 │    └── <ProductCard>            [src/components/ProductCard.tsx]
 │          (Rendered for each product, key={product.id})
 │          Props:
 │            • product: Product ({ id, title, category_name, price_cents, in_stock })
 │            • onAddToCart: (product: Product) => void
 │          State Owned:
 │            • isSaved: boolean (local wishlist toggle, preserved via stable key)
 │
 └── <CartDrawer>                  [src/components/CartDrawer.tsx]
      │  Props:
      │    • isOpen: boolean
      │    • items: CartItem[]
      │    • subtotalFormatted: string
      │    • totalCount: number
      │    • onClose: () => void
      │    • onIncrement: (productId: number) => void
      │    • onDecrement: (productId: number) => void
      │    • onRemove: (productId: number) => void
      │    • onClear: () => void
      │  State Owned: None (Overlay & keyboard events managed via useEffect)
      │
      └── <CartItem>               [src/components/CartItem.tsx]
            (Rendered for each cart item, key={item.product.id})
            Props:
              • item: CartItem ({ product, quantity })
              • onIncrement: (productId: number) => void
              • onDecrement: (productId: number) => void
              • onRemove: (productId: number) => void
            State Owned: None (Pure presentational item row)
```

---

## 📋 Component Summary Table

| Component             | Source File                          | Props Interface        | State Owned                                             | Description                                                                                       |
| :-------------------- | :----------------------------------- | :--------------------- | :------------------------------------------------------ | :------------------------------------------------------------------------------------------------ |
| **`App`**             | `src/App.tsx`                        | N/A (Root)             | `products`, `status`, `errorMessage`, `filters`, `cart` | Root container coordinating data fetching, filter pipeline, and cart drawer.                      |
| **`Header`**          | `src/components/Header.tsx`          | `HeaderProps`          | _None_                                                  | Top navigation displaying logo, title, tagline, and cart button with badge.                       |
| **`SearchAndFilter`** | `src/components/SearchAndFilter.tsx` | `SearchAndFilterProps` | _None_                                                  | Search text input, category dropdown, price/name sort selector, and filter reset.                 |
| **`ProductList`**     | `src/components/ProductList.tsx`     | `ProductListProps`     | _None_                                                  | Renders product cards grid or handles Loading, Error, Empty, and No Match states.                 |
| **`ProductCard`**     | `src/components/ProductCard.tsx`     | `ProductCardProps`     | `isSaved: boolean`                                      | Individual product card with price formatting, stock indicator, wishlist toggle, and add-to-cart. |
| **`CartDrawer`**      | `src/components/CartDrawer.tsx`      | `CartDrawerProps`      | _None_                                                  | Slide-out overlay showing cart items, subtotal calculation, checkout, and backdrop dismiss.       |
| **`CartItem`**        | `src/components/CartItem.tsx`        | `CartItemProps`        | _None_                                                  | Line item row with unit price, subtotal, and quantity increment/decrement/remove actions.         |

---

## 🛠️ Project Structure & Architecture

```text
shopboard-react/
├── .claude/
│   └── skills/
│       ├── vercel-react-best-practices.md   # Core React 19 + TypeScript best practices
│       └── vercel-composition-patterns.md  # Architectural composition and component design
├── public/
│   └── favicon.svg                          # App favicon
├── src/
│   ├── components/
│   │   ├── CartDrawer.tsx                   # Slide-out modal cart with subtotal & actions
│   │   ├── CartItem.tsx                     # Single cart item with +/- controls
│   │   ├── Header.tsx                       # Brand header with cart counter badge
│   │   ├── ProductCard.tsx                  # Single product item with stable key
│   │   ├── ProductList.tsx                  # Grid container with loading/error/empty UI
│   │   └── SearchAndFilter.tsx              # Search input, category select & sorting
│   ├── api.ts                               # Remote API client for products
│   ├── App.css                              # Component and layout styling
│   ├── App.tsx                              # Main container component
│   ├── index.css                            # Global theme variables & typography
│   ├── logic.ts                             # Pure search, filter, sort & format functions
│   ├── main.tsx                             # Application entry point
│   ├── state.ts                             # Cart state management & localStorage sync
│   └── types.ts                             # TypeScript data models and interfaces
├── CLAUDE.md                                # Development guidelines & 3 key React rules
├── debug-lab-log.md                         # Detailed analysis of 5 Debug Lab bugs
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## ⚡ Key Features

1. **Async Remote API Integration**:
   - Fetches live product data from `https://shopboard-api.vercel.app/api/products`.
   - Explicitly handles **Loading**, **Error** (with interactive "Try again" button), **Empty**, and **Success** states.

2. **Pure Data Transformation (`src/logic.ts`)**:
   - Zero-side-effect filtering by search query and category.
   - Immutable sorting by price (ascending/descending) and name (alphabetical).
   - Formats prices in cents to USD currency strings.

3. **Persistent Cart Management (`src/state.ts`)**:
   - Custom `useCartState` hook managing additions, quantity updates, removals, and clearing.
   - Automatically synchronizes cart state to `localStorage` under `shopboard_cart_items_v1`.

4. **Robust Type Safety**:
   - Strictly uses `import type` for all TypeScript types throughout the codebase.
   - All component props are declared via typed TypeScript interfaces.

5. **Accessibility & Responsive Design**:
   - Fully accessible buttons and dialogs with `aria-label`, `aria-pressed`, `aria-modal`, and keyboard support (`Escape` closes drawer).
   - Fully responsive on mobile, tablet, and desktop viewports.

---

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Code Quality & Linting

```bash
npm run lint
```
