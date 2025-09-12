"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ProductDetail from "@/app/components/product/ProductDetail";
import { useCartStore } from "@/app/hooks/cart";
import { Product } from "@/app/types/product";
import smartWatchImage from "@/app/components/assets/smartwatch-removebg-preview.png"
import sportsCarImage from "@/app/components/assets/car-removebg-preview.png"
import macbookImage from "@/app/components/assets/macbook-removebg-preview.png"
import iphoneImage from "@/app/components/assets/iphone-16-removebg-preview.png"
import houseImage from "@/app/components/assets/house-removebg-preview.png"
import furnitureImage from "@/app/components/assets/furniture-removebg-preview.png"
import footballImage from "@/app/components/assets/football-removebg-preview.png"
import controllerImage from "@/app/components/assets/controller-removebg-preview.png"
import fashionImage from "@/app/components/assets/fashion-removebg-preview.png"

// Use the same placeholder data as ProductGrid
const placeholderProducts: (Product & { description: string; displayFeatures?: string })[] = [
  {
    id: 1,
    name: 'Apple Watch Series 9',
    image: smartWatchImage,
    weight: 0.045,
    price: 399.99,
    description: "a stylish and functional smart watch to meet your daily needs",
    displayFeatures: "A top-grade, high-definition OLED screen that provides a clear and consistent display."
  },
  {
    id: 2,
    name: 'MacBook Pro 16"',
    image: macbookImage,
    weight: 2.14,
    price: 2499.99,
    description: "Professional laptop with cutting-edge performance and stunning display",
    displayFeatures: "16-inch Liquid Retina XDR display with ProMotion technology for smooth scrolling and precise color accuracy."
  },
  {
    id: 3,
    name: 'iPhone 16 Pro',
    image: iphoneImage,
    weight: 0.221,
    price: 999.99,
    description: "The most advanced iPhone with titanium design and powerful camera system",
    displayFeatures: "6.1-inch Super Retina XDR display with ProMotion and Dynamic Island."
  },
  {
    id: 4,
    name: 'Tesla Model S',
    image: sportsCarImage,
    weight: 2162.0,
    price: 89999.99,
    description: "Electric luxury sedan with autopilot capabilities and long range",
    displayFeatures: "17-inch touchscreen display with over-the-air software updates and premium sound system."
  },
  {
    id: 5,
    name: 'Modern Sofa Set',
    image: furnitureImage,
    weight: 85.5,
    price: 1299.99,
    description: "Contemporary 3-piece sofa set perfect for modern living spaces",
    displayFeatures: "Premium fabric upholstery with ergonomic design and easy-to-clean materials."
  },
  {
    id: 6,
    name: 'Wireless Gaming Controller',
    image: controllerImage,
    weight: 0.28,
    price: 79.99,
    description: "High-performance wireless controller for gaming consoles and PC",
    displayFeatures: "Precision analog sticks, customizable buttons, and low-latency wireless connectivity."
  },
  {
    id: 7,
    name: 'Luxury Villa',
    image: houseImage,
    weight: 0.001,
    price: 850000.00,
    description: "Exclusive luxury villa with premium amenities and stunning architecture",
    displayFeatures: "Smart home automation system with integrated security and climate control."
  },
  {
    id: 8,
    name: 'Smart Home Device',
    image: houseImage,
    weight: 1.2,
    price: 299.99,
    description: "All-in-one smart home hub for controlling your connected devices",
    displayFeatures: "Voice control, mobile app integration, and compatibility with 100+ smart devices."
  },
  {
    id: 9,
    name: 'Premium Football',
    image: footballImage,
    weight: 0.45,
    price: 49.99,
    description: "Professional-grade football for training and matches",
    displayFeatures: "Hand-stitched leather construction with optimal grip and durability."
  },
  {
    id: 10,
    name: 'Designer Fashion Collection',
    image: fashionImage,
    weight: 1.2,
    price: 199.99,
    description: "Exclusive designer fashion pieces for the modern wardrobe",
    displayFeatures: "Premium materials with attention to detail and contemporary styling."
  },
  {
    id: 11,
    name: 'Gaming Smartwatch',
    image: smartWatchImage,
    weight: 0.052,
    price: 299.99,
    description: "Gaming-focused smartwatch with advanced health tracking and connectivity",
    displayFeatures: "AMOLED display with customizable watch faces and gaming integration features."
  },
  {
    id: 12,
    name: 'MacBook Air M3',
    image: macbookImage,
    weight: 1.24,
    price: 1199.99,
    description: "Ultra-thin laptop with M3 chip for exceptional performance and battery life",
    displayFeatures: "13.6-inch Liquid Retina display with True Tone technology and all-day battery life."
  },
];

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const { addItem } = useCartStore();
  const [product, setProduct] = useState(placeholderProducts[0]); // Default to first product
  const [loading, setLoading] = useState(true);

  // In a real app, fetch product data based on productId
  useEffect(() => {
    // Simulate API call
    const foundProduct = placeholderProducts.find(p => p.id.toString() === productId);
    if (foundProduct) {
      setProduct(foundProduct);
    }
    setLoading(false);
    
    // Real implementation would be:
    // fetchProduct(productId).then(setProduct).finally(() => setLoading(false));
  }, [productId]);

  const handleAddToCart = (productId: string, quantity: number) => {
    addItem({
      id: productId,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image
    });
    
    // Show success message or redirect to cart
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