import { createBrowserRouter } from 'react-router'
import { RootLayout } from './layout/RootLayout'
import {
  CartPage,
  CheckoutPage,
  HomePage,
  NotFoundPage,
  OrderConfirmationPage,
  ProductPage,
  ShopPage,
} from './pages'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'shop', element: <ShopPage /> },
      { path: 'products/:id', element: <ProductPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'order-confirmation', element: <OrderConfirmationPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
