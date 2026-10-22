'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Bookmark,
  Grid,
  Home,
  LoaderCircle,
  Plus,
  Send,
  User,
} from 'lucide-react';

import Navbar from '@/components/layout/navbar';
import Container from '@/components/layout/container';
import { useMyProfile } from '@/hooks/useMyProfile';

export default function MyProfilePage() {
  const { data, isPending, isError, refetch } = useMyProfile();
  const [activeTab, setActiveTab] = useState<'gallery' | 'saved'>('gallery');

  const profile = data?.data.profile;
  const stats = data?.data.stats;

  return (
    <main className='min-h-screen bg-black text-white pb-28'>
      {/* Navbar Desktop (Sembunyi di Mobile) */}
      <div className='hidden md:block'>
        <Navbar />
      </div>

      {/* Header Bar Mobile (Hanya tampil di Mobile) */}
      <header className='sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-black/80 px-4 py-3.5 backdrop-blur-md md:hidden'>
        <div className='flex items-center gap-3'>
          <Link href='/' className='text-white transition hover:opacity-80'>
            <ArrowLeft size={22} />
          </Link>
          <h1 className='text-base font-bold tracking-wide'>
            {profile?.name || 'Profile'}
          </h1>
        </div>

        {profile?.avatarUrl && (
          <div className='relative size-8 overflow-hidden rounded-full border border-white/10'>
            <Image
              src={profile.avatarUrl}
              alt='Profile avatar'
              fill
              unoptimized
              className='object-cover'
            />
          </div>
        )}
      </header>

      <Container>
        <section className='mx-auto w-full max-w-xl px-4 py-6 md:py-10'>
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
            <div>
              {/* Profile Main Info */}
              <div className='flex items-center gap-4'>
                <div className='relative size-20 shrink-0 overflow-hidden rounded-full border border-white/10 bg-zinc-900'>
                  {profile.avatarUrl ? (
                    <Image
                      src={profile.avatarUrl}
                      alt={`${profile.name}'s avatar`}
                      fill
                      unoptimized
                      className='object-cover'
                    />
                  ) : (
                    <div className='flex h-full w-full items-center justify-center bg-[#6936F2] text-2xl font-bold'>
                      {profile.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div>
                  <h2 className='text-lg font-bold text-white'>
                    {profile.name}
                  </h2>
                  <p className='text-sm text-white/50'>@{profile.username}</p>
                </div>
              </div>

              {/* Action Buttons (Full-Width di Mobile) */}
              <div className='mt-5 flex items-center gap-2.5'>
                <Link
                  href='/updateProfile'
                  className='flex-1 rounded-full border border-white/20 bg-transparent py-2.5 text-center text-xs font-semibold text-white transition hover:bg-white/10'
                >
                  Edit Profile
                </Link>
                <button
                  type='button'
                  className='flex size-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-transparent text-white transition hover:bg-white/10'
                  aria-label='Share Profile'
                >
                  <Send size={15} className='-mr-0.5' />
                </button>
              </div>

              {/* Bio */}
              <div className='mt-5 text-sm text-white/90'>
                <p className='whitespace-pre-wrap leading-relaxed'>
                  {profile.bio || 'No bio yet.'}
                </p>
              </div>

              {/* Stats Bar */}
              <div className='mt-6 flex items-center justify-around border-y border-white/10 py-3.5 text-center'>
                <div className='flex-1'>
                  <p className='text-base font-bold text-white'>
                    {stats.posts ?? 0}
                  </p>
                  <p className='text-xs text-white/50'>Post</p>
                </div>
                <div className='h-7 w-px bg-white/10' />
                <div className='flex-1'>
                  <p className='text-base font-bold text-white'>
                    {stats.followers ?? 0}
                  </p>
                  <p className='text-xs text-white/50'>Followers</p>
                </div>
                <div className='h-7 w-px bg-white/10' />
                <div className='flex-1'>
                  <p className='text-base font-bold text-white'>
                    {stats.following ?? 0}
                  </p>
                  <p className='text-xs text-white/50'>Following</p>
                </div>
                <div className='h-7 w-px bg-white/10' />
                <div className='flex-1'>
                  <p className='text-base font-bold text-white'>
                    {stats.likes ?? 0}
                  </p>
                  <p className='text-xs text-white/50'>Likes</p>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className='flex border-b border-white/10'>
                <button
                  type='button'
                  onClick={() => setActiveTab('gallery')}
                  className={`flex flex-1 items-center justify-center gap-2 py-3 text-sm font-semibold transition border-b-2 ${
                    activeTab === 'gallery'
                      ? 'border-white text-white'
                      : 'border-transparent text-white/40 hover:text-white/70'
                  }`}
                >
                  <Grid size={18} />
                  Gallery
                </button>
                <button
                  type='button'
                  onClick={() => setActiveTab('saved')}
                  className={`flex flex-1 items-center justify-center gap-2 py-3 text-sm font-semibold transition border-b-2 ${
                    activeTab === 'saved'
                      ? 'border-white text-white'
                      : 'border-transparent text-white/40 hover:text-white/70'
                  }`}
                >
                  <Bookmark size={18} />
                  Saved
                </button>
              </div>

              {/* Tab Content / Empty State */}
              <div className='px-2 py-16 text-center'>
                <h3 className='text-base font-semibold text-white'>
                  Your story starts here
                </h3>
                <p className='mx-auto mt-2 max-w-xs text-xs text-white/50 leading-relaxed'>
                  Share your first post and let the world see your moments,
                  passions, and memories. Make this space truly yours.
                </p>

                <button
                  type='button'
                  className='mt-6 rounded-full bg-[#6C38FF] px-6 py-3 text-xs font-semibold text-white transition hover:bg-[#5a2ee0]'
                >
                  Upload My First Post
                </button>
              </div>
            </div>
          )}
        </section>
      </Container>

      {/* Floating Bottom Navigation Bar */}
      <div className='fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-xs px-4'>
        <nav className='flex items-center justify-around rounded-full border border-white/10 bg-[#0E1117]/95 px-6 py-2.5 backdrop-blur-md shadow-2xl'>
          <Link
            href='/'
            className='flex flex-col items-center gap-1 text-white/50 transition hover:text-white'
          >
            <Home size={18} />
            <span className='text-[10px] font-medium'>Home</span>
          </Link>

          <button
            type='button'
            className='flex size-10 items-center justify-center rounded-full bg-[#6C38FF] text-white shadow-lg transition hover:bg-[#5a2ee0]'
            aria-label='Create post'
          >
            <Plus size={20} />
          </button>

          <Link
            href='/my-profile'
            className='flex flex-col items-center gap-1 text-[#6C38FF]'
          >
            <User size={18} />
            <span className='text-[10px] font-medium'>Profile</span>
          </Link>
        </nav>
      </div>
    </main>
  );
}
