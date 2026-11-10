import { Suspense } from 'react'
import { Outlet, ScrollRestoration } from 'react-router'
import { ANNOUNCEMENTS } from '../../features/home'
import { CartPanel, useCart } from '../../features/cart'
import { AddToCartContext } from '../../features/products'
import { AnnouncementBar } from './AnnouncementBar'
import { Footer } from './Footer'
import { Header } from './Header'

const PAGE_FALLBACK = (
  <div className="section">
    <p className="page-loading" role="status">
      Loading…
    </p>
  </div>
)

/**
 * The frame around every page: announcement bar, header, the page itself, footer and bag.
 * It also hands the cart's add action to the products feature, which cannot import the cart.
 */
export function RootLayout() {
  const cart = useCart()

  return (
    <div className="app-layout">
      <ScrollRestoration />
      <AnnouncementBar messages={ANNOUNCEMENTS} />
      <Header />
      <main>
        <AddToCartContext value={cart.addItem}>
          <Suspense fallback={PAGE_FALLBACK}>
            <Outlet />
          </Suspense>
        </AddToCartContext>
      </main>
      <Footer />
      <CartPanel />
    </div>
  )
}
