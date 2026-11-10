# WTC — React + TypeScript Watch Store

A watch storefront built with **React 19**, **TypeScript** and **Vite**, organised by feature:
each feature owns its state, `shared/` holds code used by more than one feature, and `app/`
composes them into the page.

---

## 🏗️ React DevTools Component Tree

The hierarchy as it appears in the **React DevTools Components tab** (context providers such
as `CatalogContext` and `CartContext` also show up between the provider components and their
children). State lives in the two feature providers; everything below them is presentational
or reads a provider through a hook.

```text
<App>                                  [src/app/App.tsx]
 │  Props: none · State: none
 │
 └── <CatalogProvider>                 [src/features/products/CatalogProvider.tsx]
      │  Props: children
      │  State Owned:
      │    • products: Product[]
      │    • status: ApiStatus ('idle' | 'loading' | 'error' | 'success')
      │    • errorMessage: string
      │    • reloadCount: number (bumped by "Try again" to refetch)
      │    • filters: FilterState ({ searchQuery, selectedCategory, sortBy })
      │
      └── <CatalogCartProvider>        [src/app/CatalogCartProvider.tsx]
           │  Props: children · State: none
           │  Reads useCatalog() and passes products to the cart, so neither feature imports the other.
           │
           └── <CartProvider>          [src/features/cart/CartProvider.tsx]
                │  Props: products, isCatalogReady, children
                │  State Owned:
                │    • lines: CartLine[] ({ id, qty }, persisted to localStorage)
                │    • isOpen: boolean (drawer visibility)
                │
                └── <Storefront>       [src/app/Storefront.tsx]
                     │  Props: none · State: none
                     │  Reads useShopNavigation() and useCart().
                     │
                     ├── <AnnouncementBar>     [src/app/layout/AnnouncementBar.tsx]
                     │     Props: messages
                     │
                     ├── <Header>              [src/app/layout/Header.tsx]
                     │     Props: cartCount, onOpenCart, onOpenSearch, onShopAll, onSelectCollection
                     │     └── <Icon>
                     │
                     ├── <Hero>                [src/features/home/components/Hero.tsx]
                     │     Props: onShopAll
                     │     ├── <Sprig>
                     │     └── <WatchIllustration>
                     │
                     ├── <CollectionGrid>      [src/features/products/components/CollectionGrid.tsx]
                     │     Props: onSelectCollection
                     │     ├── <WatchIllustration>   (one per collection, key=name)
                     │     └── <Icon>
                     │
                     ├── <ProductsSection>     [src/features/products/components/ProductsSection.tsx]
                     │    │  Props: onAddToCart · Reads useCatalog()
                     │    │
                     │    ├── <SearchAndFilter>     [.../products/components/SearchAndFilter.tsx]
                     │    │     Props: categories, filters, totalResults, onSearchChange,
                     │    │            onCategoryChange, onSortChange, onResetFilters
                     │    │     └── <Icon>
                     │    │
                     │    └── <ProductList>         [.../products/components/ProductList.tsx]
                     │         │  Props: products, status, errorMessage?, totalCatalogCount,
                     │         │         onRetry, onAddToCart, onResetFilters
                     │         │
                     │         └── <ProductCard>    [.../products/components/ProductCard.tsx]
                     │               (one per product, key=product.id)
                     │               Props: product, onAddToCart
                     │               State Owned: isSaved: boolean (local favourite toggle)
                     │               ├── <WatchIllustration>
                     │               └── <Icon>
                     │
                     ├── <CraftSection>        [src/features/home/components/CraftSection.tsx]
                     │     Props: onShopAll
                     │     ├── <MovementIllustration>
                     │     └── <Icon>
                     │
                     ├── <Lookbook>            [src/features/home/components/Lookbook.tsx]
                     │     Props: onShopAll
                     │     └── <WatchIllustration>   (one per tile, key=id)
                     │
                     ├── <Testimonials>        [src/features/home/components/Testimonials.tsx]
                     │     Props: testimonials
                     │
                     ├── <Newsletter>          [src/features/home/components/Newsletter.tsx]
                     │     Props: onSubscribe? (not passed yet)
                     │     State Owned: email: string, isSubmitted: boolean
                     │
                     ├── <Footer>              [src/app/layout/Footer.tsx]
                     │     Props: onShopAll, onSelectCollection
                     │     ├── <Icon>
                     │     └── <WatchIllustration>
                     │
                     └── <CartPanel>           [src/features/cart/components/CartPanel.tsx]
                          │  Props: ariaLabel? · Reads useCart()
                          │
                          └── <CartDrawer>     [src/features/cart/components/CartDrawer.tsx]
                               │  Props: isOpen, isResolving, ariaLabel, items, subtotalFormatted,
                               │         totalCount, onClose, onIncrement, onDecrement, onRemove, onClear
                               │  Escape key handled in useEffect · renders nothing while closed
                               │
                               └── <CartItem>  [src/features/cart/components/CartItem.tsx]
                                     (one per entry, key=item.product.id)
                                     Props: item, onIncrement, onDecrement, onRemove
```

