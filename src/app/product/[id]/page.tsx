"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ProductDetail from "@/app/components/product/ProductDetail";
import { useCartStore } from "@/app/hooks/cart";
import { apiRequest } from "@/app/lib/apiGateway";

// Frontend product shape expected by ProductDetail
interface UiProduct {
  id: string | number;
  name: string;
  price: number;
  image: string; // mapped to data URL
  description: string;
  displayFeatures?: string;
  images?: string[]; // new property for gallery
}

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
  brand: string; // mapped from ProductResponse.category in backend; adjust if needed
  images: string[]; // base64 images
}

// Tiny transparent PNG as a safe default image (1x1)
const TRANSPARENT_PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO4m+oEAAAAASUVORK5CYII=";

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const { addItem } = useCartStore();

  const [product, setProduct] = useState<UiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await apiRequest<ApiCustomResponse<BackendProductResponse>>(
          `/product/public/fetchOneProduct/${encodeURIComponent(productId)}`,
          { method: "GET" }
        );
        const p = res.data;
        const ui: UiProduct = {
          id: p.id,
          name: p.productName,
          price: Number(p.price),
          image:
            p.images && p.images.length > 0
              ? `data:image/jpeg;base64,${p.images[0]}`
              : TRANSPARENT_PNG,
          description: p.description || "",
          // Optionally surface some detail as displayFeatures
          displayFeatures: undefined,
          // Provide full gallery to ProductDetail
          images: Array.isArray(p.images)
            ? p.images.map((b64) => `data:image/jpeg;base64,${b64}`)
            : undefined,
        };
        setProduct(ui);
      } catch (e: any) {
        const msg = (e?.message || "").toString().toLowerCase();
        if (msg.includes("not found") || msg.includes("no products") || msg.includes("404")) {
          setProduct(null);
          setError(null); // show not found UI
        } else {
          setError(e?.message || "Failed to load product");
        }
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchProduct();
  }, [productId]);

  const handleAddToCart = (id: string, quantity: number) => {
    if (!product) return;
    addItem({
      id: String(product.id),
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
    });
    // Optionally: toast or redirect
    console.log(`Added ${quantity} ${product.name} to cart`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-red-500">Product not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductDetail
        product={product}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}