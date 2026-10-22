'use client';

import { useQuery } from '@tanstack/react-query';

import { searchUsers } from '@/lib/services/profileService';

export const searchUsersKeys = {
  all: ['search-users'] as const,
  list: (query: string) => [...searchUsersKeys.all, query] as const,
};

export function useSearchUsers(query: string, enabled = true) {
  const normalizedQuery = query.trim();

  return useQuery({
    queryKey: searchUsersKeys.list(normalizedQuery),
    queryFn: () => searchUsers(normalizedQuery, 1, 10),
    enabled: enabled && normalizedQuery.length >= 2,
    staleTime: 30_000,
  });
}
