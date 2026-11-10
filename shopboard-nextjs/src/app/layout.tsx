import type { Metadata } from 'next'
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
    <html lang="en">
      <head>
        {/* The site's two web fonts, loaded as before. next/font was tried and rejected: it puts
            its own size-adjusted Arial in front of the font stack, which draws glyphs the web
            fonts lack (the "←" in the back link) differently. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Jost:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
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
