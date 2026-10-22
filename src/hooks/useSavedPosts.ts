'use client';

import { useQuery } from '@tanstack/react-query';

import { getSavedPosts } from '@/lib/services/postService';
import { useAuthStore } from '@/store/authStore';

export function useSavedPosts(page = 1, limit = 20) {
  const token = useAuthStore((state) => state.token);
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery({
    queryKey: ['saved-posts', userId, page, limit],
    queryFn: () => getSavedPosts(page, limit),
    enabled: Boolean(token && userId),
  });
}
