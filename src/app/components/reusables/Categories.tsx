"use client";

import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/app/lib/apiGateway';

// Existing image assets used for display
import electronicsIcon from '@/app/components/assets/smartwatch-removebg-preview.png'
import fashionIcon from '@/app/components/assets/fashion-removebg-preview.png'
import carsIcon from '@/app/components/assets/car-removebg-preview.png'
import sportsIcon from '@/app/components/assets/football-removebg-preview.png'
import homeUtilitiesIcon from '@/app/components/assets/house-removebg-preview.png'
import booksIcon from '@/app/components/assets/books-removebg-preview (1).png'
import furnitureIcon from '@/app/components/assets/furniture-removebg-preview.png'
import gamesIcon from '@/app/components/assets/controller-removebg-preview.png'

// Backend response wrappers and DTOs
interface ApiCustomResponse<T> {
  token: string | null;
  statusCode: number;
  message: string;
  data: T;
}

interface BackendCategoryResponse {
  id: number;
  categoryName: string;
  categoryDescription: string;
  parent: string | null;
}

// Map backend category names to local image icons and bg colors
function getCategoryVisuals(name: string) {
  const key = name.toLowerCase();
  if (key.includes('elect')) return { icon: electronicsIcon, bgColor: 'bg-pink-100' };
  if (key.includes('fashion') || key.includes('cloth')) return { icon: fashionIcon, bgColor: 'bg-blue-100' };
  if (key.includes('car') || key.includes('auto')) return { icon: carsIcon, bgColor: 'bg-pink-100' };
  if (key.includes('sport')) return { icon: sportsIcon, bgColor: 'bg-blue-100' };
  if (key.includes('home') || key.includes('util')) return { icon: homeUtilitiesIcon, bgColor: 'bg-blue-100' };
  if (key.includes('book')) return { icon: booksIcon, bgColor: 'bg-pink-100' };
  if (key.includes('furn')) return { icon: furnitureIcon, bgColor: 'bg-blue-100' };
  if (key.includes('game')) return { icon: gamesIcon, bgColor: 'bg-pink-100' };
  // default
  return { icon: homeUtilitiesIcon, bgColor: 'bg-blue-100' };
}

type UiCategory = { name: string; icon: any; bgColor: string };

const Categories = () => {
  const router = useRouter();
  const [items, setItems] = useState<UiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await apiRequest<ApiCustomResponse<BackendCategoryResponse[]>>("/product/public/readCategory", {
          method: 'GET',
        });
        // top-level categories: parent == null
        const topLevel = (res.data || []).filter(c => c.parent == null);
        const mapped: UiCategory[] = topLevel.map(c => {
          const visuals = getCategoryVisuals(c.categoryName);
          return {
            name: c.categoryName,
            icon: visuals.icon,
            bgColor: visuals.bgColor,
          };
        });
        setItems(mapped);
      } catch (e: any) {
        setError(e?.message || 'Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className='py-12 '>
        <div className='container mx-auto px-4 text-center'>
          <p>Loading categories...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className='py-12 '>
        <div className='container mx-auto px-4 text-center'>
          <p className='text-red-500'>Error: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className='py-12 '>
      <div className='container mx-auto px-4 text-center bg-blue-200 rounded-md'>
        <h2 className='text-3xl font-semibold mb-8 py-5'>PRODUCT CATEGORIES</h2>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-8 py-4 '>
          {items.map((category, index) => (
            <div key={index} className='flex flex-col items-center'>
              <button
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
