# ShopBoard AI Assistant Guidelines

WTC is a small multi-page store for bags, shoes and accessories, built with Next.js 16 (App Router),
React 19 and TypeScript. Products come from the ShopBoard course API; the bag lives in
`localStorage`. It is the React app from tasks 4 and 5 (Vite and React Router) converted to Next.js
for task 6: same features, behavior and look. The folder is `shopboard-nextjs/`; in the tags
`task-4-react` and `task-5-multipage` it is still called `shopboard-react/`.

## Commands

- `npm run dev` - Start the Next.js dev server (http://localhost:3000)
- `npm run typecheck` - TypeScript check (`tsc --noEmit`)
- `npm run lint` - oxlint plus `scripts/check-no-as-const.mjs`
- `npm run format` / `npm run format:check` - Prettier write / check
- `npm run build` - Production build (`next build`, which also type-checks)
- `npm run start` - Serve the production build (run `build` first)

The pre-commit hook is the repository's root `.husky/pre-commit`. When files of this folder are
staged it runs typecheck, lint, format:check and build here, and stops the commit at the first
failure. Never skip it with `--no-verify`.

`NEXT_PUBLIC_API_BASE_URL` is read when Next.js starts and inlined into the browser code: restart
`npm run dev` (or run `npm run build` again) after changing it. Stop every dev or preview server you start.

## Structure

```text
src/
├── instrumentation-client.ts   # Keeps expected ApiError logs out of the Console
├── app/                        # Routes and composition only, no business state
│   ├── layout.tsx              # Root layout: html, font links, metadata, CartProvider, shell
│   ├── page.tsx, not-found.tsx, error.tsx, App.css
│   ├── shop/ (page, loading), products/[id]/, cart/, checkout/ (page, PlaceOrderForm),
│   │   order-confirmation/     # One thin page per route
│   └── layout/                 # Header, Footer, AnnouncementBar, NavLink, ShopLink, AddToCartBridge
├── features/                   # One folder per feature; others import it only through its index.ts
│   ├── products/               # Shop catalog, filters in the URL, product page, AddToCartContext
│   ├── cart/                   # CartProvider, bag views, order summary, placing an order
│   ├── checkout/               # The checkout form and its Zod schema
│   └── home/                   # Marketing sections
└── shared/                     # Used by more than one feature; never imports features/ or app/
    ├── api/                    # client (the only fetch), endpoints, schemas, promise cache, products
    ├── config/brand.ts         # BRAND_NAME
    ├── lib/                    # formatPrice
    ├── styles/                 # global.css (tokens, base layer), tailwind.css
    ├── types.ts                # Product, inferred from its schema
    └── ui/                     # Icon, StatePanel, AsyncBoundary, shadcn button/input/label
```

- Features never import each other. Cross-feature wiring happens in `src/app/`: `AddToCartBridge`
  gives the products feature the cart's add action through `AddToCartContext`, and `PlaceOrderForm`
  connects the checkout form to `usePlaceOrder` from the cart.
- Pages are thin: they compose feature components and hold no business logic.
- `package.json` sets `"sideEffects": ["*.css"]`. Keep it: without it the feature barrels can pull
  other pages' code into the shared chunks.
- A file needs `"use client"` only when a server file imports it directly (the root layout, a
  `page.tsx`): the layout and `Footer` are Server Components, everything that uses state, effects,
  event handlers, context or browser APIs is a Client Component, and the directive sits on the
  module a server file imports. A module that is re-exported through a barrel and calls
  `createContext` or a hook (for example `CartContext.ts`) must also have it, or a server file that
  imports the barrel would run that code on the server.
- `components.json` has `rsc: true` for the shadcn CLI.

## Routing

The file-system router (`src/app/`). Navigation uses `next/link`. The current page gets
`aria-current="page"`: `NavLink` compares the path, and `ShopLink` also compares the collection,
because a path alone cannot tell the collection links apart.

| Path                  | File                                                       |
| --------------------- | ---------------------------------------------------------- |
| `/`                   | `app/page.tsx`                                             |
| `/shop`               | `app/shop/page.tsx` (`?q=&category=&sort=`), `loading.tsx` |
| `/products/:id`       | `app/products/[id]/page.tsx`                               |
| `/cart`               | `app/cart/page.tsx`                                        |
| `/checkout`           | `app/checkout/page.tsx`                                    |
| `/order-confirmation` | `app/order-confirmation/page.tsx`                          |
| anything else         | `app/not-found.tsx` (HTTP 404)                             |

`app/error.tsx` is a last safety net for unexpected crashes only. Failed API requests are expected
states: every data region handles them itself (see Data loading), so they never reach it.

## State ownership: each piece has exactly one owner

| State                                     | Owner                                                                      |
| ----------------------------------------- | -------------------------------------------------------------------------- |
| Bag lines `[{ id, qty }]`, drawer open    | `CartProvider` (saved to `localStorage`), changed only through its actions |
| Item count, `isReady`                     | Calculated in `CartProvider` from the lines (needs no product data)        |
| Priced items, subtotal, unavailable lines | Calculated in `usePricedCart` during render                                |
| Shop search, category, sort               | The URL (`useShopFilters`); no component keeps a copy                      |
| Filtered list, category list              | Calculated in `ShopCatalog` during render                                  |
| Product list, one product                 | The promise cache in `shared/api/products.ts`                              |
| Checkout values and errors                | react-hook-form inside `CheckoutForm`                                      |
| Placed order                              | `sessionStorage` (`orderStorage.ts`), read by `OrderConfirmation`          |
| Favorite toggle, newsletter input         | The component itself                                                       |

## Data loading

- `shared/api/client.ts` is the only place that calls `fetch`. Base URL from
  `NEXT_PUBLIC_API_BASE_URL` (default `https://shopboard-api.vercel.app/api`); paths from
  `endpoints.ts`. `apiGet` validates every response with a Zod schema and throws `ApiError` (with the
  status) on failure.
- **Server shell, browser data.** The server renders the layout, `Footer`, the home page and the 404.
  Everything that reads the API renders its skeleton on the server and fetches in the browser,
  because the bag is priced in the browser anyway and one shared request cache then serves every
  page. `AsyncBoundary` enforces it: until the browser has hydrated it renders only the fallback.
  The cache is module state, so it must never run on the server, where visitors would share it.
- Components read data with React 19 `use()`: `use(loadProducts())`, `use(loadProduct(id))`. The cache
  returns the same promise every render. A 404 for one product resolves to `null` ("not found"), any
  other failure rejects.
- Every data region is wrapped in `AsyncBoundary`: a `Suspense` with a skeleton shaped like the
  content, inside an `ErrorBoundary` (react-error-boundary) whose "Try again" calls `retry…()` to
  clear the failed promise and then resets. Header, footer and the bag count never read API data.
- Where Next.js's own files fit: `not-found.tsx` is the 404; `shop/loading.tsx` is the skeleton while
  the browser reads the filters from the URL (`useSearchParams` makes a static page wait for the
  browser); `error.tsx` is the unexpected-crash net. Our `AsyncBoundary` stays for every data region,
  so a slow or broken region never breaks the rest of the page.
- `src/instrumentation-client.ts` filters the Console: Next.js logs every error that an error
  boundary catches, and it owns the React root, so there is no `onCaughtError` option to turn that
  off. A failed API request is an expected state that the page already shows with "Try again", so the
  file replaces `console.error` with a version that drops only calls carrying an `ApiError`. It must
  filter nothing else: any other caught error is a bug and has to stay visible. What remains in the
  Console for a failed request is the browser's own "Failed to load resource" network line (and in
  `npm run dev` a "1 Issue" badge in Next's dev overlay); JavaScript cannot remove either.
- Fonts are loaded with `<link>` tags in `layout.tsx`. `next/font` was tried and rejected: it puts its
  own size-adjusted Arial in front of the font stack (Turbopack ignores `adjustFontFallback: false`),
  which draws glyphs the web fonts lack, such as the "←" in the back link, differently.

## Filters in the URL

- `useShopFilters` reads `useSearchParams` and writes with the History API (`pushState` for
  collection, sort and reset; `replaceState` for typing), which Next.js feeds back into
  `useSearchParams`. No server request is made.
- Next.js applies those URL updates in a transition, so the URL is a moment behind the keyboard. The
  search box therefore shows the typed text through `useOptimistic` inside `startTransition`: the
  value reverts to the URL's value when the transition ends, so it is not a second copy of the
  filter. Back and Forward keep the box and the list in sync, and fast typing keeps every letter.

## Forms

- `features/checkout/schema.ts` holds every validation rule. The form type is inferred from it
  (`types.ts`) and connected with `zodResolver`.
- Each input has a `<Label>`, the right `type` and `autoComplete`, `aria-invalid` and
  `aria-describedby` pointing at its error text. react-hook-form focuses the first invalid field;
  submit is disabled while submitting.
- There is no order endpoint. `usePlaceOrder` saves a snapshot of the priced bag in `sessionStorage`,
  then calls `router.replace('/order-confirmation')` and the provider's `clear` inside one
  `startTransition`, so checkout never shows the emptied bag before the confirmation arrives. The
  confirmation validates what it reads with Zod; opened directly it says "No recent order".

## Styling and shadcn/ui

- The site's look is plain CSS: tokens and element defaults in `shared/styles/global.css`, everything
  else in `app/App.css`.
- Tailwind (through `@tailwindcss/postcss`) exists only for shadcn/ui and the checkout form: no
  Preflight, only `shared/ui` and `features/checkout` are scanned, and it lives in cascade layers.
  `global.css` declares `@layer base, theme, utilities` and keeps its element defaults in `base`, so
  utilities beat element defaults while the site's unlayered classes beat everything. Keep that
  declaration first.
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
  build: each route's own client code must stay in that route's chunks (compare the `entryJSFiles`
  lists in `.next/server/app/**/page_client-reference-manifest.js`; `/checkout` carries the form
  libraries, the other routes only a few KB).

### 8. Never Let a URL-Controlled Input Update in a Transition Without Showing the Typed Text

- **Mistake**: The search box read its value from the URL, which Next.js (like the router before it)
  updates in a transition.
- **Consequence**: Between keystrokes the input briefly showed the old value, so fast typing dropped
  letters.
- **Rule**: Show the typed text with `useOptimistic` inside `startTransition` while the URL update runs
  (see "Filters in the URL"). Do not add an uncontrolled input with its own text or a `useState` copy:
  see rule 10.

### 9. Never Delete Saved Cart Lines Because Product Data Is Missing

- **Mistake**: Saving `pruneLines(lines, products)` to `localStorage` once the catalog loaded.
- **Consequence**: An empty or failed product list (`/empty`, `/fail`) permanently emptied the saved bag.
- **Rule**: Save exactly the lines the customer made. Lines whose product is missing are hidden and
  explained ("not available right now"), never deleted by loading code.

## Rules from Mistakes in the Next.js Migration

### 10. Never Keep a Second Copy of State the URL Owns

- **Mistake**: The first fix for dropped letters made the search box uncontrolled and kept its text in
  `useState` (with a key to reset it).
- **Consequence**: Two owners of the search text: after "Reset Filters", Back restored the URL and the
  list but not the box, and clearing the box once re-read the URL a moment too early and brought the
  old text back.
- **Rule**: The URL is the only owner of `q`, `category` and `sort`. A temporary typed value may exist
  only as `useOptimistic`, which reverts to the URL's value by itself.

### 11. Never Read Browser Storage While Rendering

- **Mistake**: `useState(loadCartLines)` read `localStorage` during render, and the confirmation
  page read router state that Next.js does not have.
- **Consequence**: The server has no `localStorage`, so its HTML (empty bag) differs from the browser's
  first render: a hydration error, or a bag that flashes "empty" and can overwrite the saved one.
- **Rule**: Start from "not read yet" (`null`), read after hydration in an effect (the one exception
  in rule 7) or with `useSyncExternalStore` and a server snapshot, guard saves with `!== null`, and
  show a skeleton until the value is known (`isReady`, `undefined` in `OrderConfirmation`).

### 12. Never Let Request-Cache State Run on the Server

- **Mistake**: Client components that call `use(loadProducts())` are also rendered on the server, where
  the module-level promise cache would run once and be shared by every visitor (and bake API errors
  into a prerendered page).
- **Consequence**: Stale data shared between visitors, and API calls during the build.
- **Rule**: Render data regions only in the browser: `AsyncBoundary` shows the skeleton on the server
  and during hydration.

### 13. Never Empty the Bag Before the Navigation Commits

- **Mistake**: Calling `clear()` and then `router.replace()` (the old code relied on `flushSync`, which
  Next.js does not have).
- **Consequence**: Checkout re-rendered with an empty bag and showed "Your bag is empty" for a moment
  before the confirmation arrived.
- **Rule**: Navigate and `clear()` inside the same `startTransition`, so both commit together. This
  needs the bag to live in React state, not an external store, because external store updates are
  always synchronous.

### 14. Never Read the Search Params in a Static Layout Without a Suspense Boundary

- **Mistake**: `ShopLink` (in the header and footer of every page) called `useSearchParams`.
- **Consequence**: `next build` fails with "Missing Suspense boundary with useSearchParams", or every
  page falls back to browser rendering.
- **Rule**: Wrap the component that reads the search params in `<Suspense>` with a plain fallback (the
  link without `aria-current`), or give the route a `loading.tsx`.

### 15. Never Swap a Tool or Font Loader Without Comparing the Result

- **Mistake**: `next/font` replaced the Google Fonts link and "looked the same".
- **Consequence**: Its size-adjusted fallback font changed how the "←" arrow rendered, which only a
  pixel comparison against the previous version (tag `task-5-multipage`) showed.
- **Rule**: After a change that could affect rendering, compare screenshots against the last known good
  version (and compare text, ARIA attributes and the Console), and keep the old approach if anything
  differs.

### 16. Never Let a Build Tool Rewrite Committed Files or Create Unwanted Ones

- **Mistake**: `tsconfig.json` lacked values Next.js wants, so every `next build` rewrote it (with
  Windows line endings); `incremental` wrote `tsconfig.tsbuildinfo`, which got committed; `next dev`
  generated an `AGENTS.md`.
- **Consequence**: `format:check` failed on the next commit, build output was tracked, and an unwanted
  agent-instructions file appeared next to this rulebook.
- **Rule**: Put every value the tool wants into the committed config (`incremental`, `allowJs`, …),
  ignore `*.tsbuildinfo` and `.next`, keep `agentRules: false` in `next.config.ts`, and check
  `git status` after `build` and `dev`.
