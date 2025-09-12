"use client";

import React, { useState } from 'react'
import { Bell, Menu, Search, ShoppingCart, User } from 'lucide-react';
import Link from 'next/link';

const Togglebar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const toggleDropdown = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        setIsDropdownOpen(!isDropdownOpen);
      };
  return (
    <div className="relative">
          <button
            onClick={toggleDropdown}
            className="p-2  bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600 " />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50 flex items-center justify-center">
            <div className="py-2 flex flex-col w-full">
              <Link 
                href="/" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
              >
                Home
              </Link>
          
              <Link 
                href="/products" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
              >
                Products
              </Link>
          
              <Link 
                href="/categories" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
              >
                Categories
              </Link>
          
              <Link 
                href="/about" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
              >
                About
              </Link>
          
              <Link 
                href="/contact" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
          )}
        </div>
  )
}

export default Togglebar