'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment } from '@/lib/services/postService';
import type { CreateCommentRequest } from '@/types';

export function useCreateComment(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCommentRequest) =>
      createComment(postId, payload),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['post-comments', postId],
        }),
        queryClient.invalidateQueries({
          queryKey: ['post', postId],
        }),
        queryClient.invalidateQueries({
          queryKey: ['feed'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['posts'],
        }),
      ]);
    },
  });
}
