// components/dashboard/Sidebar.tsx

import { LayoutDashboard, ShoppingBag, Box } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const Sidebar = ({ activeView, onViewChange }: SidebarProps) => {
  return (
    <aside className="w-full lg:w-64 bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-2">
      <nav className="flex flex-col gap-2">
        <button
          onClick={() => onViewChange('dashboard')}
          className={`flex items-center gap-3 p-3 rounded-xl transition ${activeView === 'dashboard' ? 'bg-sky-500 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          <LayoutDashboard size={20} />
          <span className="font-medium">Dashboard</span>
        </button>
        <button
          onClick={() => onViewChange('sales')}
          className={`flex items-center gap-3 p-3 rounded-xl transition ${activeView === 'sales' ? 'bg-sky-500 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          <ShoppingBag size={20} />
          <span className="font-medium">Sales</span>
        </button>
        <button
          onClick={() => onViewChange('products')}
          className={`flex items-center gap-3 p-3 rounded-xl transition ${activeView === 'products' ? 'bg-sky-500 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          <Box size={20} />
          <span className="font-medium">Products</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;