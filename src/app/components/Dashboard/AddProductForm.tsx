// components/dashboard/AddProductForm.tsx
"use client";

import { useState } from 'react';
import { X } from 'lucide-react';
import { Product, ProductFormData } from './types';
import { createProduct } from './ProductApi';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
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
      onProductCreated(newProduct);
    } catch (error: any) {
      setErrorMessage(error.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Add New Product</h2>
        <button onClick={onCancel} className="p-1 text-gray-400 hover:text-gray-600 transition rounded-full">
          <X size={20} />
        </button>
      </div>

      {successMessage && <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg mb-4 text-sm">{successMessage}</div>}
      {errorMessage && <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm">{errorMessage}</div>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Name */}
        <div>
          <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
          />
        </div>
        
        {/* Brand */}
        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
          />
        </div>

        {/* Quantity */}
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="0"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
          />
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
          />
        </div>

        {/* Category ID */}
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">Category ID</label>
          <input
            type="number"
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
          />
        </div>

        {/* Images */}
        <div className="md:col-span-2">
          <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>
          <input
            type="file"
            id="images"
            name="images"
            onChange={handleFileChange}
            multiple
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
          ></textarea>
        </div>

        {/* Is Available */}
        <div className="flex items-center gap-2 md:col-span-2">
          <input
            type="checkbox"
            id="isAvailable"
            name="isAvailable"
            checked={formData.isAvailable}
            onChange={handleChange}
            className="w-4 h-4 text-sky-600 bg-gray-100 rounded border-gray-300 focus:ring-sky-500"
          />
          <label htmlFor="isAvailable" className="text-sm font-medium text-gray-700">Available for sale</label>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 md:col-span-2 mt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-sky-500 text-white py-2.5 rounded-lg font-medium text-sm shadow hover:bg-sky-600 focus:ring-4 focus:ring-sky-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Product...' : 'Create Product'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 text-sky-500 border border-sky-500 py-2.5 rounded-lg font-medium text-sm hover:bg-sky-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;
