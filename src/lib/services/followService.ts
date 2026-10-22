import api from '@/lib/axios';

import type { ApiResponse, FollowUsersData } from '@/types';

// FOLLOW USER
export async function followUser(username: string): Promise<void> {
  await api.post(`/api/follow/${encodeURIComponent(username)}`);
}

// UNFOLLOW USER
export async function unfollowUser(username: string): Promise<void> {
  await api.delete(`/api/follow/${encodeURIComponent(username)}`);
}

// GET USER'S FOLLOWERS
export async function getFollowers(
  username: string,
  page = 1,
  limit = 20
): Promise<ApiResponse<FollowUsersData>> {
  const response = await api.get<ApiResponse<FollowUsersData>>(
    `/api/users/${encodeURIComponent(username)}/followers`,
    {
      params: { page, limit },
    }
  );

  return response.data;
}

// GET USER'S FOLLOWING
export async function getFollowing(
  username: string,
  page = 1,
  limit = 20
): Promise<ApiResponse<FollowUsersData>> {
  const response = await api.get<ApiResponse<FollowUsersData>>(
    `/api/users/${encodeURIComponent(username)}/following`,
    {
      params: { page, limit },
    }
  );

  return response.data;
}

// GET MY FOLLOWING
export async function getMyFollowing(
  page = 1,
  limit = 20
): Promise<ApiResponse<FollowUsersData>> {
  const response = await api.get<ApiResponse<FollowUsersData>>(
    '/api/me/following',
    {
      params: { page, limit },
    }
  );

  return response.data;
}

// GET MY FOLLOWERS
export async function getMyFollowers(
  page = 1,
  limit = 20
): Promise<ApiResponse<FollowUsersData>> {
  const response = await api.get<ApiResponse<FollowUsersData>>(
    '/api/me/followers',
    {
      params: { page, limit },
    }
  );

  return response.data;
}
