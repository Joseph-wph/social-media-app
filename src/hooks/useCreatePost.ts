'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createPost } from '@/lib/services/postService';
import { useAuthStore } from '@/store/authStore';

export function useCreatePost() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.user?.id);

  return useMutation({
    mutationFn: createPost,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['feed', userId],
        }),
        queryClient.invalidateQueries({
          queryKey: ['my-profile', userId],
        }),
        queryClient.invalidateQueries({
          queryKey: ['posts'],
        }),
      ]);
    },
  });
}
