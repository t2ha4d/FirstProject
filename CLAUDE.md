# ShopBoard AI Assistant Guidelines

## Commands

- `npm run dev` - Start local development server (Vite)
- `npm run build` - TypeScript type check and production bundle
- `npm run lint` - Run oxlint plus the `as const` check
- `npm run format` / `npm run format:check` - Prettier write / check (`prettier --check .` must pass)
- `npm run preview` - Preview production build locally

## Architecture & Code Organization

- **`src/features/<name>/`**: One folder per feature (`products`, `cart`, `home`). A feature owns its state (a Provider + `use<Feature>()` hook), its pure `logic.ts`, its `types.ts` and its `components/`. Other code imports a feature only through its `index.ts`.
  - Features never import each other. Cross-feature wiring happens in `src/app/` (e.g. `RootLayout` gives the products feature the cart's add action through `AddToCartContext`).
- **`src/shared/`**: Code used by more than one feature: the API client, endpoint paths, Zod schemas for API data, `formatPrice`, domain types, UI primitives (`Icon`, `StatePanel`) and global styles. `shared/` never imports from `features/` or `app/`.
- **`src/shared/api/client.ts`**: The only place that calls `fetch`. Base URL from `VITE_API_BASE_URL`; paths from `shared/api/endpoints.ts`. Never hardcode a URL in a feature.
- **`src/app/`**: Composition only: providers, the router (`router.tsx`), the shared layout (`layout/`), thin lazy-loaded pages (`pages/`) and `App.css`. No business state.
- **Types**: Always import with `import type`. Validate unknown data (API responses, `localStorage`) with Zod schemas and infer the types from them.
- **Cart storage**: `localStorage` holds only `[{ id, qty }]`. Prices always come from the product data, and no line is dropped before the catalog has loaded.

## React Rules & Coding Standards

1. **Explicit Props Contracts**: Every component must declare and export an interface for its props (e.g. `export interface ProductCardProps`).
2. **Pure Components**: Presentational components should be stateless or restrict state to purely local UI visual flags (like expanded states). Business state must be hoisted.
3. **Semantic HTML & Accessibility**: Use appropriate elements (`<header>`, `<main>`, `<section>`, `<aside>`), label all buttons with `aria-label`, and ensure full keyboard navigability.
4. **Clean Code & Modularity**: Keep components under 150 lines and isolate complex calculation logic into pure helper functions in the feature's `logic.ts`.
5. **No Escape Hatches in Types**: No `any`, no type assertions (`as`, `<T>x`), no non-null assertions (`!`) and no `as const`. Narrow with Zod or type guards instead. Enforced by oxlint and `scripts/check-no-as-const.mjs`.

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
