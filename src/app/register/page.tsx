'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';

import Container from '@/components/layout/container';
import { useRegister, getAuthErrorMessage } from '@/hooks/useAuth';
import { registerSchema, type RegisterFormData } from '@/schemas/authSchema';

const fields = [
  {
    name: 'name',
    label: 'Name',
    placeholder: 'Enter your Name',
    type: 'text',
    autoComplete: 'name',
  },
  {
    name: 'username',
    label: 'Username',
    placeholder: 'Enter your username',
    type: 'text',
    autoComplete: 'username',
  },
  {
    name: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    type: 'email',
    autoComplete: 'email',
  },
  {
    name: 'phone',
    label: 'Phone Number',
    placeholder: 'Enter your phone number',
    type: 'tel',
    autoComplete: 'tel',
  },
] as const;

export default function RegisterPage() {
  const router = useRouter();
  const registerMutation = useRegister();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const isLoading = isSubmitting || registerMutation.isPending;

  const onSubmit = async (data: RegisterFormData) => {
    const payload = {
      name: data.name,
      username: data.username,
      email: data.email,
      phone: data.phone,
      password: data.password,
    };

    try {
      await registerMutation.mutateAsync(payload);
      router.push('/login');
    } catch {}
  };

  return (
    <main
      className='min-h-screen bg-cover bg-center bg-no-repeat text-[#F6F9FE]'
      style={{
        backgroundImage: "url('/assets/images/bg.svg')",
      }}
    >
      <Container>
        <div className='flex min-h-[calc(100svh-56px)] items-center justify-center md:min-h-[calc(100svh-32px)]'>
          <section className='w-full max-w-130.75 rounded-2xl border border-white/10 bg-black px-5 py-8 shadow-2xl shadow-black/30 sm:px-8 sm:py-10'>
            {/* Brand */}
            <div className='mb-8 text-center'>
              <Link
                href='/'
                aria-label='Sociality home'
                className='mb-7 inline-flex items-center justify-center'
              >
                <Image
                  src='/assets/icons/logo/logotype.png'
                  alt='Sociality'
                  width={137}
                  height={36}
                  priority
                  style={{
                    width: '137px',
                    height: 'auto',
                  }}
                />
              </Link>

              <h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>
                Register
              </h1>
            </div>

            {/* Register Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className='space-y-5'
            >
              {/* Text Fields */}
              {fields.map((field) => {
                const error = errors[field.name];

                return (
                  <div key={field.name} className='space-y-2'>
                    <label
                      htmlFor={field.name}
                      className='block text-sm font-medium'
                    >
                      {field.label}
                    </label>

                    <input
                      id={field.name}
                      type={field.type}
                      autoComplete={field.autoComplete}
                      placeholder={field.placeholder}
                      aria-invalid={Boolean(error)}
                      aria-describedby={
                        error ? `${field.name}-error` : undefined
                      }
                      {...register(field.name)}
                      className={`h-12 w-full rounded-lg border bg-[#080808] px-4 text-sm outline-none transition placeholder:text-[#66666F] focus:border-[#7F51F9] focus:ring-2 focus:ring-[#7F51F9]/20 ${
                        error ? 'border-red-500' : 'border-white/10'
                      }`}
                    />

                    {error && (
                      <p
                        id={`${field.name}-error`}
                        role='alert'
                        className='text-xs text-red-400'
                      >
                        {error.message}
                      </p>
                    )}
                  </div>
                );
              })}

              {/* Password */}
              <div className='space-y-2'>
                <label htmlFor='password' className='block text-sm font-medium'>
                  Password
                </label>

                <div className='relative'>
                  <input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    autoComplete='new-password'
                    placeholder='Enter your password'
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={
                      errors.password ? 'password-error' : undefined
                    }
                    {...register('password')}
                    className={`h-12 w-full rounded-lg border bg-[#080808] px-4 pr-12 text-sm outline-none transition placeholder:text-[#66666F] focus:border-[#7F51F9] focus:ring-2 focus:ring-[#7F51F9]/20 ${
                      errors.password ? 'border-red-500' : 'border-white/10'
                    }`}
                  />

                  <button
                    type='button'
                    onClick={() => setShowPassword((previous) => !previous)}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    aria-pressed={showPassword}
                    className='absolute inset-y-0 right-0 flex items-center px-4 text-[#A1A1AA] transition hover:text-white'
                  >
                    {showPassword ? (
                      <EyeOff size={18} aria-hidden='true' />
                    ) : (
                      <Eye size={18} aria-hidden='true' />
                    )}
                  </button>
                </div>

                {errors.password ? (
                  <p
                    id='password-error'
                    role='alert'
                    className='text-xs text-red-400'
                  >
                    {errors.password.message}
                  </p>
                ) : (
                  <p className='text-xs text-[#71717A]'>
                    Use at least 6 characters.
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className='space-y-2'>
                <label
                  htmlFor='confirmPassword'
                  className='block text-sm font-medium'
                >
                  Confirm Password
                </label>

                <div className='relative'>
                  <input
                    id='confirmPassword'
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete='new-password'
                    placeholder='Enter your Confirm password'
                    aria-invalid={Boolean(errors.confirmPassword)}
                    aria-describedby={
                      errors.confirmPassword
                        ? 'confirmPassword-error'
                        : undefined
                    }
                    {...register('confirmPassword')}
                    className={`h-12 w-full rounded-lg border bg-[#080808] px-4 pr-12 text-sm outline-none transition placeholder:text-[#66666F] focus:border-[#7F51F9] focus:ring-2 focus:ring-[#7F51F9]/20 ${
                      errors.confirmPassword
                        ? 'border-red-500'
                        : 'border-white/10'
                    }`}
                  />

                  <button
                    type='button'
                    onClick={() =>
                      setShowConfirmPassword((previous) => !previous)
                    }
                    aria-label={
                      showConfirmPassword
                        ? 'Hide confirm password'
                        : 'Show confirm password'
                    }
                    aria-pressed={showConfirmPassword}
                    className='absolute inset-y-0 right-0 flex items-center px-4 text-[#A1A1AA] transition hover:text-white'
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} aria-hidden='true' />
                    ) : (
                      <Eye size={18} aria-hidden='true' />
                    )}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <p
                    id='confirmPassword-error'
                    role='alert'
                    className='text-xs text-red-400'
                  >
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* API Error */}
              {registerMutation.isError && (
                <p
                  role='alert'
                  className='rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400'
                >
                  {getAuthErrorMessage(
                    registerMutation.error,
                    'Registration failed. Please try again.'
                  )}
                </p>
              )}

              {/* Submit */}
              <button
                type='submit'
                disabled={isLoading}
                className='flex h-12 w-full items-center justify-center rounded-full bg-primary-3 px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-2 disabled:cursor-not-allowed disabled:opacity-60'
              >
                {isLoading ? 'Please wait...' : 'Submit'}
              </button>
            </form>

            {/* Login Link */}
            <p className='mt-7 text-center text-sm text-base-1'>
              Already have an account?{' '}
              <Link
                href='/login'
                className='font-semibold text-[#A78BFA] transition hover:text-white'
              >
                Log in
              </Link>
            </p>

            <p className='mt-6 text-center text-xs leading-5 text-[#71717A]'>
              By creating an account, you agree to our Terms of Service and
              Privacy Policy.
            </p>
          </section>
        </div>
      </Container>
    </main>
  );
}
