// src/lib/productApi.ts
import { apiRequest } from "@/app/lib/apiGateway";
import { Product, ProductFormData } from "./types";

// Create Product
export const createProduct = async (data: FormData) => {
  return apiRequest<Product>("/product/createProduct", {
    method: "POST",
    data, 
    requiresAuth: true,
  });
};

// Update Product (by ID)
export const updateProduct = async (id: number, data: FormData) => {
  return apiRequest<Product>(`/product/updateProduct/${id}`, {
    method: "PUT",
    data,
    requiresAuth: true,
  });
};

// Update Product Stock
export const updateStock = async (productId: number, quantity: number) => {
  return apiRequest<{ message: string }>("/product/updateStock", {
    method: "POST",
    data: { productId, quantity },
    requiresAuth: true,
  });
};

// Fetch Public Products
export const fetchProducts = async (): Promise<Product[]> => {
  return apiRequest<Product[]>("/product/public/fetchProduct", {
    method: "GET",
  });
};
