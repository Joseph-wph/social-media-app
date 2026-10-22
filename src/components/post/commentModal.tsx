'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
  Smile,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

import PostAvatar from '@/components/post/postAvatar';
import { usePostComments } from '@/hooks/usePostComments';
import { useCreateComment } from '@/hooks/useCreateComment';
import { useDeletePost } from '@/hooks/useDeletePost';
import { useSavedPosts } from '@/hooks/useSavedPosts';
import { useToggleSavePost } from '@/hooks/useToggleSavePost';

import type { Comment, Post } from '@/types';

type CommentModalProps = {
  post: Post;
  userId: number | undefined;
  onClose: () => void;
};

export default function CommentModal({
  post,
  userId,
  onClose,
}: CommentModalProps) {
  const [text, setText] = useState('');
  const [isLiked, setIsLiked] = useState(post.likedByMe);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  const { data, isPending, isError, refetch } = usePostComments(post.id);
  const createCommentMutation = useCreateComment(post.id);
  const deletePostMutation = useDeletePost();

  const { data: savedData, isPending: isSavedPending } = useSavedPosts(1, 20);

  const { savePost, unsavePost, isSaving, isUnsaving } = useToggleSavePost();

  const comments = data?.data.comments ?? [];
  const savedPosts = savedData?.data.posts ?? [];

  const isMyPost = userId !== undefined && userId === post.author.id;
  const isSaved = savedPosts.some((savedPost) => savedPost.id === post.id);

  const isSavePending = isSaving || isUnsaving;

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedText = text.trim();

    if (!trimmedText || createCommentMutation.isPending) {
      return;
    }

    try {
      await createCommentMutation.mutateAsync({
        text: trimmedText,
      });

      setText('');
      setIsEmojiPickerOpen(false);

      toast.success('Comment added successfully');
    } catch {
      toast.error('Unable to add comment. Please try again.');
    }
  }

  async function handleDeletePost() {
    if (!isMyPost || deletePostMutation.isPending) {
      return;
    }

    if (
      !window.confirm(
        'Are you sure you want to delete this post? This action cannot be undone.'
      )
    ) {
      return;
    }

    try {
      await deletePostMutation.mutateAsync(post.id);

      toast.success('Post deleted successfully');
      onClose();
    } catch {
      toast.error('Unable to delete post. Please try again.');
    }
  }

  async function handleSaveToggle() {
    if (!userId || isSavePending || isSavedPending) {
      return;
    }

    try {
      if (isSaved) {
        await unsavePost(post.id);
        toast.success('Post removed from saved posts');
      } else {
        await savePost(post.id);
        toast.success('Post saved successfully');
      }
    } catch {
      toast.error('Unable to update saved post. Please try again.');
    }
  }

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm'
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role='dialog'
        aria-modal='true'
        aria-label='Post details'
        className='relative flex max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#0B0E14] text-white shadow-2xl'
      >
        {/* Close modal */}
        <button
          type='button'
          onClick={onClose}
          aria-label='Close comments'
          className='absolute right-4 top-4 z-50 text-white/80 transition hover:text-white'
        >
          <X size={20} />
        </button>

        {/* Post image */}
        <div className='relative hidden flex-1 bg-black sm:block'>
          <Image
            src={post.imageUrl}
            alt={post.caption || 'Post image'}
            fill
            unoptimized
            sizes='(max-width: 1024px) 50vw, 600px'
            className='object-cover'
          />
        </div>

        {/* Post details and comments */}
        <div className='flex w-full flex-col sm:w-105 sm:shrink-0'>
          {/* Scrollable content */}
          <div className='flex min-h-0 flex-1 flex-col space-y-4 overflow-y-auto p-5'>
            {/* Post author */}
            <div className='flex items-center justify-between pr-8'>
              <div className='flex min-w-0 items-center gap-3'>
                <PostAvatar
                  src={post.author.avatarUrl}
                  name={post.author.name || post.author.username}
                  size='size-8'
                />

                <div className='min-w-0'>
                  <p className='truncate text-sm font-semibold text-white'>
                    {post.author.name || post.author.username}
                  </p>

                  <p className='text-[11px] text-white/40'>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Post options */}
              <div className='relative shrink-0'>
                <button
                  type='button'
                  onClick={() => setIsMoreMenuOpen((previous) => !previous)}
                  aria-label='More post options'
                  aria-expanded={isMoreMenuOpen}
                  disabled={deletePostMutation.isPending}
                  className='p-1 text-white/60 transition hover:text-white'
                >
                  <MoreHorizontal size={20} />
                </button>

                {isMoreMenuOpen && isMyPost && (
                  <div className='absolute right-0 top-full z-40 mt-2 w-44 overflow-hidden rounded-xl border border-white/10 bg-[#181820] py-1 shadow-xl'>
                    <button
                      type='button'
                      onClick={handleDeletePost}
                      disabled={deletePostMutation.isPending}
                      className='w-full px-4 py-2.5 text-left text-xs font-medium text-red-400 hover:bg-red-500/10 disabled:opacity-50'
                    >
                      {deletePostMutation.isPending
                        ? 'Deleting...'
                        : 'Delete post'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Post caption */}
            {post.caption && (
              <div className='border-b border-white/10 pb-4 text-xs leading-relaxed text-white/80'>
                {post.caption}
              </div>
            )}

            {/* Comments heading */}
            <div>
              <h3 className='text-xs font-semibold text-white/90'>Comments</h3>
            </div>

            {/* Comments list */}
            <div className='space-y-4 pr-1'>
              {isPending ? (
                <p className='py-6 text-center text-xs text-white/40'>
                  Loading comments...
                </p>
              ) : isError ? (
                <div className='py-6 text-center'>
                  <p className='text-xs text-red-400'>
                    Unable to load comments.
                  </p>

                  <button
                    type='button'
                    onClick={() => refetch()}
                    className='mt-2 text-xs font-medium text-[#A78BFA] hover:underline'
                  >
                    Try again
                  </button>
                </div>
              ) : comments.length === 0 ? (
                <div className='py-6 text-center text-xs text-white/40'>
                  No comments yet.
                </div>
              ) : (
                comments.map((comment) => (
                  <CommentItem key={comment.id} comment={comment} />
                ))
              )}
            </div>
          </div>

          {/* Footer: actions and comment form */}
          <footer className='shrink-0 space-y-3 border-t border-white/10 bg-[#0B0E14] p-4'>
            {/* Action bar */}
            <div className='flex items-center justify-between text-xs font-medium text-white/80'>
              <div className='flex items-center gap-4'>
                {/* Like */}
                <button
                  type='button'
                  onClick={() => setIsLiked((previous) => !previous)}
                  aria-label={isLiked ? 'Unlike post' : 'Like post'}
                  className='flex items-center gap-1.5 transition hover:text-white'
                >
                  <Heart
                    size={18}
                    className={isLiked ? 'fill-pink-500 text-pink-500' : ''}
                  />

                  <span>{post.likeCount}</span>
                </button>

                {/* Comment count */}
                <div className='flex items-center gap-1.5'>
                  <MessageCircle size={18} />
                  <span>{post.commentCount}</span>
                </div>

                {/* Share */}
                <button
                  type='button'
                  aria-label='Share post'
                  className='flex items-center gap-1.5 transition hover:text-white'
                >
                  <Send size={16} />
                </button>
              </div>

              {/* Bookmark */}
              <button
                type='button'
                onClick={handleSaveToggle}
                disabled={!userId || isSavePending || isSavedPending}
                aria-label={isSaved ? 'Unsave post' : 'Save post'}
                aria-pressed={isSaved}
                title={
                  !userId
                    ? 'Log in to save posts'
                    : isSaved
                      ? 'Remove from saved posts'
                      : 'Save post'
                }
                className='text-white/80 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50'
              >
                <Bookmark
                  size={18}
                  className={isSaved ? 'fill-white text-white' : ''}
                />
              </button>
            </div>

            {/* Comment form */}
            <form
              onSubmit={handleSubmit}
              className='relative flex items-center gap-2.5'
            >
              {/* Emoji picker */}
              {isEmojiPickerOpen && (
                <div className='absolute bottom-full left-0 z-40 mb-3 grid grid-cols-6 gap-1 rounded-xl border border-white/10 bg-[#181820] p-3 shadow-xl'>
                  {[
                    '😀',
                    '😂',
                    '🥰',
                    '😍',
                    '😊',
                    '😉',
                    '🔥',
                    '❤️',
                    '👍',
                    '👏',
                    '🎉',
                    '🙏',
                    '😎',
                    '😭',
                    '🤔',
                    '💯',
                    '✨',
                    '🙌',
                  ].map((emoji) => (
                    <button
                      key={emoji}
                      type='button'
                      onClick={() => {
                        setText((previous) => previous + emoji);
                        setIsEmojiPickerOpen(false);
                      }}
                      className='flex size-8 items-center justify-center rounded-lg text-lg hover:bg-white/10'
                      aria-label={`Insert ${emoji}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              {/* Emoji button */}
              <button
                type='button'
                onClick={() => setIsEmojiPickerOpen((previous) => !previous)}
                aria-label='Add emoji'
                aria-expanded={isEmojiPickerOpen}
                className='shrink-0 text-white/40 transition hover:text-white'
              >
                <Smile size={20} />
              </button>

              {/* Comment input */}
              <div className='flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 focus-within:border-white/20'>
                <input
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  placeholder='Add Comment'
                  maxLength={2000}
                  className='w-full min-w-0 bg-transparent text-xs text-white outline-none placeholder:text-white/30'
                />

                <button
                  type='submit'
                  disabled={!text.trim() || createCommentMutation.isPending}
                  className='shrink-0 text-xs font-semibold text-white/80 transition hover:text-white disabled:opacity-30'
                >
                  {createCommentMutation.isPending ? 'Posting...' : 'Post'}
                </button>
              </div>
            </form>
          </footer>
        </div>
      </section>
    </div>
  );
}

function CommentItem({ comment }: { comment: Comment }) {
  return (
    <div className='flex items-start gap-3 text-xs'>
      <PostAvatar
        src={comment.author.avatarUrl}
        name={comment.author.name || comment.author.username}
        size='size-8'
      />

      <div className='min-w-0 flex-1 space-y-1'>
        <div>
          <p className='leading-none font-semibold text-white'>
            {comment.author.name || comment.author.username}
          </p>

          <p className='mt-0.5 text-[10px] text-white/40'>
            {new Date(comment.createdAt).toLocaleDateString()}
            {comment.isMine ? ' · You' : ''}
          </p>
        </div>

        <p className='wrap-break-words leading-relaxed text-white/80'>
          {comment.text}
        </p>
      </div>
    </div>
  );
}
