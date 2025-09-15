// components/dashboard/ProductsView.tsx

import ProductList from './ProductList';
import AddProductForm from './AddProductForm';
import { Product } from './types';

interface ProductsViewProps {
  products: Product[];
  isAddingProduct: boolean;
  onAddProduct: () => void;
  onCancelAdd: () => void;
  onProductCreated: (newProduct: Product) => void;
}

const ProductsView = ({ 
  products, 
  isAddingProduct, 
  onAddProduct, 
  onCancelAdd, 
  onProductCreated 
}: ProductsViewProps) => {
  return (
    <div className="space-y-6">
      {isAddingProduct ? (
        <AddProductForm
          onCancel={onCancelAdd}
          onProductCreated={onProductCreated}
        />
      ) : (
        <ProductList products={products} onAddProduct={onAddProduct} />
      )}
    </div>
  );
};

export default ProductsView;