import api from '@/lib/axios';
import type { ApiResponse, MyProfile, UpdateMyProfileRequest } from '@/types';

export async function getMyProfile(): Promise<ApiResponse<MyProfile>> {
  const response = await api.get<ApiResponse<MyProfile>>('/api/me');

  return response.data;
}

export async function updateMyProfile(
  payload: UpdateMyProfileRequest
): Promise<ApiResponse<MyProfile['profile']>> {
  const formData = new FormData();

  if (payload.username !== undefined) {
    formData.append('username', payload.username);
  }

  if (payload.phone !== undefined) {
    formData.append('phone', payload.phone);
  }

  if (payload.bio !== undefined) {
    formData.append('bio', payload.bio);
  }

  if (payload.avatar) {
    formData.append('avatar', payload.avatar);
  } else if (payload.avatarUrl !== undefined) {
    formData.append('avatarUrl', payload.avatarUrl);
  }

  const response = await api.patch<ApiResponse<MyProfile['profile']>>(
    '/api/me',
    formData
  );

  return response.data;
}
