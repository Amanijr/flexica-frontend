"use client";
import React from 'react';
import CartSyncStatus from './CartSyncStatus';
import { useCartStore } from '../../hooks/cart';
import { useSession } from '../../auth/SessionContext';

/**
 * Example component showing how to use CartSyncStatus
 * This can be placed in your cart page, header, or anywhere you want to show sync status
 */
const CartSyncExample: React.FC = () => {
  const cartItems = useCartStore((state) => state.items);
  const { session } = useSession();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Cart Sync Status</h2>
      
      {/* Simple sync status */}
      <CartSyncStatus />
      
      {/* Detailed sync status with options */}
      <CartSyncStatus showDetails={true} />
      
      {/* Debug information */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Debug Info:</h3>
        <p>Logged in: {session ? 'Yes' : 'No'}</p>
        <p>Local cart items: {cartItems.length}</p>
        <p>Cart items: {JSON.stringify(cartItems, null, 2)}</p>
      </div>
    </div>
  );
};

export default CartSyncExample;