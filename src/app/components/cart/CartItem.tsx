'use client'
import { useCartStore } from '@/app/hooks/cart';
import { StaticImageData } from 'next/image';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number; 
    image: string | StaticImageData;
}

// Safe transparent PNG fallback
const FALLBACK_IMG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO4m+oEAAAAASUVORK5CYII=';

const CartItemComponent = () => {
    
    const { items, removeItem, updateQuantity, getFormattedSubtotal } = useCartStore();

    const handleRemove = async (id: string) => {
        // Remove locally; store will attempt to sync to backend if user is authenticated
        removeItem(id);
    };

    const handleQuantityChange = async (id: string, amount: number, currentQty?: number) => {
        // If decrementing from quantity 1, remove the item to match expected UX
        if (amount < 0 && currentQty !== undefined && currentQty <= 1) {
            removeItem(id);
            return;
        }

        // Update quantity by delta; the store enforces a minimum quantity of 1
        updateQuantity(id, amount);
    };

    const getSafeSrc = (img: string | StaticImageData): string => {
        if (typeof img === 'string' && img) return img;
        // @ts-ignore - StaticImageData has a src field
        const src: string | undefined = img && (img as any).src;
        return src || FALLBACK_IMG;
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
                                src={getSafeSrc(item.image)}
                                alt={item.name}
                                width={100}
                                height={100}
                                className="w-24 h-24 object-contain rounded-lg border-2 border-gray-200 shadow-sm"
                            />
                            <div>
                                <p className="font-medium">{item.name}</p>
                                <button
                                    onClick={() => handleRemove(item.id)}
                                    aria-label={`Remove ${item.name} from cart`}
                                    className="text-blue-500 text-sm hover:underline"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>

                        <p className="text-gray-700 md:text-center">TZS {item.price.toFixed(2)}</p>

                        <div className="flex items-center border rounded w-28 justify-between mx-auto">
                            <button
                                onClick={() => handleQuantityChange(item.id, -1, item.quantity)}
                                aria-label={`Decrease quantity of ${item.name}`}
                                className="px-2 text-lg"
                            >
                                -
                            </button>
                            <span>{item.quantity}</span>
                            <button
                                onClick={() => handleQuantityChange(item.id, +1, item.quantity)}
                                aria-label={`Increase quantity of ${item.name}`}
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
                        <Link href="/checkout" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition inline-block">
    Check-out
</Link>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CartItemComponent
