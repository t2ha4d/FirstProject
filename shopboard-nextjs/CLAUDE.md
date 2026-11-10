# ShopBoard AI Assistant Guidelines

WTC is a small multi-page store for bags, shoes and accessories, built with React 19, TypeScript and
Vite. Products come from the ShopBoard course API; the bag lives in `localStorage`.

## Commands

- `npm run dev` - Start the Vite dev server
- `npm run typecheck` - TypeScript check (`tsc -b`)
- `npm run lint` - oxlint plus `scripts/check-no-as-const.mjs`
- `npm run format` / `npm run format:check` - Prettier write / check
- `npm run build` - Type check and production bundle
- `npm run preview` - Serve the production build

The pre-commit hook (`.husky/pre-commit`) runs typecheck, lint, format:check and build, and stops the
commit at the first failure. Never skip it with `--no-verify`.

## Structure

```text
src/
├── main.tsx              # createRoot, global CSS, onCaughtError
├── app/                  # Composition only, no business state
│   ├── App.tsx           # CartProvider + RouterProvider
│   ├── router.tsx        # The route table
│   ├── layout/           # RootLayout (Outlet), Header, Footer, AnnouncementBar, ShopLink
│   └── pages/            # One thin page per route; index.ts lazy-loads them
├── features/             # One folder per feature; others import it only through its index.ts
│   ├── products/         # Shop catalog, filters in the URL, product page, AddToCartContext
│   ├── cart/             # CartProvider, bag views, order summary, placing an order
│   ├── checkout/         # The checkout form and its Zod schema
│   └── home/             # Marketing sections
└── shared/               # Used by more than one feature; never imports features/ or app/
    ├── api/              # client (the only fetch), endpoints, schemas, promise cache, products
    ├── config/brand.ts   # BRAND_NAME
    ├── lib/              # formatPrice
    ├── styles/           # global.css (tokens, base layer), tailwind.css
    ├── types.ts          # Product, inferred from its schema
    └── ui/               # Icon, StatePanel, AsyncBoundary, shadcn button/input/label
```

- Features never import each other. Cross-feature wiring happens in `src/app/`: `RootLayout` gives the
  products feature the cart's add action through `AddToCartContext`, and `CheckoutPage` connects the
  checkout form to `usePlaceOrder` from the cart.
- Pages are thin: they compose feature components and hold no business logic.
- `package.json` sets `"sideEffects": ["*.css"]`. Keep it: without it the feature barrels pull every
  page's code into the main bundle and lazy loading stops working.

## Routing

React Router (data mode, `createBrowserRouter`). Every page is `React.lazy` in `app/pages/index.ts` and
renders inside `RootLayout`'s `<Suspense>` around the `<Outlet>`.

| Path                  | Page                             |
| --------------------- | -------------------------------- |
| `/`                   | HomePage                         |
| `/shop`               | ShopPage (`?q=&category=&sort=`) |
| `/products/:id`       | ProductPage                      |
| `/cart`               | CartPage                         |
| `/checkout`           | CheckoutPage                     |
| `/order-confirmation` | OrderConfirmationPage            |
| `*`                   | NotFoundPage                     |

Navigation uses `Link`/`NavLink`. The current page gets `aria-current="page"`; `ShopLink` does this
for collection links because `NavLink` ignores search params.

## State ownership: each piece has exactly one owner

| State                                     | Owner                                                                      |
| ----------------------------------------- | -------------------------------------------------------------------------- |
| Bag lines `[{ id, qty }]`, drawer open    | `CartProvider` (saved to `localStorage`), changed only through its actions |
| Item count                                | Calculated in `CartProvider` from the lines (needs no product data)        |
| Priced items, subtotal, unavailable lines | Calculated in `usePricedCart` during render                                |
| Shop search, category, sort               | URL search params (`useShopFilters`)                                       |
| Filtered list, category list              | Calculated in `ShopCatalog` during render                                  |
| Product list, one product                 | The promise cache in `shared/api/products.ts`                              |
| Checkout values and errors                | react-hook-form inside `CheckoutForm`                                      |
| Placed order                              | Router state of the `/order-confirmation` history entry                    |
| Favorite toggle, newsletter input         | The component itself                                                       |

## Data loading

- `shared/api/client.ts` is the only place that calls `fetch`. Base URL from `VITE_API_BASE_URL`
  (default `https://shopboard-api.vercel.app/api`); paths from `endpoints.ts`. `apiGet` validates
  every response with a Zod schema and throws `ApiError` (with the status) on failure.
- Components read data with React 19 `use()`: `use(loadProducts())`, `use(loadProduct(id))`. The cache
  returns the same promise every render. A 404 for one product resolves to `null` ("not found"), any
  other failure rejects.
- Every data region is wrapped in `AsyncBoundary`: a `Suspense` with a skeleton shaped like the content,
  inside an `ErrorBoundary` (react-error-boundary) whose "Try again" calls `retry…()` to clear the failed
  promise and then resets. Header, footer and the bag count never read API data.
- `main.tsx` passes `onCaughtError` to `createRoot`: expected `ApiError`s are not logged (the UI shows
  them); any other caught error is logged.

## Forms

- `features/checkout/schema.ts` holds every validation rule. The form type is inferred from it
  (`types.ts`) and connected with `zodResolver`.
- Each input has a `<Label>`, the right `type` and `autoComplete`, `aria-invalid` and
  `aria-describedby` pointing at its error text. react-hook-form focuses the first invalid field;
  submit is disabled while submitting.
- There is no order endpoint. `usePlaceOrder` navigates to `/order-confirmation` with a snapshot of the
  priced bag in router state, then empties the bag with the provider's `clear` action. The confirmation
  validates that state with Zod.

