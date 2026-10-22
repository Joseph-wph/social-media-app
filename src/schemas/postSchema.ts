import { z } from 'zod';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const postSchema = z.object({
  image: z
    .file()
    .min(1, 'Please select an image.')
    .max(MAX_IMAGE_SIZE, 'Image size must not exceed 5 MB.')
    .refine(
      (file) => ALLOWED_IMAGE_TYPES.includes(file.type),
      'Only JPG, PNG, and WEBP images are allowed.'
    ),

  caption: z.string(),
});

export type PostFormValues = z.infer<typeof postSchema>;
