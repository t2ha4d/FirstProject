import { createBrowserRouter } from 'react-router'
import { RootLayout } from './layout/RootLayout'
import { HomePage, NotFoundPage, ShopPage } from './pages'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'shop', element: <ShopPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