Every `<WatchIllustration>` ([src/shared/ui/WatchIllustration.tsx](src/shared/ui/WatchIllustration.tsx), props: `design`, `label?`, `className?`) renders the same four parts from `src/shared/ui/watch/`:

```text
<WatchIllustration>
 ├── <WatchStrap>   Props: color, strapStyle
 ├── <WatchCase>    Props: metalFill, bezelColor?
 ├── <WatchDial>    Props: design, shadingFill
 └── <WatchHands>   Props: dialRadius, handColor, accentColor
```

---

## 📋 Component Summary Table

| Component              | Source File                                             | Props Interface             | State Owned                                                    |
| :--------------------- | :------------------------------------------------------ | :-------------------------- | :------------------------------------------------------------- |
| `App`                  | `src/app/App.tsx`                                       | none (root)                 | _None_                                                         |
| `CatalogCartProvider`  | `src/app/CatalogCartProvider.tsx`                       | `CatalogCartProviderProps`  | _None_                                                         |
| `Storefront`           | `src/app/Storefront.tsx`                                | none                        | _None_                                                         |
| `AnnouncementBar`      | `src/app/layout/AnnouncementBar.tsx`                    | `AnnouncementBarProps`      | _None_                                                         |
| `Header`               | `src/app/layout/Header.tsx`                             | `HeaderProps`               | _None_                                                         |
| `Footer`               | `src/app/layout/Footer.tsx`                             | `FooterProps`               | _None_                                                         |
| `CatalogProvider`      | `src/features/products/CatalogProvider.tsx`             | `CatalogProviderProps`      | `products`, `status`, `errorMessage`, `reloadCount`, `filters` |
| `ProductsSection`      | `src/features/products/components/ProductsSection.tsx`  | `ProductsSectionProps`      | _None_ (reads `useCatalog`)                                    |
| `SearchAndFilter`      | `src/features/products/components/SearchAndFilter.tsx`  | `SearchAndFilterProps`      | _None_                                                         |
| `ProductList`          | `src/features/products/components/ProductList.tsx`      | `ProductListProps`          | _None_                                                         |
| `ProductCard`          | `src/features/products/components/ProductCard.tsx`      | `ProductCardProps`          | `isSaved`                                                      |
| `CollectionGrid`       | `src/features/products/components/CollectionGrid.tsx`   | `CollectionGridProps`       | _None_                                                         |
| `CartProvider`         | `src/features/cart/CartProvider.tsx`                    | `CartProviderProps`         | `lines`, `isOpen`                                              |
| `CartPanel`            | `src/features/cart/components/CartPanel.tsx`            | `CartPanelProps`            | _None_ (reads `useCart`)                                       |
| `CartDrawer`           | `src/features/cart/components/CartDrawer.tsx`           | `CartDrawerProps`           | _None_                                                         |
| `CartItem`             | `src/features/cart/components/CartItem.tsx`             | `CartItemProps`             | _None_                                                         |
| `Hero`                 | `src/features/home/components/Hero.tsx`                 | `HeroProps`                 | _None_                                                         |
| `CraftSection`         | `src/features/home/components/CraftSection.tsx`         | `CraftSectionProps`         | _None_                                                         |
| `MovementIllustration` | `src/features/home/components/MovementIllustration.tsx` | `MovementIllustrationProps` | _None_                                                         |
| `Sprig`                | `src/features/home/components/Sprig.tsx`                | `SprigProps`                | _None_                                                         |
| `Lookbook`             | `src/features/home/components/Lookbook.tsx`             | `LookbookProps`             | _None_                                                         |
| `Testimonials`         | `src/features/home/components/Testimonials.tsx`         | `TestimonialsProps`         | _None_                                                         |
| `Newsletter`           | `src/features/home/components/Newsletter.tsx`           | `NewsletterProps`           | `email`, `isSubmitted`                                         |
| `Icon`                 | `src/shared/ui/Icon.tsx`                                | `IconProps`                 | _None_                                                         |
| `WatchIllustration`    | `src/shared/ui/WatchIllustration.tsx`                   | `WatchIllustrationProps`    | _None_                                                         |
| `WatchStrap`           | `src/shared/ui/watch/WatchStrap.tsx`                    | `WatchStrapProps`           | _None_                                                         |
| `WatchCase`            | `src/shared/ui/watch/WatchCase.tsx`                     | `WatchCaseProps`            | _None_                                                         |
| `WatchDial`            | `src/shared/ui/watch/WatchDial.tsx`                     | `WatchDialProps`            | _None_                                                         |
| `WatchHands`           | `src/shared/ui/watch/WatchHands.tsx`                    | `WatchHandsProps`           | _None_                                                         |

