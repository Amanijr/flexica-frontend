

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SessionProvider } from './auth/SessionContext'
import UniversalLayout from './components/layout/UniversalLayout'
import { CartSyncOnLogin } from './components/cart/CartSyncOnLogin'

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
          {/* Automatically merge cart after login */}
          <CartSyncOnLogin /> 
          <UniversalLayout>
            {children}
          </UniversalLayout>
        </SessionProvider>
      </body>
    </html>
  )
}