## Styling and shadcn/ui

- The site's look is plain CSS: tokens and element defaults in `shared/styles/global.css`, everything
  else in `app/App.css`.
- Tailwind exists only for shadcn/ui and the checkout form: no Preflight, only `shared/ui` and
  `features/checkout` are scanned, and it lives in cascade layers. `global.css` declares
  `@layer base, theme, utilities` and keeps its element defaults in `base`, so utilities beat element
  defaults while the site's unlayered classes beat everything. Keep that declaration first.
- shadcn components are added with the CLI (`npx shadcn add <name>`), configured by `components.json`
  to write to `src/shared/ui` (lowercase file names). Treat them as generated: do not restyle them;
  style them through props/`className` where they are used. They are formatted by Prettier and checked
  by the same lint rules. If one breaks a rule, make the smallest edit in that file and note it in the
  commit message; never relax a rule. Current edit: `button.tsx` does not export `buttonVariants`.

## React Rules & Coding Standards

1. **Explicit Props Contracts**: Every component with props declares and exports an interface for them
   (e.g. `export interface ProductCardProps`).
2. **Pure Components**: Presentational components are stateless or keep only local UI flags (like a
   favorite toggle). Business state lives with its owner (see the table above).
3. **Semantic HTML & Accessibility**: Use `<header>`, `<main>`, `<nav>`, `<section>`, `<aside>`. Every
   button and link has an accessible name: visible text, or `aria-label` for icon-only controls. Keep
   full keyboard navigability.
4. **Clean Code & Modularity**: Keep components under 150 lines and put calculations in pure helpers in
   the feature's `logic.ts`.
5. **No Escape Hatches in Types**: No `any`, no type assertions (`as`, `<T>x`), no non-null assertions
   (`!`) and no `as const`. Narrow with Zod or type guards. Always `import type` for types. Enforced
   by oxlint and `scripts/check-no-as-const.mjs`.
6. **Every hook needs a reason**: no state for anything that can be calculated, no effect for anything
   that can happen during render or in an event handler. Effects are only for outside systems
   (`localStorage`, `window` listeners).
7. **One documented lint exception**: `CartProvider` reads `localStorage` in an effect and calls
   `setStoredLines` there, which trips oxlint's `react/set-state-in-effect`, so that one line has
   `oxlint-disable-next-line react/set-state-in-effect`. It stays because the saved bag cannot be read
   during render: the server has no `localStorage`, and reading it in the first browser render would
   not match the server's HTML (a hydration error). The effect is the only place that runs in the
   browser alone, and it reads an outside system, which is what effects are for. Do not copy this
   pattern elsewhere or add other disables: calculate in render, or handle it in an event handler.

---

## Rules from Mistakes Seen in the Debug Lab

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

## Rules from Mistakes in the Multi-Page Task

### 4. Never Fetch Data in an Effect with Status Flags

- **Mistake**: `useEffect` + `useState` for `products`, `status`, `errorMessage` and a reload counter.
- **Consequence**: Every consumer re-implements loading/error branches, a failure in one place breaks
  unrelated UI (the bag hung on "Loading your bag…" forever when the list failed), and nothing could be
  retried per region.
- **Rule**: Read data with `use(loadX())` from the cache in `shared/api`, inside an `AsyncBoundary` with a
  matching skeleton and a "Try again" that clears the failed promise.

### 5. Never Store a Value That Can Be Calculated

- **Mistake**: Keeping `filteredProducts`, `categories`, priced `items` or `subtotal` in state or in a
  provider next to the data they come from.
- **Consequence**: Two copies of the truth that drift apart, extra renders, and effects to sync them.
- **Rule**: Store only the source (`lines`, URL params, the fetched list) and calculate the rest during
  render.

### 6. Never Pass a Prop Through a Component That Does Not Use It

- **Mistake**: `onAddToCart` passed from the page through `ProductsSection` and `ProductList` to
  `ProductCard`; cart values passed from `CartPanel` into `CartDrawer`.
- **Consequence**: Every middle component changes when the leaf changes, and features end up coupled.
- **Rule**: Read from the owner where the value is used (`useCart()`, `useAddToCart()`), or pass
  elements as `children`.

### 7. Never Let a Barrel Import Undo Code Splitting

- **Mistake**: The layout imported one constant from `features/home`, so the bundler kept every page
  component behind that `index.ts` in the main chunk; the lazy page chunks held only glue code.
- **Consequence**: "Lazy" pages downloaded with the first page.
- **Rule**: Keep `"sideEffects": ["*.css"]` in `package.json`, and after touching imports check the
  build output: each page's code must be in its own `…Page-*.js` chunk.

### 8. Never Let a URL-Controlled Input Update in a Transition

- **Mistake**: The search box read its value from the URL and wrote it with `setSearchParams`, which the
  router runs as a transition.
- **Consequence**: Between keystrokes the input briefly showed the old value, so fast typing dropped
  letters ("boo" became `?q=o`).
- **Rule**: For inputs bound to the URL, pass the router's own `{ flushSync: true }` (plus
  `replace: true` so typing does not flood history). Do not import `flushSync` from react-dom.

### 9. Never Delete Saved Cart Lines Because Product Data Is Missing

- **Mistake**: Saving `pruneLines(lines, products)` to `localStorage` once the catalog loaded.
- **Consequence**: An empty or failed product list (`/empty`, `/fail`) permanently emptied the saved bag.
- **Rule**: Save exactly the lines the customer made. Lines whose product is missing are hidden and
  explained ("not available right now"), never deleted by loading code.
