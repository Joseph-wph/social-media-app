'use client';

import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, LoaderCircle } from 'lucide-react';

import Navbar from '@/components/layout/navbar';
import Container from '@/components/layout/container';
import { useMyProfile } from '@/hooks/useMyProfile';
import { useUpdateProfile } from '@/hooks/useUpdateProfile';
import type { MyProfile, UpdateMyProfileRequest } from '@/types';

export default function UpdateProfilePage() {
  const { data, isPending, isError, refetch } = useMyProfile();
  const updateProfile = useUpdateProfile();

  const profile = data?.data.profile;

  if (isPending) {
    return (
      <main className='min-h-screen bg-black text-[#F6F9FE]'>
        <Navbar />
        <Container>
          <div className='flex min-h-48 items-center justify-center gap-3 text-sm text-white/60'>
            <LoaderCircle size={20} className='animate-spin' />
            Loading profile...
          </div>
        </Container>
      </main>
    );
  }

  if (isError || !profile) {
    return (
      <main className='min-h-screen bg-black text-[#F6F9FE]'>
        <Navbar />
        <Container>
          <section className='mx-auto max-w-2xl py-12 text-center'>
            <p className='text-sm text-white/60'>
              Unable to load your profile.
            </p>
            <button
              type='button'
              onClick={() => refetch()}
              className='mt-4 rounded-full bg-[#6936F2] px-5 py-2.5 text-sm font-semibold hover:bg-[#7F51F9]'
            >
              Try again
            </button>
          </section>
        </Container>
      </main>
    );
  }

  return (
    <UpdateProfileForm
      key={profile.id}
      profile={profile}
      isSaving={updateProfile.isPending}
      isSuccess={updateProfile.isSuccess}
      isError={updateProfile.isError}
      errorMessage={
        updateProfile.error instanceof Error
          ? updateProfile.error.message
          : 'Unable to update profile. Please try again.'
      }
      onSubmit={(payload) => updateProfile.mutate(payload)}
    />
  );
}

type UpdateProfileFormProps = {
  profile: MyProfile['profile'];
  isSaving: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage: string;
  onSubmit: (payload: UpdateMyProfileRequest) => void;
};

