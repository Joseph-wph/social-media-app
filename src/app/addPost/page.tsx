'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { ArrowLeft, LoaderCircle, Upload, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/navbar';
import Container from '@/components/layout/container';
import { useCreatePost } from '@/hooks/useCreatePost';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function AddPostPage() {
  const router = useRouter();
  const createPostMutation = useCreatePost();

  const [image, setImage] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [captionError, setCaptionError] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState('');

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setImageError('');

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setImageError('Only JPG, PNG, and WEBP images are allowed.');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImageError('Image size must not exceed 5 MB.');
      event.target.value = '';
      return;
    }

    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function handleRemoveImage() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setImage(null);
    setPreviewUrl(null);
    setImageError('');
  }

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    let hasError = false;

    if (!image) {
      setImageError('Please select an image.');
      hasError = true;
    }

    if (!caption.trim()) {
      setCaptionError('Caption is required.');
      hasError = true;
    } else {
      setCaptionError('');
    }

    if (hasError) return;

    createPostMutation.mutate(
      { image: image!, caption },
      {
        onSuccess: () => {
          router.push('/');
        },
      }
    );
  }

  const isSubmitting = createPostMutation.isPending;

  return (
    <main className='min-h-screen bg-black text-white'>
      <Navbar />

      <Container>
        <section className='mx-auto w-full max-w-xl px-4 py-8 sm:py-12'>
          {/* Header */}
          <div className='mb-6 flex items-center gap-3'>
            <Link
              href='/'
              className='text-white/80 transition hover:text-white'
            >
              <ArrowLeft size={22} />
            </Link>
            <h1 className='text-xl font-bold tracking-tight sm:text-2xl'>
              Add Post
            </h1>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Photo Section */}
            <div>
              <label className='mb-2 block text-xs font-semibold text-white/90'>
                Photo
              </label>

              {previewUrl ? (
                <div className='relative overflow-hidden rounded-2xl border border-white/10 bg-[#0D1017]'>
                  <div className='relative aspect-video w-full'>
                    <Image
                      src={previewUrl}
                      alt='Preview of your post'
                      fill
                      unoptimized
                      className='object-contain'
                    />
                  </div>

                  <button
                    type='button'
                    onClick={handleRemoveImage}
                    disabled={isSubmitting}
                    aria-label='Remove selected image'
                    className='absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black disabled:opacity-50'
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor='post-image'
                  className='flex h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#0D1017] px-6 text-center transition hover:border-white/20'
                >
                  <div className='mb-3 flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80'>
                    <Upload size={18} />
                  </div>

                  <p className='text-xs font-medium text-white/80'>
                    <span className='text-[#6C38FF]'>Click to upload</span> or
                    drag and drop
                  </p>
                  <p className='mt-1.5 text-[11px] text-white/40'>
                    PNG or JPG (max. 5mb)
                  </p>
                </label>
              )}

              <input
                id='post-image'
                name='image'
                type='file'
                accept='image/jpeg,image/png,image/webp'
                onChange={handleImageChange}
                disabled={isSubmitting}
                className='sr-only'
              />

              {imageError && (
                <p role='alert' className='mt-2 text-xs text-red-400'>
                  {imageError}
                </p>
              )}
            </div>

            {/* Caption Section */}
            <div>
              <label
                htmlFor='caption'
                className='mb-2 block text-xs font-semibold text-white/90'
              >
                Caption
              </label>

              <textarea
                id='caption'
                name='caption'
                value={caption}
                onChange={(event) => {
                  setCaption(event.target.value);
                  if (event.target.value.trim()) {
                    setCaptionError('');
                  }
                }}
                disabled={isSubmitting}
                placeholder='Create your caption'
                rows={4}
                className='w-full resize-none rounded-2xl border border-white/5 bg-[#0D1017] px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition focus:border-indigo-500 disabled:opacity-50'
              />

              {captionError && (
                <p role='alert' className='mt-2 text-xs text-red-400'>
                  {captionError}
                </p>
              )}
            </div>

            {/* Error Alert */}
            {createPostMutation.isError && (
              <div
                role='alert'
                className='rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-xs text-red-300'
              >
                {createPostMutation.error instanceof Error
                  ? createPostMutation.error.message
                  : 'Unable to create your post. Please try again.'}
              </div>
            )}

            {/* Submit Button */}
            <div className='pt-2'>
              <button
                type='submit'
                disabled={isSubmitting}
                className='flex w-full items-center justify-center rounded-full bg-[#6C38FF] py-3.5 text-sm font-semibold text-white transition hover:bg-[#5a2ee0] disabled:cursor-not-allowed disabled:opacity-60'
              >
                {isSubmitting ? (
                  <LoaderCircle size={18} className='animate-spin' />
                ) : (
                  'Share'
                )}
              </button>
            </div>
          </form>
        </section>
      </Container>
    </main>
  );
}
