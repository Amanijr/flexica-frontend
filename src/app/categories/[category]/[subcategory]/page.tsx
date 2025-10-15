"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { apiRequest } from "@/app/lib/apiGateway";
import ProductCard from "@/app/components/product/ProductCard";
import type { Product } from "@/app/types/product";

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

// normalize helper for loose matching
function norm(v: string) {
  return (v || "").toLowerCase();
}

function mapBackendToProduct(p: BackendProductResponse): Product {
  return {
    id: p.id,
    name: p.productName,
    image: p.images && p.images.length > 0 ? `data:image/jpeg;base64,${p.images[0]}` : TRANSPARENT_PNG,
    weight: 1,
    price: Number(p.price),
  };
}

export default function SubcategoryListingPage() {
  const params = useParams<{ category: string; subcategory: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const category = decodeURIComponent(params.category || "");
  const subcategory = decodeURIComponent(params.subcategory || "");

  // Controlled search query (falls back to subcategory)
  const initialQ = searchParams.get("q") || "";
  const [q, setQ] = useState<string>(initialQ);
  const [priceMin, setPriceMin] = useState<string>("");
  const [priceMax, setPriceMax] = useState<string>("");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Compose the effective search prefix according to backend behavior
  const effectivePrefix = useMemo(() => {
    // Prefer user query; otherwise use a combined category + subcategory to increase match chance
    if (q && q.trim().length > 0) return q.trim();
    return `${category} ${subcategory}`.trim();
  }, [q, category, subcategory]);

  // Fetch products using backend search endpoint
  useEffect(() => {
    const fetchAllProducts = async (): Promise<Product[]> => {
      const resAll = await apiRequest<ApiCustomResponse<BackendProductResponse[]>>("/product/public/fetchProduct", {
        method: "GET",
      });
      return (resAll.data || []).map(mapBackendToProduct);
    };

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await apiRequest<ApiCustomResponse<BackendProductResponse[]>>("/product/public/searchProduct", {
          method: "GET",
          params: { prefix: effectivePrefix },
        });

        const mapped: Product[] = (res.data || []).map(mapBackendToProduct);
        setProducts(mapped);
      } catch (e: any) {
        // Handle 404 (no products) by falling back to full fetch and client-side filtering
        const msg = (e?.message || "").toString().toLowerCase();
        if (msg.includes("no products found")) {
          try {
            const all = await fetchAllProducts();
            const catKey = norm(category);
            const subKey = norm(subcategory);
            const filtered = all.filter((p) => {
              const name = norm(p.name);
              // We don't have description/category fields on frontend Product type, so use name string matching only
              return name.includes(catKey) || name.includes(subKey);
            });
            setProducts(filtered);
            setError(null);
          } catch (fallbackErr: any) {
            setProducts([]);
            setError(fallbackErr?.message || "No products found");
          }
        } else {
          setError(e?.message || "Failed to load products");
        }
      } finally {
        setLoading(false);
      }
    };

    // If no effective prefix, pull everything
    if (!effectivePrefix) {
      (async () => {
        try {
          setLoading(true);
          setError(null);
          const all = await fetchAllProducts();
          setProducts(all);
        } catch (e: any) {
          const msg = (e?.message || "").toString().toLowerCase();
          if (msg.includes("no products found")) {
            setProducts([]);
            setError(null);
          } else {
            setError(e?.message || "Failed to load products");
          }
        } finally {
          setLoading(false);
        }
      })();
      return;
    }

    fetchData();
  }, [effectivePrefix, category, subcategory]);

  // Client-side filter by price range
  const filtered = useMemo(() => {
    const min = priceMin ? parseFloat(priceMin) : Number.NEGATIVE_INFINITY;
    const max = priceMax ? parseFloat(priceMax) : Number.POSITIVE_INFINITY;
    return products.filter((p) => p.price >= min && p.price <= max);
  }, [products, priceMin, priceMax]);

  const onSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (q) params.set("q", q); else params.delete("q");
    router.replace(`/categories/${encodeURIComponent(category)}/${encodeURIComponent(subcategory)}?${params.toString()}`);
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold">
            {category} / <span className="text-blue-600">{subcategory}</span>
          </h1>
          <p className="text-gray-600 mt-1">Browse products and refine with search and filters</p>
        </div>

        {/* Search and Filters */}
        <form onSubmit={onSubmitSearch} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          <input
            type="text"
            placeholder={`Search in ${subcategory}...`}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 col-span-2"
          />
          <input
            type="number"
            min={0}
            step={0.01}
            placeholder="Min Price"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
          <input
            type="number"
            min={0}
            step={0.01}
            placeholder="Max Price"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
          <div className="md:col-span-4 flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">
              Search
            </button>
            <button
              type="button"
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md"
              onClick={() => {
                setQ("");
                setPriceMin("");
                setPriceMax("");
                router.replace(`/categories/${encodeURIComponent(category)}/${encodeURIComponent(subcategory)}`);
              }}
            >
              Reset
            </button>
          </div>
        </form>

        {/* Results */}
        {loading && <div className="py-12 text-center">Loading products...</div>}
        {error && !loading && (
          <div className="py-12 text-center text-red-500">Error: {error}</div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-center text-gray-600 py-12">
                No products found.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
