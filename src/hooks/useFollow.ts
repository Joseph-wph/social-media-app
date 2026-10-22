'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  followUser,
  getFollowers,
  getFollowing,
  getMyFollowers,
  getMyFollowing,
  unfollowUser,
} from '@/lib/services/followService';

import { useAuthStore } from '@/store/authStore';

// QUERY KEYS
export const followKeys = {
  all: ['follow'] as const,

  followers: (username: string, page: number, limit: number) =>
    [...followKeys.all, 'followers', username, page, limit] as const,

  following: (username: string, page: number, limit: number) =>
    [...followKeys.all, 'following', username, page, limit] as const,

  myFollowers: (page: number, limit: number) =>
    [...followKeys.all, 'me', 'followers', page, limit] as const,

  myFollowing: (page: number, limit: number) =>
    [...followKeys.all, 'me', 'following', page, limit] as const,
};

// FOLLOW / UNFOLLOW
export function useToggleFollow() {
  const queryClient = useQueryClient();

  const followMutation = useMutation({
    mutationFn: (username: string) => followUser(username),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: followKeys.all,
      });

      await queryClient.invalidateQueries({
        queryKey: ['profile'],
      });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: (username: string) => unfollowUser(username),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: followKeys.all,
      });

      await queryClient.invalidateQueries({
        queryKey: ['profile'],
      });
    },
  });

  return {
    followUser: followMutation.mutateAsync,
    unfollowUser: unfollowMutation.mutateAsync,

    isFollowing: followMutation.isPending,
    isUnfollowing: unfollowMutation.isPending,

    isPending: followMutation.isPending || unfollowMutation.isPending,
  };
}

// GET A USER'S FOLLOWERS
export function useFollowers(username: string, page = 1, limit = 20) {
  return useQuery({
    queryKey: followKeys.followers(username, page, limit),
    queryFn: () => getFollowers(username, page, limit),
    enabled: Boolean(username),
  });
}

// GET A USER'S FOLLOWING
export function useFollowing(username: string, page = 1, limit = 20) {
  return useQuery({
    queryKey: followKeys.following(username, page, limit),
    queryFn: () => getFollowing(username, page, limit),
    enabled: Boolean(username),
  });
}

// GET MY FOLLOWERS
export function useMyFollowers(page = 1, limit = 20) {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: followKeys.myFollowers(page, limit),
    queryFn: () => getMyFollowers(page, limit),
    enabled: Boolean(token),
  });
}

// GET MY FOLLOWING
export function useMyFollowing(page = 1, limit = 20) {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: followKeys.myFollowing(page, limit),
    queryFn: () => getMyFollowing(page, limit),
    enabled: Boolean(token),
  });
}
