

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SessionProvider } from './auth/SessionContext'
import UniversalLayout from './components/layout/UniversalLayout'
import { CartSyncOnLogin } from './components/cart/CartSyncOnLogin'
import CartInitializer from './components/cart/CartInitializer'

const inter = Inter({ subsets: ['latin'] })

 export const metadata: Metadata = {
  title: 'Flexica E-commerce',
  description: 'Your one-stop shop for everything you need',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          {/* Initialize cart and automatically merge after login */}
          <CartInitializer />
          <CartSyncOnLogin /> 
          <UniversalLayout>
            {children}
          </UniversalLayout>
        </SessionProvider>
      </body>
    </html>
  )
}