function UpdateProfileForm({
  profile,
  isSaving,
  isSuccess,
  isError,
  errorMessage,
  onSubmit,
}: UpdateProfileFormProps) {
  const [username, setUsername] = useState(profile.username);
  const [phone, setPhone] = useState(profile.phone ?? '');
  const [bio, setBio] = useState(profile.bio ?? '');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(profile.avatarUrl ?? '');
  const [validationError, setValidationError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      window.alert('Please select a JPG, PNG, or WEBP image.');
      event.target.value = '';
      return;
    }

    if (file.size > maxSize) {
      window.alert('The avatar image must not exceed 5 MB.');
      event.target.value = '';
      return;
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const objectUrl = URL.createObjectURL(file);

    previewUrlRef.current = objectUrl;
    setAvatar(file);
    setAvatarPreview(objectUrl);
    setValidationError('');
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError('');

    const trimmedUsername = username.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedUsername || !trimmedPhone) {
      setValidationError('Username and phone number are required.');
      return;
    }

    const payload: UpdateMyProfileRequest = {
      username: trimmedUsername,
      phone: trimmedPhone,
      bio: bio.trim(),
      ...(avatar ? { avatar } : {}),
    };

    onSubmit(payload);
  }

  return (
    <main className='min-h-screen bg-black text-white'>
      <Navbar />

      <Container>
        <section className='mx-auto max-w-4xl px-4 py-8 sm:py-12'>
          <div className='mb-8 flex items-center gap-3'>
            <Link
              href='/myProfile'
              aria-label='Back to My Profile'
              className='text-white/80 transition hover:text-white'
            >
              <ArrowLeft size={22} />
            </Link>

            <h1 className='text-xl font-bold tracking-tight sm:text-2xl'>
              Edit Profile
            </h1>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className='grid grid-cols-1 gap-8 md:grid-cols-12'>
              <div className='flex flex-col items-center md:col-span-4 md:items-start'>
                <div className='relative mb-4 size-32 overflow-hidden rounded-full border border-white/10 bg-zinc-900'>
                  {avatarPreview ? (
                    <Image
                      src={avatarPreview}
                      alt='Profile avatar'
                      fill
                      unoptimized
                      className='object-cover'
                    />
                  ) : (
                    <div className='flex h-full w-full items-center justify-center bg-[#6936F2] text-3xl font-bold'>
                      {profile.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <label className='inline-flex cursor-pointer items-center justify-center rounded-full border border-white/20 bg-zinc-900/60 px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-zinc-800'>
                  Change Photo
                  <input
                    ref={fileInputRef}
                    type='file'
                    accept='image/jpeg,image/png,image/webp'
                    onChange={handleAvatarChange}
                    className='sr-only'
                  />
                </label>

                <p className='mt-2 text-xs text-white/50'>
                  JPG, PNG, or WEBP. Maximum 5 MB.
                </p>

                {avatar && (
                  <button
                    type='button'
                    onClick={() => {
                      if (previewUrlRef.current) {
                        URL.revokeObjectURL(previewUrlRef.current);
                        previewUrlRef.current = null;
                      }

                      setAvatar(null);
                      setAvatarPreview(profile.avatarUrl ?? '');

                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className='mt-2 text-xs text-white/60 underline hover:text-white'
                  >
                    Remove selected image
                  </button>
                )}
              </div>

              <div className='space-y-5 md:col-span-8'>
                <div>
                  <label
                    htmlFor='name'
                    className='mb-2 block text-xs font-semibold text-white/90'
                  >
                    Name
                  </label>
                  <input
                    id='name'
                    type='text'
                    value={profile.name}
                    readOnly
                    className='w-full cursor-not-allowed rounded-xl border border-white/5 bg-[#0D1017] px-4 py-3 text-sm text-white/50 outline-none'
                  />
                  <p className='mt-1 text-xs text-white/40'>
                    Name cannot be changed through this form.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor='username'
                    className='mb-2 block text-xs font-semibold text-white/90'
                  >
                    Username <span className='text-red-400'>*</span>
                  </label>
                  <input
                    id='username'
                    name='username'
                    type='text'
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    required
                    pattern='.*\S.*'
                    title='Username cannot be empty or contain only spaces.'
                    maxLength={30}
                    autoComplete='username'
                    className='w-full rounded-xl border border-white/5 bg-[#0D1017] px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500'
                  />
                </div>

                <div>
                  <label
                    htmlFor='email'
                    className='mb-2 block text-xs font-semibold text-white/90'
                  >
                    Email
                  </label>
                  <input
                    id='email'
                    type='email'
                    value={profile.email}
                    readOnly
                    className='w-full cursor-not-allowed rounded-xl border border-white/5 bg-[#0D1017] px-4 py-3 text-sm text-white/50 outline-none'
                  />
                  <p className='mt-1 text-xs text-white/40'>
                    Email cannot be changed through this form.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor='phone'
                    className='mb-2 block text-xs font-semibold text-white/90'
                  >
                    Number Phone <span className='text-red-400'>*</span>
                  </label>
                  <input
                    id='phone'
                    name='phone'
                    type='tel'
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    required
                    pattern='.*\S.*'
                    title='Phone number cannot be empty or contain only spaces.'
                    autoComplete='tel'
                    className='w-full rounded-xl border border-white/5 bg-[#0D1017] px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500'
                  />
                </div>

                <div>
                  <label
                    htmlFor='bio'
                    className='mb-2 block text-xs font-semibold text-white/90'
                  >
                    Bio
                  </label>
                  <textarea
                    id='bio'
                    name='bio'
                    rows={4}
                    value={bio}
                    onChange={(event) => setBio(event.target.value)}
                    maxLength={250}
                    placeholder='Tell people a little about yourself...'
                    className='w-full resize-none rounded-xl border border-white/5 bg-[#0D1017] px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500'
                  />
                  <p className='mt-1 text-right text-xs text-white/40'>
                    {bio.length}/250
                  </p>
                </div>

                {validationError && (
                  <p className='text-xs text-red-400' role='alert'>
                    {validationError}
                  </p>
                )}

                {isError && (
                  <p className='text-xs text-red-400' role='alert'>
                    {errorMessage}
                  </p>
                )}

                {isSuccess && (
                  <p className='text-xs text-emerald-400' role='status'>
                    Profile updated successfully.
                  </p>
                )}

                <div className='pt-2'>
                  <button
                    type='submit'
                    disabled={isSaving}
                    className='flex w-full items-center justify-center gap-2 rounded-full bg-[#6C38FF] py-3.5 text-sm font-semibold text-white transition hover:bg-[#5a2ee0] disabled:cursor-not-allowed disabled:opacity-60'
                  >
                    {isSaving && (
                      <LoaderCircle size={18} className='animate-spin' />
                    )}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </section>
      </Container>
    </main>
  );
}
