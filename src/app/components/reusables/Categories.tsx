"use client";

import React from 'react'
import Image from 'next/image';
import electronicsIcon from '@/app/components/assets/smartwatch-removebg-preview.png'
import fashionIcon from '@/app/components/assets/fashion-removebg-preview.png'
import carsIcon from '@/app/components/assets/car-removebg-preview.png'
import sportsIcon from '@/app/components/assets/football-removebg-preview.png'
import homeUtilitiesIcon from '@/app/components/assets/house-removebg-preview.png'
import booksIcon from '@/app/components/assets/books-removebg-preview (1).png'
import furnitureIcon from '@/app/components/assets/furniture-removebg-preview.png'
import gamesIcon from '@/app/components/assets/controller-removebg-preview.png'

const categories = [
    { name: 'Electronics', icon: electronicsIcon, bgColor: 'bg-pink-100' },
    { name: 'Fashion', icon: fashionIcon, bgColor: 'bg-blue-100' },
    { name: 'Cars', icon: carsIcon, bgColor: 'bg-pink-100' },
    { name: 'Sports', icon: sportsIcon, bgColor: 'bg-blue-100' },
    { name: 'Home Utilities', icon: homeUtilitiesIcon, bgColor: 'bg-blue-100' },
    { name: 'Books', icon: booksIcon, bgColor: 'bg-pink-100' },
    { name: 'Furniture', icon: furnitureIcon, bgColor: 'bg-blue-100' },
    { name: 'Games', icon: gamesIcon, bgColor: 'bg-pink-100' },
];
const Categories = () => {
  return (
    <section className='py-12 bg-gray-50'>
        <div className='container mx-auto px-4 text-center bg-blue-200 rounded-md'>
            <h2 className='text-3xl font-semibold mb-8 py-5'>PRODUCT CATEGORIES</h2>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-8 py-4 '>
                {categories.map((category, index) =>(
                    <div key={index} className='flex flex-col items-center'>
                        <button 
                            key={index} 
                            className='flex flex-col items-center group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-4 transition-transform duration-200 hover:scale-105'
                            onClick={() => console.log(`Clicked on ${category.name}`)}
                        >
                            <div className={`w-28 h-28 md:w-36 md:h-36 rounded-full flex items-center justify-center mb-4 ${category.bgColor}`}>
                                <Image
                                    src={category.icon} 
                                    alt={category.name} 
                                    className="w-16 h-16 md:w-28 md:h-28 object-contain"
                                    priority
                                />
                            </div>
                            <p className="text-sm md:text-base font-medium group-hover:underline">{category.name}</p>
                        </button>
                        </div>
                ))}

            </div>

        </div>
    </section>
  )
}

export default Categories