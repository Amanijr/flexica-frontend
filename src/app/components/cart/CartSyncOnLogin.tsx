'use client';

import { useEffect, useRef } from 'react';
import { useCartStore } from '@/app/hooks/cart';
import { useSession } from '@/app/auth/SessionContext';

export const CartSyncOnLogin = () => {
  const mergeCarts = useCartStore((state) => state.mergeCarts);
  const { session, loading } = useSession();
  const hasMerged = useRef(false);

  useEffect(() => {
    const mergeCartAfterLogin = async () => {
      if (session && !loading && !hasMerged.current) {
        try {
          await new Promise((res) => setTimeout(res, 300));
          await mergeCarts();
          hasMerged.current = true;
        } catch (err) {
          console.error('Failed to merge cart after login:', err);
        }
      }
    };
    mergeCartAfterLogin();
  }, [session, loading, mergeCarts]);

  return null;
};
