'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Bookmark, Grid, LoaderCircle, Send } from 'lucide-react';

import BottomNavbar from '@/components/layout/bottomNavbar';
import Navbar from '@/components/layout/navbar';
import Container from '@/components/layout/container';
import { useMyProfile } from '@/hooks/useMyProfile';
import { usePosts } from '@/hooks/usePosts';
import { useAuthStore } from '@/store/authStore';
import { useSavedPosts } from '@/hooks/useSavedPosts';

export default function MyProfilePage() {
  const { data, isPending, isError, refetch } = useMyProfile();

  const [activeTab, setActiveTab] = useState<'gallery' | 'saved'>('gallery');

  const userId = useAuthStore((state) => state.user?.id);

  const {
    data: postsData,
    isPending: isPostsPending,
    isError: isPostsError,
    refetch: refetchPosts,
  } = usePosts(1, 20);

  const profile = data?.data.profile;
  const stats = data?.data.stats;

  const myPosts = (postsData?.data.posts ?? []).filter(
    (post) => post.author.id === userId
  );

  const {
    data: savedData,
    isPending: isSavedPending,
    isError: isSavedError,
    refetch: refetchSavedPosts,
  } = useSavedPosts(1, 20);

  const savedPosts = savedData?.data.posts ?? [];

  return (
    <main className='min-h-screen bg-black pb-28 text-white'>
      {/* Navbar Desktop */}
      <div className='hidden md:block'>
        <Navbar />
      </div>

      {/* Header Mobile */}
      <header className='sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-black/80 px-4 py-3.5 backdrop-blur-md md:hidden'>
        <div className='flex items-center gap-3'>
          <Link
            href='/'
            className='text-white transition hover:opacity-80'
            aria-label='Back to home'
          >
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
              alt={`${profile.name}'s avatar`}
              fill
              unoptimized
              loading='eager'
              sizes='80px'
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
                      sizes='80px'
                      className='object-cover'
                    />
                  ) : (
                    <div className='flex h-full w-full items-center justify-center bg-[#6936F2] text-2xl font-bold'>
                      {profile.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className='min-w-0'>
                  <h2 className='text-lg font-bold text-white'>
                    {profile.name}
                  </h2>

                  <p className='text-sm text-white/50'>@{profile.username}</p>
                </div>
              </div>

              {/* Action Buttons */}
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
                  <p className='text-xs text-white/50'>Posts</p>
                </div>

                <div className='h-7 w-px bg-white/10' />

                <div className='flex-1'>
                  <p className='text-base font-bold text-white'>
                    {stats.followers ?? 0}
                  </p>
                  <p className='text-xs text-white/50'>Followers</p>
                </div>

                <div className='h-7 w-px bg-white/10' />

                <Link
                  href='/following'
                  className='flex flex-1 flex-col items-center rounded-md transition hover:opacity-70'
                  aria-label={`View ${stats.following ?? 0} accounts you follow`}
                >
                  <p className='text-base font-bold text-white'>
                    {stats.following ?? 0}
                  </p>
                  <p className='text-xs text-white/50'>Following</p>
                </Link>

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
                  className={`flex flex-1 items-center justify-center gap-2 border-b-2 py-3 text-sm font-semibold transition ${
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
                  className={`flex flex-1 items-center justify-center gap-2 border-b-2 py-3 text-sm font-semibold transition ${
                    activeTab === 'saved'
                      ? 'border-white text-white'
                      : 'border-transparent text-white/40 hover:text-white/70'
                  }`}
                >
                  <Bookmark size={18} />
                  Saved
                </button>
              </div>

              {/* Gallery Tab */}
              {activeTab === 'gallery' && (
                <div className='pt-1'>
                  {isPostsPending ? (
                    <div
                      className='flex min-h-48 items-center justify-center'
                      aria-live='polite'
                    >
                      <LoaderCircle
                        size={24}
                        className='animate-spin text-white/60'
                      />
                    </div>
                  ) : isPostsError ? (
                    <div className='px-4 py-16 text-center'>
                      <p className='text-sm text-white/60'>
                        Unable to load your posts.
                      </p>

                      <button
                        type='button'
                        onClick={() => refetchPosts()}
                        className='mt-4 rounded-full bg-[#6936F2] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#7F51F9]'
                      >
                        Try again
                      </button>
                    </div>
                  ) : myPosts.length === 0 ? (
                    <div className='px-2 py-16 text-center'>
                      <h3 className='text-base font-semibold text-white'>
                        Your story starts here
                      </h3>

                      <p className='mx-auto mt-2 max-w-xs text-xs leading-relaxed text-white/50'>
                        Share your first post and let the world see your
                        moments, passions, and memories. Make this space truly
                        yours.
                      </p>

                      <Link
                        href='/addPost'
                        className='mt-6 inline-flex rounded-full bg-[#6C38FF] px-6 py-3 text-xs font-semibold text-white transition hover:bg-[#5a2ee0]'
                      >
                        Upload My First Post
                      </Link>
                    </div>
                  ) : (
                    <div className='grid grid-cols-3 gap-0.5'>
                      {myPosts.map((post) => (
                        <div
                          key={post.id}
                          className='group relative aspect-square overflow-hidden bg-zinc-900'
                        >
                          <Image
                            src={post.imageUrl}
                            alt={post.caption || 'Post image'}
                            fill
                            unoptimized
                            loading='eager'
                            sizes='(max-width: 640px) 33vw, 200px'
                            className='object-cover transition duration-300 group-hover:scale-105'
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Saved Tab */}
              {activeTab === 'saved' && (
                <div className='pt-1'>
                  {isSavedPending ? (
                    <div
                      className='flex min-h-48 items-center justify-center'
                      aria-live='polite'
                    >
                      <LoaderCircle
                        size={24}
                        className='animate-spin text-white/60'
                      />
                    </div>
                  ) : isSavedError ? (
                    <div className='px-4 py-16 text-center' role='alert'>
                      <p className='text-sm text-white/60'>
                        Unable to load saved posts.
                      </p>

                      <button
                        type='button'
                        onClick={() => refetchSavedPosts()}
                        className='mt-4 rounded-full bg-[#6936F2] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#7F51F9]'
                      >
                        Try again
                      </button>
                    </div>
                  ) : savedPosts.length === 0 ? (
                    <div className='px-2 py-16 text-center'>
                      <Bookmark size={28} className='mx-auto text-white/40' />

                      <h3 className='mt-4 text-base font-semibold text-white'>
                        No saved posts yet
                      </h3>

                      <p className='mx-auto mt-2 max-w-xs text-xs leading-relaxed text-white/50'>
                        Posts you save will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className='grid grid-cols-3 gap-0.5'>
                      {savedPosts.map((post) => (
                        <div
                          key={post.id}
                          className='group relative aspect-square overflow-hidden bg-zinc-900'
                        >
                          <Image
                            src={post.imageUrl}
                            alt={post.caption || 'Saved post'}
                            fill
                            unoptimized
                            sizes='(max-width: 640px) 33vw, 200px'
                            className='object-cover transition duration-300 group-hover:scale-105'
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </section>
      </Container>

      <BottomNavbar />
    </main>
  );
}
