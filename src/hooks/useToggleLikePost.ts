'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { likePost, unlikePost } from '@/lib/services/postService';
import { useAuthStore } from '@/store/authStore';

export function useToggleLikePost() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.user?.id);

  const invalidateLikeData = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ['feed', userId],
      }),
      queryClient.invalidateQueries({
        queryKey: ['posts'],
      }),
      queryClient.invalidateQueries({
        queryKey: ['post'],
      }),
      queryClient.invalidateQueries({
        queryKey: ['user-posts'],
      }),
      queryClient.invalidateQueries({
        queryKey: ['user-liked-posts'],
      }),
      queryClient.invalidateQueries({
        queryKey: ['my-liked-posts', userId],
      }),
      queryClient.invalidateQueries({
        queryKey: ['public-profile'],
      }),
      queryClient.invalidateQueries({
        queryKey: ['my-profile'],
      }),
    ]);
  };

  const likeMutation = useMutation({
    mutationFn: likePost,
    onSuccess: invalidateLikeData,
  });

  const unlikeMutation = useMutation({
    mutationFn: unlikePost,
    onSuccess: invalidateLikeData,
  });

  return {
    likePost: likeMutation.mutateAsync,
    unlikePost: unlikeMutation.mutateAsync,
    isLiking: likeMutation.isPending,
    isUnliking: unlikeMutation.isPending,
  };
}
