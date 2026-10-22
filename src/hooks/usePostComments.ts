'use client';

import { useQuery } from '@tanstack/react-query';
import { getPostComments } from '@/lib/services/postService';
import { useAuthStore } from '@/store/authStore';

export function usePostComments(postId: number, page = 1, limit = 10) {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ['post-comments', postId, page, limit],
    queryFn: () => getPostComments(postId, page, limit),
    enabled: Boolean(token) && Number.isInteger(postId) && postId > 0,
  });
}
