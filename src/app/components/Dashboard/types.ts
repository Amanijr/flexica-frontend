// components/dashboard/types.ts

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
    name: string;
    price: string;
    image: string;
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