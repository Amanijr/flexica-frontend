'use client'
import { useCartStore, useCartWithSync } from '@/app/hooks/cart';
import { StaticImageData } from 'next/image';
import Image from 'next/image';
import React from 'react'

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string | StaticImageData;
}

const CartItemComponent = () => {
    
    const { items, removeItem, addItem, getTotalItems, updateQuantity, getFormattedSubtotal } = useCartStore();

    
    const syncedCart = useCartWithSync();

    const handleRemove = async (id: string) => {
        await syncedCart.removeItem(id); // will remove locally + sync backend
    };

    const handleQuantityChange = async (id: string, amount: number) => {
        await syncedCart.updateQuantity(id, amount); // updates locally + backend
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-2xl font-semibold mb-6 text-center">Your cart items</h1>
            <a
                href="/"
                className="block mb-6 text-blue-600 hover:underline text-sm text-center"
            >
                Back to shopping
            </a>
            <div className="hidden md:grid grid-cols-4 font-medium text-gray-600 border-b pb-2 mb-4">
                <span>Product</span>
                <span>Price</span>
                <span>Quantity</span>
                <span>Total</span>
            </div>

            {items.length === 0 ? (
                <p className="text-center text-gray-500">Your cart is empty</p>
            ) : (
                items.map((item) => (
                    <div
                        key={item.id}
                        className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 border-b py-4"
                    >
                        <div className="flex items-center gap-3">
                            <Image
                                src={typeof item.image === 'string' ? item.image : item.image}
                                alt={item.name}
                                width={100}
                                height={100}
                                className="w-24 h-24 object-contain rounded-lg border-2 border-gray-200 shadow-sm"
                            />
                            <div>
                                <p className="font-medium">{item.name}</p>
                                <button
                                    onClick={() => handleRemove(item.id)}
                                    className="text-blue-500 text-sm hover:underline"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>

                        <p className="text-gray-700 md:text-center">TZS {item.price.toFixed(2)}</p>

                        <div className="flex items-center border rounded w-28 justify-between mx-auto">
                            <button
                                onClick={() => handleQuantityChange(item.id, -1)}
                                className="px-2 text-lg"
                            >
                                -
                            </button>
                            <span>{item.quantity}</span>
                            <button
                                onClick={() => handleQuantityChange(item.id, +1)}
                                className="px-2 text-lg"
                            >
                                +
                            </button>
                        </div>

                        <p className="text-gray-900 font-medium md:text-center">
                            TZS {(item.price * item.quantity).toFixed(2)}
                        </p>
                    </div>
                ))
            )}

            {items.length > 0 && (
                <div className="flex flex-col md:flex-row justify-between items-center mt-6 border-t pt-4 gap-4">
                    <p className="text-sm text-gray-500">
                        Tax and shipping cost will be calculated later
                    </p>
                    <div className="flex items-center gap-6">
                        <p className="text-lg font-medium">
                            Sub-total: {getFormattedSubtotal()}
                        </p>
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
                            Check-out
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CartItemComponent
