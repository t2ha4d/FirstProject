import { lazy } from 'react'

// Each page is its own chunk, downloaded the first time the page is opened.
export const HomePage = lazy(() => import('./HomePage').then((m) => ({ default: m.HomePage })))
export const ShopPage = lazy(() => import('./ShopPage').then((m) => ({ default: m.ShopPage })))
export const ProductPage = lazy(() =>
  import('./ProductPage').then((m) => ({ default: m.ProductPage })),
)
export const NotFoundPage = lazy(() =>
  import('./NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
)
