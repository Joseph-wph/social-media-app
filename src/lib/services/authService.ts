import api from '../axios';

import type {
  ApiResponse,
  AuthData,
  LoginRequest,
  RegisterRequest,
} from '@/types';

export async function registerUser(
  payload: RegisterRequest
): Promise<ApiResponse<AuthData>> {
  const response = await api.post<ApiResponse<AuthData>>(
    '/api/auth/register',
    payload
  );

  if (!response.data.success) {
    throw new Error(response.data.message || 'Registration failed.');
  }

  return response.data;
}

export async function loginUser(
  payload: LoginRequest
): Promise<ApiResponse<AuthData>> {
  const response = await api.post<ApiResponse<AuthData>>(
    '/api/auth/login',
    payload
  );

  if (!response.data.success) {
    throw new Error(response.data.message || 'Login failed.');
  }

  return response.data;
}
