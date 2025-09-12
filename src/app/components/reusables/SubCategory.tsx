"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { ComponentType } from 'react';
import SubCategoryItem from './SubCategoryItem';

interface SubCategory {
    name: string;
    icon: ComponentType<{ className?: string }>;
    bgColor: string;
  }
  
  interface Props {
    title: string;
    subcategories: SubCategory[];
    category: string;
  }

const SubCategory = ({ title, subcategories, category }: Props) => {
    const searchParams = useSearchParams();
    const activeSubcategory = searchParams.get('subcategory');
  
    return (
        <div className="bg-blue-200 rounded-3xl shadow-xl p-6 md:p-8 max-w-7xl mx-auto font-sans mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">{title}</h2>
        <div className="flex flex-wrap justify-center md:justify-between gap-4">
          {subcategories.map((sub, index) => (
            <Link
              key={index}
              href={`/categories/${category.toLowerCase()}/${sub.name.toLowerCase()}`}
              className={`flex flex-col items-center p-4 rounded-md transition-colors duration-200 ${
                activeSubcategory === sub.name.toLowerCase()
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 hover:bg-blue-50'
              }`}
              aria-label={`View ${sub.name} products`}
            >
              <SubCategoryItem label={sub.name} icon={sub.icon} bgColor={sub.bgColor} />
            </Link>
          ))}
        </div>
      </div>
    );
  };
export default SubCategory;
