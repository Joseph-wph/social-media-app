'use client';

import Link from 'next/link';
import { Heart, MessageCircle, RefreshCw } from 'lucide-react';

import Navbar from '@/components/layout/navbar';
import { useFeed } from '@/hooks/useFeed';
import { useAuthStore } from '@/store/authStore';

export default function Home() {
  const token = useAuthStore((state) => state.token);
  const { data, isPending, isError, refetch } = useFeed();

  const posts = data?.data.items ?? [];

  return (
    <main className='min-h-screen bg-black text-[#F6F9FE]'>
      <Navbar />

      <section className='mx-auto w-full max-w-2xl px-4 py-8 sm:py-10'>
        <div className='mb-8'>
          <h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>
            Home
          </h1>
          <p className='mt-2 text-sm text-white/60'>
            Connect, share, and discover with your community.
          </p>
        </div>

        {!token ? (
          <div className='rounded-2xl border border-white/10 bg-white/3 px-6 py-12 text-center'>
            <h2 className='text-lg font-semibold'>Welcome to Sociality</h2>

            <p className='mx-auto mt-3 max-w-sm text-sm leading-6 text-white/60'>
              Sign in to see your feed and connect with your community.
            </p>

            <div className='mt-6 flex justify-center gap-3'>
              <Link
                href='/login'
                className='rounded-full bg-[#6936F2] px-5 py-2.5 text-sm font-semibold transition hover:bg-[#7F51F9]'
              >
                Log in
              </Link>

              <Link
                href='/register'
                className='rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold transition hover:bg-white/10'
              >
                Create account
              </Link>
            </div>
          </div>
        ) : isPending ? (
          <div className='space-y-4' aria-live='polite'>
            {[1, 2].map((item) => (
              <div
                key={item}
                className='animate-pulse rounded-2xl border border-white/10 p-4'
              >
                <div className='flex items-center gap-3'>
                  <div className='size-10 rounded-full bg-white/10' />
                  <div className='space-y-2'>
                    <div className='h-3 w-28 rounded bg-white/10' />
                    <div className='h-3 w-20 rounded bg-white/10' />
                  </div>
                </div>

                <div className='mt-4 aspect-square rounded-xl bg-white/10' />
                <div className='mt-4 h-3 w-3/4 rounded bg-white/10' />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div
            className='rounded-2xl border border-red-400/20 bg-red-400/5 px-6 py-10 text-center'
            role='alert'
          >
            <h2 className='text-lg font-semibold'>Unable to load your feed</h2>

            <p className='mt-2 text-sm text-white/60'>
              Something went wrong while loading posts. Please try again.
            </p>

            <button
              type='button'
              onClick={() => refetch()}
              className='mt-5 inline-flex items-center gap-2 rounded-full bg-[#6936F2] px-5 py-2.5 text-sm font-semibold transition hover:bg-[#7F51F9]'
            >
              <RefreshCw size={16} />
              Try again
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className='rounded-2xl border border-white/10 bg-white/3 px-6 py-12 text-center'>
            <div className='mx-auto flex size-14 items-center justify-center rounded-full bg-white/6'>
              <MessageCircle size={26} className='text-white/60' />
            </div>

            <h2 className='mt-5 text-lg font-semibold'>Your feed is empty</h2>

            <p className='mx-auto mt-2 max-w-sm text-sm leading-6 text-white/60'>
              Follow people to see their posts here. You can discover new posts
              and people as you explore Sociality.
            </p>
          </div>
        ) : (
          <div className='space-y-5'>
            {posts.map((post) => (
              <article
                key={post.id}
                className='overflow-hidden rounded-2xl border border-white/10 bg-white/2'
              >
                <div className='flex items-center gap-3 p-4'>
                  {post.author.avatarUrl ? (
                    <img
                      src={post.author.avatarUrl}
                      alt={`${post.author.name}'s avatar`}
                      className='size-10 rounded-full object-cover'
                    />
                  ) : (
                    <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-[#6936F2] text-sm font-semibold'>
                      {post.author.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className='min-w-0'>
                    <p className='truncate text-sm font-semibold'>
                      {post.author.name}
                    </p>
                    <p className='truncate text-xs text-white/50'>
                      @{post.author.username}
                    </p>
                  </div>
                </div>

                <img
                  src={post.imageUrl}
                  alt={post.caption || `Post by ${post.author.username}`}
                  className='block max-h-160 w-full bg-white/3 object-contain'
                />

                <div className='p-4'>
                  <div className='flex items-center gap-5'>
                    <div className='flex items-center gap-2 text-sm text-white/70'>
                      <Heart size={19} />
                      <span>{post.likeCount}</span>
                    </div>

                    <div className='flex items-center gap-2 text-sm text-white/70'>
                      <MessageCircle size={19} />
                      <span>{post.commentCount}</span>
                    </div>
                  </div>

                  {post.caption && (
                    <p className='mt-3 whitespace-pre-wrap wrap-break-words text-sm leading-6'>
                      {post.caption}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
