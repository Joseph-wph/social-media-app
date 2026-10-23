'use client';

import { MessageCircle, RefreshCw } from 'lucide-react';

import PostCard from '@/components/post/postCard';
import { useSavedPosts } from '@/hooks/useSavedPosts';

import type { Post } from '@/types';

type PostFeedProps = {
  posts: Post[];
  token: string | null;
  userId: number | undefined;
  isPending: boolean;
  isError: boolean;
  onRetry: () => void;
  onOpenComments: (post: Post) => void;
};

export default function PostFeed({
  posts,
  token,
  userId,
  isPending,
  isError,
  onRetry,
  onOpenComments,
}: PostFeedProps) {
  const { data: savedData, isPending: isSavedPending } = useSavedPosts(1, 20);

  const savedPosts = token ? (savedData?.data.posts ?? []) : [];
  const savedPostIds = new Set(savedPosts.map((post) => post.id));

  return (
    <section className='mx-auto w-full max-w-xl px-4 py-6 sm:py-8'>
      {isPending ? (
        <div className='space-y-6' aria-live='polite'>
          {[1, 2].map((item) => (
            <div
              key={item}
              className='animate-pulse rounded-2xl border border-white/5 bg-[#0D1017] p-4'
            >
              <div className='flex items-center gap-3'>
                <div className='size-10 rounded-full bg-white/10' />
                <div className='space-y-2'>
                  <div className='h-3 w-28 rounded bg-white/10' />
                  <div className='h-2.5 w-16 rounded bg-white/10' />
                </div>
              </div>

              <div className='mt-4 aspect-square rounded-xl bg-white/10' />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div
          className='rounded-2xl border border-red-400/20 bg-red-400/5 px-6 py-10 text-center'
          role='alert'
        >
          <h2 className='text-lg font-semibold'>Unable to load posts</h2>

          <p className='mt-2 text-sm text-white/60'>
            Something went wrong while loading posts. Please try again.
          </p>

          <button
            type='button'
            onClick={onRetry}
            className='mt-5 inline-flex items-center gap-2 rounded-full bg-[#6C38FF] px-5 py-2.5 text-sm font-semibold transition hover:bg-[#5a2ee0]'
          >
            <RefreshCw size={16} />
            Try again
          </button>
        </div>
      ) : posts.length === 0 ? (
        <div className='rounded-2xl border border-white/10 bg-[#0D1017] px-6 py-12 text-center'>
          <div className='mx-auto flex size-12 items-center justify-center rounded-full bg-white/5'>
            <MessageCircle size={24} className='text-white/60' />
          </div>

          <h2 className='mt-4 text-base font-semibold'>
            {token ? 'Your feed is empty' : 'No public posts yet'}
          </h2>

          <p className='mx-auto mt-2 max-w-xs text-xs leading-relaxed text-white/50'>
            {token
              ? 'Follow people to see their posts here. You can discover new posts and people as you explore Sociality.'
              : 'Be among the first to join the Sociality community.'}
          </p>
        </div>
      ) : (
        <div className='space-y-8'>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              isSaved={savedPostIds.has(post.id)}
              isSavedStatusPending={token ? isSavedPending : false}
              userId={userId}
              onOpenComments={() => onOpenComments(post)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
