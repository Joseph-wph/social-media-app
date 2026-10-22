'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateMyProfile } from '../lib/services/profileService';
import { useAuthStore } from '../store/authStore';
import type { UpdateMyProfileRequest } from '../types';

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.user?.id);
  const setAuth = useAuthStore((state) => state.setAuth);
  const authUser = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  return useMutation({
    mutationFn: (payload: UpdateMyProfileRequest) => updateMyProfile(payload),

    onSuccess: async (response) => {
      const updatedProfile = response.data;

      queryClient.setQueryData(
        ['my-profile', userId],
        (
          currentData:
            | {
                success: boolean;
                message: string;
                data: {
                  profile: typeof updatedProfile;
                  stats: {
                    posts: number;
                    followers: number;
                    following: number;
                    likes: number;
                  };
                };
              }
            | undefined
        ) => {
          if (!currentData) return currentData;

          return {
            ...currentData,
            data: {
              ...currentData.data,
              profile: updatedProfile,
            },
          };
        }
      );

      if (authUser && token) {
        setAuth({
          token,
          user: {
            ...authUser,
            username: updatedProfile.username,
            phone: updatedProfile.phone,
            avatarUrl: updatedProfile.avatarUrl,
          },
        });
      }

      await queryClient.invalidateQueries({
        queryKey: ['my-profile', userId],
      });
    },
  });
}
