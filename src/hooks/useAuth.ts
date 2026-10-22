'use client';

import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

import { loginUser, registerUser } from '@/lib/services/authService';
import { useAuthStore } from '@/store/authStore';

export function getAuthErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; error?: string }
      | undefined;

    if (data?.message) return data.message;
    if (data?.error) return data.error;

    if (!error.response) {
      return 'Unable to connect to the server. Please try again.';
    }

    return fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export function useRegister() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (response) => {
      setAuth(response.data);
    },
  });
}

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      setAuth(response.data);
    },
  });
}
