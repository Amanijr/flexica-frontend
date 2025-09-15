// components/dashboard/ProductList.tsx

import { Plus } from 'lucide-react';
import { Product } from './types';

interface ProductListProps {
  products: Product[];
  onAddProduct: () => void;
}

const ProductList = ({ products, onAddProduct }: ProductListProps) => (
  <div className="bg-white rounded-2xl shadow-md p-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold text-gray-800">Your Products</h2>
      <button onClick={onAddProduct} className="px-4 py-2 bg-sky-500 text-white text-sm font-medium rounded-lg hover:bg-sky-600 transition shadow flex items-center gap-1">
        <Plus size={16} /> Add Product
      </button>
    </div>
    {products.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="p-4 bg-gray-50 rounded-lg shadow-sm flex items-center gap-4">
    <img
  src={
    Array.isArray(product.image)
      ? typeof product.image[0] === "string"
        ? product.image[0]
        : product.image[0].src
      : typeof product.image === "string"
      ? product.image
      : product.image?.src
  }
  alt={product.name}
  className="w-16 h-16 rounded-lg object-cover"
/>

            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-800 truncate">{product.name}</h3>
              <p className="text-xs text-gray-500 mt-1">
                <span className="font-medium text-gray-800">{product.price}</span>
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-sky-500 transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              </button>
              <button className="p-2 text-gray-400 hover:text-red-500 transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-8 text-gray-500">
        No products found. Add your first product to get started.
      </div>
    )}
  </div>
);

export default ProductList;