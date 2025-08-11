'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';

const Searchbar = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async () => {
    try {
      console.log('Searching for:', searchQuery, 'in', filter);

      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}&filter=${filter}`
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log(result); // TODO: Render results
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  return (
    <div className="w-full px-4 md:px-0">
      {/* Responsive container: column on mobile, row on md+ */}
      <div className="flex flex-col md:flex-row items-stretch max-w-xl mx-auto gap-3">
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
            <option value="vendor">Vendors</option>
          </select>
        </div>

        {/* Search Input with Icon */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>

        {/* Search Button (optional) */}
        <button
          onClick={handleSearch}
          className="md:w-auto w-full bg-blue-400 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4" />
          <span className="hidden md:inline">Search</span>
        </button>
      </div>
    </div>
  );
};

export default Searchbar;
