"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { searchProducts, searchCategories, ProductSearchResult, CategorySearchResult } from "@/app/lib/searchApi";
import { Search, Package, FolderOpen, ArrowLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function SearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const filter = searchParams.get("filter") || "all";

  const [products, setProducts] = useState<ProductSearchResult[]>([]);
  const [categories, setCategories] = useState<CategorySearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query, filter]);

  const performSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      if (filter === "all" || filter === "products") {
        const productResults = await searchProducts(query);
        setProducts(productResults);
      } else {
        setProducts([]);
      }

      if (filter === "all" || filter === "categories") {
        const categoryResults = await searchCategories(query);
        setCategories(categoryResults);
      } else {
        setCategories([]);
      }
    } catch (err: any) {
      setError(err.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const totalResults = products.length + categories.length;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Search Results</h1>
          <p className="text-gray-600">
            {loading ? (
              "Searching..."
            ) : (
              <>
                Found <span className="font-semibold">{totalResults}</span> result(s) for "
                <span className="font-semibold">{query}</span>"
              </>
            )}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700">{error}</p>
          </div>
        ) : totalResults === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <Search className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No results found</h2>
            <p className="text-gray-500 mb-6">Try different keywords or browse our categories</p>
            <button
              onClick={() => router.push("/")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Products Section */}
            {products.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-800">Products ({products.length})</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden group"
                    >
                      <div className="relative h-48 bg-gray-100">
                        {product.images && product.images[0] ? (
                          <Image
                            src={`data:image/jpeg;base64,${product.images[0]}`}
                            alt={product.productName}
                            fill
                            className="object-contain p-4 group-hover:scale-105 transition"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Package className="w-16 h-16 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">
                          {product.productName}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-blue-600">
                            TZS {product.price.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500">{product.brand}</span>
                        </div>
                        {product.quantity > 0 ? (
                          <span className="text-xs text-green-600 mt-2 block">In Stock</span>
                        ) : (
                          <span className="text-xs text-red-600 mt-2 block">Out of Stock</span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Categories Section */}
            {categories.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <FolderOpen className="w-6 h-6 text-green-600" />
                  <h2 className="text-2xl font-bold text-gray-800">Categories ({categories.length})</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <FolderOpen className="w-8 h-8 text-green-600 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-1">{category.categoryName}</h3>
                          <p className="text-sm text-gray-600 mb-2">{category.categoryDescription}</p>
                          {category.parent && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              Parent: {category.parent}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}
