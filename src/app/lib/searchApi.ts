// src/app/lib/searchApi.ts
import { apiRequest } from "./apiGateway";

export interface ProductSearchResult {
  id: number;
  productName: string;
  description: string;
  price: number;
  quantity: number;
  brand: string;
  images: string[];
}

export interface CategorySearchResult {
  id: number;
  categoryName: string;
  categoryDescription: string;
  parent: string | null;
}

/**
 * Search for products by name or description
 * Backend endpoint: GET /api/v1/product/public/searchProduct?prefix={query}
 */
export async function searchProducts(query: string): Promise<ProductSearchResult[]> {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const response = await apiRequest<{
    data: ProductSearchResult[];
    status: number;
    message: string;
  }>(`/product/public/searchProduct?prefix=${encodeURIComponent(query)}`, {
    method: "GET",
  });

  return response.data || [];
}

/**
 * Search for categories by name
 * Backend endpoint: GET /api/v1/product/public/searchCategory?prefix={query}
 */
export async function searchCategories(query: string): Promise<CategorySearchResult[]> {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const response = await apiRequest<{
    data: CategorySearchResult[];
    status: number;
    message: string;
  }>(`/product/public/searchCategory?prefix=${encodeURIComponent(query)}`, {
    method: "GET",
  });

  return response.data || [];
}
