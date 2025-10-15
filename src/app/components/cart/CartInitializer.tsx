"use client";

import { useEffect } from "react";
import { useCartStore } from "@/app/hooks/cart";

export default function CartInitializer() {
  const initializeCart = useCartStore((s) => s.initializeCart);

  useEffect(() => {
    initializeCart(); 
  }, [initializeCart]);

  return null;
 }
