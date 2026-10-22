'use client';

import { useQuery } from '@tanstack/react-query';

import { getPosts } from '@/lib/services/postService';
import { useAuthStore } from '@/store/authStore';

export function usePosts(page = 1, limit = 20) {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ['posts', page, limit],
    queryFn: () => getPosts(page, limit),
    enabled: Boolean(token),
  });
}
