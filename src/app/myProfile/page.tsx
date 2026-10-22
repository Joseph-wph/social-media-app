'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, LoaderCircle, Pencil } from 'lucide-react';

import Navbar from '@/components/layout/navbar';
import Container from '@/components/layout/container';
import { useMyProfile } from '@/hooks/useMyProfile';

export default function MyProfilePage() {
  const { data, isPending, isError, refetch } = useMyProfile();

  const profile = data?.data.profile;
  const stats = data?.data.stats;

  return (
    <main className='min-h-screen bg-black text-[#F6F9FE]'>
      <Navbar />

      <Container>
        <section className='mx-auto w-full max-w-3xl py-8 sm:py-12'>
          <div className='mb-8 flex items-center justify-between gap-4'>
            <h1 className='text-2xl font-bold sm:text-3xl'>My Profile</h1>

            <Link
              href='/updateProfile'
              className='inline-flex items-center gap-2 rounded-full bg-[#6936F2] px-4 py-2.5 text-sm font-semibold transition hover:bg-[#7F51F9]'
            >
              <Pencil size={16} />
              Edit Profile
            </Link>
          </div>

          {isPending ? (
            <div
              className='flex min-h-64 items-center justify-center gap-3 text-sm text-white/60'
              aria-live='polite'
            >
              <LoaderCircle size={20} className='animate-spin' />
              Loading profile...
            </div>
          ) : isError || !profile || !stats ? (
            <div
              className='rounded-2xl border border-white/10 p-8 text-center'
              role='alert'
            >
              <p className='text-white/70'>Unable to load your profile.</p>

              <button
                type='button'
                onClick={() => refetch()}
                className='mt-4 rounded-full bg-[#6936F2] px-5 py-2.5 text-sm font-semibold hover:bg-[#7F51F9]'
              >
                Try again
              </button>
            </div>
          ) : (
            <div className='overflow-hidden rounded-2xl border border-white/10 bg-white/3'>
              <div className='h-24 bg-linear-to-r from-[#6936F2]/40 via-[#7F51F9]/20 to-[#D9206E]/20 sm:h-32' />

              <div className='px-5 pb-6 sm:px-8 sm:pb-8'>
                <div className='-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between'>
                  {profile.avatarUrl ? (
                    <Image
                      src={profile.avatarUrl}
                      alt={`${profile.name}'s avatar`}
                      width={112}
                      height={112}
                      unoptimized
                      className='size-24 rounded-full border-4 border-black bg-[#1A1A1A] object-cover sm:size-28'
                    />
                  ) : (
                    <div className='flex size-24 items-center justify-center rounded-full border-4 border-black bg-[#6936F2] text-3xl font-bold sm:size-28'>
                      {profile.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className='mt-5'>
                  <h2 className='text-xl font-bold sm:text-2xl'>
                    {profile.name}
                  </h2>

                  <p className='mt-1 text-sm text-white/50'>
                    @{profile.username}
                  </p>

                  <p className='mt-4 whitespace-pre-wrap wrap- text-sm leading-6 text-white/80'>
                    {profile.bio || 'No bio yet.'}
                  </p>

                  <div className='mt-4 flex flex-wrap items-center gap-2 text-xs text-white/50'>
                    <CalendarDays size={15} />
                    <span>
                      Joined{' '}
                      {new Date(profile.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <div className='mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4'>
                  {[
                    { label: 'Posts', value: stats.posts },
                    { label: 'Followers', value: stats.followers },
                    { label: 'Following', value: stats.following },
                    { label: 'Likes', value: stats.likes },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className='rounded-xl border border-white/10 bg-white/2 px-3 py-4 text-center'
                    >
                      <p className='text-xl font-bold tabular-nums'>
                        {stat.value}
                      </p>
                      <p className='mt-1 text-xs text-white/50'>{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className='mt-8 border-t border-white/10 pt-5'>
                  <h3 className='text-base font-semibold'>About</h3>

                  <dl className='mt-4 space-y-4 text-sm'>
                    <div>
                      <dt className='text-white/50'>Email</dt>
                      <dd className='mt-1 break-all'>{profile.email}</dd>
                    </div>

                    <div>
                      <dt className='text-white/50'>Phone</dt>
                      <dd className='mt-1'>{profile.phone || 'Not set'}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          )}
        </section>
      </Container>
    </main>
  );
}
