'use client'

import React from 'react';
import Image from 'next/image';
import { useCartStore } from '@/app/hooks/cart';
import { Trash2, ShoppingBag } from 'lucide-react';

const CartSummary = () => {
    const { items, clearCart, getFormattedSubtotal, getTotalItems } = useCartStore();

    if (items.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Your cart is empty</h3>
                <p className="text-gray-500">Add some products to get started!</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Cart Summary</h3>
                <button
                    onClick={clearCart}
                    className="text-red-500 hover:text-red-700 transition-colors flex items-center gap-2"
                >
                    <Trash2 className="w-4 h-4" />
                    Clear Cart
                </button>
            </div>

            {/* Cart Items Preview */}
            <div className="space-y-3 mb-6">
                {items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Image
                            src={typeof item.image === 'string' ? item.image : item.image}
                            alt={item.name}
                            width={60}
                            height={60}
                            className="w-15 h-15 object-contain rounded-lg border border-gray-200"
                        />
                        <div className="flex-1">
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-semibold text-sm">
                            TZS {(item.price * item.quantity).toFixed(2)}
                        </span>
                    </div>
                ))}
                
                {items.length > 3 && (
                    <p className="text-center text-gray-500 text-sm">
                        +{items.length - 3} more items
                    </p>
                )}
            </div>

            {/* Total and Checkout */}
            <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold">Total ({getTotalItems()} items):</span>
                    <span className="text-xl font-bold text-blue-600">{getFormattedSubtotal()}</span>
                </div>
                
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    Proceed to Checkout
                </button>
            </div>
        </div>
    );
};

export default CartSummary;
