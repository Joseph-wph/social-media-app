'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

import { useAuthStore } from '@/store/authStore';

interface AuthHydrationProps {
  children: ReactNode;
}

export function AuthHydration({ children }: AuthHydrationProps) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    void useAuthStore.persist.rehydrate();

    return unsubscribe;
  }, []);

  if (!hydrated) {
    return (
      <div className='min-h-screen bg-black' aria-label='Memulihkan sesi' />
    );
  }

  return children;
}
