import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axiosInstance from '@/lib/axios';
import { Cart, CartItem } from '@/types/cart';
import { toast } from 'react-toastify';

interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity: number) => Promise<void>;
  updateItem: (cartItemId: string, quantity: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      loading: false,
      error: null,

      fetchCart: async () => {
        set({ loading: true });
        try {
          const res = await axiosInstance.get('/cart');
          if (res.data.success) {
            set({ cart: res.data.data, error: null });
          }
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to fetch cart' });
        } finally {
          set({ loading: false });
        }
      },

      addItem: async (productId, quantity) => {
        set({ loading: true });
        try {
          const res = await axiosInstance.post('/cart/add', { productId, quantity });
          if (res.data.success) {
            toast.success('Item added to cart');
            await get().fetchCart();
          }
        } catch (error: any) {
          const message = error.response?.data?.message || 'Failed to add item to cart';
          toast.error(message);
          set({ error: message });
        } finally {
          set({ loading: false });
        }
      },

      updateItem: async (cartItemId, quantity) => {
        set({ loading: true });
        try {
          const res = await axiosInstance.patch('/cart/update', { cartItemId, quantity });
          if (res.data.success) {
            await get().fetchCart();
          }
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'Failed to update item');
        } finally {
          set({ loading: false });
        }
      },

      removeItem: async (cartItemId) => {
        set({ loading: true });
        try {
          const res = await axiosInstance.delete(`/cart/remove/${cartItemId}`);
          if (res.data.success) {
            toast.success('Item removed from cart');
            await get().fetchCart();
          }
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'Failed to remove item');
        } finally {
          set({ loading: false });
        }
      },

      clearCart: async () => {
        set({ loading: true });
        try {
          const res = await axiosInstance.delete('/cart/clear');
          if (res.data.success) {
            set({ cart: { ...get().cart!, items: [] } });
            toast.success('Cart cleared');
          }
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'Failed to clear cart');
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);
