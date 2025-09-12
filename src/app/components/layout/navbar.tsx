'use client'

import { Bell, Menu, Search, ShoppingCart, User, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import Togglebar from '../reusables/Togglebar';
import Searchbar from '../reusables/Searchbar';
import { useCartStore } from '@/app/hooks/cart';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LogoutButton from '../reusables/LogoutButton';

const Navbar = () => {
  const cart = useCartStore();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const cartItemsCount = mounted ? cart.getTotalItems() : 0;

  return (
    <nav className="bg-white shadow-sm border-gray-100 px-4 sm:px-6 py-4">
      <div className="max-w-8xl mx-auto flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <div className="text-xl sm:text-2xl font-bold text-blue-400">flexica</div>
        </div>

        {/* Desktop Togglebar */}
        <div className="hidden md:block">
          <Togglebar />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
          </button>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <Searchbar />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4 lg:space-x-7">
          <button className="p-2 rounded-full bg-gray-100 transition-colors hover:bg-gray-200">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>

          {/* Shopping Cart */}
          <Link
            href="/cartItem"
            className="p-2 rounded-full bg-gray-100 transition-colors relative hover:bg-gray-200"
          >
            <ShoppingCart className="w-5 h-5 text-gray-600" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </Link>

          {/* Login/Register */}
          <Link 
              href="/login"
              className="bg-blue-400 text-white px-4 py-2 rounded-md transition-colors hover:bg-blue-500">
                Login
                </Link>
              <Link
                className="bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors font-medium"
                 href="/registration">
                Register
              </Link>

          {/* User Profile */}
          <Link 
            href="/account"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Account"
          >
            <User className="w-5 h-5 text-gray-600" />
          </Link>

          {/* Logout */}
          <LogoutButton className="ml-2" />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-4">
            <div className="mb-4 flex items-center justify-center">
              <Togglebar />
            </div>

            <div className="md:hidden">
              <Searchbar />
              <LogoutButton />
            </div>

            <div className="flex items-center justify-between space-x-4">
              <button className="p-2 rounded-full bg-gray-100 transition-colors hover:bg-gray-200">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>

              <Link
                href="/cartItem"
                className="p-2 rounded-full bg-gray-100 transition-colors relative hover:bg-gray-200"
              >
                <ShoppingCart className="w-5 h-5 text-gray-600" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              <Link 
                href="/account"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Account"
              >
                <User className="w-5 h-5 text-gray-600" />
              </Link>

            </div>

            <div className="flex space-x-3">
              <Link 
              href="/login"
              className="flex-1 bg-blue-400 text-white px-4 py-2 rounded-md transition-colors hover:bg-blue-500">
                Login
                </Link>
              <Link
                className="flex-1 bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors font-medium" href={''}>
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
