import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as userService from '../services/userService';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (credentials) => {
        const user = await userService.login(credentials);
        set({ user, isAuthenticated: true });
        return user;
      },

      register: async (data) => {
        const user = await userService.register(data);
        set({ user, isAuthenticated: true });
        return user;
      },

      logout: () => set({ user: null, isAuthenticated: false }),

      updateUser: (patch) => set((state) => ({ user: { ...state.user, ...patch } })),
    }),
    { name: 'chimboy_auth' },
  ),
);
