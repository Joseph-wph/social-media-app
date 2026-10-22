'use client';

import { useQuery } from '@tanstack/react-query';

import { getUserLikedPosts } from '@/lib/services/postService';

export const userLikedPostsKeys = {
  all: ['user-liked-posts'] as const,

  list: (username: string, page: number, limit: number) =>
    [...userLikedPostsKeys.all, username, page, limit] as const,
};

export function useUserLikedPosts(
  username: string,
  page = 1,
  limit = 20,
  enabled = true
) {
  return useQuery({
    queryKey: userLikedPostsKeys.list(username, page, limit),
    queryFn: () => getUserLikedPosts(username, page, limit),
    enabled: Boolean(username) && enabled,
  });
}
