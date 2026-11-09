import { CartProvider } from './features/cart'
import { CatalogProvider } from './features/products'
import { Storefront } from './Storefront'
import './App.css'

export default function App() {
  return (
    <CatalogProvider>
      <CartProvider>
        <Storefront />
      </CartProvider>
    </CatalogProvider>
  )
}
