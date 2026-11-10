import { RouterProvider } from 'react-router/dom'
import { CatalogCartProvider } from './CatalogCartProvider'
import { CatalogProvider } from '../features/products'
import { router } from './router'
import './App.css'

export default function App() {
  return (
    <CatalogProvider>
      <CatalogCartProvider>
        <RouterProvider router={router} />
      </CatalogCartProvider>
    </CatalogProvider>
  )
}
