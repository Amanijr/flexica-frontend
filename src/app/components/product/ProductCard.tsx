import React from 'react';
import Image from 'next/image';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { Product } from '@/app/types/product';

// Pass `product` and `handleAddToCart` as props
const ProductCard = ({ product, handleAddToCart }: { product: Product; handleAddToCart: () => void }) => {
  return (
    // Correctly wrapped in a single parent div
    <div
      key={product.id}
      className='bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center transition-transform hover:scale-105'
    >
        {/* Product Image Section */}
        <div className="w-full h-48 flex items-center justify-center mb-4">
            <Image
                src={product.image}
                alt={product.name}
                width={200}
                height={200}
                objectFit="contain"
                className="max-h-full max-w-full"
                priority
            />
        </div>

        {/* Product Details Section */}
        <div className='w-full'>
            <h3 className="text-lg font-bold capitalize">{product.name}</h3>
            <p className="text-xs text-gray-500 my-1">by weight ${product.weight.toFixed(2)} kg</p>
            <div className="flex items-center justify-between mt-4">
                <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
                <button
                    className="bg-green-500 text-white rounded-full p-2 hover:bg-green-600 transition-colors"
                    onClick={handleAddToCart}
                >
                    <PlusCircleIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    </div>
  );
};

export default ProductCard;