---

## 🛠️ Project Structure & Architecture

```text
shopboard-react/
├── .claude/skills/
│   ├── vercel-react-best-practices/    # Installed skill (vercel-labs/agent-skills)
│   └── vercel-composition-patterns/    # Installed skill (vercel-labs/agent-skills)
├── .husky/pre-commit                   # Runs lint-staged
├── public/
│   └── favicon.svg
├── scripts/
│   └── check-no-as-const.mjs           # Rejects `as const` (oxlint allows it)
├── src/
│   ├── main.tsx                        # Entry point
│   ├── vite-env.d.ts                   # Typed import.meta.env (VITE_API_BASE_URL)
│   ├── app/                            # Composition only: providers, page layout, styles
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── CatalogCartProvider.tsx     # Feeds catalog products into the cart
│   │   ├── Storefront.tsx              # Page sections in order
│   │   └── layout/                     # AnnouncementBar, Header, Footer
│   ├── features/
│   │   ├── products/                   # Catalog loading, filters, product grid
│   │   │   ├── index.ts                # Public API of the feature
│   │   │   ├── api.ts                  # fetchProducts + response validation
│   │   │   ├── CatalogContext.ts       # Context + useCatalog()
│   │   │   ├── CatalogProvider.tsx     # Owns catalog + filter state
│   │   │   ├── useShopNavigation.ts    # Filter-and-scroll actions for nav links
│   │   │   ├── collections.ts          # Collection names, icons, designs
│   │   │   ├── logic.ts                # Pure search / filter / sort helpers
│   │   │   ├── types.ts
│   │   │   └── components/             # ProductsSection, SearchAndFilter, ProductList,
│   │   │                               # ProductCard, CollectionGrid
│   │   ├── cart/                       # Bag state, storage and drawer
│   │   │   ├── index.ts
│   │   │   ├── CartContext.ts          # Context + useCart()
│   │   │   ├── CartProvider.tsx        # Owns { id, qty } lines + drawer state
│   │   │   ├── storage.ts              # localStorage load/save + legacy migration
│   │   │   ├── logic.ts                # Pure line reducers, pricing, totals
│   │   │   ├── types.ts
│   │   │   └── components/             # CartPanel, CartDrawer, CartItem
│   │   └── home/                       # Marketing sections
│   │       ├── index.ts
│   │       ├── content.ts              # Copy, lookbook tiles, testimonials
│   │       ├── types.ts
│   │       └── components/             # Hero, CraftSection, Lookbook, Testimonials,
│   │                                   # Newsletter, MovementIllustration, Sprig
│   └── shared/                         # Used by more than one feature
│       ├── api/client.ts               # apiGet + ApiError; the only place that calls fetch
│       ├── api/endpoints.ts            # Endpoint paths (no URLs in features)
│       ├── config/brand.ts             # BRAND_NAME
│       ├── lib/format.ts               # formatPrice
│       ├── lib/guards.ts               # Runtime type guards (no type assertions)
│       ├── styles/global.css           # Theme tokens and base styles
│       ├── types.ts                    # Product, WatchDesign, ApiStatus
│       └── ui/                         # Icon, WatchIllustration, watch/*, watchDesigns.ts
├── .env.example                        # VITE_API_BASE_URL plus the delay/fail/empty test URLs
├── .prettierrc.json / .prettierignore
├── .oxlintrc.json
├── CLAUDE.md                           # Development guidelines
├── debug-lab-log.md                    # Analysis of the Debug Lab bugs
└── package.json
```

