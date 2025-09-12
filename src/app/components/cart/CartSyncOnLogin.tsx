"use client";

import { useEffect } from "react";
import { useCartWithSync } from "@/app/hooks/cart";
import { useSession } from "../../auth/SessionContext";

export const CartSyncOnLogin = () => {
  const { mergeCarts } = useCartWithSync();
  const { session } = useSession();

  useEffect(() => {
    if (session) {
      // User is logged in → merge local cart to backend
      mergeCarts().catch((err) => {
        console.error("Failed to merge local cart with backend:", err);
      });
    }
  }, [session, mergeCarts]);

  return null;
};
