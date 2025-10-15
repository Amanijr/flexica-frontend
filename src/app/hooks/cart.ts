import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { StaticImageData } from "next/image";
import { apiRequest, TOKEN_KEY } from "../lib/apiGateway";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string | StaticImageData;
}

interface CartStore {
  items: CartItem[];
  isSyncing: boolean;
  lastSyncError: string | null;
  hasLoadedFromServer: boolean;
  pendingSync: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, amount: number) => void;
  getFormattedSubtotal: () => string;
  getTotalItems: () => number;
  getBackendFormat: () => { productId: number; quantity: number }[];
  syncToServer: (immediate?: boolean) => Promise<void>;
  loadFromServer: () => Promise<void>;
  handleLogin: () => Promise<void>;
  handleLogout: () => void;
  initializeCart: () => Promise<void>;
}

// SSR-safe storage wrapper
const safeStorage = {
  getItem: (name: string) => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(name);
  },
  setItem: (name: string, value: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(name, value);
  },
  removeItem: (name: string) => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(name);
  }
};

const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

let syncTimeout: NodeJS.Timeout | null = null;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isSyncing: false,
      lastSyncError: null,
      hasLoadedFromServer: false,
      pendingSync: false,

      addItem: (item: CartItem) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          const newItems = existing
            ? state.items.map((i) =>
                i.id === item.id 
                  ? { ...i, quantity: i.quantity + item.quantity } 
                  : i
              )
            : [...state.items, item];
          
          return { items: newItems, pendingSync: !!getToken() };
        });

        if (getToken()) {
          get().syncToServer(false);
        }
      },

      removeItem: (id: string) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
          pendingSync: !!getToken()
        }));

        if (getToken()) {
          apiRequest("/cart/removeFromCart", {
            method: "DELETE",
            data: { productId: parseInt(id) },
          }).catch((err: any) => {
            console.error("Failed to sync item removal:", err);
          });
        }
      },

      clearCart: () => {
        set({ items: [] });
        
        const token = getToken();
        if (token) {
          apiRequest("/cart/clearCart", {
            method: "DELETE",
          }).catch((err: any) => {
            console.error("Failed to clear server cart:", err);
          });
        }
      },

      updateQuantity: (id: string, amount: number) => {
        const currentItem = get().items.find(item => item.id === id);
        if (!currentItem) return;

        const newQuantity = Math.max(currentItem.quantity + amount, 1);
        
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: newQuantity } : item
          ),
          pendingSync: !!getToken()
        }));

        if (getToken()) {
          get().syncToServer(false);
        }
      },

      getFormattedSubtotal: () => {
        const subtotal = get().items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
        return new Intl.NumberFormat("en-US", { 
          style: "currency", 
          currency: "TZS" 
        }).format(subtotal);
      },

      getTotalItems: () => 
        get().items.reduce((acc, item) => acc + item.quantity, 0),

      getBackendFormat: () =>
        get().items.map((item) => ({ 
          productId: parseInt(item.id), 
          quantity: item.quantity 
        })),

      // Sync local cart to server with optional debouncing
      syncToServer: async (immediate = true) => {
        const token = getToken();
        if (!token) return;

        const localCart = get().getBackendFormat();
        if (!localCart.length) return;

        // Debounce non-immediate syncs
        if (!immediate) {
          if (syncTimeout) clearTimeout(syncTimeout);
          syncTimeout = setTimeout(() => {
            get().syncToServer(true);
          }, 500);
          return;
        }

        if (syncTimeout) {
          clearTimeout(syncTimeout);
          syncTimeout = null;
        }

        set({ isSyncing: true, lastSyncError: null });
        try {
          await apiRequest("/cart/addToCart", {
            method: "POST",
            data: { cartItemsDtos: localCart },
          });
          set({ pendingSync: false });
          console.log("Cart synced to server");
        } catch (error: any) {
          console.error("Failed to sync cart:", error);
          set({ 
            lastSyncError: error.message || "Failed to sync cart",
            pendingSync: true 
          });
        } finally {
          set({ isSyncing: false });
        }
      },

      // Load cart from server (replaces local cart)
      loadFromServer: async () => {
        const token = getToken();
        if (!token) return;

        set({ isSyncing: true, lastSyncError: null });
        try {
          const response = await apiRequest<{ data: any }>("/cart/viewMyCart");
          const serverItemsRaw = Array.isArray(response?.data?.cartItems) 
            ? response.data.cartItems 
            : [];

          console.log(`Loading ${serverItemsRaw.length} items from server`);

          // Fetch product details
          const uniqueIds: number[] = Array.from(
            new Set(
              serverItemsRaw
                .map((it: any) => Number(it?.productId))
                .filter((id: any) => Number.isFinite(id))
            )
          );

          const productMap = new Map<number, { 
            name: string; 
            price: number; 
            image: string 
          }>();

          await Promise.all(
            uniqueIds.map(async (pid) => {
              try {
                const prodRes = await apiRequest<{ data: any }>(
                  `/product/public/fetchOneProduct/${pid}`
                );
                const p = prodRes?.data;
                productMap.set(pid, {
                  name: p?.productName ?? `Product #${pid}`,
                  price: Number(p?.price ?? 0),
                  image:
                    Array.isArray(p?.images) && p.images[0]
                      ? `data:image/jpeg;base64,${p.images[0]}`
                      : "",
                });
              } catch (err) {
                console.error(`Failed to fetch product ${pid}:`, err);
                productMap.set(pid, {
                  name: `Product #${pid}`,
                  price: 0,
                  image: "",
                });
              }
            })
          );

          const serverItems: CartItem[] = serverItemsRaw.map((item: any) => {
            const pid = Number(item?.productId);
            const details = productMap.get(pid);
            return {
              id: String(pid),
              name: details?.name ?? `Product #${pid}`,
              price: details?.price ?? 0,
              quantity: Number(item?.quantity ?? 0),
              image: details?.image ?? "",
            };
          });

          set({ 
            items: serverItems,
            hasLoadedFromServer: true,
            pendingSync: false
          });
          console.log(`Loaded ${serverItems.length} items from server`);
        } catch (err: any) {
          console.error("Failed to load cart from server:", err);
          set({ lastSyncError: err.message || "Failed to load cart" });
        } finally {
          set({ isSyncing: false });
        }
      },

      // Smart merge strategy on login: combine local + server carts
      handleLogin: async () => {
        const token = getToken();
        if (!token) {
          console.log("No token found during login");
          return;
        }

        if (get().hasLoadedFromServer) {
          console.log("Cart already initialized");
          return;
        }

        console.log("User logged in - initiating cart merge");
        set({ isSyncing: true });

        try {
          const localItems = [...get().items];
          console.log(`Local cart: ${localItems.length} items`);

          const response = await apiRequest<{ data: any }>("/cart/viewMyCart");
          const serverCart = response?.data?.cartItems || [];
          console.log(`Server cart: ${serverCart.length} items`);

          // Both empty
          if (localItems.length === 0 && serverCart.length === 0) {
            console.log("Both carts empty - no merge needed");
            set({ hasLoadedFromServer: true, isSyncing: false });
            return;
          }

          // Only server has items
          if (localItems.length === 0 && serverCart.length > 0) {
            console.log("Loading cart from server (local empty)");
            await get().loadFromServer();
            return;
          }

          // Only local has items
          if (localItems.length > 0 && serverCart.length === 0) {
            console.log("Syncing local cart to server (server empty)");
            await get().syncToServer(true);
            set({ hasLoadedFromServer: true });
            return;
          }

          // Both have items - perform additive merge
          console.log("Both carts have items - performing smart merge");
          
          const serverMap = new Map<string, number>();
          serverCart.forEach((item: any) => {
            serverMap.set(String(item.productId), Number(item.quantity));
          });

          const mergeItems: { productId: number; quantity: number }[] = [];

          localItems.forEach(item => {
            const serverQty = serverMap.get(item.id) || 0;
            if (serverQty > 0) {
              // Item exists in both - add quantities
              mergeItems.push({
                productId: parseInt(item.id),
                quantity: item.quantity
              });
              console.log(`Merging ${item.name}: server(${serverQty}) + local(${item.quantity})`);
            } else {
              // Item only in local - add to server
              mergeItems.push({
                productId: parseInt(item.id),
                quantity: item.quantity
              });
              console.log(`Adding ${item.name} from local (${item.quantity})`);
            }
          });

          if (mergeItems.length > 0) {
            await apiRequest("/cart/addToCart", {
              method: "POST",
              data: { cartItemsDtos: mergeItems },
            });
            console.log(`Merged ${mergeItems.length} items to server`);
          }

          await get().loadFromServer();
          console.log("Cart merge complete");

        } catch (err: any) {
          console.error("Failed to merge carts:", err);
          set({ 
            lastSyncError: err?.message || "Failed to merge carts",
            isSyncing: false 
          });
        }
      },

      // Keep cart in localStorage on logout for guest browsing
      handleLogout: () => {
        console.log("User logged out - preserving local cart");
        set({ 
          hasLoadedFromServer: false,
          pendingSync: false,
          lastSyncError: null,
          isSyncing: false
        });
      },

      // Initialize cart on app startup
      initializeCart: async () => {
        const token = getToken();
        if (token && !get().hasLoadedFromServer) {
          console.log("Initializing cart for logged-in user");
          await get().loadFromServer();
        }
      },
    }),

    {
      name: "cart-storage",
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({ 
        items: state.items,
      }),
    }
  )
);