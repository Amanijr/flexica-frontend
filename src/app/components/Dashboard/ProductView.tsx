import ProductList from './ProductList';
import AddProductForm from './AddProductForm';
import EditProductForm from './EditProductForm';
import AuthStatus from './AuthStatus';
import { Product } from './types';
import { useEffect, useState } from 'react';
import { fetchProducts } from './ProductApi';

export interface ProductsViewProps {
    products: Product[];
    isAddingProduct: boolean;
    onAddProduct: () => void;
    onCancelAdd: () => void;
    onProductCreated: (newProduct: Product) => void;
}

const ProductsView = ({
  isAddingProduct,
  onAddProduct,
  onCancelAdd,
  onProductCreated,
}: ProductsViewProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetched = await fetchProducts();
      setProducts(fetched);
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleProductCreated = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
    onProductCreated(newProduct);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleProductUpdated = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    setEditingProduct(null);
  };

  const handleProductDeleted = (productId: number) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  return (
    <div className="space-y-6">
      <AuthStatus />
      
      <div className="flex justify-end">
        <button
          onClick={loadProducts}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition text-sm"
        >
          Refresh Products
        </button>
      </div>

      {isAddingProduct ? (
        <AddProductForm
          onCancel={onCancelAdd}
          onProductCreated={handleProductCreated}
        />
      ) : editingProduct ? (
        <EditProductForm
          product={editingProduct}
          onCancel={() => setEditingProduct(null)}
          onProductUpdated={handleProductUpdated}
        />
      ) : loading ? (
        <div className="text-center py-8 text-gray-500">Loading products...</div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="text-red-500 mb-4">{error}</div>
          <button
            onClick={loadProducts}
            className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition"
          >
            Retry
          </button>
        </div>
      ) : (
        <ProductList 
          products={products} 
          onAddProduct={onAddProduct}
          onEditProduct={handleEditProduct}
          onProductDeleted={handleProductDeleted}
        />
      )}
    </div>
  );
};

export default ProductsView;
