'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Bookmark, Heart, MessageCircle, Send } from 'lucide-react';

import PostAvatar from '@/components/post/postAvatar';
import { useToggleSavePost } from '@/hooks/useToggleSavePost';
import { useToggleLikePost } from '@/hooks/useToggleLikePost';
import type { Post } from '@/types';

type PostCardProps = {
  post: Post;
  isSaved: boolean;
  isSavedStatusPending: boolean;
  userId: number | undefined;
  onOpenComments: () => void;
};

export default function PostCard({
  post,
  isSaved,
  isSavedStatusPending,
  userId,
  onOpenComments,
}: PostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { likePost, unlikePost, isLiking, isUnliking } = useToggleLikePost();

  const isLikePending = isLiking || isUnliking;
  const isLiked = post.likedByMe;
  const [saveError, setSaveError] = useState('');

  const { savePost, unsavePost, isSaving, isUnsaving } = useToggleSavePost();

  const isSavePending = isSaving || isUnsaving;
  const captionThreshold = 80;

  const caption = post.caption ?? '';
  const isCaptionLong = caption.length > captionThreshold;

  const authorName = post.author.name || post.author.username;
  const profileHref = `/profile/${encodeURIComponent(post.author.username)}`;

  async function handleSaveToggle() {
    if (!userId || isSavePending || isSavedStatusPending) {
      return;
    }

    setSaveError('');

    try {
      if (isSaved) {
        await unsavePost(post.id);
      } else {
        await savePost(post.id);
      }
    } catch {
      setSaveError(
        isSaved
          ? 'Unable to remove saved post. Please try again.'
          : 'Unable to save post. Please try again.'
      );
    }
  }

  async function handleLikeToggle() {
    if (!userId || isLikePending) {
      return;
    }

    try {
      if (isLiked) {
        await unlikePost(post.id);
      } else {
        await likePost(post.id);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  }

  return (
    <article className='space-y-3'>
      {/* Post author */}
      <div className='flex items-center gap-3'>
        <Link
          href={profileHref}
          aria-label={`View ${authorName}'s profile`}
          className='shrink-0 rounded-full transition-opacity hover:opacity-80'
        >
          <PostAvatar src={post.author.avatarUrl} name={authorName} />
        </Link>

        <div className='min-w-0'>
          <Link
            href={profileHref}
            className='block truncate text-xs font-semibold text-white transition hover:text-[#A78BFA]'
          >
            {authorName}
          </Link>

          <p className='truncate text-[11px] text-white/40'>
            {post.createdAt
              ? new Date(post.createdAt).toLocaleDateString()
              : 'Just now'}
          </p>
        </div>
      </div>

      {/* Post image */}
      <div className='relative aspect-square w-full overflow-hidden rounded-2xl border border-white/5 bg-[#0D1017]'>
        <Image
          src={post.imageUrl}
          alt={caption || 'Post image'}
          fill
          unoptimized
          sizes='(max-width: 640px) 100vw, 576px'
          className='object-cover'
        />
      </div>

      {/* Post actions */}
      <div className='flex items-center justify-between pt-1'>
        <div className='flex items-center gap-4 text-xs font-medium text-white/80'>
          <button
            type='button'
            onClick={handleLikeToggle}
            disabled={!userId || isLikePending}
            className='flex items-center gap-1.5 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50'
            aria-label={isLiked ? 'Unlike post' : 'Like post'}
            aria-pressed={isLiked}
          >
            <Heart
              size={18}
              className={isLiked ? 'fill-red-500 text-red-500' : ''}
            />
            <span>{post.likeCount}</span>
          </button>

          <button
            type='button'
            onClick={onOpenComments}
            className='flex items-center gap-1.5 transition hover:text-white'
            aria-label='View comments'
          >
            <MessageCircle size={18} />
            <span>{post.commentCount}</span>
          </button>

          <button
            type='button'
            aria-label='Share post'
            className='flex items-center gap-1.5 transition hover:text-white'
          >
            <Send size={16} />
          </button>
        </div>

        <button
          type='button'
          onClick={handleSaveToggle}
          disabled={!userId || isSavePending || isSavedStatusPending}
          className='text-white/80 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50'
          aria-label={isSaved ? 'Unsave post' : 'Save post'}
          aria-pressed={isSaved}
        >
          <Bookmark
            size={18}
            className={isSaved ? 'fill-white text-white' : ''}
          />
        </button>
      </div>

      {/* Save error */}
      {saveError && (
        <p className='text-xs text-red-400' role='alert'>
          {saveError}
        </p>
      )}

      {/* Post caption */}
      {caption && (
        <div className='text-xs leading-relaxed text-white/90'>
          <Link
            href={profileHref}
            className='mr-1.5 font-semibold text-white transition hover:text-[#A78BFA]'
          >
            {authorName}
          </Link>

          {isCaptionLong && !isExpanded ? (
            <>
              {caption.slice(0, captionThreshold)}...
              <button
                type='button'
                onClick={() => setIsExpanded(true)}
                className='ml-1 font-semibold text-[#A78BFA] transition hover:text-white'
              >
                Show more
              </button>
            </>
          ) : (
            <span>{caption}</span>
          )}
        </div>
      )}
    </article>
  );
}
