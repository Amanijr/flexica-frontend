"use client"

import React, { useEffect, useState } from 'react'
import Image, { StaticImageData } from 'next/image';

import smartWatchImage from "@/app/components/assets/smartwatch-removebg-preview.png"
import sportsCarImage from "@/app/components/assets/car-removebg-preview.png"
import macbookImage from "@/app/components/assets/macbook-removebg-preview.png"
import iphoneImage from "@/app/components/assets/iphone-16-removebg-preview.png"
import houseImage from "@/app/components/assets/house-removebg-preview.png"
import furnitureImage from "@/app/components/assets/furniture-removebg-preview.png"
import footballImage from "@/app/components/assets/football-removebg-preview.png"
import controllerImage from "@/app/components/assets/controller-removebg-preview.png"
import fashionImage from "@/app/components/assets/fashion-removebg-preview.png"
import ProductCard from './ProductCard';
import { Product } from '@/app/types/product';
import { useCartStore } from '@/app/hooks/cart';

//diverse product data
const placeholderProducts: Product[] = [
  {
    id: 1,
    name: 'Apple Watch Series 9',
    image: smartWatchImage,
    weight: 0.045,
    price: 399.99,
  },
  {
    id: 2,
    name: 'MacBook Pro 16"',
    image: macbookImage,
    weight: 2.14,
    price: 2499.99,
  },
  {
    id: 3,
    name: 'iPhone 16 Pro',
    image: iphoneImage,
    weight: 0.221,
    price: 999.99,
  },
  {
    id: 4,
    name: 'Tesla Model S',
    image: sportsCarImage,
    weight: 2162.0,
    price: 89999.99,
  },
  {
    id: 5,
    name: 'Modern Sofa Set',
    image: furnitureImage,
    weight: 85.5,
    price: 1299.99,
  },
  {
    id: 6,
    name: 'Wireless Gaming Controller',
    image: controllerImage,
    weight: 0.28,
    price: 79.99,
  },
  {
    id: 7,
    name: 'Luxury Villa',
    image: houseImage,
    weight: 0.001, // Property weight placeholder
    price: 850000.00,
  },
  {
    id: 8,
    name: 'Smart Home Device',
    image: houseImage,
    weight: 1.2,
    price: 299.99,
  },
  {
    id: 9,
    name: 'Premium Football',
    image: footballImage,
    weight: 0.45,
    price: 49.99,
  },
  {
    id: 10,
    name: 'Designer Fashion Collection',
    image: fashionImage,
    weight: 1.2,
    price: 199.99,
  },
  {
    id: 11,
    name: 'Gaming Smartwatch',
    image: smartWatchImage,
    weight: 0.052,
    price: 299.99,
  },
  {
    id: 12,
    name: 'MacBook Air M3',
    image: macbookImage,
    weight: 1.24,
    price: 1199.99,
  },
];


const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { addItem } = useCartStore();

 

  useEffect(() => {
    setProducts(placeholderProducts);
    setLoading(false);
  }, []);
  if (loading) {
    return <div className="text-center py-12">Loading products...</div>;
}
 
if (error) {
    return <div className="text-center py-12 text-red-500">Error: {error.message}</div>;
}
 
  return (
    <section className='py-12'>
        <div className='container mx-auto px-4'>
          <div className='flex justify-center items-center mb-8'>
            <h2 className='text-3xl font-bold text-center py-9'>PRODUCTS</h2>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {products.map((product)=>(
              <ProductCard 
                key={product.id} 
                product={product}
                
              />
            ))}
          </div>
        </div>

    </section>
  )
}

export default ProductGrid