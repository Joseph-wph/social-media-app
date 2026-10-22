'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getAuthErrorMessage, useLogin } from '@/hooks/useAuth';
import { loginSchema, type LoginFormData } from '@/schemas/authSchema';

export default function LoginPage() {
  const router = useRouter();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data);
      router.push('/');
    } catch {}
  };

  const errorMessage = loginMutation.error
    ? getAuthErrorMessage(
        loginMutation.error,
        'Login failed. Please try again.'
      )
    : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[url('/assets/images/bg.svg')] bg-cover bg-center bg-no-repeat px-4 py-12 text-white">
      <section className='w-full max-w-md rounded-2xl border border-white/10 bg-black p-6 sm:p-8'>
        <div className='mb-8 flex flex-col items-center'>
          <Link href='/' aria-label='Sociality home'>
            <Image
              src='/assets/icons/logo/logotype.png'
              alt='Sociality'
              width={180}
              height={60}
              priority
              className='mb-6 h-auto w-40 object-contain'
            />
          </Link>

          <h1 className='text-2xl font-semibold'>Welcome back</h1>

          <p className='mt-2 text-center text-sm text-gray-400'>
            Log in to continue to Sociality.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>

            <Input
              id='email'
              type='email'
              autoComplete='email'
              placeholder='Enter your email'
              aria-invalid={!!errors.email}
              {...register('email')}
              className='border-white/10 bg-black text-white placeholder:text-gray-500'
            />

            {errors.email && (
              <p className='text-sm text-red-400'>{errors.email.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='password'>Password</Label>

            <Input
              id='password'
              type='password'
              autoComplete='current-password'
              placeholder='Enter your password'
              aria-invalid={!!errors.password}
              {...register('password')}
              className='border-white/10 bg-black text-white placeholder:text-gray-500'
            />

            {errors.password && (
              <p className='text-sm text-red-400'>{errors.password.message}</p>
            )}
          </div>

          {errorMessage && (
            <p
              role='alert'
              className='rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400'
            >
              {errorMessage}
            </p>
          )}

          <Button
            type='submit'
            disabled={loginMutation.isPending}
            className='w-full bg-[#7f51f9] text-white hover:bg-[#6936f2] disabled:opacity-60'
          >
            {loginMutation.isPending ? 'Logging in...' : 'Log In'}
          </Button>
        </form>

        <p className='mt-6 text-center text-sm text-gray-400'>
          Don&apos;t have an account?{' '}
          <Link
            href='/register'
            className='font-medium text-[#a78bfa] hover:text-white'
          >
            Register
          </Link>
        </p>
      </section>
    </main>
  );
}
