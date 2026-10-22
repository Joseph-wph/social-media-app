'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Heart, LayoutGrid, Send } from 'lucide-react';

import Navbar from '@/components/layout/navbar';
import BottomNavbar from '@/components/layout/bottomNavbar';

import { usePublicProfile } from '@/hooks/usePublicProfile';
import { useUserPosts } from '@/hooks/useUserPosts';
import { useToggleFollow } from '@/hooks/useFollow';
import { useUserLikedPosts } from '@/hooks/useUserLikedPosts';
import { useAuthStore } from '@/store/authStore';
import PostDetailModal from '@/components/post/postDetailModal';

export default function FriendsProfilePage() {
  const params = useParams<{ username: string }>();
  const router = useRouter();
  const username = params.username;

  const token = useAuthStore((state) => state.token);
  const currentUser = useAuthStore((state) => state.user);

  const [activeTab, setActiveTab] = useState<'gallery' | 'liked'>('gallery');
  const [followError, setFollowError] = useState('');
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const profileQuery = usePublicProfile(username);
  const postsQuery = useUserPosts(username);

  const {
    followUser,
    unfollowUser,
    isPending: isFollowPending,
  } = useToggleFollow();

  const profile = profileQuery.data?.data;
  const posts = postsQuery.data?.data.posts ?? [];

  const likedPostsQuery = useUserLikedPosts(
    username,
    1,
    20,
    activeTab === 'liked'
  );

  const likedPosts = likedPostsQuery.data?.data.posts ?? [];

  async function handleFollowToggle() {
    if (!profile || !token || profile.isMe || isFollowPending) {
      return;
    }

    setFollowError('');

    try {
      if (profile.isFollowing) {
        await unfollowUser(username);
      } else {
        await followUser(username);
      }
    } catch {
      setFollowError('Gagal memperbarui status follow. Silakan coba lagi.');
    }
  }

  return (
    <main className='min-h-screen bg-black pb-28 font-sans text-white'>
      {/* Navbar Desktop */}
      <div className='hidden sm:block'>
        <Navbar />
      </div>

      <section className='mx-auto w-full max-w-3xl px-4 pt-3 sm:px-6 sm:pt-6'>
        {profileQuery.isPending ? (
          <div className='py-20 text-center text-sm text-white/50'>
            Loading profile...
          </div>
        ) : profileQuery.isError || !profile ? (
          <div className='space-y-4 py-16 text-center'>
            <p className='text-white/70'>Profil tidak dapat dimuat.</p>

            <button
              type='button'
              onClick={() => profileQuery.refetch()}
              className='rounded-lg bg-[#6936f2] px-4 py-2 text-sm font-medium transition hover:bg-[#7f51f9]'
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* MOBILE TOP BAR HEADER */}
            <div className='mb-4 flex items-center justify-between py-2 sm:hidden'>
              <div className='flex items-center gap-3'>
                <button
                  type='button'
                  onClick={() => router.back()}
                  aria-label='Go back'
                  className='p-1 text-white hover:opacity-80'
                >
                  <ArrowLeft className='h-6 w-6' />
                </button>
                <h1 className='text-lg font-bold text-white'>{profile.name}</h1>
              </div>

              {/* User Logged-In Avatar (Right Side) */}
              <div className='relative h-9 w-9 overflow-hidden rounded-full border border-white/20 bg-white/10'>
                {currentUser?.avatarUrl ? (
                  <Image
                    src={currentUser.avatarUrl}
                    alt='Your profile'
                    fill
                    unoptimized
                    className='object-cover'
                  />
                ) : (
                  <div className='flex h-full w-full items-center justify-center text-xs font-semibold text-white/70'>
                    {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
            </div>

            {/* PROFILE HEADER CONTENT */}
            <div className='space-y-5 sm:space-y-6'>
              {/* AVATAR & NAME/USERNAME */}
              <div className='flex items-center gap-4 sm:justify-between'>
                <div className='flex items-center gap-3 sm:gap-4'>
                  {/* AVATAR */}
                  <div className='relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/5 sm:h-20 sm:w-20'>
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
                      <div className='flex h-full w-full items-center justify-center text-2xl font-semibold text-white/70'>
                        {profile.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* NAME & USERNAME */}
                  <div className='min-w-0'>
                    <h1 className='truncate text-base font-bold text-white sm:text-xl'>
                      {profile.name}
                    </h1>

                    <p className='truncate text-sm text-white/60'>
                      @{profile.username.replace(/^@/, '')}
                    </p>
                  </div>
                </div>

                {/* DESKTOP ACTION BUTTONS */}
                <div className='hidden shrink-0 items-center gap-2 sm:flex'>
                  {profile.isMe ? (
                    <span className='rounded-full border border-white/15 px-5 py-2 text-xs font-semibold text-white/70'>
                      Your profile
                    </span>
                  ) : token ? (
                    <>
                      <button
                        type='button'
                        onClick={handleFollowToggle}
                        disabled={isFollowPending}
                        className={`flex items-center justify-center gap-2 rounded-full px-6 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                          profile.isFollowing
                            ? 'border border-white/20 bg-white/10 text-white hover:bg-white/15'
                            : 'bg-[#6936f2] text-white hover:bg-[#7f51f9]'
                        }`}
                      >
                        {isFollowPending ? (
                          'Wait...'
                        ) : profile.isFollowing ? (
                          <>
                            <CheckCircle2 className='h-4 w-4' />
                            Following
                          </>
                        ) : (
                          'Follow'
                        )}
                      </button>

                      <button
                        type='button'
                        aria-label='Send Message'
                        title='Send Message'
                        className='flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black text-white transition hover:bg-white/10'
                      >
                        <Send className='h-4 w-4' />
                      </button>
                    </>
                  ) : (
                    <Link
                      href='/login'
                      className='rounded-full bg-[#6936f2] px-6 py-2 text-xs font-semibold transition hover:bg-[#7f51f9]'
                    >
                      Login
                    </Link>
                  )}
                </div>
              </div>

              {/* MOBILE ACTION BUTTONS (Full Width Button) */}
              <div className='flex items-center gap-2 sm:hidden'>
                {profile.isMe ? (
                  <span className='w-full text-center rounded-full border border-white/15 py-2 text-xs font-semibold text-white/70'>
                    Your profile
                  </span>
                ) : token ? (
                  <>
                    <button
                      type='button'
                      onClick={handleFollowToggle}
                      disabled={isFollowPending}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                        profile.isFollowing
                          ? 'border border-white/20 bg-black text-white active:bg-white/10'
                          : 'bg-[#6936f2] text-white active:bg-[#7f51f9]'
                      }`}
                    >
                      {isFollowPending ? (
                        'Wait...'
                      ) : profile.isFollowing ? (
                        <>
                          <CheckCircle2 className='h-4 w-4' />
                          Following
                        </>
                      ) : (
                        'Follow'
                      )}
                    </button>

                    <button
                      type='button'
                      aria-label='Send Message'
                      className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black text-white transition active:bg-white/10'
                    >
                      <Send className='h-4 w-4' />
                    </button>
                  </>
                ) : (
                  <Link
                    href='/login'
                    className='w-full rounded-full bg-[#6936f2] py-2.5 text-center text-sm font-semibold transition hover:bg-[#7f51f9]'
                  >
                    Login
                  </Link>
                )}
              </div>

              {/* BIO */}
              {profile.bio && (
                <p className='whitespace-pre-wrap text-sm leading-relaxed text-white/90'>
                  {profile.bio}
                </p>
              )}

              {/* FOLLOW ERROR */}
              {followError && (
                <p role='alert' className='text-xs text-red-400'>
                  {followError}
                </p>
              )}

              {/* PROFILE COUNTERS */}
              <div className='grid grid-cols-4 items-center rounded-xl bg-white/3 py-4 text-center'>
                <div className='border-r border-white/10 px-1 sm:px-2'>
                  <span className='block text-base font-bold text-white sm:text-lg'>
                    {profile.counts.post}
                  </span>
                  <span className='text-[11px] text-white/50 sm:text-xs'>
                    Post
                  </span>
                </div>

                <div className='border-r border-white/10 px-1 sm:px-2'>
                  <span className='block text-base font-bold text-white sm:text-lg'>
                    {profile.counts.followers}
                  </span>
                  <span className='text-[11px] text-white/50 sm:text-xs'>
                    Followers
                  </span>
                </div>

                <div className='border-r border-white/10 px-1 sm:px-2'>
                  <span className='block text-base font-bold text-white sm:text-lg'>
                    {profile.counts.following}
                  </span>
                  <span className='text-[11px] text-white/50 sm:text-xs'>
                    Following
                  </span>
                </div>

                <div className='px-1 sm:px-2'>
                  <span className='block text-base font-bold text-white sm:text-lg'>
                    {profile.counts.likes}
                  </span>
                  <span className='text-[11px] text-white/50 sm:text-xs'>
                    Likes
                  </span>
                </div>
              </div>
            </div>

            {/* TAB NAVIGATION */}
            <div className='mt-6 flex border-b border-white/10 sm:mt-8'>
              <button
                type='button'
                onClick={() => setActiveTab('gallery')}
                aria-pressed={activeTab === 'gallery'}
                className={`flex flex-1 items-center justify-center gap-2 border-b-2 py-3 text-xs font-medium transition ${
                  activeTab === 'gallery'
                    ? 'border-white text-white'
                    : 'border-transparent text-white/40 hover:text-white/70'
                }`}
              >
                <LayoutGrid className='h-4 w-4' />
                Gallery
              </button>

              <button
                type='button'
                onClick={() => setActiveTab('liked')}
                aria-pressed={activeTab === 'liked'}
                className={`flex flex-1 items-center justify-center gap-2 border-b-2 py-3 text-xs font-medium transition ${
                  activeTab === 'liked'
                    ? 'border-white text-white'
                    : 'border-transparent text-white/40 hover:text-white/70'
                }`}
              >
                <Heart className='h-4 w-4' />
                Liked
              </button>
            </div>

            {/* GALLERY TAB */}
            {activeTab === 'gallery' && (
              <section className='pt-3 sm:pt-4'>
                {postsQuery.isPending ? (
                  <div className='py-16 text-center text-sm text-white/50'>
                    Loading posts...
                  </div>
                ) : postsQuery.isError ? (
                  <div className='space-y-4 py-12 text-center'>
                    <p className='text-sm text-white/60'>
                      Postingan gagal dimuat.
                    </p>

                    <button
                      type='button'
                      onClick={() => postsQuery.refetch()}
                      className='text-sm font-medium text-[#A78BFA] transition hover:text-white'
                    >
                      Try Again
                    </button>
                  </div>
                ) : posts.length === 0 ? (
                  <div className='py-16 text-center'>
                    <LayoutGrid className='mx-auto mb-3 h-8 w-8 text-white/20' />

                    <p className='text-sm text-white/50'>
                      Belum ada postingan.
                    </p>
                  </div>
                ) : (
                  <div className='grid grid-cols-3 gap-1 sm:gap-3'>
                    {posts.map((post) => (
                      <button
                        key={post.id}
                        type='button'
                        onClick={() => setSelectedPostId(post.id)}
                        aria-label={`Lihat postingan ${post.caption || 'tanpa caption'}`}
                        className='relative aspect-square cursor-pointer overflow-hidden rounded-md bg-white/5 text-left sm:rounded-xl'
                      >
                        <Image
                          src={post.imageUrl}
                          alt={post.caption || 'User post'}
                          fill
                          unoptimized
                          sizes='(max-width: 640px) 33vw, 300px'
                          className='object-cover transition duration-300 hover:scale-105'
                        />
                      </button>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* LIKED TAB */}
            {activeTab === 'liked' && (
              <section className='pt-3 sm:pt-4'>
                {likedPostsQuery.isPending ? (
                  <div className='py-16 text-center text-sm text-white/50'>
                    Loading liked posts...
                  </div>
                ) : likedPostsQuery.isError ? (
                  <div className='space-y-4 py-12 text-center'>
                    <p className='text-sm text-white/60'>
                      Postingan yang disukai gagal dimuat.
                    </p>

                    <button
                      type='button'
                      onClick={() => likedPostsQuery.refetch()}
                      className='text-sm font-medium text-[#A78BFA] transition hover:text-white'
                    >
                      Try Again
                    </button>
                  </div>
                ) : likedPosts.length === 0 ? (
                  <div className='py-16 text-center'>
                    <Heart className='mx-auto mb-3 h-8 w-8 text-white/20' />

                    <p className='text-sm text-white/50'>
                      Belum ada postingan yang disukai.
                    </p>
                  </div>
                ) : (
                  <div className='grid grid-cols-3 gap-1 sm:gap-3'>
                    {likedPosts.map((post) => (
                      <article
                        key={post.id}
                        className='relative aspect-square overflow-hidden rounded-md bg-white/5 sm:rounded-xl'
                      >
                        <Image
                          src={post.imageUrl}
                          alt={post.caption || 'Liked post'}
                          fill
                          unoptimized
                          sizes='(max-width: 640px) 33vw, 300px'
                          className='object-cover transition duration-300 hover:scale-105'
                        />
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </section>

      {selectedPostId !== null && (
        <PostDetailModal
          postId={selectedPostId}
          onClose={() => setSelectedPostId(null)}
        />
      )}

      <BottomNavbar />
    </main>
  );
}
