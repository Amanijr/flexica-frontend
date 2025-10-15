import { Plus, Edit3, Trash2, Eye, MoreVertical, Package } from 'lucide-react';
import { Product } from './types';
import { getProductImage } from './utils';
import { deleteProduct } from './ProductApi';
import { SmartRoleManager } from '@/app/lib/smartRoleManager';
import { useState } from 'react';

interface ProductListProps {
  products: Product[];
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onProductDeleted: (productId: number) => void;
}

const ProductList = ({ products, onAddProduct, onEditProduct, onProductDeleted }: ProductListProps) => {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  const handleDelete = async (productId: number) => {
    setDeletingId(productId);
    try {
      // Check permissions using Smart Role Manager
      if (!SmartRoleManager.hasVendorPermissions()) {
        alert('You need VENDOR role to delete products. Please upgrade your account to VENDOR role first.');
        return;
      }
      
      // Check if user is authenticated
      const token = localStorage.getItem('auth_token');
      if (!token) {
        alert('You must be logged in to delete products. Please log in and try again.');
        return;
      }
      
      await deleteProduct(productId);
      onProductDeleted(productId);
      setShowDeleteConfirm(null);
    } catch (error: any) {
      // Provide more specific error messages
      if (error.message?.includes('not allowed')) {
        alert('You need VENDOR role to delete products. Please upgrade your account to VENDOR role first.');
      } else if (error.message?.includes('401') || error.message?.includes('403')) {
        alert('Authentication failed or insufficient permissions. Please check your role and try again.');
      } else {
        alert('Failed to delete product: ' + (error.message || 'An unexpected error occurred.'));
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Product Inventory</h2>
        <p className="text-gray-600 mt-1">Manage your product catalog</p>
      </div>
      <button
        onClick={onAddProduct}
        className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-medium rounded-xl hover:from-sky-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
      >
        <Plus size={20} />
        Add New Product
      </button>
    </div>

    {/* Products Grid */}
    {products.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 group"
          >
            {/* Product Image */}
            <div className="relative h-48 bg-gray-100">
              <img
                src={getProductImage(product.images)}
                alt={product.productName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute top-3 right-3 flex gap-2">
                <button className="p-2 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition-colors">
                  <Eye size={16} className="text-gray-600" />
                </button>
                <button className="p-2 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition-colors">
                  <MoreVertical size={16} className="text-gray-600" />
                </button>
              </div>
              {product.category && (
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 bg-sky-500 text-white text-xs font-medium rounded-full">
                    {product.category}
                </span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
                    {product.productName}
                  </h3>
                  {product.brand && (
                    <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    Tsh {product.price?.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {product.quantity || 0} in stock
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  (product.quantity || 0) > 0 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {(product.quantity || 0) > 0 ? 'In Stock' : 'Out of Stock'}
                </div>
              </div>

              {product.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {product.description}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button 
                  onClick={() => onEditProduct(product)}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Edit3 size={16} />
                  Edit
              </button>
                <button 
                  onClick={() => setShowDeleteConfirm(product.id)}
                  disabled={deletingId === product.id}
                  className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingId === product.id ? (
                    <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin"></div>
                  ) : (
                    <Trash2 size={16} />
                  )}
              </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      /* Empty State */
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package size={32} className="text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No products yet</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Start building your product catalog by adding your first product. It only takes a few minutes!
        </p>
        <button
          onClick={onAddProduct}
          className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-medium rounded-xl hover:from-sky-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Add Your First Product
        </button>
      </div>
    )}

    {/* Delete Confirmation Modal */}
    {showDeleteConfirm && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 size={24} className="text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Product</h3>
              <p className="text-sm text-gray-600">This action cannot be undone</p>
            </div>
          </div>
          
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete this product? This will permanently remove it from your store.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowDeleteConfirm(null)}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(showDeleteConfirm)}
              disabled={deletingId === showDeleteConfirm}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {deletingId === showDeleteConfirm ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Deleting...
                </>
              ) : (
                'Delete Product'
              )}
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
};

export default ProductList;
