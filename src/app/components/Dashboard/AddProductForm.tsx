// components/dashboard/AddProductForm.tsx
"use client";

import { useState } from 'react';
import { X } from 'lucide-react';
import { Product, ProductFormData } from './types';
import { createProduct } from './ProductApi';
import { categories } from './categories'
import { useSession } from '@/app/auth/SessionContext';

interface AddProductFormProps {
  onCancel: () => void;
  onProductCreated: (newProduct: Product) => void;
}

const AddProductForm = ({ onCancel, onProductCreated }: AddProductFormProps) => {
  const [formData, setFormData] = useState<ProductFormData>({
    productName: '',
    quantity: 0,
    brand: '',
    isAvailable: true,
    price: 0,
    description: '',
    categoryId: 0,
  });
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { refreshSession } = useSession();
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
  
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (e.target instanceof HTMLSelectElement) {
      // convert string value to number for categoryId
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const data = new FormData();
    data.append('productName', formData.productName);
    data.append('quantity', formData.quantity.toString());
    data.append('brand', formData.brand);
    data.append('isAvailable', formData.isAvailable.toString());
    data.append('price', formData.price.toString());
    data.append('description', formData.description);
    data.append('categoryId', formData.categoryId.toString());
    images.forEach(image => data.append('images', image));

    try {
      const newProduct = await createProduct(data);
      setSuccessMessage('Product created successfully!');
      
      
      await refreshSession();
      
      onProductCreated(newProduct);
    } catch (error: any) {
      setErrorMessage(error.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Add New Product</h2>
            <p className="text-sky-100 mt-1">Fill in the details to add a new product to your store</p>
          </div>
          <button 
            onClick={onCancel} 
            className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            {errorMessage}
          </div>
        )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div className="md:col-span-2">
              <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                id="productName"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                required
                placeholder="Enter product name"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors"
              />
            </div>
            
            {/* Brand */}
            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
                Brand *
              </label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
                placeholder="Enter brand name"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors bg-white"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <optgroup key={cat.id} label={cat.name} className="text-gray-700 font-semibold">
                    {cat.subcategories.map((sub) => (
                      <option key={sub.id} value={sub.id} className="pl-4 text-gray-600">
                        {sub.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Inventory</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quantity */}
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="0"
                placeholder="0"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors"
              />
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price (Tsh) *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">Tsh</span>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Media & Description */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Media & Description</h3>
          <div className="space-y-6">
            {/* Images */}
            <div>
              <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">
                Product Images
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-sky-400 transition-colors">
                <input
                  type="file"
                  id="images"
                  name="images"
                  onChange={handleFileChange}
                  multiple
                  accept="image/*"
                  className="hidden"
                />
                <label htmlFor="images" className="cursor-pointer">
                  <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">Upload product images</p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 10MB each</p>
                </label>
              </div>
              {images.length > 0 && (
                <div className="mt-3 flex gap-2 flex-wrap">
                  {images.map((file, index) => (
                    <span key={index} className="px-3 py-1 bg-sky-100 text-sky-700 text-xs rounded-full">
                      {file.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Product Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Describe your product in detail..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors resize-none"
              />
            </div>

            {/* Is Available */}
            <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200">
              <input
                type="checkbox"
                id="isAvailable"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
                className="w-5 h-5 text-sky-600 bg-gray-100 rounded border-gray-300 focus:ring-sky-500"
              />
              <div>
                <label htmlFor="isAvailable" className="text-sm font-medium text-gray-900">
                  Available for sale
                </label>
                <p className="text-xs text-gray-500">Make this product visible to customers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 text-gray-700 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-medium shadow-lg hover:from-sky-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Creating Product...
              </>
            ) : (
              'Create Product'
            )}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default AddProductForm;
