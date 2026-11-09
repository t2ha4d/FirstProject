# ShopBoard AI Assistant Guidelines

## Commands

- `npm run dev` - Start local development server (Vite)
- `npm run build` - TypeScript type check and production bundle
- `npm run lint` - Run oxlint linter
- `npm run preview` - Preview production build locally

## Architecture & Code Organization

- **`src/types.ts`**: Pure data contracts and interface definitions.
  - **Rule**: Always import with `import type` throughout the entire codebase.
- **`src/api.ts`**: Asynchronous data layer serving the WTC watch catalog (`src/catalog.ts`) behind Loading, Error, Empty, and Success states.
- **`src/logic.ts`**: Pure, immutable utility functions for searching, filtering by category, sorting by price/name, and price formatting.
- **`src/state.ts`**: State reducers and custom hooks managing cart operations with `localStorage` persistence.
- **`src/components/`**: Reusable presentational components, each isolated in its own file with a typed `Props` interface.

## React Rules & Coding Standards

1. **Explicit Props Contracts**: Every component must declare and export an interface for its props (e.g. `export interface ProductCardProps`).
2. **Pure Components**: Presentational components should be stateless or restrict state to purely local UI visual flags (like expanded states). Business state must be hoisted.
3. **Semantic HTML & Accessibility**: Use appropriate elements (`<header>`, `<main>`, `<section>`, `<aside>`), label all buttons with `aria-label`, and ensure full keyboard navigability.
4. **Clean Code & Modularity**: Keep components under 150 lines and isolate complex calculation logic into pure helper functions in `logic.ts`.

---

## 3 Specific Rules from Mistakes Seen Today (Debug Lab)

### 1. Never Use Array Index as `key` for Dynamic or Sortable Lists

- **Mistake**: `<ProductCard key={index} ... />`
- **Consequence**: When the array is re-ordered or filtered, React reconciles components by their slot index. Local component state (e.g., heart favorites, input text, selection flags) stays attached to index 0 rather than moving with the actual item.
- **Rule**: Always supply a stable, unique entity ID as the key: `<ProductCard key={product.id} ... />`.

### 2. Never Mutate Props, State Objects, or Arrays In-Place

- **Mistake**: `products.sort(...)` or `item.qty = item.qty + 1` with `setCart(cart)`.
- **Consequence**: In-place mutation corrupts external data sources (like featured lists) and prevents React from detecting state changes because `Object.is(prevState, nextState)` evaluates to `true`, causing React to skip re-rendering entirely.
- **Rule**: Always create shallow copies before sorting (`[...products].sort(...)`) and use immutable updater patterns (`setCart(prev => prev.map(item => item.id === id ? { ...item, qty: item.qty + 1 } : item))`).

### 3. Never Short-Circuit Render with Raw Numbers in JSX

- **Mistake**: `{stock && <span>Only {stock} left</span>}` or `{cart.length && <CartList />}`.
- **Consequence**: In JavaScript, `0 && <Component />` evaluates to the number `0`, which React renders into the DOM as visible text, creating unintended stray "0" characters on sold-out products and empty carts.
- **Rule**: Always use explicit boolean comparisons: `{stock > 0 && <span>Only {stock} left</span>}` or `{cart.length > 0 && <CartList />}`.
