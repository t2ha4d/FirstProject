import { createBrowserRouter } from 'react-router'
import { RootLayout } from './layout/RootLayout'
import { HomePage, NotFoundPage, ProductPage, ShopPage } from './pages'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'shop', element: <ShopPage /> },
      { path: 'products/:id', element: <ProductPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
