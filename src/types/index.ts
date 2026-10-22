/* ================================
   USER
================================ */

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  avatarUrl?: string | null;
  phone?: string;
  bio?: string | null;
};

/* ================================
   AUTH REQUEST
================================ */

export type RegisterRequest = {
  name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

/* ================================
   AUTH RESPONSE
================================ */

export type AuthUser = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
};

export type AuthData = {
  token: string;
  user: AuthUser;
};

/* ================================
   PROFILE
================================ */

export type MyProfile = {
  profile: {
    id: number;
    name: string;
    username: string;
    email: string;
    phone: string;
    bio: string | null;
    avatarUrl: string | null;
    createdAt: string;
  };
  stats: {
    posts: number;
    followers: number;
    following: number;
    likes: number;
  };
};

export type UpdateMyProfileRequest = {
  name?: string;
  email?: string;
  username?: string;
  phone?: string;
  bio?: string;
  avatar?: File;
  avatarUrl?: string;
};

export type PublicProfile = {
  id: number;
  name: string;
  username: string;
  bio: string | null;
  avatarUrl: string | null;
};

/* ================================
   POSTS
================================ */

export type PostAuthor = {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
};

export type Post = {
  id: number;
  imageUrl: string;
  caption: string;
  createdAt: string;
  author: PostAuthor;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
};

/* ================================
   PAGINATION
================================ */

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

/* ================================
   FEED RESPONSE DATA
================================ */

export type FeedData = {
  items: Post[];
  pagination: Pagination;
};

/* ================================
   EXPLORE RESPONSE DATA
================================ */

export type ExplorePostsData = {
  posts: Post[];
  pagination: Pagination;
};

/* ================================
   API RESPONSE
================================ */

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};
