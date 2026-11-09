import { CatalogCartProvider } from './CatalogCartProvider'
import { CatalogProvider } from './features/products'
import { Storefront } from './Storefront'
import './App.css'

export default function App() {
  return (
    <CatalogProvider>
      <CatalogCartProvider>
        <Storefront />
      </CatalogCartProvider>
    </CatalogProvider>
  )
}
