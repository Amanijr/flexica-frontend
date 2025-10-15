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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans text-gray-800">
      <div className="p-4 sm:p-6 lg:p-8">
        <Header />

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          <Sidebar 
            activeView={activeView}
            onViewChange={(view) => {
              setActiveView(view);
              if (view !== 'products') setIsAddingProduct(false);
            }}
          />

          {/* Main View Area */}
          <main className="flex-1 min-w-0">
            <div className="animate-in fade-in-50 duration-300">
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

              {activeView === 'analytics' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics</h2>
                  <p className="text-gray-600">Analytics dashboard coming soon!</p>
                </div>
              )}

              {activeView === 'customers' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Customers</h2>
                  <p className="text-gray-600">Customer management coming soon!</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}