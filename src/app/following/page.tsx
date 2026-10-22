'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, LoaderCircle, Users } from 'lucide-react';

import { useMyFollowing, useToggleFollow } from '@/hooks/useFollow';

export default function FollowingPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isPending, isError, refetch } = useMyFollowing(page, limit);
  const { unfollowUser, isUnfollowing } = useToggleFollow();

  const followingData = data?.data;
  const users = followingData?.users ?? [];
  const pagination = followingData?.pagination;

  const handleUnfollow = async (username: string) => {
    try {
      await unfollowUser(username);
    } catch (error) {
      console.error('Failed to unfollow user:', error);
    }
  };

  return (
    <main className='min-h-screen bg-black text-white'>
      <div className='mx-auto w-full max-w-2xl'>
        {/* Header */}
        <header className='sticky top-0 z-10 flex items-center gap-4 border-b border-white/10 bg-black/90 px-4 py-4 backdrop-blur'>
          <button
            type='button'
            onClick={() => router.back()}
            aria-label='Go back'
            className='rounded-full p-2 transition hover:bg-white/10'
          >
            <ArrowLeft size={22} />
          </button>

          <div>
            <h1 className='text-lg font-bold'>Following</h1>
            <p className='text-sm text-white/50'>
              {users.length} accounts on this page
            </p>
          </div>
        </header>

        {/* Loading */}
        {isPending && (
          <div className='flex items-center justify-center gap-3 py-16 text-white/60'>
            <LoaderCircle className='animate-spin' size={22} />
            <span>Loading following...</span>
          </div>
        )}

        {/* Error */}
        {isError && !isPending && (
          <div className='flex flex-col items-center gap-3 px-4 py-16 text-center'>
            <p className='text-white/60'>Failed to load your following list.</p>
            <button
              type='button'
              onClick={() => refetch()}
              className='rounded-full bg-[#6936f2] px-5 py-2 text-sm font-semibold hover:bg-[#7f51f9]'
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!isPending && !isError && users.length === 0 && (
          <div className='flex flex-col items-center px-6 py-20 text-center'>
            <div className='mb-4 rounded-full bg-white/5 p-5'>
              <Users size={32} className='text-white/50' />
            </div>

            <h2 className='text-lg font-semibold'>Not following anyone yet</h2>
            <p className='mt-2 max-w-sm text-sm text-white/50'>
              When you follow people, their accounts will appear here.
            </p>
          </div>
        )}

        {/* Following list */}
        {!isPending && !isError && users.length > 0 && (
          <section aria-label='Accounts you follow'>
            {users.map((user) => (
              <article
                key={user.id}
                className='flex items-center gap-3 border-b border-white/10 px-4 py-4 transition hover:bg-white/3'
              >
                <button
                  type='button'
                  onClick={() =>
                    router.push(`/profile/${encodeURIComponent(user.username)}`)
                  }
                  aria-label={`View ${user.name}'s profile`}
                  className='relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-white/10'
                >
                  {user.avatarUrl ? (
                    <Image
                      src={user.avatarUrl}
                      alt={user.name}
                      fill
                      sizes='48px'
                      className='object-cover'
                    />
                  ) : (
                    <span className='flex h-full w-full items-center justify-center text-lg font-semibold text-white/70'>
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </button>

                <button
                  type='button'
                  onClick={() =>
                    router.push(`/profile/${encodeURIComponent(user.username)}`)
                  }
                  className='min-w-0 flex-1 text-left'
                >
                  <p className='truncate text-sm font-semibold hover:underline'>
                    {user.name}
                  </p>
                  <p className='truncate text-sm text-white/50'>
                    @{user.username}
                  </p>
                </button>

                <button
                  type='button'
                  disabled={isUnfollowing}
                  onClick={() => handleUnfollow(user.username)}
                  className='shrink-0 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold transition hover:border-red-500 hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  Following
                </button>
              </article>
            ))}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className='flex items-center justify-between gap-4 px-4 py-5'>
                <button
                  type='button'
                  disabled={page <= 1 || isPending}
                  onClick={() => setPage((current) => current - 1)}
                  className='rounded-full border border-white/20 px-4 py-2 text-sm disabled:opacity-30'
                >
                  Previous
                </button>

                <span className='text-sm text-white/50'>
                  Page {page} of {pagination.totalPages}
                </span>

                <button
                  type='button'
                  disabled={page >= pagination.totalPages || isPending}
                  onClick={() => setPage((current) => current + 1)}
                  className='rounded-full border border-white/20 px-4 py-2 text-sm disabled:opacity-30'
                >
                  Next
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
