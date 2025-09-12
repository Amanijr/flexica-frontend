import React from 'react'
import CartItem from '../components/cart/CartItem'
import { AuthGuard } from '../auth/authGuard'

const page = () => {
  return (
    <div>
       <AuthGuard>
        <CartItem/>
       </AuthGuard>
    </div>
  )
}

export default page