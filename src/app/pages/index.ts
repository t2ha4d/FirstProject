import { lazy } from 'react'

// Each page is its own chunk, downloaded the first time the page is opened.
export const HomePage = lazy(() => import('./HomePage').then((m) => ({ default: m.HomePage })))
export const ShopPage = lazy(() => import('./ShopPage').then((m) => ({ default: m.ShopPage })))
export const ProductPage = lazy(() =>
  import('./ProductPage').then((m) => ({ default: m.ProductPage })),
)
export const CartPage = lazy(() => import('./CartPage').then((m) => ({ default: m.CartPage })))
export const CheckoutPage = lazy(() =>
  import('./CheckoutPage').then((m) => ({ default: m.CheckoutPage })),
)
export const OrderConfirmationPage = lazy(() =>
  import('./OrderConfirmationPage').then((m) => ({ default: m.OrderConfirmationPage })),
)
export const NotFoundPage = lazy(() =>
  import('./NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
)
