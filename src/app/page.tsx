'use client';

import { useState } from 'react';

import Navbar from '@/components/layout/navbar';
import BottomNavbar from '@/components/layout/bottomNavbar';
import PostFeed from '@/components/post/postFeed';
import CommentModal from '@/components/post/commentModal';

import { useFeed } from '@/hooks/useFeed';
import { useAuthStore } from '@/store/authStore';

import type { Post } from '@/types';

export default function Home() {
  const token = useAuthStore((state) => state.token);
  const userId = useAuthStore((state) => state.user?.id);

  const { data, isPending, isError, refetch } = useFeed();

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const posts = data?.data.items ?? [];

  return (
    <main className='min-h-screen bg-black pb-24 text-white'>
      <Navbar />

      <PostFeed
        posts={posts}
        token={token}
        userId={userId}
        isPending={isPending}
        isError={isError}
        onRetry={() => refetch()}
        onOpenComments={setSelectedPost}
      />

      <BottomNavbar />

      {selectedPost && (
        <CommentModal
          key={selectedPost.id}
          post={selectedPost}
          userId={userId}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </main>
  );
}
