'use client';

import { useQuery } from '@tanstack/react-query';

import { getFeed } from '@/lib/services/postService';
import { useAuthStore } from '@/store/authStore';

export function useFeed(page = 1, limit = 20) {
  const token = useAuthStore((state) => state.token);
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery({
    queryKey: ['feed', userId, page, limit],
    queryFn: () => getFeed(page, limit),
    enabled: Boolean(token),

    refetchInterval: 15_000,

    refetchIntervalInBackground: false,
  });
}
