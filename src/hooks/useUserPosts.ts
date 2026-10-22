'use client';

import { useQuery } from '@tanstack/react-query';

import { getUserPosts } from '@/lib/services/postService';

export const userPostsKeys = {
  all: ['user-posts'] as const,

  list: (username: string, page: number, limit: number) =>
    [...userPostsKeys.all, username, page, limit] as const,
};

export function useUserPosts(username: string, page = 1, limit = 20) {
  return useQuery({
    queryKey: userPostsKeys.list(username, page, limit),
    queryFn: () => getUserPosts(username, page, limit),
    enabled: Boolean(username),
  });
}
