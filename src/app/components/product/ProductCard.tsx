import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { Product } from '@/app/types/product';
import { useCartStore } from '@/app/hooks/cart';
import { CheckIcon } from 'lucide-react';



const ProductCard = ({ product }: { product: Product; }) => {
    const { addItem } = useCartStore();
    
    const [isAdded, setIsAdded] = useState(false);
    const handleAddToCart = (e: React.MouseEvent, product: Product) => {
        e.preventDefault(); // Prevent navigation when clicking add to cart
        e.stopPropagation();
        addItem({
          id: product.id.toString(),
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
          
        });
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
        console.log(`Added ${product.name} to cart`)
      }
  return (
    <Link href={`/product/${product.id}`} className="block">
      <div
        key={product.id}
        className='bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center transition-transform hover:scale-105 cursor-pointer'
      >
          {/* Product Image Section */}
          <div className="w-full h-56 flex items-center justify-center mb-4 bg-gray-50 rounded-lg overflow-hidden">
              <Image
                  src={product.image}
                  alt={product.name}
                  width={240}
                  height={240}
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                  loading='lazy'
                  priority={false}
              />
          </div>

          {/* Product Details Section */}
          <div className='w-full'>
              <h3 className="text-lg font-bold capitalize">{product.name}</h3>
              <p className="text-xs text-gray-500 my-1">by weight TZS {product.weight.toFixed(2)} kg</p>
              <div className="flex items-center justify-between mt-4">
                  <span className="text-xl font-bold">TZS {product.price.toFixed(2)}</span>
                  <button
                       className={`rounded-full p-2 transition-all duration-200 ${
                          isAdded 
                              ? 'bg-green-600 text-white scale-110' 
                              : 'bg-green-500 text-white hover:bg-green-600 hover:scale-105'
                      }`}
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={isAdded}
                  >
                      {isAdded ? (
                          <CheckIcon className="w-6 h-6" />
                      ) : (
                          <PlusCircleIcon className="w-6 h-6" />
                      )}
                  </button>
              </div>
          </div>
      </div>
    </Link>
  );
};

export default ProductCard;