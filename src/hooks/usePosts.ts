'use client';

import { useQuery } from '@tanstack/react-query';

import { getFeed, getPosts } from '@/lib/services/postService';
import { useAuthStore } from '@/store/authStore';

export function usePosts(page = 1, limit = 20) {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ['posts', token ? 'feed' : 'public', page, limit],
    queryFn: async () => {
      if (token) {
        const response = await getFeed(page, limit);

        return {
          ...response,
          data: {
            posts: response.data.items,
            pagination: response.data.pagination,
          },
        };
      }

      return getPosts(page, limit);
    },
  });
}
