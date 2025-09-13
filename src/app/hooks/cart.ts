import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { StaticImageData } from "next/image";
import { apiRequest, TOKEN_KEY } from '../lib/apiGateway'; 

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string | StaticImageData;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getFormattedSubtotal: () => string;
  getTotalItems: () => number;
  updateQuantity: (id: string, amount: number) => void;
  getBackendFormat: () => { productId: number; quantity: number }[];
  syncCart: () => Promise<void>;
  loadCartFromServer: () => Promise<void>;
  mergeCarts: () => Promise<void>;
  isSyncing: boolean;
  lastSyncError: string | null;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isSyncing: false,
      lastSyncError: null,

      addItem: (item: CartItem) => 
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            };
          }
          console.log("item added", item);
          return { items: [...state.items, item] };
        }),

      removeItem: (id: string) => {
        console.log("item removed", id);
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },

      clearCart: () => set({ items: [] }),

      getFormattedSubtotal: () => {
        console.log("getting formatted subtotal");
        const subtotal = get().items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "TZS",
        }).format(subtotal);
      },

      getTotalItems: () => {
        console.log("getting total items");
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },

      updateQuantity: (id: string, amount: number) =>{
        console.log("updating quantity", id, amount);
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, quantity: Math.max(item.quantity + amount, 1) }
              : item
            ),
        }));
      },

      getBackendFormat: () => {
        return get().items.map(item => ({
          productId: parseInt(item.id),
          quantity: item.quantity
        }));
      },

      // Sync cart to server (empty-cart guard added)
      syncCart: async () => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) return;

        const localCart = get().getBackendFormat();
        if (!localCart || localCart.length === 0) {
          console.log("No local cart items, skipping sync");
          return;
        }

        set({ isSyncing: true, lastSyncError: null });
        try {
          await apiRequest('/cart/addToCart', {
            method: 'POST',
            data: { cartItemsDtos: localCart }
          });
          console.log("Cart synced successfully");
        } catch (error: any) {
          console.error("Failed to sync cart:", error);
          set({ lastSyncError: error.message || "Failed to sync cart" });
        } finally {
          set({ isSyncing: false });
        }
      },

      loadCartFromServer: async () => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) return;

        set({ isSyncing: true, lastSyncError: null });
        try {
          const response = await apiRequest<{ cartItems: any[] }>('/cart/viewMyCart');
          const serverCart = response.cartItems.map(item => ({
            id: item.product.id.toString(),
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.image
          }));
          set({ items: serverCart });
          console.log("Cart loaded from server");
        } catch (error: any) {
          console.error("Failed to load cart from server:", error);
          set({ lastSyncError: error.message || "Failed to load cart" });
        } finally {
          set({ isSyncing: false });
        }
      },

      // Merge local cart with server (empty-cart guard added)
      mergeCarts: async () => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) return;

        const localCart = get().getBackendFormat();
        if (!localCart || localCart.length === 0) {
          console.log("No local cart items, skipping merge");
          return;
        }

        set({ isSyncing: true, lastSyncError: null });
        try {
          await apiRequest('/cart/addToCart', {
            method: 'POST',
            data: { cartItemsDtos: localCart }
          });

          const response = await apiRequest<{ cartItems: any[] }>('/cart/viewMyCart');
          const mergedCart = response.cartItems.map(item => ({
            id: item.product.id.toString(),
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.image
          }));
          set({ items: mergedCart });
          console.log("Carts merged successfully");
        } catch (error: any) {
          console.error("Failed to merge carts:", error);
          set({ lastSyncError: error.message || "Failed to merge carts" });
        } finally {
          set({ isSyncing: false });
        }
      },
    }),

    {
      name: "cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
