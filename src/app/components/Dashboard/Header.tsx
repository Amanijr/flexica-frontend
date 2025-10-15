// components/dashboard/Header.tsx

import { Search, LogOut, Bell, User, Settings, Building2 } from 'lucide-react';
import { SmartRoleManager } from '@/app/lib/smartRoleManager';
import { useEffect, useState } from 'react';

const Header = () => {
  const [vendorInfo, setVendorInfo] = useState<{businessName?: string, role: string}>({role: 'User'});

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setVendorInfo({
          businessName: userData.businessName,
          role: SmartRoleManager.getRoleDisplay()
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  return (
    <header className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Logo and Title */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Vendor Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back! Manage your store</p>
            {vendorInfo.businessName && (
              <div className="flex items-center gap-2 mt-1">
                <Building2 size={14} className="text-sky-600" />
                <span className="text-xs text-sky-600 font-medium">{vendorInfo.businessName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Search and Actions */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 lg:flex-none lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search products, orders..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 relative group">
              <Bell size={20} className="text-gray-600 group-hover:text-sky-600" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            
            <button className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 group">
              <Settings size={20} className="text-gray-600 group-hover:text-sky-600" />
            </button>

            <div className="w-px h-8 bg-gray-200 mx-2"></div>

            <button className="flex items-center gap-3 p-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
              <User size={20} />
              <span className="hidden sm:block font-medium">Profile</span>
            </button>

            <button className="p-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all duration-200 group">
              <LogOut size={20} className="group-hover:text-red-700" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;