**Import rules:** features import from `shared/` and never from each other; `app/` imports
features only through their `index.ts`; `shared/` imports nothing from `features/` or `app/`.

**Agent skills:** `.claude/skills/vercel-react-best-practices` and
`.claude/skills/vercel-composition-patterns` are copied unmodified from
[vercel-labs/agent-skills@1a2c79d](https://github.com/vercel-labs/agent-skills/tree/1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62/skills)
(`skills/react-best-practices` and `skills/composition-patterns`). They were not installed with
`npx skills add` because that runs a package downloaded from npm, which our tooling policy blocked.
The repository was cloned as plain files instead, reviewed (Markdown only, no scripts), and copied.
The committed folders have the same git tree hashes as upstream.

**Catalog source:** the ShopBoard API (`https://shopboard-api.vercel.app/api/products`). It sells
bags, shoes and accessories, so product cards show a category icon instead of a drawn watch.

---

## ⚡ Key Features

1. **Catalog over a real request**
   - Fetches the catalog from the ShopBoard API and validates every response with Zod.
   - All requests go through `shared/api/client.ts`. The base URL comes from `VITE_API_BASE_URL` (default `https://shopboard-api.vercel.app/api`).
   - Handles **Loading**, **Error** (with a "Try again" button), **Empty**, and **Success** states.

2. **Pure data transformation**
   - Search, collection filter and immutable sorting live in `features/products/logic.ts`.
   - Cart reducers and totals live in `features/cart/logic.ts`.

3. **Persistent cart that stores no prices**
   - `localStorage` (`wtc_cart_items_v1`) holds only `[{ id, qty }]`. Prices, titles and stock always come from the catalog.
   - Older `{ product, quantity }` entries are migrated on load.
   - No line is dropped before the catalog has loaded. Unknown products are pruned only after a successful load.

4. **Type safety**
   - `strict` TypeScript, `import type` for all types.
   - No `any`, no type assertions (`as`), no non-null assertions (`!`) and no `as const`. oxlint and `scripts/check-no-as-const.mjs` enforce this in `npm run lint` and the pre-commit hook.

5. **Accessibility & responsive design**
   - Labelled buttons and dialogs (`aria-label`, `aria-pressed`, `aria-modal`); `Escape` closes the bag.
   - Responsive from 320px phones to desktop.

---

## 🚀 Getting Started

```bash
npm install            # also installs the husky pre-commit hook
cp .env.example .env   # optional: change VITE_API_BASE_URL
npm run dev
```

| Command                | What it does                                   |
| :--------------------- | :--------------------------------------------- |
| `npm run dev`          | Start the Vite dev server                      |
| `npm run build`        | Type-check (`tsc -b`) and build for production |
| `npm run lint`         | oxlint plus the `as const` check               |
| `npm run format`       | Format everything with Prettier                |
| `npm run format:check` | Verify formatting (`prettier --check .`)       |
| `npm run preview`      | Preview the production build                   |

The pre-commit hook runs oxlint, the `as const` check and Prettier on staged files.
