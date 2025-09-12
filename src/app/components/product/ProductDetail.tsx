"use client";

import { useState } from "react";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { StaticImageData } from "next/image";

interface Product {
  id: string | number;
  name: string;
  price: number;
  image: string | StaticImageData;
  description: string;
  displayFeatures?: string;
}

interface ProductDetailProps {
  product: Product;
  onAddToCart: (productId: string, quantity: number) => void;
}

export default function ProductDetail({ product, onAddToCart }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const handleAddToCart = () => {
    onAddToCart(product.id.toString(), quantity);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Side - Product Image */}
        <div className="space-y-6">
          <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden shadow-lg">
            {typeof product.image === 'string' ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <img
                src={product.image.src}
                alt={product.name}
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
              />
            )}
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-gray-600 text-sm leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>

        {/* Right Side - Product Details */}
        <div className="space-y-6">
          {/* Product Title */}
          <h1 className="text-4xl font-bold text-gray-900">
            {product.name}
          </h1>

          {/* Price */}
          <div className="text-3xl font-bold text-gray-900">
            $ {product.price.toFixed(2)}
          </div>

          {/* Quantity Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Quantity</label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Minus size={16} />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 text-center border border-gray-300 rounded-md py-2"
                min="1"
              />
              <button
                onClick={() => handleQuantityChange(1)}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>


          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <ShoppingCart size={20} />
            <span>+ Add to cart</span>
          </button>

          {/* Display Features */}
          {product.displayFeatures && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Display</h3>
              <p className="text-gray-600 text-sm">
                {product.displayFeatures}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}