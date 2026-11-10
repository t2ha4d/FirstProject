import { useCart } from '../../features/cart'
import { ProductsSection } from '../../features/products'

export function ShopPage() {
  const cart = useCart()
  return <ProductsSection onAddToCart={cart.addItem} />
}
