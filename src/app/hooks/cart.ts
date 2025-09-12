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
  // API Gateway integration methods
  syncCart: () => Promise<void>;
  loadCartFromServer: () => Promise<void>;
  mergeCarts: () => Promise<void>;
  isSyncing: boolean;
  lastSyncError: string | null;
}

// Create the store
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

      // clear cart
      clearCart: () => set({ items: [] }),

      // get formatted subtotal
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

      // update quantity
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

      // get cart items in backend format
      getBackendFormat: () => {
        return get().items.map(item => ({
          productId: parseInt(item.id),
          quantity: item.quantity
        }));
      },

      // API Gateway integration methods
      syncCart: async () => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) return;
        
        set({ isSyncing: true, lastSyncError: null });
        try {
          // Call API endpoint to sync entire cart
          const cartData = get().getBackendFormat();
          await apiRequest('/cart/addToCart', {
            method: 'POST',
            data: { cartItemsDtos: cartData }
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
          
          // Transform backend response to our CartItem format
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

      mergeCarts: async () => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) return;
        
        set({ isSyncing: true, lastSyncError: null });
        try {
          const localCart = get().getBackendFormat();
          
          // Call API endpoint to merge carts by adding local items to server cart
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

    // persist the cart
    {
      name: "cart", 
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Create a hook for automatic sync after cart operations
export const useCartWithSync = () => {
  const {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    syncCart,
    loadCartFromServer,
    mergeCarts,
    isSyncing,
    lastSyncError,
    ...rest
  } = useCartStore();

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!localStorage.getItem(TOKEN_KEY);
  };

  // Add single item to backend
  const addItemToServer = async (item: CartItem) => {
    try {
      await apiRequest('/cart/addToCart', {
        method: 'POST',
        data: { 
          cartItemsDtos: [{ 
            productId: parseInt(item.id), 
            quantity: item.quantity 
          }] 
        }
      });
    } catch (error: any) {
      console.error("Failed to add item to server:", error);
      throw error;
    }
  };

  // Enhanced methods that automatically sync after operations when authenticated
  const addItemWithSync = async (item: CartItem) => {
    addItem(item);
    if (isAuthenticated()) {
      await addItemToServer(item);
    }
  };

  const removeItemWithSync = async (id: string) => {
    // For removal, we need to set quantity to 0 or use a different endpoint
    // This depends on your backend API
    removeItem(id);
    if (isAuthenticated()) {
      // Assuming your backend has a remove endpoint
      try {
        await apiRequest(`/cart/remove/${id}`, {
          method: 'DELETE'
        });
      } catch (error: any) {
        console.error("Failed to remove item from server:", error);
        // If removal fails, we might need to reload the cart from server
        await loadCartFromServer();
      }
    }
  };

  const updateQuantityWithSync = async (id: string, amount: number) => {
    updateQuantity(id, amount);
    if (isAuthenticated()) {
      const item = items.find(i => i.id === id);
      if (item) {
        await apiRequest('/cart/addToCart', {
          method: 'POST',
          data: { 
            cartItemsDtos: [{ 
              productId: parseInt(id), 
              quantity: item.quantity 
            }] 
          }
        });
      }
    }
  };

  const clearCartWithSync = async () => {
    clearCart();
    if (isAuthenticated()) {
      // Assuming your backend has a clear endpoint
      try {
        await apiRequest('/cart/clear', {
          method: 'DELETE'
        });
      } catch (error: any) {
        console.error("Failed to clear cart on server:", error);
      }
    }
  };

  return {
    items,
    addItem: addItemWithSync,
    removeItem: removeItemWithSync,
    updateQuantity: updateQuantityWithSync,
    clearCart: clearCartWithSync,
    syncCart,
    loadCartFromServer,
    mergeCarts,
    isSyncing,
    lastSyncError,
    isAuthenticated,
    ...rest
  };
};