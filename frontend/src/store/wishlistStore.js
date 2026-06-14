import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [], // array of productId

      toggleWishlist: (productId) => {
        const exists = get().items.includes(productId);
        set({
          items: exists
            ? get().items.filter((id) => id !== productId)
            : [...get().items, productId],
        });
        return !exists; // true if added
      },

      isWishlisted: (productId) => get().items.includes(productId),

      remove: (productId) => set({ items: get().items.filter((id) => id !== productId) }),

      clear: () => set({ items: [] }),
    }),
    { name: 'chimboy_wishlist' },
  ),
);
