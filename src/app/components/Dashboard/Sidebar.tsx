// components/dashboard/Sidebar.tsx

import { LayoutDashboard, ShoppingBag, Box, TrendingUp, Package, BarChart3, Users, Settings } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const Sidebar = ({ activeView, onViewChange }: SidebarProps) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Overview & Analytics'
    },
    {
      id: 'products',
      label: 'Products',
      icon: Package,
      description: 'Manage Inventory',
      count: 12 // This could be dynamic
    },
    {
      id: 'sales',
      label: 'Sales',
      icon: ShoppingBag,
      description: 'Orders & Revenue'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      description: 'Performance Metrics'
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: Users,
      description: 'Customer Management'
    }
  ];

  return (
    <aside className="w-full lg:w-72 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      {/* Sidebar Header */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Navigation</h2>
        <p className="text-sm text-gray-500">Manage your store efficiently</p>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-sky-600'
              }`}
            >
              <div className={`p-2 rounded-lg ${
                isActive 
                  ? 'bg-white/20' 
                  : 'bg-gray-100 group-hover:bg-sky-100'
              }`}>
                <Icon size={20} />
              </div>
              
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.label}</span>
                  {item.count && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-sky-100 text-sky-600'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </div>
                <p className={`text-xs ${
                  isActive ? 'text-white/80' : 'text-gray-500'
                }`}>
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Quick Stats */}
      <div className="mt-8 p-4 bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Stats</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Today's Sales</span>
            <span className="font-medium text-sky-600">Tsh 2,450</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Orders</span>
            <span className="font-medium text-sky-600">12</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Conversion</span>
            <span className="font-medium text-green-600">+12.5%</span>
          </div>
        </div>
      </div>

      {/* Settings Button */}
      <button className="w-full flex items-center gap-3 p-3 mt-6 text-gray-600 hover:text-sky-600 hover:bg-gray-50 rounded-xl transition-all duration-200 group">
        <Settings size={18} />
        <span className="font-medium">Settings</span>
      </button>
    </aside>
  );
};

export default Sidebar;