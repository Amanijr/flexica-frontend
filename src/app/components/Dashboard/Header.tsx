// components/dashboard/Header.tsx

import { Search, LogOut } from 'lucide-react';

const Header = () => {
  return (
    <header className="flex flex-col sm:flex-row items-center justify-between mb-8">
      <div className="flex items-center gap-4 mb-4 sm:mb-0">
        <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
        <span className="text-gray-500">for Flexica</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
          />
        </div>
        <button className="p-3 bg-white rounded-xl shadow-md hover:bg-gray-50 transition">
          <LogOut size={20} className="text-gray-600" />
        </button>
      </div>
    </header>
  );
};

export default Header;