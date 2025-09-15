// components/dashboard/Dashboard.tsx

import { ShoppingBag, Box, ChevronRight } from 'lucide-react';
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

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products: Product[] = await fetchProducts();
        setTotalProducts(products.length);
      } catch (err) {
        console.error('Failed to fetch products', err);
      }
    };
    loadProducts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          title="Total Sales"
          value={`Tsh${totalSales}`}
          icon={<ShoppingBag size={24} />}
        />
        <Card
          title="Total Products"
          value={totalProducts}
          icon={<Box size={24} />}
        />
        <Card
          title="Pending Orders"
          value={sales.filter((s) => s.status === 'Pending').length}
          icon={<ChevronRight size={24} />}
        />
      </div>
      <SalesTable sales={sales} />
    </div>
  );
};

export default Dashboard;
