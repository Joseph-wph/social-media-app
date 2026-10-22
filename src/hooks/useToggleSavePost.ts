'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { savePost, unsavePost } from '@/lib/services/postService';
import { useAuthStore } from '@/store/authStore';

export function useToggleSavePost() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.user?.id);

  const invalidateSavedData = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ['saved-posts', userId],
      }),
      queryClient.invalidateQueries({
        queryKey: ['feed', userId],
      }),
      queryClient.invalidateQueries({
        queryKey: ['posts'],
      }),
    ]);
  };

  const saveMutation = useMutation({
    mutationFn: savePost,
    onSuccess: invalidateSavedData,
  });

  const unsaveMutation = useMutation({
    mutationFn: unsavePost,
    onSuccess: invalidateSavedData,
  });

  return {
    savePost: saveMutation.mutateAsync,
    unsavePost: unsaveMutation.mutateAsync,
    isSaving: saveMutation.isPending,
    isUnsaving: unsaveMutation.isPending,
  };
}
