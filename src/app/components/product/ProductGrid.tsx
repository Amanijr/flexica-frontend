"use client"

import React, { useEffect, useState } from 'react'
import Image, { StaticImageData } from 'next/image';

import smartWatchImage from "@/app/components/assets/smartwatch-removebg-preview.png"
import sportsCarImage from "@/app/components/assets/car-removebg-preview.png"
import ProductCard from './ProductCard';
import { Product } from '@/app/types/product';

//placehoder data for product data
const placeholderProducts: Product[] = [
  {
      id: 1,
      name:'smart watch',
      image: smartWatchImage,
      weight: 1.30,
      price: 1.32,
  },
  {
    id: 2,
    name:'smart watch',
    image: smartWatchImage,
    weight: 1.30,
    price: 1.32,
},
{
  id: 3,
  name: 'sportscar',
  image: sportsCarImage,
  weight: 1.30,
  price: 1.32,
},
{
  id: 4,
  name:'smart watch',
  image: smartWatchImage,
  weight: 1.30,
  price: 1.32,
},
{
  id: 5,
  name: 'sportscar',
  image: sportsCarImage,
  weight: 1.30,
  price: 1.32,
},
  {
      id: 9,
      name: 'sportscar',
      image: sportsCarImage,
      weight: 1.30,
      price: 1.32,
  },
];


const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);


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
          <div className='flex justify-center items-centemb-8'>
            <h2 className='text-3xl font-bold text-center py-9'>PRODUCTS</h2>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {products.map((product)=>(
              <ProductCard 
                key={product.id} 
                product={product}
                handleAddToCart={() => {
                  // TODO: Implement add to cart functionality
                  console.log('Added to cart:', product.name);
                }}
              />
            ))}
          </div>
        </div>

    </section>
  )
}

export default ProductGrid