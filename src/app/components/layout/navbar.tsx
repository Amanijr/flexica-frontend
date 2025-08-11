"use client"

import { Bell, Menu, Search, ShoppingCart, User, X } from 'lucide-react';
import React, { useState } from 'react';
import Togglebar from '../reusables/Togglebar';
import Searchbar from '../reusables/Searchbar';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm border-gray-100 px-4 sm:px-6 py-4">
      <div className="max-w-8xl mx-auto flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <div className="text-xl sm:text-2xl font-bold text-blue-400">flexica</div>
        </div>
        
        {/* Desktop Togglebar */}
        <div className="hidden md:block">
          <Togglebar/>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden  ">
          <button 
            onClick={toggleMobileMenu}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-gray-600" />
            ) : (
              <Menu className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Search Section - Desktop */}
        {/* <div className="hidden md:flex flex-1 max-w-sm mx-8">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="search"
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div> */}
        <div className='hidden md:flex flex-1 max-w-xl mx-8'>
          <Searchbar/>
        </div>
        {/* <Searchbar/> */}

        {/* Navigation items - Desktop */}
        <div className="hidden md:flex items-center space-x-4 lg:space-x-7">
          {/* Notification */}
          <button className="p-2 rounded-full bg-gray-100 transition-colors hover:bg-gray-200">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>

          {/* Shopping Cart */}
          <button className="p-2 rounded-full bg-gray-100 transition-colors relative hover:bg-gray-200">
            <ShoppingCart className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              0
            </span>
          </button>

          {/* Login */}
          <button className="bg-blue-400 text-white px-3 lg:px-4 py-2 rounded-md transition-colors hover:bg-blue-500">
            Login
          </button>

          {/* Register Button */}
          <button className="bg-blue-400 text-white px-3 lg:px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors font-medium">
            Register
          </button>

          {/* User Profile */}
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <User className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Togglebar */}
            <div className="mb-4 flex items-center justify-center">
              <Togglebar/>
            </div>
            
            {/* Mobile Search */}
            {/* <div className="relative">
              <input
                type="text"
                placeholder="search"
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
             */}
             <div className='md:hidden'>
              <Searchbar/>
             </div>
             
            {/* Mobile Action Buttons */}
            <div className="flex items-center justify-between space-x-4">
              <button className="p-2 rounded-full bg-gray-100 transition-colors hover:bg-gray-200">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              
              <button className="p-2 rounded-full bg-gray-100 transition-colors relative hover:bg-gray-200">
                <ShoppingCart className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </button>
              
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <User className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            {/* Mobile Login/Register Buttons */}
            <div className="flex space-x-3">
              <button className="flex-1 bg-blue-400 text-white px-4 py-2 rounded-md transition-colors hover:bg-blue-500">
                Login
              </button>
              <button className="flex-1 bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors font-medium">
                Register
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
