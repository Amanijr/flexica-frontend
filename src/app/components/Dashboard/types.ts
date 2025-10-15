// components/dashboard/types.ts

import { StaticImageData } from "next/image";

export interface Sale {
    id: number;
    orderId: string;
    customer: string;
    date: string;
    amount: string;
    status: string;
  }
  
  export interface Product {
    id: number;
    productName: string; // matches backend response
    price: number;
    description?: string;
    category?: string; // backend returns category as string
    quantity?: number;
    brand?: string; // this might be in the category field based on backend
    isAvailable?: boolean;
    images?: string[]; // backend returns array of base64 image strings
  }
  
  export interface ProductFormData {
    productName: string;
    quantity: number;
    brand: string;
    isAvailable: boolean;
    price: number;
    description: string;
    categoryId: number;
  }