"use client"

import React, { useEffect, useState } from 'react'
import ProductCard from './ProductCard';
import { Product } from '@/app/types/product';
import { apiRequest } from '@/app/lib/apiGateway';

// Backend response wrappers and DTOs
interface ApiCustomResponse<T> {
  token: string | null;
  statusCode: number;
  message: string;
  data: T;
}

interface BackendProductResponse {
  id: number;
  productName: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  images: string[]; // base64 images from backend
}

// Tiny transparent PNG as a safe default image (1x1)
const TRANSPARENT_PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO4m+oEAAAAASUVORK5CYII=";

// Fisher–Yates shuffle
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ProductGrid = ({ limit }: { limit?: number }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        // apiGateway baseURL is '/api/v1', so we only pass the path part here
        const res = await apiRequest<ApiCustomResponse<BackendProductResponse[]>>("/product/public/fetchProduct", {
          method: "GET",
        });
        const mapped: Product[] = (res.data || []).map((p) => ({
          id: p.id,
          name: p.productName,
          // Convert first base64 image to data URL if present
          image:
            p.images && p.images.length > 0
              ? `data:image/jpeg;base64,${p.images[0]}`
              : TRANSPARENT_PNG,
          // Backend does not provide weight; default to 1 for display
          weight: 1,
          price: Number(p.price),
        }));
        const randomized = shuffleArray(mapped);
        const finalList = typeof limit === 'number' && limit > 0 ? randomized.slice(0, limit) : randomized;
        setProducts(finalList);
      } catch (e: any) {
        setError(new Error(e?.message || 'Failed to load products'));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [limit]);

  if (loading) {
    return <div className="text-center py-12">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">Error: {error.message}</div>;
  }

  return (
    <section className='py-12'>
      <div className='container mx-auto px-4'>
        <div className='flex justify-center items-center mb-8'>
          <h2 className='text-3xl font-bold text-center py-9'>PRODUCTS</h2>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductGrid