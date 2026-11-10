import type { Metadata } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import type { ReactNode } from 'react'
import { CartPanel, CartProvider } from '../features/cart'
import { ANNOUNCEMENTS } from '../features/home'
import '../shared/styles/global.css'
import '../shared/styles/tailwind.css'
import './App.css'
import { AddToCartBridge } from './layout/AddToCartBridge'
import { AnnouncementBar } from './layout/AnnouncementBar'
import { Footer } from './layout/Footer'
import { Header } from './layout/Header'

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-serif',
})
const sans = Jost({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'WTC | Bags, Shoes and Accessories',
  description: 'WTC: thoughtfully crafted bags, shoes and accessories made for your everyday.',
  icons: { icon: '/favicon.svg' },
}

export interface RootLayoutProps {
  children: ReactNode
}

/**
 * The frame around every page: announcement bar, header, the page itself, footer and bag.
 * The cart is provided here, so it works on every page and survives navigation.
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <CartProvider>
          <AddToCartBridge>
            <div className="app-layout">
              <AnnouncementBar messages={ANNOUNCEMENTS} />
              <Header />
              <main>{children}</main>
              <Footer />
              <CartPanel />
            </div>
          </AddToCartBridge>
        </CartProvider>
      </body>
    </html>
  )
}
