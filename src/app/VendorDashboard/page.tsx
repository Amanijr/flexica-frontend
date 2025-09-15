// pages/vendordashboard.tsx or pages/vendordashboard/index.tsx

"use client";

import { useState } from 'react';
import Header from '../components/Dashboard/Header';
import Sidebar from '../components/Dashboard/Sidebar';
import Dashboard from '../components/Dashboard/Dashboard';
import SalesView from '../components/Dashboard/SalesView';
import ProductsView from '../components/Dashboard/ProductView';
import { Sale, Product } from '../components/Dashboard/types';

export default function VendorDashboard() {
  const [activeView, setActiveView] = useState('dashboard');
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const totalSales = sales.reduce((sum, sale) => sum + parseFloat(sale.amount.replace('$', '')), 0).toFixed(2);
  const totalProducts = products.length;

  const handleProductCreated = (newProduct: Product) => {
    setProducts(prev => [...prev, newProduct]);
    setIsAddingProduct(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800 p-4 sm:p-6 lg:p-8">
      <Header />

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        <Sidebar 
          activeView={activeView}
          onViewChange={(view) => {
            setActiveView(view);
            if (view !== 'products') setIsAddingProduct(false);
          }}
        />

        {/* Main View Area */}
        <main className="flex-1">
          {activeView === 'dashboard' && (
            <Dashboard 
              totalSales={totalSales}
              totalProducts={totalProducts}
              sales={sales}
            />
          )}

          {activeView === 'sales' && (
            <SalesView sales={sales} />
          )}

          {activeView === 'products' && (
            <ProductsView
              products={products}
              isAddingProduct={isAddingProduct}
              onAddProduct={() => setIsAddingProduct(true)}
              onCancelAdd={() => setIsAddingProduct(false)}
              onProductCreated={handleProductCreated}
            />
          )}
        </main>
      </div>
    </div>
  );
}