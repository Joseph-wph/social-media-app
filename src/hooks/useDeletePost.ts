'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePost } from '@/lib/services/postService';

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => deletePost(postId),

    onSuccess: async (_, postId) => {
      queryClient.removeQueries({
        queryKey: ['post', postId],
        exact: true,
      });

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['feed'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['posts'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['saved-posts'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['my-profile'],
        }),
      ]);
    },
  });
}
