'use client';

import { useState, type FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Bookmark,
  Heart,
  LoaderCircle,
  MessageCircle,
  MoreHorizontal,
  Send,
  Trash2,
  UserRound,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

import { useAuthStore } from '@/store/authStore';
import { usePostDetail } from '@/hooks/usePostDetail';
import { usePostComments } from '@/hooks/usePostComments';
import { useCreateComment } from '@/hooks/useCreateComment';
import { useDeletePost } from '@/hooks/useDeletePost';

function formatDate(date: string) {
  return new Date(date).toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function Avatar({
  src,
  name,
}: {
  src: string | null | undefined;
  name: string;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={40}
        height={40}
        unoptimized
        className='size-10 shrink-0 rounded-full object-cover'
      />
    );
  }

  return (
    <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-[#6936F2] text-sm font-semibold text-white'>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export default function PostDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const postId = Number(params.id);
  const isValidPostId = Number.isInteger(postId) && postId > 0;

  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  const [commentText, setCommentText] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    data: postResponse,
    isPending: isPostPending,
    isError: isPostError,
    refetch: refetchPost,
  } = usePostDetail(postId);

  const {
    data: commentsResponse,
    isPending: areCommentsPending,
    isError: areCommentsError,
    refetch: refetchComments,
  } = usePostComments(postId);

  const createCommentMutation = useCreateComment(postId);
  const deletePostMutation = useDeletePost();

  const post = postResponse?.data;
  const comments = commentsResponse?.data.comments ?? [];

  const isPostOwner = Boolean(user && post && user.id === post.author.id);

  async function handleSubmitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const text = commentText.trim();

    if (!text || createCommentMutation.isPending) {
      return;
    }

    try {
      await createCommentMutation.mutateAsync({ text });
      setCommentText('');
      toast.success('Comment added successfully.');
    } catch {
      toast.error('Failed to add comment. Please try again.');
    }
  }

  async function handleDeletePost() {
    try {
      await deletePostMutation.mutateAsync(postId);
      setIsDeleteDialogOpen(false);
      toast.success('Post deleted successfully.');
      router.replace('/');
      router.refresh();
    } catch {
      toast.error('Failed to delete post. Please try again.');
    }
  }

  if (!isValidPostId) {
    return (
      <main className='min-h-screen bg-black px-4 py-16 text-center text-white'>
        <h1 className='text-xl font-semibold'>Invalid post</h1>
        <p className='mt-2 text-sm text-white/50'>The post ID is not valid.</p>
        <Link
          href='/'
          className='mt-6 inline-flex rounded-full bg-[#6936F2] px-5 py-3 text-sm font-semibold'
        >
          Back to Home
        </Link>
      </main>
    );
  }

  if (!token) {
    return (
      <main className='flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center text-white'>
        <UserRound size={36} className='text-white/50' />
        <h1 className='mt-4 text-xl font-semibold'>Login required</h1>
        <p className='mt-2 text-sm text-white/50'>
          Please log in to view this post and its comments.
        </p>
        <Link
          href='/login'
          className='mt-6 rounded-full bg-[#6936F2] px-6 py-3 text-sm font-semibold'
        >
          Log in
        </Link>
      </main>
    );
  }

  return (
    <main className='min-h-screen bg-black pb-24 text-white'>
      <div className='mx-auto w-full max-w-2xl px-4 sm:px-6'>
        <header className='sticky top-0 z-20 -mx-4 flex items-center gap-4 border-b border-white/10 bg-black/90 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6'>
          <button
            type='button'
            onClick={() => router.back()}
            aria-label='Go back'
            className='rounded-full p-2 transition hover:bg-white/10'
          >
            <ArrowLeft size={22} />
          </button>

          <div className='flex-1'>
            <h1 className='text-lg font-semibold'>Post</h1>
            <p className='text-xs text-white/50'>Post details and comments</p>
          </div>

          {isPostOwner && (
            <div className='relative'>
              <button
                type='button'
                aria-label='Post options'
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen((open) => !open)}
                className='rounded-full p-2 transition hover:bg-white/10'
              >
                <MoreHorizontal size={24} />
              </button>

              {isMenuOpen && (
                <div className='absolute right-0 top-12 z-30 w-48 overflow-hidden rounded-xl border border-white/10 bg-zinc-900 p-1 shadow-xl'>
                  <button
                    type='button'
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsDeleteDialogOpen(true);
                    }}
                    className='flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium text-red-400 transition hover:bg-red-500/10'
                  >
                    <Trash2 size={17} />
                    Delete post
                  </button>
                </div>
              )}
            </div>
          )}
        </header>

        {isPostPending ? (
          <div className='flex min-h-80 items-center justify-center'>
            <LoaderCircle size={28} className='animate-spin text-white/60' />
          </div>
        ) : isPostError || !post ? (
          <div className='py-20 text-center'>
            <p className='text-sm text-white/60'>Unable to load this post.</p>
            <button
              type='button'
              onClick={() => refetchPost()}
              className='mt-4 rounded-full bg-[#6936F2] px-5 py-2.5 text-sm font-semibold'
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            <article className='border-b border-white/10 py-5'>
              <div className='mb-4 flex items-center gap-3'>
                <Avatar src={post.author.avatarUrl} name={post.author.name} />

                <div className='min-w-0 flex-1'>
                  <p className='truncate text-sm font-semibold'>
                    {post.author.name}
                  </p>
                  <p className='truncate text-xs text-white/50'>
                    @{post.author.username} · {formatDate(post.createdAt)}
                  </p>
                </div>
              </div>

              <div className='relative aspect-square overflow-hidden rounded-xl bg-zinc-900'>
                <Image
                  src={post.imageUrl}
                  alt={post.caption || 'Post image'}
                  fill
                  unoptimized
                  sizes='(max-width: 672px) 100vw, 640px'
                  className='object-contain'
                />
              </div>

              {post.caption && (
                <p className='mt-4 whitespace-pre-wrap wrap-break-words text-sm leading-relaxed text-white/90'>
                  <span className='mr-2 font-semibold'>
                    {post.author.username}
                  </span>
                  {post.caption}
                </p>
              )}

              <div className='mt-4 flex items-center gap-5 text-white/80'>
                <div className='flex items-center gap-2'>
                  <Heart size={19} />
                  <span className='text-xs'>{post.likeCount}</span>
                </div>

                <div className='flex items-center gap-2'>
                  <MessageCircle size={19} />
                  <span className='text-xs'>{post.commentCount}</span>
                </div>

                <div className='ml-auto'>
                  <Bookmark size={19} />
                </div>
              </div>
            </article>

            <section className='py-5'>
              <h2 className='mb-5 text-base font-semibold'>
                Comments
                <span className='ml-2 text-sm font-normal text-white/50'>
                  {commentsResponse?.data.pagination.total ?? post.commentCount}
                </span>
              </h2>

              {areCommentsPending ? (
                <div className='flex justify-center py-10'>
                  <LoaderCircle
                    size={24}
                    className='animate-spin text-white/60'
                  />
                </div>
              ) : areCommentsError ? (
                <div className='py-8 text-center'>
                  <p className='text-sm text-white/50'>
                    Unable to load comments.
                  </p>
                  <button
                    type='button'
                    onClick={() => refetchComments()}
                    className='mt-3 text-sm font-medium text-[#A78BFA]'
                  >
                    Try again
                  </button>
                </div>
              ) : comments.length === 0 ? (
                <div className='py-10 text-center'>
                  <MessageCircle size={28} className='mx-auto text-white/30' />
                  <p className='mt-3 text-sm text-white/60'>No comments yet.</p>
                  <p className='mt-1 text-xs text-white/40'>
                    Be the first to comment on this post.
                  </p>
                </div>
              ) : (
                <div className='space-y-5'>
                  {comments.map((comment) => (
                    <article
                      key={comment.id}
                      className='flex items-start gap-3'
                    >
                      <Avatar
                        src={comment.author.avatarUrl}
                        name={comment.author.name}
                      />

                      <div className='min-w-0 flex-1'>
                        <div className='flex flex-wrap items-center gap-x-2 gap-y-1'>
                          <span className='text-sm font-semibold'>
                            {comment.author.name}
                          </span>
                          <span className='text-xs text-white/40'>
                            @{comment.author.username}
                          </span>
                        </div>

                        <p className='mt-1 whitespace-pre-wrap wrap-break-words text-sm leading-relaxed text-white/80'>
                          {comment.text}
                        </p>

                        <time
                          dateTime={comment.createdAt}
                          className='mt-2 block text-xs text-white/40'
                        >
                          {formatDate(comment.createdAt)}
                        </time>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              <form
                onSubmit={handleSubmitComment}
                className='mt-6 flex items-end gap-3 border-t border-white/10 pt-5'
              >
                <div className='min-w-0 flex-1'>
                  <label
                    htmlFor='comment'
                    className='mb-2 block text-xs text-white/50'
                  >
                    Add a comment
                  </label>
                  <textarea
                    id='comment'
                    value={commentText}
                    onChange={(event) => setCommentText(event.target.value)}
                    placeholder='Write something...'
                    rows={2}
                    maxLength={2000}
                    disabled={createCommentMutation.isPending}
                    className='w-full resize-y rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#6936F2] disabled:opacity-50'
                  />
                </div>

                <button
                  type='submit'
                  disabled={
                    !commentText.trim() || createCommentMutation.isPending
                  }
                  aria-label='Send comment'
                  className='mb-0.5 flex size-11 shrink-0 items-center justify-center rounded-full bg-[#6936F2] transition hover:bg-[#7F51F9] disabled:cursor-not-allowed disabled:opacity-40'
                >
                  {createCommentMutation.isPending ? (
                    <LoaderCircle size={18} className='animate-spin' />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </form>
            </section>
          </>
        )}
      </div>

      {isDeleteDialogOpen && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-5 backdrop-blur-sm'
          onClick={() => {
            if (!deletePostMutation.isPending) {
              setIsDeleteDialogOpen(false);
            }
          }}
        >
          <section
            role='alertdialog'
            aria-modal='true'
            aria-labelledby='delete-post-title'
            aria-describedby='delete-post-description'
            className='w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl'
            onClick={(event) => event.stopPropagation()}
          >
            <div className='flex items-start justify-between gap-4'>
              <div className='flex size-11 items-center justify-center rounded-full bg-red-500/10'>
                <Trash2 size={21} className='text-red-400' />
              </div>

              <button
                type='button'
                disabled={deletePostMutation.isPending}
                onClick={() => setIsDeleteDialogOpen(false)}
                aria-label='Close dialog'
                className='rounded-full p-1 text-white/50 hover:bg-white/10 hover:text-white disabled:opacity-40'
              >
                <X size={20} />
              </button>
            </div>

            <h2 id='delete-post-title' className='mt-5 text-lg font-semibold'>
              Delete this post?
            </h2>

            <p
              id='delete-post-description'
              className='mt-2 text-sm leading-relaxed text-white/60'
            >
              This action cannot be undone. Are you sure you want to delete this
              post?
            </p>

            <div className='mt-6 flex gap-3'>
              <button
                type='button'
                disabled={deletePostMutation.isPending}
                onClick={() => setIsDeleteDialogOpen(false)}
                className='flex-1 rounded-full border border-white/15 px-4 py-3 text-sm font-semibold transition hover:bg-white/5 disabled:opacity-50'
              >
                Cancel
              </button>

              <button
                type='button'
                disabled={deletePostMutation.isPending}
                onClick={handleDeletePost}
                className='flex flex-1 items-center justify-center gap-2 rounded-full bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-50'
              >
                {deletePostMutation.isPending && (
                  <LoaderCircle size={16} className='animate-spin' />
                )}
                Delete
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
