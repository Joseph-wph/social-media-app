'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Heart, LoaderCircle, MessageCircle, X } from 'lucide-react';

import {
  createComment,
  getPostById,
  getPostComments,
  likePost,
  unlikePost,
} from '@/lib/services/postService';
import { useAuthStore } from '@/store/authStore';

interface PostDetailModalProps {
  postId: number;
  onClose: () => void;
}

export default function PostDetailModal({
  postId,
  onClose,
}: PostDetailModalProps) {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);
  const currentUser = useAuthStore((state) => state.user);

  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState('');

  const postQuery = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPostById(postId),
    enabled: postId > 0,
  });

  const commentsQuery = useQuery({
    queryKey: ['post-comments', postId, 1, 10],
    queryFn: () => getPostComments(postId, 1, 10),
    enabled: postId > 0,
  });

  const post = postQuery.data?.data;
  const comments = commentsQuery.data?.data.comments ?? [];

  const likeMutation = useMutation({
    mutationFn: async () => {
      if (!post) {
        throw new Error('Postingan belum tersedia.');
      }

      if (post.likedByMe) {
        return unlikePost(postId);
      }

      return likePost(postId);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['post', postId],
        }),
        queryClient.invalidateQueries({ queryKey: ['feed'] }),
        queryClient.invalidateQueries({ queryKey: ['user-posts'] }),
        queryClient.invalidateQueries({
          queryKey: ['user-liked-posts'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['my-liked-posts'],
        }),
      ]);
    },
  });

  const commentMutation = useMutation({
    mutationFn: () => createComment(postId, { text: commentText.trim() }),
    onSuccess: async () => {
      setCommentText('');
      setCommentError('');

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['post-comments', postId],
        }),
        queryClient.invalidateQueries({
          queryKey: ['post', postId],
        }),
        queryClient.invalidateQueries({ queryKey: ['feed'] }),
        queryClient.invalidateQueries({
          queryKey: ['user-posts'],
        }),
      ]);
    },
    onError: () => {
      setCommentError('Komentar gagal dikirim. Silakan coba lagi.');
    },
  });

  function handleSubmitComment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      setCommentError('Login terlebih dahulu untuk berkomentar.');
      return;
    }

    if (!commentText.trim() || commentMutation.isPending) {
      return;
    }

    setCommentError('');
    commentMutation.mutate();
  }

  return (
    <div
      className='fixed inset-0 z-100 flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-6'
      onClick={onClose}
    >
      <section
        role='dialog'
        aria-modal='true'
        aria-label='Post detail'
        className='relative flex max-h-[90dvh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#111111] md:flex-row'
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type='button'
          aria-label='Close post detail'
          onClick={onClose}
          className='absolute top-3 right-3 z-20 flex size-9 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-white/20'
        >
          <X size={20} />
        </button>

        {/* Post image */}
        <div className='relative min-h-56 shrink-0 bg-black md:min-h-150 md:flex-1'>
          {postQuery.isPending ? (
            <div className='flex h-full min-h-56 items-center justify-center text-white/50'>
              <LoaderCircle className='animate-spin' />
            </div>
          ) : postQuery.isError || !post ? (
            <div className='flex min-h-56 items-center justify-center p-6 text-center text-sm text-white/60'>
              Postingan gagal dimuat.
            </div>
          ) : (
            <Image
              src={post.imageUrl}
              alt={post.caption || 'Post image'}
              fill
              unoptimized
              sizes='(max-width: 768px) 100vw, 60vw'
              className='object-contain'
            />
          )}
        </div>

        {/* Post information and comments */}
        <div className='flex min-h-0 flex-1 flex-col md:max-w-105'>
          {postQuery.isPending ? (
            <div className='flex flex-1 items-center justify-center p-6 text-sm text-white/50'>
              Loading post...
            </div>
          ) : postQuery.isError || !post ? (
            <div className='flex flex-1 flex-col items-center justify-center gap-3 p-6'>
              <p className='text-sm text-white/60'>
                Detail postingan tidak dapat dimuat.
              </p>
              <button
                type='button'
                onClick={() => postQuery.refetch()}
                className='text-sm font-medium text-[#A78BFA] hover:text-white'
              >
                Coba lagi
              </button>
            </div>
          ) : (
            <>
              {/* Author */}
              <div className='flex items-center gap-3 border-b border-white/10 p-4 pr-14'>
                <div className='relative size-10 shrink-0 overflow-hidden rounded-full bg-white/10'>
                  {post.author.avatarUrl ? (
                    <Image
                      src={post.author.avatarUrl}
                      alt={post.author.name}
                      fill
                      unoptimized
                      sizes='40px'
                      className='object-cover'
                    />
                  ) : (
                    <div className='flex h-full items-center justify-center font-semibold text-white'>
                      {post.author.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className='min-w-0'>
                  <Link
                    href={`/profile/${encodeURIComponent(post.author.username)}`}
                    onClick={onClose}
                    className='block truncate text-sm font-semibold text-white hover:underline'
                  >
                    {post.author.name}
                  </Link>
                  <p className='text-xs text-white/50'>
                    @{post.author.username}
                  </p>
                </div>
              </div>

              {/* Caption */}
              <div className='border-b border-white/10 p-4'>
                <p className='text-sm leading-relaxed whitespace-pre-wrap text-white/90'>
                  {post.caption || 'Tidak ada caption.'}
                </p>
                <p className='mt-2 text-xs text-white/40'>
                  {new Date(post.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>

              {/* Comments list */}
              <div className='min-h-0 flex-1 space-y-4 overflow-y-auto p-4'>
                <h2 className='flex items-center gap-2 text-sm font-semibold text-white'>
                  <MessageCircle size={17} />
                  Comments ({post.commentCount})
                </h2>

                {commentsQuery.isPending ? (
                  <div className='flex items-center justify-center gap-2 py-6 text-sm text-white/50'>
                    <LoaderCircle size={16} className='animate-spin' />
                    Loading comments...
                  </div>
                ) : commentsQuery.isError ? (
                  <div className='space-y-2 py-4 text-center'>
                    <p className='text-sm text-white/50'>
                      Komentar gagal dimuat.
                    </p>
                    <button
                      type='button'
                      onClick={() => commentsQuery.refetch()}
                      className='text-sm text-[#A78BFA] hover:text-white'
                    >
                      Coba lagi
                    </button>
                  </div>
                ) : comments.length === 0 ? (
                  <p className='py-6 text-center text-sm text-white/40'>
                    Belum ada komentar. Jadilah yang pertama!
                  </p>
                ) : (
                  comments.map((comment) => (
                    <article key={comment.id} className='flex gap-3'>
                      <div className='relative size-8 shrink-0 overflow-hidden rounded-full bg-white/10'>
                        {comment.author.avatarUrl ? (
                          <Image
                            src={comment.author.avatarUrl}
                            alt={comment.author.name}
                            fill
                            unoptimized
                            sizes='32px'
                            className='object-cover'
                          />
                        ) : (
                          <div className='flex h-full items-center justify-center text-xs font-semibold text-white'>
                            {comment.author.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className='min-w-0 flex-1'>
                        <p className='wrap-break-words text-sm text-white/90'>
                          <Link
                            href={`/profile/${encodeURIComponent(comment.author.username)}`}
                            onClick={onClose}
                            className='mr-2 font-semibold text-white hover:underline'
                          >
                            {comment.author.username}
                          </Link>
                          {comment.text}
                        </p>
                        <p className='mt-1 text-[11px] text-white/40'>
                          {new Date(comment.createdAt).toLocaleDateString(
                            'id-ID',
                            {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            }
                          )}
                        </p>
                      </div>
                    </article>
                  ))
                )}
              </div>

              {/* Like and comment form */}
              <div className='border-t border-white/10 p-4'>
                <div className='mb-3 flex items-center gap-2'>
                  <button
                    type='button'
                    aria-label={post.likedByMe ? 'Unlike post' : 'Like post'}
                    disabled={!token || likeMutation.isPending}
                    onClick={() => likeMutation.mutate()}
                    className='flex items-center gap-2 rounded-full py-1 text-sm transition hover:text-[#F43F5E] disabled:cursor-not-allowed disabled:opacity-50'
                  >
                    <Heart
                      size={23}
                      className={
                        post.likedByMe
                          ? 'fill-[#F43F5E] text-[#F43F5E]'
                          : 'text-white'
                      }
                    />
                    <span className='text-white'>{post.likeCount}</span>
                  </button>

                  <span className='text-xs text-white/40'>
                    {post.commentCount} comments
                  </span>
                </div>

                {likeMutation.isError && (
                  <p role='alert' className='mb-2 text-xs text-red-400'>
                    Like gagal diperbarui. Silakan coba lagi.
                  </p>
                )}

                {!token ? (
                  <p className='text-sm text-white/50'>
                    <Link
                      href='/login'
                      onClick={onClose}
                      className='font-semibold text-[#A78BFA] hover:underline'
                    >
                      Login
                    </Link>{' '}
                    untuk like dan berkomentar.
                  </p>
                ) : (
                  <form onSubmit={handleSubmitComment} className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <div className='relative size-8 shrink-0 overflow-hidden rounded-full bg-white/10'>
                        {currentUser?.avatarUrl ? (
                          <Image
                            src={currentUser.avatarUrl}
                            alt={currentUser.name}
                            fill
                            unoptimized
                            sizes='32px'
                            className='object-cover'
                          />
                        ) : (
                          <div className='flex h-full items-center justify-center text-xs font-semibold text-white'>
                            {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        )}
                      </div>

                      <input
                        type='text'
                        value={commentText}
                        onChange={(event) => setCommentText(event.target.value)}
                        placeholder='Tulis komentar...'
                        maxLength={1000}
                        aria-label='Write a comment'
                        className='h-10 min-w-0 flex-1 rounded-full border border-white/10 bg-black px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#7F51F9]'
                      />

                      <button
                        type='submit'
                        disabled={
                          !commentText.trim() || commentMutation.isPending
                        }
                        className='shrink-0 rounded-full bg-[#6936F2] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#7F51F9] disabled:cursor-not-allowed disabled:opacity-50'
                      >
                        {commentMutation.isPending ? 'Sending...' : 'Send'}
                      </button>
                    </div>

                    {commentError && (
                      <p role='alert' className='text-xs text-red-400'>
                        {commentError}
                      </p>
                    )}
                  </form>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
