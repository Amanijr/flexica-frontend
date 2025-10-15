// components/dashboard/Dashboard.tsx

import { ShoppingBag, Box, TrendingUp, DollarSign, Users, Package } from 'lucide-react';
import Card from './Card';
import SalesTable from './SalesTable';
import { Sale, Product } from './types';
import { fetchProducts } from './ProductApi';
import { useEffect, useState } from 'react';

interface DashboardProps {
  totalSales: string;
  totalProducts: number;
  sales: Sale[];
}

const Dashboard = ({ totalSales, sales }: DashboardProps) => {
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);

         useEffect(() => {
           const loadProducts = async () => {
             try {
               const products: Product[] = await fetchProducts();
               setTotalProducts(products.length);
               setRecentProducts(products.slice(0, 5)); // Get recent 5 products
             } catch (err) {
               // Handle error silently or show user-friendly message
             }
           };
           loadProducts();
         }, []);

  const pendingOrders = sales.filter((s) => s.status === 'Pending').length;
  const completedOrders = sales.filter((s) => s.status === 'Completed').length;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
        <p className="text-sky-100 text-lg">Here's what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          title="Total Revenue"
          value={`Tsh ${totalSales}`}
          icon={<DollarSign size={24} />}
          trend={{ value: "+12.5%", isPositive: true }}
          subtitle="This month"
        />
        <Card
          title="Total Products"
          value={totalProducts}
          icon={<Package size={24} />}
          trend={{ value: "+3", isPositive: true }}
          subtitle="In inventory"
        />
        <Card
          title="Pending Orders"
          value={pendingOrders}
          icon={<TrendingUp size={24} />}
          trend={{ value: "-2", isPositive: false }}
          subtitle="Awaiting fulfillment"
        />
        <Card
          title="Completed Orders"
          value={completedOrders}
          icon={<Users size={24} />}
          trend={{ value: "+8", isPositive: true }}
          subtitle="This week"
        />
      </div>

      {/* Charts and Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Sales</h2>
              <button className="text-sky-600 hover:text-sky-700 text-sm font-medium">
                View all
              </button>
            </div>
            <SalesTable sales={sales} />
          </div>
        </div>

        {/* Recent Products */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Products</h2>
          <div className="space-y-4">
            {recentProducts.map((product, index) => (
              <div key={product.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-sky-100 to-blue-100 rounded-lg flex items-center justify-center">
                  <Package size={16} className="text-sky-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{product.productName}</p>
                  <p className="text-xs text-gray-500">Tsh {product.price}</p>
                </div>
                <span className="text-xs text-gray-400">#{index + 1}</span>
              </div>
            ))}
            {recentProducts.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">No products yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
