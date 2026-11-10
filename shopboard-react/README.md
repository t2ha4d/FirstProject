# WTC — React + TypeScript Store

A multi-page store for bags, shoes and accessories, built with **React 19**, **TypeScript**,
**Vite** and **React Router**. Products come from the
[ShopBoard API](https://shopboard-api.vercel.app); the bag is saved in `localStorage`. The code is
organised by feature: each feature owns its state, `shared/` holds code used by more than one
feature, and `app/` composes them into pages.

---

## 🚀 Getting Started

```bash
npm install            # also installs the pre-commit hook
cp .env.example .env   # optional: pick another API base URL (see "Testing the UI states")
npm run dev            # http://localhost:5173
```

| Command                | What it does                             |
| :--------------------- | :--------------------------------------- |
| `npm run dev`          | Start the Vite dev server                |
| `npm run typecheck`    | TypeScript check (`tsc -b`)              |
| `npm run lint`         | oxlint plus the `as const` check         |
| `npm run format`       | Format everything with Prettier          |
| `npm run format:check` | Verify formatting (`prettier --check .`) |
| `npm run build`        | Type-check and build for production      |
| `npm run preview`      | Serve the production build               |

The pre-commit hook runs `typecheck`, `lint`, `format:check` and `build`, and blocks the commit if
any of them fails.

---

## 🗺️ Routes

Every page is lazy loaded, so its code downloads the first time the page is opened.

| Path                  | Page                    | What it shows                                                               |
| :-------------------- | :---------------------- | :-------------------------------------------------------------------------- |
| `/`                   | `HomePage`              | Hero, collections, craft story, testimonials, newsletter                    |
| `/shop`               | `ShopPage`              | Catalog with search, collection and sort in the URL (`?q=&category=&sort=`) |
| `/products/:id`       | `ProductPage`           | One product loaded by id; invalid or unknown ids show "Product not found"   |
| `/cart`               | `CartPage`              | The bag with quantity controls and totals                                   |
| `/checkout`           | `CheckoutPage`          | Shipping form next to the order summary                                     |
| `/order-confirmation` | `OrderConfirmationPage` | The order just placed, or "No recent order" when opened directly            |
| `*`                   | `NotFoundPage`          | Page not found                                                              |

---

## 🧪 Testing the UI States

The API can pretend to be slow, broken or empty. Set `VITE_API_BASE_URL` in `.env` (the four values
are also in `.env.example`) and restart `npm run dev`:

| State   | `VITE_API_BASE_URL`                               | What you should see                                                                                                     |
| :------ | :------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------- |
| Normal  | `https://shopboard-api.vercel.app/api`            | 12 products; product pages, bag and checkout priced                                                                     |
| Loading | `https://shopboard-api.vercel.app/delay/3000/api` | Skeletons shaped like the shop grid, product page, bag lines and order summary for 3 seconds; header and footer at once |
| Error   | `https://shopboard-api.vercel.app/fail/500/api`   | Each data region (shop, product, bag, drawer, order summary) shows its own error with **Try again**; navigation works   |
| Empty   | `https://shopboard-api.vercel.app/empty/api`      | Shop: "No products available". Bag: saved items "not available right now". Product pages still load by id               |

Other things to try:

- **No search matches:** `/shop?q=zzz` shows a "Clear all filters" button.
- **Empty bag:** `/cart` and `/checkout` with nothing saved show a link to the shop.
- **Not found:** `/products/99999`, `/products/abc` and any unknown URL.
- **Saved bag survives errors:** add items, switch to the `/fail` or `/empty` URL and back; the bag is
  unchanged, because only the customer's own actions change it.

---

## 🏗️ Component Tree

As it appears in React DevTools (context providers and router internals left out).

```text
<App>                                     app/App.tsx
└── <CartProvider>                        features/cart/CartProvider.tsx
    │   State: lines [{ id, qty }] (saved to localStorage), isOpen
    └── <RouterProvider>
        └── <RootLayout>                  app/layout/RootLayout.tsx
            │   Provides AddToCartContext (the cart's addItem) to the products feature
            ├── <AnnouncementBar>
            ├── <Header>                  reads useCart() for the bag count
            │   └── <ShopLink> ×4         aria-current on the shown collection
            ├── <main> <Suspense> <Outlet>      ← the current page, lazy loaded
            ├── <Footer>
            │   └── <ShopLink> ×4, <NavLink> ×2
            └── <CartPanel>               reads useCart(); Escape closes it
                └── <CartView>
                    ├── <EmptyCart>                         when no lines are saved
                    └── <AsyncBoundary>                     skeleton / "Try again"
                        └── <PricedCart>                    usePricedCart() → use(loadProducts())
                            └── <CartItem> ×n               key = product.id

Pages (app/pages/):
<HomePage>
├── <Hero> → <Sprig>, <HeroWatch>
├── <CollectionGrid>                      links to /shop?category=…
├── <CraftSection>
├── <Testimonials>
└── <Newsletter>                          State: email, isSubmitted

<ShopPage> → <ProductsSection>            useShopFilters() (URL search params)
             └── <AsyncBoundary>          <ShopSkeleton> / "Try again"
                 └── <ShopCatalog>        use(loadProducts()); filtered list calculated in render
                     ├── <SearchAndFilter>
                     └── <ProductList>    empty / no-match states, or the grid
                         └── <ProductCard> ×n   key = product.id; State: isSaved; useAddToCart()

<ProductPage> → <ProductDetails>          parses :id with Zod
                ├── <ProductNotFound>     invalid id (no request)
                └── <AsyncBoundary key={id}>   <ProductDetailsSkeleton> / "Try again"
                    └── <ProductInfo>     use(loadProduct(id)); null → <ProductNotFound>

<CartPage> → <CartView>                   same component as in the drawer

<CheckoutPage> → <OrderSummary>
                 ├── <StatePanel>         empty bag
                 └── <AsyncBoundary>      <OrderSummarySkeleton> / "Try again"
                     └── <PricedSummary>
                         └── <PlaceOrderForm>         usePlaceOrder()
                             └── <CheckoutForm>       useForm + zodResolver; shadcn Label/Input/Button

<OrderConfirmationPage> → <OrderConfirmation>   reads the order from router state (Zod-validated)
<NotFoundPage> → <StatePanel>
```

---

## 🛠️ Project Structure

```text
shopboard-react/
├── .claude/skills/                     # Vercel agent skills (see below)
├── .husky/pre-commit                   # typecheck, lint, format:check, build
├── public/favicon.svg
├── scripts/check-no-as-const.mjs       # Rejects `as const` (oxlint allows it)
├── src/
│   ├── main.tsx                        # createRoot, global CSS, onCaughtError
│   ├── vite-env.d.ts                   # Typed VITE_API_BASE_URL
│   ├── app/                            # Composition only
│   │   ├── App.tsx / App.css           # Providers + router / the site's styles
│   │   ├── router.tsx                  # Route table
│   │   ├── layout/                     # RootLayout, Header, Footer, AnnouncementBar, ShopLink
│   │   └── pages/                      # One thin page per route; index.ts lazy-loads them
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
│   │   │   ├── storage.ts / schemas.ts # localStorage load/save, validated with Zod
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
├── CLAUDE.md                           # Development guidelines and rules
├── debug-lab-log.md                    # Analysis of the Debug Lab bugs
└── vite.config.ts / tsconfig*.json / .oxlintrc.json / .prettierrc.json
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

1. **Data loading with Suspense.** Components read the API with React 19 `use()` from a small promise
   cache (`shared/api/products.ts`). Every data region has its own `AsyncBoundary`: a skeleton while
   loading and an error boundary whose **Try again** clears the failed request and refetches. All
   responses are validated with Zod.
2. **One owner per piece of state.** The bag lines live in `CartProvider`; shop filters live in the
   URL; prices, totals and filtered lists are calculated during render, never stored.
3. **A bag that stores no prices.** `localStorage` (`wtc_cart_items_v1`) holds only `[{ id, qty }]`.
   Lines whose product the API does not have right now are hidden and explained, never deleted.
4. **Checkout.** react-hook-form with one Zod schema; labels, autocomplete, linked error messages and
   focus on the first invalid field. There is no order endpoint: placing an order shows the
   confirmation with the order in router state and empties the bag.
5. **Type safety.** Strict TypeScript; no `any`, type assertions, non-null assertions or `as const`
   (enforced by oxlint and `scripts/check-no-as-const.mjs`).
6. **Styling.** The site is plain CSS. Tailwind is loaded without its reset and in cascade layers,
   only for the shadcn/ui components and the checkout form, so it does not change the rest of the site.
