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
import { useRouter } from 'next/navigation';
import {categories} from "@/app/Categories"

// const categories = [
//     {
//         name: 'Electronics',
//         icon: electronicsIcon,
//         bgColor: 'bg-pink-100',
//         subcategories: [
//             { name: 'Smartphones', icon: smartphoneIcon, bgColor: 'bg-pink-100' },
//             { name: 'Laptops', icon: laptopIcon, bgColor: 'bg-pink-100' },
//             { name: 'Headphones', icon: headphonesIcon, bgColor: 'bg-pink-100' },
//         ],
//     },
//     {
//         name: 'Fashion',
//         icon: fashionIcon,
//         bgColor: 'bg-blue-100',
//         subcategories: [
//             { name: 'Men\'s Clothing', icon: mensClothingIcon, bgColor: 'bg-blue-100' },
//             { name: 'Women\'s Clothing', icon: womensClothingIcon, bgColor: 'bg-blue-100' },
//             { name: 'Accessories', icon: accessoriesIcon, bgColor: 'bg-blue-100' },
//         ],
//     },
//     {
//         name: 'Cars',
//         icon: carsIcon,
//         bgColor: 'bg-pink-100',
//         subcategories: [
//             { name: 'Sedans', icon: sedanIcon, bgColor: 'bg-pink-100' },
//             { name: 'SUVs', icon: suvIcon, bgColor: 'bg-pink-100' },
//             { name: 'Electric Vehicles', icon: electricVehicleIcon, bgColor: 'bg-pink-100' },
//         ],
//     },
//     {
//         name: 'Sports',
//         icon: sportsIcon,
//         bgColor: 'bg-blue-100',
//         subcategories: [
//             { name: 'Fitness Equipment', icon: fitnessIcon, bgColor: 'bg-blue-100' },
//             { name: 'Outdoor Gear', icon: outdoorIcon, bgColor: 'bg-blue-100' },
//             { name: 'Sportswear', icon: sportswearIcon, bgColor: 'bg-blue-100' },
//         ],
//     },
//     {
//         name: 'Home Utilities',
//         icon: homeUtilitiesIcon,
//         bgColor: 'bg-blue-100',
//         subcategories: [
//             { name: 'Kitchen Appliances', icon: kitchenIcon, bgColor: 'bg-blue-100' },
//             { name: 'Cleaning Tools', icon: cleaningIcon, bgColor: 'bg-blue-100' },
//             { name: 'Home Decor', icon: decorIcon, bgColor: 'bg-blue-100' },
//         ],
//     },
//     {
//         name: 'Books',
//         icon: booksIcon,
//         bgColor: 'bg-pink-100',
//         subcategories: [
//             { name: 'Fiction', icon: fictionIcon, bgColor: 'bg-pink-100' },
//             { name: 'Non-Fiction', icon: nonFictionIcon, bgColor: 'bg-pink-100' },
//             { name: 'Educational', icon: educationalIcon, bgColor: 'bg-pink-100' },
//         ],
//     },
//     {
//         name: 'Furniture',
//         icon: furnitureIcon,
//         bgColor: 'bg-blue-100',
//         subcategories: [
//             { name: 'Living Room', icon: livingRoomIcon, bgColor: 'bg-blue-100' },
//             { name: 'Bedroom', icon: bedroomIcon, bgColor: 'bg-blue-100' },
//             { name: 'Office', icon: officeIcon, bgColor: 'bg-blue-100' },
//         ],
//     },
//     {
//         name: 'Games',
//         icon: gamesIcon,
//         bgColor: 'bg-pink-100',
//         subcategories: [
//             { name: 'Video Games', icon: videoGamesIcon, bgColor: 'bg-pink-100' },
//             { name: 'Board Games', icon: boardGamesIcon, bgColor: 'bg-pink-100' },
//             { name: 'Puzzles', icon: puzzlesIcon, bgColor: 'bg-pink-100' },
//         ],
//     },
// ];
const Categories = () => {

    const router = useRouter();

  return (
    <section className='py-12 '>
        <div className='container mx-auto px-4 text-center bg-blue-200 rounded-md'>
            <h2 className='text-3xl font-semibold mb-8 py-5'>PRODUCT CATEGORIES</h2>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-8 py-4 '>
                {categories.map((category, index) =>(
                    <div key={index} className='flex flex-col items-center'>
                        <button 
                            key={index} 
                            className='flex flex-col items-center group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-4 transition-transform duration-200 hover:scale-105'
                            onClick={() => router.push(`/categories?category=${encodeURIComponent(category.name)}`)}

                            aria-label={`View ${category.name} products`}
                        >
                            <div className={`w-28 h-28 md:w-36 md:h-36 rounded-full flex items-center justify-center mb-4 ${category.bgColor}`}>
                                <Image
                                    src={category.icon} 
                                    alt={category.name} 
                                    className="w-16 h-16 md:w-28 md:h-28 object-contain"
                                    loading='lazy'
                                    // priority
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
