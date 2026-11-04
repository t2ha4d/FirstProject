# Vercel React Best Practices

A production-ready guide to writing scalable, performant, and maintainable React 19 + TypeScript applications based on Vercel standards.

---

## 1. Type Imports & Type Safety

### Always Use `import type`
When importing interfaces, types, or type aliases, always use `import type` to guarantee zero runtime overhead and prevent circular dependency issues during bundling.

```tsx
// ✅ Correct
import type { Product, CartItem } from './types'

// ❌ Incorrect
import { Product, CartItem } from './types'
```

### Strict Prop Typing
Define explicit TypeScript interfaces for all component props. Avoid `any` or loose types.

```tsx
export interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
  disabled?: boolean
}

export function ProductCard({ product, onAddToCart, disabled = false }: ProductCardProps) {
  // ...
}
```

---

## 2. Immutability in State and Props

### Never Mutate Props or State in Place
React relies on shallow reference equality (`Object.is`) to detect state changes. Mutating arrays or objects in-place prevents re-renders and introduces subtle bugs.

```tsx
// ❌ Incorrect - mutates input array
function sortProducts(products: Product[]) {
  return products.sort((a, b) => a.price_cents - b.price_cents)
}

// ❌ Incorrect - mutates item directly
function handleIncrement(item: CartItem) {
  item.quantity += 1
  setCart(cart) // Same reference; React will NOT re-render!
}

// ✅ Correct - creates a new array
function sortProducts(products: Product[]) {
  return [...products].sort((a, b) => a.price_cents - b.price_cents)
}

// ✅ Correct - creates new object and array references
function handleIncrement(id: number) {
  setCart(prev =>
    prev.map(item =>
      item.product.id === id ? { ...item, quantity: item.quantity + 1 } : item
    )
  )
}
```

---

## 3. Stable Keys & Reconciliation

### Use Unique, Stable IDs for `key`
Never use array indices as keys when lists can be filtered, re-ordered, or modified. Doing so causes React to retain component local state (e.g., input values, toggle states) across the wrong DOM nodes.

```tsx
// ❌ Incorrect - index key causes state misalignment when sorted/filtered
{products.map((product, index) => (
  <ProductCard key={index} product={product} />
))}

// ✅ Correct - unique persistent entity ID
{products.map((product) => (
  <ProductCard key={product.id} product={product} />
))}
```

---

## 4. JSX Rendering Gotchas (Falsy Values)

### Avoid Leaking `0` with Short-Circuit Evaluation
In JavaScript JSX, numeric `0` in `0 && <Component />` evaluates to the number `0`, which React renders into the DOM as text.

```tsx
// ❌ Incorrect - renders "0" when stock is 0 or cart is empty
<p>{product.stock && <span>Only {product.stock} left</span>}</p>
<div>{cart.length && <CartList items={cart} />}</div>

// ✅ Correct - explicit comparison returns boolean
<p>{product.stock > 0 && <span>Only {product.stock} left</span>}</p>
<div>{cart.length > 0 && <CartList items={cart} />}</div>

// ✅ Correct - ternary operator
<p>{product.stock > 0 ? <span>Only {product.stock} left</span> : null}</p>
```

---

## 5. Pure Logic & Separation of Concerns

Keep business logic, data fetching, and state persistence isolated from presentation:

1. **`types.ts`**: Pure data contracts and interface definitions.
2. **`api.ts`**: Async data fetching, status handling (Loading, Error, Empty, Success), and error catching.
3. **`logic.ts`**: Pure functions for data transformation (search, filtering, sorting, price calculations) with zero side effects.
4. **`state.ts`**: State updates, reducers, and storage persistence (e.g. `localStorage`).
5. **Components**: Focus solely on rendering UI and dispatching user actions.

---

## 6. Async Data Fetching & State Transitions

Handle every network state explicitly:
- **Idle**: Initial untouched state.
- **Loading**: Showing skeletons, spinners, or loading indicators.
- **Error**: Graceful error alert with a user-friendly retry button.
- **Empty**: Informing the user when the API returns no items.
- **Success**: Displaying the fetched data.

```tsx
if (status === 'loading') return <LoadingSpinner />
if (status === 'error') return <ErrorMessage onRetry={fetchData} message={error} />
if (status === 'success' && data.length === 0) return <EmptyState />
return <DataGrid items={data} />
```

---

## 7. Accessibility & Semantic HTML

- Use semantic landmark elements (`<header>`, `<main>`, `<section>`, `<aside>`, `<footer>`).
- Add appropriate `aria-label`, `aria-expanded`, and `aria-pressed` attributes on interactive buttons.
- Ensure form inputs have associated `<label>` tags with `htmlFor`.
- Support keyboard interactions (e.g. Escape to dismiss drawers and dialogs).

