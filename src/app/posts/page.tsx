'use client';

import { useState } from 'react';
import Link from 'next/link';

import { usePosts } from '@/hooks/usePosts';
import { useSavedPosts } from '@/hooks/useSavedPosts';
import { useAuthStore } from '@/store/authStore';

import PostCard from '@/components/post/postCard';
import PostDetailModal from '@/components/post/postDetailModal';

import type { Post } from '@/types';

export default function ExplorePage() {
  const userId = useAuthStore((state) => state.user?.id);

  const { data, isPending, isError, refetch } = usePosts();
  const { data: savedData, isPending: isSavedStatusPending } = useSavedPosts(
    1,
    20
  );

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const posts = data?.data.posts ?? [];

  const savedPostIds = new Set(
    savedData?.data.posts.map((post) => post.id) ?? []
  );

  return (
    <main className='min-h-screen bg-black pb-24 text-white'>
      <div className='mx-auto w-full max-w-2xl px-4 py-6'>
        <header className='mb-8'>
          <h1 className='text-2xl font-bold'>Explore</h1>
          <p className='mt-2 text-sm text-zinc-400'>
            Discover posts from the Sociality community.
          </p>
        </header>

        {isPending && (
          <p className='py-16 text-center text-sm text-zinc-400'>
            Loading posts...
          </p>
        )}

        {isError && (
          <div className='rounded-xl border border-white/10 p-6 text-center'>
            <p className='text-sm text-zinc-300'>
              Failed to load posts. Please try again.
            </p>
            <button
              type='button'
              onClick={() => refetch()}
              className='mt-4 rounded-lg bg-[#6936F2] px-4 py-2 text-sm font-semibold hover:bg-[#7f51f9]'
            >
              Try again
            </button>
          </div>
        )}

        {!isPending && !isError && posts.length === 0 && (
          <div className='rounded-xl border border-white/10 px-6 py-16 text-center'>
            <h2 className='text-lg font-semibold'>No posts yet</h2>
            <p className='mt-2 text-sm text-zinc-400'>
              There are no posts to explore right now.
            </p>
          </div>
        )}

        {!isPending && !isError && posts.length > 0 && (
          <div className='space-y-6'>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                isSaved={savedPostIds.has(post.id)}
                isSavedStatusPending={isSavedStatusPending}
                userId={userId}
                onOpenComments={() => setSelectedPost(post)}
              />
            ))}
          </div>
        )}

        <div className='mt-8 text-center'>
          <Link
            href='/'
            className='text-sm text-zinc-400 transition hover:text-white'
          >
            Back to Home
          </Link>
        </div>
      </div>

      {selectedPost && (
        <PostDetailModal
          postId={selectedPost.id}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </main>
  );
}
