'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Bookmark,
  Heart,
  LoaderCircle,
  MessageCircle,
  MoreHorizontal,
  Send,
  Smile,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

import PostAvatar from '@/components/post/postAvatar';
import { usePostDetail } from '@/hooks/usePostDetail';
import { usePostComments } from '@/hooks/usePostComments';
import { useCreateComment } from '@/hooks/useCreateComment';
import { useDeletePost } from '@/hooks/useDeletePost';
import { useSavedPosts } from '@/hooks/useSavedPosts';
import { useToggleLikePost } from '@/hooks/useToggleLikePost';
import { useToggleSavePost } from '@/hooks/useToggleSavePost';
import { useAuthStore } from '@/store/authStore';

import type { Comment } from '@/types';

interface PostDetailModalProps {
  postId: number;
  onClose: () => void;
}

const EMOJIS = [
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
];

export default function PostDetailModal({
  postId,
  onClose,
}: PostDetailModalProps) {
  const token = useAuthStore((state) => state.token);
  const currentUser = useAuthStore((state) => state.user);

  const [text, setText] = useState('');
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  const postQuery = usePostDetail(postId);
  const commentsQuery = usePostComments(postId, 1, 10);
  const createCommentMutation = useCreateComment(postId);
  const deletePostMutation = useDeletePost();
  const { likePost, unlikePost, isLiking, isUnliking } = useToggleLikePost();
  const { data: savedData, isPending: isSavedPending } = useSavedPosts(1, 20);
  const { savePost, unsavePost, isSaving, isUnsaving } = useToggleSavePost();

  const post = postQuery.data?.data;
  const comments = commentsQuery.data?.data.comments ?? [];
  const savedPosts = savedData?.data.posts ?? [];

  const isMyPost =
    currentUser?.id !== undefined && currentUser.id === post?.author.id;

  const isSaved = savedPosts.some((savedPost) => savedPost.id === postId);
  const isLikePending = isLiking || isUnliking;
  const isSavePending = isSaving || isUnsaving;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  async function handleToggleLike() {
    if (!token || !post || isLikePending) {
      if (!token) {
        toast.error('Please log in to like posts.');
      }
      return;
    }

    try {
      if (post.likedByMe) {
        await unlikePost(post.id);
      } else {
        await likePost(post.id);
      }

      toast.success(post.likedByMe ? 'Like removed' : 'Post liked');
    } catch {
      toast.error('Unable to update like. Please try again.');
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedText = text.trim();

    if (!token) {
      toast.error('Please log in to comment.');
      return;
    }

    if (!trimmedText || createCommentMutation.isPending) {
      return;
    }

    try {
      await createCommentMutation.mutateAsync({ text: trimmedText });
      setText('');
      setIsEmojiPickerOpen(false);
      toast.success('Comment added successfully');
    } catch {
      toast.error('Unable to add comment. Please try again.');
    }
  }

  async function handleToggleSave() {
    if (!token) {
      toast.error('Please log in to save posts.');
      return;
    }

    if (isSavePending || isSavedPending) {
      return;
    }

    try {
      if (isSaved) {
        await unsavePost(postId);
        toast.success('Post removed from saved posts');
      } else {
        await savePost(postId);
        toast.success('Post saved successfully');
      }
    } catch {
      toast.error('Unable to update saved post. Please try again.');
    }
  }

  async function handleDeletePost() {
    if (!isMyPost || deletePostMutation.isPending) {
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to delete this post? This action cannot be undone.'
    );

    if (!confirmed) {
      return;
    }

    try {
      await deletePostMutation.mutateAsync(postId);
      toast.success('Post deleted successfully');
      onClose();
    } catch {
      toast.error('Unable to delete post. Please try again.');
    }
  }

  async function handleShare() {
    const postUrl = `${window.location.origin}/posts?postId=${postId}`;

    try {
      await navigator.clipboard.writeText(postUrl);
      toast.success('Post link copied');
    } catch {
      toast.error('Unable to copy the post link.');
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
        className='relative flex max-h-[90dvh] w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#0B0E14] text-white shadow-2xl'
      >
        <button
          type='button'
          onClick={onClose}
          aria-label='Close post details'
          className='absolute right-4 top-4 z-50 flex size-8 items-center justify-center rounded-full bg-black/50 text-white/80 transition hover:text-white'
        >
          <X size={20} />
        </button>

        {/* Left: post image */}
        <div className='relative hidden flex-1 items-center justify-center bg-black sm:flex'>
          {postQuery.isPending ? (
            <LoaderCircle className='animate-spin text-white/50' />
          ) : postQuery.isError || !post ? (
            <p className='p-6 text-center text-sm text-white/50'>
              Unable to load post image.
            </p>
          ) : (
            <Image
              src={post.imageUrl}
              alt={post.caption || 'Post image'}
              fill
              unoptimized
              sizes='(max-width: 1024px) 50vw, 600px'
              className='object-contain'
            />
          )}
        </div>

        {/* Right: post details and comments */}
        <div className='flex w-full min-h-0 flex-col sm:w-105 sm:shrink-0'>
          {!token ? (
            <div className='flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center'>
              <p className='text-sm text-white/60'>
                Please log in to view post details and interact with this post.
              </p>
              <Link
                href='/login'
                onClick={onClose}
                className='rounded-full bg-[#6936F2] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#7F51F9]'
              >
                Log in
              </Link>
            </div>
          ) : postQuery.isPending ? (
            <div className='flex flex-1 items-center justify-center gap-2 p-6 text-sm text-white/50'>
              <LoaderCircle size={18} className='animate-spin' />
              Loading post...
            </div>
          ) : postQuery.isError || !post ? (
            <div className='flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center'>
              <p className='text-sm text-white/60'>
                Unable to load post details.
              </p>
              <button
                type='button'
                onClick={() => postQuery.refetch()}
                className='text-sm font-medium text-[#A78BFA] hover:text-white'
              >
                Try again
              </button>
            </div>
          ) : (
            <>
              {/* Scrollable details */}
              <div className='flex min-h-0 flex-1 flex-col space-y-4 overflow-y-auto p-5'>
                {/* Author and options */}
                <div className='flex items-center justify-between pr-8'>
                  <div className='flex min-w-0 items-center gap-3'>
                    <PostAvatar
                      src={post.author.avatarUrl}
                      name={post.author.name || post.author.username}
                      size='size-8'
                    />

                    <div className='min-w-0'>
                      <Link
                        href={`/profile/${encodeURIComponent(post.author.username)}`}
                        onClick={onClose}
                        className='block truncate text-sm font-semibold text-white hover:underline'
                      >
                        {post.author.name || post.author.username}
                      </Link>
                      <p className='truncate text-[11px] text-white/40'>
                        @{post.author.username} ·{' '}
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className='relative shrink-0'>
                    <button
                      type='button'
                      onClick={() => setIsMoreMenuOpen((previous) => !previous)}
                      aria-label='More post options'
                      aria-expanded={isMoreMenuOpen}
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

                {/* Caption */}
                {post.caption && (
                  <div className='border-b border-white/10 pb-4 text-xs leading-relaxed whitespace-pre-wrap text-white/80'>
                    {post.caption}
                  </div>
                )}

                {/* Comments heading */}
                <h2 className='text-xs font-semibold text-white/90'>
                  Comments ({post.commentCount})
                </h2>

                {/* Comments list */}
                <div className='space-y-4 pr-1'>
                  {commentsQuery.isPending ? (
                    <div className='flex items-center justify-center gap-2 py-6 text-xs text-white/40'>
                      <LoaderCircle size={15} className='animate-spin' />
                      Loading comments...
                    </div>
                  ) : commentsQuery.isError ? (
                    <div className='py-6 text-center'>
                      <p className='text-xs text-red-400'>
                        Unable to load comments.
                      </p>
                      <button
                        type='button'
                        onClick={() => commentsQuery.refetch()}
                        className='mt-2 text-xs font-medium text-[#A78BFA] hover:underline'
                      >
                        Try again
                      </button>
                    </div>
                  ) : comments.length === 0 ? (
                    <p className='py-6 text-center text-xs text-white/40'>
                      No comments yet.
                    </p>
                  ) : (
                    comments.map((comment) => (
                      <CommentItem
                        key={comment.id}
                        comment={comment}
                        onClose={onClose}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Footer */}
              <footer className='shrink-0 space-y-3 border-t border-white/10 bg-[#0B0E14] p-4'>
                <div className='flex items-center justify-between text-xs font-medium text-white/80'>
                  <div className='flex items-center gap-4'>
                    <button
                      type='button'
                      onClick={handleToggleLike}
                      disabled={isLikePending}
                      aria-label={post.likedByMe ? 'Unlike post' : 'Like post'}
                      aria-pressed={post.likedByMe}
                      className='flex items-center gap-1.5 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50'
                    >
                      <Heart
                        size={18}
                        className={
                          post.likedByMe ? 'fill-pink-500 text-pink-500' : ''
                        }
                      />
                      <span>{post.likeCount}</span>
                    </button>

                    <div className='flex items-center gap-1.5'>
                      <MessageCircle size={18} />
                      <span>{post.commentCount}</span>
                    </div>

                    <button
                      type='button'
                      onClick={handleShare}
                      aria-label='Copy post link'
                      className='flex items-center gap-1.5 transition hover:text-white'
                    >
                      <Send size={16} />
                    </button>
                  </div>

                  <button
                    type='button'
                    onClick={handleToggleSave}
                    disabled={isSavePending || isSavedPending}
                    aria-label={isSaved ? 'Unsave post' : 'Save post'}
                    aria-pressed={isSaved}
                    title={isSaved ? 'Remove from saved posts' : 'Save post'}
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
                  {isEmojiPickerOpen && (
                    <div className='absolute bottom-full left-0 z-40 mb-3 grid grid-cols-6 gap-1 rounded-xl border border-white/10 bg-[#181820] p-3 shadow-xl'>
                      {EMOJIS.map((emoji) => (
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

                  <button
                    type='button'
                    onClick={() =>
                      setIsEmojiPickerOpen((previous) => !previous)
                    }
                    aria-label='Add emoji'
                    aria-expanded={isEmojiPickerOpen}
                    className='shrink-0 text-white/40 transition hover:text-white'
                  >
                    <Smile size={20} />
                  </button>

                  <div className='flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 focus-within:border-white/20'>
                    <input
                      value={text}
                      onChange={(event) => setText(event.target.value)}
                      placeholder='Add Comment'
                      maxLength={2000}
                      aria-label='Write a comment'
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
            </>
          )}
        </div>
      </section>
    </div>
  );
}

function CommentItem({
  comment,
  onClose,
}: {
  comment: Comment;
  onClose: () => void;
}) {
  return (
    <div className='flex items-start gap-3 text-xs'>
      <PostAvatar
        src={comment.author.avatarUrl}
        name={comment.author.name || comment.author.username}
        size='size-8'
      />

      <div className='min-w-0 flex-1 space-y-1'>
        <div>
          <Link
            href={`/profile/${encodeURIComponent(comment.author.username)}`}
            onClick={onClose}
            className='leading-none font-semibold text-white hover:underline'
          >
            {comment.author.name || comment.author.username}
          </Link>

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
