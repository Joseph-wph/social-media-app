'use client';

import { useQuery } from '@tanstack/react-query';

import { getMyProfile } from '@/lib/services/profileService';
import { useAuthStore } from '@/store/authStore';

export function useMyProfile() {
  const token = useAuthStore((state) => state.token);
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery({
    queryKey: ['my-profile', userId],
    queryFn: getMyProfile,
    enabled: Boolean(token),
  });
}
