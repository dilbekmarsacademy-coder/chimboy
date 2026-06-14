import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { promoCodes } from '../services/mockData';

const DELIVERY_FEE = 15000;
const FREE_DELIVERY_THRESHOLD = 150000;

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      appliedPromoCode: null,
      discountPercent: 0,

      addItem: (product, { weight, quantity = 1, price } = {}) => {
        const finalWeight = weight ?? product.weight;
        // Price may differ per selected weight variant; fall back to base price.
        const finalPrice = price ?? product.price;
        const key = `${product.id}-${finalWeight}`;
        const existing = get().items.find((i) => i.key === key);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.key === key ? { ...i, quantity: i.quantity + quantity } : i,
            ),
          });
        } else {
          set({
            items: [
              ...get().items,
              {
                key,
                productId: product.id,
                name_uz: product.name_uz,
                name_ru: product.name_ru,
                image: product.images?.[0],
                price: finalPrice,
                quantity,
                weight: finalWeight,
                unit: product.unit,
              },
            ],
          });
        }
      },

      removeItem: (key) => set({ items: get().items.filter((i) => i.key !== key) }),

      updateQuantity: (key, quantity) => {
        if (quantity < 1) return;
        set({
          items: get().items.map((i) => (i.key === key ? { ...i, quantity } : i)),
        });
      },

      clearCart: () => set({ items: [], appliedPromoCode: null, discountPercent: 0 }),

      applyPromoCode: (code) => {
        const normalized = String(code || '').trim().toUpperCase();
        const percent = promoCodes[normalized];
        if (percent) {
          set({ appliedPromoCode: normalized, discountPercent: percent });
          return { ok: true, percent };
        }
        return { ok: false };
      },

      removePromoCode: () => set({ appliedPromoCode: null, discountPercent: 0 }),

      // selectors
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      discountAmount: () => Math.round((get().subtotal() * get().discountPercent) / 100),
      deliveryFee: () => {
        const sub = get().subtotal();
        if (sub === 0) return 0;
        return sub >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
      },
      total: () => {
        const sub = get().subtotal();
        return sub - get().discountAmount() + get().deliveryFee();
      },
    }),
    { name: 'chimboy_cart' },
  ),
);

export { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD };
