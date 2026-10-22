'use client';

import { useQuery } from '@tanstack/react-query';
import { getPostById } from '@/lib/services/postService';
import { useAuthStore } from '@/store/authStore';

export function usePostDetail(postId: number) {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPostById(postId),
    enabled: Boolean(token) && Number.isInteger(postId) && postId > 0,
  });
}
