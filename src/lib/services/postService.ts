import api from '@/lib/axios';
import type {
  ApiResponse,
  Comment,
  CommentsData,
  CreateCommentRequest,
  FeedData,
  Post,
  UserPostsData,
} from '@/types';

// ================================
// FEED
// ================================

export async function getFeed(
  page = 1,
  limit = 20
): Promise<ApiResponse<FeedData>> {
  const response = await api.get<ApiResponse<FeedData>>('/api/feed', {
    params: { page, limit },
  });

  return response.data;
}

// ================================
// POSTS
// ================================

export type PostsData = {
  posts: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export async function getPosts(
  page = 1,
  limit = 20
): Promise<ApiResponse<PostsData>> {
  const response = await api.get<ApiResponse<PostsData>>('/api/posts', {
    params: { page, limit },
  });

  return response.data;
}

export async function getUserPosts(
  username: string,
  page = 1,
  limit = 20
): Promise<ApiResponse<UserPostsData>> {
  const response = await api.get<ApiResponse<UserPostsData>>(
    `/api/users/${encodeURIComponent(username)}/posts`,
    {
      params: { page, limit },
    }
  );

  return response.data;
}

export async function getUserLikedPosts(
  username: string,
  page = 1,
  limit = 20
): Promise<ApiResponse<UserPostsData>> {
  const response = await api.get<ApiResponse<UserPostsData>>(
    `/api/users/${encodeURIComponent(username)}/likes`,
    {
      params: { page, limit },
    }
  );

  return response.data;
}

export type CreatePostRequest = {
  image: File;
  caption: string;
};

export async function createPost(
  payload: CreatePostRequest
): Promise<ApiResponse<Post>> {
  const formData = new FormData();

  formData.append('image', payload.image, payload.image.name);
  formData.append('caption', payload.caption);

  const response = await api.post<ApiResponse<Post>>('/api/posts', formData);

  return response.data;
}

export async function getPostById(postId: number): Promise<ApiResponse<Post>> {
  const response = await api.get<ApiResponse<Post>>(`/api/posts/${postId}`);

  return response.data;
}

export async function deletePost(postId: number): Promise<void> {
  await api.delete(`/api/posts/${postId}`);
}

// ================================
// SAVED POSTS
// ================================

export async function getSavedPosts(
  page = 1,
  limit = 20
): Promise<ApiResponse<PostsData>> {
  const response = await api.get<ApiResponse<PostsData>>('/api/me/saved', {
    params: { page, limit },
  });

  return response.data;
}

export async function savePost(postId: number): Promise<void> {
  await api.post(`/api/posts/${postId}/save`);
}

export async function unsavePost(postId: number): Promise<void> {
  await api.delete(`/api/posts/${postId}/save`);
}

// ================================
// COMMENTS
// ================================

export async function getPostComments(
  postId: number,
  page = 1,
  limit = 10
): Promise<ApiResponse<CommentsData>> {
  const response = await api.get<ApiResponse<CommentsData>>(
    `/api/posts/${postId}/comments`,
    {
      params: { page, limit },
    }
  );

  return response.data;
}

export async function createComment(
  postId: number,
  payload: CreateCommentRequest
): Promise<ApiResponse<Comment>> {
  const response = await api.post<ApiResponse<Comment>>(
    `/api/posts/${postId}/comments`,
    payload
  );

  return response.data;
}
