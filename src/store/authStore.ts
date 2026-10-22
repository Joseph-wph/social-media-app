import { create } from 'zustand';

import type { AuthData, AuthUser } from '@/types';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  setAuth: (data: AuthData) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,

  setAuth: ({ user, token }) => {
    set({ user, token });
  },

  logout: () => {
    set({
      user: null,
      token: null,
    });
  },
}));
