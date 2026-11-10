# WTC — Next.js + TypeScript Store

A multi-page store for bags, shoes and accessories, built with **Next.js 16 (App Router)**,
**React 19** and **TypeScript**. It is the React app from tasks 4 and 5 (Vite and React Router)
converted to Next.js for task 6, with the same features, behavior and look. Products come from the
[ShopBoard API](https://shopboard-api.vercel.app); the bag is saved in `localStorage`. The code is
organised by feature: each feature owns its state, `shared/` holds code used by more than one
feature, and `app/` holds the routes and composes the features into pages.

---

## 🚀 Getting Started

```bash
npm install                        # Node 20.9 or newer; also run it once in the repo root (git hook)
cp .env.example .env.local         # optional: pick another API base URL (see below)
npm run dev                        # http://localhost:3000
```

| Command                | What it does                                   |
| :--------------------- | :--------------------------------------------- |
| `npm run dev`          | Start the Next.js dev server                   |
| `npm run typecheck`    | TypeScript check (`tsc --noEmit`)              |
| `npm run lint`         | oxlint plus the `as const` check               |
| `npm run format`       | Format everything with Prettier                |
| `npm run format:check` | Verify formatting (`prettier --check .`)       |
| `npm run build`        | Type-check and build for production (`.next/`) |
| `npm run start`        | Serve the production build (run `build` first) |

The pre-commit hook (the repository's root `.husky/pre-commit`) runs `typecheck`, `lint`,
`format:check` and `build` for this folder, and blocks the commit if any of them fails.

### Choosing the API base URL

The API client reads `NEXT_PUBLIC_API_BASE_URL`. Put it in `.env.local` (ignored by git). Without it
the app uses `https://shopboard-api.vercel.app/api`.

> **Restart after changing it.** Next.js reads `NEXT_PUBLIC_` variables when it starts and inlines
> them into the browser code. After editing `.env.local`, stop `npm run dev` and start it again.
> For a production build, run `npm run build` again.

The API can pretend to be normal, slow, broken or empty. These are the four base URLs (they are also
in `.env.example`):

| State   | `NEXT_PUBLIC_API_BASE_URL`                        |
| :------ | :------------------------------------------------ |
| Normal  | `https://shopboard-api.vercel.app/api`            |
| Loading | `https://shopboard-api.vercel.app/delay/3000/api` |
| Error   | `https://shopboard-api.vercel.app/fail/500/api`   |
| Empty   | `https://shopboard-api.vercel.app/empty/api`      |

---

## 🗺️ Routes

Every route is a folder in `src/app/`. Next.js splits the code per route, so a page's code downloads
the first time the page is opened (see "Code splitting" below).

| Path                  | File                                  | What it shows                                                               |
| :-------------------- | :------------------------------------ | :-------------------------------------------------------------------------- |
| `/`                   | `src/app/page.tsx`                    | Hero, collections, craft story, testimonials, newsletter                    |
| `/shop`               | `src/app/shop/page.tsx`               | Catalog with search, collection and sort in the URL (`?q=&category=&sort=`) |
| `/products/:id`       | `src/app/products/[id]/page.tsx`      | One product loaded by id; invalid or unknown ids show "Product not found"   |
| `/cart`               | `src/app/cart/page.tsx`               | The bag with quantity controls and totals                                   |
| `/checkout`           | `src/app/checkout/page.tsx`           | Shipping form next to the order summary                                     |
| `/order-confirmation` | `src/app/order-confirmation/page.tsx` | The order just placed, or "No recent order" when opened directly            |
| any other URL         | `src/app/not-found.tsx`               | Page not found (the response status is 404)                                 |

`src/app/error.tsx` is the last safety net for unexpected crashes only; failed API requests never
reach it.

---

## 🧪 Testing the UI States

Set `NEXT_PUBLIC_API_BASE_URL` in `.env.local` to one of the four URLs above and **restart
`npm run dev`**:

| State   | What you should see                                                                                                     |
| :------ | :---------------------------------------------------------------------------------------------------------------------- |
| Normal  | 12 products; product pages, bag and checkout priced                                                                     |
| Loading | Skeletons shaped like the shop grid, product page, bag lines and order summary for 3 seconds; header and footer at once |
| Error   | Each data region (shop, product, bag, drawer, order summary) shows its own error with **Try again**; navigation works   |
| Empty   | Shop: "No products available". Bag: saved items "not available right now". Product pages still load by id               |

Other things to try:

- **No search matches:** `/shop?q=zzz` shows a "Clear all filters" button.
- **Empty bag:** `/cart` and `/checkout` with nothing saved show a link to the shop.
- **Not found:** `/products/99999`, `/products/abc` and any unknown URL.
- **Saved bag survives errors:** add items, switch to the `fail` or `empty` URL (and restart), then
  back; the bag is unchanged, because only the customer's own actions change it.
- **Order confirmation:** place an order, reload the confirmation (it stays), then open
  `/order-confirmation` in a new tab (it says "No recent order").

What to expect in the browser Console: in the Error state the browser itself prints one
`Failed to load resource … 500` line per failed request (and `…404` for an unknown product); no code
can remove that. `npm run dev` also shows a "1 Issue" badge from Next.js's dev overlay for each
failed region. Production builds have neither the badge nor any other message. There are no
hydration warnings.

---

## 🏗️ Component Tree

As it appears in React DevTools (context providers and router internals left out). **S** marks a
Server Component (no JavaScript sent for it); everything else is a Client Component.

```text
<RootLayout>  S                           app/layout.tsx: html, font links, metadata, providers
└── <CartProvider>                        features/cart/CartProvider.tsx
    │   State: lines [{ id, qty }] (saved to localStorage), isOpen
    └── <AddToCartBridge>                 app/layout/: gives the products feature the cart's addItem
        └── <div.app-layout>
            ├── <AnnouncementBar>  S
            ├── <Header>                  reads useCart() for the bag count
            │   └── <NavLink>, <ShopLink> ×4    aria-current on the shown page / collection
            ├── <main> {the current page}
            ├── <Footer>  S
            │   └── <ShopLink> ×4, <NavLink> ×3
            └── <CartPanel>               reads useCart(); Escape closes it
                └── <CartView>
                    ├── <Skeleton>                          until the saved bag has been read
                    ├── <EmptyCart>                         when no lines are saved
                    └── <AsyncBoundary>                     skeleton / "Try again"
                        └── <PricedCart>                    usePricedCart() → use(loadProducts())
                            └── <CartItem> ×n               key = product.id

Pages (src/app/**/page.tsx):
/                    <Hero> → <Sprig>, <HeroWatch>; <CollectionGrid>; <CraftSection>;
                     <Testimonials>; <Newsletter> (State: email, isSubmitted)

/shop                <ProductsSection>    useShopFilters(): the URL owns q, category, sort
                     └── <AsyncBoundary>  <ShopSkeleton> / "Try again"
                         └── <ShopCatalog>    use(loadProducts()); filtered list calculated in render
                             ├── <SearchAndFilter>
                             └── <ProductList>    empty / no-match states, or the grid
                                 └── <ProductCard> ×n   key = product.id; State: isSaved

/products/[id]       <ProductDetails>     parses the id with Zod
                     ├── <ProductNotFound>    invalid id (no request)
                     └── <AsyncBoundary key={id}>   <ProductDetailsSkeleton> / "Try again"
                         └── <ProductInfo>    use(loadProduct(id)); null → <ProductNotFound>

/cart                <CartView>           same component as in the drawer

/checkout            <OrderSummary>
                     ├── <StatePanel>         empty bag
                     └── <AsyncBoundary>      <OrderSummarySkeleton> / "Try again"
                         └── <PricedSummary>
                             └── <PlaceOrderForm>         usePlaceOrder()
                                 └── <CheckoutForm>       useForm + zodResolver; shadcn Label/Input/Button

/order-confirmation  <OrderConfirmation>  reads the order saved in sessionStorage (Zod-validated)
not-found.tsx        <StatePanel>
error.tsx            <StatePanel>         "Something went wrong" with a Try again button
```

---

## 🛠️ Project Structure

```text
shopboard-nextjs/
├── .claude/skills/                     # Vercel agent skills (see below)
├── public/favicon.svg
├── scripts/check-no-as-const.mjs       # Rejects `as const` (oxlint allows it)
├── src/
│   ├── instrumentation-client.ts       # Keeps expected ApiError logs out of the Console
│   ├── app/                            # Routes and composition only
│   │   ├── layout.tsx / App.css        # Root layout (providers, shell) / the site's styles
│   │   ├── page.tsx, not-found.tsx, error.tsx
│   │   ├── shop/                       # page.tsx, loading.tsx
│   │   ├── products/[id]/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── checkout/                   # page.tsx, PlaceOrderForm.tsx
│   │   ├── order-confirmation/page.tsx
│   │   └── layout/                     # Header, Footer, AnnouncementBar, NavLink, ShopLink,
│   │                                   # AddToCartBridge
│   ├── features/
│   │   ├── products/                   # Shop, filters (URL), product page, AddToCartContext
│   │   │   ├── components/             # ProductsSection, ShopCatalog, SearchAndFilter, ProductList,
│   │   │   │                           # ProductCard, ProductDetails, ProductInfo, ProductNotFound,
│   │   │   │                           # CollectionGrid, Skeletons
│   │   │   ├── useShopFilters.ts       # Filters read from / written to the URL
│   │   │   ├── logic.ts                # Pure search, filter, sort and URL helpers
│   │   │   ├── schemas.ts / types.ts   # Sort and product-id schemas, inferred types
│   │   │   └── collections.ts          # Bags, Shoes, Accessories and their icons
│   │   ├── cart/                       # The bag
│   │   │   ├── CartProvider.tsx        # Single owner of { id, qty } lines and the drawer
│   │   │   ├── usePricedCart.ts        # Lines joined with the catalog (prices, totals)
│   │   │   ├── usePlaceOrder.ts        # Order snapshot → confirmation page → clear the bag
│   │   │   ├── storage.ts              # localStorage: the bag, validated with Zod
│   │   │   ├── orderStorage.ts         # sessionStorage: the order for the confirmation page
│   │   │   └── components/             # CartPanel, CartView, PricedCart, CartItem, EmptyCart,
│   │   │                               # OrderSummary, OrderConfirmation, CartBoundary, Skeletons
│   │   ├── checkout/                   # CheckoutForm, schema.ts (every rule), fields.ts
│   │   └── home/                       # Hero, HeroWatch, CraftSection, Testimonials, Newsletter
│   └── shared/
│       ├── api/                        # client (only fetch), endpoints, schemas, cache, products
│       ├── config/brand.ts             # BRAND_NAME
│       ├── lib/format.ts               # formatPrice
│       ├── styles/                     # global.css (tokens, base layer), tailwind.css
│       ├── types.ts                    # Product (inferred from its schema)
│       └── ui/                         # Icon, StatePanel, AsyncBoundary, shadcn button/input/label
├── .env.example                        # API base URL plus the delay/fail/empty test URLs
├── components.json                     # shadcn/ui CLI config (writes to src/shared/ui)
├── next.config.ts, postcss.config.mjs, tsconfig.json, .oxlintrc.json, .prettierrc.json
├── CLAUDE.md                           # Development guidelines and rules
└── debug-lab-log.md                    # Analysis of the Debug Lab bugs (task 2 era)
```

**Import rules:** features import from `shared/` and never from each other; `app/` imports features
only through their `index.ts`; `shared/` imports nothing from `features/` or `app/`.

**Agent skills:** `.claude/skills/vercel-react-best-practices` and
`.claude/skills/vercel-composition-patterns` are copied unmodified from
[vercel-labs/agent-skills@1a2c79d](https://github.com/vercel-labs/agent-skills/tree/1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62/skills)
(`skills/react-best-practices` and `skills/composition-patterns`). They were not installed with
`npx skills add` because that runs a package downloaded from npm, which our tooling policy blocked.
The repository was cloned as plain files instead, reviewed (Markdown only, no scripts), and copied.
The committed folders have the same git tree hashes as upstream.

---

## ⚡ How It Works

1. **Server shell, browser data.** The layout, header links, footer and home page are rendered on
   the server. Everything that reads the API (shop, product, bag, order summary) renders its
   skeleton on the server and fetches in the browser: the bag has to be priced in the browser
   anyway, so one shared request cache serves every page.
2. **Data loading with Suspense.** Components read the API with React 19 `use()` from a small promise
   cache (`shared/api/products.ts`). Every data region has its own `AsyncBoundary`: a skeleton while
   loading and an error boundary whose **Try again** clears the failed request and refetches. All
   responses are validated with Zod.
3. **One owner per piece of state.** The bag lines live in `CartProvider`; shop filters live in the
   URL; prices, totals and filtered lists are calculated during render, never stored.
4. **A bag that stores no prices, and no hydration mismatch.** `localStorage` (`wtc_cart_items_v1`)
   holds only `[{ id, qty }]`. The server and the first browser render both start from "not read
   yet"; the saved bag is read right after hydration, and the bag views show a skeleton until then.
   Lines whose product the API does not have right now are hidden and explained, never deleted.
5. **Checkout.** react-hook-form with one Zod schema; labels, autocomplete, linked error messages and
   focus on the first invalid field. There is no order endpoint: placing an order saves the order in
   `sessionStorage`, opens the confirmation page and empties the bag in the same transition, so
   checkout never flashes an empty bag. The confirmation survives a reload.
6. **Filters in the URL.** Search, collection and sort are written with the History API, which
   Next.js feeds into `useSearchParams`, so they need no server request. Back and Forward keep the
   box and the list in sync, and fast typing never drops a letter (`useOptimistic` shows the typed
   text while Next.js applies the URL change).
7. **Type safety.** Strict TypeScript; no `any`, type assertions, non-null assertions or `as const`
   (enforced by oxlint and `scripts/check-no-as-const.mjs`).
8. **Styling.** The site is plain CSS. Tailwind is loaded through PostCSS without its reset and in
   cascade layers, only for the shadcn/ui components and the checkout form, so it does not change
   the rest of the site.

### What Next.js replaced

| Built by hand before (Vite + React Router)          | Next.js now                                                |
| :-------------------------------------------------- | :--------------------------------------------------------- |
| `router.tsx`, `RootLayout`, `Outlet`                | Folders in `src/app/` and `layout.tsx`                     |
| `React.lazy` pages and `<Suspense>` around `Outlet` | Automatic code splitting per route                         |
| `NotFoundPage` and the `*` route                    | `not-found.tsx` (and a real 404 status)                    |
| `index.html` head, `main.tsx`                       | `layout.tsx` and the `metadata` export                     |
| `Link`, `NavLink`, `useParams`                      | `next/link`, a small `NavLink`, `await params` in the page |
| `flushSync` on `setSearchParams` for fast typing    | History API plus `useOptimistic`                           |
| Order in router state                               | The order in `sessionStorage`                              |
| `onCaughtError` on `createRoot`                     | `instrumentation-client.ts` (Next.js owns the root)        |
| `@tailwindcss/vite`                                 | `@tailwindcss/postcss`                                     |

### Code splitting

Each `page.tsx` is its own entry, so a route's client code loads when the route is opened.
In the production build, the chunks shared by every route are 4 files (142 KB); each route's own
chunks are small, and `/checkout` is the largest because it brings react-hook-form, the Zod
resolver and the shadcn components:

| Route                 | Chunks only this route loads                               |
| :-------------------- | :--------------------------------------------------------- |
| `/`                   | 1.3 KB                                                     |
| `/shop`               | 7.1 KB                                                     |
| `/products/[id]`      | 3.5 KB                                                     |
| `/cart`               | none (the bag code is in the drawer, which every page has) |
| `/checkout`           | 73.9 KB                                                    |
| `/order-confirmation` | 2.0 KB                                                     |

To check it yourself, run `npm run build` and compare the `entryJSFiles` lists in
`.next/server/app/**/page_client-reference-manifest.js`. `package.json` keeps
`"sideEffects": ["*.css"]` so barrel files do not pull other pages' code into the shared chunks.
