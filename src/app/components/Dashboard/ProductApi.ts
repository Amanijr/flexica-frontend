// src/lib/productApi.ts
import { apiRequest } from "@/app/lib/apiGateway";
import { Product } from "./types";

// Create Product
export const createProduct = async (data: FormData) => {
  const response = await apiRequest<{
    data: Product;
    status: number;
    message: string;
  }>("/product/createProduct", {
    method: "POST",
    data, // pass the actual FormData variable
    requiresAuth: true,
  });
  
  // Extract the actual product from the wrapped response
  return response.data;
};

// Update Product (by ID)
export const updateProduct = async (id: number, data: FormData) => {
  const response = await apiRequest<{
    data: Product;
    status: number;
    message: string;
  }>(`/product/updateProduct/${id}`, {
    method: "PUT",
    data,
    requiresAuth: true,
  });
  
  // Extract the actual product from the wrapped response
  return response.data;
};

// Update Product Stock
export const updateStock = async (productId: number, quantity: number) => {
  return apiRequest<{ message: string }>("/product/updateStock", {
    method: "POST",
    data: { productId, quantity },
    requiresAuth: true,
  });
};

// Delete Product
export const deleteProduct = async (productId: number) => {
  const response = await apiRequest<{
    data: { message: string };
    status: number;
    message: string;
  }>(`/product/deleteProduct/${productId}`, {
    method: "DELETE",
    requiresAuth: true,
  });
  
  return response.data;
};

// Fetch Vendor's Own Products (for dashboard)
export const fetchMyProducts = async (): Promise<Product[]> => {
  const response = await apiRequest<{
    data: Product[];
    status: number;
    message: string;
  }>("/product/fetchMyProduct", {
    method: "GET",
    requiresAuth: true,
  });
  
  // Extract the actual products array from the wrapped response
  return response.data || [];
};

// Fetch Public Products (for customer view)
export const fetchPublicProducts = async (): Promise<Product[]> => {
  const response = await apiRequest<{
    data: Product[];
    status: number;
    message: string;
  }>("/product/public/fetchProduct", {
    method: "GET",
  });
  
  // Extract the actual products array from the wrapped response
  return response.data || [];
};

// Alias for backward compatibility (now fetches vendor's products)
export const fetchProducts = fetchMyProducts;
