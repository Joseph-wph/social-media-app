import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { AuthData, AuthUser } from '@/types';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  setAuth: (data: AuthData) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
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
    }),
    {
      name: 'sociality-auth',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);
