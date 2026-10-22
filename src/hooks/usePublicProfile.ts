'use client';

import { useQuery } from '@tanstack/react-query';

import { getPublicProfile } from '@/lib/services/profileService';

export const profileKeys = {
  all: ['profile'] as const,

  public: (username: string) =>
    [...profileKeys.all, 'public', username] as const,
};

export function usePublicProfile(username: string) {
  return useQuery({
    queryKey: profileKeys.public(username),
    queryFn: () => getPublicProfile(username),
    enabled: Boolean(username),
  });
}
