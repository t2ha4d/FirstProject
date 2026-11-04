# Vercel React Component Composition Patterns

A architectural guide for structuring modern, decoupled, and reusable React components.

---

## 1. Composition Over Prop Drilling

Avoid passing callback functions and intermediate state down multiple levels of the component tree. Instead, leverage component slots (`children`) and composition.

```tsx
// ❌ Deep Prop Drilling
<Page user={user} onLogout={handleLogout} cart={cart} onUpdateCart={updateCart} />

// ✅ Composed Structure
<Page
  header={<Header user={user} onLogout={handleLogout} />}
  cartDrawer={<CartDrawer items={cart} onUpdate={updateCart} />}
>
  <ProductGrid products={products} onSelect={addToCart} />
</Page>
```

---

## 2. Container vs. Presentational Components

Separate components into two distinct categories:

### Container Components (Smart)
- Manage local/global state, effects, and API fetching.
- Coordinate interactions between presentational components.
- Contain minimal styling.
- Example: `App.tsx` or a feature page component.

### Presentational Components (Dumb / Pure)
- Receive data solely through typed props.
- Emit user interactions through callback props (`onSelect`, `onDelete`).
- Have no knowledge of data sources or persistence logic.
- Are highly reusable and simple to unit test.
- Examples: `ProductCard.tsx`, `CartItem.tsx`, `SearchAndFilter.tsx`.

---

## 3. Explicit Props Contracts

Every component must define its own typed interface in the same file or import from a shared types module.

```tsx
export interface CartItemProps {
  item: CartItem
  onIncrement: (productId: number) => void
  onDecrement: (productId: number) => void
  onRemove: (productId: number) => void
}

export function CartItemView({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}: CartItemProps) {
  // Pure rendering logic
}
```

---

## 4. Unidirectional Data Flow & State Hoisting

State should live at the closest common ancestor of the components that need it:

1. **Cart State**: Shared between `ProductCard` (needs `addToCart`), `Header` (needs badge count), and `CartDrawer` (needs item list & mutations) -> Lives in `App.tsx` or custom `useCart()` hook.
2. **Filter State**: Shared between `SearchAndFilter` (inputs) and `ProductList` (filtered results) -> Hoisted to `App.tsx`.
3. **Card-Local State**: Transient UI state such as a temporary expanded view or animation -> Colocated inside `ProductCard.tsx`.

---

## 5. Overlay & Modal Composition (Drawer Pattern)

When rendering overlays like `CartDrawer`:
- Use semantic `<aside>` or dialog containers.
- Provide a backdrop layer with click-outside to close.
- Support keyboard accessibility (`Escape` key event listener).
- Prevent background scrolling when open (`document.body.style.overflow = 'hidden'`).
- Keep open/closed state decoupled from the drawer's internal rendering.

```tsx
export interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export function CartDrawer({ isOpen, onClose, children }: CartDrawerProps) {
  if (!isOpen) return null

  return (
    <div className="drawer-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <aside className="drawer-content" onClick={(e) => e.stopPropagation()}>
        <button type="button" aria-label="Close cart" onClick={onClose}>×</button>
        {children}
      </aside>
    </div>
  )
}
```

---

## 6. Single Responsibility Principle (SRP)

- Keep components small and focused (e.g., `CartDrawer` orchestrates the container, `CartItem` handles individual item presentation).
- Extract repeated layout pieces (e.g., badges, price formatting, buttons) into pure helper components or logic functions.
- If a component exceeds 150 lines or manages more than 2 distinct tasks, split it.

