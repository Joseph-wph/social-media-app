import { z } from 'zod';

import type { RegisterRequest } from '@/types';

export const registerSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required'),

    username: z.string().trim().min(1, 'Username is required'),

    email: z
      .string()
      .trim()
      .min(1, 'Email is required')
      .pipe(z.email('Please enter a valid email address')),

    phone: z.string().trim().min(1, 'Phone number is required'),

    password: z.string().min(6, 'Password must be at least 6 characters'),

    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export type RegisterPayload = RegisterRequest;

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .pipe(z.email('Please enter a valid email address')),

  password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
