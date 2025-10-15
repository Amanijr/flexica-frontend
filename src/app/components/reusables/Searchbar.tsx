'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Searchbar = () => {
  const router = useRouter();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!searchQuery.trim()) return;

    // Navigate to search results page with query params
    const params = new URLSearchParams({
      q: searchQuery,
      filter: filter,
    });
    
    router.push(`/search?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full px-4 md:px-0">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-stretch max-w-xl mx-auto gap-3">
        {/* Filter Dropdown */}
        <div className="relative w-full sm:w-40 md:w-32">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-3 pr-8 py-2 rounded-md border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="products">Products</option>
            <option value="categories">Categories</option>
          </select>
        </div>

        {/* Search Input with Icon */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search products, categories..."
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="md:w-auto w-full bg-blue-400 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 transition"
        >
          <Search className="w-4 h-4" />
          <span className="hidden md:inline">Search</span>
        </button>
      </form>
    </div>
  );
};

export default Searchbar